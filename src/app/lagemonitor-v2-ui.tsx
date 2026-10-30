/**
 * Lagemonitor V2: Einheiten im Vordergrund. Kopfleiste mit Uhr und Gesamtstärke, darunter ein Kachelraster,
 * das alle Einheiten ohne Rollen zeigt; Einsatzdaten, Ansicht und Helligkeit liegen im Menü.
 */

import { useEffect, useState, type ReactNode } from "react";
import "./lagemonitor-v2.css";
import { alterKurz, type EinheitZeile } from "./lagemonitor";
import { kachelSpalten, type Ansicht } from "./lagemonitor-v2";

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

  const n = p.einheiten.length;
  const spalten = kachelSpalten(n, groesse.b, groesse.h);
  const zeilen = Math.max(1, Math.ceil(n / spalten));
  const s = p.staerke;

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
            {p.staleHinweis && <span className="lm-label lm-veraltet">{p.staleHinweis}</span>}
            {p.datenstand && (
              <span className={`lm-label${p.veraltet ? " lm-veraltet" : ""}`}>
                {p.datenstand}
                {p.alterAnwesende && <span className="lm-warnteil"> ⚠ {p.alterAnwesende}</span>}
              </span>
            )}
          </div>
        )}
      </section>

      <section className="lm2-einheiten" aria-label="Einheiten">
        {n === 0 ? (
          <p className="lm-leer-hinweis">{p.leerText}</p>
        ) : (
          <ul
            className="lm2-raster"
            style={{ gridTemplateColumns: `repeat(${spalten}, minmax(0, 1fr))`, gridTemplateRows: `repeat(${zeilen}, minmax(0, 1fr))` }}
          >
            {p.einheiten.map((e) => (
              <li key={e.id} className={`lm2-kachel${e.alterMin != null ? " lm2-alt" : ""}`}>
                <div className="lm2-kopfzeile">
                  <span className="lm2-funkruf">{e.funkruf || e.typ || "–"}</span>
                  <span className="lm2-staerke-klein" title="Führer / Unterführer / Mannschaft = gesamt">
                    {e.fuehrer}/{e.unterfuehrer}/{e.mannschaft}
                    <b>= {e.fuehrer + e.unterfuehrer + e.mannschaft}</b>
                    {e.soll && <abbr className="lm-soll" title="Sollstärke, nicht gemeldet"> S</abbr>}
                  </span>
                </div>
                <div className="lm2-meta">
                  {[e.orga, e.ort].filter(Boolean).join(" · ")}
                </div>
                {(e.funkruf && e.typ) || e.zug ? (
                  <div className="lm2-meta">{[e.funkruf ? e.typ : "", e.zug].filter(Boolean).join(" · ")}</div>
                ) : null}
                {e.auftrag && <div className="lm2-auftrag">{e.auftrag}</div>}
                {e.alterMin != null && (
                  <div className="lm2-warn">⚠ {e.standAlt ? "Stand " : "Meldung "}{alterKurz(e.alterMin)}</div>
                )}
              </li>
            ))}
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
