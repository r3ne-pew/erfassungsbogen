# Audit „Nacht und Sicht", Runde 10 (Dunkelheit, Blendung, Sonnenlicht, Farbcodierung)

Stand: 25.10.2026 · Prüfer: Rollenaudit `thw-night-visibility-reviewer` ·
Prüfgegenstand: Web-App einschließlich Lagemonitor, Produktionsbuild
(`vite preview`, Port 4173), Code-Stand Commit `441811c` (Zweig `main`).

Reiner Prüfbericht, keine Codeänderung. Wiederholung nach der Behebung der
Runde-9-Befunde. Blind geprüft habe ich Startseite, Bogen Schritt 1 bis 6,
Anzeige-Wahl, Einsatzansicht, Lagemonitor in allen drei Stufen (Telefon, quer,
Tablet, Fernseher), die Rückfrage „Sofortbedarf entfernen?", die Zahlenmeldung
im Sofortbedarf, die Meldung „Nicht lesbar" und die Schnellerfassung. Den
Bericht [Runde 9](../runde-9/nacht-und-sicht.md) und den Abschnitt „Stand der
Behebung" der [README](../runde-9/README.md) habe ich in der Mitte des Laufs
gelesen, nach dem Lagemonitor-Teil und vor der Prüfung von Musterung,
Plattformklassen, Druckansicht und Zahlenfeldern; diese Teile sind also gezielt
auf die Runde-9-Befunde hin geprüft. Berichte anderer Rollen habe ich nicht
herangezogen.

## Prüfaufbau

Chromium (Playwright aus `node_modules`, `/opt/pw-browsers/chromium`,
`--no-sandbox`), Locale de-DE, je Lauf ein eigener Browser-Kontext. Telefon
360 × 640 bei Pixelverhältnis 2 mit `isMobile`/`hasTouch` als Grundeinstellung,
dazu 320 × 568, 640 × 360 quer, Tablet 820 × 1180, Browser-Zoom 200 %
nachgestellt (180 × 320 bei Pixelverhältnis 4) und `html { font-size: 200% }`.
Der Lagemonitor zusätzlich ohne Touch auf 1280 × 720 und 1920 × 1080. Alle vier
Modi (Standard, Feld, Dunkel, Nacht); Kaltstart mit Systemeinstellung „dunkel"
und „hell" bei künstlich um 1,5 Sekunden verzögertem Bundle.

Zustände aus `localStorage`-Seeds, alle mit `uebung: false` (Ausnahme genannt)
und `stand` auf heute (25.10.2026):

- `eeb.entwurf.v1`: Großbogen „Verstärkter Bergungszug" (`examples/thw/`);
- `eeb.einsaetze.v1`: Sammlung „Hochwasser Musterstadt" mit sechs Meldungen;
  Varianten: zwei Einheiten mit namenlosem Personal (Sollstärke, 20 Personen),
  um drei Stunden gealterte Meldungen, `art: 1` (Übung);
- `eeb.vorlagen.v1`: eine über „Als Vorlage speichern" erzeugte Vorlage;
- `eeb.anzeigemodus.v1` (vier Werte), `eeb.lagestufe.v1`;
- `eeb.einsaetze.v1` mit beschädigtem Text (`{"kaputt":[1,2`);
- die Plattformklassen `platform-ios` und `platform-android` auf `<html>`
  nachgestellt.

Der Lagemonitor wurde über `?lagemonitor=s1` aufgerufen. Gemessen habe ich
Kontraste (Schriftfarbe gegen die tatsächlich darunterliegende Fläche, Deckkraft
der Vorfahren eingerechnet, WCAG-Formel), das mittlere Luma und den Anteil
heller Bildpunkte je Bildschirmfoto, Schriftgrößen, Lage und Größe von Elementen
(`getBoundingClientRect`, `scrollWidth`) und die Druckansicht
(`emulateMedia print`). Bildschirmfotos habe ich angesehen, nicht nur gerechnet.
Tipps auf die Stufentasten des Monitors habe ich als echte Touch-Tipps an den
Koordinaten der Taste gesetzt, weil Playwright bei `aria-disabled` sonst bis zum
Ende der Sperre wartet und so die Sperre verdeckt.

