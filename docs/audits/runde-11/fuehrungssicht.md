# Audit „Führungssicht", Runde 11 (Lage führen, Lagemonitor, Stand übergeben)

Prüfer: Rollenaudit `thw-command-reviewer` · Datum: 2026-10-25 ·
Prüfgegenstand: Web-App im Produktionsbuild (`vite preview`, Port 4173),
Zweig `main` (Commit `37ee21d`, Merge Runde 10).

Zählung: **P0: 0 · P1: 0 · P2: 1 · P3: 3** (4 Befunde)

Reiner Prüfbericht, keine Codeänderung. Nicht neu gemeldet sind die Grenzen aus
`docs/audits/README.md` und `runde-10/README.md` (R6-O9, R7-G4/M8, R7-G8/H9,
R7-N1, R7-N9, R8-A1, R8-M6, R9-M3, R9-G5, R8-H5/S4, leere Karten bei „Nur
Stärke", Rückgängig für Meldungen nach Neuladen, Tabellenzeilenhöhe bei
180x320).

## Prüfaufbau

Playwright (Chromium, `chromium.launch()` ohne Optionen), Locale de-DE,
`isMobile`/`hasTouch`, Telefon 390x844 und 360x640. Zustände aus
`localStorage`-Seeds (`eeb.einsaetze.v1`) mit Bögen aus `examples/thw/`,
`uebung: false`, Auftragsort passend zur Sammlung (sonst trägt jede Karte
„Anderer Einsatz?", das ist Seed-Artefakt). Varianten: 8 Einheiten mit
gemischtem Meldealter (2 bis 400 Minuten) und zwei bis drei Abgerückten; 5
anwesende Einheiten 3 bis 8 Stunden alt plus eine frische abgerückte; drei
Sammlungen gleichzeitig. Bedient: Startseite, Einsatzansicht, Karten,
Tabelle, Filterfeld, Aufklappen, Abrücken mit Quittung, Neuladen, Lageblatt
(PDF heruntergeladen und als Text gelesen, bei 4, 6, 8 und 10 Einheiten),
Lagemonitor (`?lagemonitor=s1`), „Neue Einsatz-Sammlung…".

Nicht prüfbar: echter Fernseher, Vollbild, Drucken, Kamera.

## Urteil

Die Führungssicht trägt: Kopfzahlen, „8 gemeldet · 6 zählend", Bedarfszeile,
Abrücken mit Uhrzeit und „Rückgängig", stabile „Nr." über Abrücken und
Neuladen, Lageblatt mit Block „Abgerückt" und Summenzeile „Laut Gerät" sowie
der Lagemonitor sind klar lesbar. Die Aufgabe (Lage lesen, Stand weitergeben)
ist ohne fremde Hilfe lösbar. Reibung entsteht bei der Frage „Wie aktuell ist
das, was ich sehe?": Die Altersangabe beschreibt die jüngste Meldung, nicht
den Stand der anwesenden Einheiten.

## Befunde

### R11-K1 [P2] „Letzte Meldung vor 1 Min" ohne Warnung, obwohl alle anwesenden Einheiten Stunden alt sind (Rest von R10-K1)

**Ort:** Startseite (Kachel), Einsatzansicht (Kopfzeile), Lagemonitor (Zeile
unter „Einheiten").

**Beobachtung (gemessen):** Sammlung mit sechs Einheiten, eine frisch gemeldet
und bereits abgerückt, fünf anwesende mit Meldungen vor 3 Std 20 Min bis 8 Std
20 Min. Kachel und Einsatzansicht zeigen „letzte Meldung 16:30 (vor 1 Min)" ohne
⚠; der Monitor zeigt „letzte Meldung vor 1 Min" und „seit erster Meldung: 8
Stunden, 20 Minuten". Die Warnung ab 60 Minuten aus R10-K1 greift nicht, weil
die Meldung der abgerückten Einheit mitzählt. Ebenso bei gemischtem Alter ohne
Abgerückte: ein frischer Eintrag verdeckt, dass andere Einheiten 3 bis 6
Stunden alt sind. Einzelalter je Einheit stehen weder auf den Karten (nur die
Marke „neu"; der Stand nur nach dem Aufklappen als Uhrzeit) noch im Monitor
(Tabelle ohne Alter) noch in der Tabelle der Einsatzansicht als Alter.

**Folge:** Die Stärke 49 oder 53 wirkt aktuell, obwohl sie überwiegend auf
Meldungen von heute früh beruht. Eine Führungskraft liest dem Stab die Summe als
frisch vor.

**Empfehlung:** Das Alter an den anwesenden (zählenden) Einheiten messen und
die älteste nennen („älteste Meldung vor 8 Std 20 Min, 5 von 6 älter als 1
Std", mit ⚠). Je Karte und Monitorzeile eine knappe Altersmarke ab 60 Minuten.

**Nachprüfung:** Seed wie oben: Kopf, Kachel und Monitor nennen die alte
Lage mit Warnzeichen; eine abgerückte frische Meldung ändert das nicht.

### R11-K2 [P3] Abgerückte Einheiten bleiben zwischen den Anwesenden stehen; Filter und Sortierung kennen den Status nicht

**Ort:** Einsatzansicht, Einheitenliste, „Suchen, sortieren, filtern".

**Beobachtung:** Nach „Abrücken" bleibt die Karte an ihrer Stelle (Nr. 4 von 8
bleibt zwischen Nr. 3 und Nr. 5, auch nach Neuladen), nur durchgestrichen mit
Marke „ABGERÜCKT". Das Filterfeld bietet Suche, Sortierung (Nr., Name, zuletzt
gemeldet, Eintreffzeit), Zug, Organisation, Qualifikation, „nur dringender
Bedarf" und Auftrag/Zug, aber keinen Status („nur Anwesende", „Abgerückte
ausblenden"). Bei 30 Einheiten und mehreren Abgerückten steht die Liste voller
durchgestrichener Karten.

**Folge:** „Wer ist noch da?" verlangt Durchlesen der Liste; die Zählung „6
zählend" lässt sich nicht an der Liste nachvollziehen.

**Empfehlung:** Filter „Anwesende / Abgerückte" und Abgerückte standardmäßig
am Listenende oder eingeklappt.

**Nachprüfung:** Drei von acht Einheiten abrücken; Filter „Anwesende" zeigt
fünf Karten.

### R11-K3 [P3] Zweite Einsatz-Sammlung mit gleichem Namen wird ohne Hinweis angelegt; die Verknüpfungen auf der Startseite sind nicht unterscheidbar

**Ort:** Startseite, „Neue Einsatz-Sammlung…" und die Kurzzeilen „„…" öffnen".

**Beobachtung:** „Hochwasser Musterstadt" wurde bei bestehender gleichnamiger
Sammlung ohne Rückfrage ein zweites Mal angelegt. Auf der Startseite stehen
dann zwei Zeilen „„Hochwasser Musterstadt" öffnen", unterschieden nur durch
die Zeit der letzten Meldung (bzw. keine), und zwei gleichnamige Kacheln; die
neue trägt keinen Ort.

**Folge:** Nach Übernahme durch eine zweite Führungskraft oder doppeltem
„Einsatz importieren…" lässt sich die falsche Sammlung öffnen und dort
aufnehmen.

**Empfehlung:** Beim Anlegen auf die vorhandene Sammlung hinweisen („gibt es
schon, 5 Einheiten – öffnen?"), in den Kurzzeilen Einheitenzahl oder Ort
nennen.

**Nachprüfung:** Zweite Sammlung mit gleichem Namen anlegen: Hinweis erscheint;
Kurzzeilen unterscheiden sich sichtbar.

### R11-K4 [P3] Lageblatt: Schaltfläche verspricht „bis etwa zehn Einheiten eine Seite", ab acht Einheiten sind es zwei

**Ort:** Einsatzansicht, „Lageblatt (A4 quer)" (Hinweistext der Schaltfläche).

**Beobachtung (gemessen, PDF-Seiten):** 4 Einheiten 1 Seite, 6 Einheiten 1
Seite, 8 Einheiten 2 Seiten, 10 Einheiten 2 Seiten. Seite 2 trägt bei acht
Einheiten nur Tabellenkopf und leere „Nachtrag von Hand"-Zeilen.

**Folge:** Das Blatt, das an die Wand oder ins Fach soll, ist mit einer leeren
zweiten Seite länger als angekündigt.

**Empfehlung:** Zusage im Text an das tatsächliche Verhalten anpassen („bis
etwa sechs Einheiten") oder die Nachtragszeilen so kürzen, dass acht Einheiten
auf eine Seite passen.

**Nachprüfung:** Lageblatt bei 8 Einheiten: Seitenzahl entspricht der Angabe.
