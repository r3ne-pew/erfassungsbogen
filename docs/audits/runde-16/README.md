# Rollenaudits, Runde 16 (Stand 26.10.2026)

Sechzehnte Prüfrunde nach der Behebung der Befunde aus [Runde 15](../runde-15/README.md).
Zwölf Prüfberichte, die elf THW-Rollen und die allgemeine Mobile-UI, alle gegen
den Produktionsbuild (`vite build` + `vite preview`, Port 4173), Code-Stand
Commit `36d549a` (Stand `main` nach Runde 15). Reine Prüfberichte ohne
Codeänderung.

Es gibt keine P0- und keine P1-Befunde. Doppelungen zwischen den Berichten
wurden nicht gefunden.

| Bericht | P0 | P1 | P2 | P3 |
| --- | --- | --- | --- | --- |
| [Neuer Nutzer](neuer-nutzer.md) | 0 | 0 | 0 | 4 |
| [Feldtauglichkeit](feldtauglichkeit.md) | 0 | 0 | 0 | 3 |
| [Arbeitsablauf](arbeitsablauf.md) | 0 | 0 | 0 | 3 |
| [Fehler und Wiederanlauf](fehler-und-wiederanlauf.md) | 0 | 0 | 1 | 4 |
| [Zerstörende Handlungen](zerstoerende-handlungen.md) | 0 | 0 | 0 | 1 |
| [Offline und Speicher](offline-und-speicher.md) | 0 | 0 | 0 | 1 |
| [Stress und Unterbrechung](stress-und-unterbrechung.md) | 0 | 0 | 0 | 3 |
| [Handschuh-Bedienung](handschuh-bedienung.md) | 0 | 0 | 0 | 2 |
| [Nacht und Sicht](nacht-und-sicht.md) | 0 | 0 | 0 | 1 |
| [Führungssicht](fuehrungssicht.md) | 0 | 0 | 1 | 3 |
| [Analog-first](analog-first.md) | 0 | 0 | 1 | 2 |
| [Mobile-UI](mobile-ui.md) | 0 | 0 | 0 | 3 |
| Summe | 0 | 0 | 3 | 30 |

## Stand der Behebung (26.10.2026)

Von 33 Befunden sind 30 behoben und 3 teilweise (R16-A3, R16-E1, R16-W2). Im
echten Browser (Produktionsbuild, Playwright) bestätigt: R16-A1, K1, K4, N1, N2,
N4, L1, D1, S1, W1, W3, H3, M1 bis M3, G1, G2, H1. Bundle-Budget neu gesetzt
(JavaScript gesamt 5 621 762 Byte, Startbündel 1 198 104 Byte). Neuer
Speicherschlüssel `eeb.einsatz.rueckweg`.

| Befund | Stand | Umsetzung |
| --- | --- | --- |
| A1 Excel und CSV | behoben | Schlusszeile mit Einsatzname und Erstellzeit, „*" und Fußnote, Dateinamen mit Datum-Zeit-Gruppe |
| A2 | behoben | Text „bleiben bis zu drei Tage" an beiden Stellen aus einer Konstante |
| A3 Dateiname des Einzelbogens | teilweise | Titel in den PDF-Metadaten; der Dateiname eines im Tab angezeigten PDF bleibt eine GUID (nicht prüfbar) |
| E1 „Namen einfügen…" | teilweise | Tabulator-/Semikolon-Zeilen als Spalten, Hinweis „Reihenfolge prüfen"; „Anna Maria Schmidt" ohne Funktion bleibt ohne Prüfmarke |
| E2 bis E5 | behoben | Rückgängig für „Für neuen Einsatz vorbereiten", Zusatzziffern im Telefonfeld, Orte mit mehreren Ortsverbänden, unlesbare Bilddatei |
| D1 | behoben | „Einen Moment …" im Prellschutz |
| O1 | behoben | Zwischenstand des Papierabgleichs wird entfernt |
| S1 bis S3 | behoben | Zahl markiert beim Antippen, gemeinsamer Soll-Wortlaut, „so gezählt" zuletzt mit Rückgängig (nur Sitzung) |
| W1, W3 | behoben | Quittungsleiste nach 15 s eine Zeile, „Einheit schnell erfassen (nur Stärke)…" in der Einsatzansicht |
| W2 Nachtrag-Knöpfe | teilweise | Beschriftung nennt den Nachtrag; kein Vermerk „NACHTRAG" in der ersten CSV-Zeile (Kopfzeile bleibt Zeile 1) |
| H1 bis H3 | behoben | 44 px, Autokorrektur aus, keine Sprünge beim Erstbesuch |
| K1 | behoben | „Name / Ort ändern…" im Einsatzkopf, Quittung, Rückgängig |
| K2 bis K4 | behoben | Kurzzeile nach Entscheidungsrelevanz, „6 Einheiten neu gemeldet — Zeilen je Einheit ausgeblendet", Zugsummen auf Seite 1 des Lageblatts |
| G1, G2 | behoben | 20 px zwischen den Knöpfen der Aufnahme, 13 px zwischen den offenen Punkten |
| L1, M1 bis M3, N1 bis N4 | behoben | Kennzahlenbeschriftung, Aufnahme ohne Sprung, Entscheidungsknöpfe am Dialogfuß, Knopfleiste im Scanner, Grammatik, ein Einsatz einmal, „du", Zeit unteilbar |
