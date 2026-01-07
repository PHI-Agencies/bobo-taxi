import mongoose from 'mongoose';

const requestSchema = new mongoose.Schema({
  type: { type: String, required: true },       // Taxi-voiture ou Moto-taxi
  departure: { type: String, required: true },  // Itinéraire (ex: Tounouma)
  date: { type: String, required: true },       // Date du trajet
  time: { type: String, required: true },       // Heure du trajet
  duration: { type: Number, default: 24 },      // 12, 24 ou 48h
  contact: { type: String, required: true },
  description: { type: String, default: '' },
  createdAt: { type: Date, default: Date.now },
  expireAt: { type: Date, required: true }      // Date exacte de suppression
});

// Index TTL : Supprime le document quand l'heure actuelle dépasse expireAt
requestSchema.index({ expireAt: 1 }, { expireAfterSeconds: 0 });

export default mongoose.model('Request', requestSchema);