# Audit „Analog first", Runde 10 (Papier-Rückfallebene, Rückweg vom Papier)

Stand: 25.10.2026 · Code-Stand: `441811c` (Zweig `main`) · Prüfer: Rollenaudit
`thw-analog-first-reviewer` · Prüfgegenstand: Web-App, Produktionsbuild
(`vite preview`, Port 4173, nicht neu gebaut, nicht angehalten).

Reiner Prüfbericht, keine Codeänderung. Zehnte Runde nach der Behebung der
Runde-9-Befunde (Stand der Behebung in
[../runde-9/README.md](../runde-9/README.md); Bericht der Rolle:
[../runde-9/analog-first.md](../runde-9/analog-first.md), dort 1 × P2, 5 × P3,
alle als behoben gemeldet).

## Prüfaufbau

Playwright aus `node_modules`, Chromium unter `/opt/pw-browsers/chromium`
(`--no-sandbox`), `isMobile`/`hasTouch`, Locale de-DE, Telefon 360 × 640 als
Grundeinstellung, für die Lage des Papier-Knopfs auch 320 × 568 und 640 × 360.
Jeder Durchgang lief in einem eigenen, frischen Browser-Kontext, weil elf weitere
Prüfer denselben Server nutzten. Zuerst habe ich ohne Kenntnis der Berichte
getestet, danach den Runde-9-Bericht der Rolle und den Abschnitt „Stand der
Behebung" gelesen und jede Behebung nachgestellt. Zwischenzeitlich war der
Server wegen eines Nutzungslimits nicht erreichbar; nach der Wiederkehr (HTTP
200) habe ich die Läufe fortgesetzt, nichts wurde neu gestartet.

Durchgespielt (blind):

- Startseite, Entwurf (THW Oldenburg, Verstärkter Bergungszug, 38 Personen),
  Schritt 5 („Sofortbedarf erfassen" ausschalten), Schritt 6, „Bogen übergeben…",
  „PDF erzeugen", Browser-Druck (`page.pdf`, `print`-Medium) der Übersicht,
  „Leeren Vordruck drucken (PDF)", Seite „Papier oder digital?".
- Einsatz-Sammlung „Hochwasser Musterstadt" mit 6 Bögen (001, 003, 009, 013,
  016, 052 aus `examples/thw/`), Stärke 1 / 15 / 43 / 59. Nachtrag vom
  Meldeblock mit „Einheit manuell erfassen…" (Eingetroffen um 09:40, Nr. 7,
  Zug, „Ort der Einheit (Pflicht)" mit Verzeichnis-Ergänzung „Hagen",
  „Nur Stärke" mit „2,5" und „-3", Rückfragen „Stärke fehlt" und „Nur
  Sollplätze, keine gemeldete Stärke", „Als Sollstärke ablegen"), „Einheit
  schnell erfassen (nur Stärke)…" von der Startseite.
- Ausgaben: Übersicht-CSV, „Alle Daten als CSV", Excel-Liste (Format
  „Oldenburg", als XML gelesen), Lageblatt (A4 quer), Sammel-PDF (19 Seiten),
  Einzel-PDF; alle mit `pdftotext -layout`, `pdfinfo`, `pdftoppm` bzw. als Text
  gelesen. Dateinamen mit „Überschwemmung Köln-Mülheim ß" als Einsatzname.
- Rückweg vom Papier: „Einsatz importieren…" mit der Sammel-PDF auf einem leeren
  Gerät; „Bögen einlesen…" mit den 19 Seitenbildern (130 dpi) in einer neuen
  Sammlung; „Lage vom Papier abgleichen…" mit Nr. 1–7 und sieben
  Zug-Schreibweisen.
- Ausfälle: abgeschnittener Gesamttext von `eeb.einsaetze.v1` (400 Zeichen,
  halbe Länge, 3 000 Zeichen); Speicher voll (`setItem` wirft
  `QuotaExceededError`) beim Nachtrag in der Sammlung.
- Aktualität des Lageblatt-Aushangs nach neuer Meldung.
- Zug-Schreibweisen in der Sammlung: dieselbe Gruppe als „2.Zug", „2. Zug" und
  „Zug 2" am Meldeblock-Nachtrag.

