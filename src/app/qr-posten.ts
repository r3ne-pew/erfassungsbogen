/**
 * Woher kommt die Größe des QR-Codes? (R11-E5)
 *
 * Ein langer Freitext in „Sonstiges" machte aus einem Code 20 Teile, ohne dass irgendwo stand, dass er die
 * Ursache ist; der Helfer suchte sie bei Personal und Fahrzeugen. Ab {@link FREITEXT_HINWEIS_AB} Zeichen sagt
 * das Feld, was der Text kostet, und die Übergabe nennt bei mehr als {@link VIELE_TEILE} Teilen die größten Posten.
 */

import type { Erfassungsbogen } from "@bos/eeb-format/model";

/** Ab so vielen Zeichen weist „Sonstiges" auf die Folge für den QR-Code hin. */
export const FREITEXT_HINWEIS_AB = 500;

/** Ab so vielen Teilen nennt die Übergabe die größten Posten. */
export const VIELE_TEILE = 3;

/** Grob: so viele Zeichen Freitext füllen einen QR-Teil (10 499 Zeichen ergaben in der Messung 20 Teile). */
const ZEICHEN_JE_TEIL = 500;

/** Satz unter dem Freitext; leer, solange der Text kurz ist. */
export function freitextQrHinweis(text: string | undefined): string {
  const n = text?.length ?? 0;
  if (n < FREITEXT_HINWEIS_AB) return "";
  const teile = Math.ceil(n / ZEICHEN_JE_TEIL);
  return `${n.toLocaleString("de-DE")} Zeichen: Lange Texte vergrößern den QR-Code — allein dieser Text füllt etwa ${teile} Code-Teile. Einsatzbefehle und Lagemeldungen besser als eigene Datei oder Papier mitgeben.`;
}

const zahlText = (n: number) => n.toLocaleString("de-DE");

/**
 * Die größten Posten des Bogens für die Übergabe („Freitext „Sonstiges" (10 499 Zeichen), Personal (12 Personen)");
 * leer, wenn kein Posten deutlich heraussticht (unter 30 % des Umfangs von Freitext, Personal und Fahrzeugen).
 */
export function qrGroessePosten(bogen: Erfassungsbogen): string {
  const posten: { text: string; umfang: number }[] = [
    {
      text: `Freitext „Sonstiges" (${zahlText(bogen.sonstiges?.length ?? 0)} Zeichen)`,
      umfang: JSON.stringify(bogen.sonstiges ?? "").length,
    },
    {
      text: `Personal (${zahlText(bogen.personal.length)} ${bogen.personal.length === 1 ? "Person" : "Personen"})`,
      umfang: JSON.stringify(bogen.personal).length,
    },
    {
      text: `Fahrzeuge (${zahlText(bogen.fahrzeuge.length)})`,
      umfang: JSON.stringify(bogen.fahrzeuge).length,
    },
  ];
  const summe = posten.reduce((a, p) => a + p.umfang, 0);
  if (summe <= 0) return "";
  return posten
    .filter((p) => p.umfang / summe >= 0.3)
    .sort((a, b) => b.umfang - a.umfang)
    .map((p) => p.text)
    .join(", ");
}
