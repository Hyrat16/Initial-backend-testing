import { Request, Response, NextFunction } from "express";
import { ErrorServidor } from "../errors/errorServidor/errorServidor";
import { AppError } from "../errors/AppError";
import { MotorcycleInput } from "../types/typeCreateUser";
import { UserMotorcycle } from "../services/userCreateMotorcycle";

const motorcycleService = new UserMotorcycle();

export class MotorcycleController {
  //Codigo responsavel por criar novos cadastro de motos
  async createMotorcycleController(
    req: Request,
    res: Response,
    next: NextFunction,
  ) {
    /* PT-BR
      Operaçao responsável por criar a moto a ser cadastrada no sistema da requisiçao.
      É necessário um user contendo:
      age: string;
      model: string;
      plate: string;

      Identifier: Será adicionada em camadas a frente.
      */

    /* 
      Operation responsible for removing a bush to be registered in the requisition system.
      A user must contain:
      age: rope;
      model: rope;
      board: string;

      Identifier: Will be added layered to the front.
      */

    try {
      const newUserMotorcycle: MotorcycleInput = req.body;

      const User = await motorcycleService.createMotorcycle(newUserMotorcycle);

      //Responsabilidade de

      return res.status(201).json({
        message: "A moto foi cadastrada",
        result: User,
        id: User.identifier,
      });
    } catch (error) {
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

  // Codigo resposável por buscar a lista completa de motos cadastradas
  async listingRegisteredMotorcycles(
    req: Request,
    res: Response,
    next: NextFunction,
  ) {
    try {
      const listAllMotorcycles = await motorcycleService.listMotorcycle();

      return res.status(200).json({
        message: "Lista de motos cadastradas",
        result: listAllMotorcycles,
      });
    } catch (error) {
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

  //Codigo responsavel por localizar via ID uma moto cadastrada
  async locatingMotoById(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;

      const serviceLocalizationMotoById =
        await motorcycleService.SearchingForAMotorcycle(id);

      return res.status(200).json({
        message: "Detalhes da moto",
        result: serviceLocalizationMotoById,
      });
    } catch (error) {
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

  //Codigo responsavel por localizar e modificar a placa via ID de uma moto cadastrada
  async modifyingPlateById(req: Request, res: Response, next: NextFunction) {
    try {
      const { plate } = req.body;
      const identifier = req.params.id;

      //console.log(plate);

      const serviceModifying = await motorcycleService.modifyingPlate(
        identifier,
        plate,
      );
      //console.log(loc);
      return res.status(200).json({
        message: "A placa modificada com sucesso",
        result: serviceModifying,
      });
    } catch (error) {
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

  async deletePlateById(req: Request, res: Response, next: NextFunction) {
    try {
      const identifier = req.params.id;
      const serviceDelete =
        await motorcycleService.deleteMotorcycleById(identifier);
      //const listAll = this.listingRegisteredMotorcycles;
      return res.status(200).json({
        message: "O cadastro da motocicleta foi excluido",
        //result: serviceDelete,
      });
    } catch (error) {
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
