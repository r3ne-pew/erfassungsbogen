# Audit „Mobile UI", Runde 17 (Darstellung und Bedienung auf dem Telefon)

Prüfer: Rollenaudit `mobile-ui-reviewer` · Datum: 2026-10-27 ·
Prüfgegenstand: Web-App unter `http://localhost:4173` (laufender Server, Code-Stand
Commit `be6b396` = `main`) · Zählung: **P0 0 · P1 0 · P2 0 · P3 4**

Reiner Prüfbericht, keine Codeänderung. Vorab gelesen: `docs/audits/README.md` und die
Abschnitte „Stand der Behebung" von Runde 16 bis 11. Es gibt keine „bekannten Grenzen" mehr,
die ausgelassen werden; auch Punkte mit Stand „teilweise" oder „offen" sind gemeldet, wenn sie
im Browser noch zu sehen sind.

## Prüfaufbau

Chromium über das globale Playwright-Modul (`chromium.launch()` ohne Optionen), `isMobile`,
`hasTouch`, Locale de-DE, Tipps per Touch. Viewports 390 x 844, 360 x 640, 320 x 568 und quer
640 x 360. Ansichten Standard und „Feld" (große Tasten). Zustand per `localStorage`-Seed:
Sammlung „Hochwasser Musterstadt" mit acht Meldungen aus `examples/thw/`.
Durchlaufen: Startseite, Einsatzansicht (Kacheln, Karten, aufgeklappte Karte mit Details,
Zug zuordnen, Auftrag/Notiz, Mehr…, Tabelle, Filter, Weitergeben, Lageblatt, Löschen,
Bögen einlesen, Name/Ort ändern), Scanner ohne Kamera, „Einheit manuell erfassen…",
Schnellerfassung, Assistent Schritt 1 bis 6, Dialoge „Alle Daten löschen", „Datensicherung",
„Geräteschlüssel neu erzeugen". Gemessen: seitlicher Überlauf, Bedienziele unter 40 px,
Schriften unter 12 px, abgeschnittene Texte, Höhe fester Leisten, Dialoghöhen. Tastatur
nachgestellt durch halbe Fensterhöhe (Fokus im Ortsfeld).
Nicht prüfbar: echte Bildschirmtastatur, Safe-Area, WebKit, Kamera, Handschuhe, Licht.
Das Datumsfeld und die „103 Tage" alten Stände stammen aus dem Prüfdatensatz und sind nicht
gewertet.

## Urteil: Behebungen der Runde 16

Alle drei Befunde der Runde 16 sind im Browser behoben:

- R16-M1: „Einheit manuell erfassen…" öffnet bei Bildlaufstelle 0 (390, 360, 320); Marke
  „Aufnahme für: …", „1. Einheit" und Organisation stehen im ersten Bild, der Fokus liegt
  im Ortsfeld.
- R16-M2: „Endgültig löschen" und „Abbrechen" liegen bei 360 x 640 bei 511 bis 607 px innerhalb
  der Dialoghöhe (606 px), bei 320 x 568 bei 439 bis 535 px, bei 390 x 844 bei 715 bis 811 px.
  Datensicherung: „Sicherung erstellen…" und „Sicherung einspielen…" im ersten Bild.
- R16-M3: Scanner ohne Kamera bei 320 x 568: „Hinweise zum Handscanner" (401 bis 445 px) liegt
  über der Knopfleiste (466 bis 562 px), keine Überdeckung.

Sonst: kein seitlicher Überlauf bei 390, 360, 320 und 640 x 360 (Standard und Feld);
keine Schrift unter 12 px; keine Konsolenfehler; alle Knöpfe, Eingaben und Auswahlfelder
mindestens 44 px (Kästchen und Optionsfelder 24 px bzw. 30 px in „Feld" innerhalb einer
48 px hohen Beschriftung, daher nicht gemeldet); Tastaturnachbildung: die feste Fußleiste
des Assistenten verschwindet bei halber Fensterhöhe, das Ortsfeld bleibt sichtbar.

## Befunde

### R17-M1 [P3] Kopf des Assistenten bei Aufnahme aus der Einsatzansicht: Rücksprung und Marke abgeschnitten, bei 320 px Wort mitten gebrochen

**Neu oder alt (Verweis):** neu (Umfeld von R16-M1, dort nicht gemeldet).

**Kennzeichnung:** gemessen und im Bild beobachtet (390, 360, 320; Standard und Feld).

**Ort:** Einsatzansicht → „Einheit manuell erfassen…" oder „Einheit schnell erfassen (nur
Stärke)…" → Kopfbereich des Assistenten.

