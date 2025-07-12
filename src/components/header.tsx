"use client";

import Link from "next/link";
import { useAuth } from "@/contexts/auth-context";
import { Button } from "@/components/ui/button";
import { Music2, LogOut, Menu } from "lucide-react";
import { useRouter } from "next/navigation";
import { usePathname } from "next/navigation";
import * as React from "react";
import { Dialog, DialogContent } from "@/components/ui/dialog";

export function Header() {
  const { isAuthenticated, logout, user } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = React.useState(false);

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
          <Music2 className="h-8 w-8 text-primary" />
          <span className="text-2xl font-headline font-bold">
            RockStack{firstName ? ` ${firstName}` : ""}
          </span>
        </Link>
        {/* Desktop nav */}
        <nav className="hidden md:flex">
          <div className="flex items-center gap-2">
            <Button variant="ghost" onClick={() => router.push('/home')}>Home</Button>
            <Button variant="ghost" onClick={() => router.push('/favorites')}>Favoritos</Button>
            <Button variant="ghost" onClick={logout}>
              <LogOut className="mr-2 h-4 w-4" />
              Sign out
            </Button>
          </div>
        </nav>
        {/* Mobile hamburger */}
        <button
          className="md:hidden p-2 rounded focus:outline-none focus:ring-2 focus:ring-primary"
          aria-label="Abrir menú"
          onClick={() => setMenuOpen(true)}
        >
          <Menu className="h-7 w-7 text-primary" />
        </button>
        <Dialog open={menuOpen} onOpenChange={setMenuOpen}>
          <DialogContent className="p-0 w-[90vw] max-w-xs top-0 right-0 left-auto bottom-0 fixed h-full rounded-none sm:rounded-lg">
            <nav className="flex flex-col gap-2 p-6">
              <Button variant="ghost" className="justify-start" onClick={() => { router.push('/home'); setMenuOpen(false); }}>Home</Button>
              <Button variant="ghost" className="justify-start" onClick={() => { router.push('/favorites'); setMenuOpen(false); }}>Favoritos</Button>
              <Button variant="ghost" className="justify-start" onClick={() => { logout(); setMenuOpen(false); }}>
                <LogOut className="mr-2 h-4 w-4" />
                Sign out
              </Button>
            </nav>
          </DialogContent>
        </Dialog>
      </div>
    </header>
  );
}
