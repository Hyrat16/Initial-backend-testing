import { z } from "zod";

const dateRegex = /^\d{4}-\d{2}-\d{2}$/;

export const createSchemaRentalInput = z.object({
  deliverymenIdentifier: z
    .uuidv4("Identificador nao etsa correto")
    .nonempty("Valor obrigatório"),
  motocyrcleIdentier: z
    .uuidv4("Identificador nao etsa correto")
    .nonempty("Valor obrigatório"),
  startDate: z.string().regex(dateRegex, {
    message: "Formato de data inválido. O formato esperado é YYYY-MM-DD.",
  }),
  endDate: z.string().regex(dateRegex, {
    message: "Formato de data inválido. O formato esperado é YYYY-MM-DD.",
  }),
  endForecastDate: z.string().regex(dateRegex, {
    message: "Formato de data inválido. O formato esperado é YYYY-MM-DD.",
  }),
});

export const createSchemaRentalOutput = createSchemaRentalInput.extend({
  plan: z.number("O plano nao atende aos dias requisitados"),
  identifier: z.uuidv4(),
  dailyValue: z.string(
    "O valor da diaria nao esta disponivel tente novamente mais tarde",
  ),
  returnDate: z.string().regex(dateRegex, {
    message: "Formato de data inválido. O formato esperado é YYYY-MM-DD.",
  }),
  fine: z.string().optional(),
});

/* export const createGetSchemaRentalOutput = createSchemaRentalOutput.extend({
  dailyValue: z
    .string("O valor da diaria nao esta disponivel tente novamente mais tarde")
    .optional(),
  returnDate: z.iso.date("A data deve ser uma data válida (XX - XX - XXXX)"),
}); */
