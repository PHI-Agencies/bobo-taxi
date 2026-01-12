import mongoose from 'mongoose';

const requestSchema = new mongoose.Schema({
  type: { 
    type: String, 
    required: true 
  },
  departure: { 
    type: String, 
    required: true 
  },
  date: { 
    type: String, 
    required: true 
  }, // Format: YYYY-MM-DD
  time: { 
    type: String, 
    required: true 
  }, // Format: HH:mm
  contact: { 
    type: String, 
    required: true 
  },
  description: { 
    type: String, 
    default: '' 
  },
  createdAt: { 
    type: Date, 
    default: Date.now 
  },
  // Ce champ est le pivot de la suppression automatique.
  // MongoDB compare l'heure actuelle avec cette valeur.
  expireAt: { 
    type: Date, 
    required: true 
  } 
});

// Index TTL (Time-To-Live) : 
// Supprime la demande automatiquement quand l'heure actuelle >= expireAt
requestSchema.index({ expireAt: 1 }, { expireAfterSeconds: 0 });

export default mongoose.model('Request', requestSchema);