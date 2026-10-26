/** Runde 12, Block Zustand: reine Logik der Behebungen (E1 bis E5, D1 bis D3, O1, O4, S1, S2, G2). */
import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";
import { KontaktArt } from "@bos/eeb-format/model";
import { datumAusIso } from "@bos/eeb-format/model";
import {
  telefonBereinigen,
  telefonKurzHinweis,
  telefonTippen,
  type TelefonRest,
} from "./telefon-eingabe";
import { emailProblem, emailSatz } from "./email-pruefung";
import { absenderHinweis } from "./absenderkarte";
import { neuePerson, neuerBogen, plausibilitaet } from "./hilfen";
import { zeitraumNachEingabe } from "./zeitraum-eingabe";
import { VERGANGENHEIT_TOLERANZ_MS, zeitUnstimmigkeit } from "./eintrag-zeiten";
import { AUSGABE_SPERRE_MS, LEERER_EINSATZ_TEXT, LEERE_DATEI_TEXT, ausgabeFrei, ausgabeSperreZuruecksetzen, einsatzLeer } from "./ausgabe-sperre";
import { schluesselFrage } from "./schluessel-frage";
import { verloreneEingabeText } from "./eingabe-verloren";
import { loeschenErfassungSatz, selbstGeloeschtMeldung } from "./einsatz-geloescht";
import { vorlageZahlenText } from "./vorlagen";

/** Tippt Zeichen für Zeichen wie eine Bildschirmtastatur: Das Feld zeigt immer nur den gespeicherten Wert. */
function tippen(text: string) {
  let wert = "";
  let rest: TelefonRest;
  let hinweis = "";
  const hinweise: string[] = [];
  for (const z of text) {
    const r = telefonTippen(wert, wert + z, rest);
    wert = r.wert;
    rest = r.rest;
    hinweis = r.hinweis;
    if (hinweis) hinweise.push(hinweis);
  }
  return { wert, hinweis, hinweise };
}

describe("R12-E1 Telefonfelder beim Tippen", () => {
  it("behält beim Tippen nur die erste Nummer und nennt die zweite", () => {
    const r = tippen("0171 1234567 / 0441 99");
    expect(r.wert).toBe("01711234567");
    expect(r.hinweis).toContain("Zweite Nummer „0441 99\"");
  });
  it("erkennt „oder“, Komma und eine Klammer als Beginn von etwas Neuem", () => {
    expect(tippen("0171 1234567 oder 0441 998877").wert).toBe("01711234567");
    expect(tippen("0171-1234567 (Handy), 0441-99887").wert).toBe("01711234567");
    expect(tippen("0171 1234567, 0441 998877").hinweis).toContain("Zweite Nummer");
  });
  it("lässt einen Schrägstrich hinter der Vorwahl stehen", () => {
    expect(tippen("0441/998877")).toMatchObject({ wert: "0441998877", hinweis: "" });
  });
  it("löscht man hinter dem Trenner, geht die Eingabe wieder normal", () => {
    let r = telefonTippen("01711234567", "01711234567/", undefined);
    expect(r.rest).toBe("");
    r = telefonTippen("01711234567", "0171123456", r.rest); // Löschtaste: kürzer als vorher
    expect(r.rest).toBeUndefined();
    expect(r.wert).toBe("0171123456");
  });
  it("entfernt die „0“ nach +49 beim Tippen wie beim Einfügen", () => {
    expect(tippen("+49 (0) 171 1234567").wert).toBe("+491711234567");
    expect(telefonBereinigen("+49 (0) 171 1234567").wert).toBe("+491711234567");
    expect(telefonBereinigen("+49 (0) 171 1234567").hinweis).toContain("Landesvorwahl");
    expect(telefonBereinigen("0049 (0)171 1234567").wert).toBe("00491711234567");
    // Eine Null nach der deutschen Vorwahl ohne „+49“ bleibt: das ist die Ortsvorwahl.
    expect(telefonBereinigen("0171 1234567").wert).toBe("01711234567");
  });
  it("fragt bei mehr als 15 Ziffern nach", () => {
    expect(telefonKurzHinweis("01711234567890123456")).toContain("20 Ziffern");
    expect(telefonKurzHinweis("017112345678901")).toBe("");
  });
  it("lässt das Einfügen unverändert (R11-E3)", () => {
    const r = telefonTippen("", "0171 1234567 / 0441 99", undefined);
    expect(r.wert).toBe("01711234567");
    expect(r.hinweis).toContain("Zweite Nummer");
  });
});

