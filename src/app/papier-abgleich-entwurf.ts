/**
 * Zwischenstand des Papier-Abgleichs (Audit Runde 7, R7-S1/R7-G1).
 *
 * Der Abgleich ist die Arbeit nach einem Geräteausfall: je Einheit fünf Felder,
 * bei acht Einheiten rund vierzig Eingaben vom Papier. Sie lagen nur im
 * Komponentenzustand — Neuladen, „Später" und „‹ Startseite" warfen sie ohne
 * Frage weg. Jetzt liegen sie im SITZUNGSSPEICHER des Browsers (nicht im
 * dauerhaften `localStorage`): Sie überleben Neuladen, „Später" und den Wechsel
 * auf die Startseite, verschwinden aber mit dem Schließen des Tabs und werden
 * nach „Abgleich übernehmen" oder auf ausdrücklichen Wunsch gelöscht.
 *
 * Schlüssel: `eeb.papierabgleich.v1.<Einsatz-ID>` (sessionStorage).
 *
 * R15-A4: Ein vom Betriebssystem beendeter Browser oder ein leerer Akku nahm den Zwischenstand mit — die
 * Nacherfassung von 20 Zeilen vom Meldeblock begann von vorn. Derselbe Schlüssel liegt jetzt zusätzlich im
 * dauerhaften `localStorage` (Wert: `{ am, zeilen }`, nur Nr., Zeit, Zug, Notiz, Name der Einheit) und verfällt nach
 * {@link ENTWURF_FRIST_MS}; der Sitzungsspeicher bleibt die erste Quelle. „Abgleich übernehmen" und „Verwerfen"
 * löschen beide, „Alle Daten löschen" wie alles unter `eeb.`.
 */

export interface AbgleichZeile {
  eintragId: string;
  name: string;
  eingetroffen: string;
  abgerueckt: boolean;
  abgerueckAm: string;
  zug: string;
  notiz: string;
  nummer: string;
}

const PRAEFIX = "eeb.papierabgleich.v1.";

/** So lange gilt der dauerhaft gelegte Zwischenstand; danach ist es ein neuer Einsatztag (R15-A4). */
export const ENTWURF_FRIST_MS = 3 * 24 * 3_600_000;

function ort(art: "sessionStorage" | "localStorage"): Storage | null {
  try {
    return globalThis[art] ?? null;
  } catch {
    return null;
  }
}
const speicher = () => ort("sessionStorage");
const dauerhaft = () => ort("localStorage");

export function abgleichSchluessel(einsatzId: string): string {
  return `${PRAEFIX}${einsatzId}`;
}

/** Hat die Zeile etwas, was die Ausgangszeile nicht hat? */
export function zeileGeaendert(z: AbgleichZeile, basis: AbgleichZeile): boolean {
  return (
    z.eingetroffen !== basis.eingetroffen ||
    z.abgerueckt !== basis.abgerueckt ||
    z.abgerueckAm !== basis.abgerueckAm ||
    z.zug !== basis.zug ||
    z.notiz !== basis.notiz ||
    z.nummer !== basis.nummer
  );
}

/** Anzahl der Einheiten, bei denen schon etwas eingetragen oder geändert wurde. */
export function geaenderteZeilen(zeilen: AbgleichZeile[], basis: AbgleichZeile[]): number {
  return zeilen.filter((z) => {
    const b = basis.find((x) => x.eintragId === z.eintragId);
    return b ? zeileGeaendert(z, b) : false;
  }).length;
}

/** Zwischenstand lesen; unlesbar oder fehlend ergibt eine leere Liste. */
export function abgleichEntwurfLaden(einsatzId: string, jetzt = Date.now()): AbgleichZeile[] {
  try {
    const schluessel = abgleichSchluessel(einsatzId);
    let x: unknown = null;
    const roh = speicher()?.getItem(schluessel);
    if (roh) x = JSON.parse(roh) as unknown;
    else {
      // Neuer Browserstart: Der Sitzungsspeicher ist leer, der dauerhafte Zwischenstand trägt (R15-A4).
      const spaet = dauerhaft()?.getItem(schluessel);
      const d = spaet ? (JSON.parse(spaet) as { am?: unknown; zeilen?: unknown }) : null;
      if (d && typeof d.am === "number" && jetzt - d.am <= ENTWURF_FRIST_MS) x = d.zeilen;
      else if (d) dauerhaft()?.removeItem(schluessel);
    }
    if (!Array.isArray(x)) return [];
    return x.filter(
      (z): z is AbgleichZeile =>
        !!z &&
        typeof z === "object" &&
        typeof z.eintragId === "string" &&
        typeof z.eingetroffen === "string" &&
        typeof z.abgerueckt === "boolean" &&
        typeof z.abgerueckAm === "string" &&
        typeof z.zug === "string" &&
        typeof z.notiz === "string" &&
        typeof z.nummer === "string",
    );
  } catch {
    return [];
  }
}

/**
 * Zwischenstand ablegen — nur die Zeilen mit Eingaben; ist nichts eingetragen,
 * wird er entfernt (nichts Leeres im Speicher).
 */
export function abgleichEntwurfSpeichern(einsatzId: string, zeilen: AbgleichZeile[], basis: AbgleichZeile[]): void {
  try {
    const s = speicher();
    if (!s) return;
    // Nur die Zeilen, bei denen etwas steht: Die Zahl der gespeicherten Zeilen ist dann die
    // Zahl der Einheiten mit Eingaben.
    const mitEingaben = zeilen.filter((z) => {
      const b = basis.find((x) => x.eintragId === z.eintragId);
      return b ? zeileGeaendert(z, b) : false;
    });
    if (mitEingaben.length === 0) abgleichEntwurfLoeschen(einsatzId);
    else {
      s.setItem(abgleichSchluessel(einsatzId), JSON.stringify(mitEingaben));
      dauerhaft()?.setItem(abgleichSchluessel(einsatzId), JSON.stringify({ am: Date.now(), zeilen: mitEingaben }));
    }
  } catch {
    /* Speicher voll oder gesperrt — der Abgleich arbeitet dann wie bisher ohne Zwischenstand */
  }
}

export function abgleichEntwurfLoeschen(einsatzId: string): void {
  for (const s of [speicher(), dauerhaft()]) {
    try {
      s?.removeItem(abgleichSchluessel(einsatzId));
    } catch {
      /* nichts zu tun */
    }
  }
}

/**
 * Ausgangszeilen mit dem Zwischenstand überlagern. Nur Einheiten, die noch
 * offen sind, werden übernommen; Namen kommen aus der Ausgangslage.
 */
export function abgleichZeilenMitEntwurf(basis: AbgleichZeile[], entwurf: AbgleichZeile[]): AbgleichZeile[] {
  return basis.map((b) => {
    const e = entwurf.find((x) => x.eintragId === b.eintragId);
    return e ? { ...e, name: b.name } : b;
  });
}
