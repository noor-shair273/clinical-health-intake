import { Request, Response, NextFunction } from "express";

export function errorHandler(err: any, req: Request, res: Response, next: NextFunction) {
  console.error("Error:", err);

  // Handle errors with explicit status code
  if (err.statusCode) {
    return res.status(err.statusCode).json({
      success: false,
      error: err.name || "Error",
      message: err.message
    });
  }

  // Handle validation errors 
  if (err.isValidationError) {
    return res.status(400).json({
      success: false,
      error: "ValidationError",
      details: err.errors,
      message: err.message

    });
  }

  // Default fallback (500)
  return res.status(500).json({
    success: false,
    error: "InternalServerError",
    message: err.message || "Something went wrong"
  });
}