describe("R12-E2 E-Mail-Prüfung an allen Stellen", () => {
  it("erkennt unvollständige und doppelte Adressen", () => {
    expect(emailProblem("max@thw")).toBe("unvollstaendig");
    expect(emailProblem("max@@thw.de")).toBe("unvollstaendig");
    expect(emailProblem("max @thw.de")).toBe("unvollstaendig");
    expect(emailProblem("a@b.de, c@d.de")).toBe("mehrere");
    expect(emailProblem("abc")).toBe("ohne-at");
    expect(emailProblem("max.mustermann@thw.de")).toBeUndefined();
    expect(emailProblem("")).toBeUndefined();
    expect(emailSatz("abc")).toBe("E-Mail „abc\" ohne „@\"");
  });
  it("Schritt 1 und Schritt 3 melden denselben Fall wie die Absenderkarte", () => {
    const b = neuerBogen();
    b.einheit.hierarchie[0] = { ...b.einheit.hierarchie[0]!, email: "max@thw" };
    const p = neuePerson();
    p.kontakte = [{ art: KontaktArt.EMAIL, dienstlich: true, wert: "max@thw" }];
    b.personal = [p];
    const texte = plausibilitaet(b);
    expect(texte.filter((t) => /„max@thw" sieht unvollständig aus/.test(t))).toHaveLength(2);
    expect(absenderHinweis({ name: "Max", email: "max@thw" })).toMatch(/E-Mail/);
    expect(absenderHinweis({ name: "Max", email: "a@b.de, c@d.de" })).toMatch(/E-Mail/);
  });
});

describe("R12-E3 Zeitraum leeren", () => {
  const heute = datumAusIso("2026-10-26");
  const von = datumAusIso("2026-10-20");
  const bis = datumAusIso("2026-10-24");
  it("leeres „bis“ fällt auf „von“ zurück, nicht auf 1900", () => {
    const r = zeitraumNachEingabe({ zeitraumVon: von, zeitraumBis: bis }, "bis", "", heute);
    expect(r).toEqual({ zeitraumVon: von, zeitraumBis: von });
  });
  it("leeres „von“ wird heute; „bis“ folgt, solange es „von“ folgte", () => {
    expect(zeitraumNachEingabe({ zeitraumVon: von, zeitraumBis: von }, "von", "", heute)).toEqual({
      zeitraumVon: heute,
      zeitraumBis: heute,
    });
    expect(zeitraumNachEingabe({ zeitraumVon: von, zeitraumBis: bis }, "von", "", heute)).toEqual({
      zeitraumVon: heute,
      zeitraumBis: bis,
    });
  });
  it("übernimmt gültige Eingaben wie bisher", () => {
    expect(zeitraumNachEingabe({ zeitraumVon: von, zeitraumBis: von }, "von", "2026-10-22", heute)).toEqual({
      zeitraumVon: datumAusIso("2026-10-22"),
      zeitraumBis: datumAusIso("2026-10-22"),
    });
    expect(zeitraumNachEingabe({ zeitraumVon: von, zeitraumBis: bis }, "bis", "2026-10-25", heute).zeitraumBis).toBe(
      datumAusIso("2026-10-25"),
    );
  });
});

describe("R12-E4 Eintreffzeit in der Vergangenheit", () => {
  const jetzt = new Date("2026-10-26T12:00").getTime();
  const bezug = { aufnahme: jetzt, zeitraumVon: new Date("2026-10-26T00:00").getTime() };
  it("fragt bei Jahresdreher und Tag-Monat-Dreher nach", () => {
    for (const z of ["2025-10-26T03:09", "2024-10-26T03:09", "2026-10-20T03:09", "2026-10-24T03:09"]) {
      expect(zeitUnstimmigkeit({ eintreffen: new Date(z).getTime() }, jetzt, bezug), z).toMatch(/mehr als einen Tag vor der Aufnahme/);
    }
  });
  it("lässt gestern Abend durch und Zeiten innerhalb des Einsatzzeitraums", () => {
    expect(zeitUnstimmigkeit({ eintreffen: new Date("2026-10-25T20:30").getTime() }, jetzt, bezug)).toBeNull();
    const langerEinsatz = { aufnahme: jetzt, zeitraumVon: new Date("2026-10-20T00:00").getTime() };
    expect(zeitUnstimmigkeit({ eintreffen: new Date("2026-10-22T08:00").getTime() }, jetzt, langerEinsatz)).toBeNull();
  });
  it("ohne Bezug bleibt die Prüfung wie bisher", () => {
    expect(zeitUnstimmigkeit({ eintreffen: new Date("2025-10-26T03:09").getTime() }, jetzt)).toBeNull();
    expect(VERGANGENHEIT_TOLERANZ_MS).toBe(24 * 3_600_000);
  });
});

describe("R12-E5 leerer Einsatz", () => {
  it("erkennt den leeren Einsatz und nennt ihn in den Sätzen", () => {
    expect(einsatzLeer({ eintraege: [] })).toBe(true);
    expect(einsatzLeer({ eintraege: [{}] })).toBe(false);
    expect(LEERER_EINSATZ_TEXT).toContain("Noch keine Einheit");
    expect(LEERER_EINSATZ_TEXT).not.toContain("Sammel-PDF");
    expect(LEERE_DATEI_TEXT).toContain("keine Zeilen");
  });
});

describe("R12-D1 Vorlage ersetzen", () => {
  it("stellt die Zahlen beider Seiten gegenüber", () => {
    const alt = neuerBogen();
    alt.personal = [neuePerson(), neuePerson(), neuePerson(), neuePerson()];
    const neu = neuerBogen();
    neu.personal = [];
    expect(vorlageZahlenText(alt)).toMatch(/^4 Personen, \d+ Fahrzeuge?$/);
    expect(vorlageZahlenText(neu)).toMatch(/^0 Personen, /);
    alt.personal = [neuePerson()];
    expect(vorlageZahlenText(alt)).toMatch(/^1 Person, /);
  });
});

describe("R12-D3 Geräteschlüssel-Rückfrage", () => {
  it("ohne Schlüssel: nur der erste Satz, neutraler Knopf, keine Gefahr", () => {
    const f = schluesselFrage(false);
    expect(f.erster).toContain("gelöscht wird nichts");
    expect(f.folgen).toBeNull();
    expect(f.gefahr).toBe(false);
    expect(f.neuLabel).toBe("Schlüssel jetzt erzeugen");
  });
  it("mit Schlüssel: beide Absätze und roter Knopf", () => {
    const f = schluesselFrage(true);
    expect(f.erster).toContain("wird gelöscht");
    expect(f.folgen?.rest).toContain("alten öffentlichen Schlüssel");
    expect(f.gefahr).toBe(true);
  });
});

describe("R12-O1 verlorene Eingabe", () => {
  it("nennt Einheit und Text", () => {
    expect(verloreneEingabeText("THW Hatten", { notiz: "Pumpen Nord", zug: null })).toBe(
      "Die Einheit „THW Hatten\" wurde in einem anderen Fenster entfernt — Ihre Eingabe Auftrag/Notiz „Pumpen Nord\" wurde nicht gespeichert.",
    );
    expect(verloreneEingabeText("X", { notiz: "  ", zug: "" })).toBe("");
    expect(verloreneEingabeText("X", { notiz: "a", zug: "Zug 2" })).toContain("Auftrag/Notiz „a\" und Zug „Zug 2\"");
  });
});

describe("R12-S1 Einsatz löschen mit angefangener Erfassung", () => {
  it("Rückfrage und Meldung nennen die Erfassung, ohne anderes Fenster", () => {
    expect(loeschenErfassungSatz(undefined)).toBe("");
    expect(loeschenErfassungSatz("THW Wilhelmshaven")).toContain("angefangene Erfassung einer fremden Einheit „THW Wilhelmshaven\"");
    const m = selbstGeloeschtMeldung("Hochwasser Test", "THW Wilhelmshaven");
    expect(m).toContain("„Hochwasser Test\" in den Papierkorb gelegt");
    expect(m).not.toContain("anderen Fenster");
    expect(m).not.toContain("eigener Bogen");
  });
});

describe("R12-S2 offene Punkte nennen den Einheitstyp", () => {
  it("Ort ohne Typ: Punkt „Einheitstyp fehlt“; mit Typ verschwindet er", () => {
    const b = neuerBogen();
    b.einheit.hierarchie[0] = { ...b.einheit.hierarchie[0]!, name: "Albstadt" };
    expect(plausibilitaet(b).some((h) => /^Einheitstyp fehlt/.test(h))).toBe(true);
    b.einheit.einheitsTyp = { code: 1 };
    expect(plausibilitaet(b).some((h) => /^Einheitstyp fehlt/.test(h))).toBe(false);
  });
});

/** Nur der Abschnitt „Runde 12 (Zustand)" von index.html, ohne Kommentare (jsdom rechnet kein Layout). */
const html = readFileSync(new URL("../../index.html", import.meta.url), "utf8");
const css = (() => {
  const von = html.indexOf("/* ===== Runde 12 (Zustand) ===== */");
  const bis = html.indexOf("/* ===== Ende Runde 12 (Zustand) ===== */", von);
  expect(von).toBeGreaterThan(0);
  expect(bis).toBeGreaterThan(von);
  return html.slice(von, bis).replace(/\/\*[\s\S]*?\*\//g, "");
})();

describe("Stilregeln Runde 12 (Zustand)", () => {
  it("R12-D2: Historie-Aktionen 44 px hoch mit Abstand, „Fassung verwerfen…“ abgesetzt in Alarmfarbe", () => {
    expect(css).toMatch(/\.historie li button\.link\.historie-aktion\s*\{[^}]*min-height:\s*44px[^}]*margin:\s*4px 8px 4px 0/);
    expect(css).toMatch(/\.historie-verwerfen\s*\{[^}]*color:\s*var\(--alarm\)/);
  });
  it("R12-O2: Erledigt, Rückgängig und Schließen am Widerspruch sind 44-px-Ziele", () => {
    expect(css).toMatch(/button\.link\.widerspruch-aktion\s*\{[^}]*min-height:\s*44px/);
  });
  it("R12-G1: das Rückgängig der Chip-Felder ist ein 44-px-Ziel in eigener Zeile", () => {
    expect(css).toMatch(/\.chips \.chip-rueckgaengig button\s*\{[^}]*min-height:\s*44px/);
  });
});

describe("R12-G2 Tipp-Sperre der Ausgaben", () => {
  it("lässt den ersten Tipp durch und sperrt jeden weiteren innerhalb der Sperrzeit", () => {
    ausgabeSperreZuruecksetzen();
    expect(ausgabeFrei("csv", 1_000, 2_000)).toBe(true);
    expect(ausgabeFrei("csv", 1_150, 2_000)).toBe(false);
    expect(ausgabeFrei("csv", 1_800, 2_000)).toBe(false);
    expect(ausgabeFrei("lageblatt", 1_150, 2_000)).toBe(true); // andere Ausgabe, eigene Sperre
    expect(ausgabeFrei("csv", 3_100, 2_000)).toBe(true);
    ausgabeSperreZuruecksetzen();
  });
  it("sperrt länger als der späteste gemessene Doppeltipp (800 ms)", () => {
    expect(AUSGABE_SPERRE_MS).toBeGreaterThan(800);
  });
});
