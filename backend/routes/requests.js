import express from 'express';
import Request from '../models/Request.js';

const router = express.Router();

router.post('/', async (req, res) => {
  try {
    console.log('BODY REÇU :', req.body); // 🔥 DEBUG

    const allowedDurations = [12, 24, 48];
    const hours = Number(req.body.duration);

    if (!allowedDurations.includes(hours)) {
      return res.status(400).json({
        message: 'Durée invalide (12, 24 ou 48 heures uniquement)'
      });
    }

    const expirationDate = new Date();
    expirationDate.setHours(expirationDate.getHours() + hours);

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

    res.status(201).json({
      message: 'Demande créée avec succès',
      expireAt: expirationDate
    });

  } catch (err) {
    console.error('❌ ERREUR MONGOOSE :', err);
    res.status(500).json({
      message: err.message
    });
  }
});

export default router;
