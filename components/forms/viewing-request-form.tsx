'use client';

import * as React from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'sonner';
import {
  ArrowLeft,
  ArrowRight,
  CalendarClock,
  FileCheck2,
  User,
} from 'lucide-react';

import {
  viewingRequestSchema,
  type ViewingRequestInput,
} from '@/lib/validations/viewing';

import { createViewingRequest } from '@/actions/viewings';

import { Input } from '@/components/ui/input';
import { Select } from '@/components/ui/select';
import { Label, FieldError } from '@/components/ui/label';
import { Button } from '@/components/ui/button';

import { TIME_SLOTS } from '@/lib/utils/constants';
import { cn } from '@/lib/utils/cn';
import { formatContactPhoneInput } from '@/lib/utils/phone';
import { formatPrice } from '@/lib/utils/format';

const STEPS = [
  'Date et coordonnées',
  'Récapitulatif et paiement',
] as const;

export function ViewingRequestForm({
  propertyId,
  propertySlug,
  propertyTitle,
  confirmationUrl,
  viewingFee,
}: {
  propertyId: string;
  propertySlug: string;
  propertyTitle: string;
  confirmationUrl: string;
  viewingFee: number;
}) {
  const router = useRouter();
  const [step, setStep] = React.useState(0);
const [isSending, setIsSending] = React.useState(false);
  const [viewingReference, setViewingReference] = React.useState<string | null>(null);
const storageKey = `viewing-flow:${propertySlug}`;
const hasRestoredFlow = React.useRef(false);

React.useEffect(() => {
  const savedStep = sessionStorage.getItem(`${storageKey}:step`);
  const savedReference = sessionStorage.getItem(`${storageKey}:reference`);

  if (savedStep) {
    const parsedStep = Number(savedStep);
    if (Number.isInteger(parsedStep) && parsedStep >= 0 && parsedStep < STEPS.length) {
      setStep(parsedStep);
    }
  }

  if (savedReference) setViewingReference(savedReference);
  hasRestoredFlow.current = true;
}, [storageKey]);

React.useEffect(() => {
  if (!hasRestoredFlow.current) return;
  sessionStorage.setItem(`${storageKey}:step`, String(step));

  if (viewingReference) {
    sessionStorage.setItem(`${storageKey}:reference`, viewingReference);
  }
}, [step, storageKey, viewingReference]);

  /*
   * Date minimale autorisée.
   *
   * On évite toISOString() car celui-ci travaille en UTC
   * et peut provoquer un décalage de date selon le fuseau horaire.
   */
  const minDate = React.useMemo(() => {
    const today = new Date();

    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, '0');
    const day = String(today.getDate()).padStart(2, '0');

    return `${year}-${month}-${day}`;
  }, []);

  const {
    register,
    getValues,
    setValue,
    trigger,
    watch,
    formState: { errors },
  } = useForm<ViewingRequestInput>({
    resolver: zodResolver(viewingRequestSchema),

    defaultValues: {
      propertyId,

      requestedDate: '',
      requestedTimeSlot: '',

      firstName: '',
      lastName: '',
      email: '',
      phone: '',
    },

    mode: 'onTouched',
  });

  const values = watch();

  /**
   * Passe à l'étape suivante.
   */
  async function goNext() {
    /*
     * Étape 0
     * -------
     * Vérification de la date et du créneau.
     */
    if (step === 0) {
      const formattedPhone = formatContactPhoneInput(getValues('phone') || '');
      setValue('phone', formattedPhone, {
        shouldDirty: true,
        shouldValidate: true,
      });

      const valid = await trigger([
        'requestedDate',
        'requestedTimeSlot',
        'firstName',
        'lastName',
        'email',
        'phone',
      ]);

      if (!valid) {
        return;
      }

      setStep(1);
      return;
    }

    /*
     * Étape 1
     * -------
     * On formate le téléphone avant de valider.
     */
    if (step === 1) {
      if (isSending) return;

      const valid = await trigger([
        'requestedDate',
        'requestedTimeSlot',
        'firstName',
        'lastName',
        'email',
        'phone',
      ]);

      if (!valid || viewingReference) {
        return;
      }

      setIsSending(true);
      try {
        const result = await createViewingRequest({ ...getValues() }, propertySlug);

        if (!result.success || !result.data) {
          toast.error(result.message || 'La demande n’a pas pu être envoyée.');
          return;
        }

        setViewingReference(result.data.reference);
        router.replace(`${confirmationUrl}?ref=${encodeURIComponent(result.data.reference)}`);
      } finally {
        setIsSending(false);
      }
    }
  }

  /**
   * Retour à l'étape précédente.
   */
  function goBack() {
    setStep((currentStep) => Math.max(0, currentStep - 1));
  }

  return (
    <div>
      {/* ================================
          INDICATEUR DES ÉTAPES
          ================================= */}

      <div className="mb-8 flex items-center gap-2">
        {STEPS.map((label, index) => (
          <React.Fragment key={label}>
            <div className="flex items-center gap-2">
              <span
                className={cn(
                  'flex h-8 w-8 items-center justify-center rounded-full text-xs font-bold transition-colors',

                  index < step &&
                    'bg-canal-600 text-white',

                  index === step &&
                    'bg-ink-700 text-white',

                  index > step &&
                    'bg-ink-100 text-ink-400'
                )}
              >
                {index + 1}
              </span>

              <span
                className={cn(
                  'hidden text-sm font-medium sm:block',

                  index === step
                    ? 'text-ink-900'
                    : 'text-ink-400'
                )}
              >
                {label}
              </span>
            </div>

            {index < STEPS.length - 1 && (
              <div className="h-px flex-1 bg-ink-100" />
            )}
          </React.Fragment>
        ))}
      </div>

      {/* ================================
          FORMULAIRE
          ================================= */}

      <form
        onSubmit={(event) => {
          event.preventDefault();
        }}
      >
        {/* =================================
            ÉTAPE 1 : DATE ET CRÉNEAU
            ================================= */}

        {step === 0 && (
          <div className="space-y-4">
            <div className="flex items-center gap-2 text-ink-700">
              <CalendarClock className="h-5 w-5 text-canal-600" />

              <h3 className="font-bold">
                Choisissez une date et un créneau</h3>
            </div>

            {/* DATE */}

            <div>
              <Label htmlFor="requestedDate">
                Date souhaitée</Label>

              <Input
                id="requestedDate"
                type="date"
                min={minDate}
                {...register('requestedDate')}
              />

              <FieldError
                message={errors.requestedDate?.message}
              />
            </div>

            {/* CRÉNEAU */}

            <div>
              <Label htmlFor="requestedTimeSlot">
                Créneau horaire</Label>

              <Select
                id="requestedTimeSlot"
                {...register('requestedTimeSlot')}
              >
                <option value="">
                  Sélectionnez un créneau</option>

                {TIME_SLOTS.map((slot) => (
                  <option
                    key={slot}
                    value={slot}
                  >
                    {slot}
                  </option>
                ))}
              </Select>

              <FieldError
                message={
                  errors.requestedTimeSlot?.message
                }
              />
            </div>
          </div>
        )}

        {/* =================================
            ÉTAPE 1 : COORDONNÉES
            ================================= */}

        {step === 0 && (
          <div className="mt-8 space-y-4">
            <div className="flex items-center gap-2 text-ink-700">
              <User className="h-5 w-5 text-canal-600" />

              <h3 className="font-bold">
                Vos coordonnées</h3>
            </div>

            {/* PRÉNOM + NOM */}

            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              <div>
                <Label htmlFor="firstName">
                  Prénom</Label>

                <Input
                  id="firstName"
                  autoComplete="given-name"
                  {...register('firstName')}
                />

                <FieldError
                  message={errors.firstName?.message}
                />
              </div>

              <div>
                <Label htmlFor="lastName">
                  Nom</Label>

                <Input
                  id="lastName"
                  autoComplete="family-name"
                  {...register('lastName')}
                />

                <FieldError
                  message={errors.lastName?.message}
                />
              </div>
            </div>

            {/* EMAIL */}

            <div>
              <Label htmlFor="email">
                E-mail</Label>

              <Input
                id="email"
                type="email"
                autoComplete="email"
                {...register('email')}
              />

              <FieldError
                message={errors.email?.message}
              />
            </div>

            {/* TÉLÉPHONE */}

            <div>
              <Label htmlFor="phone">
                Téléphone</Label>

              <Input
                id="phone"
                type="tel"
                inputMode="tel"
                autoComplete="tel"
                placeholder="+34 612345678"
                {...register('phone', {
                  onBlur: (event) => {
                    const formattedPhone =
                      formatContactPhoneInput(
                        event.target.value
                      );

                    setValue(
                      'phone',
                      formattedPhone,
                      {
                        shouldDirty: true,
                        shouldValidate: true,
                      }
                    );
                  },
                })}
              />

              <FieldError
                message={errors.phone?.message}
              />
            </div>
          </div>
        )}

        {/* =================================
            ÉTAPE 2 : RÉCAPITULATIF ET PAIEMENT
            ================================= */}

        {step === 1 && (
          <div className="space-y-4">
            <div className="flex items-center gap-2 text-ink-700">
              <FileCheck2 className="h-5 w-5 text-canal-600" />

              <h3 className="font-bold">
                Récapitulatif de votre demande</h3>
            </div>

            <div className="space-y-2 rounded-xl border border-ink-100 bg-sand-100/60 p-4 text-sm">
              <Row
                label="Logement"
                value={propertyTitle}
              />

              <Row
                label="Date"
                value={
                  values.requestedDate || '—'
                }
              />

              <Row
                label="Créneau"
                value={
                  values.requestedTimeSlot || '—'
                }
              />

              <Row
                label="Nom"
                value={
                  `${values.firstName || ''} ${
                    values.lastName || ''
                  }`.trim() || '—'
                }
              />

              <Row
                label="E-mail"
                value={
                  values.email || '—'
                }
              />

              <Row
                label="Téléphone"
                value={
                  values.phone || '—'
                }
              />
            </div>

            <p className="rounded-xl bg-canal-50 p-4 text-sm leading-relaxed text-ink-600">
              Les frais de visite de {formatPrice(viewingFee)} doivent être réglés avant la visite. Ils sont intégralement remboursés si le logement ne vous convient pas après la visite.
            </p>
          </div>
        )}

        {/* =================================
            BOUTONS DE NAVIGATION
            ================================= */}

        <div className="mt-7 flex flex-col-reverse gap-3 sm:flex-row sm:items-center sm:justify-between">
          {/* RETOUR */}

          <Button
            type="button"
            variant="outline"
            onClick={goBack}
            className={cn(
              'w-full sm:w-auto',
              step === 0 &&
                'hidden sm:inline-flex sm:invisible'
            )}
          >
            <ArrowLeft className="h-4 w-4" />

            Retour
          </Button>

          {/* CONTINUER */}

          <Button
            type="button"
            onClick={() => {
              void goNext();
            }}
            isLoading={isSending}
            disabled={isSending}
            className="w-full sm:w-auto"
          >
            Continuer
              <ArrowRight className="h-4 w-4" />
          </Button>

        </div>
      </form>
    </div>
  );
}

/**
 * Ligne du récapitulatif.
 */
function Row({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div className="flex flex-col gap-0.5 sm:flex-row sm:items-center sm:justify-between sm:gap-4">
      <span className="text-ink-400">
        {label}
      </span>

      <span className="break-words font-medium text-ink-700 sm:text-right">
        {value}
      </span>
    </div>
  );
}
