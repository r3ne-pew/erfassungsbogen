# Audit „Stress und Unterbrechung“, Runde 11 (Zeitdruck, Ablenkung, Wiedereinstieg)

**Prüfer:** Rollenaudit `thw-stress-test-user` · **Datum:** 2026-10-25 ·
**Zählung:** P0: 0 · P1: 0 · P2: 1 · P3: 3 (insgesamt 4 neue Befunde)

Prüfgegenstand: Web-App, laufender Produktionsbuild unter
`http://localhost:4173` (`vite preview`). Reiner Prüfbericht, keine
Codeänderung; der Server wurde weder neu gebaut noch angehalten, es wurde kein
Prozess beendet.

## Prüfaufbau

Playwright (global installiert, Version 1.56.1; die Version im Repository
findet den vorhandenen Chromium nicht), `chromium.launch()` ohne Optionen,
`isMobile`/`hasTouch`, Locale de-DE, Telefon-Viewports 390 × 844 und
360 × 640. Jeder Lauf mit eigenem Browser-Kontext. Tipps mit
`touchscreen.tap`, Unterbrechung mit `reload()`, Zurück-Geste mit
`page.goBack()`, Drehen mit `setViewportSize`. Zustände über die Oberfläche
(neue Sammlung, „Einheit manuell erfassen…“) und über einen
`eeb.entwurf.v1`-Seed aus `examples/thw/grossbogen-verstaerkter-bergungszug.json`
(`uebung: false`, `stand` auf heute). Skripte und Bilder im Scratchpad unter
`.../scratchpad/r11/`.

Vorher gelesen: `docs/audits/README.md`, `docs/audits/runde-10/README.md` und
der Runde-10-Bericht zu dieser Rolle. Die dort genannten bekannten Grenzen
(R6-O9, R7-G4/M8, R7-G8/H9, R7-N1, R7-N9, R8-A1, R8-M6, R9-M3, R9-G5,
R8-H5/S4; leere Karten bei „Nur Stärke“, Rückgängig für Meldungen nach dem
Neuladen, Zeilenhöhe bei 180 × 320) wurden nicht neu gemeldet. Ebenso nicht neu
gemeldet: der feste Balken „◐ Ansicht: Standard“ über Quittungen und
Listenende (R7-G4/M8) und der Verlust des Textes im Dialog „Namen
einfügen…“ beim Neuladen (R9: „nicht zugesagt“).

**Kennzeichnung:** *gemessen* = im Testbrowser mit Zahlen reproduziert;
*beobachtet* = gesehen, ohne Messreihe; *Risiko* = abgeleitet, nicht
nachgestellt.

**Nicht geprüft:** echte Kamera, echter Lärm, Handschuhe, echte
Bildschirmtastatur, WebKit, native Builds, Zwei-Geräte-Abgleich, 180 × 320,
Tablet.

## Urteil

Die Kernaufgaben gelingen unter Stress und Unterbrechung ohne fremde Hilfe, und
die Absicherungen sind dicht. Gemessen und für gut befunden:

- Tippen und sofortiges Neuladen nach 0, 50, 200 und 600 ms: Der Entwurf
  enthielt jedes Mal den vollen getippten Wert.
- Zwei Fenster mit dem Bogen: Das veraltete Fenster sagt „Hier wird nichts
  gespeichert“ und bietet „Anderen Stand laden“ oder „Meine Fassung behalten“.
- „Neuen Bogen erstellen“ bei vorhandenem Entwurf fragt und nennt den Rückweg.
- „In Einsatz übernehmen“ ohne Ort, mit Stärke 0 und mit einer Eintreffzeit in
  der Zukunft (23:59 um 16:37) fragt jeweils konkret nach und bietet den
  richtigen Weg zuerst an. Ein Doppeltipp erzeugt eine Einheit.
- Drehen von 360 × 640 auf 640 × 360 mitten im Tippen und bei offener Rückfrage
  behält Eingabe, Fokus und Rückfrage; alle drei Knöpfe bleiben im Bild.
