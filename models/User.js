import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const userSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true, maxlength: 80 },
  email: { type: String, required: true, unique: true, lowercase: true, trim: true },
  password: { type: String, required: true, minlength: 6, select: false },
  role: { type: String, enum: ['customer', 'admin'], default: 'customer' },
  phone: { type: String, trim: true, default: '' },
  address: {
    street: { type: String, default: '' }, city: { type: String, default: '' },
    state: { type: String, default: '' }, postalCode: { type: String, default: '' }, country: { type: String, default: 'India' }
  }
}, { timestamps: true });

userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 12);
  next();
});

userSchema.methods.matchPassword = function(candidate) { return bcrypt.compare(candidate, this.password); };

export default mongoose.model('User', userSchema);
