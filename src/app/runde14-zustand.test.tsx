/**
 * Runde 14, Block Zustand: Logik ohne Oberfläche — Doppeltipp-Nachlauf (G1), Sicherung und Vorratsstand (O2),
 * Telefonprüfung der Absenderkarte (E5), Entfernen-Bezug (D1), Beispiel-Herkunft (E6), Bildlaufstelle (S2),
 * Umbruchstellen in Adressen (S4), Stilregel für das Handscanner-Fenster (E2).
 */
import { readFileSync } from "node:fs";
import { join } from "node:path";
import { afterEach, beforeEach, describe, expect, it } from "vitest";
import { EinsatzArt, MeldeStatus, einsaetzeLaden, einsatzAnlegen, meldungAufteilen, meldungHinzufuegen } from "@bos/meldekopf/einsaetze";
import { arbeiten, arbeitetZuruecksetzen, NACHLAUF_MS, tippWaehrendLauf } from "./arbeitet";
import { ausgabeFreiBeiTipp, ausgabeSperreZuruecksetzen } from "./ausgabe-sperre";
import { sicherungEinspielen, sicherungInhalt, ZUSATZ_STAND_SCHLUESSEL } from "./sicherung";
import { absenderHinweis, telefonProblem } from "./absenderkarte";
import { entfernenBezug, adresseUmbrechbar } from "./einsaetze-ui";
import { BEISPIEL_HERKUNFT_SCHLUESSEL, beispielMerken, beispielRestText, beispielVergessen } from "./beispiel-herkunft";
import { ANSICHT_STELLE_SCHLUESSEL, STELLE_MAX_ALTER_MS, ansichtSchluessel, stelleLaden, stelleMerken } from "./ansicht-stelle";
import { neuePerson, neuerBogen } from "./hilfen";
import { KontaktArt } from "@bos/eeb-format/model";
import { abgeteiltDoppeltImStapel } from "./abgeteilt-doppelt";
import { geltendeJeEinheit } from "./fassung-vorrang";

beforeEach(() => {
  localStorage.clear();
  sessionStorage.clear();
});

describe("R14-G1 Doppeltipp: Tipps kurz nach dem Ende des Laufs gehören noch dazu", () => {
  afterEach(() => {
    arbeitetZuruecksetzen();
    ausgabeSperreZuruecksetzen();
  });

  it("ein Tipp innerhalb des Nachlaufs nach dem Lauf tut nichts, ein bewusster späterer geht durch", async () => {
    let fertig: (() => void) | undefined;
    const lauf = arbeiten("weitergeben", () => new Promise<void>((r) => (fertig = r)));
    // `arbeiten` startet die Aktion erst nach dem nächsten Bild: Auf einem langsamen Runner reichten feste
    // 20 ms nicht, und `fertig` war noch nicht gesetzt (CI-Ausfall am 26.10.). Deshalb warten, bis sie läuft.
    for (let i = 0; !fertig && i < 200; i++) await new Promise((r) => setTimeout(r, 10));
    if (!fertig) throw new Error("Die Aktion wurde nicht gestartet");
    expect(ausgabeFreiBeiTipp("weitergeben", { timeStamp: performance.now() }, tippWaehrendLauf, 2000)).toBe(false);
    fertig();
    await lauf;
    const ende = performance.now();
    // Der Prüfer wartet, bis der Knopf wieder frei ist, und tippt sofort — 50 ms nach dem Ende.
    ausgabeSperreZuruecksetzen();
    expect(tippWaehrendLauf(ende + 50)).toBe(true);
    expect(ausgabeFreiBeiTipp("weitergeben", { timeStamp: ende + 50 }, tippWaehrendLauf, 2000)).toBe(false);
    // Nach der Quittung (> Nachlauf) ist es eine neue, bewusste Ausgabe.
    ausgabeSperreZuruecksetzen();
    expect(tippWaehrendLauf(ende + NACHLAUF_MS + 500)).toBe(false);
    expect(ausgabeFreiBeiTipp("weitergeben", { timeStamp: ende + NACHLAUF_MS + 500 }, tippWaehrendLauf, 2000)).toBe(true);
  });
});

