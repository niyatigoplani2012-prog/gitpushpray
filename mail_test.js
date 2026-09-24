const { notifyMatchFound } = require('./server/services/notifications');

(async () => {
    try {
        console.log("Triggering Nodemailer Ethereal Service...");
        
        const mockDonation = {
            quantity: 50,
            unit: 'kg',
            food_type: 'produce'
        };

        // This triggers the service and it will console.log the ethereal URL.
        await notifyMatchFound('donor@bakery.com', 'contact@downtownshelter.org', mockDonation);
        
        console.log("Process complete.");
        process.exit(0);
    } catch(e) {
        console.error("Failed:", e);
        process.exit(1);
    }
})();
