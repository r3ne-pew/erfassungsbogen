/**
 * Runde 16, Block Zustand: Oberfläche — verworfene Tipps zeigen sich (D1).
 */
import { afterEach, describe, expect, it, vi } from "vitest";
import { act, cleanup, render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { DaumenQuittung, QUITTUNG_KOMPAKT_NACH_MS } from "./daumen-quittung";
import { PRELLSCHUTZ_MS, tippSchutzZuruecksetzen } from "./tipp-schutz";

afterEach(() => {
  cleanup();
  tippSchutzZuruecksetzen();
});

describe("R16-W1 Die Quittungsleiste schrumpft nach dem Lesen auf eine Zeile", () => {
  it("wird nach QUITTUNG_KOMPAKT_NACH_MS kompakt und behält „Rückgängig“ und „✕“", () => {
    vi.useFakeTimers();
    try {
      render(
        <DaumenQuittung onRueckgaengig={() => {}} onSchliessen={() => {}} mehrzeilig>
          Abgerückt 15:47: Nr. 2 „THW Albstadt"
        </DaumenQuittung>,
      );
      const leiste = screen.getByRole("status");
      expect(leiste.className).not.toContain("quittung-kompakt");
      act(() => {
        vi.advanceTimersByTime(QUITTUNG_KOMPAKT_NACH_MS - 1);
      });
      expect(leiste.className).not.toContain("quittung-kompakt");
      act(() => {
        vi.advanceTimersByTime(2);
      });
      expect(leiste.className).toContain("quittung-kompakt");
      expect(screen.getByRole("button", { name: "Rückgängig" })).toBeDefined();
      expect(screen.getByRole("button", { name: "Quittung schließen" })).toBeDefined();
    } finally {
      vi.useRealTimers();
    }
  });
});

describe("R16-D1 Ein Tipp auf „Rückgängig“ im Prellschutz verpufft nicht still", () => {
  it("zeigt „Einen Moment …“, löst nichts aus — und wirkt danach", async () => {
    const nutzer = userEvent.setup();
    const zurueck = vi.fn();
    const zu = vi.fn();
    render(
      <DaumenQuittung prellschutz onRueckgaengig={zurueck} onSchliessen={zu}>
        Zur Kenntnis genommen: 3 Einheiten
      </DaumenQuittung>,
    );
    const knopf = screen.getByRole("button", { name: "Rückgängig" });
    expect(PRELLSCHUTZ_MS).toBeGreaterThan(0);
    await nutzer.click(knopf);
    expect(zurueck).not.toHaveBeenCalled();
    // Sichtbar statt stumm: der Hinweis steht da, der Knopf trägt die gestrichelte Marke.
    const pille = document.getElementById("tipp-moment");
    expect(pille?.hidden).toBe(false);
    expect(pille?.textContent).toBe("Einen Moment …");
    expect(knopf.hasAttribute("data-tipp-gesperrt")).toBe(true);
    // Auch „Quittung schließen“ verwirft hörbar, nicht stumm.
    await nutzer.click(screen.getByRole("button", { name: "Quittung schließen" }));
    expect(zu).not.toHaveBeenCalled();

    await waitFor(() => expect(knopf.getAttribute("aria-disabled")).toBeNull(), { timeout: PRELLSCHUTZ_MS + 500 });
    await nutzer.click(knopf);
    expect(zurueck).toHaveBeenCalledTimes(1);
  });
});