describe("R14-O2 Sicherung einspielen lässt den Vorratsstand beim Gerät", () => {
  it("die Datei vom vollständigen Gerät überschreibt „n von 549“ nicht", () => {
    localStorage.setItem(ZUSATZ_STAND_SCHLUESSEL, JSON.stringify({ fertig: 57, gesamt: 549 }));
    localStorage.setItem("eeb.vorlagen.v1", "[]");
    const datei = sicherungInhalt({
      "eeb.vorlagen.v1": "[1]",
      [ZUSATZ_STAND_SCHLUESSEL]: JSON.stringify({ fertig: 549, gesamt: 549 }),
    });
    expect(sicherungEinspielen(datei)).toBe(1);
    expect(localStorage.getItem("eeb.vorlagen.v1")).toBe("[1]");
    expect(JSON.parse(localStorage.getItem(ZUSATZ_STAND_SCHLUESSEL)!)).toEqual({ fertig: 57, gesamt: 549 });
  });

  it("der Schlüssel ist derselbe wie der des Vorrats (offline-bereit.ts)", () => {
    const quelle = readFileSync(join(process.cwd(), "src/app/offline-bereit.ts"), "utf8");
    expect(quelle).toContain(`"${ZUSATZ_STAND_SCHLUESSEL}"`);
  });

  it("ein Gerät ohne eigenen Vorratsstand bekommt auch keinen aus der Datei", () => {
    const datei = sicherungInhalt({ [ZUSATZ_STAND_SCHLUESSEL]: JSON.stringify({ fertig: 549, gesamt: 549 }) });
    sicherungEinspielen(datei);
    expect(localStorage.getItem(ZUSATZ_STAND_SCHLUESSEL)).toBeNull();
  });
});

describe("R14-E5 Telefonnummer der Absenderkarte wie im Assistenten prüfen", () => {
  it("Buchstaben, zweite Nummer und zu wenige Ziffern fallen auf; saubere Nummern nicht", () => {
    expect(telefonProblem("0170 1234567")).toBeNull();
    expect(telefonProblem("+49 170 1234567")).toBeNull();
    expect(telefonProblem("")).toBeNull();
    expect(telefonProblem("abc")?.wert).toBe("");
    expect(telefonProblem("12")?.text).toContain("unvollständig");
    const buchstaben = telefonProblem("0170 abc");
    expect(buchstaben?.text).toContain("abc");
    expect(buchstaben?.wert).toBe("0170");
    const zwei = telefonProblem("0171 1234567 / 0441 99887");
    expect(zwei?.text).toContain("Zweite Nummer");
    expect(zwei?.wert).toBe("01711234567");
  });

  it("der Hinweis unter dem Feld nennt dieselben Fälle", () => {
    expect(absenderHinweis({ name: "Max", telefon: "0170 abc" })).toContain("abc");
    expect(absenderHinweis({ name: "Max", telefon: "0171 1234567 / 0441 99" })).toContain("Zweite Nummer");
    expect(absenderHinweis({ name: "Max", telefon: "0170 1234567" })).toBe("");
  });
});

