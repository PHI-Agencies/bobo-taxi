import express from 'express';
import Request from '../models/Request.js';

// --- AJOUT INDISPENSABLE : Initialisation du routeur ---
const router = express.Router();

router.post('/', async (req, res) => {
  try {
    const allowedDurations = [12, 24, 48];
    const hours = Number(req.body.duration);

    if (!allowedDurations.includes(hours)) {
      return res.status(400).json({
        message: 'Durée invalide (12, 24 ou 48 heures uniquement)'
      });
    }

    // Utilisation de Date.now() pour un calcul plus précis en millisecondes
    // (Évite les bugs de décalage horaire sur les serveurs distants)
    const expirationDate = new Date(Date.now() + (hours * 3600 * 1000));

    const newRequest = new Request({
      ...req.body,
      duration: hours,
      expireAt: expirationDate
    });

    await newRequest.save();
    res.status(201).json({ message: 'Demande créée avec succès' });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Erreur serveur' });
  }
});

// GET pour récupérer les demandes (Optionnel mais recommandé pour ton index.html)
router.get('/', async (req, res) => {
    try {
        const requests = await Request.find().sort({ date: 1, time: 1 });
        res.json(requests);
    } catch (err) {
        res.status(500).json({ message: 'Erreur serveur' });
    }
});

export default router;