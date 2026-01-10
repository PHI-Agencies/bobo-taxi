import mongoose from 'mongoose';

const requestSchema = new mongoose.Schema({
  type: String,
  departure: String,
  date: String,
  time: String,
  duration: Number,
  contact: String,
  description: String,
  createdAt: { type: Date, default: Date.now },

  // Date exacte de suppression
  expireAt: { type: Date, required: true }
});

// TTL NATIF MONGODB
requestSchema.index(
  { expireAt: 1 },
  { expireAfterSeconds: 0 }
);

export default mongoose.model('Request', requestSchema);