**Beobachtung:** Der Rücksprung „‹ Einsatz „Hochwasser Musterstadt"" (Textbreite 268 px) wird
in 200 px (390), 170 px (360) und 130 px (320) mit Auslassungspunkten gekürzt:
„‹ Einsatz „Hochwass…", bei 320 px in „Feld" „‹ Einsatz „Ho…". Daneben die Marke
„Aufnahme für: Hochwasser Musterstadt" wird in „Feld" bei 360 px dreizeilig
(„Aufnahme / für: / Hochwasse…") und bei 320 px mitten im Wort gebrochen
(„Aufnah / me für: / Hoch…"). Der Einsatzname, der die Marke tragen soll, ist damit in
„Feld" in keinem der beiden Elemente vollständig lesbar.

**Folge:** Wer mehrere Sammlungen führt, erkennt am Telefon nicht, in welche er gerade
erfasst; der Name wird genau dort abgeschnitten, wo er sich unterscheidet. Der Wortbruch
liest sich wie ein Fehler.

**Empfehlung:** Marke und Rücksprung in zwei Zeilen setzen (Marke volle Breite, Namen
umbrechen statt kürzen) und Wortbruch mitten im Wort verhindern; mindestens den Namen ohne
Zusatz „Aufnahme für:" zeigen, wenn der Platz fehlt.

**Nachprüfung:** Bei 320 x 568 in „Feld" steht der Einsatzname vollständig im Kopf, ohne „…"
und ohne Silbenbruch.

### R17-M2 [P3] Kopf und Fußleiste des Assistenten belegen in „Feld" und im Querformat mehr als die Hälfte des Bildes

**Neu oder alt (Verweis):** neu.

**Kennzeichnung:** gemessen und im Bild beobachtet.

**Ort:** Assistent aus der Einsatzansicht (Schnellerfassung oder manuell), Ansicht „Feld";
Assistent im Querformat.

**Beobachtung:** 360 x 640, „Feld", Schnellerfassung: Kopf 250 px (Logo, Rücksprung,
Ansicht, Marke, Statuszeile, Schrittleiste) plus feste Fußleiste 83 px = 333 px, also 52 % der
Höhe; für Inhalt bleiben 307 px. 320 x 568: Kopf 250 px plus Fußleiste 83 px = 59 %,
Inhaltsfenster 235 px. Der Kopf rollt mit, die Fußleiste nicht. Querformat 640 x 360: Kopf
103 px plus Fußleiste 56 px = 44 %; das Feld „Einheitstyp" liegt im ersten Bild halb unter
der Fußleiste.

**Folge:** Im Einsatz mit großer Schrift sieht man pro Bild nur ein bis zwei Eingabefelder;
der Kopf ist beim Zurückrollen zuerst da, aber bei jedem Schritt wieder zu überwinden.

**Empfehlung:** Statuszeile („gespeichert · …") und Marke in „Feld" in eine Zeile zusammenlegen
oder die Marke in der ersten Zeile mit dem Rücksprung führen; im Querformat die
Fußleistenknöpfe ohne Beschriftung belassen und die Statuszeile an den Kopf rechts setzen.

**Nachprüfung:** Bei 360 x 640 in „Feld" bleibt mindestens die Hälfte des Bildes für Inhalt.

### R17-M3 [P3] Fußleiste „Einheit manuell erfassen" 128 bis 143 px hoch; Knopftext „In Einsatz übernehmen" läuft bei 320 px über den Rand — wie R15-M2, weiter offen

**Neu oder alt (Verweis):** alt, R15-M2 (Stand der Behebung: „teilweise"; seither unverändert).

**Kennzeichnung:** gemessen (390 x 844, 360 x 640, 320 x 568) und im Bild beobachtet.

**Ort:** Assistent aus der Einsatzansicht, jeder Schritt, feste Fußleiste.

**Beobachtung:** Bei 390 x 844 ist die Fußleiste in Standard 128 px (15 % der Höhe) und in
„Feld" 143 px hoch, weil „In Einsatz übernehmen" als eigene Zeile über „←", „Ansicht" und
„Weiter →" steht. Bei 360 x 640 ist sie einzeilig (75 px Standard, 83 px „Feld"), die
Knopfbeschriftung „In Einsatz übernehmen" bricht dort in zwei Zeilen in einem 44 px hohen
Knopf. Bei 320 x 568 in „Feld" ist der Knopf so schmal, dass „übernehmen" an beiden
Seiten die Umrandung berührt und „Einsatz" gekürzt wirkt.

**Folge:** Am größeren Telefon, auf dem mehr Platz wäre, ist die Leiste am höchsten; am
kleinen ist die Beschriftung eng. Wer den Bogen abschließt, hat einen kleinen, schwer lesbaren
Knopf als Hauptausgang.

**Empfehlung:** Die Leiste auf allen Breiten einzeilig halten (Kurzbeschriftung „In Einsatz"
oder Symbol plus Wort) und den Knopf nicht unter die Breite seiner längsten Zeile
schrumpfen lassen.

**Nachprüfung:** Bei 390 x 844 und 320 x 568 in Standard und „Feld" bleibt die Leiste unter
80 px, der Knopftext liegt innerhalb der Umrandung.

### R17-M4 [P3] Platzhalter im Feld „Einheitstyp" läuft ohne Auslassungszeichen aus dem Feld

**Neu oder alt (Verweis):** neu.

**Kennzeichnung:** im Bild beobachtet (390 x 844, 360 x 640).

**Ort:** Assistent Schritt 1, Feld „Einheitstyp".

**Beobachtung:** Der Platzhalter „z. B. Bergungsgruppe, FGr Wasserschaden/Pumpen" wird bei
390 px nach „Wasserscha", bei 360 px nach „Wasser" hart am Rand abgeschnitten, ohne „…". Im
Querformat steht er vollständig.

**Folge:** Gering. Das Beispiel ist nur Hinweis; es sieht aber nach abgeschnittener Eingabe
aus.

**Empfehlung:** Kürzeren Platzhalter („z. B. Bergungsgruppe") verwenden oder Auslassungszeichen
setzen.

**Nachprüfung:** Platzhalter bei 360 x 640 vollständig oder mit „…".

## Zusammenfassung

Die Runde-16-Befunde R16-M1 bis M3 halten. Offen bleiben vier Darstellungspunkte (P3) im
Assistenten bei Aufnahme aus der Einsatzansicht und in „Feld"; R15-M2 ist davon der einzige
Altbefund. Überlauf, Schriftgrößen, Bedienziele und Dialogfüße sind unauffällig.
