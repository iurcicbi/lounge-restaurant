import 'dotenv/config';
import mongoose from 'mongoose';
import { menuItems } from '../lib/content';
import MenuItem from '../models/MenuItem';
import Admin from '../models/Admin';

const force = process.argv.includes('--force');

async function seedStaff() {
  const envLoginEmail = process.env.ADMIN_EMAIL?.trim().toLowerCase() ?? '';
  const envLoginHash = process.env.ADMIN_PASSWORD_HASH?.trim() ?? '';

  const email = (process.env.SEED_ADMIN_EMAIL ?? envLoginEmail).trim().toLowerCase();
  const passwordHash = (process.env.SEED_ADMIN_PASSWORD_HASH ?? envLoginHash).trim();

  if (!email && !passwordHash) {
    process.stdout.write('Nessun account staff da creare: imposta SEED_ADMIN_EMAIL e SEED_ADMIN_PASSWORD_HASH.\n');
    return;
  }
  if (!email || !passwordHash) {
    throw new Error('SEED_ADMIN_EMAIL e SEED_ADMIN_PASSWORD_HASH devono essere valorizzate insieme.');
  }
  if (!/^\$2[aby]\$\d{2}\$/.test(passwordHash)) {
    throw new Error('SEED_ADMIN_PASSWORD_HASH non sembra un hash bcrypt (atteso formato $2b$12$...).');
  }

  const existing = await Admin.findOne({ email }).select({ _id: 1 }).lean();
  if (existing && !force) {
    process.stdout.write(
      `Account staff già presente per ${email}: password non modificata. Usa --force con un nuovo hash per cambiarla.\n`
    );
  } else {
    await Admin.findOneAndUpdate(
      { email },
      { $set: { name: 'Noir Concierge', passwordHash, role: 'admin' } },
      { upsert: true, new: true, setDefaultsOnInsert: true }
    );
    process.stdout.write(`Account staff pronto: ${email}\n`);
  }

  if (envLoginEmail === email) {
    process.stdout.write(
      'Attenzione: le credenzali di login da variabile d\'ambiente hanno la precedenza su questo account. ' +
        'Rimuovi ADMIN_EMAIL e ADMIN_PASSWORD_HASH per usare solo l\'account MongoDB.\n'
    );
  }
}

async function seedMenu() {
  for (let index = 0; index < menuItems.length; index += 1) {
    const item = menuItems[index];
    const seedItem: Record<string, unknown> = { ...item, sortOrder: index };
    if (typeof seedItem.available !== 'boolean') delete seedItem.available;
    await MenuItem.findOneAndUpdate(
      { name: item.name },
      { $set: seedItem, $setOnInsert: { available: true } },
      { upsert: true, new: true, setDefaultsOnInsert: true }
    );
  }
  process.stdout.write(`Menu inizializzato: ${menuItems.length} elementi\n`);
}

async function seed() {
  const uri = process.env.MONGODB_URI;
  if (!uri) throw new Error('MONGODB_URI non configurata');
  if (process.env.ADMIN_PASSWORD) {
    throw new Error(
      'ADMIN_PASSWORD non è supportata: genera un hash con `npm run db:hash` e usa SEED_ADMIN_PASSWORD_HASH.'
    );
  }

  await mongoose.connect(uri);
  await seedStaff();
  await seedMenu();
  await mongoose.disconnect();
}

seed().catch(async (error) => {
  process.stderr.write(`${error instanceof Error ? error.message : 'Errore seed'}\n`);
  await mongoose.disconnect();
  process.exit(1);
});
