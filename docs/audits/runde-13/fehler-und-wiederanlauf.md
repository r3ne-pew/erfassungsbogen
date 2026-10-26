# Audit „Fehler und Wiederanlauf", Runde 13 (Bedienfehler provozieren, selbst korrigieren)

Prüfer: Rollenaudit `thw-error-recovery-reviewer`
Datum: 2026-10-26
Zählung: **P0 0 · P1 0 · P2 0 · P3 2** (2 neue Befunde)

Prüfgegenstand: Web-App im Produktionsbuild auf `http://localhost:4173`, Code-Stand Commit `7637e61`
(`main` nach Runde 12). Reiner Prüfbericht, keine Codeänderung. Vorab gelesen:
`docs/audits/README.md`, `docs/audits/runde-12/README.md` und `docs/audits/runde-11/README.md`.
Die dort genannten Grenzen und Reste (R6-O9, R7-G4/M8, R7-G8/H9, R7-N1, R7-N9, R8-A1, R8-M6,
R9-M3, R9-G5, R8-H5/S4, leere Karten bei „Nur Stärke", Rückgängig für Meldungen ohne Überleben des
Neuladens, Tabellenzeilenhöhe bei 180 × 320, R11-S4, R11-H2, R11-K2, R11-A2, R11-A5, R11-M1, R11-M3,
R12-W3, R12-H3, R12-O2, R12-O4, R12-G3) wurden nicht neu gemeldet.

## Prüfaufbau

Playwright (globales Modul, `chromium.launch()` ohne Optionen; die Projektkopie fand keinen
Browser), `isMobile`/`hasTouch`, Locale de-DE, Dichte 2, Telefon 390 × 844. Neue Browser-Kontexte
je Lauf, Zustände durch Bedienung. Nichts installiert, kein Prozess beendet. Tastatureingaben
sowohl als Einfügen (`fill`) als auch zeichenweise (`pressSequentially`).
Nicht geprüft (nur 390 × 844): 360 × 640; echte Bildschirmtastatur, Kamera, Nahbereich, native Builds.

Geprüft: Zugehörigkeit (Telefon, E-Mail), Zeitraum (bis vor von, Leeren, Jahr 2062),
Einsatzbeginn/-ende, Personal (Namen einfügen mit Dubletten, Ziffern, Telefonzeilen;
Erreichbarkeit), Fahrzeuge (Kennzeichen doppelt, Sitzplätze), Sofortbedarf (Zahlen, Buchstaben,
Dezimalzeichen), Übersicht und Übergabe, Einsatz-Sammlung (manuell erfassen, Sollstärke,
Abrücken doppelt, Entfernen, Zug zuordnen, Stärke ändern mit Zahlendreher, Aufteilen, Verschieben,
Eintreffzeit), Browser-Zurück mit offenem Dialog, Neuladen mitten in der Erfassung, eigener
Entwurf gegen Einsatz-Erfassung, Dateien (Text, kaputtes JSON, fremdes Schema, abgeschnitten),
Datensicherung (Erstellen, falsche Datei, Einspielen eines älteren Stands).

## Urteil

Die Fehlerabsicherung hält. Alle Behebungen aus Runde 12 greifen in der laufenden App:

- R12-E1: Zeichenweise getippt wird „0171 1234567 / 0441 99" auf die erste Nummer gekürzt mit dem
  Satz „Zweite Nummer … nicht übernommen" (Schritt 1 und Erreichbarkeit); 20 Ziffern und 3 Ziffern
  lösen „stimmt die Nummer?" aus; „+49 (0) …" wird zu „+491711234567".
- R12-E2: „max@thw", „max@@thw.de", „a@b.de, c@d.de" und „abc" bekommen je einen eigenen Hinweis.
- R12-E3: „Zeitraum bis" leeren fällt auf den Wert zurück, kein 1900 mehr.
- R12-E4: Eintreffzeiten 2025, 20.10. und 25.10. fragen „Stimmt die Zeit?" („mehr als einen Tag vor
  der Aufnahme"), Zukunft ebenfalls; 05:59 am selben Tag wird still übernommen.
