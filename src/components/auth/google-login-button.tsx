"use client";

import { signIn } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { FcGoogle } from "react-icons/fc";
import { useState } from "react";

interface GoogleLoginButtonProps {
  className?: string;
  variant?: "default" | "outline" | "secondary" | "ghost" | "link" | "destructive";
  size?: "default" | "sm" | "lg" | "icon";
  children?: React.ReactNode;
}

export function GoogleLoginButton({
  className,
  variant = "outline",
  size = "default",
  children = "Continuar con Google"
}: GoogleLoginButtonProps) {
  const [isLoading, setIsLoading] = useState(false);

  const handleGoogleLogin = async () => {
    setIsLoading(true);
    try {
      await signIn("google", {
        callbackUrl: "/home",
        redirect: true,
      });
    } catch (error) {
      console.error("Error al iniciar sesión con Google:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Button
      variant={variant}
      size={size}
      className={className}
      onClick={handleGoogleLogin}
      disabled={isLoading}
    >
      <FcGoogle className="mr-2 h-4 w-4" />
      {isLoading ? "Conectando..." : children}
    </Button>
  );
} 