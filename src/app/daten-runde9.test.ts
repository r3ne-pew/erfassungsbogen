/**
 * Runde 9, Block Daten und Speicher: voller Speicher beim Beiseitelegen (R9-O1, R9-E5), Aufräumen am
 * Ursprungsort (R9-E4), Absenderkarte (R9-O3), Rückfragen mit Beiseitegelegtem (R9-D2).
 * Die Sammlungs-Tests laufen über die echte Hülle und den echten Kern (vgl. uhr-korrektur.test.ts).
 */
import { afterEach, beforeEach, describe, expect, it } from "vitest";
import { EinsatzArt, einsatzAnlegen, einsaetzeLaden, speicherhuelleSetzen } from "@bos/meldekopf/einsaetze";
import { aufraeumBeobachter } from "./aufraeum-hinweis";
import { schonendeHuelle, leseSchreibFehlerZuruecksetzen, nurLesend } from "./speicher-schonend";
import { uhrKorrigierteHuelle } from "./uhr-korrektur";
import { UNLESBAR_SCHLUESSEL, rettungOffenArten, sammlungenRetteZuruecksetzen, unlesbarBestand } from "./unlesbar";
import { beiseitegelegtesEntfernen, textBeschreiben } from "./unlesbar-aufraeumen";
import { vorlageAnlegen, vorlagenLaden } from "./vorlagen";
import { neuerBogen } from "./hilfen";
import { absenderkarteLaden, absenderkarteSpeichern } from "./absenderkarte";
import { speicherVerdrahten } from "./speicher-browser";
import { bestandUmfang, bestandBetroffen, datenUmfang } from "./sicherung";
import { beschaedigterEntwurfAnzeige, beschaedigtenEntwurfVerwerfen, entwurfLaden, entwurfSpeichern, entwurfVerwerfen } from "./entwurf";

const SAMMLUNGEN = "eeb.einsaetze.v1";
const VORLAGEN = "eeb.vorlagen.v1";
const ENTWURF = "eeb.entwurf.v1";

class MemStorage {
  m = new Map<string, string>();
  /** Schlüssel, die nicht mehr geschrieben werden können (Speicher voll). */
  voll = new Set<string>();
  get length() {
    return this.m.size;
  }
  key(i: number) {
    return [...this.m.keys()][i] ?? null;
  }
  getItem(k: string) {
    return this.m.has(k) ? this.m.get(k)! : null;
  }
  setItem(k: string, v: string) {
    if (this.voll.has(k)) throw new DOMException("quota", "QuotaExceededError");
    this.m.set(k, String(v));
  }
  removeItem(k: string) {
    this.m.delete(k);
  }
}

let mem: MemStorage;

function verdrahten() {
  speicherhuelleSetzen(schonendeHuelle(uhrKorrigierteHuelle(aufraeumBeobachter(mem as unknown as Storage)), "[]"));
}

beforeEach(() => {
  mem = new MemStorage();
  (globalThis as { localStorage?: Storage }).localStorage = mem as unknown as Storage;
  sammlungenRetteZuruecksetzen();
  leseSchreibFehlerZuruecksetzen();
  verdrahten();
});

afterEach(() => {
  speicherhuelleSetzen(null);
});

const ABGESCHNITTEN = '[{"id":"s1","name":"Hochwasser Musterstadt","art":0,"eintraege":[{"id":"e1","einheitSchluessel":"a","bogen":{"personal":[{"vorname":"An';

