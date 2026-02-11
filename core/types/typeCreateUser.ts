import z, { ZodUUID } from "zod";
import {
  createSchemaUserDeliverymenOutput,
  createSchemaUserDeliverymenInput,
} from "../schemas/deliverymen.schema";
import {
  createSchemaUserMotorcycleInput,
  createSchemaUserMotorcycleOutput,
} from "../schemas/motorcycle.schema";
import {
  createSchemaRentalInput,
  createSchemaRentalOutput,
} from "../schemas/rental.schema";
//import { BaseItem } from "../manager-Database/managerDatabase";

/* export interface DeliverymenTypes {
  identificador: ZodUUID;
  nome: string;
  cnpj: number;
  data_nascimento: Date;
  numero_cnh: number;
  tipo_cnh: string;
  imagem_cnh?: string;
} */

export type DeliverymenInput = z.infer<typeof createSchemaUserDeliverymenInput>;
export type DeliverymenOutput = z.infer<
  typeof createSchemaUserDeliverymenOutput
>;
export type MotorcycleInput = z.infer<typeof createSchemaUserMotorcycleInput>;
export type MotorcycleOutput = z.infer<typeof createSchemaUserMotorcycleOutput>;
export type RentalInput = z.infer<typeof createSchemaRentalInput>;
export type RentalOutput = z.infer<typeof createSchemaRentalOutput>;
