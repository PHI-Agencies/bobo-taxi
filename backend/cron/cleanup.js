import Request from '../models/Request.js';

export async function handleExpiringAccounts() {
  try {
    const now = new Date();
    const result = await Request.deleteMany({ expireAt: { $lte: now } });
    console.log(`🗑️ Supprimé ${result.deletedCount} demandes expirées`);
  } catch (err) {
    console.error('⚠️ Erreur cron cleanup:', err.message);
  }
}
