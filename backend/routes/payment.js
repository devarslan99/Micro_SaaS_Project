const express = require('express');
const router = express.Router();
const User = require('../models/User');
const authMiddleware = require('../middleware/authMiddleware');
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const priceId = 'price_1Q6XGRFvGDJipH8OGAy0x7EO'
// Create a subscription
router.post('/create-subscription', authMiddleware,async (req, res) => {
  const { user , plan} = req.body; // priceId for the chosen plan
const userId= user.id
console.log('The user and plan is ', user , plan);
  try {
    const user = await User.findById(userId);

    // Create Stripe customer if not exists
    if (!user.subscription.stripeCustomerId) {
      const customer = await stripe.customers.create({
        email: user.email,
      });
      user.subscription.stripeCustomerId = customer.id;
      await user.save();
    }
 //PriceID for basic plan = price_1Q6XGRFvGDJipH8OGAy0x7EO
    // Create subscription
    const subscription = await stripe.subscriptions.create({
      customer: user.subscription.stripeCustomerId,
      items: [{ price: priceId }], // priceId comes from Stripe product
    });

    // Update user with subscription info
    user.subscription.stripeSubscriptionId = subscription.id;
    user.subscription.plan = req.body.plan; // 'basic' or 'premium'
    user.subscription.subscriptionStatus = subscription.status;
    user.subscription.currentPeriodEnd = new Date(subscription.current_period_end * 1000);
    await user.save();

    res.json({ message: 'Subscription created', subscription });
  } catch (error) {
    console.error('Error creating subscription:', error);
    res.status(500).json({ error: 'Subscription creation failed' });
  }
});

router.post('/subscription', authMiddleware,async (req, res) => {
    const { id } = req.body.user;
    console.log('The User id is :',id);
  const userId= id
    try {
      const user = await User.findById(userId);
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }
  
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
  

  router.post('/cancel-subscription',authMiddleware, async (req, res) => {
    const { user } = req.body;
    console.log('The use is ' , user);
  const userId= user.id
    try {
      const user = await User.findById(userId);
  
      if (!user.subscription.stripeSubscriptionId) {
        return res.status(400).json({ message: 'No active subscription found' });
      }
  
      // Cancel the subscription in Stripe
      await stripe.subscriptions.del(user.subscription.stripeSubscriptionId);
  
      // Update the user's subscription info
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

  
  //webhook 
  router.post('/webhook', express.raw({ type: 'application/json' }), async (req, res) => {
    console.log('Webhook called');
    const sig = req.headers['stripe-signature'];
    let event;
  
    try {
      event = stripe.webhooks.constructEvent(req.body, sig, process.env.STRIPE_WEBHOOK_SECRET);
    } catch (err) {
      console.log('Webhook signature verification failed.');
      return res.sendStatus(400);
    }
  
    switch (event.type) {
      case 'invoice.payment_failed':
        const subscription = event.data.object.subscription;
        const user = await User.findOne({ 'subscription.stripeSubscriptionId': subscription });
        if (user) {
          user.subscription.subscriptionStatus = 'canceled';
          user.subscription.plan = 'free';
          await user.save();
        }
        break;
      
      case 'customer.subscription.deleted':
        const deletedSub = event.data.object.id;
        const deletedUser = await User.findOne({ 'subscription.stripeSubscriptionId': deletedSub });
        if (deletedUser) {
          deletedUser.subscription.subscriptionStatus = 'canceled';
          deletedUser.subscription.plan = 'free';
          await deletedUser.save();
        }
        break;
  
      // Add other event cases like 'invoice.paid' for reactivating subscriptions
    }
  
    res.status(200).json({ received: true });
  });
  
  module.exports = router;