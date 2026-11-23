import { z } from 'zod';

export const contactPhoneSchema = z
  .string()
  .regex(/^\+(?:34|31) \d{9}$/, 'Saisissez +34 ou +31 suivi de 9 chiffres (ex. +34 612345678).');
export const optionalContactPhoneSchema = contactPhoneSchema.optional().or(z.literal(''));
