import { z } from "zod";

const isCedulaOrRUC = (value: string) => {
  const cedulaRegex = /^\d{6,8}$/;
  const rucRegex = /^\d{1,8}-\d$/;
  return cedulaRegex.test(value) || rucRegex.test(value);
};

export const employeeSchema = z.object({
  name: z
    .string()
    .min(1, { message: "El nombre es obligatorio" })
    .min(3, { message: "El nombre debe tener al menos 3 caracteres" })
    .max(50, { message: "El nombre debe tener como máximo 50 caracteres" }),
  address: z
    .string()
    .min(1, { message: "La dirección es obligatoria" })
    .min(3, { message: "La dirección debe tener al menos 3 caracteres" })
    .max(100, {
      message: "La dirección debe tener como máximo 100 caracteres",
    }),

  phone: z
    .string()
    .min(10, { message: "El número de teléfono es obligatorio" })
    .max(10, {
      message: "El número de teléfono debe tener exactamente 10 caracteres",
    })
    .regex(/^09\d{8}$/, {
      message:
        "Número de teléfono inválido, debe comenzar con '09' y tener 10 dígitos en total",
    }),

  email: z
    .string()
    .min(1, { message: "El correo electrónico es obligatorio" })
    .email({ message: "Dirección de correo electrónico inválida" })
    .max(50, {
      message: "El correo electrónico debe tener como máximo 50 caracteres",
    }),
  ciRuc: z
    .string()
    .min(1, { message: "La CI o RUC es obligatoria" })
    .refine(isCedulaOrRUC, {
      message: "El valor debe ser una Cédula o RUC válida de Paraguay",
    }),
  birthDate: z.preprocess(
    (arg) => new Date(arg as string),
    z
      .date()
      .refine((date) => !isNaN(date.getTime()), { message: "Fecha inválida" })
  ),
  enterDate: z.preprocess(
    (arg) => new Date(arg as string),
    z
      .date()
      .refine((date) => !isNaN(date.getTime()), { message: "Fecha inválida" })
  ),

  gender: z.enum(["male", "female"], {
    message: 'El género debe ser "male" o "female"',
  }),
});
