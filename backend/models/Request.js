import mongoose from 'mongoose';

const requestSchema = new mongoose.Schema({
  type: { type: String, required: true },
  departure: { type: String, required: true },
  date: { type: String, required: true },
  time: { type: String, required: true },
  duration: { type: Number, required: true },
  contact: { type: String, required: true },
  description: { type: String, default: '' },
  createdAt: { type: Date, default: Date.now },
  expireAt: { type: Date, required: true } // TTL natif MongoDB
});

requestSchema.index({ expireAt: 1 }, { expireAfterSeconds: 0 });

export default mongoose.model('Request', requestSchema);
