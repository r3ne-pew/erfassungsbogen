# Rollenaudits, Runde 11 (Stand 25.10.2026)

Elfte Prüfrunde nach der Behebung der Befunde aus [Runde 10](../runde-10/README.md).
Zwölf Prüfberichte, die elf THW-Rollen und die allgemeine Mobile-UI, alle gegen
den Produktionsbuild (`vite build` + `vite preview`, Port 4173), Code-Stand
Commit `abc3ccd` (Stand `main` nach Runde 10). Reine Prüfberichte ohne
Codeänderung.

Es gibt keine P0- und keine P1-Befunde mehr. Zusammengeführt ist
R11-S3 (P3) mit R11-D1 (P2): „Zur Kenntnis genommen" räumt die Neu-Marken ohne
Quittung und Rückgängig ab, mit zu kleinen, aneinanderstoßenden Tippflächen.

| Bericht | P0 | P1 | P2 | P3 |
| --- | --- | --- | --- | --- |
| [Neuer Nutzer](neuer-nutzer.md) | 0 | 0 | 0 | 2 |
| [Feldtauglichkeit](feldtauglichkeit.md) | 0 | 0 | 1 | 3 |
| [Arbeitsablauf](arbeitsablauf.md) | 0 | 0 | 2 | 3 |
| [Fehler und Wiederanlauf](fehler-und-wiederanlauf.md) | 0 | 0 | 3 | 5 |
| [Zerstörende Handlungen](zerstoerende-handlungen.md) | 0 | 0 | 1 | 4 |
| [Offline und Speicher](offline-und-speicher.md) | 0 | 0 | 1 | 4 |
| [Stress und Unterbrechung](stress-und-unterbrechung.md) | 0 | 0 | 1 | 3 |
| [Handschuh-Bedienung](handschuh-bedienung.md) | 0 | 0 | 0 | 3 |
| [Nacht und Sicht](nacht-und-sicht.md) | 0 | 0 | 0 | 2 |
| [Führungssicht](fuehrungssicht.md) | 0 | 0 | 1 | 3 |
| [Analog-first](analog-first.md) | 0 | 0 | 1 | 4 |
| [Mobile-UI](mobile-ui.md) | 0 | 0 | 1 | 4 |
| Summe ohne Doppelungen | 0 | 0 | 12 | 39 |

## Stand der Behebung (26.10.2026)

Von 51 Befunden ohne Doppelungen sind 44 behoben, 6 teilweise und einer
(R11-S4) offen. Bundle-Budget neu gesetzt (JavaScript gesamt 5 555 454 Byte,
Startbündel 1 156 981 Byte). Begleitdokumente nachgezogen, neuer
Speicherschlüssel `eeb.widersprueche.v1`.

| Befund | Stand | Umsetzung |
| --- | --- | --- |
| N1, N2 Kontaktfelder, Kürzel-Vorschlag | behoben | Telefon und E-Mail am Telefon in voller Breite; keine Liste, die nur den eingetragenen Eintrag wiederholt |
| W1 Verpflegung | behoben | Summe „angefordert" getrennt von der Stärke in Kopfzeile, Lageblatt, Sammel-PDF und CSV |
| W2 Absender am Meldekopf | behoben | Karte, Details, Lageblatt, Kasten „Stand am Meldekopf" |
| W3 Editor schluckt ersten Tipp | behoben | Speichern beim Fokuswechsel, Schließen nach dem Klick (ohne UI-Test) |
| W4, W5 Vorbelegung, „mustern" | behoben | „(Vorbelegung)" im Lageblatt; „laden und verwenden", Knopf „Weiter auswählen" |
| H1, H3, H4 Schreibweisen, Suche, Tabulator | behoben | `schreibweise.ts`, Suche mit Typ-Kürzel und Ebene, Tabulatorzeile Name/Funktion |
| H2 Typvorschläge | teilweise | wortweise Suche; Knopf „Passende Typen zeigen" fehlt |
| K1, K3, K4 Alter, gleichnamige Sammlung, Text zur Seitenzahl | behoben | ⚠ bei älteren Meldungen, Dialog „Vorhandene öffnen / Trotzdem neu anlegen", Text angepasst |
| K2 Abgerückte | teilweise | Filter „Status"; Abgerückte bleiben an ihrem Listenplatz |
| A1, A3, A4 Anonymisierung, Lageblatt als Eingabe, Vorlagenseite | behoben | Quittung nennt Alter, Titelerkennung, Seite „29 Personen" |
| A2 Abrückzeit | teilweise | Feld auf dem Blanko; keine Zelle im Nachtragsfeld der Sammel-PDF |
| A5 Länge der Übergabe-Übersicht | teilweise | Satz „auf einem Blatt" an die Länge angepasst, Hinweise nicht gekürzt |
| E1 bis E8 | behoben | Ort-geändert-Hinweis, Telefonart behalten, „+" und zweite Nummer, Namenspräfixe, QR-Größe, „Jahr prüfen", „Tel."-Vorsatz im CSV, Verlaufskennung |
| D1 bis D5, S3 | behoben | Kenntnisnahme mit Quittung und Rückgängig (44 px, 8 px Abstand), Quittungen vierzeilig, Rückfragen bei erster Person und „Jetzt", Hinweis beim Wiederherstellen |
| O1 bis O5 | behoben | Speichern bei Seitenwechsel, Hinweis bei gelöschtem Einsatz, Widersprüche bleiben sichtbar, Meldung bei vollem Speicher |
| S1, S2 | behoben | Sperre im QR-Vollbild 0,9 s; Verlaufseinträge nach „Fertig" verbraucht |
| S4 Entwurfsknopf | offen | Reihenfolge auf der Startseite unverändert |
| G1 bis G3, L1, L2, M2, M4, M5 | behoben | Eingabetaste, Fokus bei „Aufteilen", Abstände, helle Platte für Zeichen, `forced-colors`, Namensgröße, ruhige Knöpfe, Kacheln quer |
| M1 Schritt 1 am Telefon | teilweise | Zettelfelder eingeklappt, Fokus auf „Ort der Einheit"; Fußleiste und Reihenfolge unverändert |
| M3 Fläche der Quittung | teilweise | Quittung bis vier Zeilen; Anteil nicht verkleinert |
