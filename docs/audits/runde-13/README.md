# Rollenaudits, Runde 13 (Stand 26.10.2026)

Dreizehnte Prüfrunde nach der Behebung der Befunde aus [Runde 12](../runde-12/README.md).
Zwölf Prüfberichte, die elf THW-Rollen und die allgemeine Mobile-UI, alle gegen
den Produktionsbuild (`vite build` + `vite preview`, Port 4173), Code-Stand
Commit `7637e61` (Stand `main` nach Runde 12). Reine Prüfberichte ohne
Codeänderung.

Es gibt keine P0- und keine P1-Befunde. Doppelungen zwischen den Berichten
wurden nicht gefunden.

| Bericht | P0 | P1 | P2 | P3 |
| --- | --- | --- | --- | --- |
| [Neuer Nutzer](neuer-nutzer.md) | 0 | 0 | 0 | 2 |
| [Feldtauglichkeit](feldtauglichkeit.md) | 0 | 0 | 0 | 3 |
| [Arbeitsablauf](arbeitsablauf.md) | 0 | 0 | 1 | 5 |
| [Fehler und Wiederanlauf](fehler-und-wiederanlauf.md) | 0 | 0 | 0 | 2 |
| [Zerstörende Handlungen](zerstoerende-handlungen.md) | 0 | 0 | 1 | 3 |
| [Offline und Speicher](offline-und-speicher.md) | 0 | 0 | 2 | 2 |
| [Stress und Unterbrechung](stress-und-unterbrechung.md) | 0 | 0 | 0 | 3 |
| [Handschuh-Bedienung](handschuh-bedienung.md) | 0 | 0 | 1 | 2 |
| [Nacht und Sicht](nacht-und-sicht.md) | 0 | 0 | 0 | 1 |
| [Führungssicht](fuehrungssicht.md) | 0 | 0 | 1 | 1 |
| [Analog-first](analog-first.md) | 0 | 0 | 0 | 5 |
| [Mobile-UI](mobile-ui.md) | 0 | 0 | 0 | 3 |
| Summe | 0 | 0 | 6 | 32 |

## Stand der Behebung (26.10.2026)

Von 38 Befunden sind 34 behoben, 3 teilweise (R13-W1, R13-W6, R13-H1) und einer
(R13-E2) nicht reproduzierbar: Der Hinweis „Höchstens 99 — dein Wert 250 wurde auf
99 gesetzt." erscheint im Produktionsbuild bereits; ein Regressionstest ist
ergänzt. Bundle-Budget neu gesetzt (JavaScript gesamt 5 583 014 Byte,
Startbündel 1 181 213 Byte). Kein neuer Speicherschlüssel.

| Befund | Stand | Umsetzung |
| --- | --- | --- |
| O1 Sicherung einspielen | behoben | Bestand wird gemerkt und bei Fehler zurückgeschrieben, deutsche Meldung; eine Größenprüfung vorab ist nicht möglich (Kontingent nicht abfragbar) |
| O2, O3, O4 | behoben | Fehlerzeile im Bild, Rat bei leerem Papierkorb, „Neu laden" mit Rückfall nach 1,5 s (Erstbesuch-Szenario nicht nachgestellt) |
| D1 bis D4 | behoben | Rückfragen bei „Beginn entfernen", leerer Absenderkarte, Aufteilen ohne Rest, Vorlagenunterschiede |
| S1 bis S3 | behoben | Statuszeile nach Rückgängig, Schnellerfassung mit „In Einsatz-Sammlung ablegen…" zuerst, Entwurf von Zug und Auftrag bleibt beim Zurück |
| E1 | behoben | „Es gilt weiter 5." |
| E2 | nicht reproduzierbar | Regressionstest ergänzt |
| G1 | behoben | Sperre misst an der Ereigniszeit des Tipps |
| G2, G3 | behoben | 8 px Abstand bei Zug zuordnen und Kontaktverknüpfungen |
| W1 Folgemeldung nach Aufteilen | teilweise | Doppelte Personen erkannt, Weg „ohne Trupp"; die Vergleichsbasis in Dialog und Quittung ist noch uneinheitlich |
| W2 bis W5 | behoben | Abgerückte nicht „neu", gleiche Zählung auf der Startseite, Ernährungstext bei 0 Portionen, Zugfeld bei der Aufnahme |
| W6 Abschluss des Einsatzes | teilweise | Hinweis mit „Jetzt sichern"; ein Zustand „beendet" gehört ins Sammlungsmodell im Submodul |
| K1, K2 | behoben | Kraftstoffe vollständig, Lageblatt markiert ältere Meldungen |
| A1 bis A5 | behoben | Abrückzeit vom Zettel, Vermerk zur Bemerkung, Warnung bei nachgehender Uhr, Quittung bei älterer Datei, Summenzeile |
| H1 | teilweise | Kürzel zuerst, „BGr"-Schreibweisen; Knöpfe mit nächsten Typen fehlen |
| H2, H3 | behoben | Ortssuche trennerfrei, Autokorrektur aus |
| M1 bis M3, L1, N1, N2 | behoben | Kurzmarke „anon." in der Tabelle, weiche Trennstellen, Kopfzellen, Nachtschrift 12 px, Anleitung, ein Knopf „Vorbelegung entfernen" (Messung bei 390 px für M3 steht aus) |
