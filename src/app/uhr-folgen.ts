/**
 * Was eine Geräteuhr löschen würde — gerechnet gegen die rohen Einträge im
 * Speicher, ohne die Ablage-Hüllen (Audit Runde 5, R5-D1).
 *
 * Die Geräteuhr-Prüfung (datenschutz-uhr.ts) hält einen Sprung zurück, wenn
 * dadurch etwas fällig würde, und verlangt dann eine Bestätigung. Dafür muss
 * sie wissen, OB etwas fällig würde: Bei einer echten Pause (100 Tage nichts
 * geöffnet, leeres Gerät oder nichts Altes darauf) gibt es nichts zu fragen,
 * und die Warnung „Geräteuhr prüfen" wäre falscher Alarm. Und die Warnung
 * soll die Folge mit Zahlen nennen („3 Sammlungen, die Namen im eigenen
 * Bogen"), damit die Bestätigung eine Entscheidung ist.
 *
 * Gelesen wird direkt aus `localStorage`, nicht über die Hüllen und den Kern:
 * Die Hüllen fragen ihrerseits die Uhr.
 */

import { datenschutzfristAbgelaufen } from "@bos/eeb-format/datenschutzfrist";
import { EEB_EPOCHE_MS, MINUTEN_JE_TAG, type EebZeitpunkt } from "@bos/eeb-format/model";
import { AUFRAEUM_FRIST_MS } from "@bos/meldekopf/einsaetze";
import { PAPIERKORB_FRIST_MS } from "@bos/meldekopf/papierkorb";

const EINSAETZE = "eeb.einsaetze.v1";
const VORLAGEN = "eeb.vorlagen.v1";
const ENTWURF = "eeb.entwurf.v1";
const ERSETZT = "eeb.entwurf.ersetzt.v1";

/** Was beim nächsten Lesen mit der Geräteuhr endgültig verloren ginge. */
export interface UhrFolgen {
  /** Laufende Sammlungen, die unter die Aufräumfrist fielen (endgültig, ohne Papierkorb). */
  sammlungen: number;
  /** Deren Namen, für die Rückfrage vor dem Einspielen einer Sicherung (R5-D4). */
  namen: string[];
  /** Einträge im Papierkorb (Sammlungen und Vorlagen), deren 30 Tage um wären. */
  papierkorb: number;
  /** Meldungen in Sammlungen, deren Personendaten anonymisiert würden. */
  meldungen: number;
  /** Der eigene Bogen (Entwurf oder Rückholplatz) würde anonymisiert. */
  entwurf: boolean;
}

function speicher(): Storage | null {
  try {
    return globalThis.localStorage ?? null;
  } catch {
    return null;
  }
}

/** Liest einen Eintrag als Rohtext; `null` = nicht vorhanden. */
export type RohLeser = (schluessel: string) => string | null;

function lesen(s: RohLeser, schluessel: string): unknown {
  try {
    const roh = s(schluessel);
    return roh ? (JSON.parse(roh) as unknown) : null;
  } catch {
    return null;
  }
}

function zahl(x: unknown): number | null {
  return typeof x === "number" && Number.isFinite(x) ? x : null;
}

function bogenAbgelaufen(bogen: unknown, jetzt: EebZeitpunkt): boolean {
  const b = bogen as { uebung?: unknown; stand?: unknown } | null;
  const stand = zahl(b?.stand);
  if (stand == null) return false;
  return datenschutzfristAbgelaufen({ uebung: b?.uebung === true, stand }, jetzt);
}

/** Lokale Wandzeit eines Date.now()-Werts als EebZeitpunkt (wie `jetztZeitpunkt`). */
export function zeitpunktAusMs(ms: number): EebZeitpunkt {
  const d = new Date(ms);
  return Math.round(
    (Date.UTC(d.getFullYear(), d.getMonth(), d.getDate(), d.getHours(), d.getMinutes()) - EEB_EPOCHE_MS) / 60_000,
  );
}

