import type { Metadata } from 'next';
import { LegalPage } from '@/components/shared/legal-page';

export const metadata: Metadata = { title: 'Conditions générales' };

export default function ConditionsGeneralesPage() {
  return (
    <LegalPage title="Conditions générales d’utilisation" updatedAt="21 août 2026">
      <h2>Objet</h2>
      <p>
        Ces conditions générales régissent l’utilisation du site Hoosing Anywhere et les services de mise en relation pour la location d’appartements en Espagne.
      </p>

      <h2>Demandes de visite</h2>
      <p>
        L’envoi d’une demande de visite sur le site est gratuit. Le créneau souhaité reste soumis à la confirmation de Hoosing Anywhere, qui contacte le client pour organiser le rendez-vous.
      </p>

      <h2>Demandes de réservation</h2>
      <p>
        L’envoi d’une demande de réservation ne vaut pas acceptation définitive et ne nécessite aucun paiement sur le site. Hoosing Anywhere examine le dossier, communique sa décision et organise les étapes suivantes directement avec le client.
      </p>

      <h2>Responsabilité</h2>
      <p>
        Hoosing Anywhere met en relation les locataires avec les propriétaires ou les gestionnaires. Le contrat de location définitif est conclu directement entre le locataire et le bailleur du logement concerné.
      </p>

    </LegalPage>
  );
}
