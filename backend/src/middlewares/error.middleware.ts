import { NextFunction, Request, Response } from "express";
import { HttpError } from "@/types";

export function notFoundHandler(_req: Request, res: Response) {
  res.status(404).json({ error: "Ruta no encontrada" });
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export function errorHandler(err: Error, _req: Request, res: Response, _next: NextFunction) {
  const status = err instanceof HttpError ? err.status : 500;
  if (status === 500) {
    console.error(err);
  }
  res.status(status).json({ error: err.message || "Error interno del servidor" });
}
