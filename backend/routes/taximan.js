// backend/routes/taximan.js
import express from 'express';
import Taximan from '../models/Taximan.js';
const router = express.Router();

// Route d'inscription
router.post('/register', async (req, res) => {
    try {
        const { name, phone, password, referredBy } = req.body;

        // 1. GÉNÉRATION DU CODE UNIQUE (7 caractères)
        // On génère un code pour le NOUVEAU taximan
        const newReferralCode = Math.random().toString(36).substring(2, 9).toUpperCase();

        // 2. LOGIQUE DE CRÉDIT DU PARRAIN
        // On cherche le parrain dans la base de données via son code
        const sponsor = await Taximan.findOne({ referralCode: referredBy });

        if (!sponsor) {
            return res.status(400).json({ error: "Le code de parrainage est obligatoire et doit être valide." });
        }

        // 3. CRÉATION DU NOUVEAU TAXIMAN
        const newTaximan = new Taximan({
            name,
            phone,
            password,
            referralCode: newReferralCode, // Son propre code à partager
            referredBy: referredBy,         // Le code de celui qui l'a invité
            walletBalance: 0,              // Il commence à 0F
            // expireAt sera mis par défaut à J+30 par le modèle Mongoose
        });

        // 4. MISE À JOUR DU PARRAIN (Bonus 500F)
        // On augmente son solde de 500 et son compteur de parrainage
        sponsor.walletBalance += 500;
        sponsor.referralCount += 1;

        // Sauvegarde des deux documents
        await newTaximan.save();
        await sponsor.save();

        res.status(201).json({ 
            message: "Inscription validée ! 500F ont été versés à votre parrain.",
            yourCode: newReferralCode 
        });

    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Erreur lors de l'inscription." });
    }
});

export default router;