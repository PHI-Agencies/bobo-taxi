import mongoose from 'mongoose';

const taximanSchema = new mongoose.Schema({
    name: { type: String, required: true },
    phone: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    referralCode: { type: String, unique: true },
    balance: { type: Number, default: 0 },
    referrals: { type: Number, default: 0 },
    isActive: { type: Boolean, default: false }
}, { timestamps: true });

// C'est cette ligne qui manque ou qui est mal écrite :
const Taximan = mongoose.model('Taximan', taximanSchema);
export default Taximan;