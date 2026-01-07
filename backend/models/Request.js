import mongoose from 'mongoose';

const requestSchema = new mongoose.Schema({
  type: { type: String, required: true },
  departure: { type: String, required: true },
  date: { type: String, required: true },
  time: { type: String, required: true },
  duration: { type: Number, required: true }, // 12, 24 ou 48
  contact: { type: String, required: true },
  description: { type: String, default: '' },
  createdAt: { type: Date, default: Date.now },
  // Ce champ stocke le moment précis du futur où MongoDB doit supprimer
  expireAt: { type: Date, required: true } 
});

// La logique magique de MongoDB : supprime quand l'heure actuelle = expireAt
requestSchema.index({ expireAt: 1 }, { expireAfterSeconds: 0 });

export default mongoose.model('Request', requestSchema);