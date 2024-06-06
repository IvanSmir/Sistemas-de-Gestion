import { z } from "zod";

const isCedulaOrRUC = (value: string) => {
  const cedulaRegex = /^\d{1,3}(\.\d{3})*$/;
  const rucRegex = /^\d{1,8}-\d$/;
  return cedulaRegex.test(value) || rucRegex.test(value);
};

export const relativeSchema = z.object({
  name: z
    .string()
    .min(1, { message: "El nombre es obligatorio" })
    .min(3, { message: "El nombre debe tener al menos 3 caracteres" })
    .max(50, { message: "El nombre debe tener como máximo 50 caracteres" }),
  address: z
    .string()
    .min(1, { message: "La dirección es obligatoria" })
    .min(3, { message: "La dirección debe tener al menos 3 caracteres" })
    .max(100, { message: "La dirección debe tener como máximo 100 caracteres" }),
  phone: z
    .string()
    .min(1, { message: "El número de teléfono es obligatorio" })
    .max(50, { message: "El número de teléfono debe tener como máximo 50 caracteres" })
    .regex(/^\+?[1-9]\d{1,14}$/, "Número de teléfono inválido"),
  email: z
    .string()
    .min(1, { message: "El correo electrónico es obligatorio" })
    .email({ message: "Dirección de correo electrónico inválida" })
    .max(50, { message: "El correo electrónico debe tener como máximo 50 caracteres" }),
  ciRuc: z
    .string()
    .min(1, { message: "La Cédula o RUC es obligatoria" })
    .refine(isCedulaOrRUC, {
      message: "El valor debe ser una Cédula o RUC válido de Paraguay",
    }),
  birthDate: z.preprocess(
    (arg) => new Date(arg as string),
    z
      .date()
      .refine((date) => !isNaN(date.getTime()), { message: "Fecha inválida" })
  ),
  gender: z.enum(["male", "female"], {
    message: 'El género debe ser "masculino" o "femenino"',
  }),
  familyTypeId: z.string(),
});