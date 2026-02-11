import { z } from "zod";

export const createSchemaUserDeliverymenInput = z.object({
  name: z
    .string("O nome de usuário deve ser um texto.")
    .nonempty("nome é obrigatório")
    .trim(),
  cnpj: z
    .string("O cnpj de usuário deve ser um numero (number).")
    .nonempty("CNPJ é obrigátorio")
    .length(14, "O CNPJ deve conter 14 digitos")
    .regex(/^\d+$/, "CPF deve conter apenas números"),

  date_birth: z.iso.date("A data deve ser uma data válida (XX - XX - XXXX)"),

  number_cnh: z
    .string("O Number_cnh de usuário deve ser um numero (XXXXXXXXX).")
    .length(9, " O number_cnh deve conter 9 números")
    .regex(/^\d+$/, "CPF deve conter apenas números"),

  type_cnh: z.enum(
    ["A", "B", "AB", "a", "b", "ab"],
    "Apenas carteiras A, B e AB são aceitas"
  ),

  image_cnh: z.string("Possivel Erro").optional(),
});

export const createSchemaUserDeliverymenOutput =
  createSchemaUserDeliverymenInput.extend({
    identifier: z.uuidv4("O identificador deve ser um UUID válido."),
  });
