/**
 * Abgleich zwischen zwei Fenstern derselben App (Audit Runde 2, R2-O4).
 *
 * Auf Telefonen geht ein geteilter Link oft im Browser auf, während die App
 * schon offen ist. Bisher überschrieben sich die Fenster still: Beide meldeten
 * „gespeichert", im Speicher stand, wer zuletzt tippte. Und eine offene
 * Sammlungsansicht zeigte eine zu kleine Stärke, bis dort jemand etwas tat.
 *
 * Das `storage`-Ereignis meldet Änderungen aus anderen Fenstern desselben
 * Ursprungs:
 * - Einsatz-Sammlungen: sofort neu einlesen — die Sammlung schreibt je
 *   Handlung frisch aus dem Speicher, dort geht nichts verloren; es fehlte nur
 *   die Anzeige.
 * - Entwurf: Ist hier ein Bogen offen und steht im Speicher ein anderer Stand
 *   als der, den dieses Fenster zuletzt schrieb, speichert dieses Fenster nicht
 *   mehr (entwurf.ts) und fragt: Stand aus dem anderen Fenster laden oder die
 *   eigene Fassung behalten.
 *
 * Runde 4 (R4-S4): „Meine Fassung behalten" klang wie die sichere Wahl,
 * verwarf aber den Stand des anderen Fensters ohne Rückholplatz. Jetzt kommt
 * der andere Stand auf den Rückholplatz, wie es „Neuen Bogen erstellen" im
 * anderen Fenster schon tat; ginge dabei etwas endgültig verloren, fragt das
 * Fenster vorher und nennt es. Die Warnung nennt den anderen Stand, und
 * „Stand aus dem anderen Fenster laden" kehrt in den Bogen zurück statt auf
 * die Startseite.
 */

import { useEffect, useRef, useState } from "react";
import type { Erfassungsbogen } from "@bos/eeb-format/model";
import {
  ENTWURF_SCHLUESSEL,
  entwurfAusAnderemFenster,
  entwurfFremdEntfernt,
  entwurfFremdGeaendert,
  entwurfKonfliktAbonnieren,
  entwurfUeberschreibenErlauben,
  ersetztenEntwurfLaden,
  ersetztenEntwurfMerken,
  rueckholungNimmt,
  type Entwurf,
  type KonfliktArt,
} from "./entwurf";
import { FesteWarnung } from "./feste-warnung";
import { bogenHatInhalt, einheitAnzeigename } from "./hilfen";
import { frageJaNein } from "./dialoge";
import { zeitpunktZuMs } from "./eintrag-zeiten";

/**
 * Merker in der Sitzung: Nach „Stand aus dem anderen Fenster laden" öffnet
 * die neu geladene App den Bogen direkt, statt auf der Startseite einen
 * zusätzlichen Tipp auf „Fortsetzen" zu verlangen (R4-S4).
 */
export const NACH_ABGLEICH_SCHLUESSEL = "eeb.abgleich.fortsetzen";

/** Einmal lesen und löschen: Kam diese Seite aus „Stand aus dem anderen Fenster laden"? */
export function nachAbgleichFortsetzen(): boolean {
  try {
    const da = sessionStorage.getItem(NACH_ABGLEICH_SCHLUESSEL) === "1";
    if (da) sessionStorage.removeItem(NACH_ABGLEICH_SCHLUESSEL);
    return da;
  } catch {
    return false;
  }
}

function gleich(a: Erfassungsbogen | null | undefined, b: Erfassungsbogen | null | undefined): boolean {
  return !!a && !!b && JSON.stringify(a) === JSON.stringify(b);
}

function zeitKurz(e: Entwurf): string {
  return new Date(e.gespeichert).toLocaleString("de-DE", { dateStyle: "short", timeStyle: "short" });
}

/** Letzte Änderung eines Bogens als Uhrzeit — die Wandzeit steht im Bogen selbst. */
function standKurz(b: Erfassungsbogen): string {
  return new Date(zeitpunktZuMs(b.stand)).toLocaleString("de-DE", { dateStyle: "short", timeStyle: "short" });
}

function personenText(b: Erfassungsbogen): string {
  const n = b.personal.length;
  return `${n} ${n === 1 ? "Person" : "Personen"}`;
}

const EINSAETZE_SCHLUESSEL = "eeb.einsaetze.v1";

export interface FensterAbgleich {
  /** Ein anderes Fenster hat den offenen Bogen geändert oder gelöscht; hier wird nicht gespeichert. */
  konflikt: boolean;
  /** Was das andere Fenster tat (R5-D3: auch „entfernt" — „Alle Daten löschen", Bogen geschlossen). */
  art: KonfliktArt | null;
  /** Zählt jede Entscheidung „behalten" hoch — gehört in die Abhängigkeiten des Autosave. */
  runde: number;
  /** Der offene Bogen dieses Fensters (für die Warnung, die beide Stände nennt). */
  eigenerBogen?: () => Erfassungsbogen | null;
  /**
   * Eigene Fassung behalten: Der Stand des anderen Fensters kommt auf den
   * Rückholplatz, die eigene Fassung überschreibt beim nächsten Speichern.
   */
  behalten: () => Promise<void>;
  /**
   * Stand aus dem anderen Fenster übernehmen: die App lädt neu und öffnet den
   * gespeicherten Entwurf. Hat dieses Fenster eigene, ungespeicherte Änderungen,
   * fragt es vorher und legt sie auf den Rückholplatz.
   */
  neuLaden: () => Promise<void>;
}

