# Audit „Führungssicht", Runde 16 (Lage führen, Lagemonitor, Stand übergeben)

Prüfer: Rollenaudit `thw-command-reviewer` · Datum: 2026-10-26 ·
Prüfgegenstand: Web-App im Produktionsbuild (`vite preview`, Port 4173),
Code-Stand Commit `36d549a` (`main` nach Runde 15).

Zählung: **P0: 0 · P1: 0 · P2: 1 · P3: 3** (4 Befunde)

Reiner Prüfbericht, keine Codeänderung. Nicht neu gemeldet sind die Grenzen aus
`docs/audits/README.md` und den Runden 10 bis 15 (darunter R10-K4 Lagemonitor
zeigt bei großen Lagen nur wenige Zeilen, R11-S4, R11-H2, R11-K2, R11-A2,
R11-A5, R11-M1, R11-M3, R12-W3, R12-H3, R12-O2, R12-O4, R12-G3, R13-W1, R13-W6,
R13-H1, R14-E7, R14-S2, R14-H1, R14-W3, R15-E1, R15-E2, R15-D4, R15-S4,
R15-M2, R15-O1). Befunde anderer Berichte dieser Runde (R16-D1 Ortssperre ohne
Rückmeldung, R16-W1 stehende Quittungsleiste, R16-N2 doppelter Einsatz auf der
Startseite, R16-A1 Excel/CSV ohne Einsatznamen) sind nicht doppelt aufgeführt.

## Prüfaufbau

