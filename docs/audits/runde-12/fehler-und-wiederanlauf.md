# Audit „Fehler und Wiederanlauf", Runde 12 (Bedienfehler provozieren, selbst korrigieren)

Prüfer: Rollenaudit `thw-error-recovery-reviewer`
Datum: 26.10.2026
Zählung: **P0 0 · P1 0 · P2 1 · P3 4** (5 neue Befunde)

Prüfgegenstand: Web-App im Produktionsbuild auf `http://localhost:4173`, Code-Stand Commit `2c96abe`
(`main` nach Runde 11). Reiner Prüfbericht, keine Codeänderung. Vorab gelesen:
`docs/audits/README.md` und `docs/audits/runde-11/README.md`. Die dort genannten Grenzen und Reste
(R6-O9, R7-G4/M8, R7-G8/H9, R7-N1, R7-N9, R8-A1, R8-M6, R9-M3, R9-G5, R8-H5/S4, leere Karten bei
„Nur Stärke", Rückgängig für Meldungen ohne Überleben des Neuladens, Tabellenzeilenhöhe bei
180 × 320, R11-S4, R11-H2, R11-K2, R11-A2, R11-A5, R11-M1, R11-M3) wurden nicht neu gemeldet. Die
Sperre von rund einer Sekunde auf den Knöpfen der Rückfragen (R8-H5/S4) wurde bemerkt und nicht
gewertet; das Entfernen eines Funktions-Chips ohne Quittung gilt seit Runde 2 als vertretbar.

## Prüfaufbau

Playwright (`require('playwright')`, `chromium.launch()` ohne Optionen; die Projektkopie fand den
Browser nicht, verwendet wurde die globale Installation), `isMobile`/`hasTouch`, Locale de-DE,
Dichte 2. Telefon 390 × 844 und 360 × 640; Dialoge zusätzlich bei 320 × 568 und 640 × 360,
Drehung bei geöffnetem Dialog. Neue Browser-Kontexte je Lauf, Zustände durch Bedienung und durch
`localStorage`-Seeds aus `examples/thw/` (mit `uebung: false`, `stand` und Zeitraum auf heute). Es
wurde nichts installiert und kein Prozess beendet. Tastatureingaben liefen sowohl als Einfügen
(`fill`) als auch zeichenweise (`pressSequentially`), weil sich beide Wege in der App
unterschiedlich verhalten (siehe R12-E1).

Geprüft: Zugehörigkeit (Ortswechsel, Telefon, E-Mail), Datum und Zeiten (Zeitraum leeren, bis vor
von, Jahr 2062 und 2025, Eintreffzeit und Abrückzeit ändern, Lagemonitor-Beginn), Personen (Namen
einfügen mit Präfixen und Dubletten, Erreichbarkeit, Art-Wechsel, Person entfernen), Fahrzeuge
(Kennzeichen doppelt, Sitzplätze, Typwechsel nach Eingaben), Sofortbedarf (Zahlen, Freitext),
Übersicht und Übergabe (Doppeltipp, veralteter Einsatz, „Für neuen Einsatz vorbereiten", Vorlage
mit gleichem Namen, Bogen schließen und verwerfen), Browser-Zurück mit offenem Dialog und im
QR-Vollbild, Neuladen mitten in der Eingabe, zweites Fenster mit demselben Entwurf, Links
(vollständig, gekürzt, verändert, Müll), Einsatz-Sammlung (Dateien: Text, kaputtes JSON, Zufallsdaten,
doppelt, ältere Fassung; Stärke ändern, Aufteilen, Abrücken doppelt, Eintreffzeit, Filter ohne
Treffer, Löschen in den Papierkorb, Exporte bei leerem Einsatz), Datensicherung, Geräteschlüssel,
„Alle Daten löschen", Absenderkarte, Schnellerfassung.

## Urteil

