const mongoose = require('mongoose');

const matchSchema = new mongoose.Schema({
  donation_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Donation', required: true },
  recipient_id: { type: mongoose.Schema.Types.ObjectId, ref: 'RecipientOrg', required: true },
  driver_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  status: { type: String, enum: ['matched', 'picked_up', 'delivered'], default: 'matched' },
  matched_at: { type: Date, default: Date.now }
}, { timestamps: true });

module.exports = mongoose.model('Match', matchSchema);
