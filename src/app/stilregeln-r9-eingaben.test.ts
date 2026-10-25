/**
 * Stilregeln aus Runde 9 des Audits (Block „Eingaben“), die nur im Stylesheet (index.html) leben. Wie
 * stilregeln-r8-dialoge prüft der Test den Quelltext (jsdom rechnet kein Layout); die Messwerte stehen
 * im „Stand der Behebung“ der Berichte.
 */

import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";

const html = readFileSync(new URL("../../index.html", import.meta.url), "utf8");
const css = html.replace(/\/\*[\s\S]*?\*\//g, "");

describe("Zahlenfelder und Sätze darunter (R9-E1)", () => {
  it("der Satz zu Rundung oder Minus ist ein Block unter dem Feld und bricht lange Eingaben um", () => {
    expect(css).toMatch(/\.zahl-meldung\s*\{[^}]*display:\s*block[^}]*overflow-wrap:\s*anywhere/);
  });
  it("ein abgelehntes Feld trägt Rahmen in der Alarmfarbe", () => {
    expect(css).toMatch(/input\[aria-invalid="true"\]\s*\{[^}]*border-color:\s*var\(--alarm\)/);
  });
});

describe("Wahl-Rückfragen: Wege im festen Fuß (R9-W1, R9-M2, R9-M7)", () => {
  it("die Erklärungen der Wege rollen als Liste im Rumpf", () => {
    expect(css).toMatch(/dialog\.abfrage \.abfrage-wegehinweise\s*\{/);
  });
  it("vor „Abbrechen“ liegen 24 px (--r-5), im Zoom-Fenster und bei sehr niedrigem Bild 12 px", () => {
    expect(css).toMatch(/dialog\.abfrage \.abfrage-fuss \.abfrage-aktionen:not\(\.abgesetzt\)\s*\{\s*margin-top:\s*min\(var\(--r-5\), 24px\)/);
    expect(css).toMatch(
      /@media \(max-width: 279\.98px\), \(max-height: 240px\)\s*\{\s*dialog\.abfrage \.abfrage-fuss \.abfrage-aktionen:not\(\.abgesetzt\)\s*\{\s*margin-top:\s*var\(--r-3\)/,
    );
  });
  it("quer stehen bis zu vier Knöpfe nebeneinander, mit 24 px Abstand, bei Platzmangel in zwei Reihen", () => {
    expect(css).toMatch(
      /@media \(max-height: 480px\) and \(min-width: 280px\)\s*\{\s*dialog\.abfrage \.abfrage-fuss\s*\{\s*flex-wrap:\s*wrap;\s*gap:\s*var\(--r-3\) min\(var\(--r-5\), 24px\)/,
    );
  });
  it("auf schmalen Telefonen weniger Seitenrand, damit Beschriftungen einzeilig bleiben", () => {
    expect(css).toMatch(/@media \(max-width: 420px\)\s*\{\s*dialog\.abfrage\s*\{\s*padding-inline:\s*12px/);
  });
});

describe("Einfache Dialoge bei Zoom 200 % (R9-H1, R9-G2)", () => {
  it("unter 280 px Breite: schmaler Rand, Titel in ganzen Wörtern mit Silbentrennung, „Schließen“ in eigener Zeile", () => {
    expect(css).toMatch(/@media \(max-width: 279\.98px\)\s*\{\s*html dialog\s*\{\s*width:\s*calc\(100vw - 8px\)/);
    expect(css).toMatch(/html dialog > \.kopfzeile:first-child h2\s*\{[^}]*overflow-wrap:\s*normal;\s*word-break:\s*normal;\s*hyphens:\s*auto/);
    expect(css).toMatch(/html dialog > \.kopfzeile:first-child > button:last-child\s*\{\s*flex:\s*1 1 100%/);
  });
  it("die Kopfzeile klebt nicht mehr, wenn das Fenster schmal oder niedrig ist", () => {
    expect(css).toMatch(
      /@media \(max-width: 279\.98px\), \(max-height: 340px\)\s*\{\s*html dialog > \.kopfzeile:first-child\s*\{\s*position:\s*static/,
    );
  });
  it("niedriges Fenster: Titel und „Schließen“ in einer Zeile", () => {
    expect(css).toMatch(/@media \(max-height: 340px\) and \(min-width: 280px\)\s*\{[^}]*flex-wrap:\s*nowrap/);
  });
});

describe("Schritt 2 (R9-G3)", () => {
  it("das Aufklappfeld „Datenschutzfrist“ hat Abstand zum Kästchen „Übung“", () => {
    expect(css).toMatch(/details\.frist-erklaerung\s*\{\s*margin-top:\s*var\(--r-4\)/);
  });
});
