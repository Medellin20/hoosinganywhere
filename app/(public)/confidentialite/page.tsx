import type { Metadata } from 'next';
import { LegalPage } from '@/components/shared/legal-page';

export const metadata: Metadata = { title: 'Politique de confidentialité' };

export default function ConfidentialitePage() {
  return (
    <LegalPage title="Politique de confidentialité" updatedAt="21 août 2026">
      <h2>Données collectées</h2>
      <p>
        Dans le cadre de vos demandes de visite, de réservation ou de contact, nous collectons votre nom, votre prénom, votre adresse e-mail, votre numéro de téléphone et, le cas échéant, votre profession, votre revenu mensuel estimé et les informations complémentaires que vous nous communiquez.
      </p>

      <h2>Finalités du traitement</h2>
      <p>
        Ces données servent uniquement à traiter vos demandes de visite et de réservation, à suivre votre dossier de location et à vous contacter à ce sujet.
      </p>

      <h2>Conservation des données</h2>
      <p>
        Vos données sont conservées pendant la durée nécessaire au traitement de votre dossier, puis archivées conformément aux obligations légales applicables.
      </p>

      <h2>Vos droits</h2>
      <p>
        En vertu du Règlement général sur la protection des données (RGPD), vous disposez de droits d’accès, de rectification et d’effacement. Pour les exercer, écrivez à
        contacts@realestatenl.agency.
      </p>

      <h2>Cookies</h2>
      <p>
        Le site enregistre vos favoris dans le stockage local de votre navigateur. Il n’utilise aucun cookie de suivi publicitaire.
      </p>
    </LegalPage>
  );
}