describe("Voller Speicher: Beiseitelegen scheitert (R9-O1, R9-E5)", () => {
  it("lässt den Kern den beschädigten Sammlungstext nicht durch [] ersetzen", () => {
    mem.m.set(SAMMLUNGEN, ABGESCHNITTEN);
    mem.voll.add(UNLESBAR_SCHLUESSEL);
    nurLesend(() => einsaetzeLaden());
    expect(einsaetzeLaden()).toEqual([]);
    expect(mem.m.get(SAMMLUNGEN)).toBe(ABGESCHNITTEN);
    expect(mem.m.has(UNLESBAR_SCHLUESSEL)).toBe(false);
    expect(rettungOffenArten()).toEqual(["sammlungen"]);
    // Auch eine Änderung (neuer Einsatz) überschreibt nichts, sondern meldet „voll“.
    expect(() => einsatzAnlegen("Neu", EinsatzArt.EINSATZ)).toThrow();
    expect(mem.m.get(SAMMLUNGEN)).toBe(ABGESCHNITTEN);
  });

  it("schreibt wieder, sobald das Beiseitelegen gelingt, und behält den Text dann unter dem Beiseite-Schlüssel", () => {
    mem.m.set(SAMMLUNGEN, ABGESCHNITTEN);
    mem.voll.add(UNLESBAR_SCHLUESSEL);
    einsaetzeLaden();
    expect(rettungOffenArten()).toEqual(["sammlungen"]);
    // Platz ist da: Erster Zugriff nach der Wiederholungsfrist legt beiseite und gibt frei.
    mem.voll.clear();
    const jetzt = Date.now();
    const echt = Date.now;
    Date.now = () => jetzt + 5_000;
    try {
      einsaetzeLaden();
      expect(rettungOffenArten()).toEqual([]);
      einsatzAnlegen("Neu", EinsatzArt.EINSATZ);
    } finally {
      Date.now = echt;
    }
    expect(unlesbarBestand()?.texte).toEqual([{ art: "sammlungen", text: ABGESCHNITTEN }]);
    expect(JSON.parse(mem.m.get(SAMMLUNGEN)!)).toHaveLength(1);
  });

  it("lässt auch einen beschädigten Vorlagentext stehen, wenn der Speicher voll ist", () => {
    mem.m.set(VORLAGEN, '[{"id":"v1","name":"FGr","bogen":{"personal":[');
    mem.voll.add(UNLESBAR_SCHLUESSEL);
    expect(vorlagenLaden()).toEqual([]);
    expect(rettungOffenArten()).toEqual(["vorlagen"]);
    expect(() => vorlageAnlegen("Neu", neuerBogen())).toThrow();
    expect(mem.m.get(VORLAGEN)).toBe('[{"id":"v1","name":"FGr","bogen":{"personal":[');
  });

  it("Entwurf: bleibt stehen, wird nicht überschrieben und nicht verworfen, und die Startseite nennt ihn", () => {
    mem.m.set(ENTWURF, '{"gespeichert":12,"bogen":{"personal":[');
    mem.voll.add("eeb.entwurf.beschaedigt.v1");
    expect(entwurfLaden()).toBeNull();
    expect(mem.m.get(ENTWURF)).toBe('{"gespeichert":12,"bogen":{"personal":[');
    expect(beschaedigterEntwurfAnzeige()).toMatchObject({ ungesichert: true, text: '{"gespeichert":12,"bogen":{"personal":[' });
    expect(entwurfSpeichern(neuerBogen())).toBe(false);
    entwurfVerwerfen();
    expect(mem.m.get(ENTWURF)).toBe('{"gespeichert":12,"bogen":{"personal":[');
    // Ausdrückliches Entfernen räumt ihn weg.
    beschaedigtenEntwurfVerwerfen();
    expect(mem.m.has(ENTWURF)).toBe(false);
    expect(beschaedigterEntwurfAnzeige()).toBeNull();
    expect(entwurfSpeichern(neuerBogen())).toBe(true);
  });
});

