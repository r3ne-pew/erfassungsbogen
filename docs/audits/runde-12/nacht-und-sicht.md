# Audit „Nacht und Sicht", Runde 12 (Dunkelheit, Blendung, Sonnenlicht, Farbcodierung)

Prüfer: Rollenaudit `thw-night-visibility-reviewer` · Datum: 2026-10-26 ·
Zählung: **P0 0 · P1 0 · P2 1 · P3 0**

Prüfgegenstand: Web-App, Produktionsbuild auf `http://localhost:4173`
(`vite preview`), Stand `main` nach Runde 11 (Commit `2c96abe`). Reiner
Prüfbericht, keine Codeänderung.

Gelesen vor dem Lauf: [docs/audits/README.md](../README.md) und
[runde-11/README.md](../runde-11/README.md). Nicht erneut gemeldet sind die dort
genannten bekannten Grenzen (R6-O9, R7-G4/M8, R7-G8/H9, R7-N1, R7-N9, R8-A1,
R8-M6, R9-M3, R9-G5, R8-H5/S4, die Reste aus Runde 10 und die offenen Reste aus
Runde 11: R11-S4, R11-H2, R11-K2, R11-A2, R11-A5, R11-M1, R11-M3).

## Prüfaufbau

Chromium über Playwright (`chromium.launch()` ohne Optionen, globales
playwright-Modul, weil die Projektkopie keinen passenden Browser fand), Locale
de-DE, `isMobile`/`hasTouch`. Viewports 390 × 844 und 360 × 640. Alle vier Modi
(Standard, Feld, Dunkel, Nacht).

Zustände über `localStorage`-Seeds: ein Entwurf (Zugtrupp Technischer Zug), eine
Sammlung „Hochwasser Nord" mit sechs Meldungen aus `examples/thw/` (eine
abgerückt, Alter 5 Minuten bis 6 Stunden 40 Minuten), `eeb.anzeigemodus.v1`; alle
mit `uebung: false` und frischem Stand. Zweiter Lauf mit allen Meldungen
5 bis 10 Stunden alt.

Gemessen: Kontrast jedes Textknotens gegen die tatsächlich darunterliegende
Fläche (Deckkraft eingerechnet, WCAG-Formel), Schriftgrößen unter 12 px,
Feldrahmen, Platzhalter und Eingabetext in allen Schritten, Filter und Hintergrund
der Bilder auf zwölf Begleitseiten. Simuliert: `forced-colors: active`,
`prefers-color-scheme: dark` beim Kaltstart. Bildschirmfotos habe ich angesehen,
nicht nur gerechnet.

Durchgespielt: Startseite, Bogen Schritt 1 bis 6, Anzeige-Wahl, Einsatzansicht
(Karten, Tabelle, aufgeklappte Karte, Abrücken mit Quittung und Rückgängig),
Dialoge „Datensicherung", „Alle Daten löschen", „Neue Einsatz-Sammlung", „Einsatz
löschen", „Einheit für den Einsatz erfassen", Scanner ohne Kamera, Lagemonitor
(`?lagemonitor=s1`), Begleitseiten (THW, Malteser, Bundeswehr, DLRG, ASB,
Johanniter, Feuerwehr, DRK, BBK, Meldekopf, Anleitung, Datenschutz, Impressum,
Autor, 404).

**Nicht prüfbar:** echtes Licht (Sonne, Arbeitsscheinwerfer, Rotlicht),
tatsächliche Displayhelligkeit, Kamerabild im Dunkeln, Safari/iOS und die nativen
Fassungen, Datumswähler des Betriebssystems, tatsächlicher Ausdruck. Das
Datumsformat „mm/dd/yyyy" in den Zeitfeldern stammt vom Prüf-Chromium.

## Urteil

