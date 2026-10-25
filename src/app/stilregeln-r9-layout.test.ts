/**
 * Stilregeln aus Runde 9 des Audits (Block Layout, Anzeige, Druck), die nur im Stylesheet (index.html) leben.
 * Wie stilregeln-r8-layout prüft der Test den Quelltext (jsdom rechnet kein Layout); die Messwerte stehen im
 * „Stand der Behebung" der Berichte.
 */
import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";
import { dateinameSicher, dateinameTeil } from "./hilfen";

const html = readFileSync(new URL("../../index.html", import.meta.url), "utf8");
const css = html.replace(/\/\*[\s\S]*?\*\//g, "");
const app = readFileSync(new URL("./app.tsx", import.meta.url), "utf8");

/** Nur der Abschnitt „Runde 9 (Layout)": andere Blöcke dürfen daneben eigene Regeln tragen. */
const abschnitt = (() => {
  const von = html.indexOf("/* ===== Runde 9 (Layout) ===== */");
  expect(von).toBeGreaterThan(0);
  const bis = html.indexOf("</style>", von);
  return html.slice(von, bis).replace(/\/\*[\s\S]*?\*\//g, "");
})();

describe("Sammlungsseiten bei Zoom (R9-G1, R9-N1, R9-M3)", () => {
  it("unter 16rem ist die Ansichtswahl ein Balken am unteren Rand, kein Streifen über die Seitenhöhe", () => {
    expect(abschnitt).toMatch(/@media \(max-width: 16rem\)\s*\{\s*\.anzeige-balken\s*\{\s*left:\s*0/);
    expect(abschnitt).toMatch(/html:has\(\.anzeige-balken\) main, html:has\(\.anzeige-balken\) footer\.seite\s*\{\s*padding-right:\s*max\(8px, env\(safe-area-inset-right\)\)/);
  });
  it("Kennzahlen: Beschriftung bei großer Schrift gedeckelt, bei 180 px zwei Kacheln je Zeile, kein Wortbruch", () => {
    expect(abschnitt).toMatch(/html\.schrift-gross \.staerke-leiste span\s*\{\s*font-size:\s*min\(var\(--t-xs\), 12px\)/);
    expect(abschnitt).toMatch(/html:not\(\.schrift-gross\) \.staerke-leiste:has\(> div:nth-child\(5\)\)\s*\{\s*grid-template-columns:\s*repeat\(2, minmax\(0, 1fr\)\)/);
    expect(abschnitt).toMatch(/\.staerke-leiste span, html\.schrift-gross \.staerke-leiste span\s*\{\s*overflow-wrap:\s*normal/);
  });
  it("Tabelle: bei engem Rahmen klebt die Namensspalte, aber höchstens zu 45 %", () => {
    expect(abschnitt).toMatch(/@container \(max-width: 200px\)\s*\{\s*table\.einheiten-tabelle > \* > tr > :first-child\s*\{\s*position:\s*sticky;[^}]*max-width:\s*45cqw/);
  });
});

describe("Kopf, Speicherzeile und feste Leisten des Assistenten (R9-G4, R9-G5, R9-M5, R9-M8)", () => {
  it("die Speicherzeile bleibt als „✓ Uhrzeit“ sichtbar (data-kurz), der volle Satz bleibt im Text", () => {
    expect(app).toMatch(/data-kurz=\{`✓ \$\{uhrzeitMitTag\(gespeichertUm\)\}`\}/);
    expect(app).toMatch(/✓ gespeichert · \{uhrzeitMitTag\(gespeichertUm\)\} Uhr · nur auf diesem Gerät/);
    expect(abschnitt).toMatch(/@container kopf \(max-width: 17\.5rem\)\s*\{\s*\.seiten-kopf\.assistent-kopf \.autosave\[data-kurz\]:not\(\.speicher-fehler\):not\(\.fest-warnung\)\s*\{\s*display:\s*block/);
    expect(abschnitt).toMatch(/@media \(orientation: landscape\) and \(max-height: 31\.25rem\)\s*\{\s*\.seiten-kopf\.assistent-kopf \.autosave\[data-kurz\]:not\(\.speicher-fehler\):not\(\.fest-warnung\)\s*\{\s*display:\s*block/);
    expect(abschnitt).toMatch(/::after\s*\{\s*content:\s*attr\(data-kurz\)/);
  });
  it("quer: 8 px Abstand zwischen Rücksprung und Reitern, die Ansichtswahl steht nur in der Fußleiste", () => {
    expect(abschnitt).toMatch(/\.seiten-kopf\.assistent-kopf \.kopf-inhalt\s*\{\s*row-gap:\s*8px/);
    expect(abschnitt).toMatch(/\.seiten-kopf\.assistent-kopf \.kopf-oberzeile > \.anzeige-schalter\s*\{\s*display:\s*none/);
  });
  it("180 px: Reiter in einer rollenden Reihe, aktiver Reiter wird zentriert, Fußleiste mit weniger Polster", () => {
    expect(abschnitt).toMatch(/:root \.seiten-kopf\.assistent-kopf \.schritte\s*\{\s*display:\s*flex;\s*flex-wrap:\s*nowrap;\s*overflow-x:\s*auto/);
    expect(abschnitt).toMatch(/footer\.nav\.assistent-nav\s*\{\s*padding-top:\s*5px/);
    expect(app).toMatch(/ref=\{i === schritt \? reiterZeigen : undefined\}/);
    expect(app).toMatch(/function reiterZeigen\(/);
  });
  it("Zwei-Fenster-Leiste: höchstens 35 % der Höhe; bei knappem Bild nur Knöpfe unter dem Kurztext", () => {
    expect(abschnitt).toMatch(/\.fest-warnung\.fenster-konflikt\s*\{\s*max-height:\s*35vh;\s*max-height:\s*35dvh/);
    expect(abschnitt).toMatch(/\.fest-warnung\.fenster-konflikt\.knapp \.fest-details\s*\{\s*display:\s*none/);
    expect(abschnitt).toMatch(/\.fest-schalter\[aria-expanded="true"\]\s*\{\s*font-size:\s*0/);
  });
});

describe("Startseite, Musterung, Plattform, Schritt 2 (R9-H6, R9-L4, R9-L5, R9-G3)", () => {
  it("Entwurfskarte bei 180 px: Name auf zwei Zeilen begrenzt, knappere Abstände", () => {
    expect(abschnitt).toMatch(/\.entwurf-karte \.entwurf-text > strong\s*\{[^}]*-webkit-line-clamp:\s*2/);
    expect(abschnitt).toMatch(/main\.start\s*\{\s*padding-top:\s*8px/);
  });
  it("Musterung: „Bogen anlegen · n Pers · n Fz“ bricht um, statt abgeschnitten zu werden", () => {
    expect(abschnitt).toMatch(/footer\.nav \.muster-start\s*\{\s*white-space:\s*normal;\s*overflow:\s*visible/);
  });
  it("Android-Nacht: Rücksprung und Textknöpfe in der hellen Akzentfarbe", () => {
    expect(abschnitt).toMatch(/\.nacht-modus\.platform-android \.zur-start,[^{]*\{\s*color:\s*var\(--akzent-hell\)/);
  });
  it("Schritt 2: „Datenschutzfrist“ hat Abstand zum Kästchen „Dies ist eine Übung“", () => {
    expect(abschnitt).toMatch(/details\.frist-erklaerung\s*\{\s*margin-top:\s*14px/);
  });
});

describe("Kurz-Liste der Personen (R9-M4)", () => {
  it("drei Zeilen je Person: Stelle mit Pfeilen und ✕, Namen, Rolle und Geschlecht; Feldnamen im Feld", () => {
    expect(abschnitt).toMatch(/@container \(min-width: 17rem\) and \(max-width: 44rem\)/);
    expect(abschnitt).toMatch(/td\.sortier-spalte \+ td\s*\{\s*grid-column:\s*6;\s*grid-row:\s*1/);
    expect(abschnitt).toMatch(/td:nth-child\(n \+ 2\):nth-child\(-n \+ 5\)::before\s*\{\s*position:\s*absolute/);
    expect(abschnitt).toMatch(/td input::placeholder\s*\{\s*color:\s*transparent/);
  });
});

describe("Browser-Druck (R9-A4)", () => {
  const druck = css.slice(css.indexOf("@media print"));
  it("blendet Navigation, Knöpfe und feste Leisten aus und setzt schwarz auf weiß", () => {
    expect(druck).toMatch(/footer\.nav/);
    expect(druck).toMatch(/\.anzeige-balken/);
    expect(druck).toMatch(/\.fest-warnung/);
    expect(druck).toMatch(/\.sprungmarke/);
    expect(druck).toMatch(/main button:not\(\.spalten-sortierung\)/);
    expect(druck).toMatch(/background:\s*#fff !important;\s*color:\s*#000 !important/);
  });
  it("lässt Zeilen und Einheiten nicht über eine Seitengrenze reißen und löst klebende Elemente", () => {
    expect(druck).toMatch(/\.einheit-zeile[^}]*break-inside:\s*avoid/);
    expect(druck).toMatch(/\.tabellen-scroll\s*\{\s*overflow:\s*visible !important/);
    expect(druck).toMatch(/position:\s*static !important/);
  });
});

describe("Dateinamen für Downloads (R9-A5)", () => {
  it("Umlaute werden umschrieben, Leerzeichen und Sonderzeichen zu „_“", () => {
    expect(dateinameTeil("THW Oldenburg (NI) Verstärkter Bergungszug")).toBe("THW_Oldenburg_NI_Verstaerkter_Bergungszug");
    expect(dateinameTeil("Übung Große Straße")).toBe("Uebung_Grosse_Strasse");
    expect(dateinameTeil("Café Müller")).toBe("Cafe_Mueller");
  });
  it("ein ganzer Dateiname behält Endung und Bindestriche", () => {
    expect(dateinameSicher("eeb-240707okt26_THW_Verstärkter_Zug.pdf")).toBe("eeb-240707okt26_THW_Verstaerkter_Zug.pdf");
    expect(dateinameSicher("eeb einsatz Größe.csv")).toBe("eeb_einsatz_Groesse.csv");
    expect(dateinameSicher("")).toBe("datei");
  });
});
