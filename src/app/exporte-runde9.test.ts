/**
 * Runde 9, Block Exporte: Sollstärke im Wort (R9-A2), Excel nach Nr. (R9-A2), Rückruf einer
 * Soll-Einheit gekennzeichnet (R9-A3), Umschrift in der Personenliste (R9-W3), Zug-Titel (R9-K4).
 */
import { describe, expect, it } from "vitest";
import {
  Ernaehrung,
  Fahrerlaubnis,
  OrganisationsTyp,
  PersonalErfassung,
  SCHEMA_VERSION,
  StaerkeRolle,
  type Erfassungsbogen,
  type Person,
} from "@bos/eeb-format/model";
import { MeldeStatus, bogenInhaltsId, einheitSchluessel, type Einsatzsammlung, type MeldeEintrag } from "@bos/meldekopf/einsaetze";
import { einsatzCsvInhalt } from "./einsatz-csv";
import { einsatzDetailCsvInhalt } from "./bogen-csv";
import { erreichbarkeitZeilen, namePapier, nichtDarstellbareBetroffene, nichtDarstellbareNamen, umschriftBetroffene } from "./pdf-dokument";
import { neuePerson } from "./hilfen";
import { einsatzOldenburgXlsx } from "./oldenburg-xlsx";
import { inflateRaw } from "pako";

function person(over: Partial<Person> = {}): Person {
  return {
    ...neuePerson(),
    vorname: "Hans",
    nachname: "Müller",
    staerkeRolle: StaerkeRolle.MANNSCHAFT,
    fahrerlaubnis: Fahrerlaubnis.NONE,
    ernaehrung: Ernaehrung.FLEISCH,
    ...over,
  };
}

function bogen(name: string, personal: Person[]): Erfassungsbogen {
  return {
    schemaVersion: SCHEMA_VERSION,
    stand: 100,
    einheit: { organisation: OrganisationsTyp.THW, einheitsTyp: { code: 1 }, hierarchie: [{ bezeichnung: { code: 1 }, name, telefon: "040419256910" }] },
    einsatz: { zeitraumVon: 100, zeitraumBis: 130, ortAuftrag: "Lage" },
    personalErfassung: PersonalErfassung.VOLLSTAENDIG,
    personal,
    fahrzeuge: [{ typ: { code: 2 }, kennzeichen: "", funkrufname: { kennwort: { code: 1 }, eigenerStandort: false, ort: "Norderstedt", teile: [22, 51] } }],
  };
}

function meldung(b: Erfassungsbogen, empfangen: number): MeldeEintrag {
  return { id: bogenInhaltsId(b), einheitSchluessel: einheitSchluessel(b.einheit), empfangenAm: empfangen, quelle: "scan", status: MeldeStatus.ANWESEND, bogen: b };
}

const soll = () => bogen("Zulauf Soll", [neuePerson(), neuePerson(), neuePerson()]);
const gemeldet = () => bogen("Ahlen", [person(), person()]);

function sammlung(eintraege: MeldeEintrag[]): Einsatzsammlung {
  return { id: "e1", name: "Testlage", art: 0, angelegt: 0, geaendert: 0, eintraege };
}

describe("Sollstärke im Wort (R9-A2)", () => {
  it("Übersicht-CSV: Marke in der Zeile und Anteil in der Summenzeile", () => {
    const csv = einsatzCsvInhalt(sammlung([meldung(gemeldet(), 1000), meldung(soll(), 2000)]));
    expect(csv).toContain("Sollstärke, nicht gemeldet");
    expect(csv).toMatch(/Summe \(2 Einheiten, davon 3 Personen Sollstärke, nicht gemeldet\)/);
  });
  it("Übersicht-CSV ohne Sollstärke bleibt ohne das Wort", () => {
    const csv = einsatzCsvInhalt(sammlung([meldung(gemeldet(), 1000)]));
    expect(csv).not.toContain("Sollstärke");
  });
  it("„Alle Daten“-CSV trägt es in der Spalte Personalerfassung", () => {
    const csv = einsatzDetailCsvInhalt(sammlung([meldung(soll(), 2000)]));
    expect(csv).toContain("Sollstärke, nicht gemeldet");
  });
});

/** Zellen der Excel-Datei grob: alle Texte der sharedStrings/inline-Strings. */
function xlsxText(bytes: Uint8Array): string {
  // ZIP lokale Header durchlaufen und jede deflate-Datei auspacken.
  const dv = new DataView(bytes.buffer, bytes.byteOffset, bytes.byteLength);
  let out = "";
  let i = 0;
  while (i + 30 < bytes.length && dv.getUint32(i, true) === 0x04034b50) {
    const methode = dv.getUint16(i + 8, true);
    const csize = dv.getUint32(i + 18, true);
    const nl = dv.getUint16(i + 26, true);
    const el = dv.getUint16(i + 28, true);
    const start = i + 30 + nl + el;
    const daten = bytes.subarray(start, start + csize);
    out += methode === 8 ? new TextDecoder().decode(inflateRaw(daten)) : new TextDecoder().decode(daten);
    i = start + csize;
  }
  return out;
}

describe("Excel-Liste nach Nr. (R9-A2)", () => {
  it("führt die Nr. und die Sollstärke in der Bemerkung und sortiert nach Nr. statt nach Name", () => {
    // Nr. 1 = früher eingegangen, aber nach dem Namen käme „Zulauf“ zuletzt: „Ahlen“ ist Nr. 2.
    const spaeter = meldung(gemeldet(), 5000);
    const frueher = meldung(soll(), 1000);
    const text = xlsxText(einsatzOldenburgXlsx(sammlung([spaeter, frueher])));
    expect(text).toContain("Nr. 1");
    expect(text).toContain("Nr. 2");
    expect(text).toContain("Sollstärke, nicht gemeldet");
    expect(text.indexOf("Nr. 1")).toBeLessThan(text.indexOf("Nr. 2"));
  });
});

describe("Rückruf einer Soll-Einheit (R9-A3)", () => {
  it("kennzeichnet Funkrufname und OV-Nummer als Vorbelegung", () => {
    const z = erreichbarkeitZeilen(soll());
    expect(z.join(" ")).toMatch(/Vorbelegung/);
  });
  it("lässt gemeldete Einheiten unverändert", () => {
    const z = erreichbarkeitZeilen(gemeldet());
    expect(z.join(" ")).not.toMatch(/Vorbelegung/);
  });
});

describe("Umschrift in der Personenliste (R9-W3)", () => {
  it("namePapier schreibt kyrillische Namen um und vermerkt es, lässt Lateinisches stehen", () => {
    expect(namePapier("Иванова", "Мария")).toBe("Ivanova, Marija (Umschrift)");
    expect(namePapier("Müller", "Hans")).toBe("Müller, Hans");
  });
  it("zählt eine Person einmal und nennt Umschrift getrennt von Nicht-Druckbarem", () => {
    const b = gemeldet();
    b.personal = [person({ vorname: "Мария", nachname: "Иванова" }), person({ vorname: "محمد", nachname: "Ali" })];
    expect(nichtDarstellbareNamen(b)).toBe(1);
    expect(nichtDarstellbareBetroffene(b)).toHaveLength(1);
    expect(umschriftBetroffene(b)).toEqual(["Мария Иванова → Marija Ivanova (Ansprechperson)"]);
  });
});
