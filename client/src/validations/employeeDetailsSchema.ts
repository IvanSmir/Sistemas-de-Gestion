import { z } from "zod";

export const employeeDetailsSchema = z.object({
  employeeId: z.string().uuid({ message: "El ID del empleado debe ser un UUID válido" }),
  positionId: z.string().uuid({ message: "El ID de la posición debe ser un UUID válido" }),
  startDate: z.string().regex(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}Z$/, { message: "El formato de la fecha de inicio es inválido" }),
  salaryType: z.enum(["minimum", "base"], { message: "El tipo de salario debe ser 'minimum' o 'base'" }),
  salary: z.number().positive({ message: "El salario debe ser un número positivo" }),
  endDate: z.string().regex(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}Z$/, { message: "El formato de la fecha de fin es inválido" }),
});