- R12-E5: Leerer Einsatz sagt „Noch keine Einheit im Einsatz — nichts zu sichern."
- Weiter bestätigt: Stärke ändern prüft Buchstaben, Minus, Dezimalzahl und 999999 mit klarem Satz
  und fragt bei 70 statt 7 („mehr als das Dreifache der bisherigen Stärke — stimmt das?"); Abrücken
  doppelt getippt bleibt einfach, „Rückgängig" steht daneben; „Meldung entfernen?" nennt die
  Folgen und fängt Browser-Zurück ab; eine angefangene Einsatz-Erfassung ersetzt den eigenen Bogen
  nur nach Rückfrage, der eigene Bogen liegt danach unter „Zuletzt geschlossener Bogen"; Neuladen
  mitten in der Erfassung stellt den Entwurf wieder her; fremde und beschädigte Dateien enden mit
  einem konkreten Satz; die Rückfrage beim Einspielen einer Sicherung stellt „geht verloren" und
  „in der Datei" gegenüber.

Der Helfer schafft alle geprüften Aufgaben ohne fremde Hilfe. Datenverlust im Hauptweg fand ich
nicht. Die zwei neuen Befunde sind kleine Unstimmigkeiten bei Zahleneingaben im Assistenten.

## Befunde

### R13-E1 [P3] Sofortbedarf: Beim Tippen einer Menge mit Buchstaben steht „nicht übernommen", gespeichert wird aber die Zahl bis zum Buchstaben

**Priorität:** P3

**Kennzeichnung:** gemessen (390 × 844, Schritt 5 „Sofortbedarf erfassen", zeichenweise Eingabe mit
`pressSequentially`, 60 bis 80 ms je Zeichen; Gegenprobe mit `fill`).

**Fundstelle / Aufgabe:** Schritt 5, Felder „Verpflegung (Personen)", „Diesel (l)", „Benzin (l)",
„Gemisch (l)".

**Beobachtung:** Getippt „5O" (Buchstabe O statt Null) im Feld „Diesel (l)": Nach dem Verlassen des
Feldes steht dort „5", darunter „Diesel (l): „5O“ ist keine Zahl — nicht übernommen." Die Übersicht
führt „5 l Diesel". Ebenso „7O5" in „Benzin": Feld „7", Satz „„7O5“ ist keine Zahl — nicht
übernommen.", Übersicht „7 l Benzin". „12x34" ergibt 12. Eingefügt (`fill`) wird dieselbe Eingabe
dagegen vollständig verworfen (Feld 0). Der Satz stimmt also nur für den Einfügeweg; beim Tippen
wurde ein Teil sehr wohl übernommen. Die Mengenfelder in „Stärke ändern" verhalten sich richtig
(„nicht lesbar: Mannschaft („71O")", nichts wird gespeichert).

**Erwartung der Rolle:** Entweder wird nichts gespeichert und das Feld bleibt leer, oder der Satz
sagt, was gespeichert wurde („„5O“ — übernommen wurde 5, bitte prüfen").

**Folge:** Wer 50 l Diesel anfordern will und „5O" tippt, liest „nicht übernommen", sieht aber „5"
im Feld; die Anforderung geht mit einem Zehntel der Menge zum Meldekopf, wenn er den Satz als
Hinweis auf ein leeres Feld liest. Die Abweichung ist im Feld sichtbar, deshalb nur P3.

**Empfehlung:** Tippen und Einfügen gleich behandeln; der Satz muss zum gespeicherten Wert passen
oder den übernommenen Teil nennen.

**Nachprüfung:** In Schritt 5 „Diesel (l)" zeichenweise „5O" tippen, Feld verlassen: Feld leer oder 0
mit „nicht übernommen", oder Satz „übernommen wurde 5". Ergebnis mit `fill` und mit Tippen gleich.

### R13-E2 [P3] Fahrzeug, Sitzplätze: Eine Zahl über 99 wird beim Tippen stillschweigend auf 99 gekürzt

**Priorität:** P3

**Kennzeichnung:** gemessen (390 × 844, Schritt 4, Feld „Sitzplätze").

**Fundstelle / Aufgabe:** Schritt 4 „Fahrzeuge", Feld „Sitzplätze" (Platzhalter „3 (Richtw.)").

**Beobachtung:** „250", „100" und eingefügt „250" ergeben 99; schon im Feld steht 99, es gibt
keinen Satz zur Kürzung. Es erscheint nur „LKW Kipper …: 99 Sitzplätze (Richtwert 3) — stimmt
das?"; dass die Eingabe verändert wurde, steht nirgends. Dagegen nennen die Mengenfelder im
Sofortbedarf eine Rundung („„1,5“ auf ganze Liter gerundet: 2."), und „Stärke ändern" nennt die
Grenze „von 0 bis 999".

**Erwartung der Rolle:** „Höchstens 99 Sitzplätze — „250" wurde auf 99 gekürzt."

**Folge:** Gering: Zahlen über 99 sind bei Sitzplätzen unrealistisch, der Wert 99 fällt über die
„stimmt das?"-Zeile auf. Bei einem Zahlendreher (z. B. „320" statt „32") liest der Helfer 99, ohne
zu wissen, dass seine Eingabe nicht angenommen wurde.

**Empfehlung:** Beim Kürzen denselben Satz wie bei der Rundung zeigen und die Grenze nennen.

**Nachprüfung:** „250" in „Sitzplätze" tippen und einfügen: Feld zeigt 99 und ein Satz nennt
Eingabe und Grenze.

## Nicht prüfbar oder nicht geprüft

- 360 × 640 und Dialoge in kleineren Fenstern: nicht erneut geprüft, die Befunde hängen nicht an
  der Breite.
- Echte Bildschirmtastatur (Autokorrektur, Ziffernblock): `pressSequentially` ersetzt sie nur
  teilweise; R13-E1 und R13-E2 sind deshalb als „gemessen mit simulierter Tastatur" zu lesen.
- Kamera-Scan, Nahbereich, native Builds.

## Abschluss

- **Aufgabe geschafft:** ja
- **Fremde Hilfe nötig:** nein
- **Größtes Missverständnis:** „nicht übernommen" im Sofortbedarf heißt beim Tippen „teilweise übernommen".
- **Größtes Einsatzrisiko:** Eine um eine Stelle zu kleine Menge im Sofortbedarf, weil der Hinweis zum Wert nicht passt.
- **Top-Priorität für die nächste Iteration:** R13-E1 — Satz und gespeicherter Wert der Mengenfelder im Sofortbedarf angleichen, Tippen wie Einfügen.
