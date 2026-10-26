# Audit „Mobile UI", Runde 15 (Darstellung und Bedienung auf dem Telefon)

Prüfer: Rollenaudit `mobile-ui-reviewer` · Datum: 2026-10-26 ·
Prüfgegenstand: Web-App unter `http://localhost:4173` (laufender Server, Code-Stand
Commit `a7874f0` = `main` nach Runde 14) · Zählung: **P0 0 · P1 0 · P2 0 · P3 4**

Reiner Prüfbericht, keine Codeänderung. Vorab gelesen: `docs/audits/README.md`,
`runde-14/README.md`, `runde-13/README.md`, `runde-12/README.md` und der Bericht
`runde-14/mobile-ui.md`. Die dort genannten bekannten Grenzen sind nicht neu gemeldet.

## Prüfaufbau

Chromium über das globale Playwright-Modul (`chromium.launch()` ohne Optionen; die
Projektkopie fand keinen Browser), `isMobile`, `hasTouch`, Locale de-DE. Viewports
390 x 844, 360 x 640, 320 x 568 und quer 640 x 360. Zustand per `localStorage`-Seed:
Sammlung „Hochwasser Musterstadt" mit acht Meldungen aus `examples/thw/` (`uebung: false`,
Stand auf die letzten Stunden gesetzt, eine abgerückt). Durchlaufen: Startseite,
Einsatzansicht (Kacheln, Karten, aufgeklappte Karte mit Abrücken, Zug, Mehr, Details,
Tabelle), Scanner ohne Kamera, „Einheit manuell erfassen", Schnellerfassung (Dialog),
Weitergeben, Lagemonitor, Assistent Schritt 1 bis 6 (360, 390, 320), Ansichtswahl im
Kopf (Standard und Nacht), Querformat. Gemessen: seitlicher Überlauf, Ziele unter 40 px,
Schriften unter 12 px, feste Leisten, Tabellenspalten.
Nicht prüfbar: Bildschirmtastatur, Safe-Area, WebKit, Kamera, Handschuhe, Licht. Das
Datumsfeld zeigt im Prüf-Chromium „10/26/2026"; das hängt am Betriebssystem des
Prüfrechners und ist nicht gewertet. Die Meldung „Zeitraum: Jahr prüfen" an den
Beispielkarten kommt von den Seed-Daten und ist nicht gewertet.

## Urteil

Die Behebungen aus Runde 14 halten im echten Browser, soweit geprüft:

- R14-M1: Kopfzelle „Ges." in der Tabelle sichtbar (390 px im Bild; 360 und 320 px
  gemessen: klebende Spalte endet bei 138, „Ges." beginnt bei 138 bzw. 138).
- R14-M2: Zeile „Wasserschaden/Pumpen (A)" nur noch 131 px hoch statt 151 px (360 und 320).
- R14-M3: Kopf des Assistenten bei 320 px zweizeilig statt dreizeilig, Logo ausgeblendet,
  „Ansicht" in der Reihe mit „Startseite".
- R14-M4: Aufklappmarke ▸ an „Hinweise zum Handscanner" vorhanden (320 px).
- R14-G1 und R14-S1 im Verhalten bestätigt: Ein zweiter Tipp auf „Weiter" binnen 1,2 s
  zeigt „Einen Moment …" und löst nichts doppelt aus.
- Kein seitlicher Überlauf bei 320, 360, 390 und 640 x 360; keine Bedienelemente unter
  40 px außer Sprunglink bei Fokus und den bekannten 24-px-Kästchen; keine Schrift unter
  12 px; keine Konsolenfehler.

## Befunde

### R15-M1 [P3] Aufgeklappte Karte hat keinen Rahmen mehr und sitzt anders als ihre Nachbarn

**Kennzeichnung:** gemessen (berechneter Stil) und im Bild beobachtet (390 x 844, 360 x 640).

**Ort:** Einsatzansicht → Karten → eine Karte über „Aufklappen: Zeiten, Details und
Aktionen" öffnen.

**Beobachtung:** Die zugeklappten Karten (`li.einheit-zeile.kompakt`) haben einen 1 px
Rahmen und 12 px Innenrand. Die aufgeklappte Karte (`li.einheit-zeile`) hat keinen Rahmen
(berechneter Rand leer), ihr Text beginnt rund 11 px weiter links als der der Nachbarn und
ihre sieben Knöpfe laufen in fünf Reihen (561 px hoch bei 390 px). Die nächste Karte
beginnt unmittelbar unter „Mehr…" ohne Linie dazwischen. Der ▾-Pfeil zum Zuklappen oben
rechts fehlt; zugeklappt wird nur über „Zuklappen" unter der Zeile „Hinweise".

