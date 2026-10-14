/** Audit Runde 5, R5-O1/R5-S4: feste Warnleiste, kurz, mit Einzelheiten hinter einem Tipp. */
import { afterEach, describe, expect, it } from "vitest";
import { fireEvent, render, screen } from "@testing-library/react";
import { FesteWarnung, KNAPPE_BILDHOEHE } from "./feste-warnung";

afterEach(() => {
  document.documentElement.style.removeProperty("--fest-warnung-hoehe");
});

describe("FesteWarnung", () => {
  it("zeigt den Kurztext und klappt die Einzelheiten erst auf Tipp auf", () => {
    render(<FesteWarnung klasse="speicher-fehler" kurz="⚠ Nicht gespeichert." details={<p>Papierkorb leeren.</p>} />);
    expect(screen.getByRole("alert").textContent).toContain("Nicht gespeichert");
    expect(screen.queryByText("Papierkorb leeren.")).toBeNull();
    fireEvent.click(screen.getByRole("button", { name: "Was tun?" }));
    expect(screen.getByText("Papierkorb leeren.")).toBeTruthy();
    fireEvent.click(screen.getByRole("button", { name: "Weniger" }));
    expect(screen.queryByText("Papierkorb leeren.")).toBeNull();
  });

  it("zeigt Entscheidungsknöpfe gleich, wenn das Bild nicht knapp ist, und klappt sie bei knappem Bild ein", () => {
    const hoehe = window.innerHeight;
    Object.defineProperty(window, "innerHeight", { configurable: true, value: 360 });
    const { unmount } = render(<FesteWarnung klasse="x" offenAnfangs kurz="Entscheiden" aktionen={<button type="button">Laden</button>} />);
    // knappes Bild (Tastatur): eingeklappt, nur eine Zeile
    expect(screen.queryByRole("button", { name: "Laden" })).toBeNull();
    expect(screen.getByRole("button", { name: "Entscheiden" })).toBeTruthy();
    unmount();
    Object.defineProperty(window, "innerHeight", { configurable: true, value: Math.max(hoehe, KNAPPE_BILDHOEHE + 100) });
    render(<FesteWarnung klasse="x" offenAnfangs kurz="Entscheiden" aktionen={<button type="button">Laden</button>} />);
    expect(screen.getByRole("button", { name: "Laden" })).toBeTruthy();
    Object.defineProperty(window, "innerHeight", { configurable: true, value: hoehe });
  });

  it("meldet ihre Höhe an die Seite und nimmt sie beim Abräumen zurück", () => {
    const { unmount } = render(<FesteWarnung klasse="x" kurz="Hallo" />);
    expect(document.documentElement.style.getPropertyValue("--fest-warnung-hoehe")).toMatch(/^\d+px$/);
    unmount();
    expect(document.documentElement.style.getPropertyValue("--fest-warnung-hoehe")).toBe("");
  });
});
