import { connectToDatabase } from '@/lib/db';
import Reservation from '@/models/Reservation';

const DEFAULT_SLOT_CAPACITY = 40;
const MAX_SLOT_CAPACITY = 200;
const DUPLICATE_WINDOW_MS = 2 * 60_000;
const ACTIVE_STATUSES = ['pending', 'confirmed', 'seated'];

export function getSlotCapacity() {
  const parsed = Number.parseInt(process.env.RESERVATION_SLOT_CAPACITY ?? '', 10);
  if (!Number.isFinite(parsed) || parsed <= 0) return DEFAULT_SLOT_CAPACITY;
  return Math.min(parsed, MAX_SLOT_CAPACITY);
}

export type SlotCheckInput = {
  email: string;
  date: Date;
  time: string;
  guests: number;
  excludeId?: string;
};

export type SlotCheckResult = { available: true } | { available: false; reason: 'slot_full' | 'duplicate' };

export async function checkSlotAvailability(input: SlotCheckInput): Promise<SlotCheckResult> {
  await connectToDatabase();

  const capacity = getSlotCapacity();
  const slotQuery = {
    date: input.date,
    time: input.time,
    status: { $in: ACTIVE_STATUSES },
    ...(input.excludeId ? { _id: { $ne: input.excludeId } } : {})
  };

  const active = await Reservation.find(slotQuery).select({ guests: 1 }).lean<Array<{ guests: number }>>();
  const bookedGuests = active.reduce((total, item) => total + (item.guests ?? 0), 0);
  if (bookedGuests + input.guests > capacity) {
    return { available: false, reason: 'slot_full' };
  }

  if (!input.excludeId) {
    const duplicate = await Reservation.findOne({
      email: input.email,
      date: input.date,
      time: input.time,
      status: { $in: ['pending', 'confirmed'] },
      createdAt: { $gte: new Date(Date.now() - DUPLICATE_WINDOW_MS) }
    })
      .select({ _id: 1 })
      .lean();
    if (duplicate) {
      return { available: false, reason: 'duplicate' };
    }
  }

  return { available: true };
}
