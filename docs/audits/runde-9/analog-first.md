# Audit „Analog first", Runde 9 (Papier-Rückfallebene, Rückweg vom Papier)

Stand: 24.10.2026 · Code-Stand: `c789947` (Zweig `main`) · Prüfer: Rollenaudit
`thw-analog-first-reviewer` · Prüfgegenstand: Web-App, Produktionsbuild
(`vite preview`, Port 4173, nicht neu gebaut, nicht angehalten).

Reiner Prüfbericht, keine Codeänderung. Neunte Runde nach der Behebung der
Runde-8-Befunde (Stand der Behebung in
[../runde-8/README.md](../runde-8/README.md); Bericht der Rolle:
[../runde-8/analog-first.md](../runde-8/analog-first.md), dort 1 × P2, 2 × P3,
als behoben bzw. teilweise behoben gemeldet).

## Prüfaufbau

Playwright aus `node_modules`, Chromium unter `/opt/pw-browsers/chromium`
(`--no-sandbox`), `isMobile`/`hasTouch`, Locale de-DE, Telefon 360 × 640 px
(Skalierung 2) als Grundeinstellung, dazu 320 × 568, 640 × 360 (quer),
`html { font-size: 200% }` und die Nachbildung von Browser-Zoom 200 %
(Fenster 180 × 320). Jeder Durchgang lief in einem eigenen, frischen
Browser-Kontext, weil elf weitere Prüfer denselben Server nutzten; Zeiten unter
dieser Last sind Größenordnungen. Zuerst habe ich ohne Kenntnis der Berichte
getestet, danach den Runde-8-Bericht der Rolle und den Abschnitt „Stand der
Behebung" gelesen und jede Behebung nachgestellt.

Durchgespielt (blind):

- Startseite, Entwurf fortsetzen, „Bogen übergeben…", „PDF erzeugen" (auch bei
  `setOffline` nach vollständigem Laden), „Papier-Reserve zum Ausfüllen mit der
  Hand" (Blanko, 2 Seiten), Seite „Papier oder digital?".
- Einsatz-Sammlung „Hochwasser Musterstadt" mit 6 Bögen (001, 003, 009, 013,
  016, 052 aus `examples/thw/`), Stärke 1 / 15 / 43 / 59; Nachtrag einer 7.
  Einheit vom Meldeblock („Einheit manuell erfassen…" mit „Eingetroffen um",
  „Nr. laut Zettel", „Zug / Verband", Rückfrage „Stärke nicht gezählt", „Als
  Sollstärke ablegen"); doppelte Nr.
- Ausgaben der Sammlung: Lageblatt (A4 quer), „Einsatz weitergeben / sichern"
  (Sammel-PDF, 19 Seiten), „Übersicht als CSV", „Alle Daten als CSV",
  Excel-Liste. Alle Dateien mit `pdftotext -layout`, `pdfinfo`, `pdftoppm`
  bzw. als Text gelesen.
- Rückweg vom Papier: „Einsatz importieren…" mit der Sammel-PDF (leeres Gerät
  und Gerät mit vorhandener Sammlung); „Bögen einlesen…" mit den 19 Seitenbildern
  (130 dpi) auf einem leeren Gerät; „Lage vom Papier abgleichen…" mit Nr. 1–7
  und sieben Zug-Schreibweisen.
- Ausfälle: Speicher voll (`setItem` wirft `QuotaExceededError`) im Assistenten
  und beim Nachtrag in der Sammlung; abgeschnittener Gesamttext von
  `eeb.einsaetze.v1` (400 Zeichen, halbe Länge, 3 000 Zeichen, leer), zweite
  Beschädigung nach neuer Sammlung; Datensicherung mit beschädigtem Speicher;
  Datenschutzfrist am Entwurf (70, 80, 89, 91 Tage) und an der Sammlung (80,
  95 Tage); Browser-Druck (`page.pdf`) von Übersicht und Sammlung.