Playwright (Chromium, `chromium.launch()` ohne Optionen, globales
Playwright-Modul), Locale de-DE, Zeitzone Europe/Berlin, `isMobile`/`hasTouch`,
Telefon 390x844 und 360x640; der Lagemonitor zusätzlich bei 1280x720 und
1280x420. Zustand: Sammlung „Hochwasser Neckar · BR Sporthalle Rottenburg",
sechs Bögen aus `examples/thw/` über „Bögen einlesen…" aufgenommen (`uebung:
false`, Ort angepasst), Stand der Angaben vor 1, 2, 3, 95, 400 und 840 Minuten.
Dazu: gesammelte Zugzuordnung („1. Zug"), je Karte „2. Zug", Auftrag, Sortierung
und Suche, Abrücken mit Neuladen, „Zur Kenntnis genommen" mit Rückgängig,
Folgemeldung (Datei mit Stärke 11 auf 8, Diesel 50 auf 20 l, Ruhezeit ja auf
nein) mit Historie und „Änderungen", Tabelle bei 360x640 und 390x844,
Lageblatt (PDF, mit `pdftotext` und `pdftoppm` gelesen, 2 Seiten), Lagemonitor
(`?lagemonitor=<id>`) mit Funkrufname und „Jetzt", „Einsatz weitergeben /
sichern" und Einlesen der Sammel-PDF auf einem zweiten, leeren Gerät (dort mit
um 45 Minuten vorgestellter Uhr), Startseite. Die Uhr wurde für Zeitsprünge mit
der Playwright-Uhr verstellt (Alter „vor 19 Min", „vor 24 Min").

Nicht prüfbar: echter Fernseher, Vollbild, Drucken, Kamera.

## Urteil

Die Lage ist ohne fremde Hilfe zu lesen, zu pflegen und zu übergeben. Die
Behebungen aus Runde 15 für die Führungssicht halten im echten Browser. Reibung
bleibt an Stellen, an denen die Software ihren Sammelbegriffen und Kurzfassungen
mehr zutraut als eine Führungskraft im Vorbeigehen entschlüsseln kann, und an
einer Lücke im Einsatzkopf (Name und Ort lassen sich nach dem Anlegen nicht mehr
ändern).

Geprüft und in Ordnung (Behebungen aus Runde 15):

- R15-K1: Sortierung „Älteste Angaben zuerst" ordnet nach dem Stand der Angaben:
  Nr. 5 (15 Std 2 Min), Nr. 4 (7 Std 42 Min), Nr. 3 (2 Std 37 Min), Nr. 2, Nr. 1,
  Nr. 6. „Zuletzt gemeldet (neueste zuerst)" liefert genau die Gegenrichtung,
  „Zug" gruppiert („1. Zug" vor „2. Zug").
- R15-K2: Lagemonitor führt ⚠-Einheiten zuerst („+ 5 weitere Einheiten · ⚠ und
  zuletzt gemeldete zuerst"), bei 1280x720 steht die älteste Meldung (⚠ Stand
  15 Std 5 Min) als erste Zeile.
- R15-K3: Zwischensummen nach Zug nennen Ruhezeit je Zug (Zug 1: 2 Einheiten,
  Zug 2: 1 Einheit) und gehen auf: Verpflegung 31 + 22 = 53, Unterbringung
  11 + 12 = 23, Diesel 260 + 260 = 520 l, Benzin 80 + 80 = 160 l, Fahrzeuge
  10 + 6 = 16, Ruhezeit 2 + 1 = 3. Das Lageblatt führt die Spalte „Ruhezeit".
- R15-K4: Im Lagemonitor trägt nur „älteste Meldung vor 15 Std 2 Min, 6 von 6
  älter als 1 Std" die Warnfarbe, „letzte Meldung gerade eben" bleibt normal.
- R15-K5: Der Auftrag steht im Lagemonitor bei 390x844 und 360x640 unter dem
  Funkrufnamen („Keller Altenheim auspumpen, danach Pegel Süd"), die Seite
  scrollt (1006 und 1047 px Inhalt).
- R15-H2: Funkrufname im Monitor ohne Klammerzusatz („Heros Rottenburg 10/1").
- Abrücken: Quittung „Abgerückt 18:04: Nr. 5 …" mit „Rückgängig", Zeit, Zug und
  Abgerückt-Zustand überleben das Neuladen; Kopf und Summen zählen danach 5
  Einheiten (41 Stärke), das Lageblatt führt die Einheit im Block „Abgerückt (1)".
- Folgemeldung: Karte „neue Fassung", „Folgem. 18:25 · 11 → 8", die Marke bleibt
  nach „Zur Kenntnis genommen" und nach Neuladen stehen; „Historie" nennt „Gegenüber
  der Meldung vom …", die geänderten Werte und die nicht mehr gemeldeten Personen.
- Übergabe: Die Sammel-PDF auf einem zweiten Gerät („Einsatz importieren…")
  ergibt „Einsatz … übernommen: 6 Einheiten, davon 5 anwesend", Zug, Auftrag und
  Abrückstatus kommen an. Die ursprüngliche Eintreffzeit bleibt erhalten (Quelle
  „eingetroffen 18:27", Ablösung mit Uhr +45 Min ebenfalls „18:27", „letzte
  Meldung 18:27 (vor 45 Min)"); Abrücken verändert „letzte Meldung" nicht.
- Suche: „47/43", „Heros Freiburg" und „2. Zug" treffen die richtige Einheit.
  Es gibt Filter für Auftrag/Zug und Status („nur ⚠ ältere als 1 Std").

## Befunde

### R16-K1 [P2] Name und Ort des Einsatzes lassen sich nach dem Anlegen nicht mehr ändern, und „Ort / Auftrag" ist beim Anlegen optional, später aber nicht nachtragbar

**Ort:** Einsatzansicht („Hochwasser Neckar" im Kopf, „Einsatz verwalten"),
Startseite (Karte des Einsatzes mit „Öffnen" und „Löschen…"), „Neue
Einsatz-Sammlung…".

**Beobachtung (gemessen, 390x844 und 360x640):** Beim Anlegen fragt der Dialog
nach „Name" (Pflicht) und „Ort / Auftrag (optional)". In der angelegten Sammlung
gibt es weder an der Überschrift noch im Abschnitt „Einsatz verwalten" noch auf
der Startseite einen Knopf zum Umbenennen oder Bearbeiten. Eine Suche in der
Einsatzansicht und auf der Startseite nach Knöpfen und Feldern mit „ändern",
„bearbeiten", „umbenennen", „Name", „Ort" findet nur die Einheiten-Funktionen
und die Suche. „Einsatz verwalten" enthält ausschließlich „Einsatz löschen…".
Einheiten lassen sich je Karte über „Mehr… › Verschieben…" in einen anderen
Einsatz legen, bei sechs Einheiten sechs Mal.

**Erwartung der Rolle:** Der Einsatzname und der Einsatzort stehen am Meldekopf
oft erst nach den ersten Minuten fest („Hochwasser Weser" wird zu „Hochwasser
Neckar", der Abschnitt wird bekannt). Die Führungskraft erwartet, sie am Kopf der
Sammlung nachzutragen oder zu berichtigen.

**Folge:** Name und Ort stehen im Kopf der Ansicht, auf Lageblatt und Sammel-PDF
(Titel, Dateiname), im Lagemonitor und auf der Startseite. Ein Tippfehler oder
ein zu früh vergebener Name geht so in die Übergabe an die Ablösung und an den
Stab. Der Umweg (neuen Einsatz anlegen, jede Einheit einzeln verschieben, alten
löschen) kostet bei 30 Einheiten rund 30 Dialoge in einer Lage, in der niemand
dafür Zeit hat. Ein leer gelassener Ort bleibt bis zum Ende leer.

**Empfehlung:** Name und Ort/Auftrag der Sammlung am Kopf der Einsatzansicht
änderbar machen (ein Stift oder „Einsatz bearbeiten" in „Einsatz verwalten"),
mit Quittung und Rückgängig wie bei den übrigen Änderungen.

**Nachprüfung:** Einsatz anlegen, danach Name ändern und Ort eintragen: Kopf,
Startseite, Lageblatt, Sammel-PDF und Lagemonitor zeigen den neuen Wert, die
Einheiten, Zeiten und Aufträge bleiben erhalten.

### R16-K2 [P3] Die Kurzzeile einer Folgemeldung nennt die abgeleitete Verpflegung und versteckt Ruhezeit und Unterbringung hinter „1 weitere Änderung"

**Ort:** Einsatzansicht, Block „Neu seit der letzten Kenntnisnahme", nach dem
Einlesen einer Folgemeldung.

**Beobachtung (gemessen):** Eine Folgemeldung der Einheit Nr. 2 (Stärke 11 auf 8,
Verpflegung 11 auf 8, Diesel 50 auf 20 l, Ruhezeit erforderlich ja auf nein,
Unterbringung M 8 / W 3 auf M 6 / W 2) steht als: „THW Biberach/Riß
Fachgruppe Ortung (B) — Folgemeldung 18:05: Stärke 11 → 8 (−3) · Verpflegung 11
Personen → 8 Personen · Diesel 50 l → 20 l · 1 weitere Änderung". Die Historie
der Einheit („Änderungen") nennt unter „Sofortbedarf" vier Zeilen: Verpflegung,
Diesel, „Ruhezeit erforderlich: ja → nein" und „Unterbringung M/W/D". Auf der
Karte fehlt danach die Marke „Ruhezeit" ohne Hinweis, dass sie entfallen ist.

**Erwartung der Rolle:** Die Kurzzeile nennt, was eine Entscheidung verändert:
Die Verpflegung folgt rechnerisch aus der Stärke und wiederholt sie. Der Wegfall
der Ruhezeit oder der Unterbringung (Planung von Ablösung und Unterkunft) gehört
vor die Verpflegung.

**Folge:** Wer nur die Kurzzeile liest und „Zur Kenntnis genommen" tippt, hat die
Änderung der Ruhezeit nicht gesehen. Sie steht nur in der Historie der Einheit,
zwei Aufklapper und zwei Knopftipps entfernt. Nichts geht verloren, der
Kenntnisnahme fehlt aber die Grundlage.

**Empfehlung:** In der Kurzzeile die Änderungen nach Entscheidungsrelevanz
ordnen (Stärke, Ruhezeit, Unterbringung, Betriebsstoff) und die rechnerisch
abgeleitete Verpflegung nur nennen, wenn sie von der Stärke abweicht. „1 weitere
Änderung" benennen („Ruhezeit entfällt").

**Nachprüfung:** Folgemeldung mit geänderter Ruhezeit einlesen: Die Kurzzeile
nennt „Ruhezeit ja → nein", ohne die Historie zu öffnen.

### R16-K3 [P3] „6 Einheiten ohne Einzelsatz, siehe Liste" ist für eine Führungskraft nicht zu entschlüsseln

**Ort:** Einsatzansicht, Block „Neu seit der letzten Kenntnisnahme" ab sechs
neuen Einheiten (Kurzfassung).

**Beobachtung (gemessen):** Nach dem Einlesen von sechs Bögen lautet der Block:
„Neu seit der letzten Kenntnisnahme (6): Zur Liste springen ↓ · 6 Einheiten ohne
Einzelsatz, siehe Liste · Alle 6 einzeln anzeigen · Zuletzt gemeldete oben
zeigen · Zur Kenntnis genommen". Der Satz sagt nicht, was „Einzelsatz" ist
(eine Zeile je Einheit, die nicht angezeigt wird) und nicht, ob die sechs
Einheiten neu eingetroffen sind oder sich geändert haben. Mit fünf neuen
Einheiten steht dagegen je Einheit eine Zeile „… — neu gemeldet".

**Erwartung der Rolle:** „6 Einheiten neu gemeldet, Einzelzeilen ausgeblendet"
oder „6 neue Einheiten (Erstmeldungen)". „Einzelsatz" ist ein Wort der
Software, nicht der Führungsstelle.

**Folge:** Gering: Der Link „Alle 6 einzeln anzeigen" erklärt es nach dem
Tippen. Die Zeile kostet beim ersten Lesen einen Moment, gerade nach einem Stapel
Einlesen, wenn die Aufmerksamkeit knapp ist. Ob „ohne Einzelsatz" auch
Folgemeldungen einschließt, bleibt ohne Tippen offen.

**Empfehlung:** Wortwahl ändern („6 Einheiten neu gemeldet — Zeilen je Einheit
ausgeblendet") und Neumeldungen und Folgemeldungen getrennt zählen.

**Nachprüfung:** Sechs Bögen einlesen: Die Zeile nennt „neu gemeldet" und, bei
einer zusätzlichen Folgemeldung, „1 Folgemeldung" getrennt.

### R16-K4 [P3] Lageblatt: Bedarf je Kostform, WC/Dusche, Betriebsstoff und Zwischensummen nach Zug stehen auf der Rückseite unter 12 leeren Nachtragszeilen

**Ort:** „Lageblatt (A4 quer)", 2 Seiten bei fünf anwesenden und einer
abgerückten Einheit in zwei Zügen.

**Beobachtung (gemessen, PDF mit `pdftotext` und als Bild gelesen):** Seite 1 trägt
Kopfzeile („Lage: 5 Einheiten zählend · Stärke … · 13 Fahrzeuge"), eine
Bedarfszeile mit Gesamtzahlen („Verpflegung 41 · Unterbringung angefordert: 2
Einheiten, 23 Personen … · Ruhezeit: 2 Einheiten · Diesel 440 l · Benzin 80 l"),
die Warnzeile, die Tabelle, „Abgerückt (1)", die Summe und zehn Nachtragszeilen.
Seite 2 beginnt mit zwölf weiteren Nachtragszeilen und „Summe einschl. Nachträge
(von Hand)"; darunter folgen die Fußnote und erst dann „Bedarf gesamt" (Kostform
30 Fleisch / 8 vegetarisch / 3 vegan, WC/Dusche, Betriebsstoff) und
„Zwischensummen nach Zug" mit Warnung je Zug und der Spalte „Ruhezeit". Der
Bericht Runde 15 hielt fest, Seite 1 ende mit Summe und Zugsummen; bei dieser
Lage (zwei Züge, eine abgerückte Einheit) ist das nicht so.

**Erwartung der Rolle:** Das Blatt, das an die Wand oder zur Ablösung geht,
zeigt die Züge: wie stark ist der 2. Zug, wo ist die älteste Meldung, wer braucht
Ruhezeit.

**Folge:** Wer nur Seite 1 aushängt, hat die Zugsummen nicht. Mit zwei Zügen
und einem Zug mit Warnung („! älteste Meldung vor 15 Std 4 Min") bleibt die
Tabelle der einzige Hinweis, Zug für Zug von Hand zu addieren. Nichts fehlt im
Ausdruck, er liegt aber hinter dem leeren Raster der Rückseite.

**Empfehlung:** Zwischensummen nach Zug (und, platzbedingt gekürzt, die
Kostform) vor das Nachtragsraster setzen, oder das Raster nach hinten ziehen, so
dass Seite 1 mit den Zugsummen endet und das leere Raster die Rückseite füllt.

**Nachprüfung:** Lageblatt mit zwei Zügen und einer abgerückten Einheit erzeugen:
Seite 1 endet mit „Zwischensummen nach Zug", die Rückseite enthält nur das
Nachtragsraster.

## Abschluss

- **Aufgabe geschafft:** ja
- **Fremde Hilfe nötig:** nein
- **Größtes Missverständnis:** „ohne Einzelsatz" wird als „ohne Angabe" statt
  als „Zeilen je Einheit ausgeblendet" gelesen (R16-K3).
- **Größtes Einsatzrisiko:** Eine Änderung mit Folgen für die Planung (Ruhezeit
  entfällt) steht nicht in der Kurzzeile, auf der die Kenntnisnahme beruht
  (R16-K2).
- **Top-Priorität für die nächste Iteration:** R16-K1: Name und Ort des Einsatzes
  nachträglich änderbar machen.
