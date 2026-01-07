import express from 'express';
import Request from '../models/Request.js';

const router = express.Router();

// POST : Créer une demande avec calcul de fin de validité
router.post('/', async (req, res) => {
  try {
    const duration = Number(req.body.duration || 24);
    const expireAt = new Date();
    expireAt.setHours(expireAt.getHours() + duration);

    const request = new Request({
      ...req.body,
      duration,
      expireAt
    });

    const saved = await request.save();
    res.status(201).json(saved);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// GET : Récupérer les trajets (triés par date et heure de départ)
router.get('/', async (req, res) => {
  try {
    const requests = await Request.find({ 
      expireAt: { $gt: new Date() } 
    }).sort({ date: 1, time: 1 }); // Urgent en premier

    res.json(requests);
  } catch (err) {
    res.status(500).json({ message: 'Erreur serveur' });
  }
});

export default router;