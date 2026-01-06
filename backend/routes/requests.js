import express from 'express';
import Request from '../models/Request.js'; // Vérifie le chemin vers ton modèle

const router = express.Router();

// Créer une demande
router.post('/', async (req, res) => {
  try {
    const { type, departure, destination, date, time, duration, contact, description } = req.body;

    const newRequest = new Request({
      type,
      departure,
      destination,
      date,
      time,
      duration: parseInt(duration), // On s'assure que c'est un nombre
      contact,
      description
    });

    const savedRequest = await newRequest.save();
    res.status(201).json(savedRequest);
  } catch (err) {
    console.error("Erreur création demande:", err);
    res.status(400).json({ message: "Erreur lors de la création de la demande" });
  }
});

// Récupérer les demandes (déjà existant dans ton code normalement)
router.get('/', async (req, res) => {
  try {
    const requests = await Request.find().sort({ createdAt: -1 });
    res.json(requests);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

export default router;