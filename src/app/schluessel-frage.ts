/**
 * Text der Rückfrage „Geräteschlüssel neu erzeugen?" (Fußzeile). Ohne vorhandenen Schlüssel wird nichts gelöscht;
 * dann gehören weder die Warnung vor dem „alten" Schlüssel noch der rote Gefahrenknopf in den Dialog (R12-D3).
 */

export interface SchluesselFrage {
  titel: string;
  /** Erster Absatz. */
  erster: string;
  /** Zweiter Absatz (Kurzform abgleichen, alter öffentlicher Schlüssel); `null`, wenn es keinen alten Schlüssel gibt. */
  folgen: { fett: string; rest: string } | null;
  /** Beschriftung des bestätigenden Knopfes. */
  neuLabel: string;
  /** Roter Gefahrenknopf nur, wenn etwas gelöscht wird. */
  gefahr: boolean;
}

export function schluesselFrage(hatSchluessel: boolean): SchluesselFrage {
  if (!hatSchluessel) {
    return {
      titel: "Geräteschlüssel erzeugen?",
      erster: "Auf diesem Gerät liegt noch kein Signaturschlüssel; es wird ein neues Schlüsselpaar erzeugt, gelöscht wird nichts.",
      folgen: null,
      neuLabel: "Schlüssel jetzt erzeugen",
      gefahr: false,
    };
  }
  return {
    titel: "Geräteschlüssel neu erzeugen?",
    erster:
      "Der bisherige Signaturschlüssel dieses Geräts wird gelöscht und durch ein neues Schlüsselpaar ersetzt. " +
      "Sinnvoll ist das bei Verdacht, dass der private Schlüssel in fremde Hände geraten ist — etwa nach Verlust oder Weitergabe des Geräts.",
    folgen: {
      fett: "Empfänger müssen die Kurzform danach neu abgleichen:",
      rest:
        " Bögen von diesem Gerät tragen ab sofort eine andere Kurzform. Bereits verschickte Bögen bleiben gültig und prüfbar — " +
        "aber nur gegen den alten öffentlichen Schlüssel, und der lässt sich danach nur aus einer früheren Sicherungsdatei wiederherstellen.",
    },
    neuLabel: "Neu erzeugen",
    gefahr: true,
  };
}
