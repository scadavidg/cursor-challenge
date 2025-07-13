"use client";

import Link from "next/link";
import { useAuth } from "@/contexts/auth-context";
import { Button } from "@/components/ui/button";
import { Music2, LogOut } from "lucide-react";
import { useRouter } from "next/navigation";
import { usePathname } from "next/navigation";

export function Header() {
  const { isAuthenticated, logout, user } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  // Only show header on home and favorites pages for authenticated users
  if (!isAuthenticated || (pathname !== '/home' && pathname !== '/favorites')) {
    return null;
  }

  // Obtener el primer nombre del usuario
  let firstName = "";
  if (user?.name) {
    firstName = user.name.split(" ")[0];
  } else if (user?.email) {
    firstName = user.email.split("@")[0];
  }

  return (
    <header className="bg-card border-b sticky top-0 z-50">
      <div className="container mx-auto flex items-center justify-between p-4 px-2 sm:px-4">
        <Link href="/home" className="flex items-center gap-2" aria-label="RockStack Home">
          <Music2 className="h-6 w-6 sm:h-8 sm:w-8 text-primary" />
          <span className="text-lg sm:text-2xl font-headline font-bold">
            RockStack{firstName ? ` ${firstName}` : ""}
          </span>
        </Link>
        {/* Responsive nav */}
        <nav className="flex items-center gap-1 sm:gap-2">
          <Button 
            variant="ghost" 
            size="sm" 
            className="text-xs sm:text-sm px-2 sm:px-4"
            onClick={() => router.push('/home')}
          >
            Home
          </Button>
          <Button 
            variant="ghost" 
            size="sm" 
            className="text-xs sm:text-sm px-2 sm:px-4"
            onClick={() => router.push('/favorites')}
          >
            Favoritos
          </Button>
          <Button 
            variant="ghost" 
            size="sm" 
            className="text-xs sm:text-sm px-2 sm:px-4"
            onClick={logout}
          >
            <LogOut className="mr-1 h-3 w-3 sm:mr-2 sm:h-4 sm:w-4" />
            <span className="hidden sm:inline">Sign out</span>
          </Button>
        </nav>
      </div>
    </header>
  );
}
