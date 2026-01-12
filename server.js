import express from 'express';
import Request from '../models/Request.js';

const router = express.Router();

// 🟢 GET : Récupérer toutes les demandes présentes en base
router.get('/', async (req, res) => {
  try {
    // On récupère tout sans filtre ni tri complexe
    const requests = await Request.find();
    res.json(requests);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// 🔵 POST : Créer une demande
router.post('/', async (req, res) => {
  try {
    const { date, time } = req.body;
    
    // Création de la date d'expiration (Heure du trajet + Z pour GMT)
    const tripDateTime = new Date(`${date}T${time}:00.000Z`);

    const newRequest = new Request({
      type: req.body.type,
      departure: req.body.departure,
      date: date,
      time: time,
      contact: req.body.contact,
      description: req.body.description || '',
      expireAt: tripDateTime 
    });

    await newRequest.save();
    res.status(201).json({ message: 'Demande publiée' });
  } catch (err) {
    res.status(400).json({ message: "Erreur lors de l'enregistrement" });
  }
});

export default router;