# Rollenaudits, Runde 8 (Stand 24.10.2026)

Achte Prüfrunde nach der Behebung der Befunde aus [Runde 7](../runde-7/README.md).
Zwölf Prüfberichte, die elf THW-Rollen und die allgemeine Mobile-UI, alle gegen
den Produktionsbuild (`vite build` + `vite preview`, Port 4173), Code-Stand
Commit `3fee6e5` (Stand `main` nach Runde 7). Jeder Prüfer hat zuerst ohne
Kenntnis der bisherigen Berichte getestet und danach festgehalten, welche
Behebungen aus Runde 7 halten. Einige Prüfer haben beim Abgleich Überschriften
paralleler Runde-8-Berichte gesehen; das steht in ihren Berichten, die Befunde
stammen aus eigenen Messungen.

Die Spalten zeigen die Zahlen der einzelnen Berichte. Mehrere Berichte haben
denselben Befund selbst gemessen; in der Summe zählt er einmal, mit der
Priorität des ersten Fundes. Zusammengeführt sind:

- Beschädigte Einsatz-Sammlung wird still zu `[]`: R8-D1 (P1) mit R8-H1 (P2)
  und R8-O2 (P3); dazu R8-E1 (Vorlagen).
- Sprungmarke „Zum Inhalt springen" ragt bei großer Schrift ins Bild: R8-M1
  (P2) mit R8-O1 (P2), R8-G3 und R8-S1 (je P3).
- Rückfragen bei Zoom 200 % unbedienbar: R8-G1 (P2) mit R8-M2 (P2).
- Lagemonitor am Telefon, Spalten F/U/M außerhalb des Bildes: R8-K1 (P2) mit
  R8-N1, R8-H3 und R8-M4 (je P3).
- Lagemonitor am Fernseher, Restplatz unter „+ n weitere": R8-L1 (P2) mit
  R8-N2 (P3).
- Zwei-Fenster-Rückfrage nennt die Werte nicht: R8-N6 mit R8-E4 (je P3).
- Tipp-Sperre nach dem Öffnen eines Dialogs: R8-H5 mit R8-S4 (je P3).
- Kasten zum beiseitegelegten Bogen: R8-H4 mit R8-S2 (je P3).
- Fußleiste bei Zoom 200 %: R8-G2 mit R8-M3 (je P3).
- Musterung, klebende Leisten: R8-G4 mit R8-M10 (je P3).

| Rolle | Bericht | Kennung | P0 | P1 | P2 | P3 |
| --- | --- | --- | --- | --- | --- | --- |
| Helfer ohne Einweisung | [neuer-nutzer.md](neuer-nutzer.md) | R8-N | 0 | 0 | 0 | 7 |
| Helfer im Feld | [feldtauglichkeit.md](feldtauglichkeit.md) | R8-H | 0 | 0 | 1 | 4 |
| Arbeitsablauf über mehrere Geräte | [arbeitsablauf.md](arbeitsablauf.md) | R8-W | 0 | 0 | 1 | 5 |
| Fehler und Wiederanlauf | [fehler-und-wiederanlauf.md](fehler-und-wiederanlauf.md) | R8-E | 0 | 0 | 0 | 5 |
| Zerstörende Handlungen | [zerstoerende-handlungen.md](zerstoerende-handlungen.md) | R8-D | 0 | 1 | 1 | 4 |
| Offline und Speicher | [offline-und-speicher.md](offline-und-speicher.md) | R8-O | 0 | 0 | 1 | 1 |
| Stress und Unterbrechung | [stress-und-unterbrechung.md](stress-und-unterbrechung.md) | R8-S | 0 | 0 | 0 | 4 |
| Handschuh-Bedienung | [handschuh-bedienung.md](handschuh-bedienung.md) | R8-G | 0 | 0 | 1 | 5 |
| Nacht und Sicht | [nacht-und-sicht.md](nacht-und-sicht.md) | R8-L | 0 | 0 | 2 | 5 |
| Führungssicht | [fuehrungssicht.md](fuehrungssicht.md) | R8-K | 0 | 0 | 2 | 3 |
| Analog first | [analog-first.md](analog-first.md) | R8-A | 0 | 0 | 1 | 2 |
| Mobile-UI (allgemein) | [mobile-ui.md](mobile-ui.md) | R8-M | 0 | 0 | 2 | 8 |
| Summe der Berichte | | | 0 | 1 | 12 | 53 |
| Summe ohne Doppelungen | | | 0 | 1 | 9 | 41 |
