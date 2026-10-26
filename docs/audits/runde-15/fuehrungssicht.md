# Audit „Führungssicht", Runde 15 (Lage führen, Lagemonitor, Stand übergeben)

Prüfer: Rollenaudit `thw-command-reviewer` · Datum: 2026-10-26 ·
Prüfgegenstand: Web-App im Produktionsbuild (`vite preview`, Port 4173),
Code-Stand Commit `a7874f0` (`main` nach Runde 14).

Zählung: **P0: 0 · P1: 0 · P2: 2 · P3: 3** (5 Befunde)

Reiner Prüfbericht, keine Codeänderung. Nicht neu gemeldet sind die Grenzen aus
`docs/audits/README.md` und den Runden 10 bis 14 (darunter R10-K4 Lagemonitor
zeigt bei großen Lagen nur wenige Zeilen, R11-S4, R11-H2, R11-K2, R11-A2,
R11-A5, R11-M1, R11-M3, R12-W3, R12-H3, R12-O2, R12-O4, R12-G3, R13-W1,
R13-W6, R13-H1, R14-E7, R14-S2, R14-H1, R14-W3). Befunde anderer Berichte
dieser Runde (z. B. R15-W2 Spalten „UNT. M/W/D", R15-W3 Auftrag ohne
Quittung, R15-S2 Liste unter dem Kopf) sind nicht doppelt aufgeführt.

## Prüfaufbau

