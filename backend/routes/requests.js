import express from 'express';
import Request from '../models/Request.js';

const router = express.Router();

router.post('/', async (req, res) => {
  try {
    const { type, departure, date, time, contact, description } = req.body;

    // 🔥 LOGIQUE CLÉ
    const expireAt = new Date(`${date}T${time}:00`);

    const request = new Request({
      type,
      departure,
      date,
      time,
      contact,
      description: description || '',
      expireAt
    });

    await request.save();

    res.status(201).json({ message: 'Demande créée' });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

/**
 * 📄 Afficher simplement ce qui existe encore
 */
router.get('/', async (req, res) => {
  const requests = await Request.find().sort({ createdAt: -1 });
  res.json(requests);
});

export default router;
