import express from 'express';
import Request from '../models/Request.js';

const router = express.Router();

// ➕ Créer une demande
router.post('/', async (req, res) => {
  try {
    const newRequest = new Request(req.body);
    await newRequest.save();
    res.status(201).json(newRequest);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// 📋 Récupérer toutes les demandes
router.get('/', async (req, res) => {
  try {
    const requests = await Request.find().sort({ createdAt: -1 });
    res.json(requests);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// 🔍 Recherche simple et fiable par regex sur les champs textuels
router.get('/search', async (req, res) => {
  try {
    const qRaw = (req.query.q || '').trim();
    
    if (!qRaw) {
      // Si la requête est vide, renvoyer toutes les demandes
      const all = await Request.find().sort({ createdAt: -1 });
      return res.json(all);
    }

    // Fonction utilitaire pour échapper les caractères spéciaux et créer une regex insensible à la casse
    const escapeRegex = (s) => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const qEscaped = escapeRegex(qRaw);
    const regex = new RegExp(qEscaped, 'i');

    // Conditions de recherche sur les champs TEXTUELS pertinents
    const orConditions = [
      { itinerary: regex },         // Itinéraire de départ/arrivée
      { transportType: regex },      // Type de transport (voiture, moto)
      { departureTime: regex },      // Heure de départ
      { comments: regex },           // Conditions/Commentaires
    ];
    
    // Condition spéciale pour la recherche de numéros de contact (s'il y a au moins 3 chiffres dans la requête)
    const digits = qRaw.replace(/\D/g, '');
    if (digits.length >= 3) {
      orConditions.push({ contactInfo: { $regex: digits } });
    }

    const results = await Request.find({ $or: orConditions }).sort({ createdAt: -1 });
    res.json(results);
    
  } catch (error) {
    console.error('Erreur lors de la recherche backend:', error);
    res.status(500).json({ error: 'Erreur serveur lors de la recherche' });
  }
});

export default router;