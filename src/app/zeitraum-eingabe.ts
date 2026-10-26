/**
 * Datumsfelder „Zeitraum von/bis" (R12-E3). Wer ein Datum im Feld löscht (Löschen im Datumsdialog des Telefons),
 * bekam bisher stillschweigend den 01.01.1900 (`datumAusIso("")`), und die Hinweise sprachen von einem „Tippfehler
 * im Jahr 1900". Jetzt fällt ein leeres „bis" auf den Tag von „von" zurück (wie die Beschriftung „Vorschlag: wie
 * Beginn" sagt), ein leeres „von" auf heute.
 */

import { datumAusIso, type EebDatum } from "@bos/eeb-format/model";

export interface Zeitraum {
  zeitraumVon: EebDatum;
  zeitraumBis: EebDatum;
}

/** Neuer Zeitraum nach einer Eingabe in „von" (`feld = "von"`) oder „bis"; `iso` ist der Feldwert (leer = gelöscht). */
export function zeitraumNachEingabe(
  alt: Zeitraum,
  feld: "von" | "bis",
  iso: string,
  heute: EebDatum,
): Zeitraum {
  const bisFolgtVon = alt.zeitraumBis === alt.zeitraumVon;
  if (feld === "von") {
    const von = iso ? datumAusIso(iso) : heute;
    return { zeitraumVon: von, zeitraumBis: bisFolgtVon ? von : alt.zeitraumBis };
  }
  return { zeitraumVon: alt.zeitraumVon, zeitraumBis: iso ? datumAusIso(iso) : alt.zeitraumVon };
}
