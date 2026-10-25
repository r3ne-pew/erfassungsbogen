# Rollenaudits, Runde 10 (Stand 25.10.2026)

Zehnte Prüfrunde nach der Behebung der Befunde aus [Runde 9](../runde-9/README.md).
Zwölf Prüfberichte, die elf THW-Rollen und die allgemeine Mobile-UI, alle gegen
den Produktionsbuild (`vite build` + `vite preview`, Port 4173), Code-Stand
Commit `441811c` (Stand `main` nach Runde 9). Jeder Prüfer hat zuerst ohne
Kenntnis der bisherigen Berichte getestet und danach festgehalten, welche
Behebungen aus Runde 9 halten. Zehn der zwölf Prüfer waren am Nutzungslimit
abgebrochen und haben ihre gespeicherten Teilberichte nach der Rücksetzung
fortgesetzt; der Server wurde dazwischen neu gestartet, der Build blieb derselbe.

Die Spalten zeigen die Zahlen der einzelnen Berichte. In der Summe zählt ein
Befund, den mehrere Prüfer selbst gemessen haben, einmal. Zusammengeführt sind:

- Umbenennung „Name" → „Ort der Einheit (Pflicht)" auf `main`, Texte noch nicht
  nachgezogen: R10-N3 (P2) mit R10-H1, R10-O3, R10-E3 und R10-S4 (je P3). R10-M1
  (P2) betrifft dieselbe Stelle, aber das Sprungziel des Hinweises, und zählt
  eigens.
- Rückfrage „Nur Stärke melden?" nennt falsche Personenzahl: R10-N1 (P2) mit
  R10-H4 (P3).
- Schalter „Funkrufname" behält die Angaben nicht: R10-D2 mit R10-E2 (je P3).
- Zug aus der manuellen Aufnahme nicht normalisiert: R10-S1 (P2) mit R10-A1 (P2).
- Rückgängig für entfernte Meldungen endet mit dem Neuladen: R10-S3 mit R10-E5
  (je P3).
- Fehlerhinweis der Zahlenfelder in schmaler Spalte: R10-G3 mit R10-M4 (je P3).
- Kachel sieht wie ein Knopf aus: R10-G2 mit R10-M7 (je P3).

| Rolle | Bericht | Kennung | P0 | P1 | P2 | P3 |
| --- | --- | --- | --- | --- | --- | --- |
| Helfer ohne Einweisung | [neuer-nutzer.md](neuer-nutzer.md) | R10-N | 0 | 0 | 3 | 5 |
| Helfer im Feld | [feldtauglichkeit.md](feldtauglichkeit.md) | R10-H | 0 | 0 | 0 | 4 |
| Arbeitsablauf über mehrere Geräte | [arbeitsablauf.md](arbeitsablauf.md) | R10-W | 0 | 0 | 0 | 4 |
| Fehler und Wiederanlauf | [fehler-und-wiederanlauf.md](fehler-und-wiederanlauf.md) | R10-E | 0 | 0 | 1 | 5 |
| Zerstörende Handlungen | [zerstoerende-handlungen.md](zerstoerende-handlungen.md) | R10-D | 0 | 0 | 0 | 3 |
| Offline und Speicher | [offline-und-speicher.md](offline-und-speicher.md) | R10-O | 0 | 0 | 0 | 4 |
| Stress und Unterbrechung | [stress-und-unterbrechung.md](stress-und-unterbrechung.md) | R10-S | 0 | 0 | 1 | 4 |
| Handschuh-Bedienung | [handschuh-bedienung.md](handschuh-bedienung.md) | R10-G | 0 | 0 | 1 | 2 |
| Nacht und Sicht | [nacht-und-sicht.md](nacht-und-sicht.md) | R10-L | 0 | 0 | 1 | 4 |
| Führungssicht | [fuehrungssicht.md](fuehrungssicht.md) | R10-K | 0 | 0 | 3 | 3 |
| Analog first | [analog-first.md](analog-first.md) | R10-A | 0 | 0 | 1 | 3 |
| Mobile-UI (allgemein) | [mobile-ui.md](mobile-ui.md) | R10-M | 0 | 0 | 1 | 8 |
| Summe der Berichte | | | 0 | 0 | 12 | 49 |
| Summe ohne Doppelungen | | | 0 | 0 | 11 | 40 |

## Stand der Behebung (25.10.2026)