Die Fehlerabsicherung ist ausgereift. Die Behebungen aus Runde 11 halten bis auf eine Lücke
(R12-E1): Ortswechsel nach Verzeichnis-Ergänzung (Hinweis „Ort geändert … Angaben von Freiburg
entfernen"), Art-Wechsel mit Rückfrage („Nummer … geht verloren?", Mobil nach Festnetz behält die
Nummer), Namenspräfixe („van der Berg", „von der Heide-Müller") samt „Reihenfolge prüfen",
Freitext-Hinweis („allein dieser Text füllt etwa 7 Code-Teile"), „Jahr prüfen" am Lagemonitor-Beginn,
Kenntnisnahme mit Rückgängig, Rückfragen bei Stärke 0 und bei erster Person. Bestätigt gut:
Doppeltipp auf „Weiter", „Abrücken" und „PDF erzeugen" bleibt einfach; ein zweites Fenster mit
demselben Entwurf wird mit „Hier wird nichts gespeichert … Anderen Stand laden" gestoppt; ein
gekürzter oder veränderter Link endet mit dem Satz „unterwegs abgeschnitten"; Aufteilen verweigert
„Beim Rest bliebe nichts übrig"; Drehen bei offenem Dialog behält die Eingabe; Neuladen verliert
auch ungespeicherten Text nicht.

Eine Datenverlust-Strecke im Hauptweg fand ich nicht. Die neuen Befunde betreffen die Angaben, über
die der Meldekopf zurückruft (Telefon, E-Mail), und Zeitfelder, die nur in eine Richtung geprüft
werden. Der Helfer schafft alle Aufgaben ohne fremde Hilfe, kann aber eine falsche Rückrufnummer auf
den Bogen bringen, ohne es zu merken.

## Befunde

### R12-E1 [P2] Telefonfelder: Die Behebung von R11-E3 greift nur beim Einfügen; beim Tippen verschmelzen zwei Nummern zu einer, und „(0)" bleibt stehen

**Priorität:** P2

**Kennzeichnung:** gemessen (390 × 844, zeichenweise Eingabe mit `pressSequentially`, 15 bis 40 ms je
Zeichen; Gegenprobe mit `fill`).

**Fundstelle / Aufgabe:** Schritt 1 „Telefon" der Zugehörigkeit (`input[type=tel]`) und Schritt 3,
„+ Erreichbarkeit", Feld „Nummer".

**Beobachtung:** Beim Einfügen von „0171 1234567 / 0441 99" bleibt nur die erste Nummer stehen, mit
Hinweis „Zweite Nummer „0441 99" nicht übernommen — eine Nummer je Zeile, weitere über „+ Kontakt"
anlegen." Wer dieselbe Zeile zeichenweise eintippt (so arbeitet jede Bildschirmtastatur),
bekommt dagegen die verschmolzene Nummer und keinerlei Hinweis:

| Eingabe (getippt) | Feldinhalt | Hinweis |
| --- | --- | --- |
| `0171 1234567 / 0441 99` | `01711234567044199` | keiner |
| `0171 1234567 oder 0441 998877` | `017112345670441998877` | keiner |
| `0171-1234567 (Handy), 0441-99887` | `01711234567044199887` | keiner |
| `+49 (0) 171 1234567` | `+4901711234567` | keiner |
| `01711234567890123456` (20 Ziffern) | unverändert | keiner |

Beim Tippen von „/" oder Buchstaben wird das Zeichen stillschweigend verworfen; die nächste Ziffer
hängt an die erste Nummer an. In der Übersicht steht dann „Teststadt · 01711234567044199". Bei
Person und Erreichbarkeit verhält es sich gleich (dort erscheint nur bei Buchstaben, etwa „Nur Ziffern
übernommen („c" entfernt)", ein Hinweis).

**Erwartung der Rolle:** Was ich auf dem Zettel lese und eintippe, steht so auf dem Bogen oder die
App sagt mir, dass es nicht passt. Das Ergebnis darf nicht davon abhängen, ob ich getippt oder
eingefügt habe.

**Folge:** Die Rückrufnummer auf Bogen, PDF und Meldekopf ist falsch (17 bis 21 Ziffern, nicht
wählbar oder Fremdanschluss), ohne dass der Helfer es sieht. Es fällt erst beim Rückruf auf. Das ist
genau die Gefahr, die R11-E3 beheben sollte; sie besteht für den üblichen Eingabeweg fort. Die
Prüfpunkte „zu kurz" (unter sechs Ziffern) bleiben unberührt.

**Empfehlung:** Dieselbe Regel wie beim Einfügen auch beim Tippen anwenden: Trennzeichen zwischen
Zifferngruppen („/", „oder", Komma, Semikolon) beim Verlassen des Feldes als zweite Nummer erkennen
und ansprechen; bei mehr als etwa 15 Ziffern „stimmt die Nummer?" zeigen; bei „+49 (0)" die „(0)"
entfernen oder nachfragen.

**Nachprüfung:** „0171 1234567 / 0441 99" zeichenweise in Schritt 1 „Telefon" und in der
Erreichbarkeit eintippen: Hinweis auf zweite Nummer wie beim Einfügen, Feld enthält nur die erste
Nummer. 20 Ziffern: Prüfpunkt. „+49 (0) 171 1234567": „+491711234567" oder Rückfrage.

### R12-E2 [P3] E-Mail-Prüfung uneinheitlich: Schritt 1 und Schritt 3 prüfen nur auf „@"; die Absenderkarte warnt strenger, übernimmt die Adresse aber trotzdem

**Priorität:** P3

**Kennzeichnung:** gemessen (390 × 844).

**Fundstelle / Aufgabe:** Schritt 1 „E-Mail" je Ebene, Schritt 3 „Erreichbarkeit" mit Art „E-Mail",
Startseite „Absender für übergebene Bögen" → „Name/Kontakt hinterlegen…".

**Beobachtung:** In Schritt 1 und 3 löst nur eine Eingabe ohne „@" den Hinweis „E-Mail „abc" ohne „@"
— stimmt das?" aus. Ohne jeden Hinweis bleiben „max@thw", „max@@thw.de", „max @thw.de" und
„a@b.de, c@d.de" (zwei Adressen in einem Feld) stehen, auch in der Übersicht. Die Absenderkarte
erkennt „max@thw" dagegen als „Die E-Mail-Adresse sieht unvollständig aus.", lässt „Übernehmen" aber
zu; danach steht „Absender: Max M · max.mustermann@thw · +49 171 123 45 67" ohne Zeichen des
Zweifels, und die Angabe bleibt nach dem Neuladen erhalten.

**Erwartung der Rolle:** Eine Adresse, die die App selbst „unvollständig" nennt, wird nicht stumm
übernommen; dieselbe Prüfung gilt an allen drei Stellen.

**Folge:** Der Rückkanal, den der Meldekopf bei Rückfragen nutzt, kann falsch sein; bei der
Absenderkarte reist er „mitsigniert" in jedem QR-Code, Link und PDF mit und kann vom Absender selbst
nicht mehr als zweifelhaft erkannt werden. Kein Datenverlust.

**Empfehlung:** Die Absenderprüfung (fehlende Domain-Endung, Leerzeichen, mehrere Adressen) auch in
Schritt 1 und 3 anwenden; bei der Absenderkarte vor dem Übernehmen einmal nachfragen („Adresse
„max.mustermann@thw" sieht unvollständig aus — trotzdem übernehmen?").

**Nachprüfung:** „max@thw" in Schritt 1, in Schritt 3 und in der Absenderkarte eintragen: an allen
drei Stellen derselbe Hinweis, in der Absenderkarte eine Rückfrage vor dem Übernehmen.

### R12-E3 [P3] Datumsfeld „Zeitraum von/bis" leeren setzt stillschweigend 01.01.1900; der Hinweis spricht von „Tippfehler im Jahr 1900"

**Priorität:** P3

**Kennzeichnung:** gemessen (390 × 844, Schritt 2; das Leeren entspricht „Löschen" im Datumsdialog
des Telefons).

**Fundstelle / Aufgabe:** Schritt 2 „Zeitraum von" und „Zeitraum bis (Vorschlag: wie Beginn)".

**Beobachtung:** „von" leeren: beide Felder zeigen 1900-01-01 (gespeichert `zeitraumVon` und
`zeitraumBis` = −43829), Hinweise „Einsatzzeitraum 01.01.1900 ist vorbei — gilt dieser Bogen noch für
den aktuellen Einsatz?" und „… liegt mehr als ein Jahr entfernt — Tippfehler im Jahr?". Nur „bis"
leeren: „bis" springt auf 1900-01-01, „von" bleibt, Hinweis „„bis" liegt vor „von" — 01.01.1900 liegt
mehr als ein Jahr entfernt, Tippfehler im Jahr 1900?". In der Übersicht steht „26.10.2026 –
01.01.1900"; die Übergabe fragt „Dieser Bogen gehört zum Einsatz 26.10.2026 – 01.01.1900 — gilt er
noch?" und bleibt „trotzdem möglich".

**Erwartung der Rolle:** Wer ein Datum löscht, um neu zu tippen, erwartet ein leeres Feld oder den
Rückfall auf den Vorschlag („wie Beginn", wie die Beschriftung selbst sagt) und keinen Wert aus
einem anderen Jahrhundert.

**Folge:** Der Fehler ist durch die Hinweise sichtbar, aber die Hinweise nennen eine falsche Ursache
(„Tippfehler im Jahr 1900"), und ein Bogen mit Zeitraum 1900 lässt sich übergeben. Am Meldekopf
erscheint die Einheit als „Zeitraum vorbei".

**Empfehlung:** Leeres „bis" auf den Tag von „von" zurücksetzen (wie im Feldtext versprochen); leeres
„von" auf heute oder mit eigener Meldung („Datum fehlt") behandeln.

**Nachprüfung:** „bis" im Datumsfeld löschen: das Feld zeigt wieder den Tag von „von", kein Hinweis auf
1900.

### R12-E4 [P3] Eintreffzeit in der Einsatz-Sammlung: Zukunft wird abgefangen, Vergangenheit nicht (Jahr und Monat/Tag-Dreher)

**Priorität:** P3

**Kennzeichnung:** gemessen (390 × 844, Karte → „ändern" hinter „eingetroffen").

**Fundstelle / Aufgabe:** Einsatz-Sammlung, aufgeklappte Karte, „eingetroffen … ändern", Feld
„Eingetroffen am".

**Beobachtung:** Eintreffzeit 26.10.2062 oder 26.10.2026, 23:09 (später als jetzt): Rückfrage „Stimmt
die Zeit? … liegt in der Zukunft — Tag oder Monat vertauscht?". Eintreffzeit 26.10.2025, 26.10.2024,
20.10.2026 oder 24.10.2026 für eine Einheit, die gerade aufgenommen wurde: wird ohne Rückfrage
gespeichert, die Karte zeigt „eingetroffen 26.10.2024, 03:09". Die Abrückzeit wird dagegen in beide
Richtungen geprüft („liegt vor dem Eintreffen"), der Lagemonitor-Beginn ebenfalls („liegt 366 Tage
zurück (2025). Jahr prüfen").

**Erwartung der Rolle:** Derselbe Zahlendreher wird in beide Richtungen gefangen; eine Eintreffzeit,
die zwei Jahre vor dem Einsatzzeitraum liegt, ist ein Tippfehler im Jahr.

**Folge:** Die Zeit steht in Karte, Lageblatt, CSV und Sammel-PDF, steuert „neu"/„alt" und die
Sortierung „Eintreffzeit vor Ort"; ein Dreher im Jahr oder bei Tag und Monat bleibt unbemerkt.

**Empfehlung:** Dieselbe Rückfrage auch für Zeiten, die mehr als etwa einen Tag vor der Aufnahme und
vor dem Einsatzzeitraum liegen („Jahr prüfen" wie am Lagemonitor).

**Nachprüfung:** Eintreffzeit auf 26.10.2025 setzen: Rückfrage „Stimmt die Zeit?"; „Zeit korrigieren"
lässt den alten Wert stehen.

### R12-E5 [P3] „Einsatz weitergeben / sichern" in einem leeren Einsatz: Die Meldung behauptet ein früheres Sammel-PDF

**Priorität:** P3

**Kennzeichnung:** gemessen (frisch angelegter Einsatz ohne Einheit).

**Fundstelle / Aufgabe:** Einsatzansicht, „Einsatz weitergeben / sichern".

**Beobachtung:** Der Knopf erzeugt keine Datei und meldet „Seit dem letzten Sammel-PDF ist kein Bogen
neu dazugekommen und nichts geändert." Es gab kein letztes Sammel-PDF; der Einsatz enthält keine
Einheit. „Lageblatt (A4 quer)", „Übersicht als CSV", „Alle Daten als CSV" und die Excel-Liste
erzeugen dagegen ohne Hinweis Dateien ohne Zeilen.

**Erwartung der Rolle:** „Noch keine Einheit im Einsatz — nichts zu sichern."

**Folge:** Wer den Einsatz auf ein zweites Gerät übertragen will (Hinweis im Text: „auch wenn alle
abgerückt sind"), liest „es wurde schon gesichert" und rechnet mit einer Datei, die nicht existiert.
Folgen sind klein, weil der Einsatz leer ist; im Ablauf „Einsatz anlegen, dann sofort weitergeben"
kommt das aber vor.

**Empfehlung:** Bei leerem Einsatz eigener Satz, und die vier anderen Ausgaben ebenfalls („keine
Einheit — leere Datei erzeugt?").

**Nachprüfung:** Neuer Einsatz, „Einsatz weitergeben / sichern": Meldung nennt den leeren Einsatz.

## Nicht prüfbar

Kamera-Scan, echte Bildschirmtastatur (die Zeichenfolgen wurden simuliert), Nahbereichs-Übergabe,
Excel (E-Mail-/Telefonspalten in CSV nicht erneut geöffnet; R11-E7 bleibt eine Risikostelle),
native Builds.

## Aufgabe und Einschätzung

- **Aufgabe geschafft:** ja
- **Fremde Hilfe nötig:** nein
- **Größtes Missverständnis:** Die Hinweise zu Telefonnummern („Zweite Nummer nicht übernommen")
  erscheinen nur beim Einfügen; wer tippt, glaubt an eine geprüfte Nummer.
- **Größtes Einsatzrisiko:** Eine verschmolzene oder unvollständige Rückrufangabe (Telefon, E-Mail)
  auf dem Bogen, die erst beim Rückruf auffällt.
- **Top-Priorität für die nächste Iteration:** Die Telefon- und E-Mail-Regeln an allen Eingabestellen
  gleich und unabhängig davon anwenden, ob getippt oder eingefügt wurde (R12-E1, R12-E2).
