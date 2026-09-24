const fs = require('fs');
const { notifyMatchFound } = require('./server/services/notifications');
const nodemailer = require('nodemailer');

(async () => {
    try {
        const testAccount = await nodemailer.createTestAccount();
        const transporter = nodemailer.createTransport({
          host: "smtp.ethereal.email",
          port: 587,
          secure: false, 
          auth: {
            user: testAccount.user,
            pass: testAccount.pass,
          },
        });
        
        const info = await transporter.sendMail({
            from: '"Surplus-to-Shelter" <dispatch@surplus-to-shelter.org>',
            to: `donor@bakery.com, contact@downtownshelter.org`,
            subject: "🚨 [Surplus-to-Shelter] Live Match Generated!",
            text: "We have successfully matched your 50 kg of produce.",
        });

        const url = nodemailer.getTestMessageUrl(info);
        fs.writeFileSync('url.txt', url);
        process.exit(0);
    } catch(e) {
        console.error("Failed:", e);
        process.exit(1);
    }
})();
