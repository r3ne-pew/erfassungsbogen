/**
 * Runde 12, Block Zustand: Verhalten der ganzen App — Einsatz löschen mit angefangener Erfassung (R12-S1),
 * leerer Einsatz (R12-E5), Absenderkarte (R12-E2), Eintreffzeit (R12-E4).
 */
import { afterEach, describe, expect, it, vi } from "vitest";
import { cleanup, render, screen, waitFor, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import type { Erfassungsbogen } from "@bos/eeb-format/model";
import { EinsatzArt, einsaetzeLaden, einsatzAnlegen as einsatzImSpeicherAnlegen, einsaetzePapierkorb, meldungHinzufuegen } from "@bos/meldekopf/einsaetze";
import { neuerBogen } from "./hilfen";
import { AbsenderkarteFeld } from "./absenderkarte-ui";
import { absenderkarteLaden } from "./absenderkarte";
import { Dialogschicht } from "./dialoge";

const einsatzPdfErzeugen = vi.fn(async () => true);
const einsatzLageblattErzeugen = vi.fn(async () => true);
vi.mock("./pdf", () => ({
  pdfErzeugen: async () => {},
  pdfBlobUrl: async () => "blob:pdf-vorschau",
  einsatzPdfErzeugen: (...a: unknown[]) => (einsatzPdfErzeugen as (...x: unknown[]) => Promise<boolean>)(...a),
  einsatzLageblattErzeugen: (...a: unknown[]) => (einsatzLageblattErzeugen as (...x: unknown[]) => Promise<boolean>)(...a),
  blankoPdfErzeugen: async () => true,
}));
vi.mock("./nativ", async () => {
  const echt = await vi.importActual<typeof import("./nativ")>("./nativ");
  return {
    istNativ: () => false,
    plattform: () => "web",
    imWebBrowser: () => true,
    bogenLinksEmpfangen: () => () => {},
    qrScannen: async () => "",
    binaerTeilen: async () => {},
    linkTeilen: async () => {},
    textTeilen: async () => {},
    shareSheetVerfuegbar: () => false,
    nahbereichDienst: echt.nahbereichDienst,
    pdfEinbettbar: () => true,
  };
});
vi.mock("./pdf-qr", () => ({ qrTexteAusPdfBytes: async () => [] }));

const { App } = await import("./app");

afterEach(() => {
  cleanup();
  window.history.replaceState(null, "", window.location.pathname + window.location.search);
  localStorage.clear();
  einsatzPdfErzeugen.mockClear();
  einsatzLageblattErzeugen.mockClear();
});

function rueckfrage(titel: string): HTMLElement {
  return document.querySelector<HTMLElement>(`dialog[aria-label='${titel}']`)!;
}

describe("R12-S1 Einsatz löschen mit angefangener Erfassung", () => {
  it("nennt die Erfassung in der Rückfrage, bleibt auf der Startseite und sagt kein „anderes Fenster“", async () => {
    einsatzImSpeicherAnlegen("Hochwasser Test", EinsatzArt.EINSATZ);
    const nutzer = userEvent.setup();
    render(<App />);
    await nutzer.click(screen.getByRole("button", { name: "Öffnen" }));
    await nutzer.click(await screen.findByRole("button", { name: "Einheit manuell erfassen…" }));
    await nutzer.type(screen.getByLabelText("Ort der Einheit (Pflicht)"), "Wilhelmshaven");
    await nutzer.click(screen.getByRole("button", { name: /‹ Einsatz „Hochwasser Test"/ }));
    expect(screen.getByText(/Angefangene Erfassung für diesen Einsatz/)).toBeDefined();

    await nutzer.click(screen.getByRole("button", { name: "Einsatz löschen…" }));
    const frage = await screen.findByRole("dialog", { name: "Einsatz löschen?" });
    expect(frage.textContent).toContain("angefangene Erfassung einer fremden Einheit „THW Wilhelmshaven\"");
    await nutzer.click(within(frage).getByRole("button", { name: "In den Papierkorb" }));

    // Startseite statt Aufnahmeformular; die Meldung nennt die Erfassung, kein anderes Fenster.
    const meldung = await screen.findByText(/in den Papierkorb gelegt\. Die angefangene Erfassung einer fremden Einheit „THW Wilhelmshaven"/);
    expect(meldung.textContent).not.toContain("anderen Fenster");
    expect(meldung.textContent).not.toContain("eigener Bogen");
    expect(screen.getByRole("heading", { name: "Digitaler Einheiten-Erfassungsbogen" })).toBeDefined();
    expect(screen.queryByLabelText("Ort der Einheit (Pflicht)")).toBeNull();
    expect(einsaetzePapierkorb().map((s) => s.name)).toEqual(["Hochwasser Test"]);
    // Der Entwurf geht nicht verloren.
    expect(localStorage.getItem("eeb.entwurf.v1")).toContain("Wilhelmshaven");
  }, 30000);

  it("ohne angefangene Erfassung bleibt die Rückfrage unverändert", async () => {
    einsatzImSpeicherAnlegen("Hochwasser Test", EinsatzArt.EINSATZ);
    const nutzer = userEvent.setup();
    render(<App />);
    await nutzer.click(screen.getByRole("button", { name: "Öffnen" }));
    await screen.findByRole("heading", { level: 1, name: "Hochwasser Test" });
    await nutzer.click(screen.getByRole("button", { name: "Einsatz löschen…" }));
    const frage = await screen.findByRole("dialog", { name: "Einsatz löschen?" });
    expect(frage.textContent).not.toContain("angefangene Erfassung");
    await nutzer.click(within(frage).getByRole("button", { name: "Abbrechen" }));
  }, 20000);
});

describe("R12-E5 leerer Einsatz", () => {
  it("„Einsatz weitergeben / sichern“ sagt, dass nichts zu sichern ist, und behauptet kein früheres Sammel-PDF", async () => {
    einsatzImSpeicherAnlegen("Hochwasser Leer", EinsatzArt.EINSATZ);
    const nutzer = userEvent.setup();
    render(<App />);
    await nutzer.click(screen.getByRole("button", { name: "Öffnen" }));
    await screen.findByRole("heading", { level: 1, name: "Hochwasser Leer" });
    await nutzer.click(screen.getByRole("button", { name: "Einsatz weitergeben / sichern" }));
    expect(await screen.findByText("Noch keine Einheit im Einsatz — nichts zu sichern.")).toBeDefined();
    expect(document.body.textContent).not.toContain("Seit dem letzten Sammel-PDF");
    expect(einsatzPdfErzeugen).not.toHaveBeenCalled();
  }, 20000);

  it("das Lageblatt entsteht, sagt aber, dass es keine Zeilen enthält", async () => {
    einsatzImSpeicherAnlegen("Hochwasser Leer", EinsatzArt.EINSATZ);
    const nutzer = userEvent.setup();
    render(<App />);
    await nutzer.click(screen.getByRole("button", { name: "Öffnen" }));
    await screen.findByRole("heading", { level: 1, name: "Hochwasser Leer" });
    await nutzer.click(screen.getByRole("button", { name: "Lageblatt (A4 quer)" }));
    await waitFor(() => expect(einsatzLageblattErzeugen).toHaveBeenCalledTimes(1));
    expect(await screen.findByText(/✓ Lageblatt erzeugt.*Noch keine Einheit im Einsatz — die Datei enthält keine Zeilen\./)).toBeDefined();
  }, 20000);

  it("mit Einheit meldet die Weitergabe weiter den Stand seit dem letzten Sammel-PDF nicht fälschlich leer", async () => {
    const s = einsatzImSpeicherAnlegen("Hochwasser Voll", EinsatzArt.EINSATZ);
    const b: Erfassungsbogen = neuerBogen();
    b.einheit.hierarchie[0]!.name = "Wardenburg";
    meldungHinzufuegen(s.id, b);
    const nutzer = userEvent.setup();
    render(<App />);
    await nutzer.click(screen.getByRole("button", { name: "Öffnen" }));
    await screen.findByRole("heading", { level: 1, name: "Hochwasser Voll" });
    expect(einsaetzeLaden()[0]!.eintraege).toHaveLength(1);
    await nutzer.click(screen.getByRole("button", { name: "Einsatz weitergeben / sichern" }));
    await waitFor(() => expect(einsatzPdfErzeugen).toHaveBeenCalledTimes(1));
    expect(document.body.textContent).not.toContain("Noch keine Einheit im Einsatz");
  }, 20000);
});

describe("R12-E2 Absenderkarte übernimmt keine unvollständige Adresse ohne Rückfrage", () => {
  function karte(onGespeichert = vi.fn()) {
    render(
      <>
        <AbsenderkarteFeld karte={{}} startOffen onGespeichert={onGespeichert} />
        <Dialogschicht />
      </>,
    );
    return onGespeichert;
  }

  it("fragt vor dem Übernehmen von „max@thw“; „Adresse prüfen“ übernimmt nichts, „Trotzdem übernehmen“ schon", async () => {
    const nutzer = userEvent.setup();
    const gespeichert = karte();
    await nutzer.type(screen.getByLabelText("Name"), "Max M");
    await nutzer.type(screen.getByLabelText("E-Mail"), "max@thw");
    expect(screen.getByText("Die E-Mail-Adresse sieht unvollständig aus.")).toBeDefined();

    await nutzer.click(screen.getByRole("button", { name: "Übernehmen" }));
    const frage = await screen.findByRole("dialog", { name: "E-Mail-Adresse übernehmen?" });
    expect(frage.textContent).toContain("„max@thw\" sieht unvollständig aus");
    await nutzer.click(within(frage).getByRole("button", { name: "Adresse prüfen" }));
    expect(gespeichert).not.toHaveBeenCalled();
    expect(absenderkarteLaden().email).toBeUndefined();

    await nutzer.click(screen.getByRole("button", { name: "Übernehmen" }));
    await nutzer.click(within(await screen.findByRole("dialog", { name: "E-Mail-Adresse übernehmen?" })).getByRole("button", { name: "Trotzdem übernehmen" }));
    expect(gespeichert).toHaveBeenCalledTimes(1);
    expect(absenderkarteLaden().email).toBe("max@thw");
  });

  it("eine plausible Adresse wird ohne Rückfrage übernommen", async () => {
    const nutzer = userEvent.setup();
    const gespeichert = karte();
    await nutzer.type(screen.getByLabelText("Name"), "Max M");
    await nutzer.type(screen.getByLabelText("E-Mail"), "max.mustermann@thw.de");
    await nutzer.click(screen.getByRole("button", { name: "Übernehmen" }));
    expect(gespeichert).toHaveBeenCalledTimes(1);
    expect(rueckfrage("E-Mail-Adresse übernehmen?")).toBeNull();
  });
});

describe("R12-E4 Eintreffzeit in der Einsatz-Sammlung", () => {
  it("fragt bei einer Eintreffzeit vor Aufnahme und Zeitraum nach; „Zeit korrigieren“ lässt den alten Wert stehen", async () => {
    const s = einsatzImSpeicherAnlegen("Hochwasser Zeit", EinsatzArt.EINSATZ);
    const b: Erfassungsbogen = neuerBogen();
    b.einheit.hierarchie[0]!.name = "Wardenburg";
    meldungHinzufuegen(s.id, b);
    const vorher = einsaetzeLaden()[0]!.eintraege[0]!.eingetroffenAm;
    const nutzer = userEvent.setup();
    render(<App />);
    await nutzer.click(screen.getByRole("button", { name: "Öffnen" }));
    await screen.findByRole("heading", { level: 1, name: "Hochwasser Zeit" });
    await nutzer.click(screen.getByRole("button", { name: "ändern" }));
    const feld = screen.getByLabelText("Eingetroffen am") as HTMLInputElement;
    const jahrVorher = new Date().getFullYear() - 1;
    await nutzer.clear(feld);
    await nutzer.type(feld, `${jahrVorher}-10-26T03:09`);
    await nutzer.click(screen.getByRole("button", { name: "Speichern" }));

    const frage = await screen.findByRole("dialog", { name: "Stimmt die Zeit?" });
    expect(frage.textContent).toMatch(/mehr als einen Tag vor der Aufnahme/);
    await nutzer.click(within(frage).getByRole("button", { name: "Zeit korrigieren" }));
    expect(einsaetzeLaden()[0]!.eintraege[0]!.eingetroffenAm).toBe(vorher);
    expect((screen.getByLabelText("Eingetroffen am") as HTMLInputElement).value).toBe(`${jahrVorher}-10-26T03:09`);
  }, 30000);
});
