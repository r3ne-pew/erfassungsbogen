/**
 * Einsatzbeginn für den Lagemonitor.
 *
 * Wann ein Einsatz „anfängt", entscheidet die Führung je Einsatz — es steht in
 * keinem Erfassungsbogen und nicht in der Sammlung. Deshalb liegt der Beginn
 * hier, getrennt vom Schema: ein Zeitpunkt je Einsatz-Kennung, von Hand
 * gesetzt, unter `eeb.lagebeginn.v1`. Keine Namen, keine Personendaten; der
 * Eintrag wandert mit der Datensicherung und fällt mit „Alle Daten löschen".
 *
 * Einträge zu Einsätzen, die es nicht mehr gibt, räumt `einsatzbeginnSetzen`
 * beim nächsten Schreiben ab.
 */

export const BEGINN_SCHLUESSEL = "eeb.lagebeginn.v1";

type Beginne = Record<string, number>;

function speicher(): Storage | null {
  try {
    return globalThis.localStorage ?? null;
  } catch {
    return null;
  }
}

function lesen(): Beginne {
  try {
    const roh = speicher()?.getItem(BEGINN_SCHLUESSEL);
    if (!roh) return {};
    const x = JSON.parse(roh) as unknown;
    if (!x || typeof x !== "object" || Array.isArray(x)) return {};
    const aus: Beginne = {};
    for (const [id, ms] of Object.entries(x)) {
      if (typeof ms === "number" && Number.isFinite(ms)) aus[id] = ms;
    }
    return aus;
  } catch {
    return {};
  }
}

/** Gesetzter Beginn (Date.now()-Wert) oder `null`, wenn keiner gesetzt ist. */
export function einsatzbeginnLaden(einsatzId: string): number | null {
  return lesen()[einsatzId] ?? null;
}

/**
 * Beginn setzen oder mit `null` entfernen. `bekannteIds` sind die Einsätze, die
 * es gibt; alle anderen Einträge fallen dabei weg. Liefert `false`, wenn der
 * Speicher voll oder gesperrt ist.
 */
export function einsatzbeginnSetzen(einsatzId: string, beginn: number | null, bekannteIds: readonly string[]): boolean {
  const neu: Beginne = {};
  for (const [id, ms] of Object.entries(lesen())) {
    if (id !== einsatzId && bekannteIds.includes(id)) neu[id] = ms;
  }
  if (beginn != null) neu[einsatzId] = beginn;
  try {
    const s = speicher();
    if (!s) return false;
    if (Object.keys(neu).length === 0) s.removeItem(BEGINN_SCHLUESSEL);
    else s.setItem(BEGINN_SCHLUESSEL, JSON.stringify(neu));
    return true;
  } catch {
    return false;
  }
}
