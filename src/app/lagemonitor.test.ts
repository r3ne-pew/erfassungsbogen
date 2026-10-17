import { describe, it, expect } from "vitest";
import { dauerText, dtgText, vorText, zuEingabeWert, ausEingabeWert } from "./lagemonitor";

describe("dtgText", () => {
  it("schreibt Tag, Zeit, Monat und Jahr wie im Funk", () => {
    expect(dtgText(new Date(2026, 9, 17, 20, 35))).toBe("172035 OKT 26");
    expect(dtgText(new Date(2026, 4, 3, 7, 5))).toBe("030705 MAI 26");
  });
});

describe("dauerText", () => {
  const t0 = new Date(2026, 9, 17, 8, 0).getTime();
  it("zeigt Stunden und Minuten", () => {
    expect(dauerText(t0, t0 + (3 * 60 + 15) * 60_000)).toBe("03:15 h");
    expect(dauerText(t0, t0)).toBe("00:00 h");
  });
  it("zählt ab 24 Stunden Tage mit", () => {
    expect(dauerText(t0, t0 + (51 * 60 + 5) * 60_000)).toBe("2 d 03:05 h");
  });
  it("liefert nichts ohne Beginn oder bei einem Beginn in der Zukunft", () => {
    expect(dauerText(null, t0)).toBeNull();
    expect(dauerText(t0 + 1, t0)).toBeNull();
  });
});

describe("vorText", () => {
  it("rechnet in Minuten, Stunden und Tagen", () => {
    const j = 10_000_000_000;
    expect(vorText(j - 20_000, j)).toBe("gerade eben");
    expect(vorText(j - 7 * 60_000, j)).toBe("vor 7 Min");
    expect(vorText(j - 125 * 60_000, j)).toBe("vor 2 Std 5 Min");
    expect(vorText(j - 120 * 60_000, j)).toBe("vor 2 Std");
    expect(vorText(j - 3 * 86_400_000, j)).toBe("vor 3 d");
  });
});

describe("Eingabewert des Beginns", () => {
  it("läuft hin und zurück", () => {
    const ms = new Date(2026, 9, 17, 8, 5).getTime();
    expect(zuEingabeWert(ms)).toBe("2026-10-17T08:05");
    expect(ausEingabeWert(zuEingabeWert(ms))).toBe(ms);
  });
  it("nimmt leer und Unsinn als „nicht gesetzt“", () => {
    expect(ausEingabeWert("")).toBeNull();
    expect(ausEingabeWert("gestern")).toBeNull();
  });
});
