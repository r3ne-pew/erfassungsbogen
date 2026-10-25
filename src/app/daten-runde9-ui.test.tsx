/**
 * Runde 9, Block Daten: Hinweiskasten für Beiseitegelegtes (R9-A1, R9-N4, R9-H4, R9-E4), Rückwege im
 * Assistenten, die Schrittwechsel und Neuladen überleben (R9-D3), Lagemonitor bei unlesbarem Text (R9-O2)
 * und Sollstärke an Monitor und Kachel (R9-K1).
 */
import { afterEach, beforeEach, describe, expect, it } from "vitest";
import { cleanup, render, screen, waitFor, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { useState, type ComponentType } from "react";
import { EinsatzArt, einsatzAnlegen, meldungHinzufuegen } from "@bos/meldekopf/einsaetze";
import { Dialogschicht } from "./dialoge";
import { neuePerson, neuerBogen, neuesFahrzeug } from "./hilfen";
import { UnlesbarHinweis } from "./unlesbar-hinweis";
import { sammlungenRetteZuruecksetzen, sammlungenRetten, unlesbarBestand } from "./unlesbar";
import { einsaetzeLesenZuruecksetzen } from "./einsaetze-lesen";
import { Lagemonitor } from "./lagemonitor-ui";
import { EinsatzListe } from "./einsaetze-ui";
import { einsaetzeLaden } from "./einsaetze-lesen";
import { SchrittFahrzeuge } from "./schritte/fahrzeuge";
import { SchrittEinheit } from "./schritte/einheit";
import { entwurfAusJson, entwurfZuJson } from "./entwurf";
import { FAHRZEUG_WEG_SCHLUESSEL, rueckwegHolen, rueckwegMerken } from "./rueckweg-sitzung";
import type { SchrittProps } from "./schritte";
import type { Erfassungsbogen } from "@bos/eeb-format/model";

const ABGESCHNITTEN = '[{"id":"s1","name":"Hochwasser Musterstadt","art":0,"eintraege":[{"id":"e1","einheitSchluessel":"a","bogen":{"personal":[{"vorname":"An';

beforeEach(() => {
  localStorage.clear();
  sessionStorage.clear();
  einsaetzeLesenZuruecksetzen();
  sammlungenRetteZuruecksetzen();
});
afterEach(cleanup);

describe("Kasten für Beiseitegelegtes (R9-A1, R9-N4, R9-H4)", () => {
  it("nennt die Sammlung beim Namen, sagt, dass erst „Daten sichern…“ eine Datei anlegt, und nennt den Papier-Rückweg", () => {
    sammlungenRetten(ABGESCHNITTEN);
    render(<UnlesbarHinweis />);
    const kasten = document.querySelector(".unlesbar-hinweis")!;
    const text = kasten.textContent!;
    expect(text).toContain("Hochwasser Musterstadt");
    expect(text).not.toMatch(/Gesamttext/);
    expect(text).toMatch(/erst „Daten sichern…“ legt eine\s+Datei an/);
    expect(text).toMatch(/Sammel-PDF und das Lageblatt gelten weiter/);
    expect(text).toMatch(/Bögen einlesen/);
    expect(text).not.toMatch(/stecken in der Datensicherung/);
  });

  it("zeigt zugeklappt nur die Kopfzeile: Die Knöpfe stehen hinter dem Antippen (kompakt, R9-M6, R9-S4)", () => {
    sammlungenRetten(ABGESCHNITTEN);
    render(<UnlesbarHinweis />);
    const details = document.querySelector<HTMLDetailsElement>(".unlesbar-hinweis details")!;
    expect(details.open).toBe(false);
    expect(details.querySelector("summary")!.textContent!.length).toBeLessThan(200);
  });

  it("„Beiseitegelegtes entfernen…“ räumt auch den beschädigten Vorlagentext am Ursprungsort (R9-E4)", async () => {
    const nutzer = userEvent.setup();
    localStorage.setItem("eeb.unlesbar.v1", JSON.stringify({ am: Date.now(), sammlungen: [], meldungen: [], vorlagen: [], texte: [{ art: "vorlagen", text: '[{"id":"v1"' }] }));
    localStorage.setItem("eeb.vorlagen.v1", '[{"id":"v1"');
    render(
      <>
        <UnlesbarHinweis />
        <Dialogschicht />
      </>,
    );
    const details = document.querySelector<HTMLDetailsElement>(".unlesbar-hinweis details")!;
    await nutzer.click(details.querySelector("summary")!);
    await nutzer.click(screen.getByRole("button", { name: "Beiseitegelegtes entfernen…" }));
    const dialog = document.querySelector<HTMLDialogElement>("dialog[open]")!;
    await nutzer.click(within(dialog).getByRole("button", { name: "Endgültig entfernen" }));
    await waitFor(() => expect(unlesbarBestand()).toBeNull());
    expect(localStorage.getItem("eeb.vorlagen.v1")).toBe("[]");
    expect(document.querySelector(".unlesbar-hinweis")).toBeNull();
  });
});

describe("Voller Speicher: der Kasten nennt das Scheitern (R9-O1, R9-E5)", () => {
  it("sagt „Speicher voll – beschädigte Daten nicht gesichert“, wenn das Beiseitelegen nicht ging", () => {
    const echt = Storage.prototype.setItem;
    Storage.prototype.setItem = function (k: string, v: string) {
      if (k === "eeb.unlesbar.v1") throw new DOMException("quota", "QuotaExceededError");
      return echt.call(this, k, v);
    };
    try {
      localStorage.setItem("eeb.einsaetze.v1", ABGESCHNITTEN);
      sammlungenRetten(ABGESCHNITTEN);
      render(<UnlesbarHinweis />);
      const text = document.querySelector(".unlesbar-hinweis")!.textContent!;
      expect(text).toContain("Speicher voll – beschädigte Daten nicht gesichert");
      expect(text).toContain("Hochwasser Musterstadt");
      expect(text).toMatch(/Daten sichern/);
      expect(localStorage.getItem("eeb.einsaetze.v1")).toBe(ABGESCHNITTEN);
    } finally {
      Storage.prototype.setItem = echt;
    }
  });
});

describe("Voller Speicher: Wortlaut und Rat passen zum Zustand (R10-O1, R10-O2, R10-H2)", () => {
  it("beugt Verb und Satzende in der Mehrzahl und nennt nur erreichbare Wege", () => {
    const echt = Storage.prototype.setItem;
    Storage.prototype.setItem = function (k: string, v: string) {
      if (k === "eeb.unlesbar.v1") throw new DOMException("quota", "QuotaExceededError");
      return echt.call(this, k, v);
    };
    try {
      localStorage.setItem("eeb.einsaetze.v1", "[[[");
      sammlungenRetten("[[[");
      render(<UnlesbarHinweis />);
      const text = document.querySelector(".unlesbar-hinweis")!.textContent!;
      expect(text).toContain("gespeicherte Einsatz-Sammlungen sind nicht lesbar und konnten nicht beiseitegelegt werden");
      // Eine unlesbare Sammlung: kein Rat, Papierkorb oder gesicherte Einsätze zu löschen.
      expect(text).not.toContain("Papierkorb leeren oder gesicherte Einsätze löschen");
      expect(text).toContain("Beschädigten Text verwerfen…");
    } finally {
      Storage.prototype.setItem = echt;
    }
  });

  it("nennt in der Rückfrage zum Entfernen, was entfernt wird (R10-H2)", async () => {
    const nutzer = userEvent.setup();
    localStorage.setItem("eeb.unlesbar.v1", JSON.stringify({ am: Date.now(), sammlungen: [], meldungen: [], vorlagen: [], texte: [{ art: "vorlagen", text: '[{"id":"v1"' }] }));
    localStorage.setItem("eeb.vorlagen.v1", '[{"id":"v1"');
    render(
      <>
        <UnlesbarHinweis />
        <Dialogschicht />
      </>,
    );
    await nutzer.click(document.querySelector<HTMLElement>(".unlesbar-hinweis summary")!);
    await nutzer.click(screen.getByRole("button", { name: "Beiseitegelegtes entfernen…" }));
    const dialog = document.querySelector<HTMLDialogElement>("dialog[open]")!;
    expect(dialog.textContent).toContain("Endgültig gelöscht wird, was beiseitegelegt liegt: gespeicherte Vorlagen");
  });
});

describe("Rückwege im Assistenten überleben Schrittwechsel und Neuladen (R9-D3)", () => {
  function Wechsel({ start, Schritt }: { start: Erfassungsbogen; Schritt: ComponentType<SchrittProps> }) {
    const [bogen, setBogen] = useState(start);
    const [da, setDa] = useState(true);
    return (
      <>
        <button onClick={() => setDa((d) => !d)}>wechsel</button>
        {da && <Schritt bogen={bogen} aendern={(p) => setBogen((b) => ({ ...b, ...p }))} />}
        <Dialogschicht />
      </>
    );
  }

  it("Fahrzeug: „Rückgängig“ steht nach „Weiter“ und Zurück wieder da", async () => {
    const nutzer = userEvent.setup();
    const start = neuerBogen();
    start.fahrzeuge = [
      { ...neuesFahrzeug(), kennzeichen: "THW-80125" },
      { ...neuesFahrzeug(), kennzeichen: "THW-80126" },
    ];
    render(<Wechsel start={start} Schritt={SchrittFahrzeuge} />);
    const knopf = screen.getAllByRole("button", { name: /entfernen$/ }).find((b) => b.className.includes("entfernen"))!;
    await nutzer.click(knopf);
    const frage = document.querySelector<HTMLDialogElement>("dialog[open]")!;
    expect(frage.textContent).toMatch(/auch nach „Weiter“ oder Neuladen/);
    await nutzer.click(within(frage).getByRole("button", { name: "Fahrzeug entfernen" }));
    await waitFor(() => expect(document.querySelector(".quittung-daumen")).not.toBeNull());

    await nutzer.click(screen.getByRole("button", { name: "wechsel" }));
    expect(document.querySelector(".quittung-daumen")).toBeNull();
    await nutzer.click(screen.getByRole("button", { name: "wechsel" }));
    const leiste = document.querySelector<HTMLElement>(".quittung-daumen")!;
    expect(leiste.textContent).toMatch(/^Entfernt: .*THW-80125/);
    await nutzer.click(within(leiste).getByRole("button", { name: "Rückgängig" }));
    expect((screen.getAllByLabelText("Kennzeichen") as HTMLInputElement[]).map((f) => f.value)).toEqual(["THW-80125", "THW-80126"]);
  });

  it("Ebene: „Ebene entfernen“ hat jetzt ein „Rückgängig“, auch nach dem Schrittwechsel", async () => {
    const nutzer = userEvent.setup();
    const b = neuerBogen();
    b.einheit.hierarchie = [
      { bezeichnung: { code: 1 }, name: "Wardenburg" },
      { bezeichnung: { code: 2 }, name: "Tübingen", telefon: "07071123" },
    ];
    render(<Wechsel start={b} Schritt={SchrittEinheit} />);
    await nutzer.click(screen.getByRole("button", { name: "Ebene RB Tübingen entfernen" }));
    const frage = document.querySelector<HTMLDialogElement>("dialog[open]")!;
    await nutzer.click(within(frage).getByRole("button", { name: "Ebene entfernen" }));
    expect(screen.getAllByLabelText(/^(Name|Ort der Einheit)/)).toHaveLength(1);
    await nutzer.click(screen.getByRole("button", { name: "wechsel" }));
    await nutzer.click(screen.getByRole("button", { name: "wechsel" }));
    const leiste = document.querySelector<HTMLElement>(".quittung-daumen")!;
    expect(leiste.textContent).toMatch(/Entfernt: RB Tübingen/);
    await nutzer.click(within(leiste).getByRole("button", { name: "Rückgängig" }));
    expect(screen.getAllByLabelText(/^(Name|Ort der Einheit)/)).toHaveLength(2);
    expect(screen.getByDisplayValue("07071123")).toBeTruthy();
  });

  it("der gemerkte Rückweg gilt nur kurz und nur für dieselbe Liste", () => {
    rueckwegMerken(FAHRZEUG_WEG_SCHLUESSEL, { x: 1 }, "liste-a", 1000);
    expect(rueckwegHolen(FAHRZEUG_WEG_SCHLUESSEL, "liste-a", 2000)).toEqual({ x: 1 });
    expect(rueckwegHolen(FAHRZEUG_WEG_SCHLUESSEL, "liste-b", 2000)).toBeNull();
    rueckwegMerken(FAHRZEUG_WEG_SCHLUESSEL, { x: 1 }, "liste-a", 1000);
    expect(rueckwegHolen(FAHRZEUG_WEG_SCHLUESSEL, "liste-a", 1000 + 16 * 60 * 1000)).toBeNull();
    expect(sessionStorage.getItem(FAHRZEUG_WEG_SCHLUESSEL)).toBeNull();
  });
});

describe("Zettelangaben der manuellen Aufnahme bleiben im Entwurf (R9-S1)", () => {
  it("Eingetroffen um, Nr. und Zug überleben Speichern und Laden; Müll fällt weg", () => {
    const b = neuerBogen();
    const text = entwurfZuJson(b, 5, { fremd: { einsatzId: "s1", beginn: 7, zettel: { zeit: "06:55", nr: "7", zug: "2. Zug" } } });
    expect(entwurfAusJson(text)?.fremd?.zettel).toEqual({ zeit: "06:55", nr: "7", zug: "2. Zug" });
    const bose = JSON.parse(text);
    bose.fremd.zettel = { zeit: "morgen", nr: 5, zug: "x".repeat(500), anderes: true };
    expect(entwurfAusJson(JSON.stringify(bose))?.fremd?.zettel).toEqual({ zug: "x".repeat(80) });
    bose.fremd.zettel = { zeit: "", nr: " " };
    expect(entwurfAusJson(JSON.stringify(bose))?.fremd?.zettel).toBeUndefined();
  });
});

describe("Lagemonitor bei unlesbarem Sammlungstext (R9-O2) und Sollstärke (R9-K1)", () => {
  it("behält den letzten Stand und sagt „Sammlung nicht lesbar – letzter Stand von HH:MM“", () => {
    const e = einsatzAnlegen("Hochwasser Süd", EinsatzArt.EINSATZ);
    const b = neuerBogen();
    b.einheit.hierarchie[0]!.name = "OV Musterstadt";
    b.personal = [{ ...neuePerson(), vorname: "A", nachname: "B" }];
    meldungHinzufuegen(e.id, b);
    const { rerender } = render(<Lagemonitor einsatzId={e.id} />);
    expect(screen.getByRole("heading", { name: "Hochwasser Süd" })).toBeTruthy();
    // Ein anderes Fenster macht den Text unlesbar.
    localStorage.setItem("eeb.einsaetze.v1", "xx");
    einsaetzeLesenZuruecksetzen();
    rerender(<Lagemonitor einsatzId={e.id} />);
    expect(screen.getByRole("heading", { name: "Hochwasser Süd" })).toBeTruthy();
    expect(screen.getByRole("alert").textContent).toMatch(/Sammlung nicht lesbar – letzter Stand von \d\d:\d\d Uhr/);
    expect(screen.queryByText(/nicht \(mehr\) vorhanden/)).toBeNull();
  });

  it("sagt ohne früheren Stand „nicht lesbar“ statt „nicht mehr vorhanden“, wenn Sammlungen beiseite liegen", () => {
    localStorage.setItem("eeb.einsaetze.v1", "xx");
    render(<Lagemonitor einsatzId="unbekannt" />);
    expect(screen.getByText(/nicht lesbar und liegen beiseite/)).toBeTruthy();
  });

  it("nennt unter der Gesamtstärke den Sollanteil und lässt die Zeile weg, wenn alles gezählt ist", () => {
    const e = einsatzAnlegen("Lage", EinsatzArt.EINSATZ);
    const soll = neuerBogen();
    soll.einheit.hierarchie[0]!.name = "OV Soll";
    soll.personal = [neuePerson(), neuePerson(), neuePerson()];
    meldungHinzufuegen(e.id, soll);
    render(<Lagemonitor einsatzId={e.id} />);
    expect(document.body.textContent).toMatch(/davon 3 Sollstärke( \(S\))?, nicht gemeldet/);
    cleanup();
    const e2 = einsatzAnlegen("Gezählt", EinsatzArt.EINSATZ);
    const ist = neuerBogen();
    ist.einheit.hierarchie[0]!.name = "OV Ist";
    ist.personal = [{ ...neuePerson(), vorname: "A", nachname: "B" }];
    meldungHinzufuegen(e2.id, ist);
    render(<Lagemonitor einsatzId={e2.id} />);
    expect(document.body.textContent).not.toMatch(/Sollstärke/);
  });
});

describe("Kachel der Sammlung (R9-K1)", () => {
  it("nennt den Sollanteil an der Stärke und lässt ihn weg, wenn alles gezählt ist", () => {
    const e = einsatzAnlegen("Lage", EinsatzArt.EINSATZ);
    const soll = neuerBogen();
    soll.einheit.hierarchie[0]!.name = "OV Soll";
    soll.personal = [neuePerson(), neuePerson()];
    meldungHinzufuegen(e.id, soll);
    render(<EinsatzListe einsaetze={einsaetzeLaden()} onOeffnen={() => {}} onGeaendert={() => {}} />);
    expect(document.body.textContent).toMatch(/davon 2 Sollstärke, nicht gemeldet/);
  });
});
