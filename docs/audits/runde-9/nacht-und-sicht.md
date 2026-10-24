# Audit „Nacht und Sicht", Runde 9 (Dunkelheit, Blendung, Sonnenlicht, Farbcodierung)

Stand: 24.10.2026 · Prüfer: Rollenaudit `thw-night-visibility-reviewer` ·
Prüfgegenstand: Web-App einschließlich Lagemonitor, Produktionsbuild
(`vite preview`, Port 4173), Code-Stand Commit `c789947` (Zweig `main`).

Reiner Prüfbericht, keine Codeänderung. Wiederholung nach der Behebung der
Runde-8-Befunde. Ich habe zuerst blind geprüft (Startseite, Assistent Schritt 1
bis 6, Übersicht, Übergabe und QR-Vollbild, Einsatzansicht, Lagemonitor,
Musterung, Dialoge, Zwei-Fenster-Leiste) und den Bericht
[Runde 8](../runde-8/nacht-und-sicht.md) samt „Stand der Behebung" in der
[README](../runde-8/README.md) erst danach gelesen. Berichte anderer Rollen aus
Runde 9 habe ich nicht herangezogen.

## Prüfaufbau

Chromium (Playwright aus `node_modules`, `/opt/pw-browsers/chromium`,
`--no-sandbox`), Locale de-DE, je Lauf ein eigener Browser-Kontext, weil elf
weitere Prüfer denselben Server nutzen. Telefon 360 × 640 bei Pixelverhältnis 2
mit `isMobile`/`hasTouch` als Grundeinstellung, dazu 320 × 568, 640 × 360 quer,
Browser-Zoom 200 % nachgestellt (180 × 320 bei Pixelverhältnis 4) und
`html { font-size: 200% }` bei 360 × 640 und 320 × 568. Der Lagemonitor
zusätzlich ohne Touch auf 1920 × 1080, 1366 × 768 und 1280 × 720. Tablet
820 × 1180 habe ich in dieser Runde nicht erneut aufgenommen. Geprüft in allen
vier Modi (Standard, Feld, Dunkel, Nacht), die Kaltstarts zusätzlich mit
Systemeinstellung „dunkel" ohne gespeicherte Wahl und mit künstlich um 1,5
Sekunden verzögertem Bundle.

Zustände aus `localStorage`-Seeds, alle mit `uebung: false` und `stand` auf
heute (Datum 24.10.2026), Ausnahme genannt:

- `eeb.entwurf.v1`: Großbogen „Verstärkter Bergungszug" (`examples/thw/`);
- `eeb.einsaetze.v1`: Sammlung „Hochwasser Musterstadt" mit sechs, zwölf und
  28 Meldungen aus `examples/thw/`; Varianten: eine abgerückte Einheit, eine
  Bemerkung, um drei Stunden gealterte Meldungen bei `art: 1` (Übung);
- `eeb.vorlagen.v1`: eine Vorlage, über „Als Vorlage speichern" aus dem Großbogen
  erzeugt (Musterung);
- `eeb.anzeigemodus.v1` (vier Werte) und `eeb.lagestufe.v1`;
- ein zweiter Tab im selben Kontext, der den Entwurf ändert (Zwei-Fenster-Leiste);
- die Plattformklassen `platform-ios` und `platform-android` auf `<html>`
  nachgestellt.

Der Lagemonitor wurde über `?lagemonitor=s1` direkt aufgerufen.

Gemessen habe ich Kontraste (Schriftfarbe gegen die tatsächlich darunter
liegende Fläche, Deckkraft der Vorfahren eingerechnet, WCAG-Formel, je Modus
über die ganze Seite in Schritten gerollt), das mittlere Luma und den Anteil
heller Bildpunkte je Bildschirmfoto, Schriftgrößen, Lage und Größe von Elementen
(`getBoundingClientRect`, `scrollWidth`, `scrollHeight`), abgeschnittene Texte
und einzelne Bildpunkte (Kästchen, Haken). Bildschirmfotos habe ich angesehen,
nicht nur gerechnet; die Einsatztabelle zusätzlich mit Graustufenfilter.

