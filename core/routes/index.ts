import { Router } from "express";
import { rental } from "./rental";
import { motorcycles } from "./motorcycles";
import { deliverymenRoutes } from "./deliverymen";
import { Request, Response, NextFunction } from "express";

const routes = Router();

routes.use("/rentals", rental);
routes.use("/motorcycles", motorcycles);
routes.use("/deliverymens", deliverymenRoutes);

export { routes };
