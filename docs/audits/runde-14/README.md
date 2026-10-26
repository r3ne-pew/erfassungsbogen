# Rollenaudits, Runde 14 (Stand 26.10.2026)

Vierzehnte Prüfrunde nach der Behebung der Befunde aus [Runde 13](../runde-13/README.md).
Zwölf Prüfberichte, die elf THW-Rollen und die allgemeine Mobile-UI, alle gegen
den Produktionsbuild (`vite build` + `vite preview`, Port 4173), Code-Stand
Commit `429c41a` (Stand `main` nach Runde 13). Reine Prüfberichte ohne
Codeänderung.

Es gibt keine P0- und keine P1-Befunde. Zusammengeführt ist die Sammelzuordnung
„Zug für N Einheiten ohne Zug" ohne Quittung und Rückgängig: R14-H2 (P2) mit
R14-G2 (P2) und R14-D3 (P3). Nicht gehalten haben R13-G1 (R14-G1), R13-M3
(R14-M1) und R13-S3 (R14-S1).

| Bericht | P0 | P1 | P2 | P3 |
| --- | --- | --- | --- | --- |
| [Neuer Nutzer](neuer-nutzer.md) | 0 | 0 | 0 | 3 |
| [Feldtauglichkeit](feldtauglichkeit.md) | 0 | 0 | 2 | 2 |
| [Arbeitsablauf](arbeitsablauf.md) | 0 | 0 | 1 | 4 |
| [Fehler und Wiederanlauf](fehler-und-wiederanlauf.md) | 0 | 0 | 1 | 6 |
| [Zerstörende Handlungen](zerstoerende-handlungen.md) | 0 | 0 | 2 | 2 |
| [Offline und Speicher](offline-und-speicher.md) | 0 | 0 | 1 | 1 |
| [Stress und Unterbrechung](stress-und-unterbrechung.md) | 0 | 0 | 0 | 4 |
| [Handschuh-Bedienung](handschuh-bedienung.md) | 0 | 0 | 2 | 1 |
| [Nacht und Sicht](nacht-und-sicht.md) | 0 | 0 | 0 | 0 |
| [Führungssicht](fuehrungssicht.md) | 0 | 0 | 1 | 4 |
| [Analog-first](analog-first.md) | 0 | 0 | 1 | 2 |
| [Mobile-UI](mobile-ui.md) | 0 | 0 | 0 | 4 |
| Summe ohne Doppelungen | 0 | 0 | 10 | 32 |

## Stand der Behebung (26.10.2026)

Von 42 Befunden ohne Doppelungen sind 37 behoben, 4 teilweise (R14-E7, R14-S2,
R14-H1, R14-W3) und einer (R14-E4) nicht reproduzierbar: Ein Tipp 300 ms nach dem
Öffnen der Sammlung öffnete den Scanner bei 390 und 360 px, „Einen Moment …"
ist nach 900 ms wieder verborgen. Im echten Browser (Produktionsbuild,
Playwright) bestätigt sind R14-G1 (Doppeltipp: je ein Sammel-PDF bei 150, 2500
und 2900 ms), R14-S1, R14-E2, R14-E3, R14-D3/G2/H2, R14-S4, R14-K1, R14-K3,
R14-M1 bis M3, R14-G3, R14-H3 und R14-K5. Bundle-Budget neu gesetzt
(JavaScript gesamt 5 598 303 Byte, Startbündel 1 188 924 Byte). Neue
Speicherschlüssel `eeb.beispiel-herkunft.v1` und `eeb.ansicht-stelle.v1`.

| Befund | Stand | Umsetzung |
| --- | --- | --- |
| A1 bis A3 | behoben | „*" und Fußnote bei eingelesenen Zeiten, Hinweis bei nachgehender Uhr, Rückruf mit (D)/(P) |
| W1, W2, W4, W5 | behoben | „Bedarf nicht erfasst", gleiche Minute ist kein Widerspruch, Folgezeile nennt übernommene Teile, gleiche Änderungszahlen in Dialog und Quittung |
| W3 „Anderer Einsatz?" | teilweise | jede Einheit zählt einmal, Regelsatz in Karte, Quittung, Titel; nicht im Lageblatt |
| E1 | behoben | „Als Einsatzmeldung zählen…" mit Rückfrage, Quittung, Rückgängig (Jsdom) |
| E2, E3 | behoben | Fremdcode-Satz im Bild, kurze Codes enden mit Satz |
| E4 | nicht reproduzierbar | siehe oben |
| E5, E6 | behoben | Nummernprüfung der Absenderkarte, Rückfrage beim Abwählen von „Übung" bei Beispieldaten |
| E7 leerer Bogen | teilweise | Rückfrage „Ort der Einheit fehlt"; ein Bogen ohne Ort zählt weiter als zählend |
| H1 Link ohne Sammlung | teilweise | Hauptknopf „In Einsatz-Sammlung ablegen…" und Fremdhinweis; nur im Jsdom-Test geprüft |
| H2, G2, D3 Sammelzuordnung des Zugs | behoben | Quittung mit Zug und Zahl, Rückgängig nimmt nur zurück, was den Zug noch trägt |
| H3, H4, G3 | behoben | Länderliste 44 px/8 px, alte Fehlermeldung weicht, Ansicht-Kacheln mit Abstand |
| G1 Doppeltipp | behoben | Nachlauf 1,2 s, im Browser mit echten Taps bestätigt |
| K1 bis K4 | behoben | Alter ab dem früheren von Stand und Eingang, Überschrift „Abgerückt" bei der ersten Zeile, Zug und Auftrag im Monitor, Kraftstoffe nur mit Menge |
| K5 | behoben | Erfassungsknöpfe kompakt, Bedarf bei 360x640 vor der Fußleiste |
| N1 bis N3 | behoben | gleiche Zahl in Warnung und Knopf, „10 Punkte, u. a. …", „–" statt „✓" in der Schnellerfassung |
| D1, D2, D4 | behoben | Rückfrage nennt abgeteilten Trupp und Stärke, Stapelweg prüft Doppelzählung, Quittung mit Rückgängig nach „Verschieben…" |
| O1, O2 | behoben | Minutentakt für Altersangaben, Vorratsstand bleibt beim Gerät |
| S1, S3, S4 | behoben | Zurück-Geste speichert und App liest neu, Marke „neu · kürzlich eingetroffen", Kontaktzeilen |
| S2 Neuladen | teilweise | Bildlaufstelle bleibt, aufgeklappte Karte und zuletzt bearbeitete Person nicht |
| M1 bis M4 | behoben | Kopfzelle „Ges." sichtbar, Umbruch nach „/", Kopf bei 320 px 125 statt 181 px, Marke am Handscanner-Hinweis (nur Stilregel-Test) |
