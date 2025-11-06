import mongoose from 'mongoose';

const requestSchema = new mongoose.Schema({
  departureTime: String,
  itinerary: String,
  transportType: String,
  contactInfo: String,
  validity: Number, // en heures
  comments: String,
  createdAt: {
    type: Date,
    default: Date.now,
    expires: 0 // défini dynamiquement
  }
});

// Middleware pour définir l'expiration selon "validity"
requestSchema.pre('save', function(next) {
  const validityInMs = this.validity * 60 * 60; // convertir en secondes
  this.schema.path('createdAt').options.expires = validityInMs;
  next();
});

const Request = mongoose.model('Request', requestSchema);
export default Request;
