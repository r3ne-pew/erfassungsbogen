/**
 * Schutz vor dem zweiten Tipp eines Doppeltipps an einer Stelle, an der
 * gerade etwas anderes erschienen ist.
 *
 * Mit Handschuh tippt man lieber zweimal, wenn man nicht sicher ist, ob der
 * erste Tipp ankam — und zwar bis zu einer Sekunde später. Nach „Abrücken"
 * lag dort aber „Wieder anwesend" (R2-G4 hatte den Gegenknopf eigens an
 * dieselbe Stelle gesetzt), oder die Quittungsleiste mit „Rückgängig" war
 * unter dem Finger aufgegangen. Beide sperrten nur 600 ms; ein zweiter Tipp
 * nach 700 oder 1 000 ms nahm das Abrücken still zurück (Audit Runde 3,
 * R3-S5, R3-G2). Jede Stelle einzeln länger zu sperren hätte auch den
 * bewussten Rückweg an anderer Stelle gebremst.
 *
 * Darum sperrt dieses Modul nicht Knöpfe, sondern den ORT: Nach einer
 * Handlung, die unter dem Finger etwas austauscht (`ortSperren`), nimmt die
 * App an dieser Bildschirmstelle für `ORTSSPERRE_MS` keinen Tipp an — gleich,
 * welcher Knopf dort inzwischen liegt. Ein Tipp daneben wirkt sofort.
 *
 * Tastatur-Klicks (`detail === 0`) und Klicks ohne Ort (Testumgebung ohne
 * Layout: 0/0) sperrt es nie.
 */

/**
 * So lange nimmt eine Karte nach „Abrücken"/„Wieder anwesend" keinen Tipp an.
 * Ein Doppeltipp mit Handschuh liegt bei 100–300 ms (Audit Runde 2, R2-G4);
 * wer bewusst zurücknehmen will, tippt nicht schneller als nach einer
 * halben Sekunde erneut.
 */
// Der Prüfstand (features/support/haken.ts) setzt ihn vor dem Laden auf 0 —
// Playwright tippt schneller nach, als es ein Finger je täte.
export const PRELLSCHUTZ_MS: number = (globalThis as { __EEB_PRELLSCHUTZ_MS?: number }).__EEB_PRELLSCHUTZ_MS ?? 600;

/**
 * Sperre einer Bildschirmstelle nach einem Austausch unter dem Finger. Der
 * zögernde zweite Tipp kam in den Messungen bis 1 000 ms nach dem ersten;
 * 1,5 s liegen deutlich darüber und bleiben kürzer als ein bewusster
 * Rückweg (Blick auf die Quittung, lesen, tippen). Mit abgeschaltetem
 * Prellschutz (Prüfstand) ebenfalls aus.
 */
export const ORTSSPERRE_MS: number =
  (globalThis as { __EEB_ORTSSPERRE_MS?: number }).__EEB_ORTSSPERRE_MS ?? (PRELLSCHUTZ_MS === 0 ? 0 : 1500);

/** Halbmesser der gesperrten Stelle: eine Fingerkuppe mit Handschuh samt Zittern. */
export const ORTSSPERRE_RADIUS_PX = 40;

/** Wie lange ein Tipp als „der Tipp eben" gilt, an dessen Ort gesperrt wird. */
const TIPP_FRISCH_MS = 1000;

interface Punkt {
  x: number;
  y: number;
  zeit: number;
}

/**
 * Eine gesperrte Stelle. `verlaengern`: Jeder dort verworfene Tipp schiebt das
 * Ende hinaus (höchstens bis `kappe`) — nach einer bestätigten Rückfrage hält
 * ein Tipp-Rhythmus von 0,5 bis 1 s sonst länger an, als die Sperre trägt
 * (R5-S3).
 */
interface Sperre {
  x: number;
  y: number;
  bis: number;
  kappe: number;
  verlaengern: boolean;
}

/** Obergrenze einer verlängerten Sperre, vom Beginn an gerechnet. */
const VERLAENGERN_KAPPE_MS = 4000;

let letzterTipp: Punkt | null = null;
let sperren: Sperre[] = [];

function mitOrt(e: MouseEvent): boolean {
  return e.detail > 0 && !(e.clientX === 0 && e.clientY === 0);
}

function sperreAn(x: number, y: number, jetzt: number): Sperre | undefined {
  sperren = sperren.filter((s) => s.bis >= jetzt);
  return sperren.find((s) => Math.hypot(x - s.x, y - s.y) <= ORTSSPERRE_RADIUS_PX);
}

/**
 * Ein verworfener Tipp zeigt sich: Der Knopf darunter bekommt kurz einen
 * Rahmen, und über dem Finger steht „Einen Moment …". Vorher sah ein
 * verworfener Tipp aus wie ein hängender Knopf, und wer im Takt von einer
 * Sekunde tippte, lernte nur, dass jeder zweite Tipp nichts tut (R5-S2,
 * R5-G5). Die Meldung fängt keinen Tipp ab und liegt nie unter dem Finger.
 */
