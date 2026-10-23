# Rollenaudits, Runde 7 (Stand 23.10.2026)

Siebte Prüfrunde nach der Behebung der Befunde aus [Runde 6](../runde-6/README.md).
Zwölf Prüfberichte, die elf THW-Rollen und die allgemeine Mobile-UI, alle gegen
den Produktionsbuild (`vite build` + `vite preview`, Port 4173), Code-Stand
Commit `a52f20a` (Stand `main` nach Runde 6). Jeder Prüfer hat zuerst ohne
Kenntnis der bisherigen Berichte getestet und danach festgehalten, welche
Behebungen aus Runde 6 halten. Die Summe zählt jeden Befund einmal; Verweise auf
Befunde anderer Berichte sind nicht doppelt gezählt.

Methodische Grenzen: Die Prüfer arbeiteten gleichzeitig am selben Server und im
selben Scratchpad. Mehrere haben dort Hilfsdateien anderer überschrieben und
sind in eigene Unterordner ausgewichen; ein Prüfer hat versehentlich mit `pkill`
Prozesse gleichen Namens beendet (Server 4173 blieb erreichbar). Befunde aus
Läufen mit nachgestellter Uhr sind in den Berichten als solche gekennzeichnet.
Nicht prüfbar waren echtes Drucken, Kamera-Scan, Handscanner, echte
Geräteuhr-Sprünge und Safari.

| Rolle | Bericht | Kennung | P0 | P1 | P2 | P3 |
| --- | --- | --- | --- | --- | --- | --- |
| Helfer ohne Einweisung | [neuer-nutzer.md](neuer-nutzer.md) | R7-N | 0 | 0 | 3 | 6 |
| Helfer im Feld | [feldtauglichkeit.md](feldtauglichkeit.md) | R7-H | 0 | 0 | 1 | 8 |
| Arbeitsablauf über mehrere Geräte | [arbeitsablauf.md](arbeitsablauf.md) | R7-W | 0 | 0 | 2 | 3 |
| Fehler und Wiederanlauf | [fehler-und-wiederanlauf.md](fehler-und-wiederanlauf.md) | R7-E | 0 | 0 | 2 | 6 |
| Zerstörende Handlungen | [zerstoerende-handlungen.md](zerstoerende-handlungen.md) | R7-D | 0 | 0 | 3 | 5 |
| Offline und Speicher | [offline-und-speicher.md](offline-und-speicher.md) | R7-O | 0 | 0 | 1 | 6 |
| Stress und Unterbrechung | [stress-und-unterbrechung.md](stress-und-unterbrechung.md) | R7-S | 0 | 0 | 1 | 4 |
| Handschuh-Bedienung | [handschuh-bedienung.md](handschuh-bedienung.md) | R7-G | 0 | 0 | 3 | 6 |
| Nacht und Sicht | [nacht-und-sicht.md](nacht-und-sicht.md) | R7-L | 0 | 0 | 2 | 2 |
| Führungssicht | [fuehrungssicht.md](fuehrungssicht.md) | R7-K | 0 | 0 | 6 | 3 |
| Analog first | [analog-first.md](analog-first.md) | R7-A | 0 | 0 | 1 | 3 |
| Mobile-UI (allgemein) | [mobile-ui.md](mobile-ui.md) | R7-M | 0 | 0 | 2 | 6 |
| Summe | | | 0 | 0 | 27 | 58 |

## Berichtsübergreifende Schwerpunkte

1. Geräteuhr-Sprung löscht die Sammlung (R7-D2, R7-O7, offen aus R6-O9): Halt
   gilt nur beim ersten Lesen; Warnung sagt „löscht nichts".
2. Papier-Abgleich verwirft Eingaben ohne Rückfrage (R7-S1, R7-G1).
3. „Für neuen Einsatz vorbereiten" ohne Rückfrage und ohne Rückgängig (R7-G2).
4. „Alle Daten löschen" in einem Fenster, Gegenfenster schreibt den Bogen zurück
   (R7-D1); Rückholplatz fasst nur einen Bogen (R7-D3).
5. „Nur Stärke" legt Sollzahlen ohne Hinweis als Meldung ab (R7-A1).
6. Stapelimport nennt mögliche Doppelungen nicht (R7-N1); unbrauchbare Einträge
   fehlen still (R7-N3, R7-E2); Hülle des beiseitegelegten Entwurfs wird
   abgewiesen (R7-E1).
7. Zwei-Fenster-Warnung und Rückfragen bei großer Schrift und im Querformat
   (R7-M2, R7-O1, R7-W1, R7-H1, R7-H9); Zwei-Fenster-Vergleich mit gleichen
   Ständen (R7-S2, R7-N6, R7-O2, R7-H3).
8. Lagemonitor: Tabelle unter der Bildkante, stille Kürzung der Bewegungen,
   Telefonansicht, Nacht-Modus (R7-K1, K2, L1, L2, L3, M6, G3).
9. „Bedarf:" bricht im Wort (R7-M1, G9, K7, N5).
10. Zwischensummen nach Zug, Übergabe ohne Funkrufname und Einsatzbeginn
    (R7-K4, R7-K5).
