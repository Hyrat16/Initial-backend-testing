import { Request, Response, NextFunction } from "express";
import { ErrorServidor } from "../errors/errorServidor/errorServidor";
import { AppError } from "../errors/AppError";
import { RentalInput, RentalOutput } from "../types/typeCreateUser";
import { RentalService } from "../services/userCreateRental";
import { createSchemaRentalOutput } from "../schemas/rental.schema";
import { z } from "zod";

const serviceRental = new RentalService();

export class Rentalcontroller {
  async createRental(req: Request, res: Response, next: NextFunction) {
    try {
      const dataValueRental: RentalInput = req.body;

      //console.log(dataValueRental);
      const rental = await serviceRental.createRentalService(dataValueRental);

      return res.status(201).json({
        message: "Dados enviados com sucesso",
        result: rental,
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

  async LocatingbyId(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const rentFoundById = await serviceRental.rentalByID(id);

      return res.status(200).json({
        result: rentFoundById,
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

  /*   async listingRegisteredRental(
    req: Request,
    res: Response,
    next: NextFunction,
  ) {
    try {
      const listRental = await serviceRental.getListDataRentalService();

      //console.log(listRental);

      return res.status(200).json({
        message: "Segue a lista de motos cadastradas",
        result: listRental,
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
  } */

  async uptadeDateReturn(req: Request, res: Response, next: NextFunction) {
    const validationDate = createSchemaRentalOutput.pick({
      returnDate: true,
    });

    //type date = z.infer<typeof validationDate>;
    try {
      const { id } = req.params;
      const { returnDate } = validationDate.parse(req.body);

      //console.log(id, returnDate);

      const serviceAttDate = await serviceRental.addingNewReturnDate(
        id,
        returnDate,
      );
      return res.status(200).json({
        message: "Segue a lista de motos cadastradas",
        result: serviceAttDate,
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