const VERWORFEN_ANZEIGE_MS = 900;
let verworfenUhr: ReturnType<typeof setTimeout> | undefined;
let verworfenKnopf: Element | null = null;
function verworfenZeigen(e: MouseEvent): void {
  if (typeof document === "undefined") return;
  verworfenKnopf?.removeAttribute("data-tipp-gesperrt");
  const ziel = (e.target as Element | null)?.closest?.("button, a[href], summary, label, [role='button']") ?? null;
  ziel?.setAttribute("data-tipp-gesperrt", "");
  verworfenKnopf = ziel;
  let pille = document.getElementById("tipp-moment");
  if (!pille) {
    pille = document.createElement("div");
    pille.id = "tipp-moment";
    pille.className = "tipp-moment";
    pille.setAttribute("role", "status");
    pille.textContent = "Einen Moment …";
    document.body.appendChild(pille);
  }
  const breite = window.innerWidth || 360;
  pille.style.left = `${Math.round(Math.min(Math.max(e.clientX, 72), Math.max(72, breite - 72)))}px`;
  pille.style.top = `${Math.round(Math.max(8, e.clientY - 72))}px`;
  pille.hidden = false;
  clearTimeout(verworfenUhr);
  verworfenUhr = setTimeout(() => {
    verworfenKnopf?.removeAttribute("data-tipp-gesperrt");
    verworfenKnopf = null;
    if (pille) pille.hidden = true;
  }, VERWORFEN_ANZEIGE_MS);
}

function klickPruefen(e: MouseEvent) {
  if (!mitOrt(e)) return;
  const jetzt = Date.now();
  const s = sperreAn(e.clientX, e.clientY, jetzt);
  if (s) {
    if (s.verlaengern) s.bis = Math.min(Math.max(s.bis, jetzt + ORTSSPERRE_MS), s.kappe);
    e.preventDefault();
    e.stopImmediatePropagation();
    verworfenZeigen(e);
    return;
  }
  letzterTipp = { x: e.clientX, y: e.clientY, zeit: jetzt };
}

/** Ein Feld nimmt den Fokus schon beim Drücken — auch das an der gesperrten Stelle abfangen. */
function druckPruefen(e: MouseEvent) {
  if (!mitOrt(e) || sperren.length === 0) return;
  if (sperreAn(e.clientX, e.clientY, Date.now())) {
    e.preventDefault();
    e.stopImmediatePropagation();
  }
}

let installiert = false;
/** Einmal je Seite: der Prüfer sitzt vor React (Fenster, Einfangphase). */
export function tippSchutzInstallieren(): void {
  if (installiert || typeof window === "undefined") return;
  installiert = true;
  window.addEventListener("click", klickPruefen, true);
  window.addEventListener("mousedown", druckPruefen, true);
}
tippSchutzInstallieren();

/**
 * Die Stelle des Tipps eben für `ms` sperren. Aufzurufen von einer Handlung,
 * nach der unter dem Finger etwas anderes liegt — auch nach einer Rückfrage:
 * dann gilt der Ort des bestätigenden Tipps, oder `ort`, wenn die Handlung
 * die Stelle des auslösenden Knopfs selbst mitgibt (Person entfernen).
 * Mehrere Stellen können gleichzeitig gesperrt sein (auslösender Knopf und
 * Bestätigung der Rückfrage, R5-S3).
 */
export function ortSperren(
  ms: number = ORTSSPERRE_MS,
  ort?: { x: number; y: number },
  optionen: { verlaengern?: boolean } = {},
): void {
  if (ms <= 0) return;
  let stelle = ort;
  if (!stelle) {
    const t = letzterTipp;
    if (!t || Date.now() - t.zeit > TIPP_FRISCH_MS) return;
    stelle = t;
  }
  const jetzt = Date.now();
  const bis = jetzt + ms;
  const vorhanden = sperreAn(stelle.x, stelle.y, jetzt);
  if (vorhanden && Math.hypot(stelle.x - vorhanden.x, stelle.y - vorhanden.y) < 4) {
    vorhanden.bis = Math.max(vorhanden.bis, bis);
    vorhanden.verlaengern ||= optionen.verlaengern === true;
    vorhanden.kappe = Math.max(vorhanden.kappe, jetzt + VERLAENGERN_KAPPE_MS);
    return;
  }
  sperren.push({ x: stelle.x, y: stelle.y, bis, kappe: jetzt + VERLAENGERN_KAPPE_MS, verlaengern: optionen.verlaengern === true });
}

/** Ort des letzten Tipps (Bildschirmkoordinaten), solange er frisch ist. */
export function letzterTippOrt(): { x: number; y: number } | null {
  const t = letzterTipp;
  if (!t || Date.now() - t.zeit > TIPP_FRISCH_MS) return null;
  return { x: t.x, y: t.y };
}

/** Nur für Tests: Zustand zurücksetzen. */
export function tippSchutzZuruecksetzen(): void {
  letzterTipp = null;
  sperren = [];
  verworfenKnopf?.removeAttribute("data-tipp-gesperrt");
  verworfenKnopf = null;
  clearTimeout(verworfenUhr);
  if (typeof document !== "undefined") document.getElementById("tipp-moment")?.remove();
}

/**
 * Wie lange ein Teil des QR-Vollbilds im Bild stehen muss, bevor er als
 * „gezeigt" zählt (R5-S1): Ein Teil, der nur zwischen zwei Tipps aufblitzte,
 * kann die Gegenstelle nicht scannen. Mit abgeschaltetem Prellschutz
 * (Prüfstand) 0.
 */
let mindestzeigeMs: number = ORTSSPERRE_MS;
export function mindestzeigeDauer(): number {
  return mindestzeigeMs;
}
/** Für Tests: Mindestanzeigedauer setzen. Gibt den alten Wert zurück. */
export function mindestzeigeSetzen(ms: number): number {
  const alt = mindestzeigeMs;
  mindestzeigeMs = ms;
  return alt;
}