**Nicht prüfbar:** echtes Licht (Sonne, Arbeitsscheinwerfer, Rotlicht),
tatsächliche Displayhelligkeit, ein Fernseher im Fahrzeug (Abstand, Spiegelung,
Overscan), OLED-Schwarz, WebKit/Safari, die native Android-/iOS-Fassung,
Kamera-Scanner im Dunkeln, Ausdruck und PDF-Betrachter (die Vorschau bleibt im
Prüfbrowser leer), die Auswahlliste und der Datumsdialog des Betriebssystems,
`window.open` und „Vollbild" auf einem zweiten Bildschirm. Die Datumsfelder
zeigen im Prüfbrowser „mm/dd/yyyy" trotz de-DE; das ist eine Eigenart des
Browsers und kein Befund. Zeitmessungen liefen unter Last durch elf parallele
Prüfer.

Nicht nachgestellt, Stand unverändert angenommen: die bekannten Grenzen R6-O9,
R7-G4/M8, R7-G8/H9, R7-N1, R7-N9, R8-A1, R8-H5/S4. R8-M6 (klebende
Namensspalte) war in der Einsatztabelle zu sehen (Namensspalte rund ein Drittel
der Breite, F/U/M daneben, weitere Spalten rechts außerhalb des Bildes), ohne
Wortbruch; unverändert.

## Urteil