- Zahlen-Stepper „+“ im Abstand von 150 bis 1 300 ms: 8 Tipps ergeben immer 8.
- „Abrücken“ mit Quittung und „Rückgängig“; nach dem Neuladen bietet die Karte
  „Wieder anwesend“.

Reibung bleibt an vier Stellen: Die Tippsperre beim Weiterschalten der
QR-Teile verwirft bei ruhigem Tippen jeden zweiten Tipp (R11-S1), die
Browser-Zurück-Geste führt nach dem Abschluss einer Handlung uneinheitlich
zurück (R11-S2), „Zur Kenntnis genommen“ löscht alle Neu-Marken ohne
Rückweg (R11-S3), und mit einem liegengebliebenen eigenen Entwurf steht der
Einsatz erst 1 000 px tiefer auf der Startseite (R11-S4).

- **Aufgabe geschafft:** ja.
- **Fremde Hilfe nötig:** nein.
- **Größtes Missverständnis:** Wer die QR-Teile im Takt des Scanners
  weiterschaltet, hält „Teil 3“ für angezeigt, obwohl der Tipp verworfen wurde
  und noch Teil 2 steht (R11-S1).
- **Größtes Einsatzrisiko:** Der Empfänger bekommt Teile doppelt oder gar nicht,
  weil die Weiterschaltung unter ruhigem Tippen ausfällt (R11-S1, P2).
- **Top-Priorität für die nächste Iteration:** Die Sperre der Taste „Weiter zu
  Teil n“ auf das Maß der Schrittwechsel-Sperre (900 ms) verkürzen (R11-S1).

## Befunde

### R11-S1 [P2] QR-Vollbild: „Weiter zu Teil n →“ verwirft bei ruhigem Tippen jeden zweiten Tipp

**Priorität:** P2

**Kennzeichnung:** gemessen (Skripte `ag.js`, `ah.js`, `af.js`).

**Fundstelle / Aufgabe:** Übersicht → „Bogen übergeben…“ → „QR-Code im
Vollbild zeigen“ (Großbogen, 7 Teile, 360 × 640) → „Weiter zu Teil 2 →“ und
folgende.

**Beobachtung:** Fünf Tipps auf dieselbe Stelle, gemessen als erreichter Teil
nach jedem Tipp:

| Abstand der Tipps | Teile nach Tipp 1 bis 5 |
| --- | --- |
| 500 ms | 2 2 2 3 3 |
| 800 ms | 2 2 3 3 4 |
| 1 000 ms | 2 2 3 3 4 |
| 1 100 ms | 2 2 3 3 4 |
| 1 300 ms | 2 2 3 3 4 |
| 1 600 ms | 2 3 4 5 6 |

Erst ab rund 1,5 s nimmt jeder Tipp an. Verworfene Tipps zeigen für den Moment
die Pille „Einen Moment …“ über dem Finger, danach nichts mehr; der Teil bleibt
stehen. Im Quelltext ist für den Schrittwechsel („Weiter →“ im Assistenten)
bewusst 900 ms gewählt (R10-S2: „bei 1,5 s verwarf die Sperre bei gleichmäßigem
Tippen im Abstand von 1,0 bis 1,3 s jeden zweiten Tipp“); die Stelle „Weiter zu
Teil n“ liegt weiter unter der allgemeinen Ortssperre von 1,5 s.

**Erwartung der Rolle:** Ich halte das Telefon an den Scanner der Gegenstelle,
warte, bis er „piept“ (rund eine Sekunde), und tippe weiter. Jeder bewusste
Tipp nach 0,8 bis 1,3 s zählt.

**Folge im Einsatz:** Bei sieben Teilen fallen bei diesem Rhythmus etwa drei
Tipps aus. Die Gegenstelle sieht Teil 2 zweimal und wartet; der Zeigende tippt
nach, ohne zu wissen, ob er schon weiter ist. Unter Lärm und mit Blick auf das
Scanner-Display bleibt die Anzeige „Teil n von 7“ die einzige Kontrolle.

