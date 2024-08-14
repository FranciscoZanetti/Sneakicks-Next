import { z } from 'zod';

const reviewSchema = z.object({
    stars: z.number().min(1, {message: 'El campo de estrellas no puede estar vacío'}),
    text: z.string().min(1, {message: 'El campo de reseña no puede estar vacío'})
});

export default reviewSchema;
