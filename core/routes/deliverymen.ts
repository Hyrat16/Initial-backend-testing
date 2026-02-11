import { Router } from "express";
import { DeliverymenController } from "../controllers/controllerDeliverymen";
import { middlewareValidationBody } from "../middleware/validateReqMiddleware";
import { createSchemaUserDeliverymenInput } from "../schemas/deliverymen.schema";

export const deliverymenRoutes = Router();
const deliverymenController = new DeliverymenController();

deliverymenRoutes.post(
  "/",
  middlewareValidationBody(createSchemaUserDeliverymenInput),
  deliverymenController.createUserDeliverymen
);
/* deliverymenRoutes.post("/:id/:cnh", (req, res) => {
  const { id, cnh } = req.params;
  res.send(`Tudo Ok ${id}, Agora ${cnh}, `);
}); */
