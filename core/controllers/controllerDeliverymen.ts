import { Request, Response, NextFunction } from "express";
import { AppError } from "../errors/AppError";
import { UserService } from "../services/userCreateDeliveryment";
import { ErrorServidor } from "../errors/errorServidor/errorServidor";
import { DeliverymenInput } from "../types/typeCreateUser";

const taskService = new UserService();

export class DeliverymenController {
  async createUserDeliverymen(req: Request, res: Response, next: NextFunction) {
    try {
      //UserData is new deliverymen coming from request type DeliverymenTypes coming from ../types/typeCreateUserDeliveryment
      const userData: DeliverymenInput = req.body;

      //console.log(userData);

      //Responbility to call Service to create User
      const User = await taskService.create(userData);

      /*Formataçao para entregar ao usuario final.

      */
      return res.status(201).json({
        message: "O entregador foi criado",
        result: User,
      });
    } catch (error) {
      /*Erros de validaçoes para erro 500 - 400 respectivamente 
      Local de busca dos erros - "../errors/errorServidor/errorServidor";
      */
      if (error instanceof ErrorServidor) {
        return res.status(error.statusCode).json({
          status: "error Servidor",
          message: error.message,
        });
      }
      if (error instanceof AppError) {
        return res.status(error.statusCode).json({
          status: "error",
          message: error.message,
        });
      }
    }
  }
}
