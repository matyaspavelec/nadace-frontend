import Link from 'next/link';
import { ShieldCheck } from 'lucide-react';

export const metadata = {
  title: 'Zpracování osobních údajů – Nadace Inge a Miloše Pavelcových',
};

export default function GdprPage() {
  return (
    <div className="page-container" style={{ maxWidth: 820, margin: '0 auto' }}>
      <h1 className="page-title">
        <ShieldCheck size={28} style={{ verticalAlign: 'middle', marginRight: 8 }} />
        Zpracování osobních údajů
      </h1>
      <p className="page-subtitle">
        Informace o zpracování osobních údajů v souladu s nařízením EU 2016/679 (GDPR).
      </p>

      <div className="card" style={{ lineHeight: 1.65 }}>

        <h2 style={{ marginTop: 0 }}>1. Správce osobních údajů</h2>
        <p>
          Správcem osobních údajů je <strong>Nadace Inge a Miloše Pavelcových</strong>,
          se sídlem Vyšší Brod. Kontaktní e-mail: <a href="mailto:milos@pavelec.cz">milos@pavelec.cz</a>.
        </p>
        <p style={{ color: 'var(--text-light)', fontSize: '0.85rem' }}>
          (Upřesněte prosím údaje – IČO, úplnou adresu a kontaktní osobu před spuštěním v produkci.)
        </p>

        <h2>2. Jaké osobní údaje zpracováváme</h2>
        <p>V rámci registrace a užívání systému nadace zpracováváme tyto údaje:</p>
        <ul>
          <li><strong>Identifikační údaje:</strong> jméno, příjmení</li>
          <li><strong>Kontaktní údaje:</strong> e-mail, telefonní číslo</li>
          <li><strong>Rok narození</strong> (nikoliv přesné datum)</li>
          <li><strong>Obec trvalého pobytu</strong> (Vyšší Brod, jeho místní části nebo zadaná obec)</li>
          <li><strong>Údaj o tom, zda máte trvalé bydliště ve Vyšším Brodě</strong></li>
          <li><strong>Bezpečnostní údaje:</strong> zašifrované heslo, IP adresy přihlášení, čas přihlášení (v auditním logu)</li>
          <li><strong>Obsahové údaje:</strong> vámi podané projekty, hlasy, komentáře, recenze</li>
        </ul>
        <p>
          <strong>Nezpracováváme</strong> ulici ani PSČ. <strong>Nezpracováváme</strong> přesné datum narození
          (pouze rok). Minimalizujeme objem zpracovávaných údajů na nezbytné minimum.
        </p>

        <h2>3. Účel a právní základ zpracování</h2>
        <ul>
          <li>
            <strong>Plnění činnosti nadace (čl. 6 odst. 1 písm. b) GDPR – plnění smlouvy / nezbytnost pro přijetí opatření před uzavřením smlouvy)</strong>
            – vedení členské evidence, posuzování žádostí o podporu, hlasování o projektech.
          </li>
          <li>
            <strong>Oprávněný zájem (čl. 6 odst. 1 písm. f) GDPR)</strong>
            – ochrana systému proti zneužití (uchování IP adres a auditního logu).
          </li>
          <li>
            <strong>Souhlas subjektu údajů (čl. 6 odst. 1 písm. a) GDPR)</strong>
            – pro zpracování nad rámec výše uvedeného udělujete výslovný souhlas při registraci.
          </li>
        </ul>

        <h2>4. Doba uchování</h2>
        <ul>
          <li>Osobní údaje členů uchováváme po dobu aktivního členství a maximálně <strong>5 let</strong> po jeho ukončení.</li>
          <li>Zamítnuté registrace mažeme nebo pseudonymizujeme <strong>do 6 měsíců</strong> od zamítnutí.</li>
          <li>Auditní log (IP adresy, logy přihlášení) uchováváme <strong>12 měsíců</strong>.</li>
          <li>Podané projekty a související dokumentace zůstávají v archivu nadace podle spisového řádu.</li>
        </ul>

        <h2>5. Vaše práva</h2>
        <p>Jako subjekt údajů máte podle GDPR právo:</p>
        <ul>
          <li><strong>na přístup</strong> ke svým osobním údajům (čl. 15)</li>
          <li><strong>na opravu</strong> nepřesných údajů (čl. 16) – některé údaje si můžete upravit sami ve svém profilu</li>
          <li><strong>na výmaz</strong> („právo být zapomenut", čl. 17)</li>
          <li><strong>na omezení zpracování</strong> (čl. 18)</li>
          <li><strong>na přenositelnost údajů</strong> (čl. 20)</li>
          <li><strong>vznést námitku</strong> proti zpracování založenému na oprávněném zájmu (čl. 21)</li>
          <li>
            <strong>podat stížnost</strong> u dozorového úřadu –{' '}
            <a href="https://www.uoou.cz" target="_blank" rel="noopener noreferrer">Úřad pro ochranu osobních údajů</a>,
            Pplk. Sochora 27, 170 00 Praha 7
          </li>
        </ul>
        <p>
          Žádost o výmaz nebo export svých dat můžete podat e-mailem na{' '}
          <a href="mailto:milos@pavelec.cz">milos@pavelec.cz</a>.
          Vaši žádost vyřídíme bez zbytečného odkladu, nejpozději do <strong>30 dnů</strong>.
        </p>

        <h2>6. Předávání údajů třetím stranám</h2>
        <p>
          Vaše osobní údaje <strong>nepředáváme</strong> žádným třetím stranám s výjimkou zpracovatelů,
          kteří pro nadaci zajišťují technický provoz aplikace (hostingová platforma Railway, e-mailová
          služba Resend pro odesílání potvrzovacích e-mailů). Všichni zpracovatelé jsou vázáni smluvními
          podmínkami zajišťujícími odpovídající úroveň ochrany osobních údajů.
        </p>
        <p>
          Údaje nepředáváme mimo EU/EHP, s výjimkou případů, kdy to je nezbytné a kdy je zajištěna
          odpovídající úroveň ochrany.
        </p>

        <h2>7. Zabezpečení</h2>
        <p>
          Hesla jsou ukládána ve zašifrované podobě pomocí algoritmu bcrypt. Komunikace s aplikací
          probíhá výhradně přes šifrované spojení HTTPS. Přístup k administrátorskému rozhraní je
          chráněn vícestupňovým oprávněním.
        </p>

        <h2>8. Změny zásad</h2>
        <p>
          Tyto zásady ochrany osobních údajů mohou být čas od času aktualizovány. Aktuální verze je
          vždy dostupná na této stránce. O podstatných změnách budeme registrované členy informovat
          e-mailem.
        </p>

        <p style={{ marginTop: '2rem', fontSize: '0.85rem', color: 'var(--text-light)' }}>
          Poslední aktualizace: duben 2026
        </p>
      </div>

      <div style={{ textAlign: 'center', marginTop: '2rem' }}>
        <Link href="/registrace" className="btn btn-primary">Zpět na registraci</Link>
      </div>
    </div>
  );
}
