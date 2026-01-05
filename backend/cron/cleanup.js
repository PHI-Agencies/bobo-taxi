// backend/cron/cleanup.js
import Taximan from '../models/Taximan.js';
import Withdrawal from '../models/Withdrawal.js';

export const handleExpiringAccounts = async () => {
    const now = new Date();
    // On cherche les taximen dont le solde > 0 et qui vont expirer dans l'heure
    const expiringSoon = await Taximan.find({
        expireAt: { $lte: now },
        walletBalance: { $gt: 0 }
    });

    for (let taxi of expiringSoon) {
        // On crée automatiquement une demande de retrait
        const autoWithdraw = new Withdrawal({
            taximanId: taxi._id,
            taximanPhone: taxi.phone,
            amount: taxi.walletBalance,
            payoutPhone: taxi.phone, // Utilise le numéro d'inscription
            method: 'Orange Money', // Par défaut
            status: 'Automatique - Fin d\'abonnement'
        });
        await autoWithdraw.save();
        console.log(`✅ Retrait auto généré pour ${taxi.name} (${taxi.walletBalance}F)`);
    }
};