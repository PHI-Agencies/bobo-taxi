import express from 'express';
import Request from '../models/Request.js';

const router = express.Router();

router.post('/', async (req, res) => {
  try {
    // On s'assure que les données arrivent bien
    const newRequest = new Request({
      ...req.body,
      duration: parseInt(req.body.duration) || 24
    });
    const savedRequest = await newRequest.save();
    res.status(201).json(savedRequest);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

router.get('/', async (req, res) => {
  try {
    // On trie par date croissante (le plus proche en premier)
    const requests = await Request.find().sort({ date: 1, time: 1 });
    res.json(requests);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

export default router;