import path from 'path';
import { fileURLToPath } from 'url';
import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import cron from 'node-cron'; // Bibliothèque pour les tâches automatiques

// Import des routes
import requestRoutes from './backend/routes/requests.js';
import taximanRoutes from './backend/routes/taximan.js';
import withdrawalRoutes from './backend/routes/withdrawals.js';

// Import de la logique de nettoyage (Retraits auto avant expiration)
import { handleExpiringAccounts } from './backend/cron/cleanup.js';

const app = express();

// Configuration des chemins (ES Modules)
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// --- Middlewares ---
app.use(express.json());
app.use(cors({ origin: process.env.FRONTEND_URL || '*' }));
app.use(express.static(path.join(__dirname, 'frontend')));

// --- Connexion MongoDB ---
mongoose.connect(process.env.MONGODB_URI)
  .then(() => {
    console.log('✅ MongoDB connecté (Requests, Taximen, Withdrawals)');
    
    // Initialisation des Index TTL (Suppression auto après 30 jours)
    // Cela garantit que MongoDB écoute le champ expireAt
    mongoose.connection.db.collection('taximen').createIndex({ "expireAt": 1 }, { expireAfterSeconds: 0 });
  })
  .catch(err => console.error('❌ Erreur MongoDB :', err));

// --- Programmation du Cron Job (Toutes les heures) ---
// S'exécute à la minute 0 de chaque heure (ex: 13:00, 14:00...)
cron.schedule('0 * * * *', () => {
    console.log("🔍 [CRON] Vérification des comptes expirant bientôt pour retrait automatique...");
    handleExpiringAccounts();
});

// --- Routes API ---
app.use('/api/requests', requestRoutes);       // Gestion des demandes clients
app.use('/api/taximan', taximanRoutes);         // Inscription, Connexion, Parrainage
app.use('/api/withdrawals', withdrawalRoutes); // Retraits manuels (500F) et auto

// --- Servir le Frontend ---
// Wildcard pour servir l'index.html pour toutes les routes non-API
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'frontend', 'index.html'));
});

// --- Démarrage ---
const PORT = process.env.PORT || 10000;
app.listen(PORT, () => {
    console.log(`🚖 Serveur Bobo Taxi actif sur le port ${PORT}`);
    console.log(`⏰ Cron Job activé : Retrait auto configuré.`);
});