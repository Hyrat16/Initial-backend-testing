import { Router } from "express";
import { middlewareValidationBody } from "../middleware/validateReqMiddleware";
import { MotorcycleController } from "../controllers/controllerMotorcycle";
import { createSchemaUserMotorcycleInput } from "../schemas/motorcycle.schema";

export const motorcycles = Router();
const createMotorcycleController = new MotorcycleController();

motorcycles.post(
  "/",
  middlewareValidationBody(createSchemaUserMotorcycleInput),
  createMotorcycleController.createMotorcycleController,
);

motorcycles.get("/", createMotorcycleController.listingRegisteredMotorcycles);
motorcycles.get("/:id", createMotorcycleController.locatingMotoById);
motorcycles.put(
  "/:id/:placa",
  //middlewareValidationBody(createSchemaUserMotorcycleInput),
  createMotorcycleController.modifyingPlateById,
);
motorcycles.delete("/:id", createMotorcycleController.deletePlateById);
