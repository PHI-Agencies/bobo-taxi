import express from 'express';
import Request from '../models/Request.js';

const router = express.Router();

// 🟢 GET : Récupérer toutes les demandes (pour index.html)
router.get('/', async (req, res) => {
  try {
    // On récupère tout : MongoDB nettoie automatiquement les expirés via l'index TTL
    const requests = await Request.find().sort({ createdAt: -1 });
    res.json(requests);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.post('/', async (req, res) => {
  try {
    const { date, time } = req.body;

    // On force le format ISO : YYYY-MM-DDTHH:mm:00.000Z
    // Le "Z" à la fin garantit que c'est l'heure UTC (identique à l'heure du Burkina)
    const tripDateTime = new Date(`${date}T${time}:00.000Z`);

    // --- SÉCURITÉ : LOG POUR VÉRIFIER ---
    console.log("Date reçue du client :", date, time);
    console.log("Objet Date créé (expireAt) :", tripDateTime.toISOString());
    console.log("Heure actuelle du serveur :", new Date().toISOString());

    // Si l'heure du trajet est déjà passée, on refuse la création
    if (tripDateTime <= new Date()) {
      return res.status(400).json({ 
        message: "L'heure du trajet est déjà passée. Veuillez choisir une heure future." 
      });
    }

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
    res.status(201).json({ message: 'Demande publiée avec succès' });
  } catch (err) {
    console.error("Erreur création demande:", err);
    res.status(400).json({ message: "Erreur de format de date." });
  }
});

export default router;