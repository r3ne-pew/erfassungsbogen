# Audit „Mobile UI", Runde 16 (Darstellung und Bedienung auf dem Telefon)

Prüfer: Rollenaudit `mobile-ui-reviewer` · Datum: 2026-10-26 ·
Prüfgegenstand: Web-App unter `http://localhost:4173` (laufender Server, Code-Stand
Commit `36d549a` = `main` nach Runde 15) · Zählung: **P0 0 · P1 0 · P2 0 · P3 3**

Reiner Prüfbericht, keine Codeänderung. Vorab gelesen: `docs/audits/README.md` sowie die
Übersichten von Runde 15, 14 und 13. Die dort genannten bekannten Grenzen sind nicht neu gemeldet.

## Prüfaufbau

Chromium über das globale Playwright-Modul (`chromium.launch()` ohne Optionen; die
Projektkopie fand keinen passenden Browser), `isMobile`, `hasTouch`, Locale de-DE.
Viewports 390 x 844, 360 x 640, 320 x 568 und quer 640 x 360. Zustand per
`localStorage`-Seed: Sammlung „Hochwasser Musterstadt" mit acht Meldungen aus
`examples/thw/` (`uebung: false`, Stand auf die letzten Stunden gesetzt, eine abgerückt).
Durchlaufen: Startseite, Einsatzansicht (Kacheln, Karten, aufgeklappte Karte, Tabelle,
Weitergeben, Lagemonitor-Bereich), Scanner ohne Kamera, Schnellerfassung, Datensicherung,
„Alle Daten löschen", „Einheit manuell erfassen", Assistent Schritt 1 bis 6, Ansichtswahl.
Gemessen: seitlicher Überlauf, Ziele unter 40 px, Schriften unter 12 px, Leistenhöhen,
Dialoghöhen.
Nicht prüfbar: Bildschirmtastatur, Safe-Area, WebKit, Kamera, Handschuhe, Licht; der
Lagemonitor öffnet ein eigenes Fenster und wurde nicht im Bild geprüft. Das Datumsfeld
„mm/dd/yyyy" hängt am Prüfrechner und ist nicht gewertet.

## Urteil

Die Behebungen aus Runde 15 halten im echten Browser, soweit geprüft:

- R15-M1: Die aufgeklappte Karte hat Rahmen (hervorgehobene linke Kante) und gleichen
  Innenrand wie die Nachbarn; „Zuklappen" ist erreichbar.
- R15-M3: Kopf des Assistenten bei 360 x 640 zu- und aufgeklappt gleich hoch (125 px),
  die Ansichtswahl überlagert.
- R15-M4: Die Bedarfszeile bricht zwischen den Posten; „Unterbringung 27 Personen"
  bleibt zusammen.
- R15-M2 (bekannte Grenze): bei 320 x 568 einzeilig, bei 390 x 844 weiter zweizeilig.
- Kein seitlicher Überlauf bei 320, 360, 390 und 640 x 360; keine Bedienelemente unter
  40 px außer Sprunglink bei Fokus und den bekannten 24-px-Kästchen; keine Schrift unter
  12 px; keine Konsolenfehler.

## Befunde

### R16-M1 [P3] „Einheit manuell erfassen…" öffnet den Assistenten mitten im Schritt 1, Kopfzeile und Einsatzbezug außer Sicht

**Kennzeichnung:** gemessen (390 x 844, 360 x 640, 320 x 568; Tipp per Touch).

**Ort:** Einsatzansicht → „Einheit manuell erfassen…" (von oben angetippt, Bildlaufstelle 0).

**Beobachtung:** Nach dem Tipp steht die Seite bei Bildlaufstelle 483 px (390), 561 px (360)
und 661 px (320); der Fokus liegt im Feld „Ort der Einheit (Pflicht)". Sichtbar sind
ab „Einheitstyp" nur der Rest von Schritt 1; Kopf mit Schrittleiste, Marke „Aufnahme für: …",
Überschrift „1. Einheit", Organisation und Organisationsname liegen darüber. Der Weg
„Neuen Bogen erstellen" von der Startseite beginnt dagegen oben.

