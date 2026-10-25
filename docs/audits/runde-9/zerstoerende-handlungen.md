# Audit „Zerstörende Handlungen", Runde 9 (Löschen, Überschreiben, Statuswechsel)

Stand: 24.10.2026 · Prüfer: Rollenaudit `thw-destructive-action-reviewer` ·
Prüfgegenstand: Web-App, Produktionsbuild (`vite preview`, Port 4173),
Code-Stand Commit `c789947` (Zweig `main`).

Reiner Prüfbericht, keine Codeänderung. Wiederholung nach der Behebung der
Runde-8-Befunde (siehe [../runde-8/zerstoerende-handlungen.md](../runde-8/zerstoerende-handlungen.md)
und [../runde-8/README.md → Stand der Behebung](../runde-8/README.md#stand-der-behebung-24102026)).
Zuerst habe ich ohne Blick in die Berichte getestet (Startseite, Assistent,
Sammlung, Datensicherung, Papierkorb), danach den Runde-8-Bericht gelesen und
seine Behebungen einzeln nachgespielt.

## Prüfaufbau

Chromium (Playwright aus `node_modules`, `/opt/pw-browsers/chromium`,
`--no-sandbox`), `isMobile`/`hasTouch`, Locale de-DE, Tipps als Touch-Tipp
(`touchscreen.tap`), Tastaturfälle mit `keyboard.press`. Grundeinstellung
Telefon 360 × 640; dazu 320 × 568, 640 × 360 quer, Tablet 820 × 1180,
Zoom-Nachbildung (Telefon bei Faktor 2, also 180 × 320 CSS-Pixel) und
`html { font-size: 200% }` bei 360 × 640 und 320 × 568. Jeder Lauf in einem
eigenen Browser-Kontext; der Server wurde weder neu gebaut noch angefasst, ein
zweites Fenster als zweite Seite im selben Kontext.

Zustände kamen aus `localStorage`-Seeds: `eeb.entwurf.v1` mit dem Großbogen
„Verstärkter Bergungszug" (38 Personen, 10 Fahrzeuge) bzw. Bögen aus
`examples/thw/` (Ulm, Bamberg, Albstadt); `eeb.einsaetze.v1` mit sechs
Einheiten; alle `uebung: false`, Stand auf heute (24.10.2026). Varianten:
Sammlungstext auf 70 % abgeschnitten, Objekt statt Liste, Vorlagentext
abgeschnitten, Entwurf auf 60 % abgeschnitten, Entwurf mit Stand 70, 77, 80,
89, 92 und 95 Tage zurück, Bogen-Dateien mit gleichem, älterem und neuerem
Stand, Sicherungsdatei aus der App („Sicherung erstellen…"), Datei mit
abgebrochenem JSON, ein einzelner Bogen und `{}` als Sicherung.

Szenarien:

1. Startseite: „Verwerfen", „Neuen Bogen erstellen", „QR-Code scannen…",
   „Aus Datei laden…", „Einheit schnell erfassen…", „Einsatz importieren…",
   „Geräteschlüssel neu erzeugen", „Alle Daten löschen" (mit und ohne Haken),
   „Datensicherung" mit „Sicherung einspielen…" (fünf Dateien),
   „Einsatz löschen…" mit Papierkorb und „Endgültig löschen…", Vorlage
   speichern und „Löschen".
2. Einsatzansicht: „Abrücken" (Zweittipp nach 0,1 bis 4 s, fünf Einheiten
   hintereinander), „Wieder anwesend", „Entfernen" (Rückfrage, Neuladen,
   Seitenwechsel, Stapel mit „Abrücken"), „Stärke ändern…", „Aufteilen…",
   „Verschieben…", „Bögen einlesen…" mit gleichem, älterem und neuerem Stand.
3. Assistent: „Person entfernen" (einzeln, dreimal hintereinander, nach
   Schrittwechsel und Neuladen), „Fahrzeug entfernen", „Ebene entfernen"
   (Schritt 1), Wechsel der Organisation, Schalter in Schritt 2, 4 und 5,
   „Als Vorlage speichern", „Bogen übergeben…" mit „Für neuen Einsatz
   vorbereiten", Zurück-Taste des Browsers bei offener Rückfrage.
4. Zwei Fenster: „Alle Daten löschen" in A, Bedienen in B.
5. Selbstlöschende Fristen: Entwurf 70 bis 95 Tage.
6. Beschädigte Speichertexte (Sammlung, Vorlagen, Entwurf, alle zusammen) mit
   „Daten sichern…", „Beiseitegelegtes entfernen…", neuer Sammlung, „Alle
   Daten löschen" und „Sicherung einspielen…".
7. Rückfragen bei 320 × 568, 640 × 360, 820 × 1180, 200 % Schrift und
   Zoom-Nachbildung: Knopfmaße, Lage, sichtbarer Anteil des Rumpfs.

**Nicht prüfbar:** eine echt falsch gestellte Geräteuhr (Uhr-Fälle aus Runde 8
nicht wiederholt, nur Stand vermerkt), zwei echte Geräte an einer Sammlung,
Beenden der App durch das Betriebssystem, Kamera-Scan, native Builds,
Handschuhe, das echte Verstreichen von 30 bzw. 90 Tagen, „Lage vom Papier
abgleichen…" (der Knopf erscheint erst nach einem Lageblatt und kam in meinem
Aufbau nicht vor) und Sicherungen, die größer als der Speicher des Geräts sind.

## Urteil

Die Löschwege halten. Alle sechs Runde-8-Befunde aus meiner Rolle sind
nachgestellt: Der abgebrochene Gesamttext von Sammlungen und Vorlagen wird
beiseitegelegt und auf der Startseite benannt (R8-D1), die Rückfrage zu
„Entfernen" nennt die Nummernfolge (R8-D2), der Entwurf kündigt die
Anonymisierung 14 Tage vorher an (R8-D3), die Entwurfskarte bricht bei 180 px
um (R8-D4), die Sperre nach „Abrücken" hält 2,5 s (R8-D5, mit dem vermerkten
Rest), und „Für neuen Einsatz vorbereiten" steht am Ende des Übergabe-Dialogs
(R8-D6). Jede endgültige Handlung nennt vor dem Auslösen Namen, Zahl und
Folge; „Alle Daten löschen" und „Sicherung einspielen" sperren den Knopf bis
zum Haken, solange etwas verloren geht; Papierkörbe nennen Frist und Menge;
fremde, beschädigte und falsche Dateien ändern nichts am Speicher.

