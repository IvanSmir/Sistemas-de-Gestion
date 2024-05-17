import { z } from "zod";

const isCedulaOrRUC = (value: string) => {
  const cedulaRegex = /^\d{1,3}(\.\d{3})*$/;
  const rucRegex = /^\d{1,8}-\d$/;
  return cedulaRegex.test(value) || rucRegex.test(value);
};

export const employeeSchema = z.object({
  name: z
    .string()
    .min(1, { message: "Name is required" })
    .min(3, { message: "Name must be at least 3 characters long" })
    .max(50, { message: "Name must be at most 50 characters long" }),
  address: z
    .string()
    .min(1, { message: "Address is required" })
    .min(3, { message: "Address must be at least 3 characters long" })
    .max(100, { message: "Address must be at most 100 characters long" }),
  phone: z
    .string()
    .min(1, { message: "Phone number is required" })
    .max(50, { message: "Phone number must be at most 50 characters long" })
    .regex(/^\+?[1-9]\d{1,14}$/, "Invalid phone number"),

  email: z
    .string()
    .min(1, { message: "Email is required" })
    .email({ message: "Invalid email address" })
    .max(50, { message: "Email must be at most 50 characters long" }),
  ciRuc: z
    .string()
    .min(1, { message: "CI or RUC is required" })
    .refine(isCedulaOrRUC, {
      message: "The value must be a valid Paraguayan Cédula or RUC",
    }),
  birthDate: z.preprocess(
    (arg) => new Date(arg as string),
    z
      .date()
      .refine((date) => !isNaN(date.getTime()), { message: "Invalid date" })
  ),
  enterDate: z.preprocess(
    (arg) => new Date(arg as string),
    z
      .date()
      .refine((date) => !isNaN(date.getTime()), { message: "Invalid date" })
  ),

  gender: z.enum(["male", "female"], {
    message: 'Gender must be either "male" or "female"',
  }),
});
