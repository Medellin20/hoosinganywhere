import { BrandLogo } from '@/components/shared/brand-logo';
import { frenchLabel } from '@/lib/utils/french-display';
import type { Metadata } from 'next';
import type { ReactNode } from 'react';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ArrowLeft } from 'lucide-react';
import { getViewingByReference } from '@/lib/data/dossier';
import { getBankSettings, isDemoBankSettings } from '@/lib/data/bank';
import { getSiteSettings } from '@/lib/data/site-settings';
import { PrintPdfButton } from '@/components/shared/print-pdf-button';
import { formatDate, formatPrice } from '@/lib/utils/format';

export const metadata: Metadata = { title: 'Justificatif de paiement de la visite' };

export default async function ViewingReceiptPage({
  params,
  searchParams,
}: {
  params: { slug: string };
  searchParams: { ref?: string };
}) {
  if (!searchParams.ref || !/^[A-Z0-9-]{4,40}$/i.test(searchParams.ref)) notFound();

  const viewing = await getViewingByReference(searchParams.ref);
  if (!viewing || (viewing as any).properties?.slug !== params.slug) notFound();

  const [bank, siteSettings] = await Promise.all([getBankSettings(), getSiteSettings()]);
  const property = (viewing as any).properties;
  const client = (viewing as any).clients;
  const bankIsDemo = bank ? isDemoBankSettings(bank) : true;
  const receiptDate = viewing.created_at;
  const paymentConfirmed = Boolean(viewing.paid_at) || viewing.status === 'paid';
  const propertyAddress = [property?.address, property?.postal_code, property?.city]
    .filter(Boolean)
    .join(', ');

  return (
    <main className="receipt-page container-app py-8 sm:py-12">
      <div className="receipt-actions no-print mx-auto mb-5 flex max-w-4xl flex-col justify-between gap-3 sm:flex-row sm:items-center">
        <Link href={`/appartements/${params.slug}/visite/confirmation?ref=${encodeURIComponent(viewing.reference)}`} className="inline-flex items-center gap-2 text-sm font-semibold text-ink-600 hover:text-ink-900">
          <ArrowLeft className="h-4 w-4" /> Retour à la confirmation
        </Link>
        <PrintPdfButton />
      </div>

      <article className="receipt-sheet mx-auto max-w-4xl border border-ink-100 bg-white p-5 shadow-card sm:p-10">
        <header className="flex flex-col justify-between gap-5 border-b-2 border-canal-800 pb-6 sm:flex-row sm:items-center">
          <div className="flex items-center gap-3">
            <div>
              <BrandLogo className="w-48" />
              <p className="mt-2 text-xs font-semibold text-ink-500">Location immobilière en Espagne</p>
            </div>
          </div>
          <div className="border-l-2 border-canal-800 pl-4 text-sm leading-6 text-ink-600 sm:text-right">
            <p>contacts@realestatenl.agency</p>
            <p>www.realestatenl.agency</p>
            <p className="mt-2">{siteSettings.footer_phone}</p>
          </div>
        </header>

        <div className="border-b border-canal-800 py-6 text-center sm:py-7">
          <h1 className="text-3xl font-black tracking-wide text-canal-900 sm:text-4xl">JUSTIFICATIF DE PAIEMENT</h1>
          <p className="mt-2 text-sm font-semibold uppercase tracking-[0.22em] text-canal-800">Détails de la demande et du paiement</p>
          <p className="mx-auto mt-3 max-w-xl rounded-md bg-sky-100 px-3 py-1.5 text-xs font-semibold uppercase tracking-wide text-canal-900 sm:text-sm">Frais de visite · statut du paiement {paymentConfirmed ? 'ontvangen' : 'en attente'}</p>
        </div>

        <section className="receipt-grid mt-5 grid max-w-xl grid-cols-1 gap-0 overflow-hidden border border-canal-100">
          <ReceiptRow label="Référence" value={viewing.reference} />
          <ReceiptRow label="Date de la demande" value={formatDate(receiptDate)} />
          <ReceiptRow label="Statut du paiement" value={paymentConfirmed ? 'Paiement confirmé' : 'En attente de paiement'} />
          <ReceiptRow label="Date du paiement" value={viewing.paid_at ? formatDate(viewing.paid_at) : 'En attente de confirmation'} />
        </section>

        <ReceiptSection title="COORDONNÉES DU CLIENT">
          <ReceiptRow label="Nom" value={`${client?.first_name ?? ''} ${client?.last_name ?? ''}`.trim() || '—'} />
          <ReceiptRow label="Adresse e-mail" value={client?.email ?? '—'} />
          <ReceiptRow label="Téléphone" value={(viewing as any).clients?.phone ?? '—'} />
        </ReceiptSection>

        <ReceiptSection title="INFORMATIONS SUR LE LOGEMENT">
          <ReceiptRow label="Logement" value={property?.title ?? '—'} />
          <ReceiptRow label="Adresse" value={propertyAddress || property?.city || '—'} />
          <ReceiptRow label="Visite prévue" value={`${formatDate(viewing.requested_date)} · ${viewing.requested_time_slot}`} />
        </ReceiptSection>

        <ReceiptSection title="DÉTAILS DU PAIEMENT">
          <ReceiptRow label="Description" value={`Frais de visite · ${viewing.reference}`} />
          <ReceiptRow label="Montant" value={formatPrice(viewing.fee_amount)} strong />
          <ReceiptRow label="Mode de paiement" value="Virement bancaire ou page de paiement" />
          <ReceiptRow label="Bénéficiaire" value={bank?.beneficiary_name || 'À configurer'} />
          <ReceiptRow label="IBAN" value={bank?.iban || 'À configurer'} mono />
          {bank?.bic && <ReceiptRow label="BIC / SWIFT" value={bank.bic} mono />}
          {bank?.bank_name && <ReceiptRow label="Bank" value={bank.bank_name} />}
        </ReceiptSection>

        <p className="mt-5 border-l-4 border-canal-700 bg-canal-50 p-4 text-sm leading-6 text-ink-700">
          {paymentConfirmed
            ? 'Ce document confirme l’enregistrement de votre demande de visite et le paiement associé à votre dossier.'
            : 'Ce document confirme l’enregistrement de votre demande de visite. Le paiement est en attente de validation. Conservez ce document et indiquez votre référence si vous effectuez un virement.'}
          {' '}Les frais de visite sont remboursables.
          {bankIsDemo && <span className="mt-2 block font-semibold text-red-700">Les coordonnées bancaires sont en attente de configuration. Vérifiez les informations de paiement auprès de l’équipe avant tout virement.</span>}
          {bank?.payment_instructions && <span className="mt-2 block">{frenchLabel(bank.payment_instructions)}</span>}
        </p>

        <footer className="mt-8 flex flex-col justify-between gap-5 border-t border-ink-200 pt-5 text-sm text-ink-600 sm:flex-row sm:items-end">
          <div>
            <p>Merci pour votre confiance.</p>
            <p className="mt-3 font-bold text-canal-900">Hoosing Anywhere</p>
            <p className="text-xs">Location et vente de biens immobiliers en Espagne</p>
          </div>
          <p className="text-xs text-ink-400">Document créé le {formatDate(new Date())}</p>
        </footer>
      </article>

      <p className="no-print mx-auto mt-4 max-w-4xl text-center text-xs text-ink-400">Dans la fenêtre d’impression, sélectionnez « Enregistrer au format PDF » pour télécharger le justificatif.</p>
    </main>
  );
}

function ReceiptSection({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section className="mt-5 overflow-hidden rounded-lg border border-canal-100">
      <h2 className="bg-canal-800 px-4 py-2 text-sm font-bold tracking-wide text-white">{title}</h2>
      <div>{children}</div>
    </section>
  );
}

function ReceiptRow({ label, value, strong = false, mono = false }: { label: string; value: string; strong?: boolean; mono?: boolean }) {
  return (
    <div className="receipt-row grid grid-cols-[minmax(8rem,0.8fr)_minmax(0,1.5fr)] border-b border-white bg-canal-50/80 last:border-b-0">
      <span className="px-3 py-2 text-sm text-ink-600 sm:px-4">{label}</span>
      <span className={`break-words px-3 py-2 text-sm text-canal-900 sm:px-4 ${strong ? 'text-lg font-extrabold' : 'font-medium'} ${mono ? 'font-mono' : ''}`}>{value}</span>
    </div>
  );
}
