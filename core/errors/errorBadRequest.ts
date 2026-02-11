import { AppError } from "./AppError";

export class RequestBadlyFormatted extends AppError {
  constructor(message = "") {
    super(message, 400);
  }
}
