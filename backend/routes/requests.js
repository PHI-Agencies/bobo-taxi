import express from 'express';
import Request from '../models/Request.js';

const router = express.Router();

router.post('/', async (req, res) => {
  try {
    const { duration } = req.body;
    
    // Calcul de la date d'expiration : Maintenant + X heures
    const expirationDate = new Date();
    expirationDate.setHours(expirationDate.getHours() + parseInt(duration || 24));

    const newRequest = new Request({
      ...req.body,
      expireAt: expirationDate // On enregistre la date de fin
    });

    const savedRequest = await newRequest.save();
    res.status(201).json(savedRequest);
  } catch (err) {
    console.error("Erreur création:", err.message);
    res.status(400).json({ message: "Erreur lors de la création" });
  }
});

// ... reste du code (GET)
export default router;