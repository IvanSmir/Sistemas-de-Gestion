import { z } from "zod";

export const positionSchema = z
  .object({
    positionId: z.string().min(1, { message: "Posición es requerida" }),
    salaryType: z.enum(["minimum", "base"], {
      message: "Tipo de sueldo es requerido",
    }),
    amount: z.preprocess(
      (val) => Number(val),
      z.number().positive("El salario debe ser un número positivo")
    ),
    startDate: z
      .preprocess(
        (arg) => new Date(arg as string),
        z
          .date()
          .refine((date) => !isNaN(date.getTime()), { message: "Invalid date" })
      )
      .optional(),
    endDate: z
      .union([
        z
          .string()
          .transform((val) => new Date(val))
          .optional(),
        z.date().optional(),
      ])
      .refine((date) => date === undefined || !isNaN(date.getTime()), {
        message: "Invalid date",
      }),
  })
  .refine(
    (data) =>
      !data.endDate || !data.startDate || data.endDate >= data.startDate,
    {
      message: "Fecha de inicio debe ser menor que la fecha de fin",
      path: ["endDate"],
    }
  );
