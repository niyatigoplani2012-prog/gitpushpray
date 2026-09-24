const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const RecipientOrg = require('../models/RecipientOrg');

const router = express.Router();

router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    
    // Find user
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }
    
    // Validate password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    // Include orgId in the token if they are a recipient
    let orgId = null;
    if (user.role === 'recipient_org') {
      const org = await RecipientOrg.findOne({ user_id: user._id });
      if (org) {
        orgId = org._id;
      }
    }
    
    // Create JWT payload
    const payload = {
      userId: user._id,
      role: user.role,
      orgId
    };
    
    // Sign token (fallback secret for dev MVP)
    const token = jwt.sign(payload, process.env.JWT_SECRET || 'hackathon_secret', { expiresIn: '1d' });
    
    return res.json({
      token,
      user: {
        id: user._id,
        name: user.name,
        role: user.role,
        orgId
      }
    });

  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Server error during login' });
  }
});

module.exports = router;
