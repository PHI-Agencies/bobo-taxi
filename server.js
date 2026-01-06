import path from 'path';
import { fileURLToPath } from 'url';
import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import cron from 'node-cron'; 

// Import des routes
import requestRoutes from './backend/routes/requests.js';
import taximanRoutes from './backend/routes/taximan.js';
import withdrawalRoutes from './backend/routes/withdrawals.js';

// Import de la logique de nettoyage
import { handleExpiringAccounts } from './backend/cron/cleanup.js';

const app = express();

// Configuration des chemins (ES Modules)
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// --- Middlewares ---
app.use(express.json());
app.use(cors({ origin: process.env.FRONTEND_URL || '*' }));

// --- Servir les fichiers statiques ---
// Note : Assure-toi que tes fichiers HTML sont bien dans un dossier nommé 'frontend'
app.use(express.static(path.join(__dirname, 'frontend')));

// --- Connexion MongoDB ---
// Ajout d'une sécurité si MONGODB_URI est absent
const mongoURI = process.env.MONGODB_URI;
if (!mongoURI) {
    console.error("❌ ERREUR : La variable d'environnement MONGODB_URI est vide !");
} else {
    mongoose.connect(mongoURI)
      .then(() => {
        console.log('✅ MongoDB connecté');
        // Initialisation de l'index TTL
        mongoose.connection.on('open', () => {
            mongoose.connection.db.collection('taximen').createIndex({ "expireAt": 1 }, { expireAfterSeconds: 0 });
        });
      })
      .catch(err => console.error('❌ Erreur MongoDB :', err));
}

// --- Cron Job ---
cron.schedule('0 * * * *', () => {
    console.log("🔍 [CRON] Vérification des retraits automatiques...");
    handleExpiringAccounts();
});

// --- Routes API ---
app.use('/api/requests', requestRoutes);
app.use('/api/taximan', taximanRoutes);
app.use('/api/withdrawals', withdrawalRoutes);

// --- Servir le Frontend (CORRECTION ICI) ---
// Remplacement du '*' par '(.*)' pour compatibilité avec path-to-regexp v10+
app.get('(.*)', (req, res) => {
  res.sendFile(path.join(__dirname, 'frontend', 'index.html'));
});

// --- Démarrage ---
const PORT = process.env.PORT || 10000;
app.listen(PORT, () => {
    console.log(`🚖 Serveur Bobo Taxi actif sur le port ${PORT}`);
});