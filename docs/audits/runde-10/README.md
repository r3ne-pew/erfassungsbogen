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
