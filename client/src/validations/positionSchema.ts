import { z } from 'zod';

export const positionSchema = z.object({
  position: z.string().min(1, { message: 'Position is required' }),
  wageType: z.string().min(1, { message: 'Wage type is required' }),
  salary: z.number().positive('Salary must be a positive number')
});