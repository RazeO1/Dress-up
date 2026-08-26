export class AppError extends Error {
  readonly status: number;
  readonly code: string;
  readonly expose: boolean;

  constructor(opts: { message: string; status: number; code: string; expose?: boolean }) {
    super(opts.message);
    this.name = this.constructor.name;
    this.status = opts.status;
    this.code = opts.code;
    this.expose = opts.expose ?? true;
  }
}

export class ValidationError extends AppError {
  constructor(message = 'Invalid input', public details?: unknown) {
    super({ message, status: 400, code: 'validation_error' });
  }
}

export class UnauthorizedError extends AppError {
  constructor(message = 'Not authenticated') {
    super({ message, status: 401, code: 'unauthorized' });
  }
}

export class ForbiddenError extends AppError {
  constructor(message = 'Not found') {
    super({ message, status: 404, code: 'not_found' });
  }
}

export class ConflictError extends AppError {
  constructor(message = 'Conflict') {
    super({ message, status: 409, code: 'conflict' });
  }
}

export class RateLimitedError extends AppError {
  constructor(message = 'Too many requests') {
    super({ message, status: 429, code: 'rate_limited' });
  }
}
