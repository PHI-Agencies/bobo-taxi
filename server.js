import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';
import requestRoutes from './backend/routes/requests.js';

// Configuration des chemins
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Initialiser Express
const app = express();

// Middleware
app.use(express.json());
app.use(cors({
  origin: process.env.FRONTEND_URL || '*'
}));

// Servir les fichiers frontend
app.use(express.static(path.join(__dirname, 'frontend')));

// Routes API
app.use('/api/requests', requestRoutes);

// Route par défaut → renvoyer index.html
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'frontend', 'index.html'));
});

// Connexion MongoDB
mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('✅ MongoDB connecté'))
  .catch(err => console.error('❌ Erreur MongoDB :', err));

// Lancer le serveur
const PORT = process.env.PORT || 10000;
app.listen(PORT, () => console.log(`🚖 Serveur en ligne sur le port ${PORT}`));
