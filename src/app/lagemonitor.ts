/**
 * Lagemonitor: die Zahlen für die Anzeige im Führungsfahrzeug.
 *
 * Reine Logik ohne Oberfläche. Die Summen kommen aus `auswertung.ts`, damit der
 * Monitor dieselben Zahlen zeigt wie die Einsatzansicht und das Lageblatt. Der
 * Monitor zeigt nur Zusammenzählungen und Einheitsnamen — keine Personen: Ein
 * Bildschirm im Fahrzeug sieht jeder, der vorbeikommt.
 */

import { EinsatzArt, MeldeStatus, type Einsatzsammlung } from "@bos/meldekopf/einsaetze";
import { aggregiere, aggregiereNachZug, aktuelleMeldungen, type EinsatzSummen, type ZugGruppe } from "./auswertung";
import { einheitAnzeigename, natoZeitstempel } from "./hilfen";

/** So viele jüngste Meldungen zeigt der Monitor. */
export const LETZTE_MELDUNGEN = 6;
/** So lange gilt eine Meldung als „neu" (hervorgehoben). */
export const NEU_MS = 15 * 60 * 1000;

/** Datum-Zeit-Gruppe wie im Funk: „172035 OKT 26". */
export function dtgText(d: Date): string {
  const s = natoZeitstempel(d);
  return `${s.slice(0, 6)} ${s.slice(6, 9).toUpperCase()} ${s.slice(9)}`;
}

const zwei = (n: number) => String(n).padStart(2, "0");

/**
 * Einsatzdauer als „03:15 h" bzw. „2 d 03:15 h". `null`, wenn der Beginn fehlt
 * oder in der Zukunft liegt (dann steht am Monitor „beginnt in …" statt einer
 * negativen Dauer).
 */
export function dauerText(beginn: number | null, jetzt: number): string | null {
  if (beginn == null || jetzt < beginn) return null;
  const minuten = Math.floor((jetzt - beginn) / 60_000);
  const tage = Math.floor(minuten / 1440);
  const rest = minuten % 1440;
  const zeit = `${zwei(Math.floor(rest / 60))}:${zwei(rest % 60)} h`;
  return tage > 0 ? `${tage} d ${zeit}` : zeit;
}

/** „gerade eben", „vor 7 Min", „vor 2 Std 5 Min", „vor 3 d". */
export function vorText(zeit: number, jetzt: number): string {
  const minuten = Math.max(0, Math.floor((jetzt - zeit) / 60_000));
  if (minuten < 1) return "gerade eben";
  if (minuten < 60) return `vor ${minuten} Min`;
  const stunden = Math.floor(minuten / 60);
  if (stunden < 24) return minuten % 60 === 0 ? `vor ${stunden} Std` : `vor ${stunden} Std ${minuten % 60} Min`;
  return `vor ${Math.floor(stunden / 24)} d`;
}

export interface LetzteMeldung {
  name: string;
  zug?: string;
  empfangenAm: number;
  neu: boolean;
}

export interface Lagebild {
  name: string;
  ort?: string;
  uebung: boolean;
  summen: EinsatzSummen;
  zuege: ZugGruppe[];
  letzte: LetzteMeldung[];
  /** Zeitpunkt der jüngsten Meldung insgesamt (auch abgerückter Einheiten), sonst `null`. */
  letzteMeldungAm: number | null;
}

export function lagebild(einsatz: Einsatzsammlung, jetzt: number): Lagebild {
  const anwesend = aktuelleMeldungen(einsatz.eintraege, einsatz.art);
  const letzte = [...anwesend]
    .sort((a, b) => b.empfangenAm - a.empfangenAm)
    .slice(0, LETZTE_MELDUNGEN)
    .map((m) => ({
      name: einheitAnzeigename(m.bogen.einheit) || "(ohne Namen)",
      zug: m.zugEtikett,
      empfangenAm: m.empfangenAm,
      neu: jetzt - m.empfangenAm <= NEU_MS,
    }));
  const alle = einsatz.eintraege.filter((e) => e.status !== MeldeStatus.AUFGEGANGEN);
  return {
    name: einsatz.name,
    ort: einsatz.ort,
    uebung: einsatz.art === EinsatzArt.UEBUNG,
    summen: aggregiere(einsatz.eintraege, einsatz.art),
    zuege: aggregiereNachZug(einsatz.eintraege, einsatz.art),
    letzte,
    letzteMeldungAm: alle.length ? Math.max(...alle.map((e) => e.empfangenAm)) : null,
  };
}

/** Wert für das `datetime-local`-Feld (Ortszeit, ohne Sekunden). */
export function zuEingabeWert(ms: number): string {
  const d = new Date(ms);
  return `${d.getFullYear()}-${zwei(d.getMonth() + 1)}-${zwei(d.getDate())}T${zwei(d.getHours())}:${zwei(d.getMinutes())}`;
}

/** Eingabewert → Zeitpunkt; leer oder ungültig → `null`. */
export function ausEingabeWert(wert: string): number | null {
  if (!wert) return null;
  const ms = new Date(wert).getTime();
  return Number.isFinite(ms) ? ms : null;
}
