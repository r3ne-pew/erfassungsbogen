# Audit „Nacht und Sicht", Runde 14 (Dunkelheit, Blendung, Sonnenlicht, Farbcodierung)

Prüfer: Rollenaudit `thw-night-visibility-reviewer` · Datum: 2026-10-26 ·
Zählung: **P0 0 · P1 0 · P2 0 · P3 0**

Prüfgegenstand: Web-App, Produktionsbuild auf `http://localhost:4173`, Stand `main`
nach Runde 13 (Commit `429c41a`). Reiner Prüfbericht, keine Codeänderung.

Gelesen vor dem Lauf: [docs/audits/README.md](../README.md),
[runde-13/README.md](../runde-13/README.md), [runde-12/README.md](../runde-12/README.md),
[runde-11/README.md](../runde-11/README.md) und der Bericht
[runde-13/nacht-und-sicht.md](../runde-13/nacht-und-sicht.md). Nicht erneut gemeldet sind
die dort genannten bekannten Grenzen (R6-O9, R7-G4/M8, R7-G8/H9, R7-N1, R7-N9, R8-A1,
R8-M6, R9-M3, R9-G5, R8-H5/S4, die Reste aus Runde 10 bis 13).

## Prüfaufbau

Chromium über Playwright (`chromium.launch()` ohne Optionen, globales playwright-Modul),
Locale de-DE, `isMobile`/`hasTouch`, Viewports 390 × 844 und 360 × 640, alle vier
Ansichten (Standard, Feld, Dunkel, Nacht) über `eeb.anzeigemodus.v1`. Zustand per
`localStorage`-Seed: Sammlung „Hochwasser Nord" mit sechs Meldungen aus `examples/thw/`
(Alter 5 Minuten bis 6 Std 40 Min, eine abgerückt).

Gemessen: Kontrast jedes sichtbaren Textknotens gegen die tatsächlich darunterliegende
Fläche (Deckkraft eingerechnet, WCAG-Formel), Schriftgrößen unter 12 px, waagerechtes
Rollen, Rahmen- und Fokuskontrast der Bedienelemente. Bildschirmfotos habe ich angesehen,
dazu eine Graustufen-Probe der Standard-Ansicht (Zustände ohne Farbe).

Durchgespielt (je Ansicht und Viewport, 8 Kombinationen): Startseite; Dialoge „QR-Code
scannen", „Neue Einsatz-Sammlung", „Einheit schnell erfassen", „Name/Kontakt hinterlegen",
„Datensicherung", „Alle Daten löschen", „Löschen…", „Geräteschlüssel"; Einsatzansicht mit
Karten und Tabelle, Aufklappen, „Suchen, sortieren, filtern", Mehr/Details, Zug zuordnen,
Abrücken mit Quittung, „Einsatz weitergeben / sichern"; Bogen Schritt 1 bis 6/7;
Lagemonitor (`?lagemonitor=s1`) mit den Stufen.

**Nicht prüfbar:** echtes Licht (Sonne, Arbeitsscheinwerfer, Rotlicht), tatsächliche
Displayhelligkeit, Kamerabild im Dunkeln, Safari/iOS und native Fassungen,
Betriebssystem-Datumswähler, Ausdruck. Die Fehlerzustände von Telefon und E-Mail im Bogen
habe ich in dieser Runde nur gemessen, nicht ausgelöst (das Feld war per Beschriftung nicht
ansprechbar); sie sind aus Runde 13 bekannt und dort ohne Befund.

## Urteil

Die Nachtregeln halten, und es gibt keinen neuen Befund. In allen 8 Kombinationen und allen
durchgespielten Zuständen liegt kein sichtbarer, nicht deaktivierter Text unter 4,5 : 1,
und keine Schrift ist kleiner als 12 px. Es gibt kein waagerechtes Rollen. Zustände tragen
mehr als Farbe: „ABGERÜCKT" mit Rahmen und Durchstreichung, „⚠" mit Wort und Fettschrift
für Alter und Hinweise, „●" mit Wort bei Ruhezeit/Unterbringung, im Lagemonitor „⚠" mit
Dauer in Worten; in der Graustufen-Probe bleiben alle Zustände unterscheidbar. Die
Nacht-Ansicht bleibt warm und ohne große helle Flächen; der Fokusring ist in jeder Ansicht
dreifach so stark wie die Linie (3 bis 4 px, Nacht Bernstein, Dunkel hellblau, Standard und
Feld dunkelblau).

## Prüfung der Behebungen aus Runde 13

| Befund | Ergebnis |
| --- | --- |
| R13-L1 Marke „offen" im Schrittband in Nacht 11,9 px | hält: Bogen Schritt 1 bis 6 in Nacht, beide Viewports, keine Schrift unter 12 px, Kontrast unverändert |
| R12-K1/R12-L1 Altersangabe im Kopf der Einsatzansicht | hält: in allen vier Ansichten und beiden Viewports über 4,5 : 1 |
| R13-N1/N2 (Nachtschrift 12 px, Tabelle „anon.") | hält: Kurzmarke „anon." in der Tabelle lesbar, Kopfzellen nicht kleiner als 12 px |
| R13-M3 (Messung bei 390 px) | kein waagerechtes Rollen und keine Textüberlappung bei 390 und 360 px |

Beobachtungen ohne Befund: Der Lagemonitor behält seine blauen Rahmen auch in der
Nacht-Ansicht (bekannt und bewertet in R6-L4/R7-L3, Linien über 3 : 1 bzw. in der
Stufe „Gedimmt" 3,74 : 1). In Nacht ist „Heller (weiß)" im Lagemonitor gesperrt, die
Stufenfolge bleibt dort vorhersehbar. Die feste Leiste „Ansicht: …" und die Quittung nach
„Abgerückt" nehmen bei 360 × 640 zusammen rund 23 % der Höhe ein; das ist die bekannte
Grenze R9-G5.

## Befunde

Keine neuen Befunde.

## Abschluss

- **Aufgabe geschafft:** ja
- **Fremde Hilfe nötig:** nein
- **Größtes Missverständnis:** keines beobachtet.
- **Größtes Einsatzrisiko:** keines in dieser Rolle; offen bleibt nur die nicht prüfbare Frage echter Beleuchtung.
- **Top-Priorität für die nächste Iteration:** Prüfung mit echter Displayhelligkeit im Freien und bei Nacht (Gerätetest), da im Emulator nicht möglich.
