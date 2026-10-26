/**
 * Einsatz löschen, während für ihn eine Erfassung angefangen ist (R12-S1).
 *
 * Löscht jemand den Einsatz im selben Fenster, galt dafür die Meldung „in einem anderen Fenster in den Papierkorb
 * gelegt", und die Ansicht sprang ins Aufnahmeformular. Jetzt nennt die Rückfrage die angefangene Erfassung, die
 * Ansicht bleibt auf der Startseite, und die Meldung sagt, was aus der Erfassung wird. Der Entwurf heißt überall
 * „Erfassung einer fremden Einheit" (so auch der Kasten der Startseite).
 */

/** Zusatz der Rückfrage „Einsatz löschen?"; leer, wenn keine Erfassung für diesen Einsatz offen ist. */
export function loeschenErfassungSatz(erfassungName: string | undefined): string {
  if (!erfassungName) return "";
  return ` Die angefangene Erfassung einer fremden Einheit „${erfassungName}" bleibt als Entwurf auf der Startseite erhalten; sie lässt sich danach nur ablegen, wenn du den Einsatz aus dem Papierkorb zurückholst.`;
}

/** Meldung auf der Startseite nach dem eigenen Löschen. */
export function selbstGeloeschtMeldung(einsatzName: string, erfassungName: string): string {
  return `Einsatz „${einsatzName}" in den Papierkorb gelegt. Die angefangene Erfassung einer fremden Einheit „${erfassungName}" bleibt als Entwurf — oben auf der Startseite „Fortsetzen" oder „Verwerfen"; zum Ablegen vorher den Einsatz unter „Papierkorb Einsätze" zurückholen.`;
}
