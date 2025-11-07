import mongoose from 'mongoose';

const requestSchema = new mongoose.Schema({
  departureTime: String,
  itinerary: String,
  transportType: String,
  contactInfo: String,
  validity: Number, // durée en heures
  comments: String,
  createdAt: {
    type: Date,
    default: Date.now
  },
  expireAt: {
    type: Date,
    index: { expires: 0 } // TTL pour suppression auto
  }
});

// Définir dynamiquement la date d’expiration
requestSchema.pre('save', function (next) {
  const validityInMs = this.validity * 60 * 60 * 1000; // heures → ms
  this.expireAt = new Date(Date.now() + validityInMs);
  next();
});

// 👇 Spécifie le nom exact de la collection : "demandes"
const Request = mongoose.model('Request', requestSchema, 'demandes');

export default Request;
