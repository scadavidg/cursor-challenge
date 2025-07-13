import { SignUpForm } from "@/components/auth/signup-form";
import { Music2 } from "lucide-react";

export default function SignUpPage() {
  return (
    <div className="flex min-h-full flex-col justify-center py-12 sm:px-6 lg:px-8 animate-fade-in">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="flex items-center justify-center gap-2 mb-4">
          <Music2 className="h-8 w-8 text-primary" />
          <h1 className="text-2xl font-bold text-primary">RockStack</h1>
        </div>
        <h2 className="text-center text-3xl font-bold font-headline tracking-tight text-foreground">
          Crea tu cuenta
        </h2>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <SignUpForm />
      </div>
    </div>
  );
}
