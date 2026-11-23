import { z } from 'zod';
import { contactPhoneSchema } from './phone';

export const reservationSchema = z.object({
  propertyId: z.string().uuid('Identifiant de logement invalide.'),
  firstName: z.string().trim().min(2, 'Le prénom doit contenir au moins 2 caractères.'),
  lastName: z.string().trim().min(2, 'Le nom doit contenir au moins 2 caractères.'),
  email: z.string().trim().email('Adresse e-mail invalide.'),
  phone: contactPhoneSchema,
  desiredMoveInDate: z.string().min(1, 'Merci d’indiquer une date d’entrée souhaitée.'),
  durationMonths: z.coerce
    .number()
    .int('Saisissez un nombre entier.')
    .min(1, 'La durée minimale est d’un mois.')
    .max(60, 'La durée maximale est de 60 mois.'),
  occupantsCount: z.coerce.number().int('Saisissez un nombre entier.').min(1, 'Indiquez au moins un occupant.').max(10, 'Indiquez au maximum 10 occupants.'),
  hasPets: z.boolean().default(false),
  employmentContract: z.string().trim().min(1, 'Indiquez votre contrat de travail.'),
  monthlyIncome: z.coerce.number().min(0, 'Le revenu doit être un nombre positif.'),
  originCity: z.string().trim().min(2, 'Indiquez votre ville d’origine.'),
  message: z.string().trim().max(2000, 'Votre message ne peut pas dépasser 2 000 caractères.').optional().or(z.literal('')),
});

export type ReservationInput = z.infer<typeof reservationSchema>;
