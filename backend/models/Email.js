const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const WarmupDetailsSchema = new Schema({
  id: { type: Number, required: true },
  status: { type: String, enum: ['ACTIVE', 'INACTIVE'], default: 'INACTIVE' },
  total_sent_count: { type: Number, default: 0 },
  total_spam_count: { type: Number, default: 0 },
  warmup_reputation: { type: String, default: '100%' }
});

const EmailSchema = new Schema({
  user_logged_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  software: { type: String, required: true, default: 'smartlead.ai' },
  email_account_id: { type: Number, required: true },
  created_at: { type: Date, default: Date.now },
  updated_at: { type: Date, default: Date.now },
  user_id: { type: Number, },
  from_name: { type: String,  },
  from_email: { type: String,  },
  username: { type: String, },
  password: { type: String,  },
  imap_password: { type: String,  },
  smtp_host: { type: String,  },
  smtp_port: { type: Number,  },
  smtp_port_type: { type: String, },
  message_per_day: { type: Number,  },
  different_reply_to_address: { type: String, default: '' },
  is_different_imap_account: { type: Boolean, default: false },
  imap_username: { type: String, },
  imap_host: { type: String, },
  imap_port: { type: Number,  },
  imap_port_type: { type: String, },
  signature: { type: String, default: '' },
  custom_tracking_domain: { type: String, default: '' },
  bcc_email: { type: String, default: '' },
  is_smtp_success: { type: Boolean, default: false },
  is_imap_success: { type: Boolean, default: false },
  smtp_failure_error: { type: String, default: '' },
  imap_failure_error: { type: String, default: '' },
  type: { type: String,},
  daily_sent_count: { type: Number, default: 0 },
  client_id: { type: Number, default: null },
  warmup_details: WarmupDetailsSchema
});

const Email = mongoose.model('Email', EmailSchema);

module.exports = Email;
