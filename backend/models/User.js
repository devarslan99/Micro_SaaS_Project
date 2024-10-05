const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  subscription: {
    plan: { 
      type: String, 
      enum: ['free', 'basic'], 
      default: 'free' 
    }, // Plan types
    stripeCustomerId: { 
      type: String 
    }, // Stripe customer ID
    stripeSubscriptionId: { 
      type: String 
    }, // Stripe subscription ID
    subscriptionStatus: { 
      type: String, 
      enum: ['active', 'inactive', 'canceled', 'expired'],
      default: 'inactive' 
    }, // Active, Canceled, Expired, etc.
    currentPeriodEnd: { 
      type: Date 
    }, // When the current period ends (important for checking expiration)
  },
  date: {
    type: Date,
    default: Date.now,
  },
  softwareKeys: [
    {
      software: { type: String, required: false },
      apiKey: { type: String, required: false },
    }
  ],
});

module.exports = mongoose.model('User', UserSchema);
