const axios = require('axios');
const Email = require('../models/Email'); // Assuming you already have this schema

const authenticateAndFetchEmailAccounts = async (apiKey, user, software) => {
  console.log('Fetching Emails From Database');
  const url = `https://server.smartlead.ai/api/v1/email-accounts/?api_key=${apiKey}&offset=0&limit=100`;

  try {
    // Make the HTTP request to fetch email accounts
    const response = await axios.get(url, { headers: { accept: 'application/json' } });
    const emailAccountsData = response.data;
    console.log(emailAccountsData);
    await Email.deleteMany({ user_logged_id: user.id, software: software });

    for (const account of emailAccountsData) {
      const newEmailAccount = new Email({
        user_logged_id: user.id, // Static logged-in user ID
        software: software, // Static software
        email_account_id: account.id,
        created_at: account.created_at,
        updated_at: account.updated_at,
        user_id: account.user_id,
        from_name: account.from_name,
        from_email: account.from_email,
        username: account.username,
        password: account.password,
        imap_password: account.imap_password,
        smtp_host: account.smtp_host,
        smtp_port: account.smtp_port,
        smtp_port_type: account.smtp_port_type,
        message_per_day: account.message_per_day,
        different_reply_to_address: account.different_reply_to_address || "",
        is_different_imap_account: account.is_different_imap_account || false,
        imap_username: account.imap_username,
        imap_host: account.imap_host,
        imap_port: account.imap_port,
        imap_port_type: account.imap_port_type,
        signature: account.signature || "",
        custom_tracking_domain: account.custom_tracking_domain || "",
        bcc_email: account.bcc_email || "",
        is_smtp_success: account.is_smtp_success || false,
        is_imap_success: account.is_imap_success || false,
        smtp_failure_error: account.smtp_failure_error || "",
        imap_failure_error: account.imap_failure_error || "",
        type: account.type,
        daily_sent_count: account.daily_sent_count || 0,
        client_id: account.client_id || null,
        warmup_details: account.warmup_details
      });

      // Save the new email account in the database
      await newEmailAccount.save();
    }

    return emailAccountsData;
  } catch (err) {
    console.error('Error fetching email accounts:', err.message);
    throw new Error('An error occurred while fetching email accounts');
  }
};

module.exports = {
  authenticateAndFetchEmailAccounts,
};
