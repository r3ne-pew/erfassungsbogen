/**
 * Alter der Angaben einer Meldung (R14-K1).
 *
 * „Meldung vor 5 Min" maß bisher das Eintreffen am Gerät. Ein Bogen, den die Einheit gestern Abend erstellt hat und
 * der heute früh gescannt oder per Datei übergeben wird, galt damit als „gerade eben" — die Zahlen darin sind aber
 * vierzehn Stunden alt. Alle Altersmarken (Kopf, Karte, Tabelle, Filter, Monitor, Lageblatt) rechnen deshalb ab dem
 * früheren von beiden: dem Stand im Bogen oder dem Eingang. Ein Stand nach dem Eingang (falsche Geräteuhr, eigene
 * Warnung) verlängert nichts.
 */
import type { EebZeitpunkt } from "@bos/eeb-format/model";
import { zeitpunktZuMs as standMs } from "./eintrag-zeiten";

/** Ab diesem Abstand zwischen Stand und Eingang nennt die Altersangabe den Stand statt der Meldung. */
export const STAND_VOR_EINGANG_MS = 60 * 60_000;

interface MitStand {
  empfangenAm: number;
  bogen: { stand: EebZeitpunkt };
}

/** Zeit, ab der die Angaben gelten: Stand im Bogen, höchstens aber der Eingang (ms). */
export function angabenZeit(e: MitStand): number {
  return Math.min(e.empfangenAm, standMs(e.bogen.stand));
}

/** Liegt der Stand mindestens eine Stunde vor dem Eingang? Dann sagt die Marke „Stand vor …" statt „Meldung vor …". */
export function standLiegtWeitVorEingang(e: MitStand): boolean {
  return e.empfangenAm - standMs(e.bogen.stand) >= STAND_VOR_EINGANG_MS;
}

/**
 * Quittung nach einem Stapel (R14-A1): Die Eintreffzeit der eingelesenen Bögen ist die Zeit des Einlesens — bei sechs
 * Bögen in einem Zug stünde sonst überall dieselbe Minute wie eine Ankunftszeit auf dem Lageblatt. Leer unter zwei Bögen.
 */
export function eintreffzeitStapelHinweis(neu: number): string {
  return neu < 2 ? "" : `Eintreffzeit dieser ${neu} Bögen ist die Zeit des Einlesens (Lageblatt: *); anders gewesen: Karte › „ändern“.`;
}

/** „Stand" oder „Meldung": das Wort vor „vor 14 Std 0 Min". */
export function angabenAlterWort(e: MitStand): "Stand" | "Meldung" {
  return standLiegtWeitVorEingang(e) ? "Stand" : "Meldung";
}
