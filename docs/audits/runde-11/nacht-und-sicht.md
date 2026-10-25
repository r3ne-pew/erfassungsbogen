# Audit „Nacht und Sicht", Runde 11 (Dunkelheit, Blendung, Sonnenlicht, Farbcodierung)

Prüfer: Rollenaudit `thw-night-visibility-reviewer` · Datum: 2026-10-25 ·
Zählung: **P0 0 · P1 0 · P2 0 · P3 2**

Prüfgegenstand: Web-App, Produktionsbuild auf `http://localhost:4173`
(`vite preview`). Reiner Prüfbericht, keine Codeänderung.

Gelesen vor dem Lauf: [docs/audits/README.md](../README.md) und
[runde-10/README.md](../runde-10/README.md). Nicht erneut gemeldet sind die dort
genannten bekannten Grenzen (R6-O9, R7-G4/M8, R7-G8/H9, R7-N1, R7-N9, R8-A1,
R8-M6, R9-M3, R9-G5, R8-H5/S4) und die Reste aus Runde 10 (leere Karten bei
„Nur Stärke", Rückgängig für Meldungen überlebt das Neuladen nicht,
Tabellenzeilenhöhe bei 180 × 320). Die Berichte der anderen Rollen dieser Runde
habe ich nur auf Überschriften gesichtet, um nichts doppelt zu melden: die
11-px-Einheitennamen in der Tabelle stehen dort als R11-M2 und zählen hier nicht.

## Prüfaufbau

Chromium über Playwright (`chromium.launch()` ohne Optionen), Locale de-DE,
`isMobile`/`hasTouch`. Viewports 390 × 844 und 360 × 640, einzelne Läufe zusätzlich
320 × 568. Alle vier Modi (Standard, Feld, Dunkel, Nacht).

Zustände über `localStorage`-Seeds (`eeb.entwurf.v1` aus dem Großbogen
„Verstärkter Bergungszug", `eeb.einsaetze.v1` mit sechs Meldungen, davon eine
abgerückt, eine 3,5 Stunden und eine 90 Minuten alt, `eeb.anzeigemodus.v1`),
alle mit `uebung: false`. Dazu ein leerer Bogen bis Schritt 6 mit drei offenen
Punkten.

Gemessen: Kontrast jedes Textknotens gegen die tatsächlich darunterliegende
Fläche (Deckkraft eingerechnet, WCAG-Formel), Schriftgrößen unter 12 px,
Feldrahmen und Platzhalter, Pixelkontrast der Bilddateien nach dem Rendern.
Simuliert über das Chromium-Protokoll: Farbenblindheit (Deuteranopie,
Achromatopsie), Medienabfrage `forced-colors: active`, `prefers-color-scheme`
live. Bildschirmfotos habe ich angesehen, nicht nur gerechnet.

Durchgespielt: Startseite, Bogen Schritt 1 bis 6 (voll und leer), Anzeige-Wahl
im Bogen und in der Einsatzansicht, Einsatzansicht mit Karten (zugeklappt und
aufgeklappt), Tabelle, Filter, Dialoge „Neue Einsatz-Sammlung", „Datensicherung",
„Alle lokalen Daten löschen", Scanner ohne Kamera, Lagemonitor
(`?lagemonitor=s1`) in Nacht, alle zwölf statischen Seiten (Themen, Anleitung,
Datenschutz, Impressum, 404).

**Nicht prüfbar:** echtes Licht (Sonne, Arbeitsscheinwerfer, Rotlicht),
tatsächliche Displayhelligkeit, Kamerabild im Dunkeln, Fernseher im Fahrzeug,
Safari/iOS und die nativen Fassungen, Auswahlfenster des Betriebssystems
(Datumswähler), tatsächlicher Ausdruck. Das Datumsformat „07/16/2026" in den
Zeitfeldern stammt vom Prüf-Chromium, nicht von der App, und ist kein Befund.

## Urteil

Die App hält die Nachtregeln ein. Kein aktiver Text liegt in einem der vier Modi
unter 4,5:1 (Minima: Standard 5,42, Feld 6,84, Dunkel 5,9, Nacht 4,54), kein Text
ist kleiner als 12 px (Ausnahme Tabelle, siehe R11-M2). Unter 4,5:1 liegen nur
deaktivierte Knöpfe (Deckkraft 0,4, etwa „Einsatz anlegen" und „Endgültig
löschen" bis zur Eingabe), und bei beiden steht der Grund als Satz daneben. Die
Feldrahmen haben 3,4:1 (Nacht, Dunkel) bis 18,6:1 (Feld).

Zustände tragen mehr als Farbe. In Achromatopsie bleiben unterscheidbar: die
gewählte Ansicht, die gewählte Darstellung „Karten/Tabelle" (Füllung gegen
Rahmen), „neu" (Fläche mit Schrift), „ABGERÜCKT" (Rahmen, Wort, Durchstreichung,
gestrichelter Balken), „⚠ Anderer Einsatz?", „⚠ 3 offene Punkte", „● Ruhezeit",
der aktive Schritt (Unterstreichung), das angehakte Kästchen (Haken). Der
Lagemonitor in Nacht trägt Warnungen mit Zeichen und Fettschrift, unterstrichene
Gesamtzahl, Stufe als Wort.

