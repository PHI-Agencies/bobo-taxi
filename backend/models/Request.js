import mongoose from 'mongoose';

const requestSchema = new mongoose.Schema({
  type: String,
  departure: String,
  date: String,     // juste informatif
  time: String,     // juste informatif
  contact: String,
  description: String,

  // 👉 Date exacte de suppression
  expireAt: {
    type: Date,
    required: true
  },

  createdAt: {
    type: Date,
    default: Date.now
  }
});

// ✅ TTL NATIF MONGODB
requestSchema.index(
  { expireAt: 1 },
  { expireAfterSeconds: 0 }
);

export default mongoose.model('Request', requestSchema);
