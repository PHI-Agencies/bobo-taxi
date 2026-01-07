import path from 'path';
import { fileURLToPath } from 'url';
import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import cron from 'node-cron';

import requestRoutes from './backend/routes/requests.js';
import taximanRoutes from './backend/routes/taximan.js';
// (Ajoute tes autres imports ici si nécessaire)

const app = express();
const __dirname = path.dirname(fileURLToPath(import.meta.url));

app.use(express.json());
app.use(cors());
app.use(express.static(path.join(__dirname, 'frontend')));

// Connexion MongoDB
mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('✅ MongoDB connecté'))
  .catch(err => console.error('❌ Erreur MongoDB:', err));

// Routes API
app.use('/api/requests', requestRoutes);
app.use('/api/taximan', taximanRoutes);

// Catch-all pour le frontend
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'frontend', 'index.html'));
});

const PORT = process.env.PORT || 10000;
app.listen(PORT, () => console.log(`🚖 Serveur actif sur le port ${PORT}`));