Neu sind zwei Ränder, an denen die Schutzlogik nicht greift. Erstens: Zwei
Schalter im Assistenten (Schritt 5 „Sofortbedarf erfassen", Schritt 4
„Funkrufname") leeren beim Ausschalten die Werte dahinter, ohne Rückfrage und
ohne „Rückgängig"; ein Doppeltipp von 150 ms genügt (R9-D1). Zweitens: Die in
Runde 8 eingeführte Rettung beschädigter Gesamttexte ist an den beiden
Dialogen „Alle Daten löschen" und „Sicherung einspielen" nicht nachgezogen; das
Einspielen vernichtet den beiseitegelegten Text ohne Wort und ohne Haken
(R9-D2). Ein P0 oder P1 habe ich nicht gefunden; alle Aufgaben lassen sich
ohne fremde Hilfe erledigen.

## Übersicht: Handlung → Bestätigung → Rückweg

Alles beobachtet bzw. im Speicher gemessen.

| Handlung | Bestätigung | Rückweg (geprüft) |
| --- | --- | --- |
| „Verwerfen" (Startseite) | Rückfrage mit Name, nennt den Rückholplatz | „Zuletzt geschlossenen Bogen zurückholen"; `eeb.entwurf.ersetzt.v1` 14 974 Zeichen |
| „Neuen Bogen erstellen" mit Entwurf | Rückfrage „Neuen Bogen anfangen?" mit Name | Rückholplatz |
| „QR-Code scannen…", „Aus Datei laden…", „Einsatz importieren…" | öffnen nur Scanner bzw. Dateiwahl, nichts geändert | — |
| „Einsatz löschen…" | Rückfrage „30 Tage zurückholen", Zahl der Einheiten | Papierkorb „Wiederherstellen" und „Rückgängig" |
| Papierkorb „Endgültig löschen…" | Rückfrage mit Zahl und „es ist die einzige Kopie", Fokus auf „Abbrechen" | keiner, bewusst |
| „Alle Daten löschen" | Aufzählung, Haken, Knopf gesperrt; Zähler gleichen dem Speicher bis auf R9-D2 | Sicherungsdatei |
| „Sicherung einspielen…" | Aufzählung beider Seiten, Haken nur wenn etwas verloren geht; Beiseitegelegtes fehlt (R9-D2) | Sicherungsdatei |
| „Geräteschlüssel neu erzeugen" | Rückfrage mit Folgen, Fokus auf „Abbrechen" | Sicherungsdatei |
| „Person entfernen" | Rückfrage mit Name | Quittung „Rückgängig", sammelt (3 Personen, Reihenfolge wie vorher), überlebt Schrittwechsel und Neuladen (in Schritt 3) |
| „Fahrzeug entfernen" | Rückfrage mit Kennzeichen, nennt „Rückgängig" | Quittung nur im Schritt, endet beim Schrittwechsel (R9-D3) |
| „Ebene entfernen" (Schritt 1) | Rückfrage nennt Telefon und E-Mail | keiner (R9-D3) |
| Wechsel der Organisation | Rückfrage nennt, was verloren geht | „Rückgängig" laut Text (nicht ausgeführt) |
| Schalter „Sofortbedarf erfassen", „Funkrufname" | **keine** | **keiner** (R9-D1) |
| Schalter „Einsatzbeginn eintragen" | keine | Zeit bleibt beim Wiedereinschalten stehen (03:15 gemessen) |
| „Abrücken" | keine | Quittung „Rückgängig", „Wieder anwesend"; Sperre 2,5 s |
| „Entfernen" (Meldung) | Rückfrage mit Nummern und „nur solange die App geöffnet bleibt" | „Rückgängig" (bleibt beim Wechsel Startseite und zurück, nicht nach Neuladen, wie angesagt); stapelt mit „Abrücken" |
| „Stärke ändern…" | Plausibilitätsfrage (130 statt 13), Fokus auf „Ja, so übernehmen" (R9-D4) | Historie |
| „Bögen einlesen…" gleicher Stand | Dialog „Zwei Fassungen", Fokus auf „Die eben eingelesene" (R9-D4) | Historie |
| „Bögen einlesen…" älterer Stand | Hinweis „nur in die Historie gelegt, die Lage bleibt unverändert" | — |
| „Als Vorlage speichern" | Name, kein Wort zu Personendaten (Verweis unten) | „Löschen" in den Papierkorb, „Rückgängig" |
| „Für neuen Einsatz vorbereiten" | Rückfrage mit Werten, „lässt sich hier nicht zurücknehmen", Fokus auf „Abbrechen, Bogen behalten" | keiner, bewusst |
| Entwurf 77, 80, 89 Tage alt | Karte „Namen werden am … anonymisiert (noch n Tage)" | Weitergabe, Sicherung |
| Entwurf 92, 95 Tage alt | Karte „Datenschutzfrist abgelaufen … am … anonymisiert" | keiner |
| Beschädigter Sammlungs- oder Vorlagentext | Karte auf der Startseite „Nicht lesbar: n beschädigte Gesamttexte …", „Daten sichern…", „Beiseitegelegtes entfernen…" (fragt, Fokus auf „Abbrechen") | Sicherungsdatei enthält den Rohtext |
| Falsche Sicherungsdatei (Bogen, abgebrochen, `{}`) | Hinweis mit Grund, „Die Daten auf diesem Gerät sind unverändert" | Speicher gemessen unverändert |