Die Behebungen aus Runde 8 halten bis auf einen Rest. Die App selbst ist nachts
und in der Sonne in sehr gutem Zustand: Luma-Mittel Nacht 33 bis 36
(Startseite 36, Übersicht 35, Sammlung 33), Dunkel 40 bis 45, Feld 182 bis 193,
Standard 187 bis 206. In Nacht ist das hellste Pixel der App-Seiten 206; der
Kaltstart beginnt dunkel (Klasse `nacht-modus`/`dunkel-modus` vor dem Bundle,
Grund rgb(15,17,22) bei Systemeinstellung „dunkel", im Lagemonitor rgb(0,0,0)).
Kein aktiver Text liegt in einem der vier Modi unter 4,5:1; die einzigen Werte
darunter sind deaktivierte Pfeile („←", Sortierpfeile ▲ ⇑ ▼) mit 2,59 bis 3,37:1.
Das gilt für Start, Schritt 1 bis 6, Übergabe-Dialog, Einsatzansicht (Karten,
Tabelle), die Dialoge „Angefangenen Bogen verwerfen", „Alle Daten löschen",
„Einsatz löschen", die Zwei-Fenster-Leiste und die Musterung, auch bei Zoom
200 % und `font-size: 200%`. Zustände tragen Wort oder Zeichen („neu",
„● Ruhezeit", „⚠ Anderer Einsatz?", „ABGERÜCKT" mit Durchstreichung und
gestricheltem Rand, „1 offen" im Rahmen); im Graustufenbild bleiben sie
unterscheidbar.

Der Lagemonitor zeigt jetzt bei sechs Einheiten alle sechs (1920 × 1080,
1366 × 768, 1280 × 720), bei zwölf und 28 Einheiten vier bis fünf Zeilen und
„+ n weitere Einheiten · zuletzt gemeldet zuerst" mit höchstens 35 px Rest.
Die Warnfarbe in „Gedimmt" liegt auf dem Telefon über 4,5:1, die Musterung ist
auch abgewählt lesbar.

Reibung gibt es nur noch an fünf Stellen, alle P3: ein Doppeltipp auf die
Stufentaste des Lagemonitors führt aus „Gedimmt" auf Vollweiß (Rest von
R8-L4), die Kleinschrift des Lagemonitors auf dem Telefon liegt unter der
zugesagten Mindestgröße, auf 320 px brechen Orts- und Funkrufnamen mitten im
Wort, die Hauptaktion der Musterung ist bei Zoom 200 % abgeschnitten, und die
nachgestellte Android-Klasse unterschreitet in Nacht einmal 4,5:1.

Die Aufgabe gelingt bei Nacht und in der Sonne ohne fremde Hilfe: Bogen
erfassen, übergeben, am Meldekopf sammeln, Lage zeigen.

## Befunde

Keine P0-, P1- und P2-Befunde. Fünf P3-Befunde.

### R9-L1 [P3] Lagemonitor: ein Doppeltipp auf die Stufentaste führt aus „Gedimmt" in zwei Schritten auf Vollweiß (Rest von R8-L4)

**Priorität:** P3

**Kennzeichnung:** gemessen (Tippfolge, Helligkeit).

**Fundstelle / Aufgabe:** Lagemonitor → „Optionen" → erste Taste „Stufe: Gedimmt ·
heller: Dunkel". Code: `src/app/lagemonitor-ui.tsx` (Tasten „heller" und
„dunkler").

**Beobachtung:** Die Stufenleiste hat nun zwei Richtungen: aus „Gedimmt" führt
„heller" nach „Dunkel" (Luma 29,6 statt 23,6), aus „Dunkel" „heller" nach „Hell"
(Luma 216, 83 % der Fläche über 180) und „dunkler" nach „Gedimmt"; aus „Hell"
führt „dunkler" nach „Dunkel". Der Sprung in einem Tipp ist beseitigt. Die
„heller"-Taste steht aber in „Gedimmt" und in „Dunkel" an derselben Stelle
(erste Taste, gleiche Höhe von 44 px). Zwei Tipps auf diese Stelle im Abstand
von 0, 120, 350 und 700 ms endeten jeweils in `lm lm-hell`, also Schwarz auf
Weiß. Zurück führt der Weg über zwei Tipps („dunkler: Dunkel", „dunkler:
Gedimmt"), ebenfalls an der Stelle der ersten Taste. Der Prellschutz der
Bogenansicht (450/800 ms, R8-H5/S4) wirkt hier nicht.

**Erwartung der Rolle:** Aus der dunkelsten Stufe führt auch ein versehentlicher
Doppeltipp nicht auf die hellste.

**Folge:** Gering: Ein Prellen oder Doppeltippen mit Handschuh im abgedunkelten
Fahrzeug blendet kurz die ganze Besatzung; der Rückweg kostet zwei weitere
Tipps. Der Monitor ist auf dem Fernseher selten in Reichweite, deshalb P3.

**Empfehlung:** Die Taste „heller" in „Dunkel" nicht an die Stelle der ersten
Taste in „Gedimmt" setzen (oder „Hell" nur über eine eigene, abgesetzte Taste
erreichbar machen); alternativ eine kurze Sperre nach jedem Stufenwechsel.

**Nachprüfung:** Monitor in „Gedimmt": zwei schnelle Tipps auf dieselbe Stelle
enden nicht in „Hell" (Luma unter 100); von „Hell" kommt man mit höchstens einem
Tipp in „Dunkel" zurück.

### R9-L2 [P3] Lagemonitor am Telefon: Kleinschrift 13 px, 11,5 px und 10,5 px unter der zugesagten Mindestgröße von 14 px

**Priorität:** P3

**Kennzeichnung:** gemessen.

**Fundstelle / Aufgabe:** Lagemonitor bei 360 × 640 und 320 × 568 mit der
Systemschrift 100 %. Code: `src/app/lagemonitor.css` (`.lm-bewegungen`
`font-size: min(2.9vh, 3.6vw)` ohne `--lm-min`; Telefonblock
`.lm-einheiten th { font-size: 0.75em }`).

**Beobachtung:** Die Zeilen „Eingetroffen: … vor 1 Min" messen 12,96 px bei
360 × 640 und 11,52 px bei 320 × 568; die Kopfzeile der Einheitentabelle
(„Orga", „Ort", „Funkruf", „F", „U", „M") 10,5 px; der Ortszusatz hinter dem
Einsatznamen („· Musterstadt") 10,8 px bzw. 9,6 px. Alle liegen im Kontrast
über 4,5:1 (Gedimmt, Dunkel). Die Tabellenzellen selbst, „Einsatzdaten",
„Optionen" und die Datenzeile stehen bei 14 px. Mit `font-size: 200%` wachsen
Tabelle (28 px), Kopfzeile und Bewegungszeilen mit (R8-L5 hält), ohne Vergrößerung
bleibt die Kleinschrift klein. Runde 8 nannte „Schrift mindestens 14 px"; das
gilt nicht für diese Zeilen.

**Erwartung der Rolle:** Auch die Kleinschrift des Telefonmonitors liegt bei
mindestens 14 px; die Kopfzeile erklärt F/U/M, sie darf nicht die kleinste
Schrift sein.

**Folge:** Gering: Die Tabellenkopfzeile erklärt, was die Ziffern bedeuten
(Führer, Unterführer, Mannschaft); bei geringer Helligkeit und ohne Brille ist
sie bei 10,5 px kaum zu entziffern. Die Telefonansicht ist nach R7-L2 eine
Notlösung.

**Empfehlung:** Für Bewegungszeilen, Tabellenkopf und Ortszusatz dieselbe
Untergrenze wie für die übrige Schrift setzen.

**Nachprüfung:** Lagemonitor bei 360 × 640 und 320 × 568, Systemschrift 100 %:
keine Schrift unter 14 px (Messung aller Textknoten).

### R9-L3 [P3] Lagemonitor bei 320 px: Orts- und Funkrufnamen brechen mitten im Wort („Oberhause-n-Rheinhaus-en")

**Priorität:** P3

**Kennzeichnung:** beobachtet (Bildschirmfoto), gemessen (Spaltenbreite).

**Fundstelle / Aufgabe:** Lagemonitor bei 320 × 568, Sammlung „Hochwasser
Musterstadt", Zeile „THW Oberhausen-Rheinhausen". Code:
`src/app/lagemonitor.css` (`.lm-einheiten th, td` mit `overflow-wrap: normal`,
Telefonblock mit `width: auto`).

**Beobachtung:** Die Ortsspalte ist bei 298 px Tabellenbreite so schmal, dass
„Oberhausen-Rheinhausen" in vier Zeilen zerfällt: „Oberhause", „n-",
„Rheinhaus", „en"; die Zeile ist rund 120 px hoch, dreimal so hoch wie die
übrigen. Bei 360 × 640 bricht derselbe Name sauber am Bindestrich
(„Oberhausen-" / „Rheinhausen"). Das Stilkommentar-Versprechen „Zellen brechen
nur an Leerstellen, nie im Wort" (R7-K7) gilt damit bei 320 px nicht.

**Erwartung der Rolle:** Namen werden nicht mitten im Wort zerrissen; lieber
eine schmalere Spalte für Funkrufnamen oder kleinere Schrift als Wortbruch.

**Folge:** Gering: Der Name bleibt lesbar, aber „Oberhause-n" liest sich wie
zwei Orte; bei Sprechfunk-Rückfragen („welche Einheit?") kostet das einen
Blick mehr.

**Empfehlung:** Auf sehr schmalen Fenstern die Funkrufspalte oder den Ortsnamen
einzeilig kürzen oder die Spaltenbreiten so wählen, dass der längste Teil eines
Namens (bis zum Bindestrich) in die Zelle passt.

**Nachprüfung:** 320 × 568 mit „Oberhausen-Rheinhausen": Umbruch nur am
Bindestrich oder an der Leerstelle, keine Zeile mit einem Wortbruch.

### R9-L4 [P3] Musterung bei Zoom 200 % (180 × 320): die Hauptaktion „Bogen anlegen · 38 Pers · 10 Fz" ist beidseitig abgeschnitten

**Priorität:** P3

**Kennzeichnung:** gemessen (`scrollWidth` 205 px in `clientWidth` 146 px), beobachtet
(Bildschirmfoto).

**Fundstelle / Aufgabe:** Startseite → „Einsatz vorbereiten" (Musterung einer
Vorlage), feste Fußleiste. Code: Stil der Fußleiste `footer.nav button.primaer`
(`white-space: nowrap`, `overflow: hidden`, Text zentriert) in `index.html`.

**Beobachtung:** Bei Browser-Zoom 200 % (Fenster 180 × 320) steht auf dem Knopf
zentriert „n anlegen · 38 Pers ·": der Anfang „Bogen" und der Schluss „10 Fz"
fehlen, rund 29 % des Texts. Gleich in Standard und Nacht (Knopf 148 px breit).
Bei 360 × 640 mit `font-size: 200%` (324 px Knopf) und bei 320 × 568 mit
`font-size: 200%` (284 px) passt der Text. Die Fußleiste selbst misst 21 bis
24 % der Bildhöhe (R8-G2/M3 hält).

**Erwartung der Rolle:** Die Hauptaktion nennt sich vollständig, sonst weiß man
nachts nicht, was der Knopf anlegt und mit wie vielen Personen.

**Folge:** Gering: „anlegen" ist noch zu erkennen, die Zahlen (Pers/Fz), die vor
dem Übernehmen kontrolliert werden sollen, sind es nicht.

**Empfehlung:** Den Knopftext bei sehr schmalem Fenster umbrechen oder die Zahlen
in eine eigene Zeile über den Knopf setzen; nie einseitig abschneiden.

**Nachprüfung:** Musterung bei 180 × 320: Knopftext vollständig lesbar
(`scrollWidth` ≤ `clientWidth`).

### R9-L5 [P3] Plattformstil Android (nachgestellt), Nacht: „‹ Startseite" in der Einsatzansicht mit 4,24:1

**Priorität:** P3

**Kennzeichnung:** beobachtet in nachgestellter Plattformklasse
(`platform-android` auf `<html>`); die native App nicht geprüft, daher Risiko für
den Gerätebetrieb.

**Fundstelle / Aufgabe:** Einsatzansicht „Hochwasser Musterstadt", Rückverweis
oben links, Nacht-Modus unter `platform-android`. Code: `index.html`
(`.nacht-modus.platform-android`).

**Beobachtung:** Der Text misst 4,24:1 (16 px); im reinen Web-Nacht-Modus liegt
derselbe Verweis über 4,5:1. Start, Schritte, Übersicht und Dialoge liegen unter
`platform-android` in Nacht und in den anderen Modi über 4,5:1; `platform-ios`
in allen vier Modi auf Start und Einsatzansicht ebenfalls (R8-L6 hält für iOS).
Die höchste Helligkeit liegt unter beiden Plattformklassen in Nacht bei 230
(13 Bildpunkte, das Sanduhr-Zeichen der Zeile „Wird für den Offline-Betrieb
geladen" auf der Startseite), im reinen Web-Nacht-Modus ebenfalls; auf den
übrigen Seiten bei 206.

**Erwartung der Rolle:** Die Plattformfassung hält dieselbe Untergrenze wie die
Web-Fassung.

**Folge:** Gering: ein Rückverweis, der bei kleinster Helligkeit etwas blasser
steht; das Wort ist groß genug.

**Empfehlung:** Die Plattformstile gegen dieselben Schwellen prüfen wie die
Web-Fassung, auch auf der Einsatzansicht.

**Nachprüfung:** Auf einem Android-Gerät oder mit nachgestellter Klasse
Einsatzansicht in Nacht: Kontrast des Rückverweises ≥ 4,5:1.

## Verweise auf andere Berichte

- Einsatztabelle am Telefon: F/U/M rechts am Bildrand, weitere Spalten außerhalb
  des Bildes, klebende Namensspalte: bekannt als R8-M6, hier kein neuer Befund.
- Das PDF-Vorschaufenster blieb im Prüfbrowser leer; der Hinweis „Das PDF ist
  immer hell, für Papier — auch in der Ansicht „Nacht"" steht im
  Übergabe-Dialog (bestätigt).
- Zwei Tipps auf dieselbe Stelle als Fehlerquelle (R9-L1) berührt den Prellschutz
  aus R8-H5/S4; hier nur für den Lagemonitor genannt.

## Bestätigtes

- **Kaltstart:** Gespeicherte Wahl und Systemeinstellung „dunkel" liefern vor dem
  Bundle `dunkel-modus` (Grund rgb(15,17,22)) bzw. den gespeicherten Modus;
  Lagemonitor schwarz (rgb(0,0,0)) vor dem Aufbau; Systemeinstellung „hell" ohne
  Wahl: Standard.
- **Kontraste:** In allen vier Modi über die ganze Seite gerollt auf Start,
  Schritt 1 bis 6, Sammlung (Karten, Tabelle), Übergabe, drei Dialoge und
  Musterung keine aktive Schrift unter 4,5:1; nur die deaktivierten Pfeile
  („←", ▲ ⇑ ▼) mit 2,59 bis 3,37:1. Musterung abgewählt: Hinweis „Stammt aus
  einem früheren Einsatz …" und Zeilentext ≥ 5,9:1 in Standard (5,92), 6,3 in
  Nacht, 8,17 in Dunkel, 14,2 in Feld (R8-L2 behoben).
- **Helligkeit:** Luma-Mittel Nacht 33 bis 36, Dunkel 40 bis 45, Feld 181 bis
  193, Standard 187 bis 206; QR-Vollbild Luma 98 (Nacht), 103 (Dunkel), 199
  (Feld) mit weißer Ruhezone (nötig zum Scannen, bleibt); Dialog „Verwerfen" und
  Übergabe in Nacht dunkel (Luma 34).
- **Zustandsmarken der Einsatzansicht:** „neu", „● Ruhezeit", „● Unterbr.",
  „⚠ Anderer Einsatz?", „⚠ Zeit prüfen", „Zeitraum vorbei", „Auftrag: …" und
  „ABGERÜCKT" (Durchstreichung, gestrichelter Rand) tragen Wort oder Zeichen; im
  Graustufenbild unterscheidbar, auch Karten/Tabelle (gewählter Reiter mit
  grauer Füllung, ungewählter ohne).
- **Rollen F/U in der Musterung:** Buchstabe im Feld (F auf Violett, U auf
  Grün), nicht nur Farbe.
- **Lagemonitor, Tabelle (R8-L1):** 1920 × 1080, 1366 × 768, 1280 × 720 bei
  sechs Einheiten sechs Zeilen, kein „+ n weitere", Rest 39, 2 und 5 px; bei
  zwölf und 28 Einheiten vier bis fünf Zeilen und „+ n weitere Einheiten ·
  zuletzt gemeldet zuerst", Rest 22 bis 35 px; Seitenhöhe gleich Bildhöhe.
- **Lagemonitor, Gedimmt (R8-L3):** Zeit und Warntexte `#d85a5a` auf Schwarz;
  „ÜBUNG – keine Echtlage", „⚠ letzte Meldung vor 3 Std 1 Min" und die Uhr
  ≥ 4,5:1 auf dem Telefon (Nacht-Modus startet in „Gedimmt", Luma 23,6).
- **Lagemonitor, Systemschrift (R8-L5):** Mit `font-size: 200%` Tabelle 28 px,
  Seite rollt (1 511 px bei 640 Bildhöhe), kein seitlicher Überlauf bei 360 und
  320 px; der Rest in R9-L2.
- **Lagemonitor, Telefon:** Spalte „Einheitentyp" entfällt (Kopfzeile Orga, Ort,
  Funkruf, F, U, M), Tabelle in der Rahmenbreite (336 bzw. 298 px), kein
  seitlicher Überlauf; Tasten 44 px hoch.
- **Plattformstile (R8-L6):** `platform-ios` in Nacht, Dunkel, Feld, Standard auf
  Start und Einsatzansicht über 4,5:1; der Rest in R9-L5.
- **Nacht-Haken (R8-L7):** Haken (199, 199, 191) auf Füllung (78, 72, 63) = 5,4:1
  (R8: 2,79:1); gewählt/leer unterscheiden sich in Füllung und Haken.
- **Zwei-Fenster-Leiste:** fest oben, „⚠ Hier wird nichts gespeichert. Das andere
  Fenster hat den Bogen geändert." mit „Anderen Stand laden", „Meine Fassung
  behalten", „Genauer"; 101/640 px (16 %) bei 360 × 640, 88/320 px (27 %) bei
  Zoom 200 %; Nacht ohne weißen Blitz, Kontrast ≥ 4,5:1. Das Dialogfenster
  „Genauer" mit den Werten dort/hier habe ich nicht geöffnet.
- **Rückfragen bei Zoom 200 %:** „Angefangenen Bogen verwerfen?" bei 180 × 320:
  Rumpf rollt, die beiden Knöpfe stehen untereinander (je 44 px), Knopf
  „Verwerfen" in Rosa mit Rahmen und Wort.
- **Ansicht-Wahl:** vier Felder mit Zusatzzeile (normal, große Tasten, abends,
  gedimmt); Fußleiste bei Zoom 200 % 16 % (Sammlung) bis 24 % (Musterung) der
  Höhe, bei `font-size: 200%` 9 bis 13 %; kein seitlicher Überlauf bei
  Zoom 200 % und 200 % Systemschrift auf Start, Sammlung und Musterung.

## Abgleich mit Runde 8

Grundlage: [../runde-8/nacht-und-sicht.md](../runde-8/nacht-und-sicht.md) samt
„Stand der Behebung" (R8-L1 bis L7 als behoben gemeldet).

| Runde-8-Befund | Stand laut Bericht | Bewertung Runde 9 | Messwert / Beobachtung |
| --- | --- | --- | --- |
| R8-L1 Lagemonitor zeigt 3 von 6 Einheiten (P2) | behoben („Messung nimmt die größte passende Zeilenzahl") | **hält** | Sechs von sechs auf 1920 × 1080, 1366 × 768, 1280 × 720; bei zwölf und 28 Einheiten vier bis fünf Zeilen, Rest 22 bis 35 px. |
| R8-L2 Musterung: abgewählte Zeilen 1,96 bis 2,69:1 (P2) | behoben („Musterung ≥ 4,5:1") | **hält** | Hinweis und Zeile abgewählt ≥ 5,92:1 (Standard), 6,31 (Nacht), 8,17 (Dunkel), 14,18 (Feld). |
| R8-L3 Gedimmt: Warntexte 4,05:1 (P3) | behoben („Kontrast 5,53:1") | **hält** | `--lm-zeit: #d85a5a`; Übung, „⚠ letzte Meldung", Uhr auf dem Telefon über 4,5:1. |
| R8-L4 Stufentaste: aus „Gedimmt" auf Vollweiß (P3) | behoben („Stufenleiste ohne Sprung auf Vollweiß") | **teilweise** | Ein Tipp führt nicht mehr auf Weiß; ein Doppeltipp (0 bis 700 ms) führt in zwei Schritten auf „Hell" (Luma 216) (R9-L1). |
| R8-L5 Lagemonitor-Schrift folgt der Systemschrift nicht (P3) | behoben („Schrift folgt der Systemschrift") | **hält mit Rest** | Bei 200 % Tabelle 28 px; ohne Vergrößerung Bewegungen 13/11,5 px, Tabellenkopf 10,5 px (R9-L2). |
| R8-L6 iOS-Nacht weiße Schrift, iOS-Dunkel 3,77 bis 3,86:1 (P3) | behoben („iOS ≥ 4,5:1") | **hält mit Rest** | iOS in vier Modi über 4,5:1; Android-Nacht auf der Einsatzansicht 4,24:1 (R9-L5). |
| R8-L7 Nacht-Haken 2,79:1 (P3) | behoben („Nacht-Haken 5,32:1") | **hält** | Haken 199/199/191 auf 78/72/63 = 5,4:1. |

Nebenwirkungen der Runde-8-Änderungen: Die neue Zweitaste „dunkler" im
Lagemonitor hat die „heller"-Taste an dieselbe Stelle gesetzt, an der sie in der
nächstdunkleren Stufe wieder steht (R9-L1). Die Messung der Zeilenzahl
(R8-L1) hat keine neue Lücke gezeigt; der Wortbruch bei 320 px (R9-L3) und die
Kleinschrift (R9-L2) stammen aus dem Telefonblock des Stils. Neu in Runde 9:
R9-L1 bis R9-L5 (je P3). Zusammen: 0 × P0, 0 × P1, 0 × P2, 5 × P3.

## Abschluss

- **Aufgabe geschafft:** ja.
- **Fremde Hilfe nötig:** nein.
- **Größtes Missverständnis:** Man hält die Stufentaste „heller" im
  Lagemonitor für eine einmalige Wahl und tippt sie zweimal, obwohl sie an
  derselben Stelle bis zu Vollweiß weiterführt (R9-L1).
- **Größtes Einsatzrisiko:** Ein Doppeltipp auf dem Lagemonitor blendet nachts
  die Besatzung mit Vollweiß, und zwei Tipps führen zurück (R9-L1).
- **Top-Priorität für die nächste Iteration:** Die Stufentaste des Lagemonitors
  so anordnen, dass ein Doppeltipp aus „Gedimmt" nicht in „Hell" endet (R9-L1),
  danach die Kleinschrift des Telefonmonitors auf 14 px anheben (R9-L2).
