/**
 * Was unterscheidet die Fassung des anderen Fensters von der eigenen?
 *
 * Die Warnung der zwei Fenster nannte nur Minute und Personenzahl beider
 * Stände; bei einer Änderung nur im Text lasen sich „dort" und „hier" gleich
 * (Audit Runde 7, R7-O2, R7-W5, R7-N6, R7-S2, R7-H3). Diese Datei benennt die
 * Felder, in denen die Fassungen abweichen, und gibt Zeiten mit Sekunden an.
 */

import type { Erfassungsbogen } from "@bos/eeb-format/model";
import { bogenDiff } from "@bos/meldekopf/meldung-diff";

/** „17:44:12 Uhr" aus einem Date.now()-Wert, mit Datum nur wenn nicht heute. */
export function zeitMitSekunden(ms: number): string {
  const d = new Date(ms);
  const uhr = d.toLocaleTimeString("de-DE", { hour: "2-digit", minute: "2-digit", second: "2-digit" });
  return d.toDateString() === new Date().toDateString()
    ? `${uhr} Uhr`
    : `${d.toLocaleDateString("de-DE", { day: "2-digit", month: "2-digit", year: "2-digit" })}, ${uhr} Uhr`;
}

/**
 * Die Abschnitte und Felder, in denen `dort` von `hier` abweicht — als kurze
 * Liste („Ort / Auftrag, Personal (2 geändert), Diesel"). Leer, wenn sich der
 * Bogen inhaltlich nicht unterscheidet (dann liegt der Unterschied nur im
 * Zeitpunkt oder in Zusätzen wie dem Übergabestand).
 */
export function unterschiedText(hier: Erfassungsbogen, dort: Erfassungsbogen, hoechstens = 4): string {
  let d;
  try {
    d = bogenDiff(hier, dort);
  } catch {
    return "";
  }
  if (d.anzahl === 0) return "";
  const teile: string[] = [];
  for (const a of d.sonstiges) teile.push(a.feld);
  const personal = d.personalZugang.length + d.personalAbgang.length + d.personalGeaendert.length;
  if (personal > 0) teile.push(`Personal (${personal} ${personal === 1 ? "Eintrag" : "Einträge"})`);
  else if (d.staerke.length > 0) teile.push("Stärke");
  const fahrzeuge = d.fahrzeugeZugang.length + d.fahrzeugeAbgang.length + d.fahrzeugeGeaendert.length;
  if (fahrzeuge > 0) teile.push(`Fahrzeuge (${fahrzeuge} ${fahrzeuge === 1 ? "Eintrag" : "Einträge"})`);
  for (const a of d.bedarf.filter((x) => x.feld !== "Unterbringung M/W/D")) teile.push(a.feld);
  if (teile.length === 0) teile.push("Sofortbedarf");
  const gezeigt = teile.slice(0, hoechstens);
  const rest = teile.length - gezeigt.length;
  return gezeigt.join(", ") + (rest > 0 ? ` und ${rest} weitere` : "");
}
