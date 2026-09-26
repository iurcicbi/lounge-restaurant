import type { Metadata } from 'next';
import { getServerSession } from 'next-auth';
import { redirect } from 'next/navigation';
import { authOptions, hasCapability, isStaffSession } from '@/lib/auth';
import { AdminDashboard } from '@/components/admin-dashboard';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'Noir control room',
  robots: { index: false, follow: false, nocache: true }
};

export default async function AdminPage() {
  const session = await getServerSession(authOptions);
  if (!isStaffSession(session)) redirect('/admin/login');
  return (
    <AdminDashboard
      email={session?.user?.email || 'Noir Concierge'}
      canManageMenu={hasCapability(session, 'menu:write')}
    />
  );
}
