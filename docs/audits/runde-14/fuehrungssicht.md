# Audit „Führungssicht", Runde 14 (Lage führen, Lagemonitor, Stand übergeben)

Prüfer: Rollenaudit `thw-command-reviewer` · Datum: 2026-10-26 ·
Prüfgegenstand: Web-App im Produktionsbuild (`vite preview`, Port 4173),
Code-Stand Commit `429c41a` (`main` nach Runde 13).

Zählung: **P0: 0 · P1: 0 · P2: 1 · P3: 4** (5 Befunde)

Reiner Prüfbericht, keine Codeänderung. Nicht neu gemeldet sind die Grenzen aus
`docs/audits/README.md` und den Runden 10 bis 13 (darunter R11-S4, R11-H2,
R11-K2, R11-A2, R11-A5, R11-M1, R11-M3, R12-W3, R12-H3, R12-O2, R12-O4, R12-G3,
R13-W1, R13-W6, R13-H1).

## Prüfaufbau

Playwright (Chromium, `chromium.launch()` ohne Optionen, globales
Playwright-Modul, weil die Projektkopie keinen Browser fand), Locale de-DE,
`isMobile`/`hasTouch`, Telefon 390x844 und 360x640. Zwei Zustände:

1. `localStorage`-Seed (`eeb.einsaetze.v1`) mit acht Bögen aus `examples/thw/`
   (`uebung: false`), Meldealter 2 bis 400 Minuten, zwei Züge, eine Einheit
   ohne Zug. Seed-Artefakte (alle Karten „ANONYMISIERT", „Zeitraum vorbei",
   „Stand" im Juli) wurden nicht bewertet.
2. Leere Sammlung, Bögen über „Bögen einlesen…" aus JSON-Dateien mit frischem
   `stand` (Erstmeldung, Folgemeldung mit +1 Person, Bogen mit Stand vor 14
   Stunden).

Bedient: Startseite, Einsatzansicht, Aufklapper „Bedarf" und „Zwischensummen
nach Zug", Karte aufklappen, Auftrag/Notiz speichern, Abrücken mit Quittung und
Neuladen, Tabelle und „Suchen, sortieren, filtern" bei 360x640, Lageblatt (PDF,
mit `pdftotext` gelesen, 2 Seiten), „Einsatz weitergeben / sichern" und
Einlesen der Datei auf einem zweiten, leeren Gerät, Lagemonitor
(`?lagemonitor=<id>`, 390 und 360 px breit).

Nicht prüfbar: echter Fernseher, Vollbild, Drucken, Kamera.

## Urteil

Die Behebungen aus Runde 13 halten, die Lage ist ohne fremde Hilfe zu lesen und
zu übergeben.

Geprüft und in Ordnung:

