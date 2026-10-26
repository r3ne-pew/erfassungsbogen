/**
 * Runde 14, Block Inhalte: Lageblatt gesetzt (pdfmake in Node, pdftotext) — R14-K2, R14-W1, R14-A1 bis A3, R14-K4.
 */
import { describe, expect, it, vi } from "vitest";

vi.mock("./nativ", () => ({ istNativ: () => false, textTeilen: async () => {}, binaerTeilen: async () => {} }));

import { execFileSync } from "node:child_process";
import { mkdtempSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { KontaktArt, PersonalErfassung, StaerkeRolle, jetztZeitpunkt } from "@bos/eeb-format/model";
import { pdfBytes, seitenZahl } from "../../scripts/pdf-in-node";
import { neuePerson, neuerBogen } from "./hilfen";
import { einsatzLageblattDokument, type UebersichtEintrag } from "./pdf-dokument";

const erstellt = new Date("2026-10-04T19:16").getTime();
const eingetroffen = new Date("2026-10-04T18:24").getTime();

const hatPdftotext = (() => {
  try {
    execFileSync("pdftotext", ["-v"], { stdio: "ignore" });
    return true;
  } catch {
    return false;
  }
})();

async function seitenTexte(dd: Parameters<typeof pdfBytes>[0]): Promise<string[]> {
  const dir = mkdtempSync(join(tmpdir(), "r14-"));
  try {
    const datei = join(dir, "x.pdf");
    writeFileSync(datei, await pdfBytes(dd));
    const n = seitenZahl(readFileSync(datei));
    const out: string[] = [];
    for (let s = 1; s <= n; s++) out.push(execFileSync("pdftotext", ["-f", String(s), "-l", String(s), "-layout", datei, "-"], { encoding: "utf8" }));
    return out;
  } finally {
    rmSync(dir, { recursive: true, force: true });
  }
}

function einheit(i: number, over: Partial<UebersichtEintrag> = {}): UebersichtEintrag {
  const b = neuerBogen();
  b.einheit.hierarchie[0]!.name = `Ortsverband ${i + 1} Fachgruppe Schwere Bergung`;
  b.personal = Array.from({ length: 3 + (i % 5) }, (_, k) => ({ ...neuePerson(), vorname: `V${k}`, nachname: `N${i}x${k}` }));
  b.sonstiges = i % 2 ? "Sitzplätze fehlen, Gemisch 10 l, Hänger in Instandsetzung" : undefined;
  return { bogen: b, zugEtikett: `${1 + (i % 3)}. Zug`, eingetroffenAm: eingetroffen, nummer: i + 1, ...over };
}

const norm = (seiten: string[]) => seiten.join("\n").replace(/\s+/g, " ");

function schnellEintrag(i: number): UebersichtEintrag {
  const e = einheit(i);
  e.bogen.personalErfassung = PersonalErfassung.NUR_STAERKE;
  e.bogen.personal = [];
  e.bogen.fahrzeuge = [];
  e.bogen.sofortbedarf = undefined;
  e.bogen.staerkeManuell = { fuehrer: 0, unterfuehrer: 3, mannschaft: 8, gesamt: 11 };
  return e;
}

describe("R14-W1/K4 Lageblatt: Bedarf nicht erfasst statt „keine“; nur gemeldete Kraftstoffsorten", () => {
  it.skipIf(!hatPdftotext)("Kopfzeile und Zeile unterscheiden „keine“ von „nicht erfasst“, Benzin 0 l entfällt", async () => {
    const voll = einheit(0);
    voll.bogen.sofortbedarf = { verpflegungPersonen: 3, dieselLiter: 50, benzinLiter: 0, gemischLiter: 0, unterbringung: false, ruhezeitErforderlich: false };
    const t = norm(await seitenTexte(einsatzLageblattDokument("Lage", [voll, schnellEintrag(1)], erstellt, 0)));
    expect(t).toContain("keine Unterbringung angefordert (bei 1 Einheit nicht erfasst)");
    expect(t).toContain("keine Ruhezeit (bei 1 Einheit nicht erfasst)");
    expect(t).toContain("Diesel 50 l (bei 1 Einheit nicht erfasst)");
    expect(t).not.toContain("Benzin 0 l");
    // In der Zeile bricht die schmale Spalte um („Bedarf nicht / erfasst“).
    expect(t).toMatch(/Bedarf nicht .*erfasst/);
  }, 60_000);

  it.skipIf(!hatPdftotext)("ohne Schnellerfassung bleibt „keine Unterbringung angefordert“ ohne Zusatz", async () => {
    const voll = einheit(0);
    const t = norm(await seitenTexte(einsatzLageblattDokument("Lage", [voll], erstellt, 0)));
    expect(t).toContain("keine Unterbringung angefordert ·");
    expect(t).not.toContain("nicht erfasst");
  }, 60_000);
});

describe("R14-A1/A2/A3 Lageblatt: Einlesezeit, falsche Uhr, Art der Rückrufnummer", () => {
  it.skipIf(!hatPdftotext)("A1: gestempelte Eintreffzeiten tragen „*“ und eine Fußnote, von Hand gesetzte nicht", async () => {
    const e = [0, 1, 2].map((i) => einheit(i, { zeitEingelesen: true }));
    e.push(einheit(3)); // vom Meldeblock nachgetragen: ohne Marke
    const t = norm(await seitenTexte(einsatzLageblattDokument("Lage", e, erstellt, 0)));
    expect(t.match(/18:24 \*/g) ?? []).toHaveLength(3);
    expect(t).toContain("* Eintreffzeit = Zeit des Einlesens am Gerät");
    const ohne = norm(await seitenTexte(einsatzLageblattDokument("Lage", [einheit(0)], erstellt, 0)));
    expect(ohne).not.toContain("Zeit des Einlesens");
  }, 60_000);

  it.skipIf(!hatPdftotext)("A2: eine nachgehende Geräteuhr steht im Kopf und an der Zeile", async () => {
    const e = [einheit(0, { standNachEintreffen: true }), einheit(1)];
    const t = norm(await seitenTexte(einsatzLageblattDokument("Lage", e, erstellt, 0)));
    expect(t).toContain("Geräteuhr geht vermutlich nach: 1 Stand liegt nach dem Eintreffen");
    // Die Zeile bricht um; das Warnzeichen steht im PDF als „!“.
    expect(t).toMatch(/! Stand nach .*Eintreffen: .*Uhr prüfen/);
    const ohne = norm(await seitenTexte(einsatzLageblattDokument("Lage", [einheit(1)], erstellt, 0)));
    expect(ohne).not.toContain("Geräteuhr geht");
  }, 60_000);

  it.skipIf(!hatPdftotext)("A3: die Rückrufnummer trägt (P) oder (D) wie auf dem Bogen; die dienstliche Nummer geht vor", async () => {
    const privat = einheit(0);
    privat.bogen.personal[0] = { ...privat.bogen.personal[0]!, vorname: "Sabine", nachname: "Lang", staerkeRolle: StaerkeRolle.FUEHRER, kontakte: [{ art: KontaktArt.MOBIL, dienstlich: false, wert: "5556968346" }] };
    const beides = einheit(1);
    beides.bogen.personal[0] = {
      ...beides.bogen.personal[0]!,
      vorname: "Max",
      nachname: "Haller",
      staerkeRolle: StaerkeRolle.FUEHRER,
      kontakte: [
        { art: KontaktArt.MOBIL, dienstlich: false, wert: "111222" },
        { art: KontaktArt.MOBIL, dienstlich: true, wert: "333444" },
      ],
    };
    const t = norm(await seitenTexte(einsatzLageblattDokument("Lage", [privat, beides], erstellt, 0)));
    expect(t).toContain("5556968346 (P) S. Lang");
    expect(t).toContain("333444 (D) M. Haller");
    expect(t).not.toContain("111222");
    expect(t).toContain("(D) dienstlich, (P) privat");
  }, 60_000);
});

describe("R14-K1 Lageblatt: „Stand vor …“ für einen Bogen, der schon beim Eingang alt war", () => {
  it.skipIf(!hatPdftotext)("die Zeile trägt „⚠ Stand vor 14 Std“, ein frischer Bogen keine Marke", async () => {
    const jetzt = Date.now();
    const alt = einheit(0, { empfangenAm: jetzt });
    alt.bogen.stand = jetztZeitpunkt() - 14 * 60;
    const frisch = einheit(1, { empfangenAm: jetzt });
    frisch.bogen.stand = jetztZeitpunkt() - 3;
    const t = norm(await seitenTexte(einsatzLageblattDokument("Lage", [alt, frisch], jetzt, 0)));
    // Das Warnzeichen steht im PDF als „!“, die schmale Spalte bricht um.
    expect(t).toMatch(/! Stand vor .*14 Std [01] Min/);
    expect(t.match(/! (Stand|Meldung) vor/g) ?? []).toHaveLength(1);
    expect(t).toMatch(/älteste Meldung vor 14 Std/);
  }, 60_000);
});

describe("R14-K2 Lageblatt: Überschrift „Abgerückt“ bleibt bei ihrer Zeile", () => {
  it.skipIf(!hatPdftotext)("auf keiner Seite steht „Abgerückt (n)“ ohne eine Einheitszeile darunter", async () => {
    for (let n = 3; n <= 16; n++) {
      const e = [...Array.from({ length: n }, (_, i) => einheit(i)), einheit(n, { abgerueckt: true, abgerueckAm: eingetroffen + 60_000 })];
      const seiten = await seitenTexte(einsatzLageblattDokument("Lage", e, erstellt, 0));
      for (const [s, text] of seiten.entries()) {
        const zeilen = text.split("\n").map((z) => z.trim()).filter(Boolean);
        const i = zeilen.findIndex((z) => /^Abgerückt \(\d+\)/.test(z));
        if (i < 0) continue;
        expect(zeilen[i + 1] ?? "", `n=${n}, Seite ${s + 1}`).toMatch(/^Nr\. \d+/);
      }
    }
  }, 120_000);
});