**Nicht prüfbar:** echtes Licht (Sonne, Arbeitsscheinwerfer, Rotlicht),
tatsächliche Displayhelligkeit, ein Fernseher im Fahrzeug (Abstand, Spiegelung,
Overscan), OLED-Schwarz, WebKit/Safari, die native Android-/iOS-Fassung, Kamera
im Dunkeln, tatsächlicher Ausdruck und PDF-Betrachter, Auswahlfenster des
Betriebssystems, `window.open` und „Vollbild" auf einem zweiten Bildschirm. Die
Zeitmessungen liefen unter Last durch elf parallele Prüfer.

Nicht nachgestellt, Stand unverändert angenommen: R6-O9, R7-G4/M8, R7-G8/H9,
R7-N1, R7-N9, R8-A1 (die Sollstärke zählt mit, jetzt mit Marke; im Monitor als
„⚠ davon 20 Sollstärke, nicht gemeldet" gesehen), R8-M6, R9-M3, R9-G5, R8-H5/S4.

## Urteil

Die Behebungen aus Runde 9 halten. Die fünf P3-Befunde der Runde 9 sind
beseitigt oder bis auf einen Rest an der nachgestellten iOS-Klasse verschwunden.
Die App ist nachts und in der Sonne in sehr gutem Zustand: Luma-Mittel Nacht
35 bis 36, Dunkel 43 bis 45, Feld 182 bis 193, Standard 187 bis 202. Kein aktiver
Text liegt in einem der vier Modi unter 4,5:1; darunter liegen nur deaktivierte
Bedienelemente (Pfeil „←" auf Schritt 1, Sortierpfeile, im Monitor die Taste
„Dunkler" in „Gedimmt" mit 2,94:1). Das gilt für Start, Schritt 1 bis 6, die
Einsatzansicht (Karten), den Sofortbedarf mit Zahlenmeldung, die Rückfrage
„Sofortbedarf entfernen?", die Meldung „Nicht lesbar" und die Schnellerfassung.
Zustände tragen Wort oder Zeichen („neu", „● Ruhezeit", „⚠ Anderer Einsatz?",
„✓", „offen" im Rahmen, „⚠ davon 20 Sollstärke, nicht gemeldet", „⚠ letzte
Meldung vor 3 Std 1 Min"); im Lagemonitor tragen die Warnungen Zeichen, Fettschrift
und Bernstein statt Rot. Die Druckansicht ist in Nacht und Dunkel schwarz auf
weiß (21:1). Der Kaltstart beginnt dunkel.

Der Lagemonitor am Telefon hat keine Schrift unter 14 px mehr (360 × 640,
320 × 568, mit und ohne 200 % Systemschrift), keinen Wortbruch bei 320 px und
keinen seitlichen Überlauf; auf 1280 × 720, 1920 × 1080, 640 × 360 und
820 × 1180 stehen alle sechs Einheiten im Bild. Die neue Sperre der Taste
„Heller" hält: Aus „Gedimmt" endet ein Doppeltipp nach 120 ms in „Dunkel", erst
ein Tipp nach 1,7 s führt auf „Hell"; „Dunkler" ist nie gesperrt.

Reibung gibt es an fünf Stellen: ein P2 bei Browser-Zoom 200 % (das Namensfeld
der Vorlage liegt unter der festen Fußleiste des Dialogs) und vier P3.

Die Aufgabe gelingt bei Nacht und in der Sonne ohne fremde Hilfe: Bogen
erfassen, übergeben, am Meldekopf sammeln, Lage zeigen.

## Befunde

Keine P0- und P1-Befunde. Ein P2-Befund, vier P3-Befunde.

### R10-L1 [P2] Dialog „Als Vorlage speichern" bei Browser-Zoom 200 % (180 × 320): das Namensfeld liegt unter der festen Fußleiste, sichtbar sind nur Beschriftung und Knopf

**Priorität:** P2

**Kennzeichnung:** gemessen (Rechteck, `elementFromPoint`), beobachtet
(Bildschirmfoto). Möglicher Zusammenhang mit R9-G5 (feste Leisten bei Zoom),
dort aber nur für Seitenleisten genannt; hier ein Dialog.

**Fundstelle / Aufgabe:** Bogen Schritt 6 „Übersicht" → „Als Vorlage speichern",
Browser-Zoom 200 % nachgestellt, Nacht (gleich in Standard).

**Beobachtung:** Der Rumpf des Dialogs (`.abfrage-rumpf`, `overflow: auto`) ist
154 px hoch bei 205 px Inhalt. Das Eingabefeld (44 px) beginnt bei y = 186 und
damit genau an der Oberkante der festen Knopfzeile („Vorlage speichern",
„Abbrechen"); `elementFromPoint` in der Feldmitte liefert den Knopf „Vorlage
speichern". Auf dem Bild stehen „Name der Vorlage" und direkt darunter der
amberfarbene Knopf, ein Feld ist nicht zu sehen. Der Fokus liegt im Feld, der
Rumpf wurde nicht nachgerollt. Einen Hinweis zum Rollen gibt es nicht. Bei
360 × 640 (Feld bei y = 301) und bei Standard ohne Zoom ist alles sichtbar.

**Erwartung der Rolle:** Das Feld, in das man tippen soll, steht im Bild, wenn der
Dialog aufgeht; mindestens rollt der Dialog es ins Bild.

**Folge:** Wer mit vergrößerter Anzeige (schlechte Sicht, Sonne) eine Vorlage
anlegt, sieht einen Namen verlangt, aber kein Feld; der Knopf „Vorlage speichern"
ist antippbar und speichert mit dem Vorgabenamen oder bricht ab, je nach Prüfung.
Ob die Vorlage dann den gewünschten Namen trägt, merkt man erst später.

**Empfehlung:** Dialog-Rumpf bei knappem Platz auf das Feld rollen, wenn es den
Fokus bekommt; oder bei kleiner Fensterhöhe die Knopfzeile nicht fest halten.

**Nachprüfung:** Browser-Zoom 200 % (180 × 320), Dialog öffnen: Eingabefeld
vollständig im Bild und nicht von der Knopfzeile überdeckt
(`elementFromPoint` liefert das Feld).

### R10-L2 [P3] Zahlenmeldung („auf ganze Personen gerundet", „Minus geht nicht") sieht aus wie ein Hilfetext

**Priorität:** P3

**Kennzeichnung:** gemessen (Farben, Größe), beobachtet (Bildschirmfoto).

**Fundstelle / Aufgabe:** Bogen Schritt 5 „Sofortbedarf & Sonstiges", Feld
„Verpflegung (Personen)", Eingabe „1,5" bzw. „-3".

**Beobachtung:** Die Meldung („„1,5" auf ganze Personen gerundet: 2." und „Minus
geht nicht — „-3" wurde nicht übernommen. Die Menge ohne Vorzeichen eintragen.")
steht in der Hilfetextfarbe (Nacht rgb(162,151,126) = 6,31:1, Standard
rgb(92,100,120) = 5,92:1, Dunkel 8,17:1), 13 px, ohne Zeichen. Sie sitzt in der
halben Spaltenbreite und bricht auf sieben Zeilen um (Nacht, 360 × 640). Das
Feld bekommt einen rosa bzw. roten Rand von 1 px (Feld-Modus 2 px) und
`aria-invalid`. Die Warnung desselben Schritts darüber („⚠ Sofortbedarf: mehr
Vegetarier/Veganer erfasst als …") trägt ⚠ und Fettschrift. Im Feld steht nach
der Ablehnung der alte Wert „2", nicht der getippte.

**Erwartung der Rolle:** Eine Meldung, dass die App eine getippte Zahl geändert
oder abgelehnt hat, sieht aus wie die anderen Warnungen der App (⚠, Auszeichnung)
und steht nicht im Ton der Hilfetexte.

**Folge:** Gering bis mittel: Bei schwachem Licht oder bei Sonne liest man das
Feld („2"), nicht die graue Zeile darunter; eine gerundete Personenzahl geht in
den Bogen. Die Zahl ist danach falsch um höchstens eine halbe Einheit je Eingabe,
das Risiko liegt bei Litern und Personen mit Komma.

**Empfehlung:** Zeichen und Auszeichnung wie bei den übrigen Warnungen; den
Rand nicht als einziges Merkmal am Feld lassen.

**Nachprüfung:** „1,5" eintippen: Meldung mit Zeichen und Auszeichnung wie
die Warnung des Schritts, auch im Graustufenbild vom Hilfetext unterscheidbar.

### R10-L3 [P3] Lagemonitor: „Optionen" mit der Helligkeitssteuerung sieht aus wie eine Überschrift, steht unter dem Bildrand und trägt kein Aufklappzeichen

**Priorität:** P3

**Kennzeichnung:** gemessen (Seitenhöhe, Lage der Tasten), beobachtet
(Bildschirmfoto).

**Fundstelle / Aufgabe:** Lagemonitor, Telefon 360 × 640, Stufe „Gedimmt" oder
„Hell". Code: `src/app/lagemonitor.css` (`.lm-klapp > summary` mit
`display: flex`).

**Beobachtung:** Die Taste „Dunkler" steht in den aufgeklappten „Optionen". Das
Feld „Optionen" erscheint als Rahmen mit dem Wort, ohne Dreieck und ohne
Rahmenhinweis; die Seite ist 688 px hoch bei 640 px Bildhöhe, nach dem Aufklappen
822 px, die Tasten liegen bei y = 530 bis 583 nach Rollen zum Ende (ohne Rollen
bei 664, unter dem Bildrand). In „Hell" (Luma 211, 80 % der Fläche über 180)
muss man also nach unten wischen und ein Feld ohne Aufklappzeichen antippen, um
„Dunkler" zu finden. Wer geblendet ist, sucht genau diese Taste. Die
Mehrfachtipps der Stufen selbst sind sicher (Sperre hält); den Weg dorthin
erkennt man nicht.

**Erwartung der Rolle:** Das Feld, hinter dem die Helligkeit steckt, erkennt man
als Taste, auch im Hellen.

**Folge:** Gering: Der Monitor startet nie hell (Nacht: „Gedimmt", sonst
„Dunkel"); „Hell" erreicht man nur durch zwei bewusste Tipps. Wer den Monitor
fremd übernimmt, braucht den Weg zurück.

**Empfehlung:** Aufklappzeichen („▸") am Feld „Optionen" und „Einsatzdaten";
auf dem Telefon die Stufenanzeige „Stufe: …" auch außerhalb des Felds sichtbar.

**Nachprüfung:** Lagemonitor in „Hell" bei 360 × 640: „Optionen" trägt ein
Zeichen und ist beim ersten Blick als antippbar erkennbar.

### R10-L4 [P3] Lagemonitor: die stärkere Stufe heißt „Dunkel", die dunklere „Gedimmt"

**Priorität:** P3

**Kennzeichnung:** gemessen (Luma, hellster Bildpunkt).

**Fundstelle / Aufgabe:** Lagemonitor, Optionen: „Stufe: Gedimmt / Dunkel / Hell".

**Beobachtung:** „Gedimmt" liegt bei Luma 24,9 (hellster Bildpunkt 195), „Dunkel"
bei Luma 33,4 (hellster Bildpunkt 255, reines Weiß `#fff` auf `#000`), „Hell" bei
211. Der Name „Dunkel" suggeriert die dunkelste Stufe; „Dunkler" ist in „Gedimmt"
deshalb gesperrt (gestrichelt, 2,94:1). Wer in „Dunkel" ein Bild für eine
Fahrzeugkabine sucht, tippt „Dunkler" und kommt nach „Gedimmt": das gelingt,
aber der Name führt nicht dorthin.

**Erwartung der Rolle:** Die Namen folgen der Helligkeit.

**Folge:** Gering: Die Reihenfolge ist nachvollziehbar, wenn man „Dunkler" und
„Heller" tippt statt die Namen zu lesen; die Namen kosten nur einen Blick.

**Empfehlung:** Namen nach der Helligkeit wählen („Nacht", „Dämmerung", „Tag")
oder die Stufenzahl mit angeben („Stufe 1 von 3").

**Nachprüfung:** Die Reihenfolge der Namen entspricht der Reihenfolge der
gemessenen Luma-Werte.

### R10-L5 [P3] Plattformstil iOS (nachgestellt), Nacht: Zusatzzeile „Letzte Meldung …" des Sammlungsknopfs auf der Startseite 4,32:1, Android 12 px

**Priorität:** P3

**Kennzeichnung:** beobachtet in nachgestellter Plattformklasse
(`platform-ios`, `platform-android` auf `<html>`); die native App nicht geprüft,
daher Risiko für den Gerätebetrieb. Rest von R9-L5 (Plattformstile).

**Fundstelle / Aufgabe:** Startseite, Knopf „„Hochwasser Musterstadt" öffnen",
Zusatzzeile „Letzte Meldung 25.10.2026, 10:14", Nacht.

**Beobachtung:** Unter `platform-ios` liegt der Knopf auf rgb(109,77,16) mit
Schrift rgb(217,205,182) bei 13 px: 4,32:1. Im reinen Web-Nacht-Modus steht
dieselbe Zeile dunkel auf Amber (rgb(16,13,7) auf rgb(168,121,26)) bei 4,54:1,
13 px, also an der Schwelle. Unter `platform-android` 4,54:1 bei 12 px. Die
Einsatzansicht liegt unter beiden Klassen in allen Modi über 4,5:1
(R9-L5 hält für „‹ Startseite").

**Erwartung der Rolle:** Die Plattformfassung hält dieselbe Untergrenze wie die
Web-Fassung, Kleinschrift auf dem Hauptknopf mit etwas Reserve.

**Folge:** Gering: Die Zeile nennt den Zeitpunkt der letzten Meldung; das
Hauptwort des Knopfes ist groß und ausreichend.

**Empfehlung:** Zusatzzeile auf Knöpfen in Nacht unter allen Plattformklassen auf
mindestens 4,5:1 bei 14 px heben.

**Nachprüfung:** Startseite mit Sammlung, Nacht, alle drei Plattformklassen:
Kontrast der Zusatzzeile ≥ 4,5:1 bei mindestens 13 px.

## Verweise auf andere Berichte

- Deaktivierte Bedienelemente unter 4,5:1 („←" auf Schritt 1, Sortierpfeile,
  „Dunkler" in „Gedimmt"): Absicht, bekannt aus Runde 9.
- Musterung bei 180 × 320: „Bogen anlegen · 38 Pers · 10 Fz" misst 53 px und
  bricht um; die Knopfhöhe von 42 px bei 360 × 640 und 320 × 568 liegt unter
  44 px (Handschuhrolle).
- Zwei Tipps auf dieselbe Stelle als Fehlerquelle: Prellschutz R8-H5/S4, hier
  nur für den Lagemonitor gemessen (hält).

## Bestätigtes

- **Kaltstart:** Systemeinstellung „dunkel" ohne Wahl: `dunkel-modus` vor dem
  Bundle, Grund rgb(15,17,22); Lagemonitor schwarz (rgb(0,0,0)); „hell":
  Standard (rgb(243,245,249)).
- **Kontraste:** In allen vier Modi über die ganze Seite auf Start, Schritt 1 bis
  6, Einsatzansicht, Rückfrage „Sofortbedarf entfernen?" (auch bei Zoom 200 %:
  288 von 320 px Höhe, Knöpfe 44 px), Meldung „Nicht lesbar", Schnellerfassung
  keine aktive Schrift unter 4,5:1.
- **Helligkeit:** Luma-Mittel Nacht 35 bis 36, Dunkel 43 bis 45, Feld 182 bis
  193, Standard 187 bis 202. Die Rückfrage in Nacht bleibt dunkel; der Knopf
  „Sofortbedarf entfernen" steht rosa mit Rahmen und Wort, „Behalten" beige.
- **Druckansicht:** `@media print` setzt Nacht und Dunkel auf schwarz auf weiß
  (21:1) auf Start und Einsatzansicht.
- **Zustandsmarken:** „neu", „● Ruhezeit", „⚠ Anderer Einsatz?", „Zeitraum
  vorbei", Schrittleiste „offen" im Rahmen und „✓": Wort oder Zeichen.
- **Lagemonitor, Warnungen:** „ÜBUNG – keine Echtlage" in Rot (#d85a5a in
  „Gedimmt"), „⚠ letzte Meldung vor 3 Std 1 Min" und „⚠ davon 20 Sollstärke,
  nicht gemeldet" in Bernstein, fett, mit Zeichen; in „Hell" #8a3d00 auf Weiß;
  ohne Farbe unterscheidbar.
- **Lagemonitor, Telefon (R9-L2, R9-L3):** keine Schrift unter 14 px bei
  360 × 640 und 320 × 568, mit und ohne `font-size: 200%`; kein Wortbruch in der
  Einheitentabelle („Oberhausen-Rheinhausen" bricht am Bindestrich); kein
  seitlicher Überlauf; Spalten Orga, Funkruf/Ort, F, U, M.
- **Lagemonitor, Größen:** 1280 × 720 (kleinste Schrift 14,9 px), 1920 × 1080
  (22,4 px), 820 × 1180 (17 px), 640 × 360 (14 px): sechs von sechs Einheiten,
  kein „+ n weitere", Seitenhöhe gleich Bildhöhe bis auf 640 × 360 (565 px,
  rollt).
- **Lagemonitor, Stufentasten (R9-L1):** Sperre „Heller" 1,5 s: zwei Tipps im
  Abstand von 120 ms enden in „Dunkel", nicht in „Hell"; Tipp nach 1,7 s führt
  nach „Hell"; „Dunkler" sofort, zwei Tipps zurück nach „Gedimmt"; „Hell" wird
  nicht gemerkt (Speicher bleibt bei „gedimmt").
- **Musterung (R9-L4):** „Bogen anlegen · 38 Pers · 10 Fz" bei 180 × 320
  vollständig (`scrollWidth` 146 = `clientWidth` 146, umbrochen auf 53 px Höhe).
- **Android (R9-L5):** „‹ Startseite" in der Einsatzansicht, Nacht, unter
  `platform-android` ≥ 4,5:1 (kleinster Wert der Einsatzansicht 4,71:1).
- **Anzeige-Wahl:** vier Felder mit Zusatzzeile (normal, große Tasten, abends,
  gedimmt); die Auswahl trägt `aria-pressed`, der Aufklappknopf nennt den
  gewählten Modus („Ansicht: Nacht ▾"). Der Wechsel von Nacht auf Feld braucht
  zwei Tipps ohne Rückfrage (R4-L4: Reihenfolge Standard, Feld, Dunkel, Nacht).

## Abgleich mit Runde 9

Grundlage: [../runde-9/nacht-und-sicht.md](../runde-9/nacht-und-sicht.md) samt
„Stand der Behebung" (R9-L1 bis L5 als behoben gemeldet).

| Runde-9-Befund | Stand laut Bericht | Bewertung Runde 10 | Messwert / Beobachtung |
| --- | --- | --- | --- |
| R9-L1 Stufentaste: Doppeltipp führt auf Vollweiß (P3) | behoben („Dunkler/Heller", Sperre 1,5 s) | **hält** | Doppeltipp nach 120 ms endet in „Dunkel"; „Hell" erst nach 1,5 s; „Dunkler" nie gesperrt. Rest: Namen und Weg zu „Optionen" (R10-L3, R10-L4). |
| R9-L2 Lagemonitor-Kleinschrift unter 14 px (P3) | behoben („Schrift ≥ 14 px") | **hält** | Kleinste Schrift 14 px bei 360 × 640, 320 × 568, auch mit 200 % Systemschrift. |
| R9-L3 Wortbruch bei 320 px (P3) | behoben („Ort im Funkruf") | **hält** | Kein Wortbruch, Umbruch nur am Bindestrich; kein Überlauf. |
| R9-L4 Musterung 200 %: Hauptaktion abgeschnitten (P3) | behoben („Layout bei Zoom") | **hält** | `scrollWidth` = `clientWidth`, Text umbricht. Der Dialog „Als Vorlage speichern" zeigt bei Zoom 200 % ein anderes Problem (R10-L1). |
| R9-L5 Android-Nacht „‹ Startseite" 4,24:1 (P3) | behoben („Plattformstile") | **hält mit Rest** | Android ≥ 4,5:1; iOS-Nacht Startseite Zusatzzeile 4,32:1 (R10-L5). |

Nebenwirkungen der Runde-9-Änderungen: Die Rückfragen mit bis zu drei Wegen im
festen Fuß und die Zahlenfelder bringen eine neue Stelle, an der bei Zoom 200 %
ein Eingabefeld unter der Fußleiste liegt (R10-L1) und eine Meldung im Ton der
Hilfetexte (R10-L2). Der Schalter „Sofortbedarf erfassen" mit Rückfrage beim
Ausschalten, die Sollstärke-Marke im Monitor und die Meldung „Nicht lesbar"
haben keine neue Lücke in Kontrast oder Blendung gezeigt. Neu in Runde 10:
R10-L1 bis R10-L5. Zusammen: 0 × P0, 0 × P1, 1 × P2, 4 × P3.

## Abschluss

- **Aufgabe geschafft:** ja.
- **Fremde Hilfe nötig:** nein.
- **Größtes Missverständnis:** Man hält die graue Zeile unter dem Zahlenfeld für
  einen Hilfetext, obwohl die App die Zahl gerade gerundet oder abgelehnt hat
  (R10-L2).
- **Größtes Einsatzrisiko:** Bei Zoom 200 % fehlt im Dialog „Als Vorlage
  speichern" das sichtbare Namensfeld (R10-L1).
- **Top-Priorität für die nächste Iteration:** Eingabefelder in Dialogen mit
  fester Knopfzeile bei kleiner Fensterhöhe ins Bild rollen (R10-L1), danach die
  Zahlenmeldung wie eine Warnung auszeichnen (R10-L2).
