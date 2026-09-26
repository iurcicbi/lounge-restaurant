import { model, models, Schema } from 'mongoose';

const adminSchema = new Schema(
  {
    email: { type: String, required: true, unique: true, trim: true, lowercase: true },
    name: { type: String, default: 'Noir Concierge' },
    passwordHash: { type: String, required: true },
    role: { type: String, enum: ['admin', 'concierge'], default: 'admin' }
  },
  { timestamps: true }
);

const Admin = models.Admin || model('Admin', adminSchema);

export default Admin;
