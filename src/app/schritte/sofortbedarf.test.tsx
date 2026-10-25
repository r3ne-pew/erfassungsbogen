/**
 * Schritt 5 — Sofortbedarf: die Vorbelegung der Verpflegung aus der Stärke
 * und der Betriebsstoff-Plausibilitätshinweis an Ort und Stelle.
 */

import { describe, it, expect, vi } from "vitest";
import { fireEvent, render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { SchrittBuehne } from "../../test/schritt-buehne";
import { neuePerson, neuerBogen } from "../hilfen";
import { SchrittSofortbedarf } from "./sofortbedarf";

describe("Schritt Sofortbedarf", () => {
  it("nennt vor dem Anhaken die vier Bereiche und blendet den Satz danach aus (R4-N6)", async () => {
    const nutzer = userEvent.setup();
    render(<SchrittBuehne komponente={SchrittSofortbedarf} />);
    const satz = /Verpflegung, Betriebsstoff \(Diesel, Benzin, Gemisch\), Unterbringung, Ruhezeit/;
    expect(screen.getByText(satz)).toBeDefined();
    await nutzer.click(screen.getByLabelText("Sofortbedarf erfassen"));
    expect(screen.queryByText(satz)).toBeNull();
  });

  it("belegt die Verpflegung mit der Stärke vor und sagt das dazu", async () => {
    const nutzer = userEvent.setup();
    render(<SchrittBuehne komponente={SchrittSofortbedarf} bogen={{ ...neuerBogen(), personal: [neuePerson(), neuePerson(), neuePerson()] }} />);

    await nutzer.click(screen.getByLabelText("Sofortbedarf erfassen"));

    expect((screen.getByLabelText("Verpflegung (Personen)") as HTMLInputElement).value).toBe("3");
    expect(screen.getByText(/Verpflegung ist aus der Stärke vorbelegt und zieht mit ihr mit/)).toBeDefined();
  });

  // Rückmeldung aus der Erprobung: ein geleertes Zahlenfeld sprang auf „0" zurück, neu tippen ergab „07".
  it("lässt ein Zahlenfeld leer, solange man es leert und neu tippt", async () => {
    const nutzer = userEvent.setup();
    render(<SchrittBuehne komponente={SchrittSofortbedarf} />);
    await nutzer.click(screen.getByLabelText("Sofortbedarf erfassen"));
    const diesel = screen.getByLabelText("Diesel (l)") as HTMLInputElement;
    await nutzer.clear(diesel);
    await nutzer.type(diesel, "70");
    expect(diesel.value).toBe("70");
    await nutzer.clear(diesel);
    expect(diesel.value).toBe("");
    await nutzer.tab();
    expect(diesel.value).toBe("0");
  });

  // Audit Runde 10, R10-N2/S5/N4
  it("liest „20 l“ als 20 und sagt es; Einheit „500l“ und „20 Liter“ gehen ebenso (R10-N2)", async () => {
    const nutzer = userEvent.setup();
    render(<SchrittBuehne komponente={SchrittSofortbedarf} />);
    await nutzer.click(screen.getByLabelText("Sofortbedarf erfassen"));
    const gemisch = screen.getByLabelText("Gemisch (l)") as HTMLInputElement;
    await nutzer.type(gemisch, "20 l");
    expect(screen.getByText(/„20 l“ gelesen als 20/)).toBeDefined();
    expect(screen.queryByText(/nicht übernommen/)).toBeNull();
    await nutzer.tab();
    expect(gemisch.value).toBe("20");
    await nutzer.clear(gemisch);
    await nutzer.type(gemisch, "500l");
    await nutzer.tab();
    expect(gemisch.value).toBe("500");
  });

  it("begrenzt Liter auf 99999 und sagt es (R10-S5)", async () => {
    const nutzer = userEvent.setup();
    render(<SchrittBuehne komponente={SchrittSofortbedarf} />);
    await nutzer.click(screen.getByLabelText("Sofortbedarf erfassen"));
    const benzin = screen.getByLabelText("Benzin (l)") as HTMLInputElement;
    fireEvent.change(benzin, { target: { value: "99999999999" } });
    expect(benzin.value).toBe("99999");
    expect(screen.getByText(/Höchstens 99999/)).toBeDefined();
  });

  it("nennt, dass ein geleertes Verpflegungsfeld 0 bedeutet (R10-N4)", async () => {
    const nutzer = userEvent.setup();
    render(<SchrittBuehne komponente={SchrittSofortbedarf} bogen={{ ...neuerBogen(), personal: [neuePerson(), neuePerson(), neuePerson()] }} />);
    await nutzer.click(screen.getByLabelText("Sofortbedarf erfassen"));
    await nutzer.clear(screen.getByLabelText("Verpflegung (Personen)"));
    expect(screen.getByText(/Leer gilt als 0 — keine Verpflegung angefordert. Wie die Stärke wären 3/)).toBeDefined();
  });

  // Audit Runde 9, R9-E1: Komma und Minus verschwinden nicht mehr still.
  it("lehnt ein Minus ab und sagt es, der Wert davor bleibt (R9-E1)", async () => {
    const nutzer = userEvent.setup();
    render(<SchrittBuehne komponente={SchrittSofortbedarf} />);
    await nutzer.click(screen.getByLabelText("Sofortbedarf erfassen"));
    const benzin = screen.getByLabelText("Benzin (l)") as HTMLInputElement;
    await nutzer.type(benzin, "40");
    fireEvent.change(benzin, { target: { value: "-40" } });
    expect(benzin.value).toBe("-40"); // sichtbar, nicht still zu 40 oder 0 umgeschrieben
    expect(benzin.getAttribute("aria-invalid")).toBe("true");
    expect(screen.getByText(/Minus geht nicht — „-40“ wurde nicht übernommen/)).toBeDefined();
    fireEvent.blur(benzin);
    expect(benzin.value).toBe("40"); // gespeichert ist weiter 40
    await nutzer.clear(benzin);
    await nutzer.type(benzin, "35");
    expect(screen.queryByText(/Minus geht nicht/)).toBeNull();
  });

  it("rundet ein Komma und nennt die gerundete Zahl (R9-E1)", async () => {
    const nutzer = userEvent.setup();
    render(<SchrittBuehne komponente={SchrittSofortbedarf} />);
    await nutzer.click(screen.getByLabelText("Sofortbedarf erfassen"));
    const gemisch = screen.getByLabelText("Gemisch (l)") as HTMLInputElement;
    await nutzer.clear(gemisch);
    await nutzer.type(gemisch, "1,5");
    expect(screen.getByText(/„1,5“ auf ganze Liter gerundet: 2/)).toBeDefined();
    fireEvent.blur(gemisch);
    expect(gemisch.value).toBe("2");
    const verpflegung = screen.getByLabelText("Verpflegung (Personen)") as HTMLInputElement;
    await nutzer.clear(verpflegung);
    await nutzer.type(verpflegung, "38.5");
    expect(screen.getByText(/„38.5“ auf ganze Personen gerundet: 39/)).toBeDefined();
  });

  it("lässt nach dem Leeren keine stehengebliebene 0 vor der nächsten Ziffer (R9-E1)", async () => {
    const nutzer = userEvent.setup();
    render(<SchrittBuehne komponente={SchrittSofortbedarf} />);
    await nutzer.click(screen.getByLabelText("Sofortbedarf erfassen"));
    const diesel = screen.getByLabelText("Diesel (l)") as HTMLInputElement;
    await nutzer.clear(diesel);
    expect(diesel.value).toBe("");
    await nutzer.type(diesel, "5");
    expect(diesel.value).toBe("5");
  });

  it("hat Ziffernblock und „Weiter“-Taste (R9-G6)", async () => {
    const nutzer = userEvent.setup();
    render(<SchrittBuehne komponente={SchrittSofortbedarf} />);
    await nutzer.click(screen.getByLabelText("Sofortbedarf erfassen"));
    for (const name of ["Verpflegung (Personen)", "Diesel (l)", "Benzin (l)", "Gemisch (l)"]) {
      const f = screen.getByLabelText(name);
      expect(f.getAttribute("inputmode")).toBe("numeric");
      expect(f.getAttribute("enterkeyhint")).toBe("next");
    }
  });

  // R9-D1: Das Ausschalten verwirft Zahlen und Haken dahinter nicht ohne Rückfrage.
  it("fragt beim Ausschalten, wenn Angaben dahinterstehen, und behält sie bei „Behalten“ (R9-D1)", async () => {
    const nutzer = userEvent.setup();
    render(<SchrittBuehne komponente={SchrittSofortbedarf} />);
    await nutzer.click(screen.getByLabelText("Sofortbedarf erfassen"));
    const diesel = screen.getByLabelText("Diesel (l)") as HTMLInputElement;
    await nutzer.clear(diesel);
    await nutzer.type(diesel, "620");
    await nutzer.click(screen.getByLabelText("Unterbringung"));
    await nutzer.click(screen.getByLabelText("Sofortbedarf erfassen"));
    const dialog = await vi.waitFor(() => {
      const d = document.querySelector<HTMLDialogElement>("dialog[aria-label='Sofortbedarf entfernen?'][open]");
      if (!d) throw new Error("keine Rückfrage");
      return d;
    });
    expect(dialog.textContent).toContain("Diesel 620 l");
    expect(dialog.textContent).toContain("Unterbringung");
    expect(document.activeElement?.textContent).toBe("Behalten"); // Fokus auf der Wahl, die nichts ändert
    await nutzer.click(within(dialog).getByRole("button", { name: "Behalten" }));
    expect((screen.getByLabelText("Sofortbedarf erfassen") as HTMLInputElement).checked).toBe(true);
    expect((screen.getByLabelText("Diesel (l)") as HTMLInputElement).value).toBe("620");
  });

  it("schaltet ohne Rückfrage aus, solange nichts Eigenes dahintersteht", async () => {
    const nutzer = userEvent.setup();
    render(<SchrittBuehne komponente={SchrittSofortbedarf} />);
    await nutzer.click(screen.getByLabelText("Sofortbedarf erfassen"));
    await nutzer.click(screen.getByLabelText("Sofortbedarf erfassen"));
    expect((screen.getByLabelText("Sofortbedarf erfassen") as HTMLInputElement).checked).toBe(false);
  });

  /** „Diesel 99 999 l" fiel vorher erst in der Übersicht auf — wenn überhaupt. */
  it("stutzt bei Betriebsstoff über 1000 l je Fahrzeug, nicht sperrend", async () => {
    const nutzer = userEvent.setup();
    render(<SchrittBuehne komponente={SchrittSofortbedarf} bogen={{ ...neuerBogen(), fahrzeuge: [{ typ: { code: 1 } }, { typ: { code: 1 } }] }} />);
    await nutzer.click(screen.getByLabelText("Sofortbedarf erfassen"));

    const diesel = screen.getByLabelText("Diesel (l)") as HTMLInputElement;
    await nutzer.type(diesel, "1500");
    expect(screen.queryByText(/mehr als 1.000 l je Fahrzeug/)).toBeNull(); // 2 Fahrzeuge → bis 2000 l unauffällig

    await nutzer.clear(diesel);
    await nutzer.type(diesel, "99999");

    expect(screen.getByText(/99\.999 l Diesel für 2 Fahrzeuge — mehr als 1\.000 l je Fahrzeug/)).toBeDefined();
    expect(diesel.value).toBe("99999"); // nicht gesperrt, nicht gekappt
  });
});
