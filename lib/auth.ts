import type { NextAuthOptions, Session } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import bcrypt from 'bcryptjs';
import mongoose from 'mongoose';
import { createHash } from 'node:crypto';
import { connectToDatabase } from '@/lib/db';
import { assertAuthConfiguration, getAuthSecret, isProduction } from '@/lib/env';
import { authThrottleKey, clearAuthFailures, getClientIp, isAuthBlocked, registerAuthFailure } from '@/lib/rate-limit';
import Admin from '@/models/Admin';

export type StaffRole = 'admin' | 'concierge';

export type StaffCapability =
  | 'reservations:read'
  | 'reservations:write'
  | 'reservations:delete'
  | 'menu:read'
  | 'menu:write';

const CAPABILITIES: Record<StaffRole, StaffCapability[]> = {
  admin: ['reservations:read', 'reservations:write', 'reservations:delete', 'menu:read', 'menu:write'],
  concierge: ['reservations:read', 'reservations:write', 'menu:read']
};

const ENV_ADMIN_ID = 'env-admin';
const SESSION_MAX_AGE_SECONDS = 60 * 60;
const REVALIDATION_INTERVAL_MS = 5 * 60_000;
const REVALIDATION_CACHE_LIMIT = 5_000;
const EMAIL_PATTERN = /^[^\s@]{1,64}@[^\s@.]+(\.[^\s@.]+)+$/;
const TIMING_EQUALIZER_HASH = '$2a$12$i3uzQ5tiQjnzDrTAhflYuuqJtWcYKHUZxCWq6cDLoj82hUolxqpbm';

const lastVerifiedAt = new Map<string, number>();

function envAdminStamp() {
  const hash = process.env.ADMIN_PASSWORD_HASH?.trim() ?? '';
  if (!hash) return ENV_ADMIN_ID;
  return createHash('sha256').update(hash).digest('hex').slice(0, 16);
}

function claimRevalidation(subject: string) {
  const now = Date.now();
  if (now - (lastVerifiedAt.get(subject) ?? 0) < REVALIDATION_INTERVAL_MS) return false;
  if (lastVerifiedAt.size >= REVALIDATION_CACHE_LIMIT) {
    lastVerifiedAt.forEach((value, key) => {
      if (now - value >= REVALIDATION_INTERVAL_MS) lastVerifiedAt.delete(key);
    });
  }
  lastVerifiedAt.set(subject, now);
  return true;
}

export function isStaffRole(value: unknown): value is StaffRole {
  return value === 'admin' || value === 'concierge';
}

export function isStaffSession(session: Session | null) {
  return isStaffRole(session?.user?.role);
}

export function hasCapability(session: Session | null, capability: StaffCapability) {
  const role = session?.user?.role;
  return isStaffRole(role) && CAPABILITIES[role].includes(capability);
}

type StaffRecord = {
  role: StaffRole;
  stamp: string;
  name: string;
};

type StaffLookup = StaffRecord | null | 'unavailable';

async function loadStaffRecord(id: string | undefined, email: string | undefined): Promise<StaffLookup> {
  if (id === ENV_ADMIN_ID) {
    const envEmail = process.env.ADMIN_EMAIL?.trim().toLowerCase();
    if (!envEmail || !email || envEmail !== email.trim().toLowerCase()) return null;
    return { role: 'admin', stamp: envAdminStamp(), name: 'Noir Concierge' };
  }

  if (!id || !mongoose.isValidObjectId(id)) return null;

  try {
    await connectToDatabase();
    const admin = await Admin.findById(id).select({ role: 1, updatedAt: 1 }).lean<{
      role?: string;
      updatedAt?: Date;
    }>();
    if (!admin) return null;
    const role = admin.role;
    if (!isStaffRole(role)) return null;
    return {
      role,
      stamp: admin.updatedAt ? new Date(admin.updatedAt).toISOString() : 'unknown',
      name: 'Noir Concierge'
    };
  } catch (error) {
    process.stderr.write(
      `Noir Lounge: rivalidazione sessione non riuscita. ${error instanceof Error ? error.message : 'errore sconosciuto'}\n`
    );
    return 'unavailable';
  }
}

