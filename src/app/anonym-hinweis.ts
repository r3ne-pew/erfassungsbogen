/**
 * Anonymisierte Bögen beim Einlesen benennen (R11-A1).
 *
 * Ein Bogen mit Stand über 90 Tage kommt ohne Namen, Funktionen und Erreichbarkeiten an: gewollt
 * (Datenschutzfrist), aber das Papier in der Fahrzeugmappe trägt sie weiter. Die Quittung sagt es, und die
 * Karte erklärt ihre Marke sichtbar statt nur im Tooltip.
 */

import { DATENSCHUTZFRIST_TAGE, datenschutzfristAbgelaufen } from "@bos/eeb-format/datenschutzfrist";
import { MINUTEN_JE_TAG, type EebZeitpunkt, type Erfassungsbogen } from "@bos/eeb-format/model";
import type { MeldeEintrag } from "@bos/meldekopf/einsaetze";
import { einheitAnzeigename } from "./hilfen";

/** Erklärung der Marke „ANONYMISIERT" — sichtbar auf der aufgeklappten Karte und als Tooltip. */
export const ANONYM_ERKLAERUNG =
  `Datenschutzfrist abgelaufen (Stand älter als ${DATENSCHUTZFRIST_TAGE} Tage): Namen, Funktionen, Qualifikationen und ` +
  "Erreichbarkeiten wurden entfernt. Sie stehen nur noch auf dem Papier der Einheit — dort nachfragen.";

/** Ganze Tage zwischen dem Stand des Bogens und jetzt (beide in Minuten, wie `EebZeitpunkt`). */
export function standAlterTage(b: Pick<Erfassungsbogen, "stand">, jetzt: EebZeitpunkt): number {
  return Math.max(0, Math.floor((jetzt - b.stand) / MINUTEN_JE_TAG));
}

/**
 * Satz für die Quittung des Einlesens: nennt die Bögen, die wegen der Frist ohne Namen und Erreichbarkeiten
 * angekommen sind. Leer, wenn keiner betroffen ist.
 */
export function anonymQuittung(eintraege: readonly Pick<MeldeEintrag, "bogen">[], jetzt: EebZeitpunkt): string {
  const betroffen = eintraege.filter((e) => datenschutzfristAbgelaufen(e.bogen, jetzt));
  if (betroffen.length === 0) return "";
  const namen = betroffen
    .map((e) => `„${einheitAnzeigename(e.bogen.einheit)}“ (Stand vor ${standAlterTage(e.bogen, jetzt)} Tagen)`)
    .join(", ");
  return betroffen.length === 1
    ? `1 Bogen ohne Namen und Erreichbarkeiten: Datenschutzfrist, ${namen} — Angaben vom Papier der Einheit nachfragen.`
    : `${betroffen.length} Bögen ohne Namen und Erreichbarkeiten: Datenschutzfrist, ${namen} — Angaben vom Papier der Einheit nachfragen.`;
}

/** „Namen im Code gültig bis 17.10.2026" für den Ausdruck neben dem Code; leer bei Übungsbögen (keine Frist). */
export function codeGueltigBisText(b: Pick<Erfassungsbogen, "uebung" | "stand">, formatiere: (z: EebZeitpunkt) => string): string {
  if (b.uebung) return "";
  return `Namen im Code gültig bis ${formatiere(b.stand + DATENSCHUTZFRIST_TAGE * MINUTEN_JE_TAG)}`;
}
