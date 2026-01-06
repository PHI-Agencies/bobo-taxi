import express from 'express';
import Request from '../models/Request.js';

const router = express.Router();

/**
 * @route   POST /api/requests
 * @desc    Créer une nouvelle demande et l'enregistrer en base de données
 */
router.post('/', async (req, res) => {
  try {
    const { 
      type, 
      departure, 
      destination, 
      date, 
      time, 
      duration, 
      contact, 
      description 
    } = req.body;

    // Création de l'instance du modèle avec les nouvelles données
    const newRequest = new Request({
      type,
      departure,
      destination,
      date,
      time,
      duration: parseInt(duration) || 24,
      contact,
      description
    });

    const savedRequest = await newRequest.save();
    res.status(201).json(savedRequest);
  } catch (err) {
    console.error("❌ Erreur lors de la création de la demande:", err.message);
    res.status(400).json({ message: "Impossible de publier votre demande. Vérifiez les champs." });
  }
});

/**
 * @route   GET /api/requests
 * @desc    Récupérer les demandes triées par date et heure de voyage (Urgence)
 */
router.get('/', async (req, res) => {
  try {
    /** * TRI PAR URGENCE :
     * 1. date: 1  -> Les dates les plus proches (Aujourd'hui avant demain)
     * 2. time: 1  -> Les heures les plus tôt (08h00 avant 12h00)
     */
    const requests = await Request.find().sort({ date: 1, time: 1 });
    
    res.json(requests);
  } catch (err) {
    console.error("❌ Erreur lors de la récupération des demandes:", err.message);
    res.status(500).json({ message: "Erreur serveur lors de la récupération des trajets." });
  }
});

/**
 * @route   GET /api/requests/:id
 * @desc    Récupérer une seule demande par son ID (Utile pour voir les détails)
 */
router.get('/:id', async (req, res) => {
  try {
    const request = await Request.findById(req.params.id);
    if (!request) return res.status(404).json({ message: "Demande introuvable" });
    res.json(request);
  } catch (err) {
    res.status(500).json({ message: "Erreur lors de la recherche de la demande." });
  }
});

export default router;