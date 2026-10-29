/**
 * „Für neuen Einsatz vorbereiten“ mit Rückweg (R16-E2): Zeitraum, Ort/Auftrag und Sofortbedarf werden
 * zurückgesetzt; der Stand davor liegt wie bei „Fahrzeug entfernen“ im Sitzungsspeicher des Tabs
 * (15 Minuten, überlebt das Neuladen) und gilt nur, solange der Bogen noch so aussieht wie direkt danach —
 * „Rückgängig“ nimmt nie spätere Eingaben mit.
 */

import type { Einsatz, Erfassungsbogen, Sofortbedarf } from "@bos/eeb-format/model";
import { EINSATZ_WEG_SCHLUESSEL, rueckwegHolen, rueckwegMerken } from "./rueckweg-sitzung";
import { einsatzVorgabe } from "./zeitraum-eingabe";

export interface EinsatzWeg {
  einsatz: Einsatz;
  sofortbedarf?: Sofortbedarf;
  nonce: number;
  /** Fingerabdruck des Bogens direkt nach dem Zurücksetzen; nur dann gilt der Rückweg. */
  danach: string;
}

/** Fingerabdruck der zurückgesetzten Angaben: Der Rückweg gilt nur, solange er passt. */
export function einsatzAbdruck(b: Pick<Erfassungsbogen, "einsatz" | "sofortbedarf">): string {
  return JSON.stringify([b.einsatz, b.sofortbedarf ?? null]);
}

/** Den Bogen für den nächsten Einsatz vorbereiten und den Stand davor merken; liefert den neuen Bogen und den Rückweg. */
export function einsatzVorbereiten(b: Erfassungsbogen, heute: number, stand: number): { bogen: Erfassungsbogen; weg: EinsatzWeg } {
  const { sofortbedarf, ...ohneBedarf } = b;
  const bogen: Erfassungsbogen = { ...ohneBedarf, einsatz: einsatzVorgabe(heute), stand };
  const danach = einsatzAbdruck(bogen);
  const weg: EinsatzWeg = { einsatz: b.einsatz, ...(sofortbedarf ? { sofortbedarf } : {}), nonce: Date.now(), danach };
  rueckwegMerken(EINSATZ_WEG_SCHLUESSEL, weg, danach);
  return { bogen, weg };
}

/** Gilt der Rückweg noch für diesen Bogen? */
export function einsatzWegGilt(weg: EinsatzWeg | null, b: Pick<Erfassungsbogen, "einsatz" | "sofortbedarf"> | null): weg is EinsatzWeg {
  return weg != null && b != null && einsatzAbdruck(b) === weg.danach;
}

/** Der gemerkte Rückweg zu diesem Bogen — nur, wenn er unverändert ist und die Frist nicht um ist. */
export function einsatzWegHolen(b: Pick<Erfassungsbogen, "einsatz" | "sofortbedarf"> | null): EinsatzWeg | null {
  return b ? rueckwegHolen<EinsatzWeg>(EINSATZ_WEG_SCHLUESSEL, einsatzAbdruck(b)) : null;
}


/** Den Stand vor dem Zurücksetzen wiederherstellen und den Rückweg vergessen. */
export function einsatzWiederherstellen(b: Erfassungsbogen, weg: EinsatzWeg, stand: number): Erfassungsbogen {
  const { sofortbedarf: _jetzt, ...ohneBedarf } = b;
  rueckwegMerken(EINSATZ_WEG_SCHLUESSEL, null, "");
  return { ...ohneBedarf, einsatz: weg.einsatz, ...(weg.sofortbedarf ? { sofortbedarf: weg.sofortbedarf } : {}), stand };
}

/** Rückweg vergessen (Quittung geschlossen). */
export function einsatzWegVergessen(): void {
  rueckwegMerken(EINSATZ_WEG_SCHLUESSEL, null, "");
}
