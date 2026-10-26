# Audit „Mobile UI", Runde 13 (Darstellung und Bedienung auf dem Telefon)

Prüfer: Rollenaudit `mobile-ui-reviewer` · Datum: 2026-10-26 ·
Prüfgegenstand: Web-App unter `http://localhost:4173` (laufender Server, Code-Stand
Commit `7637e61` = `main` nach Runde 12) · Zählung: **P0 0 · P1 0 · P2 0 · P3 3**

Reiner Prüfbericht, keine Codeänderung. Vorab gelesen: `docs/audits/README.md`,
`docs/audits/runde-12/README.md` und `runde-11/README.md`. Die dort genannten bekannten
Grenzen sind nicht neu gemeldet.

## Prüfaufbau

Chromium über das globale Playwright-Modul (`chromium.launch()` ohne Optionen),
`isMobile`, `hasTouch`, Locale de-DE. Viewports 390 × 844, 360 × 640, 320 × 568 und quer
640 × 360. Zustand per `localStorage`-Seed: Sammlung „Hochwasser Musterstadt" mit sieben
Meldungen aus `examples/thw/` (`uebung: false`, eine abgerückt). Durchlaufen: Startseite,
Einsatzansicht (Kacheln, Karten, Filter, aufgeklappte Karte, Abrücken mit Quittung, Tabelle),
„Einsatz weitergeben / sichern", Scanner ohne Kamera, Assistent Schritt 1 bei 320 px.
Gemessen: seitlicher Überlauf, Ziele unter 40 px, Schriften unter 12 px.
Nicht prüfbar: Bildschirmtastatur, Safe-Area, WebKit, Kamera, Handschuhe, Licht.

## Urteil

Die Behebungen aus Runde 12 halten, soweit geprüft:

- Kein seitlicher Überlauf der Seite bei 320, 360, 390 und 640 × 360.
- Keine Bedienelemente unter 40 px Höhe oder Breite (außer dem Sprunglink „Zum Inhalt
  springen", 36 px, nur bei Fokus sichtbar) und keine Schrift unter 12 px.
- R12-M1: „Suchen, sortieren, filtern" trägt jetzt eine Aufklappmarke (▾/▸).
- R12-M2: Kachelbeschriftungen quer 13 px (vorher 11 px), alle fünf Kacheln in einer Zeile.
- R12-M3: Namensspalte der Tabelle 98 px bei 320 px, 100 px bei 360 px, 110 px bei 390 px
  (vorher 160 px); die Zahlenspalten „Ges.", „F", „U", „M" stehen im ersten Bild.
- Quittung „Abgerückt 06:47: Nr. 1 …" mit „Rückgängig" und „✕" liegt vollständig im Bild
  bei 320 px.

## Befunde

### R13-M1 [P3] Marke „ANONYMISIERT" in der Tabelle ragt aus der klebenden Namensspalte in die Spalte „Ges." hinein

**Kennzeichnung:** gemessen (Begrenzungsrahmen) und im Bild beobachtet.

**Ort:** Einsatzansicht → „Tabelle", Spalte „Einheit", Zeilen mit Marke „ANONYMISIERT".

**Beobachtung:** Die Marke ist rund 124 px breit und beginnt bei x = 46; die Namensspalte
endet bei 144 px (390), 133 px (360) und 115 px (320). Die Marke endet bei 171, 169 und
153 px und überragt die Spalte damit um 27, 36 und 38 px. Sie liegt über dem Zellrand in
der Spalte „Ges.". Die Marke „ABGERÜCKT" passt (rund 100 px).

**Folge:** Die Zeile wirkt gestört (Marke schneidet die Spaltenlinie), und die Marke
überdeckt beim seitlichen Rollen Teile der Nachbarspalte. Zahlen bleiben lesbar, weil sie
rechtsbündig stehen; daher P3.

**Empfehlung:** Marken in der klebenden Spalte umbrechen lassen oder als kurzes Zeichen
(„anon.") führen; die volle Marke bleibt auf der Karte.

### R13-M2 [P3] Namen in der Tabelle brechen mitten im Wort („Wassergefahre / n (A)")

**Kennzeichnung:** im Bild beobachtet (390 × 844 und 320 × 568).

**Ort:** Einsatzansicht → „Tabelle", Spalte „Einheit", Nr. 3 und Nr. 5
(„Fachgruppe Wassergefahren (A)").

**Beobachtung:** Das Wort „Wassergefahren" ist breiter als die Spalte und wird hart nach
„Wassergefahre" umgebrochen; „n (A)" steht allein in der nächsten Zeile. Bei 320 px bricht
es nach „Wassergefahr". Dieselbe Zeile ist bei 390 px 131 px hoch, vier bis fünf
Zeilen Name plus Marke.

**Folge:** Der Typ (Wasser­gefahren / Wasserschaden) ist beim Überfliegen schwerer zu
unterscheiden; „n (A)" liest sich wie eine eigene Angabe. Die Karten zeigen den Namen ganz.

**Empfehlung:** Die Spalte so breit lassen, dass das längste übliche Wort ganz passt, oder
Trennstellen (weiches Trennzeichen) setzen statt hartem Umbruch.

### R13-M3 [P3] Kopfzelle „GES." ist bei 390 px am linken Rand angeschnitten

**Kennzeichnung:** im Bild beobachtet (390 × 844, Tabellenkopf in Ruhestellung);
bei 360 und 320 px nicht aufgefallen.

**Ort:** Einsatzansicht → „Tabelle", Kopfzeile, zweite Spalte.

**Beobachtung:** Im Bild bei 390 px steht „ES." statt „GES." — der erste Buchstabe wird
von der klebenden Namensspalte verdeckt. Die Zelle beginnt bei 144 px, der Text der
Kopfzelle ist laut Messung 2,5 px nach rechts eingerückt und die Schrift in Festbreite mit
Sperrung; der Rest der Zeile („F", „U", „M") ist unauffällig.

**Folge:** Die wichtigste Zahlenspalte („Gesamtstärke") trägt für einen Augenblick eine
unlesbare Überschrift; wer die Sortierung über die Kopfzelle auslöst, tippt auf einen
angeschnittenen Text. Die Spalte ist über die Zahlen und die Karten zu erkennen; daher P3.

**Empfehlung:** Kopfzelle ohne Sperrung setzen oder Spaltenbreite „Ges." um die Breite der
Zeichenfolge erhöhen; Prüfung bei 390 px wiederholen.

## Hinweise ohne Wertung

- Im Querformat 640 × 360 liegt der schwebende Ansicht-Knopf (◐) über der Beschriftung
  von „Bögen einlesen…" (rechts unten) und verdeckt dort einen Teil des Untertextes; er
  rollt mit dem Inhalt nicht fort. Bekannte Bauweise der klebenden Leiste, keine Wertung.
