import Link from 'next/link';
import { CheckCircle2, Home } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { getSiteSettings } from '@/lib/data/site-settings';
import { getBankSettings } from '@/lib/data/bank';
import { BankTransferInstructions } from '@/components/shared/bank-transfer-instructions';

export const metadata = { title: 'Demande de réservation envoyée' };

export default async function ReservationConfirmationPage() {
  const {
    payment_link: paymentLink,
    show_payment_link: showPaymentLink,
    footer_phone: confirmationPhone,
  } = await getSiteSettings();
  const bankSettings = await getBankSettings();
  const showBankDetails = Boolean(bankSettings?.show_on_confirmations && bankSettings);

  return (
    <div className="container-app flex min-h-[70vh] items-center justify-center py-6 sm:py-14">
      <div className="w-full max-w-3xl rounded-3xl border border-ink-100 bg-white p-5 text-center shadow-card sm:p-8">
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-canal-50 text-canal-600">
          <CheckCircle2 className="h-7 w-7" />
        </div>

        <h1 className="mt-5 text-xl font-extrabold text-ink-900 sm:text-2xl">
          Votre dossier a été envoyé
        </h1>

        <div className="mt-6 grid items-start gap-4 lg:grid-cols-[1.2fr_0.8fr]">
          {showPaymentLink && (
            <a
              href={paymentLink}
              target="_blank"
              rel="noreferrer"
              className="inline-flex h-fit min-h-12 w-full items-center justify-center rounded-xl bg-canal-700 px-4 py-3 text-center text-sm font-bold text-white transition hover:bg-canal-800"
            >
              Payer les frais de réservation en ligne
            </a>
          )}
          {showBankDetails && bankSettings && (
            <div className="h-fit">
              <BankTransferInstructions bankSettings={bankSettings} />
            </div>
          )}
        </div>

        {(showPaymentLink || showBankDetails) && (
          <p className="mt-3 rounded-xl border border-red-200 bg-red-50 p-3 text-sm font-semibold leading-relaxed text-red-700">
            Après le paiement, envoyez votre justificatif par e-mail à{' '}
            <a href="mailto:contacts@realestatenl.agency" className="underline">
              contacts@realestatenl.agency
            </a>{' '}
            ou sur WhatsApp au{' '}
            <a
              href={`https://wa.me/${confirmationPhone.replace(/\D/g, '')}`}
              target="_blank"
              rel="noreferrer"
              className="underline"
            >
              {confirmationPhone}
            </a>
          </p>
        )}

        <Link href="/appartements" className="mt-8 inline-block w-full sm:w-auto">
          <Button className="w-full sm:w-auto">
            <Home className="h-4 w-4" />
            Voir d’autres logements
          </Button>
        </Link>
      </div>
    </div>
  );
}
