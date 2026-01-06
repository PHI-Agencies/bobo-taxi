import mongoose from 'mongoose';

const requestSchema = new mongoose.Schema({
  type: { type: String, required: true },
  departure: { type: String, required: true },
  destination: { type: String, default: "" },
  date: { type: String, required: true },
  time: { type: String, required: true },
  duration: { type: Number, default: 24 }, // 12, 24 ou 48
  contact: { type: String, required: true },
  description: { type: String, default: "" },
  createdAt: { type: Date, default: Date.now },
  // Ce champ contiendra la date exacte de suppression
  expireAt: { type: Date, required: true } 
});

// Cet index dit à MongoDB : "Supprime ce document quand l'heure actuelle atteint expireAt"
requestSchema.index({ expireAt: 1 }, { expireAfterSeconds: 0 });

export default mongoose.model('Request', requestSchema);