**Annahmen**, die sich nicht aus Vorschriften belegen lassen: Die laufende
Nummer („Nr. 3") dient am Meldekopf und im Funk als Kurzbezeichnung. Nach einem
Geräteausfall hängt das zuletzt gedruckte Lageblatt weiter an der Wand. Ein
handschriftlich ausgefüllter Blanko kommt ohne Gerät zum Meldekopf. Der
Meldeblock trägt die Eintreffzeit als Uhrzeit und den Zug in der Schreibweise
dessen, der ihn schreibt.

**Nicht prüfbar** waren echtes Drucken (Druckrand, Graustufen, Heften), der
Kamera-Live-Scan, der Handscanner, echte Fotos im Zelt (ersetzt durch gerenderte
Seitenbilder), echte Akku- und Geräteausfälle (ersetzt durch frische Kontexte),
native Builds, Safari und das Verhalten des Popup-Fensters „Bogen als PDF" auf
echten Telefonen. Die Seed-Bögen tragen Einsatzzeiträume im Juli; jede Einheit
zeigt deshalb „Zeitraum vorbei / Anderer Einsatz?". Das ist ein Artefakt der
Seeds und nicht gewertet. Das Datumsfeld im Papier-Abgleich zeigt im
Testbrowser „mm/dd/yyyy" trotz Locale de-DE; das ist ein Browser-Artefakt und
nicht gewertet.

**Bekannte Grenzen** (nur Stand): R8-A1 (Sollstärke zählt mit, mit Marke) hält,
siehe Abgleich. R8-H5/S4 (Prellschutz): Alle Läufe warteten nach dem Öffnen
einer Sammlung mindestens 1,5 s; nicht erneut gemessen. R9-G5 (feste Leisten
bei Zoom): Bei 360 × 640 verdeckt die feste Leiste „Ansicht: Standard" am
unteren Rand Knöpfe, die erst nach Rollen frei liegen (z. B. „Bogen als PDF" in
der aufgeklappten Karte, Oberkante y = 222 nach Rollen, vorher teilweise
verdeckt); ich habe es nur vermerkt. R6-O9, R7-G4/M8, R7-G8/H9, R7-N1, R7-N9,
R8-M6 und R9-M3 habe ich im Papierweg nicht berührt.

**Kennzeichnung:**
- *gemessen*: im Testbrowser mit Zahlen oder Dateiinhalt reproduziert;
- *beobachtet*: im Testbrowser gesehen, ohne eigene Messreihe;
- *Risiko*: aus Code oder Text abgeleitet, nicht nachgestellt.

## Urteil

Die Papierseite trägt, und die Behebungen aus Runde 9 halten. Der Banner zum
beiseitegelegten Gesamttext nennt jetzt den Papier-Rückweg („Weg zurück auf
Papier: die letzte Sammel-PDF und das Lageblatt gelten weiter … „Bögen
einlesen…" bzw. „Einsatz importieren…" neu einlesen") und sagt ehrlich, dass die
App den Text nicht öffnen kann. Die Sollstärke trägt ihr Wort jetzt auch in
Übersicht-CSV (Spalte „Hinweise" und Summenzeile „davon 9 Personen Sollstärke,
nicht gemeldet"), in „Alle Daten als CSV" („Vollständig — Sollstärke, nicht
gemeldet") und in der Excel-Bemerkung; die Excel-Zeilen stehen in Nr.-Folge mit
„Nr. 7 — Sollstärke, nicht gemeldet" in der Bemerkung. Das Lageblatt kennzeichnet
den Funkrufnamen und den OV-Rückruf der Soll-Einheit mit „(Vorbelegung)". Der
Browser-Druck der Übersicht trägt den Hinweis „Ausdruck der App-Ansicht. Der
Bogen als Papier mit QR-Code: „Bogen übergeben…" und „PDF erzeugen"" und blendet
Knöpfe aus. Dateinamen sind ASCII (`…_Verstaerkter_Bergungszug.pdf`,
`eeb-einsatz-Ueberschwemmung_Koeln-Muelheim_ss.csv`). Die Seite „Papier oder
digital?" nennt zweimal „große Einheiten brauchen mehrere Codes". Die
Umschrift steht auch in der Personalliste des PDF („Otto, Vladimir
(Umschrift)").

Der Rückweg vom Papier gelingt ohne fremde Hilfe: Die Sammel-PDF als Datei
bringt 7 Einheiten, die Marke „Sollstärke, nicht gemeldet" und die Summenzeile
zurück; als 19 Seitenbilder werden 7 Bögen aufgenommen, 10 Bilder ohne Code
mit Namen und Grund genannt, danach führt „Lage vom Papier abgleichen…" Nr.,
Zug und Zeit nach. Der Nachtrag vom Meldeblock behält Zeit, Nr. und Zug
(„eingetroffen 25.10.2026, 09:40 · am Meldekopf von Hand erfasst"). Bei vollem
Speicher steht „Nicht übernommen … bitte auf dem Meldeblock notieren … Die
Eingaben bleiben stehen".

Reibung bleibt an einer Stelle: Der Zug aus dem Nachtrag vom Meldeblock wird
nicht normalisiert, der aus dem Papier-Abgleich schon (R10-A1). Wer am Meldeblock
„2.Zug", „2. Zug" und „Zug 2" nachträgt, bekommt drei Züge mit je eigener
Zwischensumme. Dazu zwei kleine Ränder auf dem Papier (R10-A2, R10-A3) und ein
Textfehler im Lageblatt (R10-A4). Nichts davon blockiert.

Aufgaben: Papier erzeugen geht ohne fremde Hilfe (Einzel-PDF, Blanko, Lageblatt,
Sammel-PDF). Nachtrag vom Meldeblock geht ohne fremde Hilfe, mit dem Zug-Rest.
Wiederanlauf nur vom Papier geht ohne fremde Hilfe.

## Befunde

Zählung: P0: 0 · P1: 0 · P2: 1 · P3: 3.

### R10-A1 [P2] Der Zug aus dem Nachtrag vom Meldeblock wird nicht normalisiert: dieselbe Gruppe steht als drei Züge in den Zwischensummen

**Priorität:** P2

**Kennzeichnung:** gemessen (Oberfläche, CSV, Lageblatt, Excel gelesen); die
Ursache im Code ist *Risiko* (nur gelesen: `nummerUndZugSetzen` in
`src/app/eintrag-zeiten.ts` speichert `zug.trim()`, `zugSetzen` und der
Papier-Abgleich rufen `zugNormalisiert` auf).

**Fundstelle / Aufgabe:** Sammlung „Hochwasser Musterstadt" → „Einheit manuell
erfassen…" → Feld „Zug / Verband (laut Zettel)" → „In Einsatz übernehmen" → „Als
Sollstärke ablegen" (dreimal: Nr. 7 „2.Zug", Nr. 8 „2. Zug", Nr. 9 „Zug 2").

**Beobachtung:**
- Die Zwischensummen heißen „Zwischensummen nach Zug (3 Züge + Einheiten ohne
  Zug)" und listen „2. Zug · 1 Einheit(en)", „2.Zug · 1 Einheit(en)" und
  „Zug 2 · 1 Einheit(en)", je Stärke 0 / 2 / 7 / 9. Die richtige Zählung wäre
  ein Zug mit 3 Einheiten und Stärke 0 / 6 / 21 / 27.
- Die Übersicht-CSV (Spalte „Zug"), „Alle Daten als CSV", das Lageblatt (Spalte
  „Zug") und die Excel-Liste (Spalte „Zug") tragen „2.Zug" unverändert; ein
  Einzelfall („Nr. 7 mit „2.Zug"") zeigt das genauso.
- Dagegen führt „Lage vom Papier abgleichen…" mit „2.Zug", „Zug 2" und „2. zug"
  alle drei zu „2. Zug" zusammen („4 Züge" bei zusätzlich „zweiter Zug", „1.tz /
  1. TZ" und „3"), wie in Runde 9 bestätigt. Die Wortform „zweiter Zug" bleibt
  ein eigener Zug (bekannt, nicht neu gewertet).

**Erwartung der Rolle:** Was am Meldeblock steht, ist handgeschrieben und
uneinheitlich („2.Zug", „2. Zug", „Zug 2"). Dass die App daraus einen Zug macht,
ist der Grund, die Zwischensumme von der App führen zu lassen statt vom
Taschenrechner. Beide Wege vom Papier (Nachtrag und Abgleich) müssen gleich
zusammenführen.

**Folge:** Die Zwischensumme je Zug, die der Zugführer an den Stab funkt, ist zu
klein und auf mehrere Zeilen verteilt; wer sie am Wandblatt addiert, rechnet von
Hand nach, also genau das, was die App abnehmen soll. Die Summe über alle
Einheiten stimmt weiter (68 bzw. 86). Das Lageblatt und die Tabellen zeigen die
uneinheitliche Schreibweise nach außen.

**Empfehlung:** Den Zug aus „Zug / Verband (laut Zettel)" beim Übernehmen mit
denselben Regeln glätten und mit den vorhandenen Zügen abgleichen wie beim
Abgleich vom Papier und bei „Zug zuordnen". Bestehende Einträge in
alter Schreibweise beim nächsten Öffnen mit derselben Regel führen.

**Nachprüfung:** Nr. 7 „2.Zug", Nr. 8 „2. Zug", Nr. 9 „Zug 2" manuell
nachtragen: genau eine Zeile „2. Zug · 3 Einheit(en)", CSV, Lageblatt und Excel
mit „2. Zug".

### R10-A2 [P3] Der Browser-Druck der Übersicht zeigt „2 offene Punkte … antippen zum Beheben" ohne die Punkte

**Priorität:** P3

**Kennzeichnung:** beobachtet (`page.pdf` mit `print`-Medium, Seite gelesen und
als Bild angesehen; kein echter Druckdialog).

**Fundstelle / Aufgabe:** Assistent Schritt 6 „Übersicht" mit zwei offenen
Punkten (Entwurf THW Oldenburg) → Strg+P bzw. `page.pdf`.

**Beobachtung:** Der Ausdruck ist jetzt 5 Seiten ohne Anzeigeumschalter, ohne
„Bogen übergeben…" und ohne „Bearbeiten"-Knöpfe und trägt oben den Hinweis
„Ausdruck der App-Ansicht. Der Bogen als Papier mit QR-Code: „Bogen
übergeben…" und „PDF erzeugen"" (R9-A4 behoben). Das Warnfeld lautet dort aber
„⚠ 2 offene Punkte für die Weitergabe — antippen zum Beheben:" mit einem
leeren Aufzählungspunkt; die beiden Texte der Punkte (die als Knöpfe
ausgeblendet sind) fehlen.

**Erwartung der Rolle:** Auf Papier steht entweder, welche Punkte offen sind,
oder das Warnfeld fehlt. „Antippen" hat auf Papier keinen Sinn.

**Folge:** Gering. Wer den Ausdruck als Arbeitsblatt benutzt, liest „2 offene
Punkte" und findet keinen; der Ausdruck ist ohnehin kein Vordruck.

**Empfehlung:** Im Druck die Punkte als Text zeigen (ohne „antippen") oder das
Feld ganz weglassen.

**Nachprüfung:** Strg+P in Schritt 6 mit offenen Punkten: Vorschau zeigt die
Texte der Punkte oder kein Warnfeld.

### R10-A3 [P3] „Nicht übernommen" bei vollem Speicher fordert, die Sollzahl auf den Meldeblock zu schreiben

**Priorität:** P3

**Kennzeichnung:** gemessen (Dialogtext); die Folge ist *Risiko*.

**Fundstelle / Aufgabe:** Sammlung → „Einheit manuell erfassen…" mit
Einheitstyp „Bergungsgruppe", Ort „Hagen" → „In Einsatz übernehmen" → „Als
Sollstärke ablegen" bei `setItem` mit `QuotaExceededError`.

**Beobachtung:** Der Dialog „Nicht übernommen" sagt: „„THW Hagen
Bergungsgruppe", Stärke 0 / 2 / 7 / 9: bitte auf dem Meldeblock notieren, Platz
schaffen und dann noch einmal übernehmen. Die Eingaben bleiben stehen." Die Zahl
0 / 2 / 7 / 9 ist die Vorbelegung nach Einheitstyp (die Rückfrage davor
hieß „Nur Sollplätze, keine gemeldete Stärke"), nicht eine gezählte Stärke. Das
Kopfband sagt „Die Stärke jetzt auf dem Meldeblock notieren." Auf die
Eigenschaft „Sollstärke" weist der Dialog nicht hin. Der übrige Text (Platz
schaffen nur durch Löschen, Eingaben bleiben stehen) hält (R9-O1 und R9-E5
behoben).

**Erwartung der Rolle:** Was auf den Meldeblock kommt, ist Papier, und Papier
wird später gezählt. Eine ungezählte Sollzahl gehört mit dem Wort „Soll" oder
„nicht gezählt" dorthin.

**Folge:** Risiko, gering: Die Sollzahl steht ohne Marke auf dem Block und wird
später als gemeldet gelesen, genau der Fall, den die Marke auf Karte, Lageblatt
und CSV verhindern soll.

**Empfehlung:** Bei einer Soll-Einheit im Dialog „Sollstärke 0 / 2 / 7 / 9,
nicht gezählt" statt „Stärke …" schreiben, und das Kopfband entsprechend.

**Nachprüfung:** Wie oben bei vollem Speicher: Text trägt das Wort „Soll".

### R10-A4 [P3] Lageblatt: „Kennzeichen fehlt" steht in der Hinweiszeile doppelt

**Priorität:** P3

**Kennzeichnung:** gemessen (Lageblatt-PDF gelesen).

**Fundstelle / Aufgabe:** Nr. 7 „THW Norderstedt Bergungsgruppe" als Sollstärke
mit zwei Vorbelegungsfahrzeugen (GKW, Anh Plane/Spriegel) → Lageblatt, Spalte
„Einheit", Zeile „Hinweise".

**Beobachtung:** „Hinweise: leere Personenkarte; alle als „männlich"
(Vorbelegung); Ort/Auftrag leer; keine Rufnummer; Kennzeichen fehlt; Kennzeichen
fehlt; kein Kraftfahrer". Die Spalte ist schmal; die Zeile ist ohne Angabe, welches
Fahrzeug gemeint ist, schwer zu lesen.

**Erwartung der Rolle:** Ein Hinweis steht einmal, eventuell mit Anzahl („2
Kennzeichen fehlen").

**Folge:** Gering. Die Hinweiszeile ist auf dem Wandblatt ohnehin lang; die
Dopplung kostet Platz und Aufmerksamkeit.

**Empfehlung:** Gleiche Hinweise zusammenfassen, bei Fahrzeugen mit Anzahl.

**Nachprüfung:** Lageblatt einer Einheit mit zwei Fahrzeugen ohne Kennzeichen:
ein Eintrag „Kennzeichen fehlt (2)".

## Bestätigtes

- **Papier-Reserve:** „Leeren Vordruck drucken (PDF)" erzeugt „Blanko-Vordruck
  erzeugt (2 Seiten A4, zum Ausfüllen mit der Hand)"
  (`einheiten-erfassungsbogen-blanko.pdf`). Lage des Knopfs: 360 × 640 y = 568,
  57 px hoch; 320 × 568 y = 583, 94 px hoch (erst nach Rollen); 640 × 360 y = 398.
- **Einzel-PDF und Dateinamen (R9-A5):** „PDF gespeichert:
  eeb-251022okt26_THW_Oldenburg_NI_Verstaerkter_Bergungszug.pdf", derselbe Name
  als `suggestedFilename`. Sammlung „Überschwemmung Köln-Mülheim ß":
  `eeb-einsatz-Ueberschwemmung_Koeln-Muelheim_ss.csv`, `…-alle-daten.csv`,
  `…-oldenburg.xlsx`, `eeb-lageblatt-…_Ueberschwemmung_Koeln-Muelheim_ss.pdf`,
  `eeb-einsatz-…pdf`, alle ASCII.
- **Sollstärke (R9-A2, R9-A3):** Übersicht-CSV Nr. 7 mit „Sollstärke, nicht
  gemeldet | 7 Personenkarten ohne Angaben …", Summenzeile „Summe (7 Einheiten,
  davon 9 Personen Sollstärke, nicht gemeldet)"; „Alle Daten als CSV" „Vollständig
  — Sollstärke, nicht gemeldet"; Excel Zeile 9 mit „Nr. 7 — Sollstärke, nicht
  gemeldet — Hin…" in der Bemerkung, Zeilen in Nr.-Folge 1–7; Lageblatt „Heros
  Norderstedt 22/51 (Vorbelegung)", „040419256910 (OV, Vorbelegung)", Summenzeile
  „Summe laut Gerät (7 zählend · davon 1 Sollstärke, nicht gemeldet (9 Pers.))".
  Die Spalte „ID Einheiten-Erfassungsbogen" der Excel-Liste trägt weiter interne
  Kennungen (z. B. `e5`, `cbc3da8b`), die Nr. steht in „Bemerkung"; das reicht
  für den Abgleich mit dem Wandblatt.
- **Banner „Nicht lesbar" (R9-A1):** Nach dem Kürzen auf 400, 9 925 und 3 000
  Zeichen: „Nicht lesbar: Sammlung „Hochwasser Musterstadt" (etwa 1 / 4 / 2
  Meldungen). Liegt beiseite, fehlt in Listen und Zählung." Nach dem Antippen
  folgt „Weg zurück auf Papier …". `eeb.einsaetze.v1` steht danach als `[]`,
  `eeb.unlesbar.v1` trägt den Rohtext (566 / 11 402 / 3 517 Zeichen im
  Umschlag). Die Zeile ohne Aufklappen nennt den Papierweg nicht; das ist
  vertretbar, weil der Banner mit „›" aufklappbar ist.
- **Browser-Druck (R9-A4):** Hinweiszeile oben, ohne Umschalter und
  Bedienknöpfe (Rest siehe R10-A2).
- **„Papier oder digital?" (R9-A6):** Zwei Sätze „große Einheiten brauchen mehrere
  Codes, je einen pro Seite".
- **Umschrift (R8-A3 / R9-W3):** Bei kyrillischem Vornamen „Vladimir Otto
  (Umschrift)" im Feld „Ansprechpartner/in" und „Otto, Vladimir (Umschrift)" in
  der Personalliste des Einzel-PDF (Zeilen 126 und 174 des Textes). Auf dem
  Bildschirm steht der Vorname in der Übersicht weiter kyrillisch („Otto,
  Владимир"), richtig, weil die App ihn lesen kann.
- **Rückweg vom Papier:** Sammel-PDF (19 Seiten) als Datei auf leerem Gerät: „Einsatz
  „Hochwasser Musterstadt" übernommen: 7 Einheiten, davon 7 anwesend", Hinweis
  „Davon 1 Einheit nur Sollstärke, nicht gemeldet (9 Personen) — zählt in der
  Summe mit, bis eine Zahl vorliegt". Als 19 Seitenbilder in einer neuen
  Sammlung: „19 Bilder gelesen — 7 Bögen aufgenommen", 10 Bilder ohne Code mit
  Namen, Hinweis „Von Hand korrigierte Angaben … stecken nicht im Code",
  „Vom Papier eingelesen, Lage noch nicht abgeglichen: 7 Einheiten".
  „Lage vom Papier abgleichen…" mit Nr. 1–7: Nr. wird übernommen, Zug
  normalisiert („2.Zug", „Zug 2", „2. zug" → „2. Zug"; „1.tz" und „1. TZ" ein
  Zug), danach „Eintreffzeit nicht bestätigt … Die Karte trägt „vom Papier,
  Zeiten prüfen"".
- **Nachtrag vom Meldeblock:** „Eingetroffen um" 09:40 gilt („eingetroffen
  25.10.2026, 09:40 ändern · … am Meldekopf von Hand erfasst"), „Nr. laut Zettel"
  7 gilt („Nr. 7"), Zug gilt (Rest R10-A1). „Ort der Einheit (Pflicht)" ergänzt
  aus dem OV-Verzeichnis („Hagen (OHAG) mit Telefon und E-Mail, dazu die
  übergeordneten Ebenen") mit „Rückgängig". Die Zahlenfelder lesen den Text:
  „„2,5" auf ganze Zahlen gerundet: 3." und „Minus geht nicht — „-3" wurde nicht
  übernommen." Rückfragen „Stärke fehlt" (Stärke eintragen / Trotzdem mit Stärke
  0 übernehmen / Abbrechen) und „Nur Sollplätze, keine gemeldete Stärke" (Stärke
  jetzt eintragen / Als Sollstärke ablegen / Abbrechen) mit drei Wegen im festen
  Fuß.
- **Schalter „Sofortbedarf erfassen":** Beim Ausschalten fragt „Sofortbedarf
  entfernen? Diese Angaben gehen verloren: Diesel 620 l, Benzin 40 l, Gemisch
  20 l, Unterbringung, Ruhezeit." mit „Sofortbedarf entfernen / Behalten".
- **Aktualität des Aushangs (R8-W6):** Nach dem Lageblatt „seitdem keine neue
  Meldung"; nach einer neuen Meldung „seitdem 1 neue Meldung — Aushang ist nicht
  mehr aktuell, neu drucken".
- **Speicher voll:** Band „Nicht gespeichert … Die Stärke jetzt auf dem
  Meldeblock notieren." mit „Was tun?"; Dialog „Nicht übernommen … Die Eingaben
  bleiben stehen" (Rest R10-A3).
- **„Bogen als PDF"** an der Karte öffnet das PDF in einem neuen Fenster
  (`blob:`) statt es herunterzuladen; im Testbrowser ohne Fehler. Ob ein
  Popup-Blocker am Telefon das Fenster verhindert, ist nicht prüfbar.
- **Datenschutzfrist, Wiederanlauf mit Papier:** Nicht erneut geprüft; Stand
  Runde 9 gilt.

## Analog-/Digital-Übergabematrix

| Prozessschritt | Digitaler Nutzen | Analoger Fallback | Sauberer Wiedereinstieg in Digital |
|---|---|---|---|
| Bogen der Einheit ausfüllen | Vorlage, StAN-Vorbelegung, OV-Verzeichnis für „Ort der Einheit", Summen, Prüfhinweise | Blanko aus der App (2 Seiten, Meldekopf-Kasten, Beiblatt-Regel) | „Einheit manuell erfassen…" mit Eingetroffen um, Nr., Zug; Zug nur im Abgleich normalisiert (R10-A1) |
| Bogen übergeben | QR (1 bis n Teile), Link, Datei | Einzel-PDF mit Bogen, Meldekopf-Zeile je Seite; bei großen Einheiten 7 Codeseiten (Seite „Papier oder digital?" sagt es) | Seitenbilder über „Bögen einlesen…"; Bericht nennt Bilder ohne Code; Handänderungen nur über „Lage vom Papier abgleichen…" |
| Lage führen | Summen, Zwischensummen je Zug, Lagemonitor, Lageblatt nach Nr. | Lageblatt mit Nachtragszeilen, „Aushang nicht mehr aktuell"-Zeile, Vorbelegung gekennzeichnet | Nachtrag vom Zettel; Sollstärke bleibt in Karte, Lageblatt, CSV, Excel erkennbar |
| Geräteausfall Meldekopf | „Einsatz weitergeben / sichern" als Datei | Letzte Sammel-PDF und Lageblatt | Sammel-PDF als Datei oder 19 Seitenbilder; Nr., Marke, Zug kommen zurück bzw. werden im Abgleich nachgetragen |
| Beschädigter Speicher | Beiseitelegen, „Daten sichern…", Banner nennt Papierweg | Sammel-PDF, Lageblatt, Einzelbögen | „Einsatz importieren…" bzw. „Bögen einlesen…"; Rohtext bleibt für den Betreuer in Datei und `eeb.unlesbar.v1` |
| Speicher voll / Browser sperrt | Hinweis „Nicht gespeichert" mit Handlung, Eingaben bleiben stehen | Meldeblock; PDF des Bogens | Nachtrag nach Platzschaffen; die Soll-Zahl braucht die Marke auf dem Block (R10-A3) |
| Papier-Ausdruck der App-Seiten | Hinweiszeile verweist auf „PDF erzeugen" | Echtes PDF mit Bogen und QR | Ausdruck ist kein Vordruck; offene Punkte ohne Text (R10-A2) |

## Würde ich dafür das Papier weglegen?

Für den Wiederanlauf nach einem Geräteausfall und für den Nachtrag vom
Meldeblock ja: Banner, Sammel-PDF, Lageblatt und Abgleich sind aufeinander
abgestimmt, und die Zahlen ohne Zählung heißen überall „Sollstärke". Zwei
Gegenproben bleiben: Die Zwischensummen je Zug rechne ich weiter gegen, wenn
am Meldeblock verschieden geschrieben wurde (R10-A1), und die Sollzahl, die
ich bei vollem Speicher auf den Block schreiben soll, streiche ich selbst als
„Soll" an (R10-A3). Der Probedruck von Rändern und der kleinen Tabellenschrift
des Lageblatts bleibt offen, weil er sich hier nicht prüfen lässt.

## Abgleich mit Runde 9

Grundlage: [../runde-9/analog-first.md](../runde-9/analog-first.md) samt „Stand
der Behebung" ([../runde-9/README.md](../runde-9/README.md)).

| Runde-9-Befund | Stand laut Tabelle | Bewertung Runde 10 | Beobachtung |
| --- | --- | --- | --- |
| R9-A1 Meldung zum beiseitegelegten Text nennt den Papier-Rückweg nicht (P2) | behoben | **hält** | Aufgeklappter Banner: „Weg zurück auf Papier: die letzte Sammel-PDF und das Lageblatt gelten weiter … „Bögen einlesen…" bzw. „Einsatz importieren…"", dazu „Die App kann den Text nicht öffnen". Zeile „etwa n Meldungen" für 400, 9 925 und 3 000 Zeichen. |
| R9-A2 CSV, „Alle Daten", Excel ohne das Wort „Sollstärke", Excel ohne Nr. (P3) | behoben | **hält** | Alle drei Dateien mit Wort; Summenzeile mit Anteil; Excel in Nr.-Folge, Nr. in „Bemerkung". |
| R9-A3 Rufname der Soll-Fahrzeuge als Rückruf (P3) | behoben | **hält** | „(Vorbelegung)" hinter Rufname und OV-Rückruf im Lageblatt. |
| R9-A4 Browser-Druck ohne Druck-Layout (P3) | behoben | **hält, mit Rest (R10-A2)** | Hinweiszeile, Knöpfe ausgeblendet; Warnfeld „antippen zum Beheben" mit leerem Aufzählungspunkt. |
| R9-A5 Umlaut im Dateinamen (P3) | behoben | **hält** | ASCII-Namen in allen Ausgaben, `suggestedFilename` entspricht der Meldung. |
| R9-A6 „Ein QR-Code" für große Einheiten (P3) | behoben | **hält** | Halbsatz zweimal auf „Papier oder digital?". |
| R8-A1 (Verweis) Sollstärke zählt mit | bekannte Grenze | **bekannte Grenze, Stand unverändert** | Zählt mit, Marke überall (siehe oben). |
| R8-N5 / R9-Zug (Verweis) „n. Zug" | behoben | **teilweise (R10-A1)** | Papier-Abgleich: „2.Zug", „Zug 2", „2. zug" → „2. Zug". Nachtrag vom Meldeblock: Zug unverändert. |
| R8-A3 (Verweis) Umschrift in der Personalliste | behoben | **hält** | „Otto, Vladimir (Umschrift)" im PDF. |

Bilanz: Alle sechs Runde-9-Befunde der Rolle halten; einer (R9-A4) mit einem
kleinen Rest im Druck, die Zug-Normalisierung (aus Runde 8/9, anderer Weg)
bleibt im Nachtrag vom Meldeblock offen. Nebenwirkungen der Runde-9-Änderungen
auf diese Rolle: keine gefunden; die Zahlenfelder, die Rückfragen mit drei Wegen,
die Tipp-Sperre und die Rohtext-Rettung stören den Papierweg nicht. Die
parallelen Änderungen auf `main` („Ort der Einheit (Pflicht)", Anzahl-Fläche,
linksbündige Organisationslisten) haben den Papierweg nicht berührt; die
Verzeichnis-Ergänzung des Ortes füllt Telefon und E-Mail des Ortsverbands in den
Bogen (mit „Rückgängig"), und im Lageblatt der Soll-Einheit steht die Nummer als
„(OV, Vorbelegung)".

## Abschluss

- **Aufgabe geschafft:** Papier erzeugen: ja. Nachtrag vom Meldeblock mit Nr.,
  Zug und Zeit: ja, mit dem Zug-Rest. Wiederanlauf nur vom Papier: ja.
- **Fremde Hilfe nötig:** nein.
- **Größtes Missverständnis:** „Zug / Verband (laut Zettel)" wirkt, als ordne
  die App die Schreibweisen wie im Papier-Abgleich; sie tut es dort nicht.
- **Größtes Einsatzrisiko:** Eine Zug-Zwischensumme, die auf mehrere Zeilen
  verteilt und deshalb zu klein ist (R10-A1); danach die Sollzahl ohne Marke auf
  dem Meldeblock bei vollem Speicher (R10-A3).
- **Top-Priorität für die nächste Iteration:** Den Zug aus dem Nachtrag vom
  Meldeblock wie im Papier-Abgleich normalisieren (R10-A1).

**Zählung:** P0 0 · P1 0 · P2 1 · P3 3.
