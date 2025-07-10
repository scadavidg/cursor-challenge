"use client";

import Link from "next/link";
import { useAuth } from "@/contexts/auth-context";
import { Button } from "@/components/ui/button";
import { Music2, LogOut, LoaderCircle } from "lucide-react";
import { useRouter } from "next/navigation";
import { usePathname } from "next/navigation";

export function Header() {
  const { isAuthenticated, logout } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  // Only show header on home and favorites pages for authenticated users
  if (!isAuthenticated || (pathname !== '/home' && pathname !== '/favorites')) {
    return null;
  }

  return (
    <header className="bg-card border-b sticky top-0 z-50">
      <div className="container mx-auto flex items-center justify-between p-4">
        <Link href="/home" className="flex items-center gap-2" aria-label="TuneStack Home">
          <Music2 className="h-8 w-8 text-primary" />
          <span className="text-2xl font-headline font-bold">TuneStack</span>
        </Link>
        <nav>
          <div className="flex items-center gap-2">
            <Button variant="ghost" onClick={() => router.push('/home')}>Home</Button>
            <Button variant="ghost" onClick={() => router.push('/favorites')}>Favoritos</Button>
            <Button variant="ghost" onClick={logout}>
              <LogOut className="mr-2 h-4 w-4" />
              Sign out
            </Button>
          </div>
        </nav>
      </div>
    </header>
  );
}
