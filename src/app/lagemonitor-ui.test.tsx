import { describe, it, expect, afterEach, beforeEach } from "vitest";
import { cleanup, render, screen } from "@testing-library/react";
import { EinsatzArt, einsatzAnlegen, meldungHinzufuegen } from "@bos/meldekopf/einsaetze";
import { neuerBogen } from "./hilfen";
import { Lagemonitor, lagemonitorKennung } from "./lagemonitor-ui";
import { einsatzbeginnLaden, einsatzbeginnSetzen, BEGINN_SCHLUESSEL } from "./lagemonitor-beginn";

describe("lagemonitorKennung", () => {
  it("liest die Einsatz-Kennung aus der Adresse", () => {
    expect(lagemonitorKennung("?lagemonitor=abc")).toBe("abc");
    expect(lagemonitorKennung("")).toBeNull();
    expect(lagemonitorKennung("?lagemonitor=")).toBeNull();
  });
});

describe("Lagemonitor", () => {
  beforeEach(() => localStorage.clear());
  afterEach(cleanup);

  it("meldet einen unbekannten Einsatz, statt leer zu bleiben", () => {
    render(<Lagemonitor einsatzId="gibt-es-nicht" />);
    expect(screen.getByText(/nicht \(mehr\) vorhanden/)).toBeTruthy();
  });

  it("zeigt Summen und Einheitsnamen, ohne Beginn den Hinweis darauf", () => {
    const e = einsatzAnlegen("Hochwasser Süd", EinsatzArt.EINSATZ);
    const b = neuerBogen();
    b.einheit.hierarchie[0]!.name = "OV Musterstadt";
    meldungHinzufuegen(e.id, b);
    render(<Lagemonitor einsatzId={e.id} />);
    expect(screen.getByRole("heading", { name: "Hochwasser Süd" })).toBeTruthy();
    expect(screen.getByText("Einsatzbeginn nicht gesetzt")).toBeTruthy();
    expect(screen.getAllByText(/OV Musterstadt/).length).toBeGreaterThan(0);
  });

  it("zeigt die Einsatzdauer, sobald ein Beginn gesetzt ist", () => {
    const e = einsatzAnlegen("Übungstag", EinsatzArt.UEBUNG);
    einsatzbeginnSetzen(e.id, Date.now() - 95 * 60_000, [e.id]);
    render(<Lagemonitor einsatzId={e.id} />);
    expect(screen.getByText(/1 Stunde, 3\d Minuten/)).toBeTruthy();
  });
});

describe("einsatzbeginn speichern", () => {
  beforeEach(() => localStorage.clear());

  it("merkt den Beginn je Einsatz und entfernt ihn wieder", () => {
    expect(einsatzbeginnLaden("a")).toBeNull();
    expect(einsatzbeginnSetzen("a", 1000, ["a", "b"])).toBe(true);
    expect(einsatzbeginnSetzen("b", 2000, ["a", "b"])).toBe(true);
    expect(einsatzbeginnLaden("a")).toBe(1000);
    expect(einsatzbeginnLaden("b")).toBe(2000);
    einsatzbeginnSetzen("a", null, ["a", "b"]);
    expect(einsatzbeginnLaden("a")).toBeNull();
    expect(einsatzbeginnLaden("b")).toBe(2000);
  });

  it("räumt Einträge zu verschwundenen Einsätzen beim Schreiben ab", () => {
    einsatzbeginnSetzen("alt", 1, ["alt"]);
    einsatzbeginnSetzen("neu", 2, ["neu"]);
    expect(einsatzbeginnLaden("alt")).toBeNull();
    einsatzbeginnSetzen("neu", null, ["neu"]);
    expect(localStorage.getItem(BEGINN_SCHLUESSEL)).toBeNull();
  });

  it("übersteht beschädigten Speicher", () => {
    localStorage.setItem(BEGINN_SCHLUESSEL, "{kaputt");
    expect(einsatzbeginnLaden("a")).toBeNull();
    localStorage.setItem(BEGINN_SCHLUESSEL, JSON.stringify({ a: "x", b: 5 }));
    expect(einsatzbeginnLaden("a")).toBeNull();
    expect(einsatzbeginnLaden("b")).toBe(5);
  });
});
