import { AppError } from "../AppError";

export class ErrorServidor extends AppError {
  constructor(message = "Erro no servidor") {
    super(message, 500);
  }
}
