const nodemailer = require('nodemailer');

let transporter = null;

async function initTransporter() {
  if (transporter) return transporter;

  try {
    const testAccount = await nodemailer.createTestAccount();
    transporter = nodemailer.createTransport({
      host: "smtp.ethereal.email",
      port: 587,
      secure: false, 
      auth: {
        user: testAccount.user,
        pass: testAccount.pass,
      },
    });
    console.log("Mock Email Service (Ethereal) initialized");
    return transporter;
  } catch (err) {
    console.error("Failed to initialize Ethereal. Falling back to console logging emails.");
    // Fallback stub replacing nodemailer if the service is unreachable
    transporter = {
      sendMail: async (opts) => {
        console.log("\n===== MOCK EMAIL DELIVERED =====");
        console.log("To:", opts.to);
        console.log("Subject:", opts.subject);
        console.log("Body:", opts.text);
        console.log("================================\n");
        return { messageId: 'mock-console-fallback' };
      }
    };
    return transporter;
  }
}

async function notifyMatchFound(donorEmail, orgEmail, donationDetails) {
  const mailer = await initTransporter();
  const summary = `We have successfully matched your ${donationDetails.quantity} ${donationDetails.unit} of ${donationDetails.food_type}.`;
  
  try {
    const info = await mailer.sendMail({
      from: '"Surplus-to-Shelter" <dispatch@surplus-to-shelter.org>',
      to: `${donorEmail}, ${orgEmail}`,
      subject: "🚨 [Surplus-to-Shelter] Live Match Generated!",
      text: summary,
    });

    if (info.messageId !== 'mock-console-fallback') {
       const url = nodemailer.getTestMessageUrl(info);
       if (url) {
         console.log(`Ethereal Email Preview (Match Notification): ${url}`);
       }
    }
  } catch (err) {
    console.error("Error sending match notification", err);
  }
}

async function notifyPickup(donorEmail, orgEmail) {
  const mailer = await initTransporter();
  
  try {
    const info = await mailer.sendMail({
      from: '"Surplus-to-Shelter" <dispatch@surplus-to-shelter.org>',
      to: `${donorEmail}, ${orgEmail}`,
      subject: "🚚 Driver En Route - Pickup Confirmed",
      text: "A driver has picked up the donation and is currently en route.",
    });

    if (info.messageId !== 'mock-console-fallback') {
       const url = nodemailer.getTestMessageUrl(info);
       if (url) console.log(`Ethereal Email Preview (Pickup Notification): ${url}`);
    }
  } catch (err) {
    console.error("Error sending pickup notification", err);
  }
}

module.exports = {
  notifyMatchFound,
  notifyPickup
};