Die Nachtregeln halten, mit einer Ausnahme im Kopf der Einsatzansicht. Kein
aktiver Text liegt in Dunkel und Nacht unter 4,5:1 (Minima: Dunkel 5,9, Nacht
4,54; Einsatzansicht Nacht 4,71), kein Text ist kleiner als 12 px, kein Befund
beim waagerechten Rollen. Feldrahmen haben 3,4:1 (Nacht, Dunkel, Standard) bis
18,6:1 (Feld), Platzhalter mindestens 4,69:1. Zustände tragen mehr als Farbe:
„ABGERÜCKT" mit Rahmen, Wort und Durchstreichung, „⚠ Anderer Einsatz?", „⚠ vor 3
Std 30 Min" als Wort auf der Karte, Lagemonitor mit Zeichen und Fettschrift. Der
Wechsel der Darstellung im Bogen behält Eingabe und Rollposition. Der Kaltstart
mit System-Dunkel beginnt dunkel.

Die Aufgabe (Bogen erfassen, Einsatz sammeln, Lage zeigen, bei Nacht und bei
Sonne) gelingt ohne fremde Hilfe. Reibung gibt es an einer Stelle: Die
Warnzeilen zur Aktualität im Kopf der Einsatzansicht sind in den beiden hellen
Modi, also gerade bei Sonne, kaum zu lesen.

## Prüfung der Behebungen aus Runde 11

- **R11-L1 (Logos in Dunkel und Nacht):** hält. THW-, Malteser-, Bundeswehr-,
  DLRG-, ASB-, Johanniter- und Feuerwehr-Zeichen liegen in Dunkel und Nacht auf
  einer eigenen Platte (Filter `brightness(0.8)` bzw. `0.5`) und sind erkennbar;
  Standard und Feld unverändert.
- **R11-L2 (`forced-colors`):** hält. Bei erzwungenen Farben zeigen Anzeige-Wahl
  („✓" und Unterstreichung bei „Standard"), „Karten / Tabelle" („✓" und
  Unterstreichung bei der gewählten Ansicht) und Schrittleiste den gewählten
  Zustand; der Hauptknopf „Fortsetzen" hat den dickeren Rahmen.
- **R11-D1/S3, M2, M4, M5 (soweit sichtbar):** Kenntnisnahme und Abrücken
  quittieren mit Uhrzeit und „Rückgängig"; die Quittung ist in Nacht lesbar
  (4,71:1); Kacheln und Knöpfe ruhig, nichts blinkt.

## Befunde

### R12-L1 [P2] Warnzeilen zur Aktualität im Kopf der Einsatzansicht sind in Standard und Feld unlesbar (1,73:1)

**Priorität:** P2

**Kennzeichnung:** gemessen (Textkontrast gegen die tatsächliche Fläche) und
beobachtet (Bildschirmfoto), jeweils bei 390 × 844 und 360 × 640. Nicht
betroffen: Dunkel und Nacht.

**Fundstelle / Aufgabe:** Einsatzansicht, Kopf unter dem Namen der Sammlung, die
Zeilen „· ⚠ 25.10.2026, 23:07 (vor 5 Std 0 Min)" (Klasse `letzte-meldung` mit
`warnung-text`, wenn die letzte Meldung veraltet ist) und „· ⚠ älteste Meldung vor
3 Std 30 Min, 2 von 5 älter als 1 Std" (Klasse `aelteste-meldung warnung-text`,
`einsaetze-ui.tsx` Zeilen 1509 und 1513). Die Zeile erscheint, sobald eine
anwesende Meldung älter als eine Stunde ist, also in jeder länger laufenden
Sammlung. Sie steht auch während „Einheit erfassen" und hinter jedem Dialog der
Einsatzansicht.

**Beobachtung:** Der Kopf der Einsatzansicht ist in Standard und Feld dunkelblau
(`rgb(18, 39, 94)`). Die Warnzeilen erben die Warnfarbe `--warn-text`
(`rgb(109, 71, 0)`, dunkles Braun), die für helle Karten gedacht ist, und stehen
damit braun auf Dunkelblau:

