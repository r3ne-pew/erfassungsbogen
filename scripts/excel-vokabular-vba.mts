/**
 * Erzeugt das Vokabular-Modul des VBA-Dekoders (Excel) aus bos-vokabulare:
 * vendor/eeb-format/ports/vba/m_digitalerEEBVokabular.bas.
 *
 * Der VBA-Leser des EEB-Formats (vendor/eeb-format/ports/vba/) braucht die
 * Klartexte zu den Zahlencodes im QR. Die Codes sind append-only; das Modul
 * ist eine reine Tabelle und wird deshalb generiert statt gepflegt. Es liegt
 * im Format-Repo, weil es zur Portierung gehört — erzeugt wird es aber hier,
 * weil nur dieses Repo Format und Vokabular zusammen als Submodule hat
 * (bos-vokabulare hängt von eeb-format ab, nicht umgekehrt).
 *
 *   npm run vokabular:excel-vba              schreibt das Modul neu
 *   npm run vokabular:excel-vba -- --pruefen  CI: Modul entspricht dem Vokabular
 *
 * Nach dem Erzeugen: im Submodul committen und den Submodul-Stand hier heben
 * (CLAUDE.md, Abschnitt „Portierungen"). Ausgabe in Windows-1252 — der
 * VBA-Import erwartet ANSI, UTF-8 ergäbe „FÃ¼hrer" im Blatt.
 */