**Folge:** Wer in der Einsatzansicht eine Einheit erfasst, sieht nicht, in welche Sammlung
und in welchem Schritt er sich befindet; die vorbelegte Organisation und der leere
Einheitstyp liegen unbemerkt über dem Bild. Ein Wegwischen nach oben holt das nach, daher P3.

**Empfehlung:** Beim Öffnen auf den Anfang des Formulars (Kopf mit Marke) rollen und den
Fokus ohne Bildlaufsprung setzen, oder die Marke „Aufnahme für: …" in der Fußleiste/Kopf
sichtbar halten.

**Nachprüfung:** Tipp auf „Einheit manuell erfassen…" bei 360 x 640 zeigt die Marke und
„1. Einheit" im ersten Bild.

### R16-M2 [P3] Rückfragen „Alle Daten löschen" und „Datensicherung": Entscheidungsknöpfe liegen ein bis zwei Bildschirme unter dem Falz ohne Rollhinweis

**Kennzeichnung:** gemessen (Dialoghöhe gegen Inhaltshöhe) und im Bild beobachtet.

**Ort:** Startseite → Fußbereich „Alle Daten löschen" und „Datensicherung".

**Beobachtung:** „Alle lokalen Daten löschen": Dialog 608 px hoch, Inhalt 976 px (360 x 640)
bzw. 536 px zu 1191 px (320 x 568, rund 2,2 Bildschirme). „Endgültig löschen" und „Abbrechen"
stehen bei 875 und 932 px, im Bild nur „Vorher Sicherung erstellen…" und die Aufzählung
„Betroffen sind". Im Querformat (640 x 360) beginnen beide Knöpfe bei 679 px bei 326 px Höhe.
Datensicherung: Inhalt 905 px bei 606 px Dialoghöhe. Es gibt keine Rollmarke; oben steht nur
„Schließen".

**Folge:** Der Aufzählungstext ist lang genug, dass man ihn für den ganzen Dialog hält; wer
nur lesen und abbrechen will, nimmt das obere „Schließen" (kein Datenrisiko, die
Löschung bleibt ausdrücklich zu bestätigen). Man erkennt aber nicht, dass unten noch die
eigentliche Entscheidung folgt; P3.

**Empfehlung:** Entscheidungsknöpfe als klebende Leiste am Dialogfuß halten oder die
Aufzählung kürzen/einklappen („Betroffen sind: 6 Punkte ▸"), wie schon beim
Übergabe-Dialog.

**Nachprüfung:** Bei 360 x 640 sind „Endgültig löschen" und „Abbrechen" ohne Rollen sichtbar.

### R16-M3 [P3] Scanner ohne Kamera: Knopfleiste verdeckt bei 320 x 568 den Aufklapper „Hinweise zum Handscanner"

**Kennzeichnung:** gemessen (320 x 568) und im Bild beobachtet; bei 360 x 640 unauffällig.

**Ort:** Einsatzansicht oder Startseite → „QR-Code scannen…" auf einem Gerät ohne Kamera.

**Beobachtung:** Die klebende Leiste mit „Kamera erneut versuchen", „QR aus Bild einlesen…"
und „Abbrechen" steht dreizeilig bei 396 bis 568 px (30 % der Bildhöhe) und hat nur einen
Verlauf (transparent bis 75 % schwarz) als Grund. Die Zusammenfassungszeile „▸ Hinweise zum
Handscanner" (421 bis 465 px) liegt im ersten Bild unter der Schaltfläche „Kamera erneut
versuchen" (408 bis 452 px); ein Tipp trifft die Schaltfläche, nicht die Zeile.

**Folge:** Auf kleinen Telefonen ist der Hinweis erst nach Rollen (rund 104 px) erreichbar,
und ein Tipp auf die sichtbar durchscheinende Zeile löst „Kamera erneut versuchen" aus.
Ausgang „Abbrechen" ist erreichbar; P3.

**Empfehlung:** Leiste bei Höhen unter 600 px zweizeilig setzen („Abbrechen" neben
„Kamera erneut versuchen") oder den Hinweis-Aufklapper oberhalb der Leiste fest einplanen.

**Nachprüfung:** Bei 320 x 568 liegt die Zusammenfassungszeile im ersten Bild vollständig über
der Leiste und ein Tipp darauf klappt sie auf.
