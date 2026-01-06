import mongoose from 'mongoose';

const requestSchema = new mongoose.Schema({
  type: { type: String, required: true },
  departure: { type: String, required: true },
  destination: { type: String, default: "" },
  date: { type: String, required: true }, // Format: YYYY-MM-DD
  time: { type: String, required: true }, // Format: HH:mm
  duration: { type: Number, default: 24 },
  contact: { type: String, required: true },
  description: { type: String, default: "" },
  createdAt: { type: Date, default: Date.now, expires: '48h' }
});

// On ajoute des index pour accélérer le tri par urgence
requestSchema.index({ date: 1, time: 1 });

export default mongoose.model('Request', requestSchema);