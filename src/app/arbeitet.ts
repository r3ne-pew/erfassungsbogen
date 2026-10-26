/**
 * Eine Aktion, die Sekunden dauert — sperrt sich selbst gegen den zweiten
 * Tipp und sagt, dass sie läuft (Audit Runde 5, R5-O3, R5-H4, R5-L4).
 *
 * „Einsatz weitergeben / sichern" brauchte bei 30 Bögen 18 s ohne jede
 * Rückmeldung, der Knopf blieb frei, und ein zweiter Tipp erzeugte eine zweite
 * Datei gleichen Namens. Beim Blanko-Vordruck und Lageblatt war es dasselbe
 * (vier Sekunden und länger), beim Bogen-PDF stand „wird erstellt" nur, solange
 * die Oberfläche überhaupt neu zeichnen konnte. Eine gemeinsame Stelle für alle:
 *
 * - **Eine Sperre für alle PDF-Wege.** Es läuft höchstens eine dieser Aktionen,
 *   auch von verschiedenen Stellen der Oberfläche aus (Einsatzansicht, Startseite,
 *   Fußzeile): Die PDF-Erzeugung läuft im Hauptfaden, zwei gleichzeitig würden
 *   einander ausbremsen und zwei Dateien liefern.
 * - **Erst zeichnen, dann rechnen.** Vor der schweren Arbeit gibt die Aktion der
 *   Oberfläche ein Bild, damit „wird erzeugt…" schon steht, wenn der Hauptfaden
 *   für Sekunden blockiert ist.
 * - **Alle Knöpfe lesen denselben Zustand** ({@link useArbeitet}) und beschriften
 *   sich selbst; der Zustand ist der Name der laufenden Aktion.
 */
import { useSyncExternalStore } from "react";

let aktuell: string | null = null;
const hoerer = new Set<() => void>();

function melden(): void {
  for (const h of hoerer) h();
}

function abonnieren(h: () => void): () => void {
  hoerer.add(h);
  return () => hoerer.delete(h);
}

/**
 * Satz zur Dauer der Sammel-PDF, an der Zahl der Bögen ausgerichtet (R15-O1): gemessen rund 0,4 s je Bogen am Rechner,
 * mit vierfach gedrosselter CPU (Telefon) rund 1,5 s. „Bis zu einer halben Minute" galt nur für kleine Einsätze; wer
 * nach 40 Sekunden noch nichts sah, hielt die App für hängend. Einen Fortschritt „n von m" gibt es nicht: Die Erzeugung
 * läuft in einem Zug im Hauptfaden.
 */
export function sammelPdfDauerText(boegen: number): string {
  const s = Math.ceil(boegen * 1.5);
  return `Die Sammel-PDF wird erzeugt — bei ${boegen} ${boegen === 1 ? "Bogen" : "Bögen"} am Telefon etwa ${s < 60 ? `${s} Sekunden` : `${Math.ceil(s / 60)} Min.`} oder länger. Nicht noch einmal tippen, Bildschirm anlassen.`;
}

/** Name der gerade laufenden Aktion, sonst null. */
export function arbeitetGerade(): string | null {
  return aktuell;
}

/** Hook: Name der laufenden Aktion, sonst null — die Oberfläche zeichnet bei jedem Wechsel neu. */
export function useArbeitet(): string | null {
  return useSyncExternalStore(abonnieren, arbeitetGerade, arbeitetGerade);
}

/** Der Oberfläche ein Bild geben (Sperre sichtbar machen), bevor schwere Arbeit den Hauptfaden belegt. */
export function naechstesBild(): Promise<void> {
  return new Promise((fertig) => {
    if (typeof requestAnimationFrame === "function") requestAnimationFrame(() => setTimeout(fertig, 0));
    else setTimeout(fertig, 0);
  });
}

/**
 * `aktion` unter dem Namen `was` ausführen, sofern gerade nichts anderes läuft.
 * Ein zweiter Aufruf in der Zeit tut nichts und meldet `lief: false`.
 */
export async function arbeiten<T>(was: string, aktion: () => Promise<T>): Promise<{ lief: true; wert: T } | { lief: false }> {
  if (aktuell !== null) return { lief: false };
  aktuell = was;
  lauf = { von: zeitJetzt(), bis: Infinity };
  melden();
  try {
    await naechstesBild();
    return { lief: true, wert: await aktion() };
  } finally {
    aktuell = null;
    if (lauf) lauf.bis = zeitJetzt();
    melden();
  }
}

/** Zeitbasis der Ereigniszeit (`Event.timeStamp`): Millisekunden seit dem Seitenstart. */
function zeitJetzt(): number {
  return typeof performance !== "undefined" ? performance.now() : Date.now();
}

let lauf: { von: number; bis: number } | null = null;

/**
 * Wurde der Tipp mit der Ereigniszeit `zeit` (`event.timeStamp`) während des letzten oder des laufenden Laufs
 * ausgeführt? Die Erzeugung blockiert den Hauptfaden mehrere Sekunden: Ein zweiter Tipp, der schon nach 150 ms
 * erfolgte, wird erst danach bearbeitet — und fände dann Sperre und Zeitfenster längst abgelaufen. Die Ereigniszeit
 * verrät, dass er zu früh kam (R13-G1).
 */
export function tippWaehrendLauf(zeit: number): boolean {
  if (!lauf || !Number.isFinite(zeit)) return false;
  return zeit >= lauf.von && zeit <= lauf.bis + NACHLAUF_MS;
}

/**
 * Ein Tipp kurz NACH dem Ende des Laufs gehört noch zum Doppeltipp (R14-G1): Der Finger tippte auf den gesperrten
 * Knopf, sah nichts, und tippt nach Sekunden noch einmal — oder ein Prüfer wartet, bis der Knopf wieder frei ist,
 * und tippt dann sofort. Wer die Datei bewusst ein zweites Mal will, liest erst die Quittung.
 */
export const NACHLAUF_MS = 1200;

/** Nur für Tests. */
export function arbeitetZuruecksetzen(): void {
  aktuell = null;
  lauf = null;
  melden();
}
