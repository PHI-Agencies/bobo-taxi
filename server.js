import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import requestRoutes from './routes/Requests.js';
app.use(express.static('public'));


const app = express();
app.use(express.json());

app.use(cors({
  origin: process.env.FRONTEND_URL || '*'
}));

mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('✅ MongoDB connecté'))
  .catch(err => console.error('❌ Erreur MongoDB :', err));

app.use('/api/requests', requestRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚖 Serveur en ligne sur le port ${PORT}`));
