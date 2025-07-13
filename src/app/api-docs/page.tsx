"use client";

import dynamic from "next/dynamic";
import { useEffect, useState } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import "swagger-ui-react/swagger-ui.css";

const SwaggerUI = dynamic(() => import("swagger-ui-react"), { ssr: false });

export default function ApiDocs() {
  const [spec, setSpec] = useState(null);

  useEffect(() => {
    fetch("/api/docs")
      .then((response) => response.json())
      .then((data) => setSpec(data))
      .catch((error) => {});
  }, []);

  if (!spec) {
    return (
      <div className="container mx-auto p-4">
        <div className="mb-6">
          <Skeleton className="h-8 w-96 mb-2" />
          <Skeleton className="h-4 w-2/3" />
        </div>
        <div className="space-y-4">
          <Skeleton className="h-64 w-full" />
          <Skeleton className="h-32 w-full" />
          <Skeleton className="h-48 w-full" />
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          RockStack API Documentation
        </h1>
        <p className="text-gray-600">
          Documentación completa de los endpoints de autenticación y gestión de usuarios.
        </p>
      </div>
      <SwaggerUI spec={spec} />
    </div>
  );
} 