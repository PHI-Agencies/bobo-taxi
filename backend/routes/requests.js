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

// 🔍 Recherche (optionnelle)
router.get('/search', async (req, res) => {
  try {
    const q = req.query.q;
    const requests = await Request.find({
      $or: [
        { itinerary: new RegExp(q, 'i') },
        { transportType: new RegExp(q, 'i') },
        { contactInfo: new RegExp(q, 'i') }
      ]
    });
    res.json(requests);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
