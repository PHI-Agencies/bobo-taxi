const mongoose = require('mongoose');

const RequestSchema = new mongoose.Schema({
    type: { type: String, required: true }, // Taxi-voiture ou Moto-taxi
    departure: { type: String, required: true }, // Itinéraire complet
    destination: { type: String, default: "" }, 
    date: { type: String, required: true }, // La date du voyage
    time: { type: String, required: true }, // L'heure du départ
    duration: { type: Number, default: 24 }, // Durée de visibilité en heures
    contact: { type: String, required: true },
    description: { type: String, default: "" },
    createdAt: { type: Date, default: Date.now, expires: '48h' } // Suppression auto après 48h
});

module.exports = mongoose.model('Request', RequestSchema);