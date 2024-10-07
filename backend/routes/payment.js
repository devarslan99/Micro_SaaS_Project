const express = require('express');
const router = express.Router();
const User = require('../models/User'); // Assuming you have a User model
const authMiddleware = require('../middleware/authMiddleware'); // Auth middleware to protect routes
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY); // Stripe secret key

// Create a subscription
router.post('/create-subscription', authMiddleware, async (req, res) => {
  const { user, frontendPlan } = req.body; // user and plan from frontend
  console.log(frontendPlan);
  const plan = frontendPlan.toLowerCase()
  const userId = user.id;
    console.log('Create-subscription Controller entered');
    console.log('The plan is ', plan);
    console.log('The user id is ',userId);
  try {
    const user = await User.findById(userId);

    // Create Stripe customer if user doesn't already have one
    if (!user.subscription.stripeCustomerId) {
      const customer = await stripe.customers.create({
        email: user.email,
      });
      user.subscription.stripeCustomerId = customer.id;
      await user.save();
    }

    // Define price ID for the chosen plan
    let priceId;
    if (plan === 'basic') {
      priceId = 'price_1Q6XGRFvGDJipH8OGAy0x7EO'; // Replace with your actual basic plan price ID
    } else if (plan === 'premium') {
      priceId = 'price_xxxx'; // Replace with your actual premium plan price ID
    } else {
      return res.status(400).json({ error: 'Invalid plan selected' });
    }

    // Create Stripe Checkout session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      mode: 'subscription',
      customer: user.subscription.stripeCustomerId,
      line_items: [
        {
          price: priceId,
          quantity: 1,
        },
      ],
      success_url: `http://localhost:5173/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `http://localhost:5173/cancel`
    });

    // Send the session ID back to the frontend to redirect to Stripe
    res.json({ sessionId: session.id });
  } catch (error) {
    console.error('Error creating subscription:', error);
    res.status(500).json({ error: 'Subscription creation failed' });
  }
});
router.get('/verify-session', async (req, res) => {
    console.log('Verify Route Called');
    const { session_id } = req.query;
    try {
      const session = await stripe.checkout.sessions.retrieve(session_id);
  
      if (session.payment_status === 'paid') {
        return res.json({ paymentStatus: 'succeeded' });
      } else {
        return res.json({ paymentStatus: 'incomplete' });
      }
    } catch (error) {
      console.error('Error verifying session:', error);
      res.status(500).json({ error: 'Unable to verify payment session' });
    }
  });

// Get subscription status
router.post('/subscription', authMiddleware, async (req, res) => {
  const { id } = req.body.user; // user ID from frontend
  console.log("enter the subscription page" , id )
  try {
    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    console.log(user);
    res.json({
      plan: user.subscription.plan,
      subscriptionStatus: user.subscription.subscriptionStatus,
      currentPeriodEnd: user.subscription.currentPeriodEnd,
    });
  } catch (error) {
    console.error('Error fetching subscription:', error);
    res.status(500).json({ message: 'Error fetching subscription data' });
  }
});

// Cancel a subscription
router.post('/cancel-subscription', authMiddleware, async (req, res) => {
  console.log("Enter cancel subscription Controller");
  const { user } = req.body;
  const userId = user.id;
 
  try {
    const user = await User.findById(userId);

    if (!user.subscription.stripeSubscriptionId) {
      return res.status(400).json({ message: 'No active subscription found' });
    }
    console.log('The subscription id is ',user.subscription.stripeSubscriptionId );
    // Cancel the subscription on Stripe
    // await stripe.subscriptions.update(user.subscription.stripeSubscriptionId);
    const subscription = await stripe.subscriptions.cancel(
      user.subscription.stripeSubscriptionId
    );
    // const deletedSubscription = await stripe.subscriptions.del(user.subscription.stripeSubscriptionId, {
    //   at_period_end: false // Cancel the subscription immediately
    // });
    console.log('Deleted Subscription:', subscription);
    // Update user subscription details
    user.subscription.plan = 'free';
    user.subscription.subscriptionStatus = 'canceled';
    user.subscription.stripeSubscriptionId = null;
    await user.save();

    res.json({ message: 'Subscription canceled' });
  } catch (error) {
    console.error('Error canceling subscription:', error);
    res.status(500).json({ message: 'Error canceling subscription' });
  }
});

// Stripe Webhook to listen for subscription changes
router.post('/webhook', async (req, res) => {
    const event = req.body;

    console.log('Event type received:', event.type);
    
    switch (event.type) {
        case 'checkout.session.completed': {
            const session = event.data.object;
        
            // Retrieve the subscription ID from the session
            const subscriptionId = session.subscription;
            console.log('The custumerID is',session.customer);
            // Find the user in the database using the stripeCustomerId
            const user = await User.findOne({ 'subscription.stripeCustomerId': session.customer });
            if (user) {
                // Fetch the line items from Stripe
                const lineItems = await stripe.checkout.sessions.listLineItems(session.id);
        
                // Extract the plan details
                const planName = lineItems.data[0]?.description || 'unknown';
        
                // Update user subscription details
                user.subscription.stripeSubscriptionId = subscriptionId;
                user.subscription.subscriptionStatus = 'active';  // Mark subscription as active
                user.subscription.plan = planName; // Plan name from line items
        
                // Ensure current_period_end is a valid date
                await user.save();
                console.log(user);
                const currentPeriodEnd = new Date(session.current_period_end * 1000);
                if (isNaN(currentPeriodEnd.getTime())) {
                    console.error('Invalid current_period_end:', session.current_period_end);
                    return res.status(400).json({ error: 'Invalid current period end date' });
                }
                user.subscription.currentPeriodEnd = currentPeriodEnd; // Set the current period end
        
            }
            break;
        }

        case 'invoice.paid': {
            // This already handles the subscription renewal
            console.log('Invoice Paid');
            const subscriptionId = event.data.object.subscription;
            const user = await User.findOne({ 'subscription.stripeSubscriptionId': subscriptionId });
            if (user) {
                user.subscription.subscriptionStatus = 'active';
                user.subscription.currentPeriodEnd = new Date(event.data.object.lines.data[0].period.end * 1000);
                await user.save();
            }
            break;
        }

        case 'invoice.payment_failed': {
            console.log('Invoice Payment Failed');
            const subscriptionId = event.data.object.subscription;
            const user = await User.findOne({ 'subscription.stripeSubscriptionId': subscriptionId });
            if (user) {
                user.subscription.subscriptionStatus = 'canceled';
                user.subscription.plan = 'free';
                await user.save();
            }
            break;
        }

        case 'customer.subscription.deleted': {
            console.log('Subscription Deleted');
            const subscriptionId = event.data.object.id;
            const user = await User.findOne({ 'subscription.stripeSubscriptionId': subscriptionId });
            if (user) {
                user.subscription.subscriptionStatus = 'canceled';
                user.subscription.plan = 'free';
                await user.save();
            }
            break;
        }

        default:
            console.log(`Unhandled event type ${event.type}`);
    }

    res.status(200).json({ received: true });
});



module.exports = router;