Der Wechsel der Darstellung unterbricht nichts: Im Bogen bleiben eingetippter
Text und Rollposition (1 237 → 1 248 px), in der Einsatzansicht ebenso
(1 400 → 1 428 px). Bilder auf den statischen Seiten sind gedimmt
(`brightness(0.4)`), die Anleitungs-Barcodes zum Einlesen bewusst nicht. Der
Kaltstart in Nacht ist von der ersten Aufnahme an dunkel; die Seite 404 und die
Begleitseiten übernehmen die Darstellung.

Reibung gibt es an zwei Stellen, beide P3 und beide außerhalb des Kernablaufs.
Die Aufgabe (Bogen erfassen, übergeben, am Meldekopf sammeln, Lage zeigen) gelingt
bei Nacht ohne fremde Hilfe.

Nachgestellt, aber keine Änderung seit der Runde 3 und bewusst so entschieden
(Kopfkommentar in `src/app/anzeige-modus.ts`): Ein Wechsel von
`prefers-color-scheme` während einer laufenden Sitzung schaltet die Darstellung
nicht um. Das zähle ich nicht.

## Befunde

Keine P0-, P1- und P2-Befunde. Zwei P3-Befunde.

### R11-L1 [P3] Organisationsseiten: THW-Zeichen, „Malteser"- und „Bundeswehr"-Schriftzug sind in Dunkel und Nacht unsichtbar

**Priorität:** P3

**Kennzeichnung:** gemessen (Pixelkontrast der gerenderten Bilder), beobachtet
(Bildschirmfoto der Seiten).

