"use client";

import { Progress } from "@/components/ui/progress";
import { Check, X } from "lucide-react";

interface PasswordStrengthIndicatorProps {
  password: string;
}

interface StrengthCriteria {
  label: string;
  test: (password: string) => boolean;
}

const strengthCriteria: StrengthCriteria[] = [
  {
    label: "Al menos 8 caracteres",
    test: (password) => password.length >= 8,
  },
  {
    label: "Al menos una mayúscula",
    test: (password) => /[A-Z]/.test(password),
  },
  {
    label: "Al menos una minúscula",
    test: (password) => /[a-z]/.test(password),
  },
  {
    label: "Al menos un número",
    test: (password) => /\d/.test(password),
  },
  {
    label: "Al menos un símbolo",
    test: (password) => /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password),
  },
];

export function PasswordStrengthIndicator({ password }: PasswordStrengthIndicatorProps) {
  if (!password) return null;

  const metCriteria = strengthCriteria.filter(criteria => criteria.test(password));
  const strengthPercentage = (metCriteria.length / strengthCriteria.length) * 100;

  const getStrengthColor = (percentage: number) => {
    if (percentage <= 20) return "bg-red-500";
    if (percentage <= 40) return "bg-orange-500";
    if (percentage <= 60) return "bg-yellow-500";
    if (percentage <= 80) return "bg-blue-500";
    return "bg-green-500";
  };

  const getStrengthText = (percentage: number) => {
    if (percentage <= 20) return "Muy débil";
    if (percentage <= 40) return "Débil";
    if (percentage <= 60) return "Media";
    if (percentage <= 80) return "Fuerte";
    return "Muy fuerte";
  };

  return (
    <div className="space-y-3">
      <div className="space-y-2">
        <div className="flex justify-between text-sm">
          <span>Fortaleza de la contraseña</span>
          <span className="font-medium">{getStrengthText(strengthPercentage)}</span>
        </div>
        <div className="relative h-2 w-full overflow-hidden rounded-full bg-secondary">
          <div
            className={`h-full transition-all ${getStrengthColor(strengthPercentage)}`}
            style={{ width: `${strengthPercentage}%` }}
          />
        </div>
      </div>
      
      <div className="space-y-1">
        {strengthCriteria.map((criteria, index) => {
          const isMet = criteria.test(password);
          return (
            <div key={index} className="flex items-center gap-2 text-xs">
              {isMet ? (
                <Check className="h-3 w-3 text-green-500" />
              ) : (
                <X className="h-3 w-3 text-red-500" />
              )}
              <span className={isMet ? "text-green-700" : "text-red-700"}>
                {criteria.label}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
} 