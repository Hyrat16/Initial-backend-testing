import { AppError } from "./AppError";

export class UserAlreadyRegistered extends AppError {
  constructor(message = "") {
    super(message, 409);
  }
}
