# Audit „Mobile UI", Runde 14 (Darstellung und Bedienung auf dem Telefon)

Prüfer: Rollenaudit `mobile-ui-reviewer` · Datum: 2026-10-26 ·
Prüfgegenstand: Web-App unter `http://localhost:4173` (laufender Server, Code-Stand
Commit `429c41a` = `main` nach Runde 13) · Zählung: **P0 0 · P1 0 · P2 0 · P3 4**

Reiner Prüfbericht, keine Codeänderung. Vorab gelesen: `docs/audits/README.md`,
`docs/audits/runde-13/README.md`, `runde-12/README.md`, `runde-11/README.md`. Die dort
genannten bekannten Grenzen sind nicht neu gemeldet.

## Prüfaufbau

Chromium über das globale Playwright-Modul (`chromium.launch()` ohne Optionen; die
Projektkopie fand keinen Browser), `isMobile`, `hasTouch`, Locale de-DE. Viewports
390 × 844, 360 × 640, 320 × 568 und quer 640 × 360. Zustand per `localStorage`-Seed:
Sammlung „Hochwasser Musterstadt" mit sieben Meldungen aus `examples/thw/`
(`uebung: false`, eine abgerückt, zwei „neu"). Durchlaufen: Startseite, Einsatzansicht
(Kacheln, Karten, aufgeklappte Karte mit „Details" und „Mehr…"), Tabelle, Scanner ohne
Kamera, Assistent Schritt 1 bis 6 (360 und 320 px), Assistent quer. Gemessen: seitlicher
Überlauf, Ziele unter 40 px, Schriften unter 12 px, feste Leisten.
Nicht prüfbar: Bildschirmtastatur, Safe-Area, WebKit, Kamera, Handschuhe, Licht. Das
Datumsfeld zeigt im Prüf-Chromium „10/26/2026"; das hängt am Betriebssystem des
Prüfrechners und ist nicht gewertet.

## Urteil

Die Behebungen aus Runde 13 halten, soweit geprüft:

- Kein seitlicher Überlauf der Seite bei 320, 360, 390 und 640 × 360.
- Keine Bedienelemente unter 40 px (außer Sprunglink bei Fokus und den bekannten
  24-px-Kästchen) und keine Schrift unter 12 px.
- R13-M1: Marke in der Tabelle jetzt „anon.", passt in die klebende Spalte (alle Breiten).
- R13-M2: „Wasser­gefahren" wird an der weichen Trennstelle umbrochen (siehe R14-M2 für
  den verbleibenden Fall).
- Feste Leiste „Ansicht: Standard" der Einsatzansicht: 57 px, verdeckt nichts Wesentliches;
  Fußleiste des Assistenten 70 px (quer 56 px).

## Befunde

### R14-M1 [P3] Kopfzelle „GES." ist in der Tabelle bei 390 und 360 px angeschnitten (R13-M3 nicht behoben)

**Kennzeichnung:** gemessen und im Bild beobachtet (390 × 844, 360 × 640).

**Ort:** Einsatzansicht → „Tabelle", Kopfzeile, Spalten „Einheit" und „Ges.".

**Beobachtung:** Die klebende Kopfzelle „EINHEIT" ist 110 px (390) bzw. 100 px (360)
breit, die Spalte „Ges." beginnt aber schon bei x = 128 (390) bzw. 117 (360), also 15
bzw. 16 px vor dem Ende der klebenden Zelle. Sichtbar ist nur „ES.". Zusätzlich steht
links in der Kopfzelle „Einheit" ein heller Streifen von rund 17 px, der nicht zur
Kopfzellenfarbe passt. Bei 320 px ist nichts überdeckt. Die Messung bei 390 px, die in
Runde 13 als ausstehend vermerkt war, bestätigt den Befund.

**Folge:** Die wichtigste Zahlenspalte (Gesamtstärke) hat im ersten Bild keine lesbare
Überschrift; die Zahlen darunter bleiben lesbar, daher P3.

**Empfehlung:** Die Breite der klebenden Kopfzelle und die Startkante von „Ges." einander
angleichen, damit keine Spalte unter die klebende Spalte rutscht; den Streifen prüfen.

### R14-M2 [P3] Typbezeichnung „Wasserschaden/Pumpen (A)" bricht hart nach „Pump | en" um

**Kennzeichnung:** im Bild beobachtet (390 × 844, 360 × 640 und 320 × 568).

**Ort:** Einsatzansicht → „Tabelle", Spalte „Einheit", Nr. 4 („Fachgruppe
Wasserschaden/Pumpen (A)").

**Beobachtung:** Nach dem Schrägstrich fehlt eine Trennstelle; „Wasserschaden/Pumpen" ist
breiter als die Spalte und bricht nach „Pump", „en (A)" steht allein in der folgenden
Zeile. Die Zeile ist 151 px hoch (fünf Zeilen Name plus Marke).

**Folge:** Wie in R13-M2: „en (A)" liest sich wie eine eigene Angabe. Weiche Trennstellen
decken nur „Wassergefahren" ab, andere lange Wörter und Schrägstrichfügungen nicht.

**Empfehlung:** Umbruchmöglichkeit nach „/" ergänzen und weiche Trennstellen allgemein
für lange Einheitentypen setzen statt für einzelne Wörter.

### R14-M3 [P3] Kopf des Assistenten bei 320 px dreizeilig, 32 % des Bildschirms

**Kennzeichnung:** gemessen (Höhe) und im Bild beobachtet (320 × 568, alle Schritte).

**Ort:** Assistent, Kopfbereich mit Logo, „‹ Startseite" und „Ansicht: Standard".

**Beobachtung:** Bei 360 und 390 px ist der Kopf 125 px hoch; bei 320 px bricht er in drei
Reihen um (181 px). Das Logo steht allein links, „‹ Startseite" daneben oben, der Knopf
„Ansicht" darunter und gegen das Logo versetzt; die Reihen stehen nicht untereinander in
einer Flucht. Mit der festen Fußleiste (70 px) bleiben rund 317 von 568 px für den
Inhalt (56 %).

**Folge:** Auf kleinen Telefonen sieht man vom Formular wenig; der Kopf wirkt zufällig
umgebrochen. Der Kopf scrollt mit, daher nur im ersten Bild störend.

**Empfehlung:** Bei schmaler Breite „Ansicht" in die Reihe mit „Startseite" setzen
(kürzere Beschriftung wie „Ansicht ▾") oder das Logo ausblenden.

### R14-M4 [P3] „Hinweise zum Handscanner" im Scanner ohne Aufklappmarke

**Kennzeichnung:** gemessen (kein `::before`, `summary` als Flex-Box, daher auch keine
Standardmarke) und im Bild beobachtet (360 × 640, Scanner ohne Kamera).

**Ort:** Scanner → Kasten „Ohne Kamera: mit dem USB-Handscanner scannen".

**Beobachtung:** Der eingeklappte Hinweis steht als fette, mittig gesetzte Zeile ohne ▸.
„Suchen, sortieren, filtern" und „Bedarf" in der Einsatzansicht tragen seit Runde 12 eine
Marke; dieser Aufklapper nicht.

**Folge:** Es ist nicht erkennbar, dass sich die Zeile aufklappen lässt; sie liest sich wie
eine Überschrift. Die Auswirkung ist gering, weil die zwei Hauptschritte darüber stehen.

**Empfehlung:** Dieselbe Aufklappmarke wie bei den anderen Aufklappern setzen.
