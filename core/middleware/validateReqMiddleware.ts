import { z, ZodType } from "zod";
import { Request, Response, NextFunction } from "express";
//import { ErrorServidor } from "../errors/errorServidor/errorServidor";

export const middlewareValidationBody = (Schemas: ZodType) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      await Schemas.parseAsync(req.body);

      next();
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({
          message: "Dados inválidos",
          details: error.issues.map((issue) => ({
            campo: issue.path.join("."),
            message: issue.message,
          })),
        });
      }

      return next(error);
    }
  };
};
