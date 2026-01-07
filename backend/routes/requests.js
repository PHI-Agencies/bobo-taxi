import express from 'express';
import Request from '../models/Request.js';

const router = express.Router();

router.post('/', async (req, res) => {
  try {
    const hours = Number(req.body.duration); // Récupère 12, 24 ou 48
    
    // Logique de calcul : 
    // Date actuelle + (Nombre d'heures * 3600 secondes * 1000 millisecondes)
    const expirationDate = new Date(Date.now() + (hours * 3600 * 1000));

    const newRequest = new Request({
      ...req.body,
      expireAt: expirationDate
    });

    await newRequest.save();
    res.status(201).json({ message: "Succès" });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

router.get('/', async (req, res) => {
  try {
    // On affiche tout ce qui est en base (Mongo a déjà supprimé le reste)
    const requests = await Request.find().sort({ createdAt: -1 });
    res.json(requests);
  } catch (err) {
    res.status(500).json({ message: 'Erreur serveur' });
  }
});

export default router;