**Folge:** Wo die geöffnete Karte endet und die nächste beginnt, sieht man erst am
Kartentitel der nächsten; beim Wischen durch die Liste verschwimmen Knöpfe der geöffneten
Karte mit dem Kopf der folgenden. Kein Datenrisiko, daher P3.

**Empfehlung:** Die geöffnete Karte wie die anderen mit Rahmen und gleichem Innenrand
zeichnen, am besten mit hervorgehobener Rahmenfarbe, damit „offen" erkennbar ist.

### R15-M2 [P3] Fußleiste bei „Einheit manuell erfassen" ist 128 px hoch (20 bis 23 % des Bildschirms)

**Kennzeichnung:** gemessen (390 x 844, 360 x 640, 320 x 568; quer 640 x 360 nur 56 px).

**Ort:** Einsatzansicht → „Einheit manuell erfassen…", feste Leiste unten (`nav.assistent-nav.mit-uebernehmen`).

**Beobachtung:** Mit der Zeile „In Einsatz übernehmen" über „←", „◐" und „Weiter →" ist die
Leiste auf jedem Schritt 128 px hoch (Normalfall des Assistenten: 70 px). Bei 360 x 640
bleiben 512 px, bei 320 x 568 nur 440 px für das Formular; auf einem echten Telefon mit
sichtbarer Adressleiste weniger.

**Folge:** In der Einsatzansicht, wo schnell erfasst wird, sieht man pro Bild nur ein bis
zwei Felder; eine Bildschirmtastatur (nicht prüfbar) verkleinert das weiter.

**Empfehlung:** „In Einsatz übernehmen" in die Reihe der Fußleiste ziehen oder erst auf
dem letzten Schritt als eigene Zeile zeigen, bei Höhen unter 700 px kompakter setzen.

### R15-M3 [P3] Aufgeklappte Ansichtswahl bläht den Kopf des Assistenten auf und lässt das Logo springen

**Kennzeichnung:** gemessen und im Bild beobachtet (360 x 640, Thema „Standard").

**Ort:** Assistent, Kopf → „Ansicht: Standard ▾".

**Beobachtung:** Zugeklappt ist der Kopf 125 px hoch. Aufgeklappt zeigt er vier weiße
Kacheln („Standard", „Feld", „Dunkel", „Nacht") in einer Reihe und ist rund 255 px hoch
(40 % von 640 px). Dabei rutscht das Logo von der Reihe von „‹ Startseite" nach unten
neben die Ansichtswahl, und der Formularbeginn wandert um 130 px. Die weißen Kacheln auf
dem nachtblauen Kopf sind die hellsten Flächen der Seite (im Thema „Nacht" ist der Knopf
dagegen dunkel).

**Folge:** Wer das Thema wechseln will, verliert für einen Moment den Formularkontext und
sieht ein Layout, das sich vor dem Tippen verschiebt; ein zweiter Tipp trifft leicht eine
andere Kachel als geplant.

**Empfehlung:** Die Auswahl als Überlagerung unter dem Knopf öffnen (Kopf bleibt 125 px),
das Logo an seinem Platz lassen, die Kacheln in der Farbe des Kopfes statt reinweiß.

### R15-M4 [P3] „Bedarf"-Zeile bricht zwischen „Unterbringung" und „27 Personen"

**Kennzeichnung:** im Bild beobachtet (390 x 844, 360 x 640).

**Ort:** Einsatzansicht, Aufklapper „▸ Bedarf:" unter den Erfassungsknöpfen.

**Beobachtung:** Die Zeile „Verpflegung 59 · Unterbringung 27 Personen · Diesel 430 l · …"
ist vierzeilig neben die Marke „▸ Bedarf:" gesetzt (Marke mittig, Text rechts mit 54 px
Einzug). Der Umbruch fällt nach „Unterbringung", die Zahl „27 Personen" steht allein in
der nächsten Zeile; ebenso steht „Ruhezeit 4 Einheiten" einzeln unten.

**Folge:** Wert und Bezeichnung lassen sich unter Zeitdruck falsch zusammenlesen
(„Unterbringung" ohne Zahl, „27 Personen" frei schwebend). Gering, weil der Aufklapper
die Aufschlüsselung enthält.

**Empfehlung:** Jeden Posten als unteilbaren Block („Unterbringung 27 Personen") setzen,
sodass nur zwischen den Posten umbrochen wird; die Marke oben linksbündig statt mittig.
