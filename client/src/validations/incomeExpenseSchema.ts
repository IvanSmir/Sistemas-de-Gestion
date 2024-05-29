import { z } from "zod";

export const incomeExpenseSchema = z.object({
  typeId: z.string().min(1, { message: "Tipo de ingreso/egreso es requerido" }),
  amount: z.preprocess(
    (val) => Number(val),
    z.number().positive("El monto debe ser un número positivo")
  ),
});
