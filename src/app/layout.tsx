import type { Metadata } from "next";
import SessionProvider from "@/components/SessionProvider";
import { AuthProvider } from "@/contexts/auth-context";
import { Header } from "@/components/header";
import { Toaster } from "@/components/ui/toaster";
import { CacheInvalidationProvider, CacheDebugPanel } from "@/components";
import { FavoritesProvider } from "@/contexts/favorites-context";
import "./globals.css";

export const metadata: Metadata = {
  title: "RockStack",
  description: "Busca y guarda tus álbumes favoritos.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" className="h-full">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;700&family=Space+Grotesk:wght@500;700&family=Source+Code+Pro&display=swap" rel="stylesheet" />
      </head>
      <body className="font-body antialiased h-full">
        <SessionProvider>
          <AuthProvider>
            <FavoritesProvider>
              <CacheInvalidationProvider>
                <div className="flex flex-col h-full">
                  <Header />
                  <main className="flex-1 overflow-y-auto p-4 md:p-8">
                    {children}
                  </main>
                </div>
                <Toaster />
                <CacheDebugPanel />
              </CacheInvalidationProvider>
            </FavoritesProvider>
          </AuthProvider>
        </SessionProvider>
      </body>
    </html>
  );
}