import { execFileSync } from "node:child_process";
import { existsSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

import {
  FUNKRUF_KENNWOERTER,
  THW_EINHEITSTYPEN,
  THW_FAHRZEUGTYPEN,
  THW_FUNKTIONEN_ALLE,
  THW_HIERARCHIE_EBENEN,
  type VokabularEintrag,
} from "../vendor/bos-vokabulare/src/thw.ts";
import { HIERARCHIE_EBENEN } from "../vendor/bos-vokabulare/src/ebenen.ts";


const wurzel = join(dirname(fileURLToPath(import.meta.url)), "..");
const zieldatei = join(wurzel, "vendor/eeb-format/ports/vba/m_digitalerEEBVokabular.bas");

/** Höchstens so viele Einträge je Sub — VBA begrenzt die Prozedurgröße (64 KB). */
const JE_SUB = 60;

type Tabelle = { titel: string; praefix: string; eintraege: Array<{ schluessel: string; text: string }> };

function mitKurz(e: VokabularEintrag): string {
  return e.kurz ?? e.name;
}

const tabellen: Tabelle[] = [
  {
    titel: "Einheitstypen (THW)",
    praefix: "Einheitstypen",
    eintraege: THW_EINHEITSTYPEN.map((e) => ({ schluessel: `E${e.code}`, text: e.name })),
  },
  {
    titel: "Funktionen und Zusatzqualifikationen (THW)",
    praefix: "Funktionen",
    eintraege: THW_FUNKTIONEN_ALLE.map((e) => ({ schluessel: `F${e.code}`, text: mitKurz(e) })),
  },
  {
    titel: "Fahrzeugtypen (THW)",
    praefix: "Fahrzeuge",
    eintraege: THW_FAHRZEUGTYPEN.map((e) => ({ schluessel: `V${e.code}`, text: e.name })),
  },
  {
    titel: "Funkruf-Kennwörter (alle Organisationen)",
    praefix: "Kennwoerter",
    eintraege: FUNKRUF_KENNWOERTER.map((e) => ({ schluessel: `K${e.code}`, text: mitKurz(e) })),
  },
  {
    titel: "Hierarchie-Ebenen je Organisation",
    praefix: "Ebenen",
    eintraege: Object.entries(HIERARCHIE_EBENEN)
      .map(([org, ebenen]) => [Number(org), ebenen ?? []] as const)
      .sort((a, b) => a[0] - b[0])
      .flatMap(([org, ebenen]) =>
        (org === 1 ? THW_HIERARCHIE_EBENEN : ebenen).map((e) => ({ schluessel: `H${org}_${e.code}`, text: mitKurz(e) })),
      ),
  },
];

function vbaString(s: string): string {
  return `"${s.replace(/"/g, '""')}"`;
}

function vokabularStand(): string {
  try {
    return execFileSync("git", ["-C", join(wurzel, "vendor/bos-vokabulare"), "rev-parse", "--short", "HEAD"], {
      encoding: "utf8",
    }).trim();
  } catch {
    return "unbekannt";
  }
}

function erzeugen(): string {
  const gesamt = tabellen.reduce((n, t) => n + t.eintraege.length, 0);
  const z: string[] = [];
  z.push('Attribute VB_Name = "m_digitalerEEBVokabular"');
  z.push("' ===========================================================================");
  z.push("'  Vokabular-Tabellen für den EEB-Dekoder (m_digitalerEEBParsing).");
  z.push("'");
  z.push("'  GENERIERT - nicht von Hand aendern. Quelle: erfassungsbogen.app,");
  z.push("'  npm run vokabular:excel-vba (scripts/excel-vokabular-vba.mts).");
  z.push(`'  ${gesamt} Einträge, Stand des Vokabulars: bos-vokabulare ${vokabularStand()}.`);
  z.push("'");
  z.push("'  Die Codes im QR-Code sind append-only: eine ältere Tabelle liest neuere");
  z.push("'  Bögen weiter, unbekannte Codes erscheinen als \"#123\". Zum Nachziehen das");
  z.push("'  Modul neu erzeugen und in der Mappe ersetzen.");
  z.push("' ===========================================================================");
  z.push("Option Explicit");
  z.push("");
  z.push("Private mVokab As Collection");
  z.push("");
  z.push("' Klartext zu einem Vokabular-Code. Unbekannter Code -> \"#<code>\", damit im");
  z.push("' Blatt sichtbar bleibt, dass da ein Wert stand.");
  z.push("Public Function EebVokabText(ByVal schluessel As String, ByVal code As Long) As String");
  z.push("    Dim s As String");
  z.push("    If mVokab Is Nothing Then VokabularAufbauen");
  z.push("    On Error Resume Next");
  z.push("    s = mVokab.item(schluessel)");
  z.push("    On Error GoTo 0");
  z.push('    If Len(s) = 0 Then s = "#" & code');
  z.push("    EebVokabText = s");
  z.push("End Function");
  z.push("");
  z.push("Private Sub VokabularAufbauen()");
  z.push("    Set mVokab = New Collection");
  for (const t of tabellen) {
    z.push(`    ' ${t.titel} (${t.eintraege.length})`);
    const subs = Math.max(1, Math.ceil(t.eintraege.length / JE_SUB));
    for (let i = 1; i <= subs; i++) z.push(`    ${t.praefix}Fuellen${i}`);
  }
  z.push("End Sub");
  z.push("");
  z.push("' Ein Eintrag. Doppelte Schlüssel können nicht vorkommen (die Tabellen sind");
  z.push("' generiert), ein Add-Fehler soll aber nicht die ganze Mappe anhalten.");
  z.push("Private Sub v(ByVal schluessel As String, ByVal text As String)");
  z.push("    On Error Resume Next");
  z.push("    mVokab.Add text, schluessel");
  z.push("    On Error GoTo 0");
  z.push("End Sub");
  for (const t of tabellen) {
    z.push("");
    z.push(`' --- ${t.titel}`);
    const subs = Math.max(1, Math.ceil(t.eintraege.length / JE_SUB));
    for (let i = 0; i < subs; i++) {
      z.push("");
      z.push(`Private Sub ${t.praefix}Fuellen${i + 1}()`);
      for (const e of t.eintraege.slice(i * JE_SUB, (i + 1) * JE_SUB)) {
        z.push(`    v ${vbaString(e.schluessel)}, ${vbaString(e.text)}`);
      }
      z.push("End Sub");
    }
  }
  z.push("");
  z.push("");
  return z.join("\n");
}

/** Windows-1252: Bytes 0x80–0x9F liegen anders als in Latin-1 (z. B. „ und "). */
function cp1252(text: string): Buffer {
  const sonder: Record<number, number> = {
    0x20ac: 0x80, 0x201a: 0x82, 0x0192: 0x83, 0x201e: 0x84, 0x2026: 0x85, 0x2020: 0x86, 0x2021: 0x87,
    0x02c6: 0x88, 0x2030: 0x89, 0x0160: 0x8a, 0x2039: 0x8b, 0x0152: 0x8c, 0x017d: 0x8e, 0x2018: 0x91,
    0x2019: 0x92, 0x201c: 0x93, 0x201d: 0x94, 0x2022: 0x95, 0x2013: 0x96, 0x2014: 0x97, 0x02dc: 0x98,
    0x2122: 0x99, 0x0161: 0x9a, 0x203a: 0x9b, 0x0153: 0x9c, 0x017e: 0x9e, 0x0178: 0x9f,
  };
  const bytes: number[] = [];
  for (const zeichen of text) {
    const cp = zeichen.codePointAt(0)!;
    if (cp < 0x80 || (cp >= 0xa0 && cp <= 0xff)) bytes.push(cp);
    else if (sonder[cp] != null) bytes.push(sonder[cp]!);
    else throw new Error(`Zeichen U+${cp.toString(16)} („${zeichen}") ist in Windows-1252 nicht darstellbar — VBA könnte es nicht importieren.`);
  }
  return Buffer.from(bytes);
}

const inhalt = cp1252(erzeugen());
if (process.argv.includes("--pruefen")) {
  if (!existsSync(zieldatei)) {
    console.error(`fehlt: ${zieldatei} (Submodul vendor/eeb-format ausgecheckt?)`);
    process.exit(1);
  }
  // Die Stand-Zeile (Commit von bos-vokabulare) bleibt außen vor: sie ändert
  // sich auch ohne neue Codes; geprüft wird der Tabelleninhalt.
  const ohneStand = (b: Buffer): string => b.toString("latin1").replace(/^'  \d+ Einträge, Stand des Vokabulars:.*$/m, "");
  if (ohneStand(readFileSync(zieldatei)) !== ohneStand(inhalt)) {
    console.error(
      `${zieldatei} entspricht nicht mehr bos-vokabulare — \`npm run vokabular:excel-vba\` laufen lassen, im Submodul committen, Stand heben.`,
    );
    process.exit(1);
  }
  console.log("VBA-Vokabular passt zu bos-vokabulare.");
} else {
  writeFileSync(zieldatei, inhalt);
  console.log(`geschrieben: ${zieldatei} (${inhalt.length} Bytes)`);
}