- R13-K1: Kurzzeile, aufgeklappter Bedarf, Lageblatt und Monitor nennen alle
  drei Kraftstoffe („Diesel 610 l · Benzin 160 l · Gemisch 10 l"). Die
  Zugsummen stimmen nach (Stärke 37 + 20 + 12 = 69, Unterbringung 11 + 16 + 0
  = 27, Diesel 390 + 160 + 60 = 610, Benzin 80 + 80 = 160).
- R13-K2: Das Lageblatt kennzeichnet ältere Meldungen je Zeile („! Meldung vor 6
  Std 40 Min"); der Kopf nennt „4 von 7 älter als 1 Std".
- Altersaussage in Kopf, Monitor, Zugsummen und Filter („nur ⚠ ältere als 1 Std
  (5)") stimmt überein; nach dem Abrücken zählt sie neu („4 von 7").
- Abrückquittung mit Uhrzeit und „Rückgängig", der Abrückzeitpunkt überlebt das
  Neuladen; das Lageblatt führt Abgerückte im eigenen Block mit „ab"-Zeit.
- Übergabe: Die Sammel-PDF auf ein leeres Gerät eingelesen ergibt „Einsatz …
  übernommen: 8 Einheiten, davon 7 anwesend. Stand der Datei: letzte Meldung
  …"; Zug, Auftrag und Abrückstatus kommen an. Hinweis am Ausgangsgerät:
  „Weitergabe-Datei erzeugt … Empfang nicht bestätigt".
- Folgemeldung: „Stärke 8 → 9 (+1) · Diesel 60 l → 200 l · Unterbringung
  angefordert nein → ja", Karte „Folgem. 09:53 · 8 → 9", Verpflegung „19
  (Stärke 20)" bei Abweichung.

Reibung bleibt an einer Stelle, an der die Zeitangabe etwas anderes misst, als
ihre Beschriftung nahelegt (K1), und an vier kleineren Stellen.

## Befunde

### R14-K1 [P2] „Meldung vor …" misst das Eintreffen, nicht das Alter der Angaben: Ein Bogen mit Stand von gestern Abend gilt als „gerade eben"

**Ort:** Einsatzansicht (Kopfzeile, Karte, Kasten „Neu seit der letzten
Kenntnisnahme"), Lagemonitor, Lageblatt.

**Beobachtung:** Bogen „Biberach/Riß" mit Stand vor 14 Stunden (25.10.2026,
19:53) über „Bögen einlesen…" aufgenommen. Kopf: „letzte Meldung 26.10.2026,
09:53 (gerade eben)", kein ⚠. Karte: Marke „kürzlich eingetroffen", zugeklappt
ohne jede Altersangabe. Erst aufgeklappt steht „eingetroffen 26.10.2026, 09:53
· Stand 25.10.2026, 19:53 · aus Datei übernommen", ohne Hinweismarke; die
Marke „älter als 24 h" kommt erst ab einem Stand von mehr als 24 Stunden. Der
Monitor zeigt „letzte Meldung gerade eben" und „Eingetroffen: … gerade eben";
das Lageblatt trägt „Stand 25.10.2026, 19:53" nur als Datum in einer Spalte,
ohne Kennzeichnung. Die Zahlen (Stärke 11, Unterbringung 11 Personen, Diesel
50 l) gehen unmarkiert in alle Summen ein. Dieselbe Einheit, mit frischem Stand
als Folgemeldung eingelesen, wird anders gewertet als die Altersmarken
vermuten lassen: Alle ⚠-Marken (Schwelle 1 Std) hängen am Eintreffen, die
einzige Stand-Marke (Schwelle 24 h) ist um den Faktor 24 großzügiger.

**Erwartung der Rolle:** Wer die Lage liest, will wissen, wie alt die
gemeldeten Zahlen sind, nicht nur, wann die Datei ankam. Ein Bogen vom Vorabend,
der heute früh gescannt oder per Datei übergeben wird, soll sich vom Bogen
unterscheiden, den die Einheit vor fünf Minuten erstellt hat.

**Folge:** Eine Einheit, die nachts einen Bogen erstellt und morgens abgibt (oder
eine Datei, die über ein Zwischengerät läuft), erscheint als aktuelle Meldung.
Stärke, Verpflegung und Unterbringung werden für den Tag eingeplant, obwohl
sie vor 14 Stunden gezählt wurden; auf dem Fernseher und im Kopf ist der
Unterschied nicht zu sehen.

**Empfehlung:** Neben „Meldung vor" (Eintreffen) auch das Alter des Standes
ausweisen, sobald es deutlich über dem Eintreffen liegt (z. B. Karte und
Monitorzeile „Stand vor 14 Std"), und die Schwelle für die Marke an die für
„älter als 1 Std" gewählte Größenordnung anlehnen oder einstellbar machen; im
Lageblatt die Zeile bei älterem Stand wie bei älterer Meldung markieren.

**Nachprüfung:** Bogen mit `stand` vor 14 Stunden einlesen: zugeklappte Karte,
Monitorzeile und Lageblatt-Zeile tragen eine Altersangabe oder Marke zum Stand;
bei Stand vor 5 Minuten fehlt sie.

### R14-K2 [P3] Lageblatt: Überschrift „Abgerückt (1)" steht allein am Fuß von Seite 1, die zugehörige Zeile erst auf Seite 2

**Ort:** Lageblatt (A4 quer, PDF), Seitenumbruch bei 7 anwesenden und einer
abgerückten Einheit.

**Beobachtung:** Das Blatt hat zwei Seiten. Seite 1 endet nach der siebten
Einheit mit der Zwischenüberschrift „Abgerückt (1)"; die abgerückte Einheit
(Nr. 5, „ab 26.10.2026, 09:47") steht mit wiederholtem Tabellenkopf auf Seite
2, darunter „Summe laut Gerät (7 zählend · 1 abgerückt)", der Nachtragsblock
von Hand und die Zugsummen.

**Erwartung der Rolle:** Eine Überschrift bleibt bei ihrem Inhalt; wer Seite 1
einzeln aushängt, liest nicht „Abgerückt" ohne Einheit.

**Folge:** Bei Aushang oder Übergabe der ersten Seite sieht es aus, als gäbe es
einen Block Abgerückter ohne Eintrag; Summe und Zugsummen sind erst auf der
zweiten Seite.

**Empfehlung:** Zwischenüberschrift mit der ersten Zeile zusammenhalten (Umbruch
davor).

**Nachprüfung:** Lageblatt bei sieben anwesenden und einer abgerückten Einheit
erzeugen: Seite 1 endet nicht mit der Überschrift „Abgerückt".

### R14-K3 [P3] Lagemonitor zeigt je Einheit weder Zug noch Auftrag

**Ort:** Lagemonitor, Tabelle „Einheiten" (Spalten Orga, Funkruf / Ort, F, U, M).

**Beobachtung:** Bei Einheiten in „1. Zug" und „2. Zug" und einer Einheit mit
Auftrag („Sandsackverbau Damm Nord, Ablösung 18 Uhr") zeigt der Monitor
weder Zug noch Auftrag. Die Zeilen stehen nach Funkrufname geordnet, nicht nach
Zug; ⚠-Marken mit „1 Std" bis „6 Std" stehen gemischt dazwischen. Das Alter ist
abgerundet („⚠ 1 Std" bei 1 Std 30 Min, „⚠ 6 Std" bei 6 Std 40 Min), die
Kartenansicht nennt Stunden und Minuten. Zugsummen gibt es auf dem Monitor
nicht.

**Erwartung der Rolle:** Auf dem Fernseher sehen alle im Stab, welche Einheit in
welchem Zug an welchem Auftrag steht; die Zugstruktur ist die Gliederung der
Lage.

**Folge:** Wer vor dem Fernseher steht, muss zum Telefon greifen, um zu sehen,
zu welchem Zug eine Einheit gehört oder welchen Auftrag sie hat; die
Einsatzstruktur ist am Monitor nicht ablesbar.

**Empfehlung:** Zug (und, soweit ohne Personenbezug, den Auftrag) als Spalte
bzw. Gruppierung aufnehmen; Alter einheitlich mit Minuten.

**Nachprüfung:** Seed mit Zug und Auftrag: Monitorzeilen tragen Zug und
Auftragskurztext oder sind nach Zug gruppiert.

### R14-K4 [P3] Lageblatt-Bedarfszeile führt „Benzin 0 l", aber kein Gemisch; Bildschirm und Monitor nennen nur Diesel

**Ort:** Lageblatt, Kopf „Bedarf:" bei einer Einheit mit Diesel 50 l, Benzin 0
l, Gemisch 0 l.

**Beobachtung:** Lageblatt: „… Ruhezeit: 1 Einheit · Diesel 50 l · Benzin 0 l".
Einsatzansicht und Monitor: „… Diesel 50 l · Ruhezeit 1 Einheit". Bei
Mengen größer 0 nennen alle drei Orte alle Arten (R13-K1 hält); die Ausgabe
bei 0 ist uneinheitlich (Benzin ja, Gemisch nein, am Bildschirm keine).

**Erwartung der Rolle:** Die gleiche Regel in allen Ausgaben; eine „0" nur,
wenn sie eine Aussage ist („keine angefordert").

**Folge:** Gering, aber ein Blatt, das „Benzin 0 l" nennt, Gemisch aber
auslässt, lässt Lesende rätseln, ob Gemisch nicht erfasst oder nicht benötigt
ist.

**Empfehlung:** Entweder nur Arten mit Menge größer 0 oder alle drei mit 0, in
allen Ausgaben gleich.

**Nachprüfung:** Seed mit Diesel 50, Benzin 0, Gemisch 0: Kurzzeile, Monitor
und Lageblatt nennen dieselben Arten.

### R14-K5 [P3] Telefon 360x640: Der Bedarf liegt unterhalb des ersten Bildschirms, davor stehen drei große Erfassungsknöpfe

**Ort:** Einsatzansicht, erster Bildschirm.

**Beobachtung:** Bei 360x640 füllen Kopf, Zählkachel und die drei Knöpfe „Bogen
scannen…", „Einheit manuell erfassen…", „Bögen einlesen…" den Bildschirm; die
Zeile „Bedarf:" beginnt bei y = 661, die „Zwischensummen nach Zug" bei 783,
die Einheitenliste bei 1015 (gemessen). Bei 390x844 beginnt „Bedarf" bei y =
649 und ist sichtbar. Ohne Bildlauf sichtbar sind die Alterszeile im Kopf und
die Gesamtzahlen.

**Erwartung der Rolle:** Wer die Ansicht zum Lesen öffnet, sieht Sofortbedarf
und Warnung ohne Wischen; die Erfassungsknöpfe sind für den Moment da, in dem
ein Bogen eintrifft.

**Folge:** Der Sofortbedarf (Verpflegung, Unterbringung, Kraftstoff, Ruhezeit)
ist auf kleinen Telefonen einen Wisch entfernt; der Aufklapper „Zwischensummen
nach Zug" und die Liste liegen dahinter.

**Empfehlung:** Erfassungsknöpfe kompakter (z. B. zwei Zeilen statt drei
Blöcken) oder die Bedarfszeile vor die Knöpfe.

**Nachprüfung:** Bei 360x640 steht „Bedarf:" innerhalb von 640 px (abzüglich
Fußleiste).

## Aufgabe geschafft

ja (ohne Umweg) · Fremde Hilfe nötig: nein · Größtes Missverständnis: „Gerade
eben" im Kopf und auf dem Monitor wirkt wie „aktuelle Zahlen", meint aber nur
„gerade eingetroffen". · Größtes Einsatzrisiko: Ein Bogen vom Vorabend fließt
unmarkiert in Stärke und Bedarf des Tages. · Top-Priorität: R14-K1.
