# Audit „Nacht und Sicht", Runde 15 (Dunkelheit, Blendung, Sonnenlicht, Farbcodierung)

Prüfer: Rollenaudit `thw-night-visibility-reviewer` · Datum: 2026-10-26 ·
Zählung: **P0 0 · P1 0 · P2 0 · P3 0**

Prüfgegenstand: Web-App, Produktionsbuild auf `http://localhost:4173`, Stand `main`
nach Runde 14 (Commit `a7874f0`). Reiner Prüfbericht, keine Codeänderung.

Gelesen vor dem Lauf: [docs/audits/README.md](../README.md),
[runde-14/README.md](../runde-14/README.md), [runde-13/README.md](../runde-13/README.md),
[runde-12/README.md](../runde-12/README.md) und der Bericht
[runde-14/nacht-und-sicht.md](../runde-14/nacht-und-sicht.md). Nicht erneut gemeldet sind
die dort genannten bekannten Grenzen (R6-O9, R7-G4/M8, R7-G8/H9, R7-N1, R7-N9, R8-A1,
R8-M6, R9-M3, R9-G5, R8-H5/S4, die Reste aus Runde 10 bis 14).

## Prüfaufbau

Chromium über Playwright (`chromium.launch()` ohne Optionen). Die Projektkopie fand keinen
passenden Browser, deshalb habe ich das globale playwright-Modul benutzt. Locale de-DE,
`isMobile`/`hasTouch`, Viewports 390 × 844 und 360 × 640, alle vier Ansichten (Standard,
Feld, Dunkel, Nacht) über `eeb.anzeigemodus.v1`, also 8 Kombinationen. Zustand per
`localStorage`-Seed: Sammlung „Hochwasser Nord" mit sechs Meldungen aus `examples/thw/`
(`uebung: false`, Alter 5 Minuten bis 6 Std 40 Min, eine abgerückt, `stand` passend zum
Eingang gesetzt).

Gemessen wurde in jedem Zustand:

- Kontrast jedes sichtbaren Textknotens gegen die tatsächlich darunterliegende Fläche
  (Deckkraft eingerechnet, WCAG-Formel);
- Schriftgrößen unter 12 px;
- waagerechtes Rollen der Seite;
- Rahmen- und Flächenkontrast von Eingabefeldern (nicht-Text, Grenzwert 3 : 1).

Ich habe Bildschirmfotos angesehen. Dazu kamen eine Graustufen-Probe der Einsatzansicht in
Standard, die Systemeinstellung „dunkel" ohne gespeicherte Wahl, erzwungene Farben
(`forced-colors: active`) und 200 % Schriftvergrößerung bei 360 px in Nacht.

Durchgespielt wurden 8 Kombinationen mit rund 380 gemessenen Zuständen:

- Startseite und Ansichtswahl;
- Dialoge „Datensicherung", „Alle Daten löschen", „Geräteschlüssel", „QR-Code scannen",
  „Bögen einlesen", „Einheit manuell erfassen", „Einsatz weitergeben / sichern",
  „Einsatz löschen";
- Einsatzansicht mit Karten und Tabelle (auch nach rechts gerollt), „Suchen, sortieren,
  filtern", Karte aufgeklappt mit Details, Zug zuordnen, Auftrag/Notiz, Historie,
  „Mehr…" mit Aufteilen, Stärke ändern, „Als Übung kennzeichnen…", Verschieben und
  Entfernen, Abrücken mit Quittung und Rückgängig;
- Bogen Schritt 1 bis 6 mit Fehlerhinweis bei Telefon (zwei Ziffern), Personal- und
  Fahrzeugschritt;
- Lagemonitor (`?lagemonitor=s1`), nicht vorhandener Einsatz im Lagemonitor, 404-Seite,
  Anleitung.

Außerdem: Ansicht wechseln, während im Bogen Text getippt steht (Standard → Feld → Dunkel →
Nacht → Standard); der Ort blieb jedes Mal erhalten.

**Nicht prüfbar:** echtes Licht (Sonne, Arbeitsscheinwerfer, Rotlicht), tatsächliche
Displayhelligkeit, Kamerabild im Dunkeln, Safari/iOS und native Fassungen,
Betriebssystem-Datumswähler, Ausdruck. Einige Schritte meines Skripts scheiterten an
Bedienelementen, die ich anders benannt hatte (zum Beispiel „⚠ Anderer Einsatz?", das ein
reiner Hinweis ohne Knopf ist, und der Dialog „Einheit schnell erfassen" nach dem Wechsel
vom Einsatz). Diese Zustände sind in der Reihe der Zustände mit Messung nicht enthalten. Sie
waren schon in Runde 14 ohne Befund. Die ausgelösten Fehlerzustände von E-Mail und die
Länderliste im Bogen habe ich in dieser Runde nur gemessen, nicht gezielt ausgelöst.

