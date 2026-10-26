/**
 * Telefonfelder ehrlich behandeln (R11-E3).
 *
 * Die Felder behalten nur Ziffern. Das ging bisher still: „+49 171 …" verlor das Pluszeichen („49171…" ist aus
 * dem Inland nicht wählbar), „0171 1234567 / 0441 99" wurde zu einer einzigen Ziffernfolge, und zu kurze Nummern
 * fielen nicht auf. Jetzt bleibt ein führendes „+" erhalten, eine zweite Nummer wird nicht in die erste
 * hineingezogen (und genannt), entfernte Zeichen werden angesagt, und eine auffällig kurze Nummer bekommt den
 * „stimmt das?"-Hinweis nach dem Verlassen des Feldes.
 */

export interface TelefonEingabe {
  /** Der Wert, der gespeichert wird: Ziffern, ggf. mit führendem „+". */
  wert: string;
  /** Satz für den Helfer, wenn etwas entfernt oder abgetrennt wurde; sonst leer. */
  hinweis: string;
}

/** Trenner zwischen zwei Nummern: Komma, Semikolon, senkrechter Strich, Schrägstrich, „oder", „und". */
const TRENNER = /\s*(?:[,;|]|\/|\boder\b|\bund\b)\s*/giu;
/** Zeichen, die auf dem Zettel zur Nummer gehören dürfen, ohne dass ihr Verschwinden eine Meldung braucht. */
const SCHREIBWEISE = /[\s\-–/().]/gu;
/** Unter so vielen Ziffern fragt die App nach („0171 12"). */
export const TELEFON_MIN_ZIFFERN = 7;

const ziffern = (s: string): string => s.replace(/\D/gu, "");

/** Der Ziffernteil einer Eingabe samt führendem „+" (nur am Anfang, sonst fiele es mitten in der Nummer an). */
function nurNummer(teil: string): string {
  const plus = teil.trimStart().startsWith("+");
  const z = ziffern(teil);
  return plus ? `+${z}` : z;
}

/** Wo beginnt eine zweite Nummer? Index des Trenners und Ende des Trenners; `undefined`, wenn es nur eine ist. */
function zweiteNummer(roh: string): { von: number; bis: number } | undefined {
  for (const m of roh.matchAll(TRENNER)) {
    const von = m.index ?? 0;
    const bis = von + m[0].length;
    const davor = ziffern(roh.slice(0, von)).length;
    // „0441/99887": der Schrägstrich hinter der Vorwahl trennt keine Nummern.
    const mindestens = m[0].includes("/") ? 7 : 5;
    if (davor >= mindestens && /^[+\d(]/u.test(roh.slice(bis))) return { von, bis };
  }
  return undefined;
}

/** Bereinigt das, was in ein Telefonfeld getippt oder eingefügt wurde. */
export function telefonBereinigen(roh: string): TelefonEingabe {
  const z = zweiteNummer(roh);
  const erste = z ? roh.slice(0, z.von) : roh;
  const rest = z ? roh.slice(z.bis) : "";
  const wert = nurNummer(erste);
  const saetze: string[] = [];
  // Entfernt wurde, was weder Ziffer noch übliche Schreibweise noch das führende „+" ist („0441 abc").
  const fremd = erste
    .trimStart()
    .replace(/^\+/u, "")
    .replace(/\d/gu, "")
    .replace(SCHREIBWEISE, "")
    .replace(/\+/gu, "")
    .trim();
  if (fremd) saetze.push(`Nur Ziffern übernommen („${fremd}" entfernt).`);
  else if (/\+/u.test(erste.trimStart().slice(1))) saetze.push("Das „+“ gilt nur am Anfang; es wurde entfernt.");
  if (z && ziffern(rest)) {
    saetze.push(
      `Zweite Nummer „${rest.trim()}" nicht übernommen — eine Nummer je Zeile, weitere über „+ Kontakt“ anlegen.`,
    );
  }
  return { wert, hinweis: saetze.join(" ") };
}

/** Satz für eine auffällig kurze Nummer (nach dem Verlassen des Feldes); leer, wenn sie passt oder leer ist. */
export function telefonKurzHinweis(wert: string | undefined): string {
  const n = ziffern(wert ?? "").length;
  if (n === 0 || n >= TELEFON_MIN_ZIFFERN) return "";
  return `Nur ${n} Ziffer${n === 1 ? "" : "n"} — stimmt die Nummer? Der Meldekopf ruft hier zurück.`;
}

/**
 * Nummer für Tabellenprogramme: Eine reine Ziffernfolge wandelt Excel in eine Zahl und streicht die führende
 * Null (R11-E7). Mit „Tel. " davor bleibt sie Text, wie die Kontakte der Personen („Mobil: 0171 …").
 */
export function telefonAlsTabellenText(wert: string | undefined): string {
  const w = wert?.trim() ?? "";
  return /^\+?\d+$/u.test(w) ? `Tel. ${w}` : w;
}
