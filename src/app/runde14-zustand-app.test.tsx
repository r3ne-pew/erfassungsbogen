/**
 * Runde 14, Block Zustand: Verhalten der ganzen App — Auftrag/Zug bleiben beim Verlassen der Einsatzansicht sichtbar
 * (S1, Browser-Zurück: der Weg ist hier die Startseite), leerer Bogen ablegen (E7), Altersangaben der Startseite (O1).
 */
import { afterEach, describe, expect, it, vi } from "vitest";
import { cleanup, render, screen, waitFor, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { EinsatzArt, einsaetzeLaden, einsatzAnlegen as einsatzImSpeicherAnlegen, meldungHinzufuegen } from "@bos/meldekopf/einsaetze";
import { neuerBogen } from "./hilfen";

vi.mock("./pdf", () => ({
  pdfErzeugen: async () => {},
  pdfBlobUrl: async () => "blob:pdf-vorschau",
  einsatzPdfErzeugen: async () => true,
  einsatzLageblattErzeugen: async () => true,
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
  vi.restoreAllMocks();
  window.history.replaceState(null, "", window.location.pathname + window.location.search);
  localStorage.clear();
  sessionStorage.clear();
});

describe("R14-S1 Auftrag und Zug bleiben beim Verlassen der Einsatzansicht stehen", () => {
  it("der beim Verlassen gesicherte Text steht beim nächsten Öffnen in der Karte, nicht nur im Speicher", async () => {
    const s = einsatzImSpeicherAnlegen("Hochwasser Zurück", EinsatzArt.EINSATZ);
    const b = neuerBogen();
    b.einheit.hierarchie[0]!.name = "Albstadt";
    meldungHinzufuegen(s.id, b);
    const nutzer = userEvent.setup();
    render(<App />);
    await nutzer.click(screen.getByRole("button", { name: "Öffnen" }));
    await screen.findByRole("heading", { level: 1, name: "Hochwasser Zurück" });
    const karte = () => [...document.querySelectorAll<HTMLElement>(".einheit-zeile")].find((k) => k.textContent!.includes("Albstadt"))!;
    await nutzer.click(within(karte()).getByRole("button", { name: "Auftrag/Notiz" }));
    await nutzer.type(within(karte()).getByLabelText("Auftrag/Notiz"), "Pumpen am Deich Nord");
    // Nicht „Speichern“, nicht aus dem Feld tippen: wie die Zurück-Geste, die die Ansicht verlässt.
    await nutzer.click(screen.getByRole("button", { name: /‹ Startseite/ }));
    await screen.findByRole("button", { name: "Neue Einsatz-Sammlung…" });
    expect(einsaetzeLaden()[0]!.eintraege[0]!.notiz).toBe("Pumpen am Deich Nord");

    await nutzer.click(screen.getByRole("button", { name: "Öffnen" }));
    await screen.findByRole("heading", { level: 1, name: "Hochwasser Zurück" });
    await waitFor(() => expect(karte().textContent).toMatch(/Auftrag(\/Notiz)?: Pumpen am Deich Nord/));
  }, 30000);
});

describe("R14-E7 Leeren Bogen in die Sammlung ablegen", () => {
  it("fragt nach, nennt die offenen Punkte, und „Ort eintragen“ legt nichts ab", async () => {
    const einsatz = einsatzImSpeicherAnlegen("Sammelhausen", EinsatzArt.EINSATZ);
    const nutzer = userEvent.setup();
    render(<App />);
    await nutzer.click(screen.getByRole("button", { name: "Neuen Bogen erstellen" }));
    await nutzer.click(screen.getByRole("button", { name: /^6\. Übersicht/ }));
    await nutzer.click(screen.getByRole("button", { name: "In Einsatz-Sammlung ablegen…" }));
    const wahl = document.querySelector<HTMLDialogElement>("dialog[aria-label='In Einsatz-Sammlung ablegen']")!;
    await nutzer.click(within(wahl).getByRole("button", { name: "Sammelhausen" }));

    const frage = await screen.findByRole("dialog", { name: "Ort der Einheit fehlt" });
    expect(frage.textContent).toContain("Offene Punkte");
    expect(frage.textContent).toMatch(/Ort der Einheit fehlt|Stärke 0/);
    await nutzer.click(within(frage).getByRole("button", { name: /Ort eintragen/ }));
    expect(einsaetzeLaden().find((x) => x.id === einsatz.id)!.eintraege).toHaveLength(0);
  }, 30000);

  it("„Trotzdem ablegen“ legt ab (danach folgt die Rückfrage zur Stärke, wie bisher)", async () => {
    const einsatz = einsatzImSpeicherAnlegen("Sammelhausen", EinsatzArt.EINSATZ);
    const nutzer = userEvent.setup();
    render(<App />);
    await nutzer.click(screen.getByRole("button", { name: "Neuen Bogen erstellen" }));
    await nutzer.click(screen.getByRole("button", { name: /^6\. Übersicht/ }));
    await nutzer.click(screen.getByRole("button", { name: "In Einsatz-Sammlung ablegen…" }));
    const wahl = document.querySelector<HTMLDialogElement>("dialog[aria-label='In Einsatz-Sammlung ablegen']")!;
    await nutzer.click(within(wahl).getByRole("button", { name: "Sammelhausen" }));
    const frage = await screen.findByRole("dialog", { name: "Ort der Einheit fehlt" });
    await nutzer.click(within(frage).getByRole("button", { name: /Trotzdem ablegen/ }));
    await waitFor(() => expect(einsaetzeLaden().find((x) => x.id === einsatz.id)!.eintraege).toHaveLength(1));
  }, 30000);
});

describe("R14-O1 Startseite: Alter der letzten Meldung im Minutentakt", () => {
  it("die Knopfzeile der zuletzt offenen Sammlung rechnet nach einer Stunde Stillstand neu", async () => {
    vi.useFakeTimers({ toFake: ["setInterval", "clearInterval", "Date"] });
    try {
      vi.setSystemTime(new Date(2026, 9, 26, 9, 25, 0));
      const s = einsatzImSpeicherAnlegen("Hochwasser Alter", EinsatzArt.EINSATZ);
      const b = neuerBogen();
      b.einheit.hierarchie[0]!.name = "Albstadt";
      meldungHinzufuegen(s.id, b);
      render(<App />);
      const zeile = () => document.querySelector(".letzte-meldung")?.textContent ?? "";
      expect(zeile()).toContain("gerade eben");
      const { act } = await import("@testing-library/react");
      act(() => {
        vi.advanceTimersByTime(65 * 60_000);
      });
      expect(zeile()).toContain("älter als 1 Std");
    } finally {
      vi.useRealTimers();
    }
  });
});
