import path from 'path';
import { fileURLToPath } from 'url';
import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import requestRoutes from './backend/routes/requests.js';

const app = express();

// Config nécessaire pour __dirname avec ES Modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Middleware
app.use(express.json());
app.use(cors({
  origin: process.env.FRONTEND_URL || '*'
}));

// Servir les fichiers du dossier frontend
app.use(express.static(path.join(__dirname, 'frontend')));

// Connexion à MongoDB
mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('✅ MongoDB connecté'))
  .catch(err => console.error('❌ Erreur MongoDB :', err));

// Routes API
app.use('/api/requests', requestRoutes);

// ⚠️ Wildcard compatible Express 5 :
app.use((req, res, next) => {
  res.sendFile(path.join(__dirname, 'frontend', 'index.html'));
});

// Démarrage du serveur
const PORT = process.env.PORT || 10000;
app.listen(PORT, () => console.log(`🚖 Serveur en ligne sur le port ${PORT}`));
