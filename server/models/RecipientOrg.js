const mongoose = require('mongoose');

const recipientOrgSchema = new mongoose.Schema({
  user_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, unique: true },
  name: { type: String, required: true },
  location: {
    address: { type: String, required: true },
    lat: { type: Number, required: true },
    lng: { type: Number, required: true }
  },
  current_capacity: { type: Number, default: 0 },
  accepted_food_types: [{ type: String }],
  contact: {
    name: { type: String },
    phone: { type: String }
  }
}, { timestamps: true });

module.exports = mongoose.model('RecipientOrg', recipientOrgSchema);