describe("R14-D1 Entfernen: Nummer, Teil und Stärke unterscheiden den Trupp von der Stammeinheit", () => {
  function aufgeteilt() {
    const s = einsatzAnlegen("Hochwasser Weser", EinsatzArt.EINSATZ);
    const b = neuerBogen();
    b.einheit.hierarchie[0]!.name = "Sinsheim";
    b.personal = Array.from({ length: 11 }, (_, i) => ({ ...neuePerson(), nachname: `Person${i}`, vorname: "Max" }));
    const r = meldungHinzufuegen(s.id, b);
    expect(r).toBeTruthy();
    const kopf = einsaetzeLaden()[0]!.eintraege[0]!;
    const teil = meldungAufteilen(s.id, kopf.id, { teilEtikett: "Trupp 2", personal: [0, 1, 2, 3], fahrzeuge: [] }, {});
    expect(teil).toBeTruthy();
    return einsaetzeLaden()[0]!.eintraege;
  }

  it("der Teil nennt „Trupp 2“ und 4 Personen und sagt, dass sie danach nirgends mehr zählen", () => {
    const alle = aufgeteilt();
    const teil = geltendeJeEinheit(alle).find((e) => e.teilEtikett === "Trupp 2" && e.status === MeldeStatus.ANWESEND)!;
    const { bezug, folge } = entfernenBezug(alle, teil);
    expect(bezug).toBe('Teil „Trupp 2", 4 Personen');
    expect(folge).toContain("zählen danach nirgends mehr");
    expect(folge).toContain("Zusammenführen");
  });

  it("die Stammeinheit nennt den stehenden Trupp", () => {
    const alle = aufgeteilt();
    const stamm = geltendeJeEinheit(alle).find((e) => !e.teilEtikett && e.status === MeldeStatus.ANWESEND)!;
    const { bezug, folge } = entfernenBezug(alle, stamm);
    expect(bezug).toBe("7 Personen");
    expect(folge).toContain('„Trupp 2" (4 Personen)');
    expect(folge).toContain("Abgeteilt bleibt stehen");
  });
});

describe("R14-D2 Folgemeldung einer aufgeteilten Einheit im Stapel", () => {
  it("nennt je Folgemeldung die schon abgeteilten Personen, damit sie nicht still doppelt zählen", () => {
    const s = einsatzAnlegen("Hochwasser Weser", EinsatzArt.EINSATZ);
    const b = neuerBogen();
    b.einheit.hierarchie[0]!.name = "Sinsheim";
    b.personal = Array.from({ length: 11 }, (_, i) => ({ ...neuePerson(), nachname: `Person${i}`, vorname: "Max" }));
    meldungHinzufuegen(s.id, b);
    const kopf = einsaetzeLaden()[0]!.eintraege[0]!;
    meldungAufteilen(s.id, kopf.id, { teilEtikett: "Trupp 2", personal: [0, 1, 2, 3], fahrzeuge: [] }, {});
    const vorher = einsaetzeLaden()[0]!.eintraege;
    const neu = structuredClone(b);
    neu.stand = b.stand + 30;
    meldungHinzufuegen(s.id, neu);
    const nachher = einsaetzeLaden()[0]!.eintraege;
    const neueIds = nachher.filter((e) => !vorher.some((v) => v.id === e.id)).map((e) => e.id);
    expect(neueIds.length).toBe(1);
    const zeilen = abgeteiltDoppeltImStapel(vorher, nachher, neueIds);
    expect(zeilen).toHaveLength(1);
    expect(zeilen[0]).toContain("Trupp 2");
    expect(zeilen[0]).toContain("zählen jetzt doppelt");
  });
});

describe("R14-E6 Beispieldaten im Bogen", () => {
  function bogenMit(namen: [string, string][], nummer?: string) {
    const b = neuerBogen();
    b.personal = namen.map(([n, v]) => {
      const p = neuePerson();
      p.nachname = n;
      p.vorname = v;
      if (nummer) p.kontakte = [{ art: KontaktArt.MOBIL, dienstlich: true, wert: nummer }];
      return p;
    });
    return b;
  }

  it("erkennt Namen und Nummern aus dem Beispiel, bis sie ersetzt sind", () => {
    const beispiel = bogenMit([["Lang", "Sabine"], ["Sommer", "Sandra"]], "5556968346");
    beispielMerken(beispiel);
    expect(JSON.parse(localStorage.getItem(BEISPIEL_HERKUNFT_SCHLUESSEL)!)).toEqual(["n:lang, sabine", "t:5556968346", "n:sommer, sandra"]);
    expect(beispielRestText(beispiel)).toContain("2 Personen („Lang, Sabine“, „Sommer, Sandra“) und 1 Rufnummer");
    // Teilweise ersetzt: Eine Person und die Nummer stehen noch drin.
    const teilweise = bogenMit([["Lang", "Sabine"]], "5556968346");
    expect(beispielRestText(teilweise)).toContain("1 Person („Lang, Sabine“) und 1 Rufnummer");
    // Alles ersetzt: kein Satz mehr.
    const ersetzt = bogenMit([["Echt", "Erika"]], "01701234567");
    expect(beispielRestText(ersetzt)).toBe("");
  });

  it("vergisst alles, sobald kein Bogen mehr offen ist; ohne Speicher fragt die App nicht", () => {
    const beispiel = bogenMit([["Lang", "Sabine"]]);
    beispielMerken(beispiel);
    beispielVergessen();
    expect(localStorage.getItem(BEISPIEL_HERKUNFT_SCHLUESSEL)).toBeNull();
    expect(beispielRestText(beispiel)).toBe("");
  });
});