## Urteil

Es gibt keinen neuen Befund. In allen 8 Kombinationen und allen durchgespielten Zuständen
liegt kein sichtbarer, nicht deaktivierter Text unter 4,5 : 1, und keine Schrift ist kleiner
als 12 px. Es gibt kein waagerechtes Rollen der Seite; die Tabelle rollt nur in ihrem eigenen
Rahmen. Auch bei 200 % Schrift in Nacht läuft nichts über.

Zustände tragen mehr als Farbe. „ABGERÜCKT" steht mit Rahmen und Durchstreichung in der
Tabelle, die Schaltfläche zeigt „✓ Abgerückt" mit gestricheltem Rahmen. Alter und Hinweise
tragen „⚠" mit Wort und Fettschrift, Ruhezeit und Unterbringung „●" mit Wort. „Entfernen"
ist rot umrandet, trägt aber das Wort. Im Lagemonitor steht „⚠" mit Dauer in Worten. In der
Graustufen-Probe der Einsatzansicht (Standard) bleiben alle diese Zustände unterscheidbar.

Die Nacht-Ansicht bleibt warm und ohne große helle Flächen; die Quittung nach „Abrücken"
(„Abgerückt 13:33: …", „Rückgängig", „✕") liegt als dunkle Fläche über der Liste und ist
lesbar. Das Umschalten der Ansicht unterbricht keinen Vorgang. Ohne gespeicherte Wahl
startet die App bei System-dunkel dunkel. Bei erzwungenen Farben bleibt die Startseite mit
Rahmen und Text vollständig lesbar.

Die einzigen Texte unter 4,5 : 1 sind ausdrücklich deaktivierte Bedienelemente („←" im ersten
Schritt, „Dunkler" in der dunkelsten Lagemonitor-Stufe). Das Eingabefeld „Dateien wählen…" in
der Einsatzansicht hat 1,1 : 1 zum Grund, ist aber das verdeckte Dateifeld hinter dem Knopf
„Bögen einlesen…" und kein sichtbares Bedienelement.

## Prüfung der Behebungen aus Runde 14

| Befund | Ergebnis |
| --- | --- |
| R14-K1 Alter ab dem früheren von Stand und Eingang | hält: Alter auf Karte, Tabelle und im Lagemonitor in allen vier Ansichten und beiden Viewports lesbar (über 4,5 : 1) |
| R14-M1 Kopfzelle „Ges." in der Tabelle | hält: bei 390 und 360 px in Nacht sichtbar und lesbar |
| R14-M4 Marke am Handscanner-Hinweis | hält soweit messbar: Scanner-Dialog in allen 8 Kombinationen ohne Text unter 12 px oder unter 4,5 : 1 (Kamerabild nicht prüfbar) |
| R14-K5 Erfassungsknöpfe, Bedarf vor der Fußleiste | hält: bei 360 × 640 in allen vier Ansichten ohne Überlappung der festen Fußleiste mit Bedienelementen im Kopf der Liste |
| R14-D4/R14-H2 Quittung mit „Rückgängig" | hält: Quittung nach Abrücken in allen Ansichten lesbar, „Rückgängig" erreichbar |
| R13-L1 Marke „offen" in Nacht 11,9 px | hält weiter (Runde 14 bestätigt, keine Schrift unter 12 px) |

Nicht gesondert geprüft: R14-M3 (Kopf bei 320 px) und die Kontaktzeilen R14-S4. Nicht
Gegenstand dieser Rolle: R14-G1, R14-S1, R14-E2/E3, R14-D3/G2/H2, R14-K3.

## Befunde

Keine.

## Schluss

- **Aufgabe geschafft:** ja
- **Fremde Hilfe nötig:** nein
- **Größtes Missverständnis:** keines beobachtet; die Hinweismarke „⚠ Anderer Einsatz?" sieht aus wie ein Knopf, ist aber nur Anzeige (Erklärung im Titel und in der aufgeklappten Karte), das ist bekannt aus R14-W3.
- **Größtes Einsatzrisiko:** nicht prüfbar bleibt die echte Wirkung von Sonne und Scheinwerfer auf das Display; die Messwerte sind Kontrastwerte, keine Helligkeitsmessung.
- **Top-Priorität für die nächste Iteration:** Messung auf einem echten Gerät bei Dunkelheit und Sonne, sobald eines vorliegt.
