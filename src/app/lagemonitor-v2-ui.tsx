/**
 * Lagemonitor V2: Einheiten im Vordergrund. Kopfleiste mit Uhr und Gesamtstärke, darunter ein Kachelraster,
 * das alle Einheiten ohne Rollen zeigt; Einsatzdaten, Ansicht und Helligkeit liegen im Menü.
 */

import { useEffect, useLayoutEffect, useRef, useState, type ReactNode } from "react";
import "./lagemonitor-v2.css";
import { alterKurz, telefonAnzeige, type EinheitZeile } from "./lagemonitor";
import {
  FUEHRER_OPTIONEN,
  KONTAKT_OPTIONEN,
  fuehrerName,
  type Ansicht,
  type AnzeigeWahl,
} from "./lagemonitor-v2";

/** Schriftfaktoren der Kacheln: so lange verkleinern, bis in keiner Kachel etwas überläuft (der Auftrag bleibt vollständig). */
const PX_MIN = 12;
const PX_MAX = 64;

export interface LageV2Props {
  klasse: string;
  uebung: boolean;
  name: string;
  ort: string | null;
  zeit: string;
  datum: string;
  staerke: { fuehrer: number; unterfuehrer: number; mannschaft: number; gesamt: number };
  sollPersonen: number;
  lage: ReactNode;
  datenstand: string;
  veraltet: boolean;
  alterAnwesende: string | null;
  bedarf: string | null;
  staleHinweis: string | null;
  einheiten: readonly EinheitZeile[];
  leerText: string;
  anzeige: AnzeigeWahl;
  onAnzeige: (a: AnzeigeWahl) => void;
  ansicht: Ansicht;
  onAnsicht: (a: Ansicht) => void;
  stufenleiste: ReactNode;
  daten: ReactNode;
  onVollbild: () => void;
  onSchliessen: () => void;
}

