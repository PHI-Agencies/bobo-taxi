import path from 'path';
import { fileURLToPath } from 'url';
import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';

// ========================
// Import des routes
// ========================
import requestRoutes from './backend/routes/requests.js';
import taximanRoutes from './backend/routes/taximan.js';
import withdrawalRoutes from './backend/routes/withdrawals.js';

// ========================
// App Configuration
// ========================
const app = express();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// ========================
// Middlewares
// ========================
app.use(express.json());
app.use(cors({
  origin: process.env.FRONTEND_URL || '*',
}));

// ========================
// Frontend statique
// ========================
app.use(express.static(path.join(__dirname, 'frontend')));

// ========================
// MongoDB & Index TTL (Time-To-Live)
// ========================
const mongoURI = process.env.MONGODB_URI;

if (!mongoURI) {
  console.error('❌ ERREUR : MONGODB_URI non définie');
} else {
  mongoose
    .connect(mongoURI)
    .then(() => {
      console.log('✅ MongoDB connecté');

      // Configuration dynamique des index au démarrage
      mongoose.connection.on('open', async () => {
        try {
          const requestsCollection = mongoose.connection.db.collection('requests');
          const taximenCollection = mongoose.connection.db.collection('taximen');
          
          // 1. RÉINITIALISATION DE L'INDEX POUR LES DEMANDES (REQUESTS)
          // On supprime l'ancien index pour être sûr qu'il n'y a pas de conflit de délai
          try {
            await requestsCollection.dropIndex("expireAt_1");
            console.log('🔄 Ancien index Requests supprimé');
          } catch (e) {
            // L'index n'existait pas, c'est normal au premier lancement
          }
          
          // On crée l'index TTL avec expireAfterSeconds: 0
          // Cela signifie : Supprime dès que NOW >= expireAt
          await requestsCollection.createIndex({ expireAt: 1 }, { expireAfterSeconds: 0 });
          console.log('✅ Nouvel index TTL Requests activé (0 seconde)');

          // 2. INDEX POUR LES CHAUFFEURS (TAXIMEN)
          try {
            await taximenCollection.createIndex({ expireAt: 1 }, { expireAfterSeconds: 0 });
            console.log('✅ Index TTL Taximen actif');
          } catch (err) {
            console.error('⚠️ Erreur index Taximen:', err.message);
          }

        } catch (err) {
          console.error('⚠️ Erreur globale configuration index:', err.message);
        }
      });
    })
    .catch(err => {
      console.error('❌ Erreur de connexion MongoDB:', err);
    });
}

// ========================
// API ROUTES
// ========================
app.use('/api/requests', requestRoutes);
app.use('/api/taximan', taximanRoutes);
app.use('/api/withdrawals', withdrawalRoutes);

// ========================
// Health check
// ========================
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'OK', serverTime: new Date().toISOString() });
});

// ========================
// Catch-all Frontend
// ========================
app.use((req, res) => {
  res.sendFile(path.join(__dirname, 'frontend', 'index.html'));
});

// ========================
// Start server
// ========================
const PORT = process.env.PORT || 10000;
app.listen(PORT, () => {
  console.log(`🚖 Serveur Bobo Taxi actif sur le port ${PORT}`);
  console.log('🕒 Mode : Suppression automatique à l\'heure du trajet (GMT/UTC)');
});