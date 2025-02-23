"use client"

import { isPublicRoute } from '@/config/routes';
import { useSession } from 'next-auth/react';
import { useRouter, usePathname } from 'next/navigation';
import { useEffect } from 'react';

interface RouteGuardProps {
  children: React.ReactNode;
}

export const RouteGuard: React.FC<RouteGuardProps> = ({ children }) => {
  const { data: session, status } = useSession();
  const router = useRouter();
  const path = usePathname();
  
  useEffect(() => {
    if (status === 'loading') return;
    
    if (!session && !isPublicRoute(path)) {
      router.push('/api/auth/signin');
    }
  }, [session, status, router]);

  if (status === 'loading') {
    return <div>Loading...</div>;
  }

  return (!session && !isPublicRoute(path)) ? null : <>{children}</>;
};