## Befunde

### R9-D1 [P2] Die Schalter „Sofortbedarf erfassen" (Schritt 5) und „Funkrufname" (Schritt 4) verwerfen beim Ausschalten die Werte dahinter, ohne Rückfrage und ohne „Rückgängig"

**Priorität:** P2

**Kennzeichnung:** gemessen (Entwurf im Speicher vor und nach dem Schalten;
Doppeltipp mit 150 ms Abstand per Touch). Dass ein Helfer einen Schalter
zweimal trifft, ist ein Risiko, das Handschuhe und Zeitdruck wahrscheinlicher
machen.

**Fundstelle / Aufgabe:** Assistent Schritt 5 „Sofortbedarf & Sonstiges" →
Schalter „Sofortbedarf erfassen" (191 × 44 px, ganz oben, y 204); Schritt 4
„Fahrzeuge" → Schalter „Funkrufname" je Fahrzeug.

**Beobachtung:**

- Schritt 5, Entwurf mit Diesel 620 l, Benzin 40 l, Gemisch 20 l,
  Unterbringung an, Ruhezeit an. Ein Tipp auf „Sofortbedarf erfassen" schaltet
  aus: `sofortbedarf` ist danach nicht mehr im Bogen. Ein zweiter Tipp schaltet
  wieder ein, und der Bogen steht bei Diesel 0, Benzin 0, Gemisch 0,
  Unterbringung aus, Ruhezeit aus (Verpflegung 38 bleibt, weil sie aus der
  Stärke kommt). Dasselbe bei zwei Tipps im Abstand von 150 ms. Es erscheinen
  weder Rückfrage noch Quittung („Rückgängig" nicht vorhanden).
- Schritt 4, Fahrzeug 1 mit Funkrufname `{"kennwort":{"code":1},"eigenerStandort":true,"teile":[71,25]}`.
  Aus und wieder an: `teile` steht danach auf `[]`, der Kennwort-Code bleibt.
  Auch hier keine Rückfrage, keine Quittung. Doppeltipp mit 150 ms habe ich
  bei diesem Schalter nicht gesondert gemessen (gleiches Muster).
- Zum Vergleich der Schalter „Einsatzbeginn eintragen" (Schritt 2): Zeit auf
  03:15 gesetzt, aus, an: 03:15 bleibt stehen. „Person entfernen",
  „Fahrzeug entfernen" und der Wechsel der Organisation fragen vorher; der
  Schalter-Weg ist der einzige, der Eingaben ohne Rückfrage und ohne Rückweg
  verwirft.

**Erwartung der Rolle:** Ein Schalter, der ein Feld nur ausblendet, verwirft
dessen Inhalt nicht; wer ihn wieder einschaltet, findet seine Zahlen vor (wie
bei „Einsatzbeginn"). Sonst fragt der Schalter, wenn Werte dahinterstehen, oder
bietet „Rückgängig" wie beim Entfernen einer Person.

**Folge:** Die Bedarfsmeldung (Treibstoff, Unterbringung, Ruhezeit) und der
Funkrufname mit Nummer sind genau die Angaben, die die Gegenstelle für
Nachschub und Funkverkehr braucht. Wer zweimal trifft, hat sie nach dem
Wiedereinschalten leer vor sich; die Nullen sieht er, die abgewählten Haken bei
„Unterbringung" und „Ruhezeit erforderlich" übersieht er leichter, und der Bogen
geht ohne Bedarf weiter. P2, weil die Werte in Sekunden neu einzutippen sind,
sobald es jemand merkt, und der Fehler an einer festen Stelle liegt; er bleibt
aber unbemerkt, wenn niemand die Übersicht liest.

**Empfehlung:** Werte beim Ausblenden behalten und beim Wiedereinschalten
zeigen (wie bei „Einsatzbeginn"). Wenn das nicht geht: Rückfrage mit den Werten
(„Diesel 620 l, Benzin 40 l … gehen verloren") oder „Rückgängig" in der
Quittungsleiste.

**Nachprüfung:** Schritt 5: Werte eintragen, „Sofortbedarf erfassen" zweimal
tippen (150 ms): Werte stehen unverändert da. Schritt 4: „Funkrufname" aus und
an: Teile 71/25 stehen noch da.

### R9-D2 [P2] „Sicherung einspielen…" und „Alle Daten löschen" nennen den beiseitegelegten Gesamttext nicht; das Einspielen vernichtet ihn ohne Haken (Nebenwirkung der Rettung aus R8-D1)

**Priorität:** P2

**Kennzeichnung:** gemessen (Speicherschlüssel vor und nach, jeweils ein Lauf
mit dem Aufbau „Sammlung abgeschnitten und Entwurf abgeschnitten").

**Fundstelle / Aufgabe:** Startseite mit Karte „Nicht lesbar: 1 beschädigter
Gesamttext (Sammlungen oder Vorlagen)" → „Datensicherung" → „Sicherung
einspielen…" bzw. „Alle Daten löschen".

**Beobachtung:**

- Ausgangslage: `eeb.einsaetze.v1` (2 Zeichen), `eeb.unlesbar.v1` (15 922
  Zeichen, der Rohtext der Sammlung mit sechs Meldungen) und
  `eeb.entwurf.beschaedigt.v1`.
- „Sicherung einspielen…" mit einer gültigen Sicherungsdatei: Die Rückfrage
  nennt unter „Auf diesem Gerät — geht dabei verloren" nur „keine laufende
  Einsatz-Sammlung · 0 Vorlagen · kein angefangener Bogen · keine
  Absenderkarte · kein Signatur-Geräteschlüssel". Weil dort nichts steht, gibt
  es **keinen Haken**; „Einspielen und ersetzen" ist sofort frei. Nach dem
  Einspielen liegen nur noch `eeb.sicherung.zuletzt.v1` und `eeb.entwurf.v1`
  im Speicher: `eeb.unlesbar.v1` und `eeb.entwurf.beschaedigt.v1` sind weg, die
  Karte „Nicht lesbar" ebenso.
- „Alle Daten löschen": Die Aufzählung nennt „ein beiseitegelegter,
  unlesbarer Bogen (Startseite, „Als Datei sichern" vorher möglich)", aber
  nicht den beiseitegelegten Sammlungstext („0 Einsatz-Sammlungen mit 0
  gemeldeten Bögen"). Im Lauf mit nur dem Sammlungstext steht dort „1
  Einsatz-Sammlung mit 0 gemeldeten Bögen" — ohne den Hinweis, dass es sich um
  den beiseitegelegten Rest handelt.
- Die Karte auf der Startseite verspricht „Nichts davon ist gelöscht; die Daten
  stecken in der Datensicherung" und bietet „Daten sichern…". Das stimmt
  (die erzeugte Sicherungsdatei enthält den Rohtext, gemessen: 22 355 Zeichen
  mit `eeb.unlesbar`); es setzt aber voraus, dass der Helfer vor dem Einspielen
  selbst sichert, worauf der Einspielen-Dialog nicht hinweist.

**Erwartung der Rolle:** Was die App ausdrücklich „nicht gelöscht, sondern
beiseitegelegt" nennt, steht auch in jeder Aufzählung dessen, was ein
Löschen oder Einspielen verliert, und verlangt den Haken.

**Folge:** Wer nach einem beschädigten Speicher „Sicherung einspielen…" wählt —
der naheliegende Reparaturweg —, verliert die einzige Kopie des Rests, ohne
dass der Dialog es nennt. Bei einer abgeschnittenen Sammlung ist der Rohtext
nicht vollständig, aber er enthält häufig noch lesbare Meldungen (hier 15 922
Zeichen). P2, weil der Eintritt zwei seltene Dinge verlangt (beschädigter Text
und Einspielen), die Wirkung aber die letzte Spur einer ganzen Lage trifft.

**Empfehlung:** Beide Aufzählungen führen „beiseitegelegter Sammlungs- bzw.
Vorlagentext (n Zeichen)" und „beschädigter Entwurf" mit; bei „Sicherung
einspielen…" zählt das als Datenverlust (Haken, „Vorher Sicherung
erstellen…").

**Nachprüfung:** Sammlungstext abschneiden, „Sicherung einspielen…" öffnen: Die
Rückfrage nennt den beiseitegelegten Text, der Knopf ist bis zum Haken
gesperrt. Ebenso bei „Alle Daten löschen".

### R9-D3 [P3] Rückwege im Assistenten sind uneinheitlich: „Rückgängig" nach „Fahrzeug entfernen" endet beim Schrittwechsel, „Ebene entfernen" hat keinen

**Priorität:** P3

**Kennzeichnung:** gemessen (Quittungsleiste vor und nach Schrittwechsel und
Neuladen; Speicher).

**Fundstelle / Aufgabe:** Schritt 4 „Fahrzeug entfernen" und Schritt 1 „Ebene
entfernen" im Vergleich zu Schritt 3 „Person entfernen".

**Beobachtung:**

- „Person entfernen": Die Quittung „Entfernt: …" mit „Rückgängig" bleibt im
  Schritt 3 stehen, kommt nach „Weiter" und Zurück wieder und überlebt das
  Neuladen (Sitzungsspeicher, 15 Minuten). Drei Entfernungen hintereinander
  gelten als eine Quittung („Entfernt: 3 Personen …"); ein Tipp holt alle drei
  an ihre alte Stelle (Listenfolge geprüft).
- „Fahrzeug entfernen": Die Quittung erscheint im Schritt 4, ist aber nach
  „Weiter" und Rückkehr in Schritt 4 nicht mehr da; auch nach Neuladen nicht. Der
  Dialog sagt dazu nur „„Rückgängig“ in der Leiste unten holt es zurück" und
  nennt das Ende nicht. Innerhalb des Schritts und nach 20 s Warten funktioniert
  „Rückgängig" (Reihenfolge der Fahrzeuge danach wie vorher).
- „Ebene entfernen" (OV/RB/LV in Schritt 1, ✕ 44 × 44): Rückfrage nennt Telefon
  und E-Mail der Ebene und „gehen verloren"; nach „Ebene entfernen" gibt es
  keine Quittung und kein „Rückgängig". Das ist so angesagt, aber anders als
  bei Person und Fahrzeug.

**Erwartung der Rolle:** Alles, was der Assistent mit „Entfernen" wegnimmt,
lässt sich gleich lang zurückholen; wo es nicht geht, sagt es die Rückfrage.

**Folge:** Ein Fahrzeug (Kennzeichen, Funkrufname, Sitzplätze, Änderungen),
das ein Helfer erst nach dem Weiterblättern vermisst, muss neu eingegeben
werden. Die Rückfrage vorher fängt den meisten Schaden ab, deshalb P3.

**Empfehlung:** Den Rückweg für Fahrzeuge wie bei Personen für den Bogen
merken (auch nach Schrittwechsel und Neuladen) und im Dialog dazusagen, wie
lange er gilt; bei der Ebene entweder ebenfalls „Rückgängig" oder den Satz
„nicht rückgängig zu machen".

**Nachprüfung:** Fahrzeug entfernen, „Weiter", „4 . Fahrzeuge": „Rückgängig"
steht wieder da, nach Neuladen ebenfalls.

### R9-D4 [P3] Zwei Rückfragen mit „Die eben eingelesene" bzw. „Ja, so übernehmen" haben den Fokus auf der ändernden Wahl; ein Enter genügt

**Priorität:** P3

**Kennzeichnung:** gemessen (Fokus und Speicher nach Enter); Wirkung am
Meldekopf mit Handscanner ist ein Risiko (Annahme: Handscanner senden nach dem
Code ein Enter, wie der Dialog „Ohne Kamera: mit dem USB-Handscanner scannen"
vorsieht).

**Fundstelle / Aufgabe:** Einsatzansicht → „Bögen einlesen…" mit einer Datei
gleichen Stands (Dialog „Zwei Fassungen mit demselben Stand") und „Stärke
ändern…" (Dialog „Stimmt die Stärke?").

**Beobachtung:**

- „Zwei Fassungen mit demselben Stand": Fokus liegt auf „Die eben eingelesene
  (Stärke 1 / 1 / 0 / 2)", darunter „Die bisherige (Stärke 1 / 1 / 2 / 4)" und
  „Bisherige behalten". Ein einzelnes Enter schließt den Dialog und die
  Sammlung zeigt danach 1 / 1 / 0 / 2 („gleicher Stand wie die bisherige
  Fassung — die eben eingelesene gilt"; Quittung „Folgemeldung … Stärke 4 → 2
  (−2)").
- „Stimmt die Stärke?" (130 statt 13 Mannschaft): Fokus auf „Ja, so
  übernehmen", „Zahlen korrigieren" daneben. Zweimal Enter im Eingabefeld
  (nach 0, 150, 500 und 1 200 ms) übernimmt 130; die Tipp-Sperre fängt nur
  Touch-Tipps ab.
- Alle anderen Rückfragen im Bericht (Verwerfen, Papierkorb, Entfernen,
  Schlüssel, „Nur Stärke melden?", „Beiseitegelegtes entfernen…") setzen den
  Fokus auf „Abbrechen" bzw. auf die schonende Wahl.

**Erwartung der Rolle:** Bei einer Rückfrage, die eine Zahl oder Fassung
ersetzt, liegt der Fokus auf der Wahl, die nichts ändert.

**Folge:** Ein Doppel-Enter oder ein zweiter Scan überschreibt die Meldung der
Einheit. Die frühere Fassung bleibt in der Historie, und die Frage „Stimmt die
Stärke?" ist ein Plausibilitätsschutz, kein Löschweg; deshalb P3.

**Empfehlung:** Fokus auf „Bisherige behalten" bzw. „Zahlen korrigieren".

**Nachprüfung:** Beide Dialoge öffnen, Enter drücken: Der Bestand bleibt, der
Dialog bleibt oder schließt ohne Änderung.

### R9-D5 [P3] Rückfragen bei 200 % Schrift und 320 × 568 zeigen nur ein Drittel des Textes neben dem roten Knopf

**Priorität:** P3

**Kennzeichnung:** gemessen (sichtbare Rumpfhöhe der Rückfrage „Meldung
entfernen?"), Bildschirmfoto `me_gross200-320.png`.

**Fundstelle / Aufgabe:** Einsatzansicht → „Mehr…" → „Entfernen" bei
320 × 568 mit `html { font-size: 200% }`.

**Beobachtung:**

| Lage | Rumpf sichtbar |
| --- | --- |
| 360 × 640 | 433 von 482 px (90 %) |
| 320 × 568 | 361 von 578 px (62 %) |
| 360 × 640, 200 % Schrift | 381 von 785 px (49 %) |
| 320 × 568, 200 % Schrift | 309 von 905 px (34 %) |

In der letzten Lage steht „Meldung entfernen" (rot, 238 × 44) bereits im Bild,
während der Text zu den Nummern („Die Einheiten Nr. 2–6 rücken auf …") und der
Satz „Rückgängig gibt es nur, solange die App geöffnet bleibt" erst nach
Scrollen kommen. Der Rumpf rollt, ein Schattenrand deutet es an; alle Knöpfe
bleiben mindestens 44 px hoch und erreichbar.

**Erwartung der Rolle:** Die Folgen stehen vor dem Knopf, der sie auslöst.

**Folge:** Wer bei großer Schrift „Meldung entfernen" tippt, ohne zu rollen,
liest den Hinweis auf die Nummern nicht; „Rückgängig" fängt es ab. P3, weil das
Zoom-Verhalten aus R8-G1/M2 grundsätzlich hält (Knöpfe untereinander, Rumpf
rollt) und nur der Anteil in der engsten Lage klein ist.

**Empfehlung:** Die Folgen kurz vor den Knopf setzen, den Fließtext darüber
einkürzen.

**Nachprüfung:** 320 × 568 bei 200 %: Der erste Satz nach der Überschrift nennt
die Nummernfolge, bevor der rote Knopf sichtbar wird.

## Bestätigtes

Alles im Browser nachgespielt:

- **R8-D1 Rohtext-Rettung (hält):** Sammlungstext auf 70 % abgeschnitten:
  `eeb.einsaetze.v1` 2 Zeichen, `eeb.unlesbar.v1` 15 922 Zeichen; Objekt statt
  Liste: 115 Zeichen beiseite; abgeschnittener Vorlagentext: `eeb.vorlagen.v1`
  bleibt (40 Zeichen), Rohtext zusätzlich beiseite; beides zusammen: „2
  beschädigte Gesamttexte". Karte „Nicht lesbar … die Stärke kann zu niedrig
  sein" mit „Daten sichern…" (erzeugt Datei mit dem Rohtext) und
  „Beiseitegelegtes entfernen…" (fragt, Fokus auf „Abbrechen"). Eine neue
  Sammlung daneben löscht den beiseitegelegten Text nicht, auch nicht nach
  Neuladen. Grenze siehe R9-D2.
- **R8-D2 Nummern (hält):** Rückfrage „Nummern ändern sich: Die Einheiten Nr.
  2–6 rücken auf und heißen danach Nr. 1–5 … „Rückgängig" stellt die alten
  Nummern wieder her"; Quittung nennt dasselbe. „Rückgängig" bleibt beim Wechsel
  zur Startseite und zurück, fehlt nach Neuladen (wie in der Rückfrage gesagt).
  „Entfernen" und „Abrücken" stapeln zwei Quittungen mit je „Rückgängig".
- **R8-D3 Anonymisierung (hält):** Entwurf 70 Tage: keine Zeile; 77 Tage:
  „⚠ Namen werden am 6.11.2026 anonymisiert (noch 13 Tage) — vorher
  weitergeben oder sichern; Bearbeiten beginnt die Frist neu"; 80 Tage: noch 10
  Tage; 89 Tage: „noch 1 Tag"; 92 und 95 Tage: „Datenschutzfrist abgelaufen:
  Namen, Funktionen und Erreichbarkeiten wurden am … anonymisiert", im Speicher
  steht „Einsatzkraft 1".
- **R8-D4 Zoom (hält):** Bei 180 × 320 stehen „Fortsetzen" und „Verwerfen"
  untereinander, 146 × 44 px, Abstand 8 px, kein Textüberlauf. Bei 320 × 568
  und 200 % 234 × 44, Abstand 16 px (ein Titel „Hochwasser Musterstadt" läuft
  über seine Zeile hinaus, nicht zerstörend). Quer 99/96 × 44 mit 12 px.
- **R8-D5 Sperre nach „Abrücken" (teilweise, wie vermerkt):** Zweittipp auf
  dieselbe Stelle nach 0,1, 0,6, 1,4, 2,0 und 2,4 s ändert nichts (Status bleibt
  „abgerückt"); nach 2,7 s und 4 s nimmt er den Statuswechsel zurück, die
  Quittung ist dann weg. Die Leiste liegt weiter an der Knopfstelle (506 bis 571
  von 640 px); folglich bleibt der Rest, dass ein „nachgetipptes" Abrücken nach
  mehr als 2,5 s den Status zurücksetzt.
- **R8-D6 Übergabe-Dialog (hält):** „Für neuen Einsatz vorbereiten" steht als
  letzter Knopf, hinter „Weitere Formate"; die Rückfrage nennt Zeitraum,
  Ort/Auftrag und Sofortbedarf mit Werten, „lässt sich hier nicht zurücknehmen",
  Fokus auf „Abbrechen, Bogen behalten".
- **Löschwege Startseite:** „Verwerfen" und „Neuen Bogen erstellen" nennen den
  Rückholplatz; „Einsatz löschen…" nennt Name und Zahl der Meldungen und „30
  Tage", Papierkorb „Wiederherstellen" 141 × 44; „Endgültig löschen…" nennt
  „fremde Personendaten … die einzige Kopie". „Alle Daten löschen": Knopf
  gesperrt bis zum Haken (gemessen: `disabled`), danach 3 Einträge entfernt;
  der Dialog „Alle lokalen Daten gelöscht … Neu starten" liegt über dem alten
  Bild, `Escape` und „Zurück" legen nichts wieder an (Speicher bleibt leer).
- **Zwei Fenster:** Nach „Alle Daten löschen" in A zeigt B „⚠ In einem anderen
  Fenster gelöscht oder geschlossen — hier wird nichts gespeichert" und
  „Fortsetzen" zeigt die Entscheidung; „Öffnen" der Sammlung ist in B nicht mehr
  möglich.
- **Sicherung einspielen:** Aufzählung beider Seiten mit Zahlen; Dateien, die
  keine Sicherung sind (einzelner Bogen, abgebrochenes JSON, 60 % einer
  Sicherung, `{}`), ändern nichts („Die Daten auf diesem Gerät sind
  unverändert"), jeweils mit eigenem Grund und dem Weg, den Bogen zu öffnen.
- **Rückfragen und Zurück-Taste:** Die Zurück-Taste des Browsers schließt eine
  offene Rückfrage („Person entfernen") ohne zu entfernen.
- **Bögen einlesen:** Älterer Stand: „nur in die Historie gelegt, die Lage
  bleibt unverändert"; neuerer Stand: Folgemeldung mit „Stärke 4 → 1 (−3)" in
  „Neu seit der letzten Kenntnisnahme".
- **Rückfragen bei Lagen:** 320 × 568, 640 × 360, 820 × 1180, 200 % und Zoom
  180 × 320: alle Knöpfe der Rückfragen „Verwerfen", „Einsatz löschen", „Alle
  Daten löschen", „Geräteschlüssel" 44 px hoch und erreichbar (Rumpf rollt;
  „Endgültig löschen" in „Alle Daten löschen" bei 200 % auf 3 057 bzw. 3 689 px
  Rumpfhöhe, hinter dem Haken); kein Quer-Überlauf. Haken 24 × 24 px (Zeile
  44 px und höher, Feld 48 px bei 200 %).
- **Organisation wechseln:** Rückfrage nennt Einheitstyp, Zugehörigkeit,
  Telefon und E-Mail sowie, dass Personen und Fahrzeuge bleiben.
- **Vorlagen:** „Löschen" geht ohne Rückfrage in den Papierkorb (30 Tage) mit
  „Rückgängig" (die Rückfrage bei gleichnamiger Vorlage, R7-D8, habe ich in
  dieser Runde nicht erneut gespielt).

**Verweis, kein eigener Befund:** „Als Vorlage speichern" legt den Bogen mit
Namen, Rufnummern und Kennzeichen ab (im Speicher gemessen: Vorlage mit allen
38 Personen, 14 788 Zeichen); der Dialog sagt nur „Die Vorlage bleibt auf diesem
Gerät". Die Folge für den Datenschutz gehört in
[offline-und-speicher.md](offline-und-speicher.md) bzw. den Datenschutzbericht;
für die Zerstörungsfrage zählt, dass „Alle Daten löschen" die Vorlagen
mitzählt („0 Vorlagen (inkl. Papierkorb)").

## Abgleich mit Runde 8

| Befund Runde 8 | Stand in Runde 9 | Beleg |
| --- | --- | --- |
| R8-D1 Gesamttext wird still zu `[]` (P1) | hält, Rand in R9-D2 | `eeb.unlesbar.v1` 15 922 Zeichen, Karte, „Daten sichern…" |
| R8-D2 „Entfernen" verschiebt Nummern (P2) | hält | Rückfrage und Quittung nennen „Nr. 2–6 … Nr. 1–5", „Rückgängig" stellt wieder her |
| R8-D3 Anonymisierung ohne Vorwarnung (P3) | hält | Karte ab 77 Tagen („noch 13 Tage"), nach Ablauf „Datenschutzfrist abgelaufen" |
| R8-D4 Entwurfskarte bei 180 px (P3) | hält | Knöpfe untereinander, 146 × 44, kein Überlauf |
| R8-D5 Zweittipp auf „Rückgängig" (P3) | teilweise, wie vermerkt | Sperre 2,5 s hält (2,4 s ohne Wirkung); nach 2,7 s nimmt der Zweittipp zurück; Leiste liegt an der Knopfstelle |
| R8-D6 „Für neuen Einsatz vorbereiten" im Dialog (P3) | hält | Knopf am Dialogende, Rückfrage mit Werten, Fokus auf „Abbrechen" |
| R7-D1 bis D8 | halten (D8 nicht erneut gespielt) | Rückfragen, Papierkorb, Schlüssel, Rückholplatz, Zwei-Fenster-Löschen nachgespielt |
| R8-H5/S4 Prellschutz 450/800 ms | Stand vermerkt | Beim schnellen Antippen von „✕" folgt „Einen Moment …"; die Rückfrage hält; nicht erneut vermessen |
| R8-M6, R8-A1, R7-G4/M8, R7-G8/H9, R7-N1, R7-N9, R6-O9 | nicht berührt | bekannte Grenzen, in meinem Aufbau nicht gemessen |

Nebenwirkungen der Runde-8-Änderungen: Die Rettung unlesbarer Gesamttexte
(`eeb.unlesbar.v1`) ist von der Aufzählung in „Alle Daten löschen" nur teilweise
und von „Sicherung einspielen…" gar nicht erfasst (R9-D2). Die engere
Rückfrage bei Zoom hält alle Knöpfe erreichbar, lässt in der engsten Lage aber
nur 34 % des Textes neben dem roten Knopf (R9-D5).

## Abschluss

- **Aufgabe geschafft:** ja
- **Fremde Hilfe nötig:** nein
- **Größtes Missverständnis:** Wer einen Schalter im Assistenten aus- und
  wieder einschaltet, erwartet seine Zahlen noch vorzufinden, bekommt aber leere
  Felder (R9-D1).
- **Größtes Einsatzrisiko:** „Sicherung einspielen…" als naheliegender
  Reparaturweg nach einem beschädigten Speicher vernichtet die einzige Kopie
  des beiseitegelegten Rests, ohne dass der Dialog es nennt (R9-D2).
- **Top-Priorität für die nächste Iteration:** Die Schalter „Sofortbedarf
  erfassen" und „Funkrufname" sollen ihre Werte beim Ausblenden behalten oder
  vorher fragen (R9-D1); danach die Aufzählungen in „Sicherung einspielen…" und
  „Alle Daten löschen" um das Beiseitegelegte ergänzen (R9-D2).

Zählung: P0 0, P1 0, P2 2 (R9-D1, R9-D2), P3 3 (R9-D3 bis R9-D5).
