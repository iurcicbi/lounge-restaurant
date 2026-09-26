import { model, models, Schema } from 'mongoose';

const reservationSchema = new Schema(
  {
    name: { type: String, required: true, trim: true, maxlength: 80 },
    email: { type: String, required: true, trim: true, lowercase: true, maxlength: 160 },
    phone: { type: String, required: true, trim: true, maxlength: 30 },
    date: { type: Date, required: true },
    time: { type: String, required: true },
    guests: { type: Number, required: true, min: 1, max: 20 },
    occasion: { type: String, trim: true, maxlength: 80, default: '' },
    notes: { type: String, trim: true, maxlength: 600, default: '' },
    status: { type: String, enum: ['pending', 'confirmed', 'seated', 'cancelled'], default: 'pending' },
    source: { type: String, enum: ['website', 'concierge'], default: 'website' }
  },
  { timestamps: true }
);

const Reservation = models.Reservation || model('Reservation', reservationSchema);

reservationSchema.index({ date: 1, time: 1, status: 1 });
reservationSchema.index({ status: 1, createdAt: -1 });
reservationSchema.index({ email: 1, date: 1, time: 1 });

export default Reservation;
