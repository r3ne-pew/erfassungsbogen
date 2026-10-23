/**
 * Audit Runde 4, R4-D1 / Runde 5, R5-D1, R5-O5: „Geräteuhr prüfen" erscheint
 * nur bei nicht bestätigter Geräteuhr, nennt beide Möglichkeiten und die Folgen
 * mit Zahlen und verlangt eine Antwort.
 */
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { EEB_EPOCHE_MS, MINUTEN_JE_TAG, jetztZeitpunkt } from "@bos/eeb-format/model";
import { uhrPruefungZuruecksetzen } from "./datenschutz-uhr";
import { Dialogschicht, dialogeZuruecksetzen } from "./dialoge";
import { UhrWarnung } from "./uhr-warnung";

beforeEach(() => {
  localStorage.clear();
  uhrPruefungZuruecksetzen();
});
afterEach(() => dialogeZuruecksetzen());

function tagText(z: number) {
  return new Date(EEB_EPOCHE_MS + z * 60_000).toLocaleDateString("de-DE", { timeZone: "UTC", day: "2-digit", month: "2-digit", year: "numeric" });
}

describe("UhrWarnung", () => {
  it("schweigt bei plausibler Uhr", () => {
    localStorage.setItem("eeb.uhr.v1", JSON.stringify({ zuletzt: jetztZeitpunkt() - 3 * MINUTEN_JE_TAG }));
    render(<UhrWarnung />);
    expect(screen.queryByRole("alert")).toBeNull();
  });

  it("schweigt nach echter Pause, wenn nichts fällig wird", () => {
    localStorage.setItem("eeb.uhr.v1", JSON.stringify({ zuletzt: jetztZeitpunkt() - 100 * MINUTEN_JE_TAG }));
    render(<UhrWarnung />);
    expect(screen.queryByRole("alert")).toBeNull();
  });

  it("warnt mit beiden Daten, wenn etwas fällig würde, und fragt statt zu behaupten, das Datum sei falsch", () => {
    const zuletzt = jetztZeitpunkt() - 365 * MINUTEN_JE_TAG;
    localStorage.setItem("eeb.uhr.v1", JSON.stringify({ zuletzt }));
    localStorage.setItem("eeb.einsaetze.v1", JSON.stringify([{ id: "a", name: "Alt", geaendert: Date.now() - 200 * 86_400_000, eintraege: [] }]));
    render(<UhrWarnung />);
    const w = screen.getByRole("alert");
    expect(w.textContent).toContain("Geräteuhr prüfen");
    expect(w.textContent).toContain("beim letzten Start war der " + tagText(zuletzt));
    expect(w.textContent).toContain("Stimmt das heutige Datum?");
    expect(w.textContent).toContain("löscht und anonymisiert die App nichts");
    expect(w.textContent).toContain("werden 1 Sammlung endgültig gelöscht");
    expect(screen.getByRole("button", { name: "Geräteuhr stimmt" })).toBeTruthy();
    expect(screen.getByRole("button", { name: "Uhr korrigieren" })).toBeTruthy();
  });

  // Audit Runde 6, R6-D3: Namen und letzte Änderung statt nur einer Zahl.
  it("nennt die betroffenen Sammlungen mit Namen und dem Alter ihrer letzten Änderung (R6-D3)", () => {
    const zuletzt = jetztZeitpunkt() - 365 * MINUTEN_JE_TAG;
    localStorage.setItem("eeb.uhr.v1", JSON.stringify({ zuletzt }));
    const zuletztMs = Date.now() - 365 * 86_400_000;
    localStorage.setItem(
      "eeb.einsaetze.v1",
      JSON.stringify([{ id: "a", name: "Hochwasser Test", geaendert: zuletztMs - 60 * 60_000, eintraege: [] }]),
    );
    render(<UhrWarnung />);
    const w = screen.getByRole("alert").textContent!;
    expect(w).toContain("„Hochwasser Test\" (vor 1 Stunde geändert)");
    expect(w).toContain("noch bearbeitet");
  });

  it("nennt bei zurückgestellter Uhr keine Löschfolgen und den Abstand in Tagen", () => {
    const zuletzt = jetztZeitpunkt() + 400 * MINUTEN_JE_TAG;
    localStorage.setItem("eeb.uhr.v1", JSON.stringify({ zuletzt }));
    render(<UhrWarnung />);
    const w = screen.getByRole("alert");
    expect(w.textContent).toContain("400 Tage danach");
    expect(w.textContent).not.toContain("endgültig gelöscht");
  });

  it("Geräteuhr stimmt: fragt mit den Folgen nach und bestätigt erst nach Ja", async () => {
    const zuletzt = jetztZeitpunkt() - 365 * MINUTEN_JE_TAG;
    localStorage.setItem("eeb.uhr.v1", JSON.stringify({ zuletzt }));
    localStorage.setItem("eeb.einsaetze.v1", JSON.stringify([{ id: "a", name: "Alt", geaendert: Date.now() - 200 * 86_400_000, eintraege: [] }]));
    const neuLaden = vi.fn();
    render(
      <>
        <UhrWarnung neuLaden={neuLaden} />
        <Dialogschicht />
      </>,
    );
    fireEvent.click(screen.getByRole("button", { name: "Geräteuhr stimmt" }));
    const ja = await screen.findByRole("button", { name: /Datum stimmt — löschen/ });
    expect(JSON.parse(localStorage.getItem("eeb.uhr.v1")!)).toEqual({ zuletzt });
    expect(neuLaden).not.toHaveBeenCalled();
    fireEvent.click(ja);
    await waitFor(() => expect(neuLaden).toHaveBeenCalled());
    expect(JSON.parse(localStorage.getItem("eeb.uhr.v1")!).zuletzt).toBeGreaterThan(zuletzt);
  });

  it("Uhr korrigieren erklärt den Weg und ändert nichts am Speicher", () => {
    const zuletzt = jetztZeitpunkt() - 365 * MINUTEN_JE_TAG;
    localStorage.setItem("eeb.uhr.v1", JSON.stringify({ zuletzt }));
    localStorage.setItem("eeb.einsaetze.v1", JSON.stringify([{ id: "a", name: "Alt", geaendert: Date.now() - 200 * 86_400_000, eintraege: [] }]));
    render(<UhrWarnung neuLaden={() => undefined} />);
    fireEvent.click(screen.getByRole("button", { name: "Uhr korrigieren" }));
    expect(screen.getByRole("alert").textContent).toContain("Geräteeinstellungen");
    expect(screen.getByRole("button", { name: "Neu prüfen" })).toBeTruthy();
    expect(JSON.parse(localStorage.getItem("eeb.uhr.v1")!)).toEqual({ zuletzt });
  });
});
