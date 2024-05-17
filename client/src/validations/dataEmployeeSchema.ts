import { employeeSchema } from "./employeeSchema"
import { z } from 'zod';
import { positionSchema } from "./positionSchema";
import { relativeSchema } from "./relativeSchema";

export const dataEmployeeSchema = z.object({
    employee: employeeSchema,
    position: positionSchema,
    relatives: relativeSchema,
})