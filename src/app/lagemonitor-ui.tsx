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
import { einsaetzeLaden } from "./einsaetze-lesen";
import {
  BEGINN_SCHLUESSEL,
  FUNKRUF_MAX,
  FUNKRUF_SCHLUESSEL,
  einsatzFunkrufLaden,
  einsatzFunkrufSetzen,
  einsatzbeginnLaden,
  einsatzbeginnSetzen,
} from "./lagemonitor-beginn";
import { ausEingabeWert, dauerText, dtgTeile, lagebild, zuEingabeWert } from "./lagemonitor";
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
      if (e.key === null || e.key === "eeb.einsaetze.v1" || e.key === BEGINN_SCHLUESSEL || e.key === FUNKRUF_SCHLUESSEL) {
        setStand((n) => n + 1);
      }
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
  const funkruf = einsatzFunkrufLaden(einsatzId);

  useEffect(() => {
    document.title = einsatz ? `Lage – ${einsatz.name}` : "Lagemonitor";
  }, [einsatz]);

  const [hell, setHell] = useState(false);
  const klasse = `lm${hell ? " lm-hell" : ""}`;

  if (!einsatz) {
    return (
      <main className={`${klasse} lm-leer`}>
        <div className="lm-zeile lm-r1">Dieser Einsatz ist auf diesem Gerät nicht (mehr) vorhanden.</div>
        <button type="button" onClick={schliessen}>Schließen</button>
      </main>
    );
  }

  const bild = lagebild(einsatz);
  const s = bild.summen;
  const dtg = dtgTeile(new Date(jetzt));
  const dauer = dauerText(beginn, jetzt);
  const art = einsatz.art === EinsatzArt.UEBUNG ? "Übung" : einsatz.art === EinsatzArt.VERANSTALTUNG ? "Veranstaltung" : "Einsatz";

  return (
    <main className={klasse}>
      {/* Erste Zeile: eigener Funkrufname, optional — ohne ihn rückt der Einsatzname nach oben. */}
      {funkruf && <h1 className="lm-zeile lm-r1">{funkruf}</h1>}
      {funkruf ? (
        <div className="lm-zeile lm-r2">{einsatz.name}</div>
      ) : (
        <h1 className="lm-zeile lm-r1">{einsatz.name}</h1>
      )}
      <div className="lm-zeile lm-dtg" aria-label="Datum-Zeit-Gruppe">
        <div className="lm-dtg-text">
          <span>{dtg.tag}</span> <strong>{dtg.zeit}</strong> <span>{dtg.monat}</span> <span>{dtg.jahr}</span>
        </div>
      </div>
      <div className="lm-zeile lm-r3" aria-label="Stärke Führer, Unterführer, Mannschaft, gesamt">
        {s.staerke.fuehrer} / {s.staerke.unterfuehrer} / {s.staerke.mannschaft} // <u>{s.staerke.gesamt}</u>
      </div>
      <div className="lm-zeile lm-r3">{dauer ?? (beginn != null ? "Einsatz beginnt noch" : "Einsatzbeginn nicht gesetzt")}</div>

      <details className="lm-zeile lm-klapp">
        <summary>Einheiten</summary>
        {bild.einheiten.length === 0 ? (
          <p className="lm-leer-hinweis">Noch keine Einheit gemeldet.</p>
        ) : (
          <table className="lm-einheiten">
            <thead>
              <tr>
                <th>Orga</th><th>Ort</th><th>Funkrufname</th><th>Einheitentyp</th>
                <th className="lm-zahl" title="Führer">F</th>
                <th className="lm-zahl" title="Unterführer">U</th>
                <th className="lm-zahl" title="Mannschaft">M</th>
              </tr>
            </thead>
            <tbody>
              {bild.einheiten.map((e) => (
                <tr key={e.id}>
                  <td>{e.orga}</td>
                  <td>{e.ort || "–"}</td>
                  <td>{e.funkruf || "–"}</td>
                  <td>{e.typ || "–"}</td>
                  <td className="lm-zahl">{e.fuehrer}</td>
                  <td className="lm-zahl">{e.unterfuehrer}</td>
                  <td className="lm-zahl">{e.mannschaft}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </details>

      <details className="lm-zeile lm-klapp">
        <summary>Einsatzdaten</summary>
        <dl className="lm-daten">
          <dt>Art</dt><dd>{art}{bild.ort ? ` · ${bild.ort}` : ""}</dd>
          <dt>Funkrufname</dt><dd>{funkruf ?? "nicht gesetzt (in der Einsatzansicht einstellen)"}</dd>
          <dt>Einsatzbeginn</dt>
          <dd>
            {beginn != null
              ? (() => { const b = dtgTeile(new Date(beginn)); return `${b.tag} ${b.zeit} ${b.monat} ${b.jahr}`; })()
              : "nicht gesetzt (in der Einsatzansicht einstellen)"}
          </dd>
          <dt>Einheiten</dt><dd>{s.einheiten}</dd>
          <dt>Fahrzeuge</dt><dd>{s.fahrzeuge}</dd>
        </dl>
      </details>

      <details className="lm-zeile lm-klapp">
        <summary>Optionen</summary>
        <div className="lm-optionen">
          <button type="button" onClick={() => setHell((h) => !h)}>{hell ? "Dunkel" : "Hell"}</button>
          <button type="button" onClick={vollbild}>Vollbild</button>
          <button type="button" onClick={schliessen}>Schließen</button>
        </div>
      </details>
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
  const [funkruf, setFunkruf] = useState(() => einsatzFunkrufLaden(einsatzId) ?? "");

  function setzeFunkruf(text: string) {
    setFunkruf(text.slice(0, FUNKRUF_MAX));
    setFehler(!einsatzFunkrufSetzen(einsatzId, text, alleIds));
  }

  function setze(ms: number | null) {
    const ok = einsatzbeginnSetzen(einsatzId, ms, alleIds);
    setFehler(!ok);
    if (ok) setBeginn(ms);
  }

  return (
    <div className="lm-block">
      <p className="lm-block-titel"><strong>Lagemonitor für den Fernseher</strong></p>
      <p className="hinweis">
        Zweites Fenster mit der Lage in großer Schrift, ohne Personennamen — auf den Fernseher ziehen (HDMI,
        erweiterter Bildschirm). Es aktualisiert sich von selbst, solange es auf diesem Gerät läuft. In der ersten
        Zeile steht der Funkrufname (wenn eingetragen), darunter der Name dieses Einsatzes.
      </p>
      <div className="vorlage-aktionen">
        <label>
          Funkrufname (optional){" "}
          <input
            type="text"
            value={funkruf}
            maxLength={FUNKRUF_MAX}
            placeholder="z. B. Salus Übungsleitung"
            onChange={(e) => setzeFunkruf(e.target.value)}
          />
        </label>
      </div>
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
