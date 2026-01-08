import path from 'path';
import { fileURLToPath } from 'url';
import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import cron from 'node-cron';

// ========================
// Import des routes
// ========================
import requestRoutes from './backend/routes/requests.js';
import taximanRoutes from './backend/routes/taximan.js';
import withdrawalRoutes from './backend/routes/withdrawals.js';

// ========================
// Logique CRON
// ========================
import { handleExpiringAccounts } from './backend/cron/cleanup.js';

// ========================
// App
// ========================
const app = express();

// ========================
// ES Modules paths
// ========================
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
// MongoDB
// ========================
const mongoURI = process.env.MONGODB_URI;

if (!mongoURI) {
  console.error('❌ ERREUR : MONGODB_URI non définie');
} else {
  mongoose
    .connect(mongoURI)
    .then(() => {
      console.log('✅ MongoDB connecté');

      // Index TTL sécurisé
      mongoose.connection.on('open', async () => {
        try {
          await mongoose.connection.db
            .collection('taximen')
            .createIndex({ expireAt: 1 }, { expireAfterSeconds: 0 });
          console.log('✅ Index TTL taximen actif');
        } catch (err) {
          console.error('⚠️ Erreur index TTL:', err.message);
        }
      });
    })
    .catch(err => {
      console.error('❌ Erreur MongoDB:', err);
    });
}

// ========================
// CRON JOB
// ========================
cron.schedule('0 * * * *', () => {
  console.log('🔍 [CRON] Vérification des comptes expirés...');
  handleExpiringAccounts();
});

// ========================
// API ROUTES
// ========================
app.use('/api/requests', requestRoutes);
app.use('/api/taximan', taximanRoutes);
app.use('/api/withdrawals', withdrawalRoutes);

// ========================
// Health check (Render)
// ========================
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'OK' });
});

// ========================
// Catch-all Frontend (Node 22 SAFE)
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
});
