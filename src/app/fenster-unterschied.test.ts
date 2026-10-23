/** Was unterscheidet die Fassung des anderen Fensters? (Audit Runde 7, R7-O2, R7-W5) */
import { describe, expect, it } from "vitest";
import { neuePerson, neuerBogen } from "./hilfen";
import { unterschiedText, zeitMitSekunden } from "./fenster-unterschied";

describe("unterschiedText", () => {
  it("nennt das geänderte Feld, wenn nur der Ort anders ist", () => {
    const a = neuerBogen();
    const b = structuredClone(a);
    b.einsatz.ortAuftrag = "Nordhafen";
    expect(unterschiedText(a, b)).toBe("Ort / Auftrag");
  });

  it("nennt Personal und Fahrzeuge als Abschnitt mit Zahl", () => {
    const a = neuerBogen();
    const b = structuredClone(a);
    b.personal = [...b.personal, { ...neuePerson(), nachname: "Neu", vorname: "Nina" }];
    expect(unterschiedText(a, b)).toMatch(/Personal \(1 Eintrag\)/);
  });

  it("ist leer bei gleichem Inhalt", () => {
    const a = neuerBogen();
    expect(unterschiedText(a, structuredClone(a))).toBe("");
  });
});

describe("zeitMitSekunden", () => {
  it("nennt heute nur die Uhrzeit mit Sekunden", () => {
    expect(zeitMitSekunden(Date.now())).toMatch(/^\d\d:\d\d:\d\d Uhr$/);
  });
  it("nennt an einem anderen Tag das Datum dazu", () => {
    expect(zeitMitSekunden(Date.now() - 3 * 86_400_000)).toMatch(/^\d\d\.\d\d\.\d\d, \d\d:\d\d:\d\d Uhr$/);
  });
});
