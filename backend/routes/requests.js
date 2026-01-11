import express from 'express';
import Request from '../models/Request.js';

const router = express.Router();

// Créer une demande
router.post('/', async (req, res) => {
  try {
    const allowedDurations = [12, 24, 48];
    const hours = allowedDurations.includes(Number(req.body.duration))
      ? Number(req.body.duration)
      : 24;

    const expireAt = new Date(Date.now() + hours * 60 * 60 * 1000);

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
    res.status(201).json({ message: 'Demande créée' });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Récupérer toutes les demandes actives
router.get('/', async (req, res) => {
  try {
    const now = new Date();
    const requests = await Request.find({ expireAt: { $gt: now } }).sort({ createdAt: -1 });
    res.json(requests);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

export default router;
