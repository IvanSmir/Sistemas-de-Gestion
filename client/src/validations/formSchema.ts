import { z } from "zod";

export const formSchema = z.object({
    name: z
        .string()
        .min(1, { message: "El cargo es requerido" })
        .min(3, { message: "El cargo debe de ser minimo de 3 caracteres" })
        .max(25, { message: "El cargo no puede superar los 25 caracteres" })
        .regex(/^[a-zA-Z ]*$/, "El cargo solo puede contener letras"),

    description: z
        .string()
        .max(50, { message: "La descripcion no puede superar los 50 caracteres" }),
});