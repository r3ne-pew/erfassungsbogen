# Audit „Nacht und Sicht", Runde 13 (Dunkelheit, Blendung, Sonnenlicht, Farbcodierung)

Prüfer: Rollenaudit `thw-night-visibility-reviewer` · Datum: 2026-10-26 ·
Zählung: **P0 0 · P1 0 · P2 0 · P3 1**

Prüfgegenstand: Web-App, Produktionsbuild auf `http://localhost:4173`, Stand `main`
nach Runde 12 (Commit `7637e61`). Reiner Prüfbericht, keine Codeänderung.

Gelesen vor dem Lauf: [docs/audits/README.md](../README.md),
[runde-12/README.md](../runde-12/README.md), [runde-11/README.md](../runde-11/README.md).
Nicht erneut gemeldet sind die dort genannten bekannten Grenzen (R6-O9, R7-G4/M8,
R7-G8/H9, R7-N1, R7-N9, R8-A1, R8-M6, R9-M3, R9-G5, R8-H5/S4, die Reste aus Runde 10
und 11 sowie R12-W3, R12-H3, R12-O2, R12-O4, R12-G3).

## Prüfaufbau

Chromium über Playwright (`chromium.launch()` ohne Optionen, globales
playwright-Modul), Locale de-DE, `isMobile`/`hasTouch`, Viewports 390 × 844 und
360 × 640, alle vier Ansichten (Standard, Feld, Dunkel, Nacht). Zustand über
`localStorage`-Seeds: eine Sammlung „Hochwasser Nord" mit sechs Meldungen aus
`examples/thw/` (eine abgerückt, Alter 5 Minuten bis 6 Std 40 Min, `uebung: false`),
Ansicht über `eeb.anzeigemodus.v1`.

Gemessen: Kontrast jedes Textknotens gegen die tatsächlich darunterliegende Fläche
(Deckkraft eingerechnet, WCAG-Formel), Schriftgrößen unter 12 px, waagerechtes
Rollen. Bildschirmfotos habe ich angesehen.

Durchgespielt: Startseite, Einsatzansicht (Kopf, Kennzahlen, Karten, Aufklappen,
Abrücken mit Quittung, Tabelle, Suchen/Filter, Details, Mehr…, Zug zuordnen,
Auftrag/Notiz, „Einsatz weitergeben / sichern", Einsatz löschen), Dialoge
„Datensicherung", „Alle Daten löschen", Löschen der Sammlung, Scanner ohne Kamera,
Bogen Schritt 1 bis 6, Fehlerzustände bei Telefon und E-Mail, Lagemonitor
(`?lagemonitor=s1`), Begleitseiten und 404.

**Nicht prüfbar:** echtes Licht (Sonne, Arbeitsscheinwerfer, Rotlicht), tatsächliche
Displayhelligkeit, Kamerabild im Dunkeln, Safari/iOS und die nativen Fassungen,
Betriebssystem-Datumswähler, Ausdruck. Der Schritt „Historie" der Karte war im
Lauf per Skript nicht anklickbar (Zeitüberschreitung, vermutlich vom zuvor geöffneten
Details-Dialog verdeckt); er ist nicht geprüft.

## Urteil

Die Nachtregeln halten. Die Behebungen aus Runde 12 tragen: Die Altersangabe im Kopf
der Einsatzansicht (R12-K1/R12-L1) ist in allen vier Ansichten und beiden
Viewports lesbar (kein Textknoten unter 4,5 : 1), die Bedarfszeile ist mit
Leerzeichen gesetzt. Auf keiner geprüften Ansicht liegt aktiver Text unter 4,5 : 1,
und es gibt kein waagerechtes Rollen. Zustände tragen mehr als Farbe: „✓ Abgerückt"
mit gestricheltem Rahmen, Durchstreichung und Wort in der Tabelle, „⚠" mit Wort
und Fettschrift für Alter und Lagehinweise, im Lagemonitor „⚠" mit Dauer in Worten,
die Optionsknöpfe unterscheiden sich durch Punkt und Ring. Die Nacht-Ansicht bleibt
warm und ohne große helle Flächen. Die einzigen Texte unter 4,5 : 1 sind
ausdrücklich deaktivierte Bedienelemente („←" im ersten Schritt, „Dunkler" in der
dunkelsten Lagemonitor-Stufe).

## Befund

### R13-L1 [P3] Nacht-Ansicht: Zustandsmarke „offen" im Schrittband ist 11,9 px klein

**Kennzeichnung:** beobachtet (gemessen).

**Fundstelle / Aufgabe:** Bogen, Schrittband oben („1 (offen)"), Ansicht „Nacht",
beide Viewports. Regel in `index.html`
(`.nacht-modus .schritte button.status-begonnen .schritt-status`, `font-size: 0.85em`).

**Beobachtung:** In Standard steht die Marke bei 13,3 px, in Feld bei 16 px, in
Nacht bei 11,9 px: die einzige Schrift unter 12 px, die ich in der Einsatznutzung
gefunden habe. Sie ist zudem fett in einem 1-px-Rahmen. Der Kontrast ist mit
10,5 : 1 ausreichend.

**Erwartung der Rolle:** Die Marke, die sagt „hier fehlt noch etwas", ist in der
Dunkelheit so groß wie in den anderen Ansichten; die Nacht-Ansicht macht Schrift
nicht kleiner als Standard.

**Auswirkung im Einsatz:** Gering. Die Marke ist ein Orientierungshelfer und die
Aussage steht zusätzlich im Hinweis „hier fehlt noch etwas"; bei gedimmtem Display
und Handschuh-Abstand zum Gerät ist sie aber schwerer zu lesen als in allen anderen
Ansichten. Kein Verlust von Daten oder Aufträgen.

**Empfehlung:** Die Marke in Nacht nicht unter die Größe der Standard-Ansicht
verkleinern (mindestens 12 px, besser wie dort 13 px).

**Verifikation:** Nacht, 360 × 640, Bogen Schritt 1: Schrift der Marke „offen"
mindestens 12 px, Rahmen und Kontrast unverändert.

## Abschluss

- **Aufgabe geschafft:** ja
- **Fremde Hilfe nötig:** nein
- **Größtes Missverständnis:** keines beobachtet; die Marke „offen" ist in Nacht nur schwerer lesbar.
- **Größtes Einsatzrisiko:** keines in dieser Rolle; der Rest ist die bekannte, nicht prüfbare Frage echter Beleuchtung.
- **Top-Priorität für die nächste Iteration:** Schriftgröße der Schrittmarke in Nacht auf mindestens 12 px anheben (R13-L1).