function readCredentials(credentials: Record<string, string> | undefined) {
  const email = credentials?.email?.trim().toLowerCase() ?? '';
  const password = typeof credentials?.password === 'string' ? credentials.password : '';
  if (!email || !password) return null;
  if (email.length > 160 || !EMAIL_PATTERN.test(email)) return null;
  if (password.length < 8 || password.length > 200) return null;
  return { email, password };
}

export const authOptions: NextAuthOptions = {
  session: {
    strategy: 'jwt',
    maxAge: SESSION_MAX_AGE_SECONDS
  },
  jwt: {
    maxAge: SESSION_MAX_AGE_SECONDS
  },
  useSecureCookies: isProduction,
  pages: {
    signIn: '/admin/login'
  },
  providers: [
    CredentialsProvider({
      name: 'Noir Concierge',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' }
      },
      async authorize(credentials, request) {
        assertAuthConfiguration();

        const parsed = readCredentials(credentials);
        if (!parsed) return null;

        const { email, password } = parsed;
        const throttleKey = authThrottleKey(getClientIp(request?.headers), email);
        if (!isAuthBlocked(throttleKey).allowed) {
          process.stderr.write('Noir Lounge: accesso bloccato, troppi tentativi falliti.\n');
          return null;
        }

        const envEmail = process.env.ADMIN_EMAIL?.trim().toLowerCase();
        const envHash = process.env.ADMIN_PASSWORD_HASH;

        if (envEmail && envHash && email === envEmail) {
          if (await bcrypt.compare(password, envHash)) {
            clearAuthFailures(throttleKey);
            return { id: ENV_ADMIN_ID, name: 'Noir Concierge', email, role: 'admin', stamp: envAdminStamp() };
          }
        } else {
          try {
            await connectToDatabase();
            const admin = await Admin.findOne({ email }).lean<{
              _id: { toString(): string };
              name: string;
              email: string;
              passwordHash: string;
              role: string;
              updatedAt?: Date;
            }>();
            const passwordHash = admin?.passwordHash;
            const matches =
              typeof passwordHash === 'string' && (await bcrypt.compare(password, passwordHash));
            if (admin && matches && isStaffRole(admin.role)) {
              clearAuthFailures(throttleKey);
              return {
                id: admin._id.toString(),
                name: admin.name,
                email: admin.email,
                role: admin.role,
                stamp: admin.updatedAt ? new Date(admin.updatedAt).toISOString() : 'unknown'
              };
            }
          } catch {
            await bcrypt.compare(password, TIMING_EQUALIZER_HASH);
          }
        }

        registerAuthFailure(throttleKey);
        return null;
      }
    })
  ],
  callbacks: {
    async jwt({ token, user }) {
      assertAuthConfiguration();

      if (user) {
        const role = isStaffRole(user.role) ? user.role : null;
        if (role) {
          token.role = role;
          token.stamp = typeof user.stamp === 'string' ? user.stamp : undefined;
        }
        if (typeof user.id === 'string') claimRevalidation(user.id);
        return token;
      }

      if (!isStaffRole(token.role) || !token.sub || !claimRevalidation(token.sub)) {
        return token;
      }

      const record = await loadStaffRecord(token.sub, token.email ?? undefined);
      if (record === null) {
        token.role = undefined;
        token.stamp = undefined;
        return token;
      }
      if (record === 'unavailable') {
        return token;
      }

      if (record.stamp !== token.stamp || record.role !== token.role) {
        token.role = record.role;
        token.stamp = record.stamp;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.role = isStaffRole(token.role) ? token.role : undefined;
        session.user.id = token.sub;
      }
      return session;
    }
  },
  secret: getAuthSecret()
};
