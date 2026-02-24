import { Router } from "express";
import { rental } from "./rental";
import { motorcycles } from "./motorcycles";
import { deliverymenRoutes } from "./deliverymen";
import { Request, Response, NextFunction } from "express";

const routes = Router();

routes.use("/locacao", rental);
routes.use("/motos", motorcycles);
routes.use("/entregadores", deliverymenRoutes);

export { routes };
