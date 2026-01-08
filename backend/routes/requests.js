import express from 'express';
import Request from '../models/Request.js';

const router = express.Router();

// 🟢 GET : Récupérer toutes les demandes (pour index.html)
router.get('/', async (req, res) => {
  try {
    const requests = await Request.find().sort({ createdAt: -1 });
    res.json(requests);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// 🔵 POST : Créer une demande (harmonisé avec demande.js)
router.post('/', async (req, res) => {
  try {
    const hours = Number(req.body.duration || 24);
    const expirationDate = new Date(Date.now() + (hours * 3600 * 1000));

    const newRequest = new Request({
      type: req.body.type,
      departure: req.body.departure,
      date: req.body.date,
      time: req.body.time,
      duration: hours,
      contact: req.body.contact,
      description: req.body.description || '',
      expireAt: expirationDate
    });

    await newRequest.save();
    res.status(201).json({ message: 'Demande créée avec succès' });
  } catch (err) {
    console.error('Erreur Mongo:', err);
    res.status(400).json({ message: err.message });
  }
});

export default router;