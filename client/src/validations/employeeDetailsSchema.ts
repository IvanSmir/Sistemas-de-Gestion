import { start } from "repl";
import { z } from "zod";

export const employeeDetailsSchema = z.object({
  employeeId: z
    .string()
    .uuid({ message: "El ID del empleado debe ser un UUID válido" }),
  positionId: z
    .string()
    .uuid({ message: "El ID de la posición debe ser un UUID válido" }),
  endDate: z
    .preprocess(
      (arg) => new Date(arg as string),
      z
        .date()
        .refine((date) => !isNaN(date.getTime()), { message: "Invalid date" })
    )
    .optional(),
  startDate: z.preprocess(
    (arg) => new Date(arg as string),
    z
      .date()
      .refine((date) => !isNaN(date.getTime()), { message: "Invalid date" })
  ),
  salaryType: z.enum(["minimum", "base"], {
    message: "El tipo de salario debe ser 'minimum' o 'base'",
  }),
  salary: z
    .number()
    .positive({ message: "El salario debe ser un número positivo" }),
});
