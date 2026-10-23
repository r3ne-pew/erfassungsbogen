/**
 * Schreibweise der Zug-Zuordnung (Audit Runde 7, R7-K4): „1. Zug", „1.Zug" und
 * „1. zug" waren drei Züge mit je eigener Zwischensumme. Die Zuordnung gleicht
 * die Eingabe mit den schon vergebenen Zügen ab — ohne Rücksicht auf Groß- und
 * Kleinschreibung, Leerzeichen und Punkte — und übernimmt dann die vorhandene
 * Schreibweise. Neue Züge werden nur geglättet (Leerzeichen, Punkt nach der
 * führenden Zahl).
 */

/** Vergleichsschlüssel: klein, ohne Leerzeichen und Punkte. */
export function zugSchluessel(name: string): string {
  return name.toLocaleLowerCase("de-DE").replace(/[\s.]+/g, "");
}

/** Geglättete Schreibweise eines neuen Zuges: „1.Zug" → „1. Zug". */
function geglaettet(name: string): string {
  return name
    .trim()
    .replace(/\s+/g, " ")
    .replace(/^(\d+)\.\s*(?=\S)/, "$1. ");
}

/**
 * Die Schreibweise, mit der `eingabe` gespeichert wird: die eines vorhandenen
 * Zuges mit gleichem Schlüssel (häufigste zuerst), sonst die geglättete Eingabe.
 * Leer bleibt leer.
 */
export function zugNormalisiert(eingabe: string, vorhandene: Iterable<string | undefined>): string {
  const t = geglaettet(eingabe);
  if (!t) return "";
  const schl = zugSchluessel(t);
  const zaehler = new Map<string, number>();
  for (const v of vorhandene) {
    if (v && zugSchluessel(v) === schl) zaehler.set(v, (zaehler.get(v) ?? 0) + 1);
  }
  if (zaehler.size === 0) return t;
  return [...zaehler.entries()].sort((a, b) => b[1] - a[1])[0]![0];
}

/** Vorhandene Züge, einmal je Schreibweise, sortiert — Vorschlagsliste fürs Zugfeld. */
export function vorhandeneZuege(etiketten: Iterable<string | undefined>): string[] {
  const nach = new Map<string, string>();
  for (const e of etiketten) {
    if (!e) continue;
    const k = zugSchluessel(e);
    if (!nach.has(k)) nach.set(k, e);
  }
  return [...nach.values()].sort((a, b) => a.localeCompare(b, "de", { numeric: true }));
}
