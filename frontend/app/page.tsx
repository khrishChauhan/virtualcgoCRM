/**
 * app/page.tsx — Root page
 *
 * Redirects visitors based on auth state:
 * - The middleware handles the actual redirect logic at the Edge.
 * - This page simply redirects to /login as a fallback.
 * - Authenticated users going to / will be caught by middleware → /dashboard.
 */

import { redirect } from 'next/navigation';

export default function RootPage() {
  redirect('/login');
}
