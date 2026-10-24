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