Alle 51 Befunde ohne Doppelungen bearbeitet: 43 behoben, 8 teilweise (R10-N1/H4,
R10-D1/S3/E5, R10-W3, R10-K6 behoben im Zusammenführen, R10-M2, R10-M3), keiner
offen. Offen bleibt aus Runde 6 die Grenze R6-O9. Bundle-Budget erneut angehoben
(Startbündel 1 222 070 → 1 228 110 Byte). Begleitdokumente nachgezogen.

| Befund | Stand | Umsetzung |
| --- | --- | --- |
| N3, H1, O3, E3, S4 Wortlaut „Ort der Einheit" | behoben | Warnzeile, Rückfrage mit Knopf „Zum Feld „Ort der Einheit"", Übersicht, Lageblatt, Hinweis am Funkrufnamen |
| M1 Hinweis springt auf Überschrift | behoben | Prüfpunkt trägt `feld-einheit-name`, Feld wird in die Bildmitte gerollt |
| S1, A1 Zug der manuellen Aufnahme | behoben | `nummerUndZugSetzen`, „Sammlung für Ziel" und „Aufteilen" nutzen `zugNormalisiert` |
| N2, S5 Zahlenfeld „20 l", Obergrenzen | behoben | „20 l" gelesen als 20; Liter 99999, Personen 9999, Sitzplätze 99 |
| N1, H4 „Nur Stärke melden?" | teilweise | Rückfrage nennt „Keine Person mit Namen, nur 9 vorbelegte Plätze"; leere Karten bleiben |
| E1 „Personal vollständig erfassen" | behoben | Rückfrage bei eigenen Zahlen, Rückgängig im Arbeitsspeicher |
| G1 Eingabetaste in der Kurz-Liste | behoben | Vorname → Nachname derselben Zeile |
| L1 Vorlage speichern bei Zoom | behoben | Feld wird bei Öffnen und Fokus in den Rumpf gerollt |
| K1 Alter der letzten Meldung | behoben | „(vor 5 Std 1 Min)", ab 60 Minuten mit ⚠, in Einsatzansicht und Kachel |
| K2 Filter klappt das Feld auf | behoben | Filter ohne Aufklappen, Seite rollt zu den Zählern |
| K3 „Ges." außerhalb des Rahmens | behoben | Zugspalte nur bei Zügen, „Ges." am Telefon vorn |
| K4, K5, H3, L3, L4, L5 Lagemonitor | behoben | Sollzeile in der Stärkebeschriftung, „S"-Marke, Bedarfszeile, Uhr mit Doppelpunkt, eigene Stufenleiste, neue Paletten, iOS-Kontrast 4,91:1 |
| K6 Wortwahl Bedarf | behoben | Kopfzeile, Lageblatt und Monitor „Ruhezeit 3 Einheiten", „Unterbringung 7 Personen" |
| D2, E2 Funkrufname | behoben | 15 Minuten im Sitzungsspeicher, kommt nach Schrittwechsel und Neuladen zurück |
| D3 „Liste leeren" | behoben | Rückfrage ab 4 Zeilen |
| D1, S3, E5 „Meldung entfernen" | teilweise | Rückfrage mit rund 40 Wörtern, Name im ersten Satz; Rückgängig überlebt das Neuladen nicht |
| E4, E6, W1, W2, H2, O1, O2, O4, A2, A3, A4, N4, N5 | behoben | „Nr. schon vergeben" vor der Stärke-Rückfrage, Importfehler verweisen auf Sammel-PDF, „(vereinfacht)" in PDF und Quittung, Druck mit Punkt-Texten, Soll im Dialog, gleiche Hinweise zusammengefasst, Verpflegung leer erklärt |
| W3 Weg nach dem Neuladen | teilweise | Nur Wortlaut angepasst |
| G3, M4, L2, N8, G2, M7, M6, M5, N7, N6, M8, W4, S2 | behoben | Hinweise über volle Breite, Meldung mit ⚠, Anzeige statt Feld, flache Kachel, 8 px Abstand, volle Feldbreite, „Gesamtübersicht" ohne Wortbruch, 12 px Abstand der Wege, Querformat mit Wegen rechts, Tipp-Sperre 0,9 s |
| M2 Tabelle bei 180x320 | teilweise | Kein Wortbruch mehr, Zeilen noch 75–96 px hoch |
| M3 Kopf der Einsatzansicht | teilweise | 22–32 % der Höhe, bei 180x320 40 %; „Bogen scannen…" dort unter dem Bild |
