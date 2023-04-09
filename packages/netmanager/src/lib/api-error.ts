import { ErrorDetails } from './types'


export class APIError extends Error {
  readonly code: string;
  readonly details?: ErrorDetails;

  constructor(message: string, code: string, details?: ErrorDetails) {
    super(message);
    this.name = this.constructor.name;
    this.code = code;
    this.details = details;
    Object.setPrototypeOf(this, new.target.prototype);
  }
}

