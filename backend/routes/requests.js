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

// 🔵 POST : Créer une demande (Suppression auto à l'heure du trajet)
router.post('/', async (req, res) => {
  try {
    const { date, time } = req.body;

    // Création de l'objet Date d'expiration basé sur le départ réel
    // Format attendu par le constructeur Date : "YYYY-MM-DDTHH:mm"
    const tripDateTime = new Date(`${date}T${time}`);

    // Vérification si la date est valide
    if (isNaN(tripDateTime.getTime())) {
      return res.status(400).json({ message: "Format de date ou d'heure invalide." });
    }

    const newRequest = new Request({
      type: req.body.type,
      departure: req.body.departure,
      date: date,
      time: time,
      contact: req.body.contact,
      description: req.body.description || '',
      expireAt: tripDateTime // <--- Suppression automatique à cette échéance
    });

    await newRequest.save();
    res.status(201).json({ message: 'Demande publiée avec succès' });
  } catch (err) {
    console.error('Erreur lors de la création:', err);
    res.status(400).json({ message: err.message });
  }
});

export default router;