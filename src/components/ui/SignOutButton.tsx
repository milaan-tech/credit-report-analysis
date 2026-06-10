'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';

export function SignOutButton() {
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const supabase = createClient();

  const handleSignOut = async () => {
    setLoading(true);
    await supabase.auth.signOut();
    router.push('/login');
  };

  return (
    <button
      onClick={handleSignOut}
      disabled={loading}
      className="btn btn-ghost"
      style={{ fontSize: 13, padding: '7px 14px', height: 36 }}
    >
      {loading ? 'Signing out…' : 'Sign Out'}
    </button>
  );
}
