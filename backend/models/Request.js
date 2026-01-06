import mongoose from 'mongoose';

const requestSchema = new mongoose.Schema({
  type: { type: String, required: true },
  departure: { type: String, required: true },
  destination: { type: String, default: "" },
  date: { type: String, required: true },
  time: { type: String, required: true },
  duration: { type: Number, default: 24 },
  contact: { type: String, required: true },
  description: { type: String, default: "" },
  createdAt: { type: Date, default: Date.now, expires: '48h' }
});

// C'EST CETTE LIGNE QUI MANQUE OU QUI EST MAL ÉCRITE :
export default mongoose.model('Request', requestSchema);