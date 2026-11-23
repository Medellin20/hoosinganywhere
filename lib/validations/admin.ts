import { z } from 'zod';

export const adminLoginSchema = z.object({
  password: z.string().min(1, 'Merci de saisir le mot de passe.'),
});

export const bankSettingsSchema = z.object({
  beneficiaryName: z.string().trim().min(2, 'Merci d’indiquer le bénéficiaire.'),
  iban: z.string().trim().min(10, 'IBAN invalide.'),
  bic: z.string().trim().max(20, 'BIC invalide.').optional().or(z.literal('')),
  bankName: z.string().trim().min(2, 'Merci d’indiquer le nom de la banque.'),
  paymentInstructions: z.string().trim().min(5, 'Merci d’indiquer des instructions de paiement.'),
  defaultDepositAmount: z.coerce.number().min(0, 'Le dépôt de garantie doit être positif ou nul.'),
  showOnConfirmations: z.boolean(),
});

export type BankSettingsInput = z.infer<typeof bankSettingsSchema>;

export const siteSettingsSchema = z.object({
  footerPhone: z.string().trim().min(6, 'Saisissez un numéro de téléphone valide.').max(30, 'Le numéro ne peut pas dépasser 30 caractères.'),
  paymentLink: z.string().trim().url('Saisissez un lien de paiement valide.').or(z.literal('')),
  showPaymentLink: z.boolean(),
  viewingFee: z.coerce.number().min(0, 'Les frais de visite doivent être positifs ou nuls.'),
  showOnConfirmations: z.boolean(),
}).refine(({ showPaymentLink, paymentLink }) => !showPaymentLink || Boolean(paymentLink), {
  path: ['paymentLink'],
  message: 'Saisissez un lien de paiement pour l’afficher.',
});

export type SiteSettingsInput = z.infer<typeof siteSettingsSchema>;
