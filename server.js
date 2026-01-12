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
// MongoDB & Index TTL
// ========================
const mongoURI = process.env.MONGODB_URI;

if (!mongoURI) {
  console.error('❌ ERREUR : MONGODB_URI non définie');
} else {
  mongoose
    .connect(mongoURI)
    .then(() => {
      console.log('✅ MongoDB connecté');

      // Configuration des index de suppression automatique (TTL)
      mongoose.connection.on('open', async () => {
        try {
          // TTL pour les chauffeurs (si expireAt existe)
          await mongoose.connection.db
            .collection('taximen')
            .createIndex({ expireAt: 1 }, { expireAfterSeconds: 0 });
          
          // TTL pour les demandes (Suppression à l'heure du trajet)
          await mongoose.connection.db
            .collection('requests')
            .createIndex({ expireAt: 1 }, { expireAfterSeconds: 0 });

          console.log('✅ Index TTL actifs (Chauffeurs & Demandes)');
        } catch (err) {
          console.error('⚠️ Erreur configuration index TTL:', err.message);
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
  res.status(200).json({ status: 'OK', message: 'Serveur opérationnel' });
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
  console.log('🕒 Gestion automatique des expirations : Active via MongoDB TTL');
});