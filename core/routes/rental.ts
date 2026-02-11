import { Router } from "express";
import { middlewareValidationBody } from "../middleware/validateReqMiddleware";
import {
  createSchemaRentalInput,
  createSchemaRentalOutput,
} from "../schemas/rental.schema";
import { Rentalcontroller } from "../controllers/controllerRental";
import { RepositoryRental } from "../repositorys/repositoryRental";
import { RentalService } from "../services/userCreateRental";

const controllerRental = new Rentalcontroller();
/* const repositoryRental = new RepositoryRental();
const repo = new RentalService(); */

export const rental = Router();

//rental.get("/", controllerRental.listingRegisteredRental);
rental.post(
  "/",
  middlewareValidationBody(createSchemaRentalInput),
  controllerRental.createRental,
);
rental.put("/:id/:devoluçao", controllerRental.uptadeDateReturn);
rental.get("/:id", controllerRental.LocatingbyId);
