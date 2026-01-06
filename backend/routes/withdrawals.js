// backend/routes/withdrawals.js
import express from 'express';
import Withdrawal from '../models/Withdrawal.js';
import Taximan from '../models/Taximan.js';

const router = express.Router();

// 1. Créer une demande de retrait
router.post('/', async (req, res) => {
    const { amount, phone, method, taximanId } = req.body;

    try {
        const taxi = await Taximan.findById(taximanId);
        
        if (!taxi || taxi.walletBalance < amount) {
            return res.status(400).json({ error: "Solde insuffisant" });
        }

        // Création de la demande
        const newWithdrawal = new Withdrawal({
            taximanId: taxi._id,
            taximanPhone: taxi.phone,
            amount: amount,
            payoutPhone: phone,
            method: method,
            status: 'En attente'
        });

        await newWithdrawal.save();

        // MISE À JOUR AUTOMATIQUE DU SOLDE
        taxi.walletBalance -= amount;
        await taxi.save();

        res.status(201).json({ message: "Retrait enregistré et solde débité" });
    } catch (err) {
        res.status(500).json({ error: "Erreur serveur" });
    }
});

// 2. Route pour ton équipe (Admin) pour voir les retraits à payer
router.get('/pending', async (req, res) => {
    try {
        const list = await Withdrawal.find({ status: 'En attente' }).sort({ date: -1 });
        res.json(list);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

export default router;