import { model, models, Schema } from 'mongoose';

const menuItemSchema = new Schema(
  {
    name: { type: String, required: true, trim: true, maxlength: 100 },
    description: { type: String, required: true, trim: true, maxlength: 500 },
    price: { type: Number, required: true, min: 0 },
    category: { type: String, enum: ['cucina', 'cocktails', 'shisha'], required: true, index: true },
    image: { type: String, trim: true, default: '' },
    tags: { type: [String], default: [] },
    pairing: { type: String, trim: true, maxlength: 120, default: '' },
    available: { type: Boolean, default: true },
    sortOrder: { type: Number, default: 0 }
  },
  { timestamps: true }
);

const MenuItem = models.MenuItem || model('MenuItem', menuItemSchema);

export default MenuItem;