**Fundstelle / Aufgabe:** statische Seiten `thw.html`, `malteser.html`,
`bundeswehr.html` (Erreichbar über „Alle Themen" auf der Startseite), Ansicht
Dunkel und Nacht, 360 × 640. Geprüft: `thw`, `bundeswehr`, `malteser`, `dlrg`,
`asb`, `johanniter`, `feuerwehr`.

**Beobachtung:** Die Logos sind SVG-Dateien mit durchsichtigem Grund und dunkler
Schrift bzw. dunklem Blau. Auf den Seiten liegen sie ohne eigene Fläche direkt auf
dem dunklen Seitengrund, und die Regel `html.nacht-modus figure img { filter:
brightness(0.4); }` dunkelt sie zusätzlich ab. Höchster Kontrast eines
Logo-Pixels gegen den Grund, nach dem Rendern:

| Logo | Dunkel | Nacht | Standard |
| --- | --- | --- | --- |
| THW-Zeichen (Zahnrad, 88 px) | 1,05:1 | 1,09:1 | 9,8:1 |
| Schriftzug „Malteser" | 1,03:1 | 1,00:1 | 14,7:1 |
| Schriftzug „BUNDESWEHR" | 1,07:1 | 1,11:1 | 9,5:1 |
| Bundeswehr-Kreuz | 2,00:1 | 2,07:1 | 9,5:1 |

Auf dem Bildschirmfoto ist vom THW-Zeichen nur ein dunkler Fleck zu ahnen, vom
Malteser-Logo steht der rote Schild, der Schriftzug fehlt. DLRG, ASB, Johanniter
und das Feuerwehr-Zeichen tragen eine eigene farbige Fläche und sind lesbar. Die
Bildunterschrift „Logo der Malteser. Rechteinhaber: …" verweist unverändert auf
ein Bild, das man nicht sieht.

**Erwartung der Rolle:** Ein Zeichen, das auf der Seite steht, ist in jeder
Darstellung zu erkennen, mindestens als helle Platte oder aufgehellte Fassung.

**Auswirkung im Einsatz:** Gering. Die Seiten sind Werbe- und Erklärseiten, die
Organisation steht in der Überschrift, die Erfassung ist nicht betroffen. Wer
nachts die Themenseite seiner Organisation aufruft, sieht ein beschädigt
wirkendes Logo und zweifelt, ob die Seite richtig geladen hat.

**Empfehlung:** Logos mit durchsichtigem Grund in Dunkel und Nacht auf einer
eigenen hellen, gedimmten Fläche zeigen (wie die weiße Platte beim QR-Code) oder
eine für dunklen Grund gezeichnete Fassung verwenden. Die Abdunkelung der Fotos
soll nicht auf Logos wirken.

**Verifikation:** THW-, Malteser- und Bundeswehr-Seite in Dunkel und Nacht
öffnen; Zeichen und Schriftzug sind erkennbar, gemessener Pixelkontrast
mindestens 3:1 gegen die umgebende Fläche. Standard und Feld bleiben unverändert.

### R11-L2 [P3] Bei aktiven Kontrast-Designs (`forced-colors`) sind gewählter Zustand und Hauptknopf nicht mehr zu erkennen

**Priorität:** P3

**Kennzeichnung:** beobachtet in der Nachstellung (`forced-colors: active`, Standard,
360 × 640). Kein echtes Windows-Kontrast-Design geprüft; Chromium auf Android
schaltet dieses Verhalten nicht ein, relevant ist es für Meldeköpfe auf
Windows-Laptops und -Tablets.

**Fundstelle / Aufgabe:** Einsatzansicht „Karten / Tabelle"; Anzeige-Wahl
(„Standard, Feld, Dunkel, Nacht"); Bogen, Schrittleiste und Fußleiste;
Startseite „Bogen scannen…".

**Beobachtung:** Die App kennt weder `forced-colors` noch `prefers-contrast`.
Unter erzwungenen Farben verlieren Knöpfe ihre Füllung; was nur über die Füllung
gezeigt wird, verschwindet:

- „Karten" und „Tabelle" (`aria-pressed`) sind zwei gleiche, leere Kästchen.
- In der geöffneten Anzeige-Wahl ist die aktive Darstellung („Standard") nicht
  von „Feld", „Dunkel", „Nacht" zu unterscheiden.
- In der Schrittleiste ist der aktive Schritt nicht hervorgehoben (die Zusätze „✓"
  und „offen" bleiben, weil sie Text sind).
- Hauptknopf („Bogen scannen…", „Weiter →") und Nebenknöpfe sehen gleich aus.

**Erwartung der Rolle:** Den gewählten Zustand erkennt man auch ohne
Füllfarbe, etwa an Haken, dickem Rahmen oder Wort („gewählt").

**Auswirkung im Einsatz:** Wer mit einem Kontrast-Design arbeitet (zum Beispiel
bei Blendung am Fahrzeugfenster auf dem Laptop), kann nicht sehen, ob die Tabelle
oder die Karten gezeigt werden oder welche Darstellung gerade gilt, und tippt
zur Probe. Wiederherstellbar durch Ausprobieren, deshalb P3.

**Empfehlung:** Gewählte Zustände zusätzlich über Rahmenstärke, Haken oder
Systemfarben (`Highlight`, `ButtonText`) kennzeichnen; den Hauptknopf unter
erzwungenen Farben durch einen dicken Rahmen absetzen.

**Verifikation:** Medienabfrage `forced-colors: active` nachstellen; in
Einsatzansicht, Anzeige-Wahl und Schrittleiste ist der gewählte Eintrag ohne
Hintergrundfarbe unterscheidbar; Hauptknopf und Nebenknopf lassen sich
auseinanderhalten.

## Was gehalten hat

- Kontrast in allen vier Modi über Startseite, Schritt 1 bis 6, Einsatzansicht,
  Dialoge, Scanner ohne Kamera und statische Seiten (siehe Urteil).
- Zustandscodierung ohne Farbe (Achromatopsie und Deuteranopie nachgestellt):
  „neu", „ABGERÜCKT", „⚠", „●", Haken, Unterstreichung.
- Darstellungswechsel mitten in der Eingabe verliert weder Text noch
  Rollposition; die Wahl bleibt nach dem Neuladen.
- Bilder auf Begleitseiten gedimmt, Scan-Barcodes der Anleitung ausgenommen.
- Lagemonitor in Nacht am Telefon: keine Schrift unter 14 px, Warnungen mit
  Zeichen.

## Abschluss

- **Aufgabe geschafft:** ja
- **Fremde Hilfe nötig:** nein
- **Größtes Missverständnis:** Ein Logo, das auf der Seite steht, aber auf dem
  dunklen Grund nicht zu sehen ist, wirkt wie ein Ladefehler.
- **Größtes Einsatzrisiko:** Unter erzwungenen Farben ist der gewählte Zustand
  (Karten oder Tabelle, aktive Darstellung) nicht erkennbar.
- **Top-Priorität für die nächste Iteration:** Logos in Dunkel und Nacht auf eine
  eigene helle, gedimmte Fläche setzen (R11-L1).
