/**
 * Warnung „Geräteuhr prüfen" (Audit Runde 4, R4-D1; Runde 5, R5-D1, R5-O5).
 *
 * Weicht die Geräteuhr unplausibel weit vom letzten Start ab (mehr als
 * `UHR_SPRUNG_TAGE`, vor oder zurück), rechnet die App alle Fristen mit dem
 * letzten akzeptierten Zeitpunkt und löscht oder anonymisiert nichts. Ob das
 * Datum stimmt, kann nur der Helfer sagen: Nach einer echten Pause von 100
 * Tagen ist es richtig, nach einem leeren Akku falsch. Die Meldung nennt
 * deshalb beide Möglichkeiten, sagt mit Zahlen, was „Stimmt" kostet, und
 * verlangt eine Antwort. Ein Sprung wird nie durch Zeitablauf bestätigt.
 */
import { useMemo, useState } from "react";
import { EEB_EPOCHE_MS, type EebZeitpunkt } from "@bos/eeb-format/model";
import { uhrBestaetigen, uhrWarnung } from "./datenschutz-uhr";
import { betroffeneText, folgenText, folgenVorhanden, msAusZeitpunkt } from "./uhr-folgen";
import { frageJaNein } from "./dialoge";

function tag(z: EebZeitpunkt): string {
  return new Date(EEB_EPOCHE_MS + z * 60_000).toLocaleDateString("de-DE", {
    timeZone: "UTC",
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
}

export function UhrWarnung({ neuLaden = () => window.location.reload() }: { neuLaden?: () => void } = {}) {
  const w = useMemo(() => uhrWarnung(), []);
  const [korrigieren, setKorrigieren] = useState(false);
  const [fehler, setFehler] = useState(false);
  if (!w) return null;
  const vor = w.richtung === "vor";
  const folgen = folgenText(w.folgen);
  const hatFolgen = folgenVorhanden(w.folgen);
  // Alter gegenüber dem letzten akzeptierten Zeitpunkt, nicht der Geräteuhr (R6-D3).
  const betroffen = betroffeneText(w.folgen, msAusZeitpunkt(w.zuletzt));
  const f = w.folgen;
  const mehrere = [f.sammlungen, f.papierkorb, f.meldungen, f.entwurf ? 1 : 0].filter((n) => n > 0).length > 1 || Math.max(f.sammlungen, f.papierkorb, f.meldungen) > 1;
  // Der Satz zur Rettung passt zum Fall (R6-O8): Sammlungen lassen sich exportieren, der eigene Bogen übergeben.
  const rettung = [
    f.sammlungen > 0 ? "Eine Sammlung, die du noch brauchst, vorher exportieren: Dazu „Abbrechen“ und die Sammlung öffnen." : "",
    f.entwurf ? "Den eigenen Bogen vorher sichern: Dazu „Abbrechen“, auf der Startseite „Fortsetzen“ und dort „Bogen übergeben…“." : "",
  ]
    .filter(Boolean)
    .join(" ");

  async function stimmt() {
    if (hatFolgen) {
      const ja = await frageJaNein({
        titel: "Datum stimmt — jetzt endgültig löschen?",
        text: `Das Gerät zeigt den ${tag(w!.geraet)}. Damit ${mehrere ? "werden" : "wird"} ${folgen} endgültig gelöscht — nicht im Papierkorb. ${betroffen.liste ? `Betroffen: ${betroffen.liste}. ${betroffen.laufend} ` : ""}${rettung}`,
        ok: "Ja, Datum stimmt — löschen",
        abbruch: "Abbrechen",
        gefahr: true,
      });
      if (!ja) return;
    }
    if (uhrBestaetigen()) neuLaden();
    else setFehler(true);
  }

  return (
    <div className="warnung uhr-warnung" role="alert">
      <p>
        <strong>⚠ Geräteuhr prüfen:</strong> Das Gerät zeigt den {tag(w.geraet)}, beim letzten Start war der{" "}
        {tag(w.zuletzt)} ({w.tage} {w.tage === 1 ? "Tag" : "Tage"} {vor ? "davor" : "danach"}). Stimmt das heutige
        Datum? Bis du antwortest, löscht und anonymisiert die App nichts.
      </p>
      {hatFolgen && (
        <p>
          Wenn das Datum stimmt, {mehrere ? "werden" : "wird"} {folgen} endgültig gelöscht. Wenn die Uhr falsch geht, bleibt alles.
        </p>
      )}
      {betroffen.liste && (
        <p>
          Betroffen: {betroffen.liste}. {betroffen.laufend}
        </p>
      )}
      {korrigieren && (
        <p>
          Stelle in den Geräteeinstellungen Datum und Uhrzeit richtig ein (am besten „automatisch"), dann „Neu
          prüfen". Passt die Uhr wieder zum letzten Start, verschwindet diese Meldung von selbst.
        </p>
      )}
      {fehler && <p className="fehler">Die Antwort ließ sich nicht speichern (Speicher gesperrt). Es bleibt alles, wie es ist.</p>}
      <div className="vorlage-aktionen">
        <button type="button" onClick={stimmt}>Geräteuhr stimmt</button>
        {korrigieren ? (
          <button type="button" onClick={neuLaden}>Neu prüfen</button>
        ) : (
          <button type="button" onClick={() => setKorrigieren(true)}>Uhr korrigieren</button>
        )}
      </div>
    </div>
  );
}