- Lageblatt-Aktualität nach neuer Meldung und nach „Abrücken".
- Lagen: Startseite bei 360 × 640, 320 × 568, 640 × 360, 200 %, 180 × 320 (Lage
  und Größe von „Neuen Bogen erstellen", „Leeren Vordruck drucken", „Neue
  Einsatz-Sammlung…"); Sammlung bei fünf Lagen (Lage und Größe von Lageblatt,
  Blanko, CSV, „Einheit manuell erfassen…").

**Annahmen**, die sich nicht aus Vorschriften belegen lassen: Die laufende
Nummer („Nr. 3") dient am Meldekopf und im Funk als Kurzbezeichnung. Nach einem
Geräteausfall hängt das zuletzt gedruckte Lageblatt weiter an der Wand. Ein
handschriftlich ausgefüllter Blanko kommt ohne Gerät zum Meldekopf.

**Nicht prüfbar** waren echtes Drucken (Druckrand, Graustufen, Heften), der
Kamera-Live-Scan, der Handscanner, echte Fotos im Zelt (ersetzt durch gerenderte
Seitenbilder), echte Akku- und Geräteausfälle (ersetzt durch frische Kontexte
und `setOffline`), native Builds, Safari und echte Dateinamen-Behandlung der
Zielgeräte. Die Seed-Bögen tragen Einsatzzeiträume im Juli; jede Einheit zeigt
deshalb „Zeitraum vorbei / Anderer Einsatz?". Das ist ein Artefakt der Seeds
und nicht gewertet.

**Hinweis zur Messmethode:** Der erste Tipp auf „Einheit manuell erfassen…"
direkt nach dem Öffnen einer Sammlung bleibt ohne Wirkung und ohne Rückmeldung
(gemessen: Wartezeit nach dem Öffnen 500 ms und 900 ms ohne Wirkung, ab 1 200 ms
wirkt der erste Tipp). Das ist der Prellschutz R8-H5/S4 (450/800 ms), bekannte
Grenze und hier nicht erneut gewertet. Alle Läufe warteten danach mindestens
1,5 s.

## Urteil

Die Papierseite trägt, und die Behebungen aus Runde 8 halten. Die als
Sollstärke abgelegte Einheit trägt ihre Marke jetzt in der zugeklappten Karte,
in der Tabelle, im Lageblatt (Zeile und Summenzeile „davon 1 Sollstärke, nicht
gemeldet (9 Pers.)"), in der Sammel-PDF (Übersichts- und Bogenseite) und nach
dem Rückweg vom Papier; die Kopfzeile sagt ehrlich „zählt in der Summe mit, bis
eine Zahl vorliegt" (R8-A1, bekannte Grenze, Stand vermerkt). Die CSV folgt der
Nr. (R8-A2), die Umschrift steht im Feld „Ansprechpartner/in" (R8-A3), der
abgeschnittene Sammlungstext wird beiseitegelegt statt still zu `[]` (R8-H1),
die Zug-Schreibweisen „2. zug", „2.Zug", „Zug 3" werden zu „2. Zug" und „3. Zug",
und die Ankündigung der Anonymisierung erscheint 10 Tage vorher auf Startseite
und im Assistenten.

Der Rückweg vom Papier gelingt ohne fremde Hilfe: Sammel-PDF als Datei (leeres
Gerät: 6 Einheiten; Gerät mit gleicher Sammlung: „keine neue Einheit", kein
Doppeln) und als 19 Seitenbilder (7 Bögen in diesem Lauf; 10 Bilder ohne Code
mit Grund genannt). Der Nachtrag vom Meldeblock mit Eintreffzeit 05:10, Nr. 7
und „2. Zug" kommt mit Vermerken („Eintreffzeit korrigiert", „Zug: 2. Zug",
„Nr. 7 laut Zettel") in die Sammlung; Nr. 3 ein zweites Mal wird abgelehnt
(„Nr. schon vergeben … gehört schon „THW Ulm Bergungsgruppe""). Bei vollem
Speicher steht „Nicht gespeichert … Die Stärke jetzt auf dem Meldeblock
notieren" statt eines stillen Verlusts.

Reibung bleibt an den Rändern der Papier-Fassung: Wer eine als Sollstärke
abgelegte Einheit nicht als Papier, sondern als Tabelle weitergibt, bekommt
Zahlen ohne das Wort „Sollstärke" (R9-A2); die Meldung zum beschädigten Speicher
nennt den Papier-Rückweg nicht (R9-A1); und die Rückruf-Angabe der Soll-Einheit
steht auf dem Wandblatt wie eine gemeldete (R9-A3). Nichts davon blockiert.

Aufgaben: Papier erzeugen geht ohne fremde Hilfe (Einzel-PDF, Blanko, Lageblatt,
Sammel-PDF, auch ohne Netz). Nachtrag vom Meldeblock geht ohne fremde Hilfe.
Wiederanlauf nur vom Papier geht ohne fremde Hilfe.

## Befunde

Zählung: P0: 0 · P1: 0 · P2: 1 · P3: 5.

### R9-A1 [P2] Die Meldung zum beiseitegelegten Gesamttext nennt den Papier-Rückweg nicht, und die Rohdaten sind in der App nicht lesbar

**Priorität:** P2

**Kennzeichnung:** gemessen (Meldungstext, Inhalt von `eeb.unlesbar.v1` und der
Datensicherung). Die Folge für einen Helfer ist *Risiko*.

**Fundstelle / Aufgabe:** Start nach abgeschnittenem `eeb.einsaetze.v1` (400
Zeichen, halbe Länge, 3 000 Zeichen); Banner auf der Startseite mit „Daten
sichern…" und „Beiseitegelegtes entfernen…".

**Beobachtung:**
- Die Rohtext-Rettung aus Runde 8 hält: `eeb.einsaetze.v1` steht danach mit 2
  Zeichen (`[]`) im Speicher, `eeb.unlesbar.v1` trägt den Rohtext unter `texte`
  (art „sammlungen", Länge je nach Kürzung 400, 3 000 oder 11 402 Zeichen). Eine
  zweite Beschädigung nach dem Anlegen einer neuen Sammlung hängt einen zweiten
  Text an (`texte`: 3 000 und 68 Zeichen), Banner „2 beschädigte Gesamttexte".
  Der leere Speicher löst nichts aus (richtig). „Daten sichern…" lädt sofort eine
  Datei `eeb-sicherung-2026-10-24.json`, in der `eeb.unlesbar.v1` mit dem
  Rohtext steckt.
- Der Wortlaut des Banners: „Nicht lesbar: 1 beschädigter Gesamttext
  (Sammlungen oder Vorlagen). Sie fehlen in Listen und Zählung — die Stärke kann
  zu niedrig sein. Nichts davon ist gelöscht; die Daten stecken in der
  Datensicherung." Er nennt weder das zuletzt gedruckte Lageblatt noch die
  Sammel-PDF noch „Einsatz importieren…" / „Bögen einlesen…".
- In der App gibt es keinen Knopf, der den Rohtext liest oder teilweise
  rettet; „Sicherung einspielen…" stellt `eeb.einsaetze.v1` wieder als `[]` her,
  und der Rohtext bleibt Text in einer Datei.

**Erwartung der Rolle:** Wer die Meldung liest, steht am Meldekopf ohne
Sammlung. Der einzige Weg zurück, den ein Helfer ohne Texteditor gehen kann, ist
das Papier: letzte Sammel-PDF, Lageblatt, Einzel-PDFs. Das gehört in den Satz.
„Die Daten stecken in der Datensicherung" liest sich wie „es lässt sich
wiederherstellen".

**Folge:** Risiko. Ein Helfer sichert, spielt die Sicherung ein, sieht keine
Sammlung und hält die Daten für verloren oder wartet auf Unterstützung, obwohl
die Sammel-PDF vom letzten „Einsatz weitergeben / sichern" in zwei Minuten
einlesbar ist (siehe Rückweg unter „Bestätigtes"). Hat er nie eine Sammel-PDF
erzeugt, hilft nur Lageblatt und Einzelbögen auf Papier; auch das steht nicht da.

**Empfehlung:** Im Banner einen Satz zum Rückweg ergänzen („Letzte Sammel-PDF
oder Lageblatt: „Einsatz importieren…" bzw. „Bögen einlesen…""), und ehrlich
sagen, dass die Sicherung den Text bewahrt, die App ihn aber nicht liest.
Mittelfristig: einen lesbaren Teil (hier: 2 von 6 Meldungen im abgeschnittenen
Text) anbieten statt nichts.

**Nachprüfung:** Sammlung mit 6 Meldungen auf die halbe Länge kürzen, Seite
laden: Banner nennt den Papier-Rückweg; „Einsatz importieren…" mit der
Sammel-PDF stellt 6 Einheiten her.

### R9-A2 [P3] CSV, „Alle Daten als CSV" und Excel tragen die Sollstärke ohne das Wort; die Excel-Liste hat weder Nr. noch die Reihenfolge des Blatts

**Priorität:** P3

**Kennzeichnung:** gemessen (Dateien gelesen).

**Fundstelle / Aufgabe:** Sammlung mit sechs gemeldeten Einheiten und Nr. 7
„THW Norderstedt Bergungsgruppe" als Sollstärke abgelegt → „Übersicht als CSV",
„Alle Daten als CSV", „Excel-Liste (Format „Oldenburg")".

**Beobachtung:**
- Übersicht-CSV: Nr. 1–7 in dieser Folge (R8-A2 hält); Zeile 7 mit „Stärke
  0;2;7;9", Quelle „Manuell erfasst", Spalte „Hinweise" mit „7 Personenkarten
  ohne Angaben zählen in die Stärke — ausfüllen oder entfernen. | Alle 9 Personen
  stehen auf Geschlecht „männlich" …". Die Zeile „Summe (7 Einheiten)" nennt
  68, nicht den Anteil. Das Wort „Soll" kommt in beiden CSV nicht vor (0
  Treffer). „Alle Daten als CSV" führt die Einheit als „Personalerfassung:
  Vollständig" mit neun Personenzeilen „Unterführer/GrFü, m, Fleisch" ohne
  Namen.
- Excel (Format „Oldenburg"): Die Zeilen stehen nach Einheitstyp und Ort
  (Albstadt, Bamberg, Crailsheim, Hamburg Mitte, Norderstedt, Oberhausen,
  Ulm), es gibt keine Spalte „Nr."; die Spalte „ID Einheiten-Erfassungsbogen"
  trägt die interne Kennung (z. B. `4e73f847`). Bei Nr. 7 steht in der Spalte
  „Bemerkung" „Hinweise: leere Personenkarte; alle als „männlich"
  (Vorbelegung) …", wieder ohne „Sollstärke".
- Lageblatt, Sammel-PDF, Karte und Tabelle haben die Marke (R8-A1-Umsetzung
  hält dort).

**Erwartung der Rolle:** Wer die Tabelle an den Stab gibt, gibt dieselbe Lage
weiter wie das Wandblatt. Eine Zahl, die niemand gezählt hat, soll auch dort so
heißen; und wer Blatt und Tabelle nebeneinanderlegt, soll die Zeile über die
Nr. finden.

**Folge:** Gering. Die Hinweise nennen die leeren Personenkarten, aber wer die
Summe 68 liest, weiß nicht, dass 9 davon Sollplätze sind. Die Excel-Liste ist
ein fremdes Format (Annahme: Spalten vorgegeben); dort fehlt die Brücke zum
Wandblatt.

**Empfehlung:** In beiden CSV und in der Excel-Bemerkung das Wort „Sollstärke,
nicht gemeldet" und in der Summenzeile den Anteil („davon 9 Soll"); bei der
Excel-Liste die Zeilenfolge nach Nr. und die Nr. in einer vorhandenen
Freitextspalte (z. B. „Bemerkung").

**Nachprüfung:** Sammlung mit einer Sollstärke-Einheit, alle drei Dateien
öffnen: Wort in Zeile und Summe; Excel-Zeilen in Nr.-Folge.

### R9-A3 [P3] Der Funkrufname der Soll-Fahrzeuge steht auf dem Lageblatt als Rückruf

**Priorität:** P3

**Kennzeichnung:** gemessen (Lageblatt und Sammel-PDF gelesen). Die Wirkung im
Einsatz ist *Risiko*.

**Fundstelle / Aufgabe:** Nr. 7 als Sollstärke abgelegt (ohne Fahrzeugangaben)
→ Lageblatt, Spalte „Funkrufname / Rückruf"; Sammel-PDF Bogenseite, Feld
„FuRn".

**Beobachtung:** Spalte „Funkrufname / Rückruf" von Nr. 7: „Heros Norderstedt
22/51" und „040419256910 (OV)" (Rufnummer des OV, mit Zusatz). Niemand hat ein
Fahrzeug erfasst; der Name stammt aus der Vorbelegung nach Einheitstyp
(Fahrzeuge „GKW", „Anh Plane/Spriegel", Kennzeichen leer; „Kennzeichen fehlt"
steht in den Hinweisen). Die Marke „Sollstärke, nicht gemeldet" steht
darunter, bezieht sich aber auf die Zahl; die Hinweiszeile nennt nicht, dass
auch der Funkrufname Vorbelegung ist.

**Erwartung der Rolle:** Was am Funk gerufen wird, muss von der Einheit kommen.
Ein Rufname, den die App aus dem Standardschema ergänzt hat, darf am Wandblatt
nicht aussehen wie die gemeldete Angabe.

**Folge:** Risiko, gering: Der Meldekopf ruft „Heros Norderstedt 22/51" und
trifft eine andere Gruppe oder keine; die Einheit ist noch nicht eingetroffen.

**Empfehlung:** Funkrufname und Rückruf einer Sollstärke-Einheit im Lageblatt
als „(Vorbelegung)" kennzeichnen oder weglassen, bis die Einheit ihn bestätigt.

**Nachprüfung:** Nr. als Sollstärke ablegen, Lageblatt drucken: Spalte
„Funkrufname / Rückruf" gekennzeichnet oder leer.

### R9-A4 [P3] Browser-Druck (Strg+P) von Übersicht und Sammlung hat kein Druck-Layout

**Priorität:** P3

**Kennzeichnung:** beobachtet (`page.pdf`, `print`-Medium; kein echter
Druckdialog).

**Fundstelle / Aufgabe:** Assistent Schritt 6 „Übersicht" und Einsatzansicht,
Drucken über den Browser statt „PDF erzeugen" / „Lageblatt".

**Beobachtung:** Die Übersicht des Bogens ergibt 3 A4-Seiten mit „‹ Startseite",
Anzeigeumschalter („Standard Feld Dunkel Nacht"), „Bogen übergeben…", „In
Einsatz-Sammlung ablegen…", „Bearbeiten"-Links und dem Satz „antippen zum
Beheben". Die Einsatzansicht druckt ebenso 3 Seiten mit „Bogen scannen…",
„Einheit manuell erfassen…", Suchfeld und Sortierung. Eine `@media print`-Regel
fand ich im Quelltext nicht (nur gesucht, nicht ausgewertet).

**Erwartung der Rolle:** Wer ohne Anleitung „Drucken" im Browser wählt (am
Rechner der Führungsstelle naheliegend), bekommt entweder den Bogen oder einen
Hinweis, dass „PDF erzeugen" der Weg zum Papier ist.

**Folge:** Gering. Der Ausdruck ist lesbar, aber kein Vordruck; ihn als Bogen
abzulegen führt zu einem Blatt ohne „Stand", ohne QR-Code und ohne Meldekopf-Zeile.

**Empfehlung:** Beim Drucken der App-Seiten einen Hinweis oder die Ausgabe des
Bogens anbieten; zumindest die Bedienelemente ausblenden.

**Nachprüfung:** Strg+P in Schritt 6: Vorschau zeigt den Bogen oder den Hinweis.

### R9-A5 [P3] Dateiname mit Umlaut wird im Testbrowser zu „download"

**Priorität:** P3

**Kennzeichnung:** beobachtet (Headless-Chromium ohne Locale, `LANG` leer). Ob
echte Geräte betroffen sind, ist *Risiko* und nicht geprüft.

**Fundstelle / Aufgabe:** Bogen THW Oldenburg „Verstärkter Bergungszug" →
„Bogen übergeben…" → „PDF erzeugen".

**Beobachtung:** Die Meldung sagt „✓ PDF gespeichert:
eeb-240707okt26_THW_Oldenburg_NI_Verstärkter_Bergungszug.pdf — liegt im
Download-Ordner des Browsers", der Browser bot die Datei als `download` ohne
Endung an (`suggestedFilename`). Dasselbe bei einem reinen Anker-Download mit
`Verstärkter_x.pdf`; mit `Verstaerkter_x.pdf` und mit dem Bogen Ulm
(`eeb-…_THW_Ulm_Bergungsgruppe.pdf`) kommt der richtige Name.

**Erwartung der Rolle:** Die genannte Datei liegt unter dem genannten Namen und
mit Endung dort.

**Folge:** Risiko, wenn es sich auf einem Zielgerät so verhält: Eine Datei
ohne Endung `.pdf` lässt sich am Telefon nicht öffnen; die Meldung nennt aber
einen Namen, den der Helfer nicht findet.

**Empfehlung:** Umlaute im Dateinamen umschreiben (ä → ae); Meldung und Datei
decken sich dann in jeder Umgebung.

**Nachprüfung:** Bogen mit „ä" im Einheitstyp, PDF erzeugen, auf einem echten
Android- und iOS-Gerät den Namen im Download-Ordner lesen.

### R9-A6 [P3] „Ein QR-Code auf der letzten Seite" stimmt für große Einheiten nicht: 7 Teile auf 4 Seiten

**Priorität:** P3

**Kennzeichnung:** gemessen (PDF gelesen); die Wirkung am Meldekopf ist
*Risiko*.

**Fundstelle / Aufgabe:** Seite „Papier oder digital?" („Der ganze Bogen in
einem QR-Code … von der letzten PDF-Seite"); Einzel-PDF des Bogens THW
Oldenburg, Verstärkter Bergungszug mit 38 Personen.

**Beobachtung:** Das PDF hat 7 Seiten: 3 Bogenseiten und 4 Seiten
„Digitaler Bogen als QR-Code (7 Teile)" mit je einem Teil pro Seite („Teil 1 / 7"
… „Teil 7 / 7"). Der Text der Codeseiten sagt es deutlich („Alle 7 Teile
nacheinander mit der Kamera scannen … Fotos ganzer Seiten liest „Bögen
einlesen…"") und nennt den Link als Weg ohne Scannen. Ein kleiner Bogen (Ulm)
braucht dagegen 1 Code.

**Erwartung der Rolle:** Wer den Vergleich „Papier oder digital?" liest, rechnet
mit einem Code. Bei 38 Personen sind es sieben, und am Meldekopf mit schlechtem
Licht sieben Scans in Folge.

**Folge:** Gering. Die Seite und die PDF widersprechen sich nicht im Betrieb;
die Erwartung „ein Scan" erfüllt sich bei Zügen nicht, der Papierweg („Bögen
einlesen…" mit allen Seitenbildern) bleibt als Ausweg.

**Empfehlung:** Auf der Vergleichsseite einen Halbsatz: „Große Einheiten
brauchen mehrere Codes."

**Nachprüfung:** Seite lesen; Bogen mit 38 Personen als PDF: Hinweis und Anzahl
stimmen überein.

## Bestätigtes

- **Papier-Reserve:** „Leeren Vordruck drucken (PDF)" erzeugt „Blanko-Vordruck
  erzeugt (2 Seiten A4, zum Ausfüllen mit der Hand)" (`einheiten-erfassungsbogen-blanko.pdf`).
  Kopfzeile „Meldekopf: Nr. ___ · eingegangen am ___ um __:__ Uhr · Zug /
  Verband", Feld „[ ] ÜBUNG — kein echter Einsatz", Beiblatt-Hinweis, vier
  Fahrzeugfelder, 29 Personenzeilen (10 + 19), 6 Qualifikationszeilen,
  Sofortbedarf, Sonstiges. Auf der Startseite bei 360 × 640 liegt der Knopf bei
  y = 568 (57 px hoch, im ersten Bild); bei 320 × 568 und 200 % erst nach
  Rollen (y = 583 bzw. 986).
- **Offline:** Nach vollständigem Laden (Statuszeile „Funktioniert komplett
  offline") lädt die Seite bei `setOffline` neu (Entwurf wird angeboten), das
  Einzel-PDF wird erzeugt, der QR-Code im Vollbild („Teil 1 von 7") steht.
- **Einzel-PDF (Papier-Fallback des Bogens):** Alle 38 Personen mit Rolle,
  Funktion, Erreichbarkeit (D/P), 11 Fahrzeuge, StAN-Haken, Sofortbedarf mit
  Betriebsstoffen, Unterbringung M/W/D, Sonstiges, Feld „[ ] von Hand
  geändert", Fußzeile „Stand: 240641okt26 · 1/7", Meldekopf-Zeile auf jeder
  Seite („Blatt 2 von 7 dieses Bogens").
- **Umschrift (R8-A3):** Bei kyrillischem Vornamen steht im Feld
  „Ansprechpartner/in" „Vladimir Lehmann (Umschrift)"; die Quittung nennt weiter
  „Владимир Lehmann (Ansprechperson)". Die Personalliste zeigt für dieselbe
  Person weiter „Lehmann, ????????" (Rest, Umschrift dort empfehlenswert, aber
  die Ansprechperson ist lesbar).
- **Lageblatt (A4 quer, 2 Seiten):** Nr. 1–7, Spalte „Zug", Zeit „Eingetroffen
  (abgerückt)", Nachtragszeilen „übertragen [ ] ______", „Summe laut Gerät (7
  zählend · davon 1 Sollstärke, nicht gemeldet (9 Pers.))". Die Schrift im
  Tabellenkörper misst 6,9 pt (440 Wörter), die Fußnote 7,4 pt; für einen
  Probedruck bleibt das zu prüfen (nicht prüfbar).
- **Aktualität des Aushangs (R8-W6):** „Lageblatt erstellt 24.10.2026, 07:09 ·
  seitdem keine neue Meldung"; nach Nr. 7 „seitdem 1 neue Meldung — Aushang
  ist nicht mehr aktuell, neu drucken"; nach „Abrücken" „seitdem 1 Änderung
  (Abrücken)".
- **Rückweg vom Papier:** Sammel-PDF (19 Seiten) als Datei: leeres Gerät 6
  Einheiten „übernommen"; Gerät mit gleicher Sammlung „keine neue Einheit …
  6 kleine Abweichungen bei der Eintreffzeit"; als 19 Seitenbilder: „7 Bögen
  aufgenommen", 10 Bilder ohne Code mit Namen und Grund. Die Marke
  „Sollstärke, nicht gemeldet" und die Summenzeile gehen mit.
- **Abgleich vom Papier (R8-N5):** Eingaben „1.tz", „1. TZ", „1.TZ" → ein Zug
  „1. tz" (Schreibweise der ersten Eingabe, wie in R8 gemeldet), „2. zug" und
  „2.Zug" → „2. Zug", „Zug 3" → „3. Zug", „erster zug" bleibt ein eigener Zug.
  Hinweis nach dem Übernehmen: „Für 7 Einheiten stand keine Eintreffzeit im
  Abgleich …".
- **Nachtrag vom Meldeblock:** „Eingetroffen um" 05:10 wird übernommen
  („Eintreffzeit korrigiert: … 06:50 → … 05:10"), „Nr. laut Zettel" 7 gilt,
  „Zug / Verband" „2. Zug" gilt; Nr. 3 ein zweites Mal: Dialog „Nr. schon
  vergeben". Karte zugeklappt: „Stärke 0 / 2 / 7 / 9 · Sollstärke, nicht
  gemeldet".
- **Speicher voll:** Assistent: „⚠ Nicht gespeichert — dieser Browser lässt die
  App nichts speichern. Jetzt „Bogen übergeben“ (PDF)."; Nachtrag in der Sammlung:
  „… Die Stärke jetzt auf dem Meldeblock notieren." mit „Was tun?" und
  „Speichern fehlgeschlagen — der Speicher dieses Geräts ist voll. Platz schafft
  nur Löschen …".
- **Datenschutzfrist (R8-D3):** Entwurf mit 70 Tagen Alter: keine Meldung; mit
  80 Tagen auf Startseite und im Assistenten „Namen werden am 3.11.2026
  anonymisiert (noch 10 Tage) — vorher weitergeben oder sichern; Bearbeiten
  beginnt die Frist neu"; mit 91 Tagen „Datenschutzfrist abgelaufen …". Sammlung
  mit 80 Tagen: „Wird in 10 Tag(en) automatisch gelöscht … exportiere sie
  jetzt"; mit 95 Tagen: „Automatisch gelöscht: …" und leerer Speicher.
- **Seite „Papier oder digital?":** nennt „Ausfallsicherheit … braucht ein
  geladenes Gerät. Deshalb: druck das PDF und führ Papier mit"; die Aussage
  deckt sich mit dem Befund (PDF mit Bogen und Code, auch offline erzeugbar).

## Analog-/Digital-Übergabematrix

| Prozessschritt | Digitaler Nutzen | Analoger Fallback | Sauberer Wiedereinstieg in Digital |
|---|---|---|---|
| Bogen der Einheit ausfüllen | Vorlage, StAN-Vorbelegung, Summen, Prüfhinweise | Blanko aus der App (2 Seiten, auch ohne Netz), Beiblatt-Regel | „Einheit manuell erfassen…" mit „Eingetroffen um", „Nr. laut Zettel", „Zug / Verband"; Nr.-Konflikt wird gemeldet |
| Bogen übergeben | QR (1 bis n Teile), Link, Datei | Einzel-PDF mit Bogen, Meldekopf-Zeile je Seite, „[ ] von Hand geändert"; bei großen Einheiten 7 Codeseiten (R9-A6) | Seitenbilder über „Bögen einlesen…"; Bericht nennt Bilder ohne Code; Handänderungen nur über „Lage vom Papier abgleichen…" |
| Lage führen | Summen, Zwischensummen je Zug, Lagemonitor, Lageblatt nach Nr. | Lageblatt mit Nachtragszeilen, „Aushang nicht mehr aktuell"-Zeile | Nachtrag vom Zettel; Sollstärke bleibt als solche erkennbar (Lageblatt ja, CSV/Excel nur über Hinweise, R9-A2; Rückruf der Soll-Einheit, R9-A3) |
| Geräteausfall Meldekopf | „Einsatz weitergeben / sichern" als Datei | Letzte Sammel-PDF und Lageblatt | Sammel-PDF als Datei oder 19 Seitenbilder: Einheiten, Marke und Nr. kommen zurück; Doppelte werden erkannt |
| Beschädigter Speicher | Beiseitelegen, Zähler, „Daten sichern…" | Sammel-PDF, Lageblatt, Einzelbögen | Rohtext steckt in Sicherung und `eeb.unlesbar.v1`, aber nicht lesbar in der App; Banner nennt Papier-Rückweg nicht (R9-A1) |
| Speicher voll / Browser sperrt | Hinweis „Nicht gespeichert" mit Handlung | Meldeblock; PDF des Bogens | Nachtrag nach Platzschaffen; Stärke steht auf dem Block |
| Datenschutzfrist | Ankündigung 14 Tage vorher, Sammlung „wird in n Tagen gelöscht" | Gedruckter Bogen und Sammel-PDF bleiben | Vor Ablauf weitergeben oder sichern; danach nur Papier und anonymisierter Bogen |

## Würde ich dafür das Papier weglegen?

Für den Wiederanlauf nach einem Geräteausfall ja, mit zwei Gegenproben: Ist der
Speicher beschädigt, lege ich es nicht weg, bis ich weiß, dass es eine gedruckte
Sammel-PDF oder ein Lageblatt gibt, denn die App sagt mir das nicht (R9-A1). Und
eine Einheit, die ich als Sollstärke abgelegt habe, streiche ich auf dem Papier
an, bevor ich ihren Rufnamen funke (R9-A3). Was ich auf dem Meldeblock führe
(Nr., Zug, Eintreffzeit, Notiz, Status), kommt über den Abgleich vollständig
zurück, und was ich nicht weiß, steht als „nicht bestätigt" da. Der Probedruck
von Rändern und 6,9-pt-Tabelle bleibt offen, weil er sich hier nicht prüfen
lässt.

## Abgleich mit Runde 8

Grundlage: [../runde-8/analog-first.md](../runde-8/analog-first.md) samt „Stand
der Behebung" ([../runde-8/README.md](../runde-8/README.md)).

| Runde-8-Befund | Stand laut Tabelle | Bewertung Runde 9 | Beobachtung |
| --- | --- | --- | --- |
| R8-A1 Sollstärke zählt mit, Marke fehlt auf Blatt (P2) | teilweise (zählt weiter mit, Marke in Karte, Tabelle, Lageblatt, Sammel-PDF, „davon n Sollstärke") | **hält, bekannte Grenze (zählt mit, mit Marke); Rest in CSV/Excel** | Marke an zugeklappter Karte, Tabelle, Lageblatt-Zeile und -Summe, Sammel-PDF (Übersicht und Bogenseite) und nach dem Rückweg; Kopfzeile „zählt in der Summe mit, bis eine Zahl vorliegt". CSV, „Alle Daten" und Excel ohne das Wort (R9-A2); Rufname der Soll-Fahrzeuge unmarkiert (R9-A3). |
| R8-A2 CSV ordnet nach Name, Lageblatt nach Nr. (P3) | behoben | **hält für die CSV; Excel offen** | Übersicht-CSV und „Alle Daten" nach Nr. 1–7. Excel-Liste nach Typ/Ort, ohne Nr. (R9-A2). |
| R8-A3 Papierfeld „????????" (P3) | behoben | **hält, mit Rest** | Feld „Ansprechpartner/in": „Vladimir Lehmann (Umschrift)". In der Personalliste bleibt „Lehmann, ????????", dieselbe Person. |
| R8-H1 (Verweis) abgeschnittener Gesamttext wird still zu `[]` | behoben | **hält, mit Rest** | `eeb.unlesbar.v1.texte` gefüllt, Banner, zweite Beschädigung hängt an, Sicherung trägt den Rohtext. Der Banner nennt den Papier-Rückweg nicht (R9-A1). |
| R8-N5 (Verweis) Zug-Schreibweisen | behoben („n. Zug") | **hält, Rest bekannt** | „2. zug"/„2.Zug" → „2. Zug", „Zug 3" → „3. Zug"; „1.tz"/„1. TZ"/„1.TZ" → „1. tz" (Schreibweise der ersten Eingabe), „erster zug" eigener Zug. |
| R8-D3 (Verweis) Anonymisierung ohne Ankündigung | behoben | **hält** | Ankündigung ab 14 Tage vorher, bei 80 Tagen „noch 10 Tage". |
| R8-H5/S4 (Verweis) Prellschutz | teilweise (450/800 ms) | **bekannte Grenze, Stand unverändert** | Erster Tipp auf „Einheit manuell erfassen…" 500/900 ms nach Öffnen der Sammlung ohne Wirkung, 1 200 ms wirkt. Die Knöpfe der Rückfrage „Stärke nicht gezählt" bediente ich erst 1,2 bis 1,8 s nach dem Öffnen; ihre Wartezeit habe ich nicht gemessen. |

Bilanz: Alle drei Runde-8-Befunde der Rolle halten, zwei mit Rest (R8-A2 beim
Excel, R8-A3 in der Personalliste), R8-A1 als bekannte Grenze mit Rest in den
Tabellenformaten. Nebenwirkungen der Runde-8-Änderungen auf diese Rolle: keine
gefunden; die Rohtext-Rettung, die Marke und die Umschrift stören den
Papierweg nicht. Weitere bekannte Grenzen (R6-O9, R7-G4/M8, R7-G8/H9, R7-N1,
R7-N9, R8-M6) habe ich im Papierweg nicht berührt; der Papierweg bleibt bei 360 × 640,
320 × 568, 640 × 360, 200 % und 180 × 320 ohne seitlichen Überlauf bedienbar
(Knöpfe 44–57 px hoch bei 360 × 640, bei 200 % bis 118 px).

## Abschluss

- **Aufgabe geschafft:** Papier erzeugen: ja. Nachtrag vom Meldeblock mit Nr.,
  Zug und Zeit: ja. Wiederanlauf nur vom Papier: ja.
- **Fremde Hilfe nötig:** nein.
- **Größtes Missverständnis:** „Die Daten stecken in der Datensicherung" liest
  sich wie „wiederherstellbar", obwohl die App den beiseitegelegten Text nicht
  liest und der Papier-Rückweg nicht genannt wird (R9-A1).
- **Größtes Einsatzrisiko:** Ein Helfer mit beschädigtem Speicher hält die Lage
  für verloren, obwohl Sammel-PDF oder Lageblatt sie in zwei Minuten
  zurückbringen (R9-A1); danach der unmarkierte Rufname einer Soll-Einheit auf
  dem Wandblatt (R9-A3).
- **Top-Priorität für die nächste Iteration:** Im Banner zum beiseitegelegten
  Text den Papier-Rückweg nennen („Einsatz importieren…" mit Sammel-PDF,
  „Bögen einlesen…" mit Lageblatt-Fotos) (R9-A1).

**Zählung:** P0 0 · P1 0 · P2 1 · P3 5.