**Empfehlung:** Die Sperre für „Weiter zu Teil n →“ und „← Teil n“ wie die
Schrittwechsel-Sperre kurz halten (rund 900 ms; ein Doppeltipp liegt bei
100 bis 700 ms) oder den Tipp nicht verwerfen, sondern auf den nächsten Teil
vormerken.

**Nachprüfung:** Fünf Tipps im Abstand von 1,0 und 1,3 s ergeben Teil 6; zwei
Tipps im Abstand von 200 ms ergeben nur einen Schritt.

### R11-S2 [P3] Browser-Zurück nach einer abgeschlossenen Handlung: gleiche Ansicht doppelt, ausgefülltes Formular, wieder offener Scanner

**Priorität:** P3

**Kennzeichnung:** gemessen (Skripte `v.js`, `w.js`, `x2.js`, `x4.js`,
`x6.js`; `history.length` mitgelesen). Die Folge für Bedienung mit
Handschuh ist Risiko.

**Fundstelle / Aufgabe:** Einsatzansicht nach „In Einsatz übernehmen“ und nach
„Fertig“ im Scanner; danach Zurück-Geste.

**Beobachtung:**

1. Einheit über „Einheit manuell erfassen…“ mit „Weiter →“ bis Schritt 3
   erfasst und übernommen: Verlauf von 6 auf 8 Einträge; die erste und die
   zweite Zurück-Geste zeigen dieselbe Einsatzansicht, erst die dritte
   erreicht die Startseite.
2. Dieselbe Einheit nur mit Ort in Schritt 1 und „Trotzdem mit Stärke 0
   übernehmen“: Verlauf bleibt bei 4 Einträgen; die erste Zurück-Geste zeigt
   das noch ausgefüllte Formular „Aufnahme für: Hochwasser Test“ mit Ort,
   Nummer und Zug samt „In Einsatz übernehmen“. Ein zweites Übernehmen legt
   keine zweite Einheit an (Liste bleibt bei 1), sagt es aber auch nicht.
3. Scanner mit „Fertig“ geschlossen: Die erste Zurück-Geste öffnet den
   Scanner erneut (Verlauf 5; Text „Kamera erneut versuchen“ wieder da);
   dann Einsatzansicht, dann Startseite.

**Erwartung der Rolle:** Eine abgeschlossene Handlung liegt hinter mir. Zurück
verlässt die Ansicht, in der ich war, und öffnet weder das erledigte Formular
noch die Kamera noch zweimal dasselbe.

**Folge im Einsatz:** Der Helfer wischt nach dem Ablegen reflexartig zurück,
sieht „nichts passiert“ oder wieder das fertige Formular und fragt sich, ob
die Einheit gespeichert ist. Beim Scanner startet die Kamera auf einem
Gerät mit Kamera von selbst neu. Daten gehen nicht verloren.

**Empfehlung:** Nach „In Einsatz übernehmen“ und „Fertig“ den Verlaufseintrag
der abgeschlossenen Ansicht ersetzen statt einen neuen anzulegen, sodass
eine Zurück-Geste aus der Einsatzansicht auf die Startseite führt, wie es
nach „Einsatz anlegen“ bereits der Fall ist (eine Geste).

**Nachprüfung:** Nach Übernahme einer Einheit (beide Wege) und nach
Scanner-„Fertig“ führt eine Zurück-Geste aus der Einsatzansicht auf die
Startseite.

### R11-S3 [P3] „Zur Kenntnis genommen“ löscht alle „neu“-Marken ohne Quittung und ohne Rückgängig; die Ziele sind 30 px hoch und stoßen aneinander

**Priorität:** P3

**Kennzeichnung:** gemessen (Skripte `o.js`, `q.js`, `q2.js`).

**Fundstelle / Aufgabe:** Einsatzansicht bei 360 × 640 mit mehreren neu
gemeldeten Einheiten, Block „Neu seit der letzten Kenntnisnahme (n)“.

