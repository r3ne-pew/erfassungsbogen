# Audit „Nacht und Sicht", Runde 16 (Dunkelheit, Blendung, Sonnenlicht, Farbcodierung)

Prüfer: Rollenaudit `thw-night-visibility-reviewer` · Datum: 2026-10-26 ·
Zählung: **P0 0 · P1 0 · P2 0 · P3 1**

Prüfgegenstand: Web-App, Produktionsbuild auf `http://localhost:4173`, Stand `main` nach
Runde 15 (Commit `36d549a`). Reiner Prüfbericht, keine Codeänderung.

Gelesen vor dem Lauf: [docs/audits/README.md](../README.md),
[runde-15/README.md](../runde-15/README.md), [runde-14/README.md](../runde-14/README.md),
[runde-13/README.md](../runde-13/README.md) und [runde-15/nacht-und-sicht.md](../runde-15/nacht-und-sicht.md).
Die dort genannten bekannten Grenzen sind nicht erneut gemeldet.

## Prüfaufbau

Chromium über Playwright (`chromium.launch()` ohne Optionen). Die Projektkopie fand keinen
passenden Browser, deshalb habe ich das globale playwright-Modul benutzt. Locale de-DE,
`isMobile`/`hasTouch`, Viewports 390 × 844 und 360 × 640, alle vier Ansichten (Standard,
Dunkel, Feld, Nacht) über `eeb.anzeigemodus.v1`, also 8 Kombinationen. Zustand per
`localStorage`-Seed: Sammlung „Hochwasser Nord" mit sechs Meldungen aus `examples/thw/`
(`uebung: false`, Eingang vor 5 Minuten bis 6 Std 40 Min, eine abgerückt). Der Datenschutzfrist-Text
und „vor 102 Tagen" auf den Karten stammen aus dem `stand` der Beispieldateien, nicht aus der App.

Gemessen wurde je Zustand: Kontrast jedes sichtbaren, nicht deaktivierten Textknotens gegen die
tatsächlich darunterliegende Fläche (Deckkraft eingerechnet, WCAG-Formel), Schrift unter 12 px,
waagerechtes Rollen der Seite und Text, der über seine Zelle hinausragt. Zustände: Startseite,
Einsatzansicht, aufgeklappte Karte, Tabelle, „Bögen einlesen…", „Einheit manuell erfassen…",
Lagemonitor-Knopf, Bogen Schritt 1 bis 6 (Telefonfeld mit zwei Ziffern gefüllt). Bildschirmfotos
habe ich für Nacht und Feld bei 360 px angesehen.

**Nicht prüfbar:** echtes Licht (Sonne, Scheinwerfer, Rotlicht), Displayhelligkeit, Kamerabild
im Dunkeln, native Fassungen, Ausdruck. Nicht erneut gespielt wurden Schriftstufen, erzwungene
Farben und der Systemmodus (in Runde 15 ohne Befund). Mein Skript fand in der Einsatzansicht
keinen „Abrücken"-Knopf an der ersten, schon abgerückten Karte; die Quittung nach dem Abrücken
habe ich daher in dieser Runde nicht gemessen.

## Urteil

Kontrast und Codierung halten: In allen 8 Kombinationen und allen genannten Zuständen liegt kein
sichtbarer Text unter 4,5 : 1 und keine Schrift unter 12 px, die Seite rollt nie waagerecht.
„ABGERÜCKT" trägt Rahmen und Durchstreichung, Alter und Hinweise „⚠" mit Wort, „anon."/„ANONYMISIERT"
steht als Text. Nacht bleibt warm und ohne große helle Flächen; Feld ist hell (gewollt) mit
dunkelblauem Kopf. Ansichtswechsel unterbricht nichts. Die Aufgabe ist ohne fremde Hilfe machbar;
neu ist nur ein Darstellungsfehler an den Kennzahlen.

## Prüfung der Behebungen aus Runde 15

| Befund | Ergebnis |
| --- | --- |
| R15-N2 Tabellen mit Wischhinweis | hält: „Zum Weiterlesen seitlich wischen →" in Nacht lesbar, Tabelle rollt nur im eigenen Rahmen |
| R15-K1 bis K5 (Alter, Marken, Warnfarbe nur am Alter) | hält: Alter mit „⚠" und Wort, Marke „älter als 24 h" mit Rahmen, in allen vier Ansichten über 4,5 : 1 |
| R15-H1 Quittungsleiste, R15-M1 aufgeklappte Karte | hält soweit messbar: Karte aufgeklappt in allen Ansichten ohne Text unter 4,5 : 1 oder 12 px |
| R15-M3 Ansichtswahl als Überlagerung | hält: „Ansicht: …" in der Fußleiste in allen vier Ansichten lesbar |
| R15-N1 bis N3, R15-S4, R15-M2 | nicht Gegenstand dieser Rolle bzw. bekannte Grenze |

## Befunde

### R16-L1 (P3) Kennzahlen-Beschriftung „EINHEITEN" läuft in die Nachbarspalte

- **Ort:** Einsatzansicht, Kennzahlenblock oben („5 Einheiten · 1 Führer · 12 Unterf."), Ansicht
  Feld bei 390 × 844 und 360 × 640; schwächer in allen Ansichten bei 360 × 640.
- **Beobachtung:** Die Beschriftung „Einheiten" ist breiter als ihre Zelle (gemessen
  Textbreite 99 px bei 78 px Zellbreite bei 390 px, 99 px bei 68 px bei 360 px). In Feld
  ragt sie bei 360 px über die senkrechte Trennlinie in die Spalte „Führer", die Linie läuft durch
  das „N", und es entsteht „EINHEITENFÜHRER" ohne Lücke. Bei 360 px sind es in Standard, Dunkel und
  Nacht 8 px Überstand (Text liegt noch innerhalb der Zellrand-Innenabstände, Lücke zur Linie
  gering). In Feld steht ebenso „Unterf." (77 px in 66 px Zelle) an der rechten Kante. Alle
  Zeichen bleiben lesbar (Kontrast bestanden).
- **Folge:** Gerade in der hellen Sonnenansicht, die für Draußen gedacht ist, lesen sich zwei
  Beschriftungen als ein Wort; die Zahl 1 steht über „Führer", die Zahl 5 über einem durchgestrichenen
  „Einheiten". Das kostet einen zweiten Blick auf die wichtigste Kennzahl der Lage; falsch gelesene
  Werte sind unwahrscheinlich.
- **Empfehlung:** Beschriftung kürzen, kleiner setzen oder umbrechen, sodass sie in Feld und bei
  360 px innerhalb der Zelle bleibt und die Trennlinie nicht schneidet.
- **Nachprüfung:** Einsatzansicht in Feld bei 360 × 640 und 390 × 844 öffnen; die Beschriftung
  „Einheiten" darf die Trennlinie nicht berühren und nicht an „Führer" anstoßen; Textbreite höchstens
  Zellbreite.

## Schluss

- **Aufgabe geschafft:** ja
- **Fremde Hilfe nötig:** nein
- **Größtes Missverständnis:** keines beobachtet; „EINHEITENFÜHRER" in Feld liest sich kurz wie ein Wort.
- **Größtes Einsatzrisiko:** nicht prüfbar bleibt die echte Wirkung von Sonne und Scheinwerfer auf das Display; die Messwerte sind Kontrastwerte, keine Helligkeitsmessung.
- **Top-Priorität für die nächste Iteration:** R16-L1 beheben und danach auf einem echten Gerät bei Dunkelheit und Sonne messen.
