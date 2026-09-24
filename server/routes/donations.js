const express = require('express');
const router = express.Router();
const Donation = require('../models/Donation');
const RecipientOrg = require('../models/RecipientOrg');
const Match = require('../models/Match');
const User = require('../models/User');
const { findBestMatch } = require('../services/matching');
const { notifyMatchFound, notifyPickup } = require('../services/notifications');

// POST /api/donations
router.post('/', async (req, res) => {
  try {
    const { donor_id, food_type, quantity, unit, safe_until, pickup_location } = req.body;
    
    // 1. Create the donation
    const donation = new Donation({
      donor_id,
      food_type,
      quantity,
      unit,
      expiry_window: { safe_until },
      pickup_location
    });
    
    await donation.save();

    // 2. Fetch all recipient orgs
    const allOrgs = await RecipientOrg.find({});

    // 3. Attempt matching
    const bestOrg = findBestMatch(donation, allOrgs);
    const io = req.app.get('io');

    if (bestOrg) {
      // 4a. Match Found
      donation.status = 'matched';
      await donation.save();

      const match = new Match({
        donation_id: donation._id,
        recipient_id: bestOrg._id,
      });
      await match.save();

      // Broadcast to scoped rooms
      if (io) {
        io.to(`user_${donor_id}`).emit('donation_status_changed', { donation, match });
        io.to(`org_${bestOrg._id}`).emit('donation_incoming_match', { donation, match });
        io.to('role_driver').emit('donation_available_pickup', { donation, match });
      }

      // Fire async email physically decoupling it from the return flow
      Promise.all([
        User.findById(donor_id),
        User.findById(bestOrg.user_id)
      ]).then(([donor, orgUser]) => {
        if (donor && orgUser) notifyMatchFound(donor.email, orgUser.email, donation);
      }).catch(console.error);

      return res.status(201).json({ 
        message: 'Donation created and matched successfully',
        donation, 
        match 
      });
    } else {
      // 4b. No Match Found - fallback to explicitly 'unmatched' state
      donation.status = 'unmatched';
      await donation.save();

      if (io) {
        io.to(`user_${donor_id}`).emit('donation_status_changed', { donation, match: null });
      }

      return res.status(201).json({ 
        message: 'Donation created but no match found (flagged for review)',
        donation 
      });
    }

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error while creating donation' });
  }
});

// PATCH /api/donations/:id/status
router.patch('/:id/status', async (req, res) => {
  try {
    const { status, driver_id } = req.body; // driver accepting it could pass driver_id via auth
    const validStatuses = ['posted', 'matched', 'picked_up', 'delivered', 'unmatched'];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ error: 'Invalid status' });
    }

    const donation = await Donation.findById(req.params.id);
    if (!donation) return res.status(404).json({ error: 'Donation not found' });

    donation.status = status;
    await donation.save();
    
    // Update match if applicable
    let match = null;
    
    // 1. Atomic Claim logic (driver accepting a matched dispatch)
    if (status === 'matched' && driver_id) {
       match = await Match.findOneAndUpdate(
         { 
           donation_id: donation._id, 
           $or: [{ driver_id: null }, { driver_id: { $exists: false } }] 
         },
         { driver_id: driver_id },
         { new: true }
       );
       
       if (!match) {
         return res.status(409).json({ error: 'Match already claimed by another driver.' });
       }
    } 
    // 2. Status Transition logic (picked_up, delivered)
    else if (['picked_up', 'delivered'].includes(status)) {
       const query = { donation_id: donation._id };
       if (driver_id) query.driver_id = driver_id; // Ensure only assigned driver updates it
       
       match = await Match.findOneAndUpdate(
         query,
         { status: status },
         { new: true }
       );
       
       if (!match) {
         return res.status(403).json({ error: 'Not authorized to transition this match or match missing.' });
       }
    } 
    // 3. Fallback read
    else {
       match = await Match.findOne({ donation_id: donation._id });
    }

    // Broadcast to scoped rooms dynamically
    const io = req.app.get('io');
    if (io) {
      // Notify donor
      io.to(`user_${donation.donor_id}`).emit('donation_status_changed', { donation, match });
      
      // Notify recipient
      if (match) {
        io.to(`org_${match.recipient_id}`).emit('donation_status_changed', { donation, match });
        
        // Notify the specific driver if assigned
        if (match.driver_id) {
          io.to(`user_${match.driver_id}`).emit('donation_status_changed', { donation, match });
        }
        
        // If it was just claimed by a driver (status still matched, but driver_id provided)
        // Broadcast a 'donation_claimed' event to the general driver pool so they can remove it
        if (status === 'matched' && driver_id) {
          io.to('role_driver').emit('donation_claimed', { matchId: match._id });
        }
      }
    }

    // Trigger async Notification if actually picked up
    if (status === 'picked_up' && match) {
      Promise.all([
        User.findById(donation.donor_id),
        RecipientOrg.findById(match.recipient_id).populate('user_id')
      ]).then(([donor, org]) => {
         if (donor && org && org.user_id) {
           notifyPickup(donor.email, org.user_id.email);
         }
      }).catch(console.error);
    }

    res.json({ message: 'Status updated', donation });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error updating status' });
  }
});

module.exports = router;
