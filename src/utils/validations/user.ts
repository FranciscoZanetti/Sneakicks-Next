import { z } from 'zod';

export const loginSchema = z.object({
    email: z.string().email({ message: "No es un email válido." }),
    password: z.string().min(5, { message: "Mínimo 8 caracteres." }).max(40, { message: "Máximo 40 caracteres." }),
});

export type LoginType = z.infer<typeof loginSchema>;

export const registerSchema = z.object({
    first_name: z.string({ message: "Debe ser un nombre válido." }).min(1, { message: "Ingresa tu nombre." }),
    last_name: z.string({ message: "Debe ser un apellido válido." }).min(1, { message: "Ingresa tu apellido." }),
    email: z.string().email({ message: "Debe ser un email válido." }),
    password: z.string().min(8, { message: "Mínimo 8 caracteres." }).max(60, { message: "Máximo 60 caracteres." }),
    password_repeat: z.string(),
}).refine((data) => data.password == data.password_repeat, {
    path: ['password_repeat'],
    message: "Las contraseñas no coinciden.",
});
