import mongoose from 'mongoose';

const withdrawalSchema = new mongoose.Schema({
  taximanId: { type: mongoose.Schema.Types.ObjectId, ref: 'Taximan', required: true },
  taximanPhone: String,
  amount: { type: Number, required: true, min: 500 },
  payoutPhone: { type: String, required: true }, // Numéro OM/Moov saisi
  method: { type: String, enum: ['Orange Money', 'Moov Money'] },
  status: { type: String, default: 'En attente' }, // 'En attente' ou 'Validé'
  date: { type: Date, default: Date.now }
});

export default mongoose.model('Withdrawal', withdrawalSchema);