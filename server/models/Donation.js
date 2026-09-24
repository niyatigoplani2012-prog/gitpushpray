const mongoose = require('mongoose');

const donationSchema = new mongoose.Schema({
  donor_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  food_type: { type: String, required: true },
  quantity: { type: Number, required: true },
  unit: { type: String, required: true },
  expiry_window: {
    posted_at: { type: Date, default: Date.now },
    safe_until: { type: Date, required: true }
  },
  pickup_location: {
    address: { type: String, required: true },
    lat: { type: Number, required: true },
    lng: { type: Number, required: true }
  },
  status: { type: String, enum: ['posted', 'matched', 'picked_up', 'delivered', 'unmatched'], default: 'posted' },
  photo_url: { type: String }
}, { timestamps: true });

module.exports = mongoose.model('Donation', donationSchema);
