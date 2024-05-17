import { z } from "zod";

export const positionSchema = z.object({
  positionId: z.string().nonempty("Position is required"),
  incomeTypeId: z.string().nonempty("Wage type is required"),
  amount: z.preprocess(
    (val) => Number(val),
    z.number().positive("Salary must be a positive number")
  ),
});
