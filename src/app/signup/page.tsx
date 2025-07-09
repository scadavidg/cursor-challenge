import { SignUpForm } from "@/components/auth/signup-form";
import { Music2 } from "lucide-react";

export default function SignUpPage() {
  return (
    <div className="flex min-h-full flex-col justify-center py-12 sm:px-6 lg:px-8 animate-fade-in">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <Music2 className="mx-auto h-12 w-auto text-primary" />
        <h2 className="mt-6 text-center text-3xl font-bold font-headline tracking-tight text-foreground">
          Create your account
        </h2>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <SignUpForm />
      </div>
    </div>
  );
}