describe("Beiseitegelegtes entfernen räumt am Ursprungsort auf (R9-E4)", () => {
  it("ersetzt einen beschädigten Vorlagentext, damit der Fund nicht wiederkehrt", () => {
    mem.m.set(VORLAGEN, '[{"id":"v2","name":"THW","bogen":{"personal":[');
    expect(vorlagenLaden()).toEqual([]);
    expect(unlesbarBestand()?.texte).toHaveLength(1);
    expect(beiseitegelegtesEntfernen()).toBe(true);
    expect(mem.m.has(UNLESBAR_SCHLUESSEL)).toBe(false);
    expect(mem.m.get(VORLAGEN)).toBe("[]");
    // „Neuladen“: nichts wird erneut gefunden.
    vorlagenLaden();
    expect(unlesbarBestand()).toBeNull();
  });

  it("behält bei Sammlungen den lesbaren Rest", () => {
    const gut = { id: "e1", einheitSchluessel: "k", empfangenAm: 1, quelle: 0, status: 0, bogen: neuerBogen() };
    mem.m.set(SAMMLUNGEN, JSON.stringify([{ id: "s1", name: "A", art: 0, angelegt: 1, geaendert: Date.now(), eintraege: [gut, { id: "x" }] }]));
    einsaetzeLaden();
    expect(unlesbarBestand()?.meldungen).toHaveLength(1);
    expect(beiseitegelegtesEntfernen()).toBe(true);
    const rest = JSON.parse(mem.m.get(SAMMLUNGEN)!);
    expect(rest[0].eintraege).toHaveLength(1);
    sammlungenRetteZuruecksetzen();
    einsaetzeLaden();
    expect(unlesbarBestand()).toBeNull();
  });
});

describe("Absenderkarte (R9-O3)", () => {
  beforeEach(() => speicherVerdrahten());

  it("legt eine beschädigte Karte beiseite und nennt sie", () => {
    mem.m.set("eeb.absenderkarte.v1", '{"x');
    expect(absenderkarteLaden()).toEqual({});
    expect(unlesbarBestand()?.texte).toEqual([{ art: "absenderkarte", text: '{"x' }]);
  });

  it("legt die beschädigte Karte beiseite, bevor eine neue sie überschreibt", () => {
    mem.m.set("eeb.absenderkarte.v1", "kaputt");
    absenderkarteSpeichern({ name: "Max" });
    expect(unlesbarBestand()?.texte).toEqual([{ art: "absenderkarte", text: "kaputt" }]);
    expect(absenderkarteLaden()).toEqual({ name: "Max" });
  });
});

describe("Rückfragen nennen Beiseitegelegtes (R9-D2)", () => {
  it("zählt den beiseitegelegten Text und den beschädigten Entwurf im Bestand und verlangt damit den Haken", () => {
    const eintraege = {
      [UNLESBAR_SCHLUESSEL]: JSON.stringify({ am: 1, sammlungen: [], meldungen: [], vorlagen: [], texte: [{ art: "sammlungen", text: ABGESCHNITTEN }] }),
      "eeb.entwurf.beschaedigt.v1": '{"text":"x","ursache":"y","am":1}',
    };
    const b = bestandUmfang(eintraege);
    expect(b.beiseite).toEqual({ eintraege: 1, zeichen: eintraege[UNLESBAR_SCHLUESSEL].length, entwurf: true });
    expect(bestandBetroffen(b)).toBe(true);
    expect(bestandBetroffen(bestandUmfang({}))).toBe(false);
  });

  it("„Alle Daten löschen“ führt den beiseitegelegten Sammlungstext mit Zahl", () => {
    mem.m.set(SAMMLUNGEN, ABGESCHNITTEN);
    einsaetzeLaden();
    const u = datenUmfang();
    expect(u.beiseiteDaten?.eintraege).toBe(1);
    expect(u.beiseiteDaten?.zeichen).toBeGreaterThan(ABGESCHNITTEN.length);
  });
});

describe("textBeschreiben (R9-H4)", () => {
  it("nennt Name und Zahl der Meldungen auch im abgeschnittenen Text", () => {
    expect(textBeschreiben("sammlungen", ABGESCHNITTEN)).toEqual({ namen: ["Hochwasser Musterstadt"], zahl: 1 });
  });
});
