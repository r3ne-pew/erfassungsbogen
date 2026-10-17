/**
 * Lagemonitor: die Zahlen für die Anzeige im Führungsfahrzeug.
 *
 * Reine Logik ohne Oberfläche. Die Summen kommen aus `auswertung.ts`, damit der
 * Monitor dieselben Zahlen zeigt wie die Einsatzansicht und das Lageblatt. Der
 * Monitor zeigt nur Zusammenzählungen und Einheitsnamen — keine Personen: Ein
 * Bildschirm im Fahrzeug sieht jeder, der vorbeikommt.
 */

import { staerke } from "@bos/eeb-format/model";
import { einheitOrt } from "@bos/meldekopf/darstellung";
import { EinsatzArt, type Einsatzsammlung } from "@bos/meldekopf/einsaetze";
import { aggregiere, aktuelleMeldungen, type EinsatzSummen } from "./auswertung";
import { funkrufText, natoZeitstempel, orgLabel, vokabText, vokabularFuer } from "./hilfen";

/** Datum-Zeit-Gruppe in ihren Teilen: „17" „1806" „feb" „24" (Tag, Uhrzeit, Monat, Jahr). */
export function dtgTeile(d: Date): { tag: string; zeit: string; monat: string; jahr: string } {
  const s = natoZeitstempel(d);
  return { tag: s.slice(0, 2), zeit: s.slice(2, 6), monat: s.slice(6, 9), jahr: s.slice(9) };
}

const zwei = (n: number) => String(n).padStart(2, "0");

/**
 * Einsatzdauer ausgeschrieben: „1 Tag, 6 Stunden, 6 Minuten". Tage fehlen unter
 * 24 Stunden. `null`, wenn der Beginn fehlt oder in der Zukunft liegt.
 */
export function dauerText(beginn: number | null, jetzt: number): string | null {
  if (beginn == null || jetzt < beginn) return null;
  const minuten = Math.floor((jetzt - beginn) / 60_000);
  const tage = Math.floor(minuten / 1440);
  const stunden = Math.floor((minuten % 1440) / 60);
  const rest = minuten % 60;
  const teil = (n: number, eins: string, viele: string) => `${n} ${n === 1 ? eins : viele}`;
  return [
    ...(tage > 0 ? [teil(tage, "Tag", "Tage")] : []),
    teil(stunden, "Stunde", "Stunden"),
    teil(rest, "Minute", "Minuten"),
  ].join(", ");
}

/** Eine Zeile der Einheitentabelle: Organisation, Ort, Funkrufname, Einheitentyp, Führer/Unterführer/Mannschaft. */
export interface EinheitZeile {
  /** Schlüssel der Meldung — stabil, solange die Einheit gleich bleibt. */
  id: string;
  orga: string;
  ort: string;
  /** Funkrufname des ersten Fahrzeugs, das einen hat; leer, wenn keins einen trägt. */
  funkruf: string;
  typ: string;
  fuehrer: number;
  unterfuehrer: number;
  mannschaft: number;
}

export interface Lagebild {
  name: string;
  ort?: string;
  uebung: boolean;
  summen: EinsatzSummen;
  /** Anwesende Einheiten in der Reihenfolge, in der sie gemeldet wurden. */
  einheiten: EinheitZeile[];
}

export function lagebild(einsatz: Einsatzsammlung): Lagebild {
  const einheiten = [...aktuelleMeldungen(einsatz.eintraege, einsatz.art)]
    .sort((a, b) => a.empfangenAm - b.empfangenAm)
    .map((m): EinheitZeile => {
      const e = m.bogen.einheit;
      const st = staerke(m.bogen);
      return {
        id: m.id,
        orga: e.organisationName?.trim() || orgLabel(e.organisation),
        ort: einheitOrt(e),
        funkruf: m.bogen.fahrzeuge.map((f) => funkrufText(f, e)).find((t) => t !== "") ?? "",
        typ: vokabText(e.einheitsTyp, vokabularFuer(e.organisation, "einheitstyp"), "name").trim(),
        fuehrer: st.fuehrer,
        unterfuehrer: st.unterfuehrer,
        mannschaft: st.mannschaft,
      };
    });
  return {
    name: einsatz.name,
    ort: einsatz.ort,
    uebung: einsatz.art === EinsatzArt.UEBUNG,
    summen: aggregiere(einsatz.eintraege, einsatz.art),
    einheiten,
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
