import express from 'express';
import Request from './backend/models/Request.js.';

const router = express.Router();

// 🟢 GET : Récupérer toutes les demandes actives
router.get('/', async (req, res) => {
  try {
    // On récupère tout, MongoDB se chargeant de supprimer les documents expirés
    const requests = await Request.find().sort({ createdAt: -1 });
    res.json(requests);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// 🔵 POST : Créer une demande avec suppression automatique à l'heure du trajet
router.post('/', async (req, res) => {
  try {
    const { date, time } = req.body;

    // On force le format ISO avec le "Z" pour garantir l'heure UTC/GMT (Burkina Faso)
    // Cela évite que le serveur interprète l'heure différemment selon sa localisation
    const tripDateTime = new Date(`${date}T${time}:00.000Z`);

    // --- LOGS DE SURVEILLANCE ---
    console.log("-----------------------------------------");
    console.log("Date reçue du client :", date, time);
    console.log("Objet Date créé (expireAt) :", tripDateTime.toISOString());
    console.log("Heure actuelle du serveur :", new Date().toISOString());
    console.log("-----------------------------------------");

    // Sécurité : Si l'heure du trajet est déjà passée, on refuse la création
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
      expireAt: tripDateTime // Pivot de la suppression automatique
    });

    await newRequest.save();
    res.status(201).json({ message: 'Demande publiée avec succès' });

  } catch (err) {
    console.error("Erreur création demande:", err);
    res.status(400).json({ message: "Erreur lors de l'enregistrement de la demande." });
  }
});

export default router;