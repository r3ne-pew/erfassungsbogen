/**
 * Lagemonitor: reine Anzeige der Lage für den Fernseher im Führungsfahrzeug.
 *
 * Läuft als eigene Seite (`?lagemonitor=<Einsatz-Kennung>`) in einem zweiten
 * Fenster desselben Geräts. Die Daten kommen aus demselben Speicher wie die
 * Einsatzansicht; ein `storage`-Ereignis aus dem Fenster, in dem gearbeitet
 * wird, löst das Neulesen aus, ein Takt von wenigen Sekunden fängt den Rest
 * ab. Es gibt kein Netz und keinen Server dazwischen.
 *
 * Gezeigt werden Zahlen und Einheitsnamen, keine Personen.
 */

import { useEffect, useState } from "react";
import "./lagemonitor.css";
import { AnzeigeSchalter } from "./anzeige-schalter";
import { einsaetzeLaden } from "./einsaetze-lesen";
import { BEGINN_SCHLUESSEL, einsatzbeginnLaden, einsatzbeginnSetzen } from "./lagemonitor-beginn";
import { ausEingabeWert, dauerText, dtgText, lagebild, vorText, zuEingabeWert } from "./lagemonitor";
import { unterbringungAngefordertText } from "./auswertung";
import { EinsatzArt } from "@bos/meldekopf/einsaetze";

const URL_PARAMETER = "lagemonitor";
/** Takt für Uhr, Dauer und „vor X Min". */
const TAKT_MS = 5_000;

/** Kennung aus der Adresse, wenn die Seite als Lagemonitor aufgerufen wurde. */
export function lagemonitorKennung(suche: string = window.location.search): string | null {
  const id = new URLSearchParams(suche).get(URL_PARAMETER);
  return id ? id : null;
}

/**
 * Lagemonitor in einem zweiten Fenster öffnen. Lässt die Umgebung das nicht zu
 * (Popup-Sperre), wechselt dieses Fenster selbst in den Monitor.
 */
export function lagemonitorOeffnen(einsatzId: string): void {
  const adresse = `${window.location.pathname}?${URL_PARAMETER}=${encodeURIComponent(einsatzId)}`;
  const fenster = window.open(adresse, "eeb-lagemonitor");
  if (!fenster) window.location.assign(adresse);
}

function usePuls(): number {
  const [jetzt, setJetzt] = useState(() => Date.now());
  useEffect(() => {
    const t = window.setInterval(() => setJetzt(Date.now()), TAKT_MS);
    return () => window.clearInterval(t);
  }, []);
  return jetzt;
}

/** Bildschirm wachhalten, solange der Monitor läuft (wo der Browser es kann). */
function useWachhalten(): void {
  useEffect(() => {
    let sperre: { release: () => Promise<void> } | null = null;
    let weg = false;
    async function holen() {
      try {
        const w = (navigator as { wakeLock?: { request: (t: "screen") => Promise<{ release: () => Promise<void> }> } }).wakeLock;
        if (!w || document.visibilityState !== "visible") return;
        const s = await w.request("screen");
        if (weg) void s.release();
        else sperre = s;
      } catch {
        /* nicht erlaubt oder nicht unterstützt — der Monitor läuft trotzdem */
      }
    }
    void holen();
    document.addEventListener("visibilitychange", holen);
    return () => {
      weg = true;
      document.removeEventListener("visibilitychange", holen);
      void sperre?.release();
    };
  }, []);
}

/** Zähler, der hochgeht, sobald ein anderes Fenster Einsätze oder Beginn ändert. */
function useSpeicherAenderung(): number {
  const [stand, setStand] = useState(0);
  useEffect(() => {
    const horcher = (e: StorageEvent) => {
      if (e.key === null || e.key === "eeb.einsaetze.v1" || e.key === BEGINN_SCHLUESSEL) setStand((n) => n + 1);
    };
    window.addEventListener("storage", horcher);
    return () => window.removeEventListener("storage", horcher);
  }, []);
  return stand;
}

function schliessen() {
  if (window.opener) window.close();
  else window.location.assign(window.location.pathname);
}

