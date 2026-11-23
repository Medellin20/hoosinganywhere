import type { Metadata } from 'next';
import { LegalPage } from '@/components/shared/legal-page';

export const metadata: Metadata = { title: 'Mentions légales' };

export default function MentionsLegalesPage() {
  return (
    <LegalPage title="Mentions légales" updatedAt="7 septembre 2026">
      <h2>Éditeur du site</h2>
      <p>Hoosing Anywhere propose des services de location d’appartements en Espagne.</p>

      <h2>Propriété intellectuelle</h2>
      <p>
        Tous les contenus du site (textes, photos, logo et identité visuelle) sont protégés par le droit d’auteur. Toute reproduction, même partielle, est interdite sans autorisation préalable.
      </p>

      <h2>Responsabilité</h2>
      <p>
        Hoosing Anywhere s’efforce de publier des informations exactes. Sa responsabilité ne saurait être engagée en cas d’erreur, d’omission ou d’indisponibilité temporaire.
      </p>

      <h2>Contact</h2>
      <p>Pour toute question sur ces mentions légales, écrivez à contacts@realestatenl.agency.</p>
      <h2 id="fotocredits">Crédits photos</h2>
      <p>Photos des villes issues de Wikimedia Commons, redimensionnées et recadrées.</p>
      <ul>
        <li>Madrid · <a href="https://commons.wikimedia.org/wiki/File:Madrid_-_Sky_Bar_360%C2%BA_(Hotel_Riu_Plaza_Espa%C3%B1a),_vistas_19.jpg">Zarateman</a> · <a href="https://creativecommons.org/publicdomain/zero/1.0/deed.en">CC0</a></li>
        <li>Barcelona · <a href="https://commons.wikimedia.org/wiki/File:Evening_light_over_Barcelona.jpg">M McBey</a> · <a href="https://creativecommons.org/licenses/by/2.0">CC BY 2.0</a></li>
        <li>Valencia · <a href="https://commons.wikimedia.org/wiki/File:Ciutat_de_les_Arts_i_les_Ci%C3%A8ncies_at_night,_May_2017.jpg">William Warby</a> · <a href="https://creativecommons.org/licenses/by/2.0">CC BY 2.0</a></li>
        <li>Sevilla · <a href="https://commons.wikimedia.org/wiki/File:Monumental_Plaza_de_Espa%C3%B1a_de_Sevilla_retouched.jpg">Francisco Colinet</a> · <a href="https://creativecommons.org/licenses/by-sa/3.0/es/deed.en">CC BY-SA 3.0 es</a></li>
        <li>Málaga · <a href="https://commons.wikimedia.org/wiki/File:Da_Gibralfaro_(cropped)2.jpg">Kiban</a> · <a href="https://creativecommons.org/licenses/by-sa/3.0">CC BY-SA 3.0</a></li>
        <li>Alicante · <a href="https://commons.wikimedia.org/wiki/File:Alicante,_Spain.jpg">Bfoto.ru</a> · <a href="https://creativecommons.org/licenses/by-sa/3.0">CC BY-SA 3.0</a></li>
      </ul>
    </LegalPage>
  );
}
