/**
 * Gegenüberstellung beim Ersetzen einer Vorlage über Personen und Fahrzeuge hinaus (R13-D4). Eigenes Modul, weil nur
 * die Übersicht (nachgeladen) es braucht und die Vorlagenverwaltung im Startbündel nicht wachsen soll.
 */
import type { Erfassungsbogen } from "@bos/eeb-format/model";
import { vokabText, vokabularFuer } from "./hilfen";
import { bogenAlsVorlage } from "./vorlagen";

function wertText(b: Erfassungsbogen): string {
  const w = b.einheit.einheitsTyp;
  return (w.freitext ?? "").trim() || (w.code != null ? vokabText(w, vokabularFuer(b.einheit.organisation, "einheitstyp"), "name") : "");
}

function bedarfText(b: Erfassungsbogen): string {
  const s = b.sofortbedarf;
  if (!s) return "";
  return `${s.dieselLiter} l Diesel, ${s.benzinLiter} l Benzin, ${s.gemischLiter} l Gemisch, Verpflegung ${s.verpflegungPersonen}`;
}

/**
 * Wodurch sich eine vorhandene Vorlage vom ersetzenden Bogen unterscheidet: Einheitstyp, Ort/Auftrag und Sofortbedarf.
 * Verglichen wird, was gespeichert würde (`bogenAlsVorlage`: Ort/Auftrag gehen dabei immer leer in die Vorlage).
 * Leere Liste: kein weiterer Unterschied.
 */
export function vorlageUnterschiede(vorhanden: Erfassungsbogen, neu: Erfassungsbogen): string[] {
  const gespeichert = bogenAlsVorlage(neu);
  const liste: string[] = [];
  const typAlt = wertText(vorhanden);
  const typNeu = wertText(gespeichert);
  if (typAlt !== typNeu) liste.push(`Einheitstyp: „${typAlt || "leer"}" → „${typNeu || "leer"}"`);
  const ortAlt = vorhanden.einsatz.ortAuftrag.trim();
  const ortNeu = gespeichert.einsatz.ortAuftrag.trim();
  if (ortAlt !== ortNeu) liste.push(`Ort/Auftrag: „${ortAlt || "leer"}" → „${ortNeu || "leer"}"`);
  const bedarfAlt = bedarfText(vorhanden);
  const bedarfNeu = bedarfText(gespeichert);
  if (bedarfAlt !== bedarfNeu) liste.push(`Sofortbedarf: ${bedarfAlt || "keiner"} → ${bedarfNeu || "keiner"}`);
  return liste;
}

/** Satz für die Rückfrage: „ Weitere Unterschiede …"; leer, wenn es keine gibt. */
export function unterschiedSatz(unterschiede: readonly string[]): string {
  return unterschiede.length === 0 ? "" : ` Weitere Unterschiede (gehen beim Ersetzen verloren): ${unterschiede.join("; ")}.`;
}
