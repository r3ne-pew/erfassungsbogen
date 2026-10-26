# Audit „Arbeitsablauf", Runde 11 (Einheit → Meldekopf → zweites Gerät)

Prüfer: Rollenaudit `thw-workflow-reviewer` · Datum: 2026-10-25 · Prüfgegenstand:
Web-App, Produktionsbuild (`vite preview`, Port 4173), Stand `main` nach Runde 10
(Commit `21647db`).

**Zählung: P0 0 · P1 0 · P2 2 · P3 3**

Reiner Prüfbericht, keine Codeänderung. Nicht erneut gemeldet sind die bekannten
Grenzen (R6-O9, R7-G4/M8, R7-G8/H9, R7-N1, R7-N9, R8-A1, R8-M6, R9-M3, R9-G5,
R8-H5/S4) und die Reste aus Runde 10 (leere Karten bei „Nur Stärke", Rückgängig
für Meldungen überlebt das Neuladen nicht, Tabellenzeilenhöhe bei 180 × 320).

## Prüfaufbau

Playwright (`require('playwright')` aus dem globalen Modulverzeichnis, weil die
Projektkopie eine nicht installierte Chromium-Revision verlangt; `chromium.launch()`
ohne Optionen, nichts installiert), `isMobile`/`hasTouch`, Locale de-DE,
Viewports 390 × 844 und 360 × 640, eigener Kontext je Gerät, Tipp-Sperre von
0,9 s eingehalten. Geräteuhr 25.10.2026. Der Link-Weg ersetzt den QR-Transport
(`navigator.share` gestubbt, Host auf `localhost:4173` umgeschrieben); PDFs und
CSV wurden gespeichert und mit `pdftotext` gelesen. Nicht prüfbar: Kamera-Scan,
Nahbereich, echte Handschuhe, Bildschirmtastatur; „Bogen als PDF" an der Karte
öffnet im Headless-Lauf einen Tab, der bei „Bogen wird erzeugt…" stehen bleibt
(keine Aussage möglich, kein Befund).

Erwartete Arbeitsfolge (**Annahme** zum realen THW-Ablauf, nicht bekannt):

1. Die Einheit füllt ihren Bogen am Telefon aus, hinterlegt Name und Rückkanal und
   übergibt per Link, QR oder PDF.
2. Der Meldekopf legt eine Einsatz-Sammlung an, nimmt den Bogen auf, entscheidet
   bei einer Nachmeldung, ordnet Zug und Auftrag zu, lässt abrücken, druckt das
   Lageblatt und gibt den Einsatz zur Schichtablösung weiter.
3. Rückfragen an die Einheit laufen über den Rückkanal aus dem Bogen.

Durchlaufen: Einheit von vorn bis zur Übersicht (Schritte 1 bis 6), Neuladen,
Schließen, „Zuletzt geschlossenen Bogen zurückholen", Vorlage speichern und
„Einsatz vorbereiten", Übergabe-Dialog, QR-Vollbild bei 360 × 640, Änderung nach
der Übergabe; am Meldekopf: Sammlung anlegen, Link-Kaltstart ohne und mit
Sammlung, Aufnahme, Nachmeldung (anderer Auftrag, andere Person), Übungsbogen im
Einsatz, Zug, Auftrag, Abrücken, Lageblatt, CSV, Sammel-PDF und deren Import auf
einem zweiten Gerät (zweimal, Zusammenführung), „Aus Datei laden…" mit Sammel-PDF,
Scanner ohne Kamera, Einheit schnell erfassen, Namenliste einfügen, zwei Tabs
desselben Browsers.

## Urteil

