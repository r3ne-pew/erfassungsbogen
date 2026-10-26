/**
 * Runde 11 (Handschuh, Aufnahme, Quittung): Verhalten, das jsdom prüfen kann — Eingabetaste, Fokus, Markup.
 */
import { afterEach, describe, expect, it } from "vitest";
import { cleanup, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { useState } from "react";
import { PersonalErfassung } from "@bos/eeb-format/model";
import { MeldeStatus, type MeldeEintrag } from "@bos/meldekopf/einsaetze";
import { AufteilenPanel } from "./aufteilen-ui";
import { DaumenQuittung } from "./daumen-quittung";
import { EintreffzeitFeld } from "./nacherfassung";
import { neuePerson, neuerBogen } from "./hilfen";
import { VorschlagFeld } from "./schritte/bausteine";
import { SchrittEinheit } from "./schritte/einheit";

afterEach(cleanup);

function Reihe({ imFluss = false }: { imFluss?: boolean }) {
  const [wert, setWert] = useState("");
  return (
    <div className="schritt-inhalt">
      <VorschlagFeld
        wert={wert}
        beschriftung="Ort"
        treffer={[]}
        schluessel={(t: string) => t}
        zeile={(t: string) => t}
        tippen={setWert}
        waehlen={() => {}}
        bestaetigen={setWert}
        imFluss={imFluss}
      />
      <input aria-label="Kürzel" />
    </div>
  );
}

describe("Eingabetaste in Vorschlagsfeldern (R11-G1)", () => {
  it("„Weiter“ führt zum nächsten Feld, die Taste trägt enterkeyhint", async () => {
    const nutzer = userEvent.setup();
    render(<Reihe />);
    const ort = screen.getByRole("combobox", { name: "Ort" });
    expect(ort.getAttribute("enterkeyhint")).toBe("next");
    await nutzer.type(ort, "Albstadt{Enter}");
    expect(document.activeElement).toBe(screen.getByLabelText("Kürzel"));
    expect((ort as HTMLInputElement).value).toBe("Albstadt");
  });
  it("Chip-Felder (imFluss) behalten den Fokus für den nächsten Eintrag", async () => {
    const nutzer = userEvent.setup();
    render(<Reihe imFluss />);
    const ort = screen.getByRole("combobox", { name: "Ort" });
    await nutzer.type(ort, "x{Enter}");
    expect(document.activeElement).toBe(ort);
  });
});

function eintrag(): MeldeEintrag {
  const bogen = neuerBogen();
  bogen.personal = [{ ...neuePerson(), vorname: "Anna", nachname: "Beck" }];
  bogen.personalErfassung = PersonalErfassung.VOLLSTAENDIG;
  return { id: "e1", bogen, status: MeldeStatus.ANWESEND } as unknown as MeldeEintrag;
}

describe("„Aufteilen…“ (R11-G2)", () => {
  it("setzt den Fokus nicht ins Textfeld (keine Tastatur vor der Personenliste)", () => {
    render(<AufteilenPanel eintrag={eintrag()} onAbbrechen={() => {}} onAufteilen={() => {}} />);
    const feld = screen.getByLabelText("Bezeichnung des abgeteilten Teils");
    expect(document.activeElement).not.toBe(feld);
    expect(document.activeElement?.tagName).toBe("H4");
  });
});

describe("Aufnahme (R11-M1)", () => {
  it("die Zettelfelder stehen in einem zugeklappten Aufklapper, solange nichts eingetragen ist", () => {
    render(<EintreffzeitFeld wert="" onAendern={() => {}} nummer="" onNummer={() => {}} zug="" onZug={() => {}} />);
    const d = document.querySelector<HTMLDetailsElement>("details.zettel-angaben")!;
    expect(d.open).toBe(false);
    expect(d.querySelector("summary")?.textContent).toMatch(/Angaben vom Zettel \(optional\)/);
    expect(d.contains(screen.getByLabelText(/Eingetroffen um/))).toBe(true);
  });
  it("ist etwas eingetragen, steht er offen", () => {
    render(<EintreffzeitFeld wert="08:15" onAendern={() => {}} />);
    expect(document.querySelector<HTMLDetailsElement>("details.zettel-angaben")!.open).toBe(true);
  });
  it("„Ort der Einheit“ bekommt beim Öffnen den Fokus, solange er leer ist", () => {
    render(<SchrittEinheit bogen={neuerBogen()} aendern={() => {}} ortFokus />);
    expect(document.activeElement?.id).toBe("feld-einheit-name");
  });
  it("ohne ortFokus bleibt der Fokus unberührt", () => {
    render(<SchrittEinheit bogen={neuerBogen()} aendern={() => {}} />);
    expect(document.activeElement?.id).not.toBe("feld-einheit-name");
  });
});

describe("Quittung (R11-M3)", () => {
  it("mehrzeilig trägt die Klasse für vier Zeilen", () => {
    render(<DaumenQuittung mehrzeilig onSchliessen={() => {}}>Abgerückt 16:34</DaumenQuittung>);
    expect(document.querySelector(".quittung-daumen")?.classList.contains("quittung-mehrzeilig")).toBe(true);
  });
  it("ohne Angabe bleibt es bei zwei Zeilen", () => {
    render(<DaumenQuittung onSchliessen={() => {}}>Abgerückt 16:34</DaumenQuittung>);
    expect(document.querySelector(".quittung-daumen")?.classList.contains("quittung-mehrzeilig")).toBe(false);
  });
});
