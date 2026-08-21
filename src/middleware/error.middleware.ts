import { NextFunction, Request, Response } from 'express';
import mongoose from 'mongoose';

export class AppError extends Error {
  statusCode: number;
  code?: string;

  constructor(message: string, statusCode: number, code?: string) {
    super(message);

    this.statusCode = statusCode;
    this.code = code;

    Error.captureStackTrace(this, this.constructor);
  }
}

export function errorMiddleware(
  err: unknown,
  req: Request,
  res: Response,
  _next: NextFunction,
) {
  console.error(err);

  if (err instanceof AppError) {
    return res.status(err.statusCode).json({
      success: false,
      message: err.message,
      ...(err.code && { code: err.code }),
    });
  }

  // Invalid MongoDB ObjectId
  if (err instanceof mongoose.Error.CastError && err.path === '_id') {
    return res.status(400).json({
      success: false,
      message: 'Invalid ID',
      code: 'INVALID_ID',
    });
  }

  // MongoDB / Mongoose validation error
  if (err instanceof mongoose.Error.ValidationError) {
    return res.status(400).json({
      success: false,
      message: 'Database validation failed',
      code: 'DATABASE_VALIDATION_ERROR',
    });
  }

  // Duplicate MongoDB value
  if (
    typeof err === 'object' &&
    err !== null &&
    'code' in err &&
    err.code === 11000
  ) {
    return res.status(409).json({
      success: false,
      message: 'Resource already exists',
      code: 'DUPLICATE_RESOURCE',
    });
  }

  // Unknown/unexpected error
  return res.status(500).json({
    success: false,
    message: 'Internal server error',
    code: 'INTERNAL_SERVER_ERROR',
  });
}