**Beobachtung:** „Zuletzt gemeldete oben zeigen“ (193 × 30 px) und „Zur Kenntnis
genommen“ (155 × 30 px) stehen untereinander ohne Abstand (Oberkante 348,8 und
378,8 px). Ein Tipp auf „Zur Kenntnis genommen“ entfernt den Block, alle
„neu“-Marken auf den Karten (3 von 3 weg) und die Zeile „3 neu seit der letzten
Kenntnisnahme“ der Startseite; es erscheint keine Quittung und kein
„Rückgängig“, der Inhalt darunter rutscht um die Höhe des Blocks nach oben. Der
Zustand bleibt nach dem Neuladen gelöscht. Die übrigen Knöpfe der Ansicht sind
44 px hoch.

**Erwartung der Rolle:** Ein Tipp, der die Erinnerung „was ist neu?“ für den
ganzen Einsatz löscht, bekommt wie „Abrücken“ eine Quittung mit „Rückgängig“;
beide Links liegen mit Abstand und in Knopfgröße.

**Folge im Einsatz:** Eine Fehlberührung neben dem benachbarten Link, vor
allem wenn der Inhalt gerade durch eine neue Meldung springt, kostet die
Übersicht, welche Einheiten seit dem letzten Blick eingetroffen sind. Die
Daten selbst bleiben; wiederherstellbar ist nur der Blick auf „neu“, über die
Eintreffzeiten der Karten.

**Empfehlung:** Eine Quittung „Zur Kenntnis genommen“ mit „Rückgängig“ (wie
bei „Abgerückt“), die beiden Links mit 44 px Höhe und 8 px Abstand.

**Nachprüfung:** Nach dem Tipp erscheint die Quittung; „Rückgängig“ bringt
Block und Marken zurück.

### R11-S4 [P3] Startseite mit liegengebliebenem Entwurf: „Fortsetzen“ steht ganz oben, der laufende Einsatz erst 1 000 px tiefer

**Priorität:** P3

**Kennzeichnung:** gemessen (Skript `am.js`, 360 × 640). Die Verwechslung ist
Risiko.

**Fundstelle / Aufgabe:** Einsatzansicht → „‹ Startseite“ (bewusst, nicht
Kaltstart) bei gleichzeitig vorhandenem eigenem Entwurf.

**Beobachtung:** Der Entwurfskasten („THW Oldenburg (NI) …“, „Fortsetzen“ und
rotes „Verwerfen“ nebeneinander) steht bei y = 368 px. Der Knopf
„„Hochwasser Test“ öffnen“ steht bei y = 1 009 px, die Karte der Sammlung mit
„Öffnen“ bei 1 464 px, jeweils unter dem Block „Meinen Bogen ausfüllen“ mit
fünf Knöpfen. Der Kasten sagt „Entwurf … wiederhergestellt. „Fortsetzen“
öffnet ihn dort, wo du warst.“

**Erwartung der Rolle:** Wer eben noch im Einsatz war und kurz zur Startseite
tippte, findet den Einsatz dort ohne Rollen und Suchen, nicht unter dem Entwurf
der eigenen Einheit.

**Folge im Einsatz:** Plausible Fehlwahl unter Zeitdruck: „Fortsetzen“ öffnet
den eigenen alten Bogen statt der Lage des Meldekopfs; der Rückweg kostet
zwei Tipps und eine Orientierung. Datenverlust entsteht nicht.

**Empfehlung:** Wenn in den letzten Stunden ein Einsatz offen war, dessen
„öffnen“-Knopf zuerst oder gleichrangig mit dem Entwurf zeigen; „Fortsetzen“
des Entwurfs mit dem Namen des Bogens beschriften, nicht nur mit dem Verb.

**Nachprüfung:** Nach „‹ Startseite“ aus einer offenen Sammlung steht deren
„öffnen“-Knopf im ersten Bildschirm (≤ 640 px) der Startseite.
