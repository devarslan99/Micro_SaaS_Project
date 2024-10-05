const Stripe = require('stripe');
const stripe = Stripe(process.env.STRIPE_SECRET_KEY);
const User = require('../models/User'); // Path to your User model

// 1. Create a Subscription
exports.createSubscription = async (req, res) => {
  try {
    const { plan, email } = req.body; // Expecting plan type and email from frontend
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Create Stripe customer
    let customer;
    if (!user.stripeCustomerId) {
      customer = await stripe.customers.create({
        email: user.email,
      });
      user.stripeCustomerId = customer.id;
    } else {
      customer = await stripe.customers.retrieve(user.stripeCustomerId);
    }

    // Create the subscription
    const subscription = await stripe.subscriptions.create({
      customer: customer.id,
      items: [{ price: getPriceId(plan) }], // Helper function to get price ID
      expand: ['latest_invoice.payment_intent'],
    });

    // Save subscription details to user
    user.subscription = {
      plan,
      stripeSubscriptionId: subscription.id,
      subscriptionStatus: subscription.status,
    };
    await user.save();

    res.status(200).json({
      message: 'Subscription created successfully',
      subscription,
    });
  } catch (error) {
    console.error('Error creating subscription:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// Helper function to get the price ID based on the plan
const getPriceId = (plan) => {
  switch (plan) {
    case 'basic':
      return process.env.STRIPE_PRICE_BASIC; // Replace with actual price ID
    case 'premium':
      return process.env.STRIPE_PRICE_PREMIUM; // Replace with actual price ID
    default:
      throw new Error('Invalid plan');
  }
};

// 2. Cancel Subscription
exports.cancelSubscription = async (req, res) => {
  try {
    const user = await User.findOne({ email: req.body.email });

    if (!user || !user.subscription.stripeSubscriptionId) {
      return res.status(404).json({ message: 'Subscription not found' });
    }

    // Cancel Stripe subscription
    await stripe.subscriptions.del(user.subscription.stripeSubscriptionId);

    // Update user subscription status
    user.subscription.plan = 'free';
    user.subscription.subscriptionStatus = 'canceled';
    user.subscription.stripeSubscriptionId = null;
    await user.save();

    res.status(200).json({ message: 'Subscription canceled successfully' });
  } catch (error) {
    console.error('Error canceling subscription:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// 3. Handle Stripe Webhooks (for subscription updates)
exports.stripeWebhook = async (req, res) => {
  const sig = req.headers['stripe-signature'];

  try {
    const event = stripe.webhooks.constructEvent(
      req.rawBody, // Make sure you use raw body here
      sig,
      process.env.STRIPE_WEBHOOK_SECRET
    );

    switch (event.type) {
      case 'invoice.payment_succeeded': {
        const subscriptionId = event.data.object.subscription;
        const user = await User.findOne({ 'subscription.stripeSubscriptionId': subscriptionId });

        if (user) {
          user.subscription.subscriptionStatus = 'active';
          await user.save();
        }
        break;
      }

      case 'customer.subscription.deleted': {
        const subscriptionId = event.data.object.id;
        const user = await User.findOne({ 'subscription.stripeSubscriptionId': subscriptionId });

        if (user) {
          user.subscription.plan = 'free';
          user.subscription.subscriptionStatus = 'canceled';
          user.subscription.stripeSubscriptionId = null;
          await user.save();
        }
        break;
      }
      // Handle other Stripe events as needed
    }

    res.status(200).json({ received: true });
  } catch (error) {
    console.error('Webhook error:', error.message);
    res.status(400).send(`Webhook Error: ${error.message}`);
  }
};
