/**
 * Offene Folgeschritte der Erfassung für eine Sammlung (R15-S4): „In Einsatz übernehmen" liegt in der festen Leiste
 * 16 px über „Weiter →" und nahm die Einheit auf jedem Schritt sofort auf, auch wenn Fahrzeuge und Sofortbedarf noch
 * nicht bearbeitet waren. Die App fragt einmal je Erfassung nach, wenn dahinter noch etwas leer ist.
 * Die App lädt dieses Modul erst beim Übernehmen (Startbündel, ADR-003).
 */
import type { Erfassungsbogen } from "@bos/eeb-format/model";
import { frageJaNein } from "./dialoge";

/** Schritte des Assistenten (Index in der Fortschrittsleiste): 3 = Fahrzeuge, 4 = Sofortbedarf. */
const SCHRITT_FAHRZEUGE = 3;
const SCHRITT_BEDARF = 4;

/**
 * Namen der noch nicht erreichten Schritte, in denen der Bogen noch nichts trägt: „Fahrzeuge", „Sofortbedarf".
 * Wer den Schritt schon verlassen hat, hat ihn gesehen — dort wird nicht gefragt.
 */
export function offeneFolgeschritte(b: Erfassungsbogen, schritt: number): string[] {
  // Auf den ersten Schritten ist „In Einsatz übernehmen" der gewollte Kurzweg der Schnellerfassung (Einheit und
  // Stärke genügen); gefragt wird dort, wo Fahrzeuge und Sofortbedarf als Nächstes dran wären.
  if (schritt < SCHRITT_FAHRZEUGE) return [];
  const offen: string[] = [];
  if (schritt <= SCHRITT_FAHRZEUGE && b.fahrzeuge.length === 0) offen.push("Fahrzeuge");
  const sb = b.sofortbedarf;
  const bedarfLeer = !sb || (!sb.dieselLiter && !sb.benzinLiter && !sb.gemischLiter && !sb.unterbringung && !sb.ruhezeitErforderlich);
  if (schritt <= SCHRITT_BEDARF && bedarfLeer) offen.push("Sofortbedarf");
  return offen;
}

/** Rückfrage vor dem Übernehmen; `true` = weiter (nichts offen oder bewusst „Jetzt übernehmen"). */
export async function folgeschrittFrage(b: Erfassungsbogen, schritt: number): Promise<boolean> {
  const offen = offeneFolgeschritte(b, schritt);
  if (offen.length === 0) return true;
  return frageJaNein({
    titel: "Erfassung schon abschließen?",
    text: `${offen.join(" und ")} ${offen.length === 1 ? "ist" : "sind"} noch nicht bearbeitet. Die Einheit zählt danach ohne ${offen.length === 1 ? "diese Angabe" : "diese Angaben"} in der Lage; an der Karte lässt sich später ergänzen.`,
    ok: "Jetzt übernehmen",
    abbruch: "Weiter erfassen",
    fokus: "abbruch",
  });
}