| Modus | Warnzeile | Rest des Kopfes |
| --- | --- | --- |
| Standard | 1,73:1 (13 px) | über 9:1 |
| Feld | 1,73:1 (15,7 px) | über 9:1 |
| Dunkel | 8,17:1 | gut |
| Nacht | 4,71:1 | gut |

Auf dem Bildschirmfoto sind die Warnwörter als dunkler Schatten auf dem Blau zu
erahnen; der Satz „(vor 5 Min)" davor in heller Schrift ist dagegen klar. Im
selben Kopf bleibt also lesbar, wann die letzte Meldung kam, aber nicht die
Warnung, dass die Zahlen darunter veraltet sind. Die Karten in der Liste tragen
den Hinweis noch einmal („⚠ vor 3 Std 30 Min" als Marke), und der Lagemonitor
zeigt ihn in der hellen Warnfarbe; die Zeile im Kopf ist aber die Stelle, die
jemand beim Übernehmen des Geräts als Erstes sieht.
**Erwartung der Rolle:** Eine Warnung, die „Zahlen veraltet" sagt, ist in allen
Darstellungen mindestens so gut lesbar wie der Satz davor, bei Sonne erst recht,
denn dort kontrolliert man das Gerät kurz und aus dem Augenwinkel.

**Auswirkung im Einsatz:** Wer das Gerät bei Sonne übernimmt (Feld ist die
Darstellung für draußen), liest „letzte Meldung … (vor 5 Min)" und die Zahlen
„41 Gesamt", nicht aber, dass fünf von fünf anwesenden Einheiten seit Stunden
nichts gemeldet haben. Die Lage wirkt aktueller, als sie ist. Die Karten weiter
unten und der Lagemonitor fangen das auf, daher P2 und nicht höher.

**Empfehlung:** Warnzeilen auf dem dunklen Kopf mit einer Farbe zeigen, die dort
trägt (hell, mit Zeichen und Fettschrift wie im Lagemonitor), mindestens 4,5:1;
dieselbe Prüfung für andere Warnklassen, die im Kopf stehen können. Die Marke „⚠"
bleibt, damit die Warnung nicht an der Farbe hängt.

**Verifikation:** Sammlung mit einer Meldung über einer Stunde öffnen, in
Standard und Feld den Kopf messen (Warnzeile mindestens 4,5:1 gegen
`rgb(18, 39, 94)` bzw. den Kopfgrund), dazu ein Sammlung mit ausschließlich
Meldungen über 4 Stunden (beide Zeilen). Dunkel und Nacht bleiben unverändert.

## Was gehalten hat

- Kontrast in allen vier Modi: Startseite, Schritt 1 bis 6, Dialoge, Scanner,
  Lagemonitor (Minimum 4,55:1 in Nacht), Begleitseiten (Minimum 4,71:1 in Nacht).
- Feldrahmen, Platzhalter, Eingabetext in allen Schritten.
- Darstellungswechsel im Bogen verliert weder Eingabe noch Rollposition.
- Kaltstart mit System-Dunkel beginnt dunkel.
- Bilder auf Begleitseiten gedimmt, Scan-Barcodes der Anleitung ausgenommen.
- Zustände ohne Farbe lesbar (Wort, Zeichen, Durchstreichung, Rahmen).

## Abschluss

- **Aufgabe geschafft:** ja
- **Fremde Hilfe nötig:** nein
- **Größtes Missverständnis:** Wer bei Sonne den Kopf der Einsatzansicht liest,
  hält die Lage für aktuell, weil die Warnung dahinter nicht zu sehen ist.
- **Größtes Einsatzrisiko:** Die Aktualitätswarnung im Kopf der Einsatzansicht
  ist in Standard und Feld (1,73:1) unlesbar.
- **Top-Priorität für die nächste Iteration:** Warnzeilen im Kopf der
  Einsatzansicht in allen vier Modi auf mindestens 4,5:1 bringen (R12-L1).
