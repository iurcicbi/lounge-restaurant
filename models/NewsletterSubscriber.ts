import { model, models, Schema } from 'mongoose';

const newsletterSchema = new Schema(
  {
    email: { type: String, required: true, unique: true, trim: true, lowercase: true },
    consentAt: { type: Date, default: Date.now }
  },
  { timestamps: true }
);

const NewsletterSubscriber = models.NewsletterSubscriber || model('NewsletterSubscriber', newsletterSchema);

export default NewsletterSubscriber;