/** Umkehrung von {@link zeitpunktAusMs}: Date.now()-Wert zur lokalen Wandzeit. */
export function msAusZeitpunkt(z: EebZeitpunkt): number {
  const d = new Date(EEB_EPOCHE_MS + z * 60_000);
  return new Date(d.getUTCFullYear(), d.getUTCMonth(), d.getUTCDate(), d.getUTCHours(), d.getUTCMinutes()).getTime();
}

/**
 * Folgen für den Speicher dieses Geräts, oder — mit `leser` — für beliebige
 * Einträge, etwa die einer Sicherungsdatei (R5-D4).
 */
export function uhrFolgen(jetztMs: number = Date.now(), leser?: RohLeser): UhrFolgen {
  const folgen: UhrFolgen = { sammlungen: 0, namen: [], papierkorb: 0, meldungen: 0, entwurf: false };
  let s = leser;
  if (!s) {
    const speicherRef = speicher();
    if (!speicherRef) return folgen;
    s = (k) => speicherRef.getItem(k);
  }
  const jetztZ = zeitpunktAusMs(jetztMs);
  const sammlungen = lesen(s, EINSAETZE);
  if (Array.isArray(sammlungen)) {
    for (const e of sammlungen as Record<string, unknown>[]) {
      if (!e || typeof e !== "object") continue;
      const geloescht = zahl(e.geloeschtAm);
      const geaendert = zahl(e.geaendert);
      if (geloescht != null) {
        if (jetztMs - geloescht >= PAPIERKORB_FRIST_MS) folgen.papierkorb++;
        continue;
      }
      if (geaendert != null && jetztMs - geaendert >= AUFRAEUM_FRIST_MS) {
        folgen.sammlungen++;
        folgen.namen.push(typeof e.name === "string" && e.name ? e.name : "(ohne Namen)");
        continue;
      }
      if (Array.isArray(e.eintraege)) {
        for (const m of e.eintraege as { bogen?: unknown }[]) if (bogenAbgelaufen(m?.bogen, jetztZ)) folgen.meldungen++;
      }
    }
  }
  const vorlagen = lesen(s, VORLAGEN);
  if (Array.isArray(vorlagen)) {
    for (const v of vorlagen as Record<string, unknown>[]) {
      const g = zahl(v?.geloeschtAm);
      if (g != null && jetztMs - g >= PAPIERKORB_FRIST_MS) folgen.papierkorb++;
    }
  }
  for (const k of [ENTWURF, ERSETZT]) {
    const e = lesen(s, k) as { bogen?: unknown } | null;
    if (e && bogenAbgelaufen(e.bogen, jetztZ)) folgen.entwurf = true;
  }
  return folgen;
}

export function folgenVorhanden(f: UhrFolgen): boolean {
  return f.sammlungen > 0 || f.papierkorb > 0 || f.meldungen > 0 || f.entwurf;
}

/** „2 Sammlungen, 3 Papierkorb-Einträge, die Namen in 5 Meldungen und die Namen im eigenen Bogen" — leer, wenn nichts. */
export function folgenText(f: UhrFolgen): string {
  const teile: string[] = [];
  if (f.sammlungen > 0) teile.push(f.sammlungen === 1 ? "1 Sammlung" : `${f.sammlungen} Sammlungen`);
  if (f.papierkorb > 0) teile.push(f.papierkorb === 1 ? "1 Papierkorb-Eintrag" : `${f.papierkorb} Papierkorb-Einträge`);
  if (f.meldungen > 0) teile.push(f.meldungen === 1 ? "die Namen in 1 Meldung" : `die Namen in ${f.meldungen} Meldungen`);
  if (f.entwurf) teile.push("die Namen im eigenen Bogen");
  if (teile.length <= 1) return teile[0] ?? "";
  return `${teile.slice(0, -1).join(", ")} und ${teile[teile.length - 1]}`;
}

/** Tage zwischen zwei Zeitpunkten, aufgerundet auf ganze Tage. */
export function tageZwischen(a: EebZeitpunkt, b: EebZeitpunkt): number {
  return Math.max(1, Math.round(Math.abs(b - a) / MINUTEN_JE_TAG));
}
