const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const http = require('http');
require('dotenv').config({ path: '../.env' }); 

const { initializeSocket } = require('./socket');

const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// Create HTTP server and attach Socket layer
const server = http.createServer(app);
const io = initializeSocket(server);

// Inject IO into Express to be usable in our route controllers
app.set('io', io);

// Routes
const authRoutes = require('./routes/auth');
const donationRoutes = require('./routes/donations');

app.use('/api/auth', authRoutes);
app.use('/api/donations', donationRoutes);

app.get('/', (req, res) => {
  res.send('Surplus-to-Shelter API is running');
});

if (require.main === module) {
  mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/surplus-to-shelter')
    .then(() => {
      console.log('Connected to MongoDB');
      server.listen(port, () => {
        console.log(`Server running on port ${port} with Socket.IO enabled`);
      });
    })
    .catch(err => {
      console.error('MongoDB connection error:', err);
    });
}
module.exports = { app, server };
