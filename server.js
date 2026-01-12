import path from 'path';
import { fileURLToPath } from 'url';
import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';

import requestRoutes from './backend/routes/requests.js';

const app = express();

/* ================================
   ES MODULE PATHS
================================ */
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/* ================================
   MIDDLEWARES
================================ */
app.use(express.json());
app.use(cors({ origin: process.env.FRONTEND_URL || '*' }));

/* ================================
   FRONTEND STATIQUE
================================ */
app.use(express.static(path.join(__dirname, 'frontend')));

/* ================================
   MONGODB
================================ */
const mongoURI = process.env.MONGODB_URI;

if (!mongoURI) {
  console.error('❌ MONGODB_URI non définie');
} else {
  mongoose
    .connect(mongoURI)
    .then(() => console.log('✅ MongoDB connecté'))
    .catch(err => console.error('❌ Erreur MongoDB:', err));
}

/* ================================
   API ROUTES
================================ */
app.use('/api/requests', requestRoutes);

/* ================================
   HEALTH CHECK
================================ */
app.get('/health', (req, res) => {
  res.json({ status: 'OK' });
});

/* ================================
   CATCH-ALL FRONTEND
================================ */
app.use((req, res) => {
  res.sendFile(path.join(__dirname, 'frontend', 'index.html'));
});

/* ================================
   START SERVER
================================ */
const PORT = process.env.PORT || 10000;
app.listen(PORT, () => {
  console.log(`🚖 Bobo Taxi actif sur le port ${PORT}`);
});
