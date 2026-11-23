import { z } from 'zod';

// Les champs numériques HTML vides renvoient une chaîne vide, pas undefined.
function optionalNumber(schema: z.ZodNumber) {
  return z.preprocess(
    (value) => typeof value === 'string' && value.trim() === '' ? undefined : value,
    schema.optional()
  );
}

export const propertySchema = z.object({
  title: z.string().trim().min(5, 'Le titre doit contenir au moins 5 caractères.'),
  slug: z
    .string()
    .trim()
    .min(5, 'Le slug doit contenir au moins 5 caractères.')
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, 'Le slug ne doit contenir que des minuscules, chiffres et tirets.'),
  propertyType: z.enum(['appartement', 'studio', 'maison', 'chambre', 'loft', 'duplex']),

  address: z.string().trim().optional().or(z.literal('')),
  city: z.string().trim().min(2, 'Merci d’indiquer la ville du bien.'),
  postalCode: z.string().trim().optional().or(z.literal('')),
  neighborhood: z.string().trim().optional().or(z.literal('')),
  latitude: optionalNumber(z.coerce.number().min(-90, 'La latitude doit être comprise entre −90 et 90.').max(90, 'La latitude doit être comprise entre −90 et 90.')),
  longitude: optionalNumber(z.coerce.number().min(-180, 'La longitude doit être comprise entre −180 et 180.').max(180, 'La longitude doit être comprise entre −180 et 180.')),

  monthlyPrice: z.coerce.number().positive('Le loyer mensuel doit être supérieur à 0.'),
  serviceCharges: z.coerce.number().min(0, 'Saisissez une valeur positive ou nulle.').default(0),
  depositAmount: z.coerce.number().min(0, 'Saisissez une valeur positive ou nulle.').default(0),

  surfaceM2: z.coerce.number().positive('La surface doit être positive.'),
  bedrooms: z.coerce.number().int('Saisissez un nombre entier.').min(0, 'Saisissez une valeur positive ou nulle.'),
  bathrooms: z.coerce.number().int('Saisissez un nombre entier.').min(0, 'Saisissez une valeur positive ou nulle.'),
  rooms: optionalNumber(z.coerce.number().int('Saisissez un nombre entier.').min(0, 'Saisissez une valeur positive ou nulle.')),
  floor: optionalNumber(z.coerce.number().int('Saisissez un nombre entier.')),
  floorsCount: optionalNumber(z.coerce.number().int('Saisissez un nombre entier.').min(1, 'Saisissez une valeur supérieure ou égale à 1.')),
  volumeM3: optionalNumber(z.coerce.number().positive('Saisissez une valeur strictement positive.')),
  contractType: z.string().trim().min(2, 'Sélectionnez une valeur.'),
  interiorType: z.string().trim().min(2, 'Sélectionnez une valeur.'),
  maintenanceCondition: z.string().trim().min(2, 'Sélectionnez une valeur.'),
  constructionType: z.string().trim().min(2, 'Sélectionnez une valeur.'),
  constructionYear: optionalNumber(z.coerce.number().int('Saisissez un nombre entier.').min(1000, 'L’année doit être supérieure ou égale à 1000.').max(2200, 'L’année doit être inférieure ou égale à 2200.')),
  energyLabel: z.string().trim().optional().or(z.literal('')),

  hasElevator: z.boolean().default(false),
  hasBalcony: z.boolean().default(false),
  hasTerrace: z.boolean().default(false),
  hasParking: z.boolean().default(false),
  hasGarage: z.boolean().default(false),
  hasGarden: z.boolean().default(false),
  isFurnished: z.boolean().default(false),

  availableFrom: z.string().optional().or(z.literal('')),
  minimumStayMonths: z.coerce.number().int('Saisissez un nombre entier.').min(1, 'Saisissez une valeur supérieure ou égale à 1.').default(12),

  status: z.enum(['draft', 'available', 'reserved', 'rented', 'unavailable']),
  isPublished: z.boolean().default(false),
  isFeatured: z.boolean().default(false),

  amenityIds: z.array(z.string().uuid('Identifiant d’équipement invalide.')).default([]),
});

export type PropertyInput = z.infer<typeof propertySchema>;
