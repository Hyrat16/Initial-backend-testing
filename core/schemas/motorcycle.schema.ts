import { z } from "zod";

export const createSchemaUserMotorcycleInput = z.object({
  age: z
    .string()
    .length(4, "Deve conter 4")
    .regex(/^\d+$/, "Ano deve conter apenas números"),
  model: z.string("O modelo não atende os requisitos"),
  plate: z.string("A placa não atende os requisitos"),
});

export const createSchemaUserMotorcycleOutput =
  createSchemaUserMotorcycleInput.extend({
    identifier: z.uuidv4("Nao é um ID válido"),
  });
