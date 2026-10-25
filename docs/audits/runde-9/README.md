# Rollenaudits, Runde 9 (Stand 24.10.2026)

Neunte Prüfrunde nach der Behebung der Befunde aus [Runde 8](../runde-8/README.md).
Zwölf Prüfberichte, die elf THW-Rollen und die allgemeine Mobile-UI, alle gegen
den Produktionsbuild (`vite build` + `vite preview`, Port 4173), Code-Stand
Commit `c789947` (Stand `main` nach Runde 8). Jeder Prüfer hat zuerst ohne
Kenntnis der bisherigen Berichte getestet und danach festgehalten, welche
Behebungen aus Runde 8 halten.

Die Spalten zeigen die Zahlen der einzelnen Berichte. In der Summe zählt ein
Befund, den mehrere Prüfer selbst gemessen haben, einmal. Zusammengeführt sind:

- Lagemonitor bei 200 % Systemschrift (Beschriftungen groß, Zahlen klein, Wortbruch):
  R9-K2 (P2) mit R9-N2, R9-M1 und R9-H3 (je P3).
- Kasten für beiseitegelegte Daten (Fachjargon, Rückweg, schiebt „Neuen Bogen
  erstellen" aus dem Bild): R9-N4 mit R9-M6, R9-H4 und R9-S4 (je P3).
- Rohtext-Rettung bei vollem Speicher: R9-O1 (P2) mit R9-E5 (P3).
- Wahl-Rückfrage nicht bedienbar: R9-W1 (P2) mit R9-M2 (P3).
- Prellschutz nach dem Öffnen: R9-H5 mit R9-S2 (je P3).
- Dialog „Bogen übergeben" bei Zoom 200 %: R9-H1 (P2) mit R9-G2 (P3).
- Wortbruch des Ortes am Telefon: R9-K5 mit R9-L3 (je P3).
- Zwei-Fenster-Leiste ohne Richtung und Werte: R9-E3 mit R9-W2 (je P3).
- Rückwege nach „Entfernen": R9-D3 mit R9-S3 (je P3).

| Rolle | Bericht | Kennung | P0 | P1 | P2 | P3 |
| --- | --- | --- | --- | --- | --- | --- |
| Helfer ohne Einweisung | [neuer-nutzer.md](neuer-nutzer.md) | R9-N | 0 | 0 | 0 | 4 |
| Helfer im Feld | [feldtauglichkeit.md](feldtauglichkeit.md) | R9-H | 0 | 0 | 1 | 5 |
| Arbeitsablauf über mehrere Geräte | [arbeitsablauf.md](arbeitsablauf.md) | R9-W | 0 | 0 | 1 | 4 |
| Fehler und Wiederanlauf | [fehler-und-wiederanlauf.md](fehler-und-wiederanlauf.md) | R9-E | 0 | 0 | 2 | 5 |
| Zerstörende Handlungen | [zerstoerende-handlungen.md](zerstoerende-handlungen.md) | R9-D | 0 | 0 | 2 | 3 |
| Offline und Speicher | [offline-und-speicher.md](offline-und-speicher.md) | R9-O | 0 | 0 | 1 | 2 |
| Stress und Unterbrechung | [stress-und-unterbrechung.md](stress-und-unterbrechung.md) | R9-S | 0 | 0 | 1 | 3 |
| Handschuh-Bedienung | [handschuh-bedienung.md](handschuh-bedienung.md) | R9-G | 0 | 0 | 0 | 6 |
| Nacht und Sicht | [nacht-und-sicht.md](nacht-und-sicht.md) | R9-L | 0 | 0 | 0 | 5 |
| Führungssicht | [fuehrungssicht.md](fuehrungssicht.md) | R9-K | 0 | 0 | 2 | 4 |
| Analog first | [analog-first.md](analog-first.md) | R9-A | 0 | 0 | 1 | 5 |
| Mobile-UI (allgemein) | [mobile-ui.md](mobile-ui.md) | R9-M | 0 | 0 | 0 | 9 |
| Summe der Berichte | | | 0 | 0 | 11 | 55 |
| Summe ohne Doppelungen | | | 0 | 0 | 11 | 42 |

## Stand der Behebung (25.10.2026)

Alle 53 Befunde ohne Doppelungen bearbeitet: 51 behoben, 2 teilweise (R9-M3,
R9-G5), keiner offen. Offen bleibt aus Runde 6 die Grenze R6-O9. Bundle-Budget
erneut angehoben (Startbündel 1 198 089 → 1 222 070 Byte). Begleitdokumente
nachgezogen (Arc42, ISK, DSFA).

| Befund | Stand | Umsetzung |
| --- | --- | --- |
| E1 Komma und Minus verschwinden in Zahlenfeldern | behoben | `zahl-eingabe.ts`: „1,5" wird auf 2 gerundet mit Hinweis, „−5" abgelehnt mit Satz; für alle Zahlenfelder |
| D1 Schalter leeren Werte ohne Rückfrage | behoben | Rückfrage beim Ausschalten von „Sofortbedarf erfassen", Funkrufname merkt sich die Angaben |
| D2 „Sicherung einspielen" verschweigt Beiseitegelegtes | behoben | nennt es mit Zahl, eigener Haken, Weg „Vorher Sicherung erstellen…" |
| O1, E5 Rohtext-Rettung bei vollem Speicher | behoben | Hülle lässt kein Überschreiben zu, Startseite meldet „Speicher voll – beschädigte Daten nicht gesichert" |
| S1 manuelle Aufnahme verliert Zettel-Angaben | behoben | `fremd.zettel` im Entwurf |
| E2, S3, D3 Rückwege | behoben | Stapel von 20 für Meldungen (bis Neuladen), Fahrzeug und Ebene überleben das Neuladen |
| W1, M2 Wahl-Rückfrage | behoben | bis zu drei Wege im festen Fuß |
| K1 Sollstärke ohne Marke am Monitor | behoben | „davon n Sollstärke, nicht gemeldet" an Monitor und Kachel |
| K2, N2, M1, H3 Monitor bei 200 % Systemschrift | behoben | alle Größen an einer Basis, Zahl größer als Beschriftung |
| H1, G2 Dialog „Bogen übergeben" bei Zoom | behoben | Kopfzeile 24 % statt 53 %, Hauptaktion im Bild |
| A1, N4, M6, H4, S4 Kasten für beiseitegelegte Daten | behoben | verständlich, nennt Papier-Rückweg, schiebt „Neuen Bogen erstellen" nur noch bis y=558 |
| E4, O2, O3 | behoben | Aufräumen ersetzt den Originaltext, Monitor behält den letzten Stand, Absenderkarte beiseitegelegt |
| H5, S2, D4, D5, M7 | behoben | Sperre 600 ms nach Ansichtswechsel, „Einen Moment …" auf dem Knopf, Fokus auf der sicheren Wahl |
| E3, W2, E7, H2, G3, G6 | behoben | Werte und Semikolon in der Leiste, Satz zur ausgegrauten Wahl, keine Hinweise bei Vorbelegung, `inputmode` |
| K4, E6, A2, A3, W3, W5, N3, W4, A6 | behoben | Zug-Zählung, „2. Zug", Sollstärke in CSV/Excel, Vorbelegung gekennzeichnet, Umschrift, Weiter-Knopf, Texte |
| K5, L3, K6, L1, M9, L2, K3 Lagemonitor | behoben | Ort im Funkruf, Warnung Bernstein, Stufentasten „Dunkler/Heller", Schrift >= 14 px, Sprunglink |
| G1, N1, G4, M4, M5, M8, H6, L4, L5, A4, A5 Layout | behoben | siehe `stilregeln-r9-layout.test.ts`; `@media print`, ASCII-Dateinamen |
| M3 klebende Namensspalte bei 180 px | teilweise | höchstens 45 % statt 95 %; Bedienbarkeit beim Wischen nicht getestet |
| G5 feste Leisten bei Zoom | teilweise | Zwei-Fenster-Leiste 35 % gedeckelt, bei „Genauer" nicht in jedem Zustand |
