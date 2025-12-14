const mongoose = require('mongoose');

const EventSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String },
  location: { type: String },
  // friendly category/slug used to map to frontend templates (e.g., 'wedding', 'beach-wedding')
  category: { type: String, default: '' },
  // image and price for customer display
  image: { type: String, default: '' },
  price: { type: Number, default: 0 },
  date: { type: Date, required: true },
  capacity: { type: Number, default: 0 },
  // packages: optional array of packages (name, price, description)
  packages: [
    {
      name: { type: String },
      price: { type: Number, default: 0 },
      description: { type: String }
    }
  ],
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Event', EventSchema);