Der Ablauf trägt. Hervorzuheben, weil es hält: der Einsatz-Kopf-Zustand nach
Neuladen, die Zwei-Tab-Synchronisation (ein veralteter Tab zeigt sofort den Stand
des anderen), die Nachmeldungs-Rückfrage mit „Bisher / Neu / Geändert" und
vorbelegtem Normalfall, die Warnung „Keine gemeinsame Person … vielleicht eine
andere Gruppe?", der Import der Sammel-PDF mit „1 neue Einheit. Jetzt 2 Einheiten",
der Hinweis beim Laden der Sammel-PDF über „Aus Datei laden…" („Die PDF enthält 2
Bögen … Alle auf einmal: „Einsatz importieren…""), „Übungsmeldung nicht gezählt —
anzeigen", „Neu geändert — neu übergeben, damit der Meldekopf den Stand hat" auf
der Einheit, die Namenliste mit Prüfung („kein Name?"). Ein Helfer schafft den
Weg ohne fremde Hilfe. Reibung entsteht an zwei Stellen, an denen die Einheit
etwas anderes meint, als der Meldekopf später sieht.

## Befunde

### R11-W1 [P2] Verpflegung zählt in der Lage für Einheiten, die keine angefordert haben

**Fundstelle / Aufgabe:** Einheit: Schritt 5 „Sofortbedarf erfassen" bleibt aus,
Übersicht, „Bogen übergeben…" → Link. Meldekopf: Kopfzeile „Bedarf:", Lageblatt,
„Übersicht als CSV".

**Beobachtung:** Schritt 5 sagt „nur anhaken, wenn die Einheit etwas anfordert";
die Übersicht der Einheit zeigt „Verpflegung —", „Sofortbedarf & Sonstiges" leer.
Am Meldekopf steht nach der Aufnahme derselben Meldung „Bedarf: Verpflegung 9 ·
Diesel 0 l", im Lageblatt „Bedarf: Verpflegung 9 · keine Unterbringung angefordert
· keine Ruhezeit", in der CSV „Verpflegung gesamt 9" bei leerer Spalte
„Sofortbedarf". Die Karte nennt unter „Details" für dieselbe Einheit „Verpflegung
—". Die 9 sind die Sollstärke der Vorbelegung (nur zwei Namen eingetragen). Für
Unterbringung und Ruhezeit trennt die App dagegen sauber „angefordert" und „nicht
angefordert".

**Erwartung der Rolle:** „Bedarf" heißt, was angefordert wurde. Wer nichts
angekreuzt hat, will nicht mitbestellt werden (Annahme: Selbstversorger sind im
Einsatz üblich).

**Folge:** Der Meldekopf bestellt Verpflegung für Einheiten, die sie nicht
angefordert haben, oder liest die Zahl als Kopfstärke und bestellt zu wenig bei
echter Anforderung. Dieselbe Zeile widerspricht der Karte („—").

**Empfehlung:** In Kopfzeile, Lageblatt und CSV trennen: „Verpflegung angefordert:
n" und „Verpflegungsstärke (nach Stärke): n"; oder Einheiten ohne Anforderung nur
mit der Stärke zählen und die Zahl so benennen.

**Verifikation:** Bogen ohne Häkchen in Schritt 5 aufnehmen; Kopfzeile, Lageblatt
und CSV nennen entweder 0 angefordert oder die Zahl ausdrücklich als Stärke.

### R11-W2 [P2] Name und Rufnummer der Einheit („Absender") kommen am Meldekopf nur in der CSV an

**Fundstelle / Aufgabe:** Startseite „Name/Kontakt hinterlegen…" → Bogen
übergeben → Meldekopf nimmt auf → Karte, „Details", „Historie", Tabelle, Lageblatt,
Sammel-PDF.

**Beobachtung:** Absender „Hans Beispiel · 0170 5551234" hinterlegt (die Übersicht
der Einheit zeigt ihn). Am Meldekopf steht er weder auf der Karte noch unter
„Details" oder „Historie", nicht in der Tabelle (Spalte „Stand der Meldung
(Absender)" zeigt nur die Uhrzeit), nicht im Lageblatt und nicht in der
Sammel-PDF (`pdftotext`, Suche nach „Hans" und „0170" ohne Treffer, auch nicht im
DOM). Nur die CSV „Alle Daten" hat eine Absenderspalte. Die App verspricht das
Gegenteil: „Hinterlegte Angaben reisen mitsigniert in jedem QR-Code, Link und PDF
mit, damit die Gegenstelle bei Rückfragen weiß, wen sie erreicht." Bei der
Stichprobe mit 7 leeren Personenkarten gibt es sonst keine Rufnummer („Keine
telefonische Erreichbarkeit erfasst" steht in den Hinweisen).

**Erwartung der Rolle:** Die Nummer steht dort, wo der Meldekopf eine Rückfrage
stellt: an der Karte der Einheit.

**Folge:** Die Einheit hat Aufwand und Datenschutzbedenken („Personendaten,
sparsam ausfüllen") in Kauf genommen, der Meldekopf sieht nichts davon und
fragt am Funk oder gar nicht nach.

**Empfehlung:** Absender in der Karte (aufgeklappt) und im „Details"-Block zeigen,
im Lageblatt in „Funkrufname / Rückruf" mitführen, in der Sammel-PDF auf der
Bogenseite nennen.

**Verifikation:** Absender hinterlegen, Bogen übergeben, am Meldekopf aufnehmen:
Name und Nummer an Karte, Lageblatt und Sammel-PDF auffindbar.

### R11-W3 [P3] Ein offener Editor schluckt den ersten Tipp auf die nächste Aktion der Karte

**Fundstelle / Aufgabe:** Meldekopf, aufgeklappte Karte: „Auftrag/Notiz" oder „Zug
zuordnen" geöffnet und ausgefüllt, dann gleich „Zug zuordnen" bzw. „Abrücken".

**Beobachtung:** Text im Feld „Auftrag/Notiz" eingetragen, danach „Zug zuordnen"
getippt (mit mehr als 1 s Abstand): Der Text wird gespeichert und der Editor
schließt, der Zug-Editor öffnet nicht; erst ein zweiter Tipp öffnet ihn. Genauso:
Zug „2. Zug" eingetragen, „Abrücken" getippt: der Zug wird gespeichert, die Einheit
bleibt anwesend („kürzlich eingetroffen", „1 gemeldet · 1 zählend"); erst der zweite
Tipp rückt ab.

**Erwartung der Rolle:** Der Tipp auf „Abrücken" rückt ab; Speichern gehört dazu.

**Folge:** Gering. Ein Meldekopf, der mit nur einem Tipp rechnet, glaubt die
Einheit abgerückt, und die Anwesenheitszahl stimmt weiter. Die Karte zeigt aber
unmissverständlich noch „Abrücken".

**Empfehlung:** Den Tipp nach dem Speichern ausführen oder den Editor erst mit
„Speichern" verlassen lassen (Knopf deaktiviert, solange offen).

**Verifikation:** Editor ausfüllen, „Abrücken" tippen: Zug gespeichert und
abgerückt in einem Tipp.

### R11-W4 [P3] Vorbelegter Funkrufname eines vollständigen Bogens steht unmarkiert im Lageblatt

**Fundstelle / Aufgabe:** Einheit: Schritt 4 nie bearbeitet (Tab „4 offen"),
Übergabe. Meldekopf: Lageblatt, Spalte „Funkrufname / Rückruf", „Details" →
Fahrzeuge.

**Beobachtung:** Schritt 4 liefert nach Wahl von „Bergungsgruppe" einen GKW mit
Funkrufname „Heros", „eigener Standort" und Kennzahlen „22/51" (vorbelegt, Haken
„Ausstattung nach StAN: ja"). Das Lageblatt führt „Heros Oldenburg 22/51" ohne
„(Vorbelegung)". Das Kennzeichen fehlt, die Hinweise sagen es („Kennzeichen fehlt
(2)"), der Funkrufname aber nicht. Runde 9 (R9-A3) und 10 haben das für Einheiten
„Sollstärke, nicht gemeldet" behoben; ein vollständig gemeldeter Bogen, dessen
Fahrzeugschritt unberührt blieb, trägt die Marke nicht.

**Erwartung der Rolle:** Was am Funk gerufen wird, kommt von der Einheit.

**Folge:** Gering: Der Meldekopf ruft einen Namen, den die Einheit nie bestätigt
hat (Annahme zur Kennzahl: sie ist ein Schema-Wert, nicht die reale Zuteilung).

**Empfehlung:** Marke „(Vorbelegung)" auch dann, wenn die Fahrzeugzeile noch keine
eigene Angabe trägt (Kennzeichen, Sitzplätze, Sondergerät leer).

**Verifikation:** Bogen mit unberührtem Schritt 4 übergeben, Lageblatt lesen:
Funkrufname als Vorbelegung gekennzeichnet.

### R11-W5 [P3] „Vorlage … mustern" ist kein Wort der Helfer

**Fundstelle / Aufgabe:** Übersicht → „Als Vorlage speichern" (Dialogtext);
Wahl nach Abwahl von Personen („Weiter mustern").

**Beobachtung:** „Die Vorlage bleibt auf diesem Gerät und lässt sich für den
nächsten Einsatz mustern." Der Knopf in der Rückfrage heißt „Weiter mustern". Auf
der Startseite heißt dasselbe „Einsatz vorbereiten: …". Annahme: „mustern" kennt
der Helfer im Sinne von „genau ansehen", nicht von „verwenden".

**Erwartung der Rolle:** „…lässt sich für den nächsten Einsatz laden/verwenden";
Knopf „Weiter auswählen".

**Folge:** Gering: Der Dialog liest sich holprig, der Weg zur Vorlage („Einsatz
vorbereiten") steht erst auf der Startseite.

**Empfehlung:** Satz mit dem Wort „Einsatz vorbereiten" schreiben („Auf der
Startseite unter „Einsatz vorbereiten" wieder aufrufen").

**Verifikation:** Dialog speichern, Text nennt den Weg auf der Startseite.

## Ergebnis

- **Aufgabe geschafft:** ja
- **Fremde Hilfe nötig:** nein
- **Größtes Missverständnis:** „Sofortbedarf nicht angekreuzt" heißt für die
  Einheit „nichts angefordert", für den Meldekopf trotzdem „Verpflegung 9".
- **Größtes Einsatzrisiko:** Der Meldekopf bestellt oder ruft nach Zahlen und
  Namen, die die Einheit nie so gemeldet hat (R11-W1, R11-W4), und hat die
  Rückrufnummer nicht vor sich (R11-W2).
- **Top-Priorität für die nächste Iteration:** R11-W2 (Absender an der Karte und im
  Lageblatt), danach R11-W1 (Verpflegung „angefordert" von „nach Stärke" trennen).
