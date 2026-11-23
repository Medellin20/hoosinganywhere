import { z } from 'zod';
import { optionalContactPhoneSchema } from './phone';

export const contactSchema = z.object({
  name: z.string().trim().min(2, 'Merci d’indiquer votre nom.'),
  email: z.string().trim().email('Adresse e-mail invalide.'),
  phone: optionalContactPhoneSchema,
  subject: z.string().trim().min(3, 'Merci d’indiquer un sujet.'),
  message: z.string().trim().min(10, 'Votre message doit contenir au moins 10 caractères.').max(3000, 'Votre message ne peut pas dépasser 3 000 caractères.'),
  website: z.string().max(0).optional().or(z.literal('')),
});

export type ContactInput = z.infer<typeof contactSchema>;
