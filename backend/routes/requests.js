import express from 'express';
import Request from '../models/Request.js';

const router = express.Router();

// 🔵 GET : toutes les demandes encore en base
router.get('/', async (req, res) => {
  try {
    const requests = await Request.find().sort({ createdAt: -1 });
    res.json(requests);
  } catch (err) {
    res.status(500).json({ message: 'Erreur serveur' });
  }
});

// 🟢 POST : créer une demande avec durée 12 / 24 / 48h
router.post('/', async (req, res) => {
  try {
    const hours = Number(req.body.duration);

    if (![12, 24, 48].includes(hours)) {
      return res.status(400).json({ message: 'Durée invalide' });
    }

    const expireAt = new Date(Date.now() + hours * 3600 * 1000);

    const request = new Request({
      type: req.body.type,
      departure: req.body.departure,
      date: req.body.date,
      time: req.body.time,
      duration: hours,
      contact: req.body.contact,
      description: req.body.description || '',
      expireAt
    });

    await request.save();
    res.status(201).json({ message: 'Demande créée avec succès' });

  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

export default router;