describe("R14-S2 Bildlaufstelle über das Neuladen", () => {
  it("merkt Ansicht und Stelle, gibt sie nur für dieselbe Ansicht und nur kurz zurück", () => {
    const einsatz = ansichtSchluessel({ schritt: 0, zeigeStart: false, einsatz: "e1", scanner: false });
    expect(einsatz).toBe("einsatz:e1");
    expect(ansichtSchluessel({ schritt: 2, zeigeStart: false, einsatz: null, scanner: false })).toBe("schritt:2");
    expect(ansichtSchluessel({ schritt: 0, zeigeStart: true, einsatz: null, scanner: false })).toBe("start");
    expect(ansichtSchluessel({ schritt: 0, zeigeStart: false, einsatz: null, scanner: true })).toBeNull();
    const jetzt = 1_000_000;
    stelleMerken("einsatz:e1", 2017.4, jetzt);
    expect(sessionStorage.getItem(ANSICHT_STELLE_SCHLUESSEL)).toBeTruthy();
    expect(stelleLaden("einsatz:e1", jetzt + 5000)).toBe(2017);
    expect(stelleLaden("einsatz:e2", jetzt + 5000)).toBeNull();
    expect(stelleLaden("einsatz:e1", jetzt + STELLE_MAX_ALTER_MS + 1)).toBeNull();
    stelleMerken("einsatz:e1", 40, jetzt);
    expect(stelleLaden("einsatz:e1", jetzt)).toBeNull(); // ganz oben: nichts zu rollen
  });

  it("kaputter Wert im Speicher ergibt keine Stelle statt eines Fehlers", () => {
    sessionStorage.setItem(ANSICHT_STELLE_SCHLUESSEL, "{kaputt");
    expect(stelleLaden("start")).toBeNull();
  });
});

describe("R14-S4 Adressen brechen nur an Umbruchstellen", () => {
  it("setzt <wbr> hinter „@“ und „.“ und lässt den Text unverändert", () => {
    const teile = adresseUmbrechbar("Poststelle.RSt_Freiburg@thw.de");
    const text = teile.filter((t): t is string => typeof t === "string").join("");
    expect(text).toBe("Poststelle.RSt_Freiburg@thw.de");
    expect(teile.filter((t) => typeof t !== "string")).toHaveLength(3);
  });
});

describe("R14-E2 Handscanner-Fenster: Fremdtext bricht um", () => {
  it("die Zeilen im Scanner-Fenster dürfen umbrechen und das Fenster nicht verbreitern", () => {
    const html = readFileSync(join(process.cwd(), "index.html"), "utf8");
    const abschnitt = html.slice(html.indexOf("Runde 14 (Zustand)"), html.indexOf("Ende Runde 14 (Zustand)"));
    expect(abschnitt).toMatch(/\.scanner-handscanner p[^{]*\{[^}]*overflow-wrap:\s*anywhere/);
    expect(abschnitt).toMatch(/\.scanner-handscanner[^{]*\{[^}]*min-width:\s*0/);
  });
});