function vollbild() {
  const doc = document;
  if (doc.fullscreenElement) void doc.exitFullscreen();
  else void doc.documentElement.requestFullscreen?.().catch(() => {});
}

export function Lagemonitor({ einsatzId }: { einsatzId: string }) {
  const jetzt = usePuls();
  const stand = useSpeicherAenderung();
  useWachhalten();
  // Bei jedem Durchlauf neu lesen: `stand` und `jetzt` lösen ihn aus, der Lesezugriff ist gepuffert (einsaetze-lesen.ts).
  void stand;
  const einsatz = einsaetzeLaden().find((s) => s.id === einsatzId);
  const beginn = einsatzbeginnLaden(einsatzId);

  useEffect(() => {
    document.title = einsatz ? `Lage – ${einsatz.name}` : "Lagemonitor";
  }, [einsatz]);

  const werkzeuge = (
    <div className="lm-werkzeuge" role="toolbar" aria-label="Anzeige">
      <AnzeigeSchalter />
      <button type="button" onClick={vollbild}>Vollbild</button>
      <button type="button" onClick={schliessen}>Schließen</button>
    </div>
  );

  if (!einsatz) {
    return (
      <main className="lm lm-leer">
        <h1>Lagemonitor</h1>
        <p>Dieser Einsatz ist auf diesem Gerät nicht (mehr) vorhanden.</p>
        {werkzeuge}
      </main>
    );
  }

  const bild = lagebild(einsatz, jetzt);
  const s = bild.summen;
  const dauer = dauerText(beginn, jetzt);
  const kraftstoff = [
    s.kraftstoff.dieselLiter ? `Diesel ${s.kraftstoff.dieselLiter} l` : "",
    s.kraftstoff.benzinLiter ? `Benzin ${s.kraftstoff.benzinLiter} l` : "",
    s.kraftstoff.gemischLiter ? `Gemisch ${s.kraftstoff.gemischLiter} l` : "",
  ].filter(Boolean);

  return (
    <main className="lm">
      <header className="lm-kopf">
        <div className="lm-titel">
          <h1>{einsatz.name}</h1>
          <p>
            {bild.ort ? `${bild.ort} · ` : ""}
            {einsatz.art === EinsatzArt.UEBUNG ? "Übung" : einsatz.art === EinsatzArt.VERANSTALTUNG ? "Veranstaltung" : "Einsatz"}
          </p>
        </div>
        <div className="lm-zeit">
          <div className="lm-dtg" aria-label="Datum-Zeit-Gruppe">{dtgText(new Date(jetzt))}</div>
          <div className="lm-dauer">
            {dauer ? `Einsatzdauer ${dauer}` : beginn != null ? "Einsatz beginnt noch" : "Einsatzbeginn nicht gesetzt"}
          </div>
        </div>
      </header>

      <section className="lm-kacheln" aria-label="Summen">
        <div className="lm-kachel">
          <span className="lm-wert">{s.einheiten}</span>
          <span className="lm-name">Einheiten</span>
        </div>
        <div className="lm-kachel lm-gross">
          <span className="lm-wert">{s.staerke.gesamt}</span>
          <span className="lm-name">
            Stärke · Führer {s.staerke.fuehrer} · Unterführer {s.staerke.unterfuehrer} · Mannschaft {s.staerke.mannschaft}
          </span>
        </div>
        <div className="lm-kachel">
          <span className="lm-wert">{s.fahrzeuge}</span>
          <span className="lm-name">Fahrzeuge</span>
        </div>
        <div className="lm-kachel">
          <span className="lm-wert">{s.verpflegung.gesamt}</span>
          <span className="lm-name">Verpflegung</span>
        </div>
        <div className="lm-kachel">
          <span className="lm-wert">{s.unterbringungBenoetigt ? s.unterbringungAngefordert.personen : "–"}</span>
          <span className="lm-name">
            Unterbringung {s.unterbringungBenoetigt ? `(${unterbringungAngefordertText(s)})` : "nicht angefordert"}
          </span>
        </div>
        <div className="lm-kachel">
          <span className="lm-wert">{kraftstoff.length ? kraftstoff.join(" · ") : "–"}</span>
          <span className="lm-name">Kraftstoff</span>
        </div>
        <div className={`lm-kachel${s.ruhezeitErforderlich ? " lm-achtung" : ""}`}>
          <span className="lm-wert">{s.ruhezeitErforderlich}</span>
          <span className="lm-name">Ruhezeit nötig</span>
        </div>
        <div className="lm-kachel lm-breit">
          <span className="lm-wert lm-klein">
            {bild.letzteMeldungAm != null ? vorText(bild.letzteMeldungAm, jetzt) : "–"}
          </span>
          <span className="lm-name">Letzte Meldung</span>
        </div>
      </section>

      {s.einheiten === 0 ? (
        <p className="lm-leer-hinweis">Noch keine Einheit gemeldet.</p>
      ) : (
        <div className="lm-spalten">
          <section aria-label="Züge">
            <h2>Züge</h2>
            <table className="lm-tabelle">
              <thead>
                <tr><th>Zug / Verband</th><th>Einh.</th><th>Stärke</th><th>Fzg.</th></tr>
              </thead>
              <tbody>
                {bild.zuege.map((z) => (
                  <tr key={z.zugEtikett ?? ""}>
                    <td>{z.zugEtikett ?? "Einzeln"}</td>
                    <td>{z.summen.einheiten}</td>
                    <td>{z.summen.staerke.fuehrer}/{z.summen.staerke.unterfuehrer}/{z.summen.staerke.mannschaft}={z.summen.staerke.gesamt}</td>
                    <td>{z.summen.fahrzeuge}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </section>
          <section aria-label="Letzte Meldungen">
            <h2>Zuletzt gemeldet</h2>
            <ul className="lm-liste">
              {bild.letzte.map((m) => (
                <li key={`${m.name}-${m.empfangenAm}`} className={m.neu ? "lm-neu" : ""}>
                  <span className="lm-einheit">{m.name}{m.zug ? ` · ${m.zug}` : ""}</span>
                  <span className="lm-vor">{vorText(m.empfangenAm, jetzt)}</span>
                </li>
              ))}
            </ul>
          </section>
        </div>
      )}
      {werkzeuge}
    </main>
  );
}

/**
 * Block in der Einsatzansicht: Beginn setzen und den Monitor öffnen. Sitzt dort,
 * wo gearbeitet wird; der Monitor selbst bleibt reine Anzeige.
 */
export function LagemonitorBlock({ einsatzId, alleIds }: { einsatzId: string; alleIds: readonly string[] }) {
  const [beginn, setBeginn] = useState<number | null>(() => einsatzbeginnLaden(einsatzId));
  const [fehler, setFehler] = useState(false);

  function setze(ms: number | null) {
    const ok = einsatzbeginnSetzen(einsatzId, ms, alleIds);
    setFehler(!ok);
    if (ok) setBeginn(ms);
  }

  return (
    <div className="lm-block">
      <p className="lm-block-titel"><strong>Lagemonitor für den Fernseher</strong></p>
      <p className="hinweis">
        Zweites Fenster mit der Lage in großer Schrift, ohne Personennamen — auf den Fernseher ziehen (HDMI, erweiterter
        Bildschirm). Es aktualisiert sich von selbst, solange es auf diesem Gerät läuft.
      </p>
      <div className="vorlage-aktionen">
        <label>
          Einsatzbeginn{" "}
          <input
            type="datetime-local"
            value={beginn != null ? zuEingabeWert(beginn) : ""}
            onChange={(e) => setze(ausEingabeWert(e.target.value))}
          />
        </label>{" "}
        <button type="button" onClick={() => setze(Date.now())}>Jetzt</button>{" "}
        {beginn != null && <button type="button" onClick={() => setze(null)}>Löschen</button>}{" "}
        <button type="button" className="primaer" onClick={() => lagemonitorOeffnen(einsatzId)}>
          Lagemonitor öffnen
        </button>
      </div>
      {fehler && <p className="fehler" role="status">Der Beginn konnte nicht gespeichert werden (Speicher voll oder gesperrt).</p>}
    </div>
  );
}
