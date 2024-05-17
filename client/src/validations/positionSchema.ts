import { z } from "zod";

export const positionSchema = z.object({
  position: z.string().nonempty("Position is required"),
  wageType: z.string().nonempty("Wage type is required"),
  salary: z.preprocess(
    (val) => Number(val),
    z.number().positive("Salary must be a positive number")
  ),
});
