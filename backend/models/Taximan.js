// backend/models/Taximan.js
const taximanSchema = new mongoose.Schema({
  name: { type: String, required: true },
  phone: { type: String, required: true, unique: true }, // Utilisé pour le retrait automatique
  password: { type: String, required: true },
  referralCode: { type: String, unique: true },
  referredBy: { type: String, required: true },
  walletBalance: { type: Number, default: 0 },
  referralCount: { type: Number, default: 0 },
  expireAt: { 
    type: Date, 
    default: () => new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
    index: { expires: 0 } 
  }
}, { timestamps: true });

// Middleware : Juste avant que le compte expire/soit supprimé
// Note: MongoDB TTL ne déclenche pas toujours les hooks Mongoose. 
// La meilleure pratique est de faire une vérification quotidienne (Cron Job).