export function useFensterAbgleich(
  bogenOffen: boolean,
  onEinsaetze: () => void,
  opt: {
    /** Der offene Bogen dieses Fensters — gleicht der andere Stand ihm, ist nichts zu retten. */
    eigenerBogen?: () => Erfassungsbogen | null;
    /** Der Rückholplatz hat sich geändert (Startseite neu lesen). */
    onRueckholung?: () => void;
    /** Das andere Fenster hat den ganzen Speicher geleert und hier ist kein Bogen offen (Vorgabe: Seite neu laden). */
    beiAllesGeloescht?: () => void;
  } = {},
): FensterAbgleich {
  const [konflikt, setKonflikt] = useState<KonfliktArt | null>(null);
  const [runde, setRunde] = useState(0);
  const offen = useRef(bogenOffen);
  offen.current = bogenOffen;
  const einsaetze = useRef(onEinsaetze);
  einsaetze.current = onEinsaetze;
  const optRef = useRef(opt);
  optRef.current = opt;

  useEffect(() => {
    const abmelden = entwurfKonfliktAbonnieren((art) => setKonflikt(art));
    function beiSpeicher(e: StorageEvent) {
      // key === null: das andere Fenster hat den ganzen Speicher geleert.
      if (e.key === null || e.key === EINSAETZE_SCHLUESSEL) einsaetze.current();
      // „Alle Daten löschen" im anderen Fenster: Die Startseite hier hielte
      // Vorlagen, Entwurf und Rückholplatz weiter im Arbeitsspeicher und
      // schriebe sie über „Bogen anlegen" zurück (Audit Runde 6, R6-D1). Ohne
      // offenen Bogen gibt es hier nichts, was verloren ginge: neu aufbauen.
      if (e.key === null && !offen.current) (optRef.current.beiAllesGeloescht ?? (() => window.location.reload()))();
      if ((e.key === null || e.key === ENTWURF_SCHLUESSEL) && offen.current) {
        if (entwurfFremdGeaendert()) setKonflikt("geaendert");
        else if (entwurfFremdEntfernt()) setKonflikt("entfernt");
      }
    }
    window.addEventListener("storage", beiSpeicher);
    return () => {
      abmelden();
      window.removeEventListener("storage", beiSpeicher);
    };
  }, []);

  // Ohne offenen Bogen gibt es nichts zu entscheiden.
  useEffect(() => {
    if (!bogenOffen) setKonflikt(null);
  }, [bogenOffen]);

  return {
    konflikt: konflikt != null && bogenOffen,
    art: bogenOffen ? konflikt : null,
    runde,
    eigenerBogen: () => optRef.current.eigenerBogen?.() ?? null,
    behalten: async () => {
      if (konflikt === "entfernt") {
        // Das andere Fenster hat den Entwurf gelöscht; „behalten" schreibt ihn
        // bewusst zurück. Rückholplatz gibt es dabei nichts zu retten.
        entwurfUeberschreibenErlauben();
        setKonflikt(null);
        setRunde((r) => r + 1);
        return;
      }
      const anderes = entwurfAusAnderemFenster();
      const eigener = optRef.current.eigenerBogen?.() ?? null;
      if (anderes && bogenHatInhalt(anderes.bogen) && !gleich(anderes.bogen, eigener)) {
        const name = einheitAnzeigename(anderes.bogen.einheit);
        const alt = ersetztenEntwurfLaden();
        const nimmt = rueckholungNimmt(!!anderes.fremd, alt);
        // Was dort liegt und nicht ohnehin einer der beiden Stände ist, fiele weg.
        const altFaellt =
          nimmt && !!alt && bogenHatInhalt(alt.bogen) && !gleich(alt.bogen, anderes.bogen) && !gleich(alt.bogen, eigener);
        // Die Rückfrage trägt, was die Daueranzeige nicht mehr sagt: wohin der
        // andere Stand kommt (R5-S4) — und, wenn dabei etwas fiele, was.
        {
          const ja = await frageJaNein({
            titel: "Meine Fassung behalten?",
            text: !nimmt
              ? `Die Erfassung „${name}" aus dem anderen Fenster (Stand ${zeitKurz(anderes)} Uhr) geht dabei verloren — auf dem Rückholplatz liegt dein eigener Bogen „${einheitAnzeigename(alt!.bogen.einheit)}", und der bleibt.`
              : altFaellt
                ? `„${name}" aus dem anderen Fenster (Stand ${zeitKurz(anderes)} Uhr) kommt auf den Rückholplatz. Der dort bisher liegende Bogen „${einheitAnzeigename(alt!.bogen.einheit)}" (Stand ${zeitKurz(alt!)} Uhr) wird dabei endgültig gelöscht.`
                : `„${name}" aus dem anderen Fenster (Stand ${zeitKurz(anderes)} Uhr) kommt auf den Rückholplatz der Startseite und lässt sich von dort zurückholen. Deine Fassung wird ab jetzt gespeichert.`,
            ok: "Meine Fassung behalten",
            gefahr: !nimmt || altFaellt,
          });
          if (!ja) return;
        }
        if (nimmt && !gleich(alt?.bogen, anderes.bogen)) ersetztenEntwurfMerken(anderes.bogen, anderes.fremd);
        optRef.current.onRueckholung?.();
      }
      entwurfUeberschreibenErlauben();
      setKonflikt(null);
      setRunde((r) => r + 1);
    },
    neuLaden: async () => {
      // Was hier nach der Warnung weiter getippt wurde, steht nirgends im
      // Speicher: Mit dem Neuladen wäre es still weg („Meine Fassung behalten"
      // fragte, dieser Weg nicht, Audit Runde 6, R6-S1). Darum fragen und die
      // eigene Fassung auf den Rückholplatz legen.
      const anderes = entwurfAusAnderemFenster();
      const eigener = optRef.current.eigenerBogen?.() ?? null;
      if (konflikt !== "entfernt" && eigener && bogenHatInhalt(eigener) && !gleich(anderes?.bogen, eigener)) {
        const alt = ersetztenEntwurfLaden();
        const nimmt = rueckholungNimmt(false, alt);
        const altFaellt = nimmt && !!alt && bogenHatInhalt(alt.bogen) && !gleich(alt.bogen, eigener) && !gleich(alt.bogen, anderes?.bogen);
        const name = einheitAnzeigename(eigener.einheit) || "(Bogen ohne Namen)";
        const ja = await frageJaNein({
          titel: "Stand aus dem anderen Fenster laden?",
          text: !nimmt
            ? `Deine Änderungen in diesem Fenster („${name}", Stand ${standKurz(eigener)} Uhr) gehen dabei verloren — auf dem Rückholplatz liegt dein eigener Bogen „${einheitAnzeigename(alt!.bogen.einheit)}", und der bleibt.`
            : altFaellt
              ? `Deine Fassung hier („${name}", Stand ${standKurz(eigener)} Uhr) kommt auf den Rückholplatz der Startseite. Der dort bisher liegende Bogen „${einheitAnzeigename(alt!.bogen.einheit)}" wird dabei endgültig gelöscht.`
              : `Deine Fassung hier („${name}", Stand ${standKurz(eigener)} Uhr) wird nicht übernommen; sie kommt auf den Rückholplatz der Startseite und lässt sich von dort zurückholen.`,
          ok: "Stand laden",
          gefahr: !nimmt || altFaellt,
        });
        if (!ja) return;
        if (nimmt) ersetztenEntwurfMerken(eigener, undefined, { tausch: true });
      }
      try {
        sessionStorage.setItem(NACH_ABGLEICH_SCHLUESSEL, "1");
      } catch {
        /* ohne Sitzungsspeicher eben über die Startseite */
      }
      window.location.reload();
    },
  };
}

/**
 * Sichtbare Warnung an Stelle der „automatisch gespeichert"-Zeile — als feste
 * Leiste am Bildrand mit zwei Zeilen und zwei Knöpfen (R5-S4: Die Fassung mit
 * ganzem Absatz war 240 px hoch und deckte bei offener Tastatur das Feld).
 * Welcher Stand wohin kommt, steht in der Rückfrage hinter „Meine Fassung
 * behalten".
 */
export function FensterKonflikt({ abgleich }: { abgleich: FensterAbgleich }) {
  const entfernt = abgleich.art === "entfernt";
  const anderes = entfernt ? null : entwurfAusAnderemFenster();
  const eigener = abgleich.eigenerBogen?.() ?? null;
  return (
    <FesteWarnung
      klasse="speicher-fehler fenster-konflikt"
      offenAnfangs
      kurz={
        entfernt
          ? "⚠ Dieser Bogen wurde in einem anderen Fenster gelöscht oder geschlossen. Hier wird nichts gespeichert, bis du entscheidest."
          : `⚠ Dieser Bogen wurde in einem anderen Fenster geändert${
              anderes
                ? ` (dort: „${einheitAnzeigename(anderes.bogen.einheit)}", Stand ${zeitKurz(anderes)} Uhr, ${personenText(anderes.bogen)} · hier: Stand ${eigener ? standKurz(eigener) : "?"} Uhr, ${eigener ? personenText(eigener) : "?"})`
                : ""
            }. Eingaben hier werden erst wieder gespeichert, wenn du entscheidest.`
      }
      aktionen={
        entfernt ? (
          <>
            <button type="button" onClick={() => void abgleich.neuLaden()}>Neu laden, hier verwerfen</button>
            <button type="button" onClick={() => void abgleich.behalten()}>Bogen hier wieder speichern</button>
          </>
        ) : (
          <>
            <button type="button" onClick={() => void abgleich.neuLaden()}>Stand aus dem anderen Fenster laden</button>
            <button type="button" onClick={() => void abgleich.behalten()}>Meine Fassung behalten</button>
          </>
        )
      }
    />
  );
}
