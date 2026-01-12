import path from 'path';
import { fileURLToPath } from 'url';
import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import cron from 'node-cron';

// Routes
import requestRoutes from './backend/routes/requests.js';
import { handleExpiringAccounts } from './backend/cron/cleanup.js';

const app = express();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use(express.json());
app.use(cors({ origin: process.env.FRONTEND_URL || '*' }));

// Frontend statique
app.use(express.static(path.join(__dirname, 'frontend')));

// MongoDB
const mongoURI = process.env.MONGODB_URI;
if (!mongoURI) console.error('❌ MONGODB_URI non définie');
else {
  mongoose.connect(mongoURI)
    .then(() => console.log('✅ MongoDB connecté'))
    .catch(err => console.error('❌ Erreur MongoDB:', err));
}

// API Routes
app.use('/api/requests', requestRoutes);

// Health check
app.get('/health', (req, res) => res.json({ status: 'OK' }));

// Catch-all Frontend
app.use((req, res) => {
  res.sendFile(path.join(__dirname, 'frontend', 'index.html'));
});

const PORT = process.env.PORT || 10000;
app.listen(PORT, () => console.log(`🚖 Serveur Bobo Taxi actif sur le port ${PORT}`));
