/** Gewählte Ansicht des Monitors: „v1" (Bestand) oder „v2" (Einheiten im Vordergrund, Einstellungen im Menü). */
export const ANSICHT_SCHLUESSEL = "eeb.lageansicht.v1";
export type Ansicht = "v1" | "v2";

export function ansichtLesen(): Ansicht {
  try {
    if (globalThis.localStorage?.getItem(ANSICHT_SCHLUESSEL) === "v2") return "v2";
  } catch { /* gesperrter Speicher: Bestand */ }
  return "v1";
}

export function ansichtMerken(ansicht: Ansicht): void {
  try { globalThis.localStorage?.setItem(ANSICHT_SCHLUESSEL, ansicht); } catch { /* nicht gemerkt, der Monitor läuft trotzdem */ }
}

/** Spalten des Kachelrasters von V2: so viele, dass alle Einheiten ohne Rollen ins Bild passen (Seitenverhältnis des Fensters). */
export function kachelSpalten(anzahl: number, breite: number, hoehe: number): number {
  if (anzahl <= 1) return 1;
  const verhaeltnis = breite > 0 && hoehe > 0 ? breite / hoehe : 1.78;
  return Math.min(anzahl, Math.max(1, Math.ceil(Math.sqrt((anzahl * verhaeltnis) / 1.6))));
}