Playwright (Chromium, `chromium.launch()` ohne Optionen, globales
Playwright-Modul), Locale de-DE, Zeitzone Europe/Berlin, `isMobile`/`hasTouch`,
Telefon 390x844 und 360x640; der Lagemonitor zusätzlich bei 1100 bis 1920 px
Breite. Zustand: leere Sammlung „Hochwasser Neckar · BR Sporthalle Rottenburg",
sechs Bögen aus `examples/thw/` über „Bögen einlesen…" aufgenommen (`uebung:
false`, Zeitraum heute, Ort an die Lage angepasst), Stand der Angaben vor 2, 3,
95, 400 und 840 Minuten sowie ein Bogen mit frischem Stand. Dazu: Zug zuordnen
(erst gesammelt, dann je Karte, „1.Zug" ohne Leerzeichen), Auftrag, Abrücken mit
Quittung und Neuladen, Folgemeldung (Stärke 11 auf 8, Diesel 50 auf 20 l,
Ruhezeit ja auf nein), Sortierung und Filter, Tabelle bei 360x640, Lageblatt
(PDF, mit `pdftotext` gelesen, 2 Seiten), „Einsatz weitergeben / sichern" und
Einlesen der Sammel-PDF auf einem zweiten, leeren Gerät, Lagemonitor
(`?lagemonitor=<id>`).

Nicht prüfbar: echter Fernseher, Vollbild, Drucken, Kamera.

## Urteil

Die Lage ist ohne fremde Hilfe zu lesen und zu übergeben; die Behebungen aus
Runde 14 halten im echten Browser bis auf eine Randstelle (R15-K1).

Geprüft und in Ordnung:

- R14-K1: Kopf („⚠ älteste Meldung vor 14 Std 0 Min, 3 von 6 älter als 1 Std"),
  Karte („⚠ Stand vor 6 Std 41 Min"), Tabellenspalte „Meldung vor", Zugsummen
  („⚠ älteste Meldung vor 14 Std 7 Min"), Monitorzeile („⚠ Stand 14 Std 7 Min")
  und Lageblatt („! Stand vor 14 Std 7 Min") nennen dieselbe Zahl und
  berechnen sie ab dem Stand der Angaben. Bei Stand vor 3 und 20 Minuten steht
  keine Marke.
- R14-K2: Das Lageblatt hat bei fünf anwesenden und einer abgerückten Einheit
  zwei Seiten; Seite 1 endet mit der Zeile „Abgerückt (1)" samt Einheit, der
  Summe und den Zugsummen, Seite 2 ist der Nachtragsblock.
- R14-K3: Der Monitor führt den Zug je Einheit („2. Zug"), das Alter mit
  Stunden und Minuten.
- R14-K4: Diesel 80 l bei Benzin 0 und Gemisch 0 steht in Karte, Tabelle,
  Lageblatt und Monitor ohne „0 l"-Arten.
- R14-K5: Bei 360x640 steht „Bedarf:" auf einer frisch geöffneten Sammlung bei
  y = 553 (im ersten Bildschirm), die Einheitenliste bei 931.
- R14-H2/G2/D3: „Zug „1. Zug" gesetzt: 6 Einheiten" mit „Rückgängig"; die
  Schreibweise „1.Zug" landet in „1. Zug" (Vorschlagsliste, Zwischensummen
  zusammengeführt).
- Abrücken: Quittung „Abgerückt 14:32: Nr. 1 …" mit „Rückgängig", Zeit und
  Zug überleben das Neuladen, Lageblatt und Monitor führen die Einheit im
  eigenen Block.
- Folgemeldung: „Stärke 11 → 8 (−3) · Diesel 50 l → 20 l · Ruhezeit
  erforderlich ja → nein", Karte „Folgem. 14:33 · 11 → 8", Lageblatt-Spalte
  „Veränderung" nennt zusätzlich die Unterbringung.
- Übergabe: Die Sammel-PDF auf einem leeren Gerät eingelesen ergibt „Einsatz
  … übernommen: 6 Einheiten, davon 5 anwesend", Zug, Auftrag, Abrückstatus und
  Folgemeldung kommen an; die Quittung am Ausgangsgerät sagt „Weitergegeben ist
  sie erst, wenn sie bei der Ablösung … angekommen ist".

Reibung bleibt bei der Sortierung nach „älteste Meldung", bei dem, was der
Monitor bei knappem Platz weglässt, und an drei kleineren Stellen.

## Befunde

### R15-K1 [P2] Sortierung „Älteste Meldung zuerst" ordnet nach Eingang, nicht nach Stand: Eine Einheit mit Stand vor 1 Std 45 Min steht vor der mit Stand vor 14 Std

**Ort:** Einheitenliste (Karten), „Suchen, sortieren, filtern" › Sortierung
„Älteste Meldung zuerst" und „Zuletzt gemeldet (neueste zuerst)".

**Beobachtung:** Sechs Bögen in einem Zug eingelesen (Eingang 14:30), Stand
vor 3 Min, 20 Min, 1 Std 45 Min, 6 Std 50 Min, 14 Std 10 Min und 2 Min. Der
Kopf nennt „⚠ älteste Meldung vor 14 Std 10 Min, 3 von 5 älter als 1 Std", der
Filter „nur ⚠ ältere als 1 Std (3)" und die Tabellenspalte „Meldung vor"
sortieren nach dem Alter der Angaben (Haßmersheim 14 Std 10 Min zuerst, dann
Freiburg 6 Std 50 Min, Crailsheim 1 Std 45 Min). Die Kartenliste mit „Älteste
Meldung zuerst" zeigt dagegen: Nr. 3 Crailsheim (1 Std 45 Min), Nr. 4 Freiburg
(6 Std 50 Min), Nr. 5 Haßmersheim (14 Std 10 Min), Nr. 6, Nr. 2, Nr. 1, also in
Nummernfolge, weil alle vier Bögen dieselbe Eingangsminute haben. „Zuletzt
gemeldet" ordnet ebenso nach Eingang (Nr. 2, 6, 5, 4, 3, 1), obwohl die Marken
auf den Karten das Alter des Standes tragen.

**Erwartung der Rolle:** „Älteste Meldung zuerst" bringt die Einheit nach
oben, vor deren Angaben der Kopf warnt, in derselben Rechnung wie die Marke
„Stand vor …" auf der Karte und die Tabellenspalte.

**Folge:** Wer nach einem Stapelempfang (Datei oder Foto, alle Bögen in einer
Minute) die älteste Angabe sucht, bekommt eine Liste, die wie sortiert aussieht
und es nicht ist; Haßmersheim mit Stand von 00:25 steht in der Mitte. Dieselbe
Sammlung liefert je nach Ansicht (Karten, Tabelle) zwei verschiedene
„älteste zuerst".

**Empfehlung:** Beide Sortierungen nach demselben Zeitpunkt rechnen wie die
Altersmarke (früherer von Stand und Eingang) und die Beschriftung daran
anlehnen („Älteste Angaben zuerst").

**Nachprüfung:** Drei Bögen mit Stand vor 5 Min, 2 Std und 14 Std in einem
Zug einlesen: Karten mit „Älteste Meldung zuerst" und Tabelle mit Klick auf
„Meldung vor" zeigen dieselbe Reihenfolge, 14 Std zuerst.

### R15-K2 [P2] Lagemonitor bei knappem Platz: Die Zeilen mit ⚠ Stand fallen als erste weg, weil nach Eingang statt nach Warnung gekürzt wird

**Ort:** Lagemonitor (`?lagemonitor=<id>`), Tabelle „Einheiten", Fußzeile „+ n
weitere Einheiten · zuletzt gemeldet zuerst". Die Kürzung nach Höhe selbst ist
als R10-K4 bekannt; neu ist, welche Zeilen sie trifft.

**Beobachtung:** Fünf anwesende Einheiten, drei davon mit Stand älter als 1 Std.
Bei 1440 x 900 zeigt der Monitor Biberach und Radolfzell (beide ohne Marke) und
„+ 3 weitere Einheiten · zuletzt gemeldet zuerst"; Haßmersheim (⚠ 14 Std 10
Min), Freiburg (⚠ 6 Std 50 Min, Auftrag „Pumpen Unterführung Nord …") und
Crailsheim (⚠ 1 Std 45 Min) sind die ausgeblendeten. Die Kopfzeile sagt
gleichzeitig „⚠ älteste Meldung vor 14 Std 10 Min, 3 von 5 älter als 1 Std".
Bei 1920 x 1080 passen alle fünf, ab 1600 px ist auch der Auftrag sichtbar, bei
1280 und 1366 px Breite nicht.

**Erwartung der Rolle:** Wer vor dem Fernseher gewarnt wird, sieht dort auch,
welche Einheiten gemeint sind; was gekürzt wird, sind die unauffälligen.

**Folge:** Der Stab liest „3 von 5 älter als 1 Std" und sieht keine einzige
dieser drei Zeilen; er muss zum Telefon greifen, um zu erfahren, welche
Einheit seit Stunden nichts gemeldet hat. Der Auftrag der Einheit steht nur
auf dem breitesten Bild.

**Empfehlung:** Bei Platzmangel zuerst die Zeilen ohne ⚠ weglassen
(Zeilen mit älterem Stand zuerst zeigen) oder die Namen der Einheiten mit ⚠
in die Warnzeile schreiben; Auftrag in der Zeile vor dem Zug zeigen, solange
Platz ist.

**Nachprüfung:** Sammlung mit fünf Einheiten, drei mit Stand älter als 1 Std,
Monitor bei 1366 x 768 und 1440 x 900: Die sichtbaren Zeilen enthalten die
drei ⚠-Einheiten, gekürzt werden die ohne Marke.

### R15-K3 [P3] Zwischensummen nach Zug (Bildschirm und Lageblatt) lassen die Ruhezeit weg, die im Gesamtbedarf davor steht

**Ort:** Einsatzansicht „Zwischensummen nach Zug", Lageblatt Seite 1 rechts
unten „Zwischensummen nach Zug".

**Beobachtung:** Der Bedarf der Sammlung nennt „Ruhezeit 4 Einheiten" (Kopf,
Lageblatt, Monitor). Die Zugsummen führen Verpflegung, Unterbringung
angefordert, WC/Dusche, Fahrzeuge, Diesel und Benzin, aber keine Ruhezeit; im
Lageblatt gibt es dafür keine Spalte (Spalten „Verpfl.", „Unterbr. angef.",
„M/W/D", „Betriebsstoff", „Fzg"). Bei zwei Zügen mit je ein bis zwei
Ruhezeit-Einheiten ist nicht zu sehen, welcher Zug seine Ablösung braucht;
die Karte zeigt es je Einheit, die Summe je Zug nicht.

**Erwartung der Rolle:** Was im Gesamtbedarf steht, steht auch in der
Aufteilung nach Zug, damit die Summen aufgehen.

**Folge:** Gering: Ruhezeit-Bedarf muss pro Zug aus den Karten gezählt werden;
die Zugsummen lesen sich vollständiger, als sie sind.

**Empfehlung:** „Ruhezeit n Einheit(en)" in die Zugsummen und eine Spalte
oder Zeile im Lageblatt aufnehmen.

**Nachprüfung:** Zwei Züge mit 1 und 2 Ruhezeit-Einheiten: beide Summenzeilen
nennen die Zahl, die Summe stimmt mit dem Gesamtbedarf.

### R15-K4 [P3] Lagemonitor: Die Zeile „letzte Meldung vor 1 Min" trägt ⚠ und Warnfarbe, sobald irgendeine Einheit alt ist

**Ort:** Lagemonitor, Zeile unter „5 Einheiten · 13 Fahrzeuge · 1 abgerückt"
(Telefon 390/360 px und 1280/1920 px).

**Beobachtung:** Die Zeile lautet „⚠ letzte Meldung vor 1 Min · ⚠ älteste Meldung
vor 14 Std 7 Min, 3 von 5 älter als 1 Std", beide Teile orange mit ⚠. Das
erste ⚠ steht vor einer Meldung von vor einer Minute; im Quelltext gehört nur
das zweite zur Warnung, die Warnfarbe und das Symbol hängen an der ganzen
Zeile. Die Einsatzansicht schreibt dieselbe Aussage richtig („letzte Meldung
… (gerade eben) · ⚠ älteste Meldung …", Warnung nur beim zweiten Teil).

**Erwartung der Rolle:** ⚠ nur bei dem, was alt ist; die frische Meldung ist
keine Warnung.

**Folge:** Am Fernseher wirkt auch die frische Meldung verdächtig; der
Unterschied zwischen „es kommt nichts mehr" und „eine Einheit ist alt" geht
verloren.

**Empfehlung:** Symbol und Warnfarbe nur an den Teil „älteste Meldung …" binden,
„letzte Meldung" in Normalfarbe, solange sie jung ist.

**Nachprüfung:** Sammlung mit frischer Meldung und einer alten Einheit: Im
Monitor trägt nur „älteste Meldung" das ⚠.

### R15-K5 [P3] Lagemonitor am Telefon (390/360 px) zeigt den Auftrag der Einheit nicht, obwohl Zug und Auftrag als im Monitor behoben gelten

**Ort:** Lagemonitor, Tabelle „Einheiten", Spalte Funkruf / Ort bei höchstens
640 px Breite.

**Beobachtung:** Nr. 4 Freiburg mit Auftrag „Pumpen Unterführung Nord, bis 20
Uhr": Auf der Einsatzansicht steht „Auftrag: …" auf der Karte, im Lageblatt
in der Spalte „Auftrag / Notiz", im Monitor bei 1920 px unter dem Einheitentyp;
im Monitor bei 390 und 360 px (alle fünf Zeilen sichtbar) fehlt er, nur der
Zug („2. Zug") steht in der Zeile. Das Telefon ist der Weg, auf dem eine
Ablösung oder ein Abschnittsleiter den Monitor ohne Fernseher mitliest.

**Erwartung der Rolle:** Wo der Zug steht, steht auch der Auftrag, sonst
bleibt die Zeile „Zug 2, Stärke 0/3/7" ohne Sinn.

**Folge:** Gering: Wer den Monitor am Telefon liest, erfährt nicht, wo die
Einheit steht; Auftragsnamen ohne Personenbezug wären zulässig, wie die
breite Ansicht zeigt.

**Empfehlung:** Auftrag am Telefon als zweite Zeile unter dem Funkrufnamen
führen oder den Verzicht im Monitor erklären.

**Nachprüfung:** Monitor bei 390 x 844 mit Auftrag an einer Einheit: Die Zeile
nennt den Auftrag.

## Ergebnis aus Sicht der Rolle

- Aufgabe geschafft: ja, mit zwei Randstellen (R15-K1, R15-K2).
- Fremde Hilfe nötig: nein.
- Größtes Missverständnis: „Älteste Meldung zuerst" sortiert nach Eingang, nicht
  nach dem Alter der Angaben, das alle Warnmarken zeigen.
- Größtes Einsatzrisiko: Auf einem knappen Monitorbild verschwinden die
  Zeilen mit ⚠ Stand zuerst (R15-K2).
- Top-Priorität für die nächste Iteration: R15-K1 und R15-K2 auf dieselbe
  Altersrechnung bringen wie Kopf, Karte und Tabelle.
