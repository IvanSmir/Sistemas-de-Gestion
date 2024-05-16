import {z} from 'zod';

export const userSchema = z.object({
    name : z
    .string()
    .min(3,{        
        message: "El nombre debe de ser minimo de 3 caracteres"
    })
    .max(25, 
        {message:"El nombre no puede superar los 25 caracteres"
    })
    .regex(/^[a-zA-Z ]*$/, "El nombre solo puede contener letras"),    

    userName : z
    .string()
    .min(5,{        
        message: "El nombre de usuario debe de ser minimo de 5 caracteres"
    })
    .max(20, 
        {message:"El nombre no puede superar los 20 caracteres"
    })
    .regex(/^[a-z0-9_]*$/, "El nombre de usuario solo puede contener minusculas, números y guiones bajos"),    
    password: z
    .string()
    .min(6,{
        message: "La contraseña debe contener un minimo de 6 caracteres"
    })
    .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).+$/, "La contraseña debe tener al menos una mayúscula, una minúscula, un número y un símbolo"),

    confirmPassword: z
    .string()
    .min(6,{
        message: "La contraseña debe contener un minimo de 6 caracteres"
    }),

}).refine(data => data.password === data.confirmPassword,{
    message: "Las contraseñas no coinciden",
    path: ["confirmPassword"]
})

