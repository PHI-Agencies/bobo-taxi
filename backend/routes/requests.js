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

// 🔍 Recherche robuste par regex sur plusieurs champs (Solution A)
router.get('/search', async (req, res) => {
  try {
    const qRaw = (req.query.q || '').trim();
    if (!qRaw) {
      // si pas de q, renvoyer toutes les demandes
      const all = await Request.find().sort({ createdAt: -1 });
      return res.json(all);
    }

    // Échapper les caractères spéciaux pour construire un RegExp sûr
    const escapeRegex = (s) => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const qEscaped = escapeRegex(qRaw);

    // regex insensible à la casse pour correspondances partielles
    const regex = new RegExp(qEscaped, 'i');

    // Si la requête contient des chiffres on prépare aussi une recherche "digits only"
    const digits = qRaw.replace(/\D/g, '');
    const digitCond = digits.length >= 3 ? { contactInfo: { $regex: digits } } : null;

    // champs à interroger (ajoute ou retire des champs selon ton modèle)
    const orConditions = [
      { departureTime: regex },
      { itinerary: regex },
      { transportType: regex },
      { contactInfo: regex },     // utile si tu cherches heures/textes
      { validity: regex },
      { comments: regex }
    ];

    if (digitCond) orConditions.push(digitCond);

    const results = await Request.find({ $or: orConditions }).sort({ createdAt: -1 });
    res.json(results);
  } catch (error) {
    console.error('Erreur recherche:', error);
    res.status(500).json({ error: error.message });
  }
});
