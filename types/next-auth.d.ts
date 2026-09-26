import { DefaultSession } from 'next-auth';

type UserRole = 'admin' | 'concierge';

declare module 'next-auth' {
  interface Session {
    user: {
      id?: string;
      role?: UserRole;
    } & DefaultSession['user'];
  }

  interface User {
    role?: UserRole;
    stamp?: string;
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    role?: UserRole;
    stamp?: string;
  }
}
