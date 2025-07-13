import { NextResponse } from "next/server";
import { logger } from "./logger";

export interface ApiResponse<T = any> {
  data?: T;
  error?: string;
  message?: string;
}

export function createApiResponse<T>(
  data: T,
  status: number = 200,
  message?: string
): NextResponse<ApiResponse<T>> {
  return NextResponse.json(
    { data, message },
    { status }
  );
}

export function createErrorResponse(
  error: unknown,
  status: number = 500,
  context?: string
): NextResponse<ApiResponse> {
  const errorMessage = error instanceof Error ? error.message : "Error interno del servidor";
  
  if (context) {
    logger.error(errorMessage, context, error);
  }
  
  return NextResponse.json(
    { error: errorMessage },
    { status }
  );
}

export function createValidationErrorResponse(
  error: unknown,
  context?: string
): NextResponse<ApiResponse> {
  if (error instanceof Error && error.name === "ZodError") {
    return NextResponse.json(
      { 
        error: "Datos inválidos", 
        details: (error as any).errors 
      },
      { status: 400 }
    );
  }
  
  return createErrorResponse(error, 400, context);
}

export function parseQueryParams(request: Request) {
  const { searchParams } = new URL(request.url);
  return {
    page: parseInt(searchParams.get("page") || "1", 10),
    limit: parseInt(searchParams.get("limit") || "12", 10),
    query: searchParams.get("query") || "",
  };
} 