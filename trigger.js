(async () => {
    try {
       console.log("Waiting a bit for server...");
       await new Promise(r => setTimeout(r, 3000));
       
       const loginRes = await fetch('http://localhost:5000/api/auth/login', {
           method: 'POST',
           headers: { 'Content-Type': 'application/json' },
           body: JSON.stringify({ email: 'donor@bakery.com', password: 'password123' })
       });
       const { token, user } = await loginRes.json();
       
       if (!user?.id) throw new Error("Could not log in. Output: " + JSON.stringify(user));
    
       const res = await fetch('http://localhost:5000/api/donations', {
           method: 'POST',
           headers: { 
             'Content-Type': 'application/json'
           },
           body: JSON.stringify({
             donor_id: user.id,
             food_type: 'produce',
             quantity: 110,
             unit: 'kg',
             safe_until: new Date(Date.now() + 1000 * 60 * 60).toISOString(),
             pickup_location: { address: 'Trigger St, 92', lat: 40.71, lng: -74.02 }
           })
       });
       const matchData = await res.json();
       console.log("Triggered match successfully for Demo!");
       process.exit(0);
   } catch(e) {
       console.error(e);
       process.exit(1);
   }
})();
