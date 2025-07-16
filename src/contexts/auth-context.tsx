"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { useRouter } from "next/navigation";
import { signIn, signOut, useSession } from "next-auth/react";
import { AlertDialog, AlertDialogContent, AlertDialogHeader, AlertDialogTitle, AlertDialogDescription, AlertDialogAction } from "@/components/ui/alert-dialog";

interface AuthContextType {
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  isLoading: boolean;
  user: any;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const { data: session, status, update } = useSession();
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [showExpiringModal, setShowExpiringModal] = useState(false);
  const router = useRouter();

  useEffect(() => {
    setIsLoading(status === "loading");
  }, [status]);

  // Redirige automáticamente si la sesión está activa y estás en /login
  useEffect(() => {
    if (session && typeof window !== "undefined" && window.location.pathname === "/login") {
      router.push("/home");
    }
  }, [session, router]);

  useEffect(() => {
    if (status === "unauthenticated" && typeof window !== "undefined" && window.location.pathname !== "/login") {
      router.push("/login");
    }
  }, [status, router]);

  // Mostrar modal 1 minuto antes de la expiración de la sesión
  useEffect(() => {
    if (!session || !session.expires) return;
    const expiresAt = new Date(session.expires).getTime();
    const now = Date.now();
    const msUntilWarning = expiresAt - now - 60_000; // 1 minuto antes
    if (msUntilWarning > 0) {
      const timeout = setTimeout(() => setShowExpiringModal(true), msUntilWarning);
      return () => clearTimeout(timeout);
    } else if (expiresAt - now > 0) {
      setShowExpiringModal(true);
    }
  }, [session]);

  const login = async (email: string, password: string) => {
    try {
      const result = await signIn("credentials", {
        email,
        password,
        redirect: false,
      });

      if (result?.error) {
        throw new Error(result.error);
      }
      // No redirigir aquí
    } catch (error) {
      throw error;
    }
  };

  const logout = async () => {
    await signOut({ redirect: false });
    router.push("/login");
  };

  return (
    <AuthContext.Provider value={{ 
      isAuthenticated: !!session, 
      login, 
      logout, 
      isLoading,
      user: session?.user 
    }}>
      {children}
      <AlertDialog open={showExpiringModal} onOpenChange={setShowExpiringModal}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Tu sesión está por expirar</AlertDialogTitle>
            <AlertDialogDescription>
              Por seguridad, tu sesión se cerrará automáticamente en 1 minuto. Guarda tu trabajo si es necesario.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <div className="flex gap-2 justify-end mt-4">
            <AlertDialogAction onClick={() => setShowExpiringModal(false)} autoFocus>Aceptar</AlertDialogAction>
            <AlertDialogAction
              onClick={async () => {
                await update();
                setShowExpiringModal(false);
              }}
            >Renovar sesión</AlertDialogAction>
          </div>
        </AlertDialogContent>
      </AlertDialog>
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
