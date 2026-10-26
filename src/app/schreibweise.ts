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

/**
 * Ortsname für die Anzeige: Wörter, die im Verzeichnis zusammengezogen stehen („SchwäbischHall"), werden getrennt
 * („Schwäbisch Hall"). Kleinbuchstabe direkt vor Großbuchstabe ist in deutschen Ortsnamen sonst nie ein Wortinneres (R12-H3;
 * die Quelle liegt im Submodul und bleibt unverändert).
 */
export function ortAnzeige(ort: string): string {
  return (
    ort
      // „FrankfurtamMain", „MülheimanderRuhr", „ZehdenickOTOsterne": das Bindewort steht ohne Leerzeichen zwischen den Namen.
      .replace(/([a-zäöüß])(am|ander|auf|bei|ob|im|OT)(?=[A-ZÄÖÜ])/g, (_t, vor: string, wort: string) => `${vor} ${wort === "ander" ? "an der" : wort} `)
      // „BadNeuenahr", „SchwäbischHall": Kleinbuchstabe direkt vor Großbuchstabe.
      .replace(/([a-zäöüß])([A-ZÄÖÜ])/g, "$1 $2")
  );
}

/** Beginnt der Text (gefaltet) mit der Suche? */
export function beginntMit(text: string, suche: string): boolean {
  return falte(text).startsWith(falte(suche));
}

/**
 * Kennzeichen für die Anzeige (R12-N7): Großbuchstaben, Leerraum zusammengezogen, THW-Kennzeichen als „THW-80101“
 * („thw 80101“, „THW80101“, „thw–80101“ → „THW-80101“). Andere Kennzeichen behalten ihre Gliederung; ein Text, der
 * keine Zahl nach „THW“ trägt, wird nur groß geschrieben.
 */
export function kennzeichenSchreibweise(text: string): string {
  const gross = text.replace(/\s+/g, " ").trim().toUpperCase();
  const thw = /^THW[\s\-–—]*(\d{3,})$/.exec(gross);
  return thw ? `THW-${thw[1]}` : gross;
}