export function LageV2(p: LageV2Props) {
  const [menu, setMenu] = useState(false);
  const [groesse, setGroesse] = useState({ b: window.innerWidth, h: window.innerHeight });
  useEffect(() => {
    const f = () => setGroesse({ b: window.innerWidth, h: window.innerHeight });
    window.addEventListener("resize", f);
    return () => window.removeEventListener("resize", f);
  }, []);
  useEffect(() => {
    if (!menu) return;
    const f = (e: KeyboardEvent) => { if (e.key === "Escape") setMenu(false); };
    window.addEventListener("keydown", f);
    return () => window.removeEventListener("keydown", f);
  }, [menu]);

  const raster = useRef<HTMLUListElement>(null);
  const n = p.einheiten.length;
  const s = p.staerke;

  // Wählt Spaltenzahl und Schriftgröße so, dass die Schrift möglichst groß ist und kein Inhalt (Auftrag!) überläuft.
  useLayoutEffect(() => {
    const el = raster.current;
    if (!el || el.clientHeight === 0) return;
    const kacheln = Array.from(el.querySelectorAll<HTMLElement>(".lm2-kachel"));
    const ueberlauf = () => kacheln.some((k) => k.scrollHeight > k.clientHeight + 1 || k.scrollWidth > k.clientWidth + 1);
    const anwenden = (spalten: number, px: number) => {
      el.style.gridTemplateColumns = `repeat(${spalten}, minmax(0, 1fr))`;
      el.style.gridTemplateRows = `repeat(${Math.ceil(n / spalten)}, minmax(0, 1fr))`;
      el.style.setProperty("--lm2-px", `${px}px`);
      // Eine unvollständige letzte Zeile wird durch die letzte Kachel aufgefüllt, damit keine Leerfläche bleibt.
      kacheln.forEach((k, i) => { k.style.gridColumn = i === n - 1 && n % spalten ? `span ${spalten - (n % spalten) + 1}` : ""; });
    };
    let beste = { spalten: 1, px: PX_MIN };
    for (let c = 1; c <= Math.min(n, 10); c++) {
      let lo = PX_MIN, hi = PX_MAX;
      anwenden(c, lo);
      if (ueberlauf()) { if (c > 1) continue; }
      else {
        while (hi - lo > 1) {
          const mid = Math.floor((lo + hi) / 2);
          anwenden(c, mid);
          if (ueberlauf()) hi = mid; else lo = mid;
        }
      }
      if (lo > beste.px || (lo === beste.px && c > beste.spalten && n % c === 0)) beste = { spalten: c, px: lo };
    }
    anwenden(beste.spalten, beste.px);
  });
  // Älteste Meldung und „n von m älter als 1 Std" stehen untereinander (der Text trennt sie mit Komma).
  const [aelteste, aelterAnteil] = (p.alterAnwesende ?? "").split(/, (?=\d+ von )/);

  return (
    <main className={`${p.klasse} lm2`}>
      <header className="lm2-kopf">
        <div className="lm2-titel">
          <h1>{p.name}{p.ort?.trim() && <span className="lm2-ort"> · {p.ort.trim()}</span>}</h1>
          {p.uebung && <p className="lm2-uebung" role="status">ÜBUNG – keine Echtlage</p>}
        </div>
        <div className="lm2-uhr" aria-label="Uhrzeit und Datum">
          <strong>{p.zeit}</strong>
          <span>{p.datum}</span>
        </div>
        <button type="button" className="lm-knopf lm2-menuknopf" aria-haspopup="dialog" aria-expanded={menu} onClick={() => setMenu((m) => !m)}>
          ☰ Menü
        </button>
      </header>

      <section className="lm2-lage" aria-label="Stärke Führer, Unterführer, Mannschaft, gesamt">
        <div className="lm2-staerke">
          <span className="lm-label">Stärke F / U / M = gesamt</span>
          <span className="lm2-zahlen">{s.fuehrer} / {s.unterfuehrer} / {s.mannschaft} = <u>{s.gesamt}</u></span>
          {p.sollPersonen > 0 && <span className="lm-label lm-veraltet lm-inline">davon {p.sollPersonen} Sollstärke (S), nicht gemeldet</span>}
        </div>
        <div className="lm2-zaehler">
          <span>{p.lage}</span>
          {p.bedarf && <span className="lm2-bedarf">{p.bedarf}</span>}
        </div>
        {(p.datenstand || p.staleHinweis) && (
          <div className="lm2-stand" role={p.staleHinweis ? "alert" : undefined}>
            {p.staleHinweis && <span className="lm2-stand-zeile lm2-warnung">⚠ {p.staleHinweis}</span>}
            {p.datenstand && <span className={`lm2-stand-zeile${p.veraltet && !p.alterAnwesende ? " lm2-warnung" : ""}`}>{p.datenstand}</span>}
            {aelteste && <span className="lm2-stand-zeile lm2-warnung">⚠ {aelteste}</span>}
            {aelterAnteil && <span className="lm2-stand-zeile lm2-warnung">{aelterAnteil}</span>}
          </div>
        )}
      </section>

      <section className="lm2-einheiten" aria-label="Einheiten">
        {n === 0 ? (
          <p className="lm-leer-hinweis">{p.leerText}</p>
        ) : (
          <ul
            className="lm2-raster"
            ref={raster}
          >
            {p.einheiten.map((e) => {
              const leiter = e.leiter ? fuehrerName(e.leiter, p.anzeige.fuehrer) : "";
              const telefon = p.anzeige.kontakt === "telefon" && e.telefon ? telefonAnzeige(e.telefon) : "";
              return (
                <li key={e.id} className={`lm2-kachel${e.alterMin != null ? " lm2-alt" : ""}`}>
                  <div className="lm2-kopfzeile">
                    <span className="lm2-funkruf">{e.funkruf || e.typ || "–"}</span>
                    <span className="lm2-staerke-klein" title="Führer / Unterführer / Mannschaft = gesamt">
                      {e.fuehrer}/{e.unterfuehrer}/{e.mannschaft}
                      <b>= {e.fuehrer + e.unterfuehrer + e.mannschaft}</b>
                      {e.soll && <abbr className="lm-soll" title="Sollstärke, nicht gemeldet"> S</abbr>}
                    </span>
                  </div>
                  <div className="lm2-meta">{[e.orga, e.ort].filter(Boolean).join(" · ")}</div>
                  {(e.funkruf && e.typ) || e.zug ? (
                    <div className="lm2-meta">{[e.funkruf ? e.typ : "", e.zug].filter(Boolean).join(" · ")}</div>
                  ) : null}
                  {(e.auftragVoll ?? e.auftrag) && <div className="lm2-auftrag">{e.auftragVoll ?? e.auftrag}</div>}
                  {(leiter || telefon) && (
                    <div className="lm2-leiter">
                      {leiter && <span>{leiter}</span>}
                      {telefon && <span className="lm2-telefon">☎ {telefon}</span>}
                    </div>
                  )}
                  {e.alterMin != null && (
                    <div className="lm2-warn">⚠ {e.standAlt ? "Stand " : "Meldung "}{alterKurz(e.alterMin)}</div>
                  )}
                </li>
              );
            })}
          </ul>
        )}
      </section>

      {menu && (
        <div className="lm2-menu" role="dialog" aria-label="Menü">
          <div className="lm2-menu-kopf">
            <h2>Menü</h2>
            <button type="button" className="lm-knopf" onClick={() => setMenu(false)}>Schließen</button>
          </div>
          <h3>Einsatzdaten</h3>
          {p.daten}
          <h3>Ansicht</h3>
          <div className="lm-optionen">
            <button type="button" className="lm-knopf" aria-pressed={p.ansicht === "v1"} onClick={() => p.onAnsicht("v1")}>Lagemonitor V1</button>
            <button type="button" className="lm-knopf" aria-pressed={p.ansicht === "v2"} onClick={() => p.onAnsicht("v2")}>Lagemonitor V2</button>
          </div>
          <h3>Einheitsführerdarstellung</h3>
          <div className="lm-optionen">
            {FUEHRER_OPTIONEN.map((o) => (
              <button key={o.wert} type="button" className="lm-knopf" aria-pressed={p.anzeige.fuehrer === o.wert} onClick={() => p.onAnzeige({ ...p.anzeige, fuehrer: o.wert })}>{o.text}</button>
            ))}
          </div>
          <h3>Erreichbarkeitsdarstellung</h3>
          <div className="lm-optionen">
            {KONTAKT_OPTIONEN.map((o) => (
              <button key={o.wert} type="button" className="lm-knopf" aria-pressed={p.anzeige.kontakt === o.wert} onClick={() => p.onAnzeige({ ...p.anzeige, kontakt: o.wert })}>{o.text}</button>
            ))}
          </div>
          <h3>Helligkeit</h3>
          {p.stufenleiste}
          <h3>Fenster</h3>
          <div className="lm-optionen">
            <button type="button" className="lm-knopf" onClick={p.onVollbild}>Vollbild</button>
            <button type="button" className="lm-knopf" onClick={p.onSchliessen}>Monitor beenden</button>
          </div>
        </div>
      )}
    </main>
  );
}
