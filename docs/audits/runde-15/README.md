# Rollenaudits, Runde 15 (Stand 26.10.2026)

Fünfzehnte Prüfrunde nach der Behebung der Befunde aus [Runde 14](../runde-14/README.md).
Zwölf Prüfberichte, die elf THW-Rollen und die allgemeine Mobile-UI, alle gegen
den Produktionsbuild (`vite build` + `vite preview`, Port 4173), Code-Stand
Commit `a7874f0` (Stand `main` nach Runde 14). Reine Prüfberichte ohne
Codeänderung.

Es gibt keine P0- und keine P1-Befunde. Doppelungen zwischen den Berichten
wurden nicht gefunden.

| Bericht | P0 | P1 | P2 | P3 |
| --- | --- | --- | --- | --- |
| [Neuer Nutzer](neuer-nutzer.md) | 0 | 0 | 1 | 2 |
| [Feldtauglichkeit](feldtauglichkeit.md) | 0 | 0 | 0 | 3 |
| [Arbeitsablauf](arbeitsablauf.md) | 0 | 0 | 2 | 2 |
| [Fehler und Wiederanlauf](fehler-und-wiederanlauf.md) | 0 | 0 | 2 | 3 |
| [Zerstörende Handlungen](zerstoerende-handlungen.md) | 0 | 0 | 2 | 2 |
| [Offline und Speicher](offline-und-speicher.md) | 0 | 0 | 0 | 1 |
| [Stress und Unterbrechung](stress-und-unterbrechung.md) | 0 | 0 | 0 | 4 |
| [Handschuh-Bedienung](handschuh-bedienung.md) | 0 | 0 | 0 | 2 |
| [Nacht und Sicht](nacht-und-sicht.md) | 0 | 0 | 0 | 0 |
| [Führungssicht](fuehrungssicht.md) | 0 | 0 | 2 | 3 |
| [Analog-first](analog-first.md) | 0 | 0 | 1 | 4 |
| [Mobile-UI](mobile-ui.md) | 0 | 0 | 0 | 4 |
| Summe | 0 | 0 | 10 | 30 |

## Stand der Behebung (26.10.2026)

Von 40 Befunden sind 33 behoben, 6 teilweise (R15-E1, R15-E2, R15-D4, R15-S4,
R15-M2, R15-O1) und einer (R15-D2) nicht reproduzierbar: Das „Rückgängig" nach
„Meldung entfernen" überlebt den Wechsel der Ansicht im Browser und im Test; der
Text der Rückfrage nennt jetzt die tatsächliche Grenze (Neuladen oder Schließen).
Im echten Browser (Produktionsbuild, Playwright) bestätigt: R15-K2, K4, K5,
M1 bis M4, G1, G2, H1, W1, S2, N2, E1 bis E4, D1, O1, S1, S4, A5, W3. Bundle-Budget
neu gesetzt (JavaScript gesamt 5 611 774 Byte, Startbündel 1 195 940 Byte). Neue
Speicherschlüssel `eeb.import-laeuft.v1` und `eeb.papierabgleich.v1.<Einsatz-ID>`.

| Befund | Stand | Umsetzung |
| --- | --- | --- |
| A1 bis A3 | behoben | Kennzeichnung der Eintreffzeit bleibt nach „Stärke ändern…", „von Hand geändert" im Ausdruck, „*" auf der Übersichtsseite der Sammel-PDF |
| A4, A5 | behoben | Zwischenstand des Papierabgleichs im localStorage (3 Tage), Quittung für „Bogen als PDF" |
| W1, W3, W4 | behoben | Quittung des übersprungenen Doppelempfangs im Bild, Auftrag mit Rückgängig, „Neu laden" in den Dialogtexten |
| W2 | behoben | Tabelle trennt „Unterbr." und „WC" |
| E1 Ungültige Signatur | teilweise | Handscanner lehnt ab, übrige Wege fragen nach; Dateiimport mehrerer Bögen nimmt mit Warnsatz auf |
| E2 Falsche Absenderuhr | teilweise | bleibende Marke „Neuere Eingabe nicht übernommen"; kein Hinweis beim Einlesen eines alten Stands |
| E3 bis E5 | behoben | Teile-Meldungen, „Aufteilen…" im Bild, „THW-"-Kennzeichen mit falscher Ziffernzahl fragt nach |
| D1, D3 | behoben | nur die jüngste Quittung, ältere Datei löst keine Doppelwarnung aus |
| D2 | nicht reproduzierbar | Text der Rückfrage angepasst |
| D4 Herkunft nach „Als Übung kennzeichnen" | teilweise | Herkunft „am Meldekopf von Hand geändert"; Stand wird weiter auf die Kennzeichnung gesetzt |
| O1 Sammel-PDF-Zeit | teilweise | Zeitangabe nach Bogenzahl (gemessen 41 s bei 30 Bögen); keine Fortschrittsanzeige |
| S1, S3 | behoben | Hinweis „Import unterbrochen", Zurück-Geste räumt Hinweiszeilen |
| S2 | behoben | ab sechs neuen Einheiten Kurzfassung, „Zur Liste springen" |
| S4 | teilweise | Rückfrage im Schritt Fahrzeuge und Sofortbedarf; Abstand zu „Weiter →" 15,5 px |
| K1 bis K5 | behoben | Sortierung nach Stand/Eingang, Monitor kürzt nach ⚠, Ruhezeit je Zug, Warnfarbe nur am Alter, Auftrag am Telefon |
| H1 bis H3 | behoben | Quittungsleiste vierzeilig, Funkrufname ohne Klammerzusatz, Löschdialog |
| N1 bis N3 | behoben | Fahrzeuge starten auf „k. A.", Tabellen mit Wischhinweis und „Ausstattung (StAN)", Rückknopf nennt Schritt 4 |
| M1, M3, M4, G1, G2 | behoben | Rahmen der aufgeklappten Karte, Ansichtswahl als Überlagerung, unteilbare Bedarfsposten, Sperre 2,5 s, gleich breite Reiter |
| M2 Fußleiste | teilweise | einzeilig (75 px) bei 360x640 und 320x568; bei 390x844 und großer Schrift 128 px |
