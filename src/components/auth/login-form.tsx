"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import Link from "next/link";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { useAuth } from "@/contexts/auth-context";
import { useToast } from "@/hooks/use-toast";
import { Music } from "lucide-react";
import { PasswordInput } from "./password-input";
import { AuthFormSkeleton } from "@/components/ui/skeleton";

const formSchema = z.object({
  email: z.string().min(1, { message: "El correo es obligatorio." }).email({ message: "Correo electrónico inválido." }),
  password: z.string().min(1, { message: "La contraseña es obligatoria." }).min(6, { message: "La contraseña debe tener al menos 6 caracteres." }),
});

export function LoginForm() {
  const [isLoading, setIsLoading] = useState(false);
  const { login, isLoading: authLoading } = useAuth();
  const { toast } = useToast();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  if (authLoading) {
    return <AuthFormSkeleton />;
  }

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true);
    
    try {
      await login(values.email, values.password);
      toast({
        title: "Inicio de sesión exitoso",
        description: "¡Bienvenido de vuelta!",
      });
    } catch (error: any) {
      let description = error.message || "Credenciales inválidas";
      if (
        description === "CredentialsSignin" ||
        description.toLowerCase().includes("credentials")
      ) {
        description = "Correo o contraseña incorrectos. Por favor, verifica tus datos e inténtalo de nuevo.";
      }
      toast({
        title: "Error de inicio de sesión",
        description,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <Card>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <CardContent className="space-y-4 pt-6">
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Correo electrónico</FormLabel>
                  <FormControl>
                    <Input placeholder="tucorreo@ejemplo.com" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Contraseña</FormLabel>
                  <FormControl>
                    <PasswordInput placeholder="••••••••" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </CardContent>
          <CardFooter className="flex flex-col gap-4">
            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading && <Music className="mr-2 h-4 w-4 animate-spin" />}
              Iniciar sesión
            </Button>
            <div className="text-center space-y-2">
              <p className="text-sm text-muted-foreground">
                ¿No tienes una cuenta?{" "}
                <Button variant="link" asChild className="p-0 h-auto">
                  <Link href="/signup">Regístrate</Link>
                </Button>
              </p>
              <p className="text-xs text-muted-foreground">
                Crea una cuenta para probar la aplicación
              </p>
              <p className="text-xs text-muted-foreground">
                ¿Olvidaste tu contraseña?{" "}
                <Button variant="link" asChild className="p-0 h-auto text-xs">
                  <Link href="/forgot-password">Recupérala aquí</Link>
                </Button>
              </p>
            </div>
          </CardFooter>
        </form>
      </Form>
    </Card>
  );
}
