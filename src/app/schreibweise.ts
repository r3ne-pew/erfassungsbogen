/**
 * Schreibweisen vergleichbar machen (R11-H1 bis R11-H3).
 *
 * Wer „Hassmersheim", „Muellheim" oder „Gruppenfuehrer" tippt, meint „Haßmersheim", „Müllheim" und
 * „Gruppenführer": ß/ss, ä/ae/a, ö/oe/o, ü/ue/u sind auf Schweizer und Hardware-Tastaturen, beim Diktat
 * und auf dem Zettel gleichwertig. Beide Seiten eines Vergleichs werden gefaltet.
 */

/** Klein, ohne Umlaut-Unterschiede (ä/ae/a, ö/oe/o, ü/ue/u, ß/ss), Whitespace kollabiert. */
export function falte(text: string): string {
  return text
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase()
    .replace(/ß/g, "ss")
    .replace(/ae/g, "a")
    .replace(/oe/g, "o")
    .replace(/ue/g, "u")
    .replace(/\s+/g, " ")
    .trim();
}

/** Die Wörter einer Suche, gefaltet: getrennt an Leerzeichen, „/" und Komma; ohne reine Satzzeichen. */
export function suchWoerter(suche: string): string[] {
  return falte(suche)
    .split(/[\s/,;]+/)
    .filter((w) => /[a-z0-9]/.test(w));
}

/**
 * Passt der Text zur Suche? Jedes Wort der Suche muss irgendwo im Text stehen, in beliebiger Reihenfolge:
 * „FGr Wasserschaden/Pumpen" findet „FGr WP – Fachgruppe Wasserschaden/Pumpen", obwohl Kürzel und Name
 * getrennt stehen. Eine Suche ohne Wörter passt nicht.
 */
export function passtZurSuche(text: string, suche: string): boolean {
  const woerter = suchWoerter(suche);
  if (woerter.length === 0) return false;
  const t = falte(text);
  return woerter.every((w) => t.includes(w));
}

/** Beginnt der Text (gefaltet) mit der Suche? */
export function beginntMit(text: string, suche: string): boolean {
  return falte(text).startsWith(falte(suche));
}
