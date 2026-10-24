# Audit „Fehler und Wiederanlauf", Runde 9 (Bedienfehler provozieren, selbst korrigieren)

Stand: 24.10.2026 · Prüfer: Rollenaudit `thw-error-recovery-reviewer` ·
Prüfgegenstand: Web-App, Produktionsbuild (`vite preview`, Port 4173),
Code-Stand Commit `c789947` (Zweig `main`).

Reiner Prüfbericht, keine Codeänderung. Wiederholung nach der Behebung der
Runde-8-Befunde ([Runde 8](../runde-8/fehler-und-wiederanlauf.md) samt „Stand der
Behebung" in [../runde-8/README.md](../runde-8/README.md)). Schwerpunkt: Rohtext-
Rettung unter `eeb.unlesbar.v1`, Rückfragen bei Zoom 200 %, Tipp-Sperre nach dem
Öffnen, Zwei-Fenster-Rückfragen mit Werten, Nummern-Verschiebung in Rückfragen,
Zug-Normalisierung, Hinweis zur Entwurfsanonymisierung, Fehlermeldungen bei
defekten Bogendateien, späte Rückkehr eines eigenen `history.back()`.

## Prüfaufbau

Chromium (Playwright aus `node_modules`, `/opt/pw-browsers/chromium`,
`--no-sandbox`), `isMobile`/`hasTouch`, Locale de-DE, Gerätedichte 2. Jeder Lauf
hatte einen eigenen Browser-Kontext mit leerem Speicher; elf weitere Prüfer
nutzten denselben Server (Zeitmessungen daher mit Streuung). Grundeinstellung
Telefon 360 × 640 px, dazu 320 × 568, 640 × 360 quer und für die Rückfragen
`html { font-size: 200% }`. Server nicht angerührt, nichts neu gebaut. Die
Geräteuhr des Prüfrechners stand auf 24.10.2026 (die App zeigt „24.10.26").

Zustände entstanden durch Bedienung und durch `localStorage`-Seeds aus
`examples/thw/` (alle mit `uebung: false`, `stand` auf heute):

- `eeb.entwurf.v1`: Großbogen „Verstärkter Bergungszug" (38 Personen, 10
  Fahrzeuge); Varianten mit `stand` 70, 77, 80, 89, 91 und 120 Tage alt;
  abgeschnittener Text.
- `eeb.einsaetze.v1`: Sammlung „Hochwasser Musterstadt" mit sechs Einheiten; eine
  zweite Sammlung „Übung Nord"; Varianten abgeschnittener Text, Objekt statt
  Liste, leerer String, `eintraege: null`, 1,5 / 2,8 Mio. Zeichen Anhang.
- `eeb.vorlagen.v1`: eine Vorlage, vollständig, um 600 Zeichen gekürzt, als
  Objekt.
- `eeb.unlesbar.v1`: selbst beschädigt, leeres Objekt, `null`.
- Speicher: Füllschlüssel bis zur Grenze (rund 5,2 Mio. Zeichen), danach 20 bzw.
  80 KB frei.
- Dateien: leer, Text, abgeschnitten, Array, fremdes Objekt, Schema 99,
  Schema 1, PNG-Kopf, CSV, HTML; Bogendateien ohne `einheit`, ohne `einsatz`,
  ohne `organisation`, mit `personal: null`, `fahrzeuge: null`; Sicherungsdatei
  mit beschädigtem Einsatz- und Vorlagen-Text innen.

Geprüft habe ich zuerst ohne Blick in die Berichte, danach nach dem Bericht und
dem Stand der Behebung von Runde 8:

- **Falsche Eingabe:** Sofortbedarf mit −5, 38,5, 380, 62 000, 6,2, 1,5, 1.5, 0,5;
  „Stärke ändern…" mit leerem Feld und mit Mannschaft 600; Zug „2", „Z2", „zug 2",
  „Zug zwei", „3.Zug", „Zug 2b"; Einheitstyp wechseln, nachdem 38 Personen und
  10 Fahrzeuge erfasst waren.
- **Abbruch und Neuladen:** Tippen und sofort neu laden (Name, Einheitstyp),
  Neuladen auf Schritt 4 und „Fortsetzen", Neuladen mit offenem „Namen
  einfügen…", Zurück-Verlauf im Assistenten (Schritt 3 → Startseite → App
  verlassen), Zurück bei offenem Dialog, Schließen und sofortiges Wiederöffnen
  des Dialogs (0, 20, 60, 150 ms), Escape.
- **Falscher Kontext:** Meldung entfernen (einzeln und zwei hintereinander),
  „Abrücken", Bogen in die falsche Sammlung ablegen, „Verschieben…", Einsatz
  löschen bei offenem Lagemonitor-Fenster, „Verwerfen" mit Doppeltipp.
- **Zwei Fenster:** derselbe Entwurf, Person in Fenster B umbenannt, in Fenster A
  eine zweite Person umbenannt; „Genauer", „Meine Fassung behalten".
- **Bestand:** beschädigte Gesamttexte (siehe oben), Start, Neuladen (dreimal),
  „Daten sichern…", „Beiseitegelegtes entfernen…", Vorlage speichern.
- **Dateien und Sicherung:** siehe oben, Rückfrage von „Sicherung einspielen…".
- **Tipp-Sperre:** Tipp auf „Person entfernen" und „Endgültig entfernen" 0,1 bis
  0,9 s nach dem Erscheinen, Zeit auf der Seite gemessen.

**Nicht prüfbar:** Kamera und Handscanner, echte Handschuhe, echte
Bildschirmtastatur (Zifferntasten per Tastaturereignis nachgestellt, die
Tastenbelegung eines Telefons kann abweichen), der Zurück-Knopf eines Android-
Geräts (nur `history.back()`), WebKit/Safari, native Builds, ein Browser, der
bei Platzmangel Speicher räumt. Ob Papier-Abgleich, Lagemonitor-Messlogik,
Sollstärke-Marke und CSV nach Nr. nach den Umbauten stimmen, ist Gegenstand
anderer Rollen; hier nur, soweit eine Fehlerstrecke daran hing.

Skripte und Screenshots liegen außerhalb des Repositorys unter
`/tmp/claude-0/-home-user-erfassungsbogen/80562043-ef9f-5d01-b383-2703357d8a5e/scratchpad/runde9/e/`.

Rolle: Helfer, der normale Fehler macht und danach selbst weiterkommen will.

## Urteil

Der Wiederanlauf trägt. Beschädigte Gesamttexte unter `eeb.einsaetze.v1` und
`eeb.vorlagen.v1` werden nun beiseitegelegt, beim Start genannt („Nicht lesbar: 2
beschädigte Gesamttexte … Nichts davon ist gelöscht") und über „Daten sichern…"
in einer Datei gerettet; der Fund bleibt über drei Neuladen stabil, ohne dass der
Rohtext sich vervielfacht. Dateien mit einem defekten Feld bekommen die echte
Ursache („stammt aus dieser App, ist aber unvollständig: die Einheit fehlt").
Rückfragen nennen Werte und Wege zurück („Rückgängig" bei Person, Fahrzeug,
Abrücken, Meldung entfernen; Nummern, die sich verschieben, stehen in der
Rückfrage). Zurück-Geste, Neuladen mitten im Tippen, Doppeltipp und zwei Fenster
verlieren nichts. Eine Datenverlust-Strecke im Hauptweg fand ich nicht.

Reibung bleibt in drei Bereichen:

1. Die Zahlenfelder des Sofortbedarfs verändern Eingaben mit Komma oder Minus
   still (1,5 l Gemisch werden zu 15 l). Das ist der einzige Fehler, bei dem der
   Helfer etwas Richtiges tippt und die App etwas anderes speichert, ohne dass
   eine Plausibilitätsfrage anspringt.
2. Das „Rückgängig" der Sammlung hält nur eine entfernte Meldung; die
   Rückfrage verspricht es ohne diese Grenze, während Personen, Fahrzeuge und
   der Rest mehrstufig funktionieren.
3. Randfälle der Rohtext-Rettung: „Beiseitegelegtes entfernen…" lässt den Fund bei
   Vorlagen nach dem Neuladen wiederkehren; bei knappem Speicher scheitert die
   Rettung ohne Hinweis.

Den eigenen Bogen und die Meldekopf-Aufgaben schafft der Helfer ohne fremde Hilfe.

## Befunde

### R9-E1 [P2] Zahlenfelder im Sofortbedarf: Komma und Minus verschwinden still, „1,5" wird 15 und „38,5" wird 385 (neu)

**Priorität:** P2

**Kennzeichnung:** gemessen (Zifferntasten per Tastaturereignis, Feldwert und
`eeb.entwurf.v1` danach ausgelesen); die Tastenbelegung einer echten
Bildschirmtastatur ist Risiko.

**Fundstelle / Aufgabe:** Schritt 5 „Sofortbedarf", Felder „Verpflegung
(Personen)", „Diesel (l)", „Benzin (l)", „Gemisch (l)". Code: Zahlenfelder mit
`type="number"`, `min="0"`, ohne Hinweis auf ganze Zahlen.

**Beobachtung:**

| getippt | Feld danach | gespeichert |
| --- | --- | --- |
| Gemisch „1,5" | „015" | 15 |
| Gemisch „0,5" | „005" | 5 |
| Gemisch „2,5" | „025" | 25 |
| Gemisch „1.5" | „1" | 1 |
| Verpflegung „38,5" | „385" | 385 |
| Verpflegung/Gemisch „−5"/„−3" | „05"/„03" | 5/3 |
| Diesel „6,2" | „62" | 62 |

Keine Meldung, kein Hinweis „nur ganze Zahlen". Eine Plausibilitätsfrage kommt
nur bei auffälligen Größen (Diesel 62 000 l: „mehr als 1.000 l je Fahrzeug. Stimmt
das?"; Verpflegung 380 für 38 Personen laut Runde 8); 15 l Gemisch oder 62 l Diesel
für 10 Fahrzeuge lösen nichts aus. Nach dem Leeren eines Feldes steht dort „0"; die
nächste Ziffer hängt dahinter („05").

**Erwartung der Rolle:** Ein Komma, das der Helfer tippt, wird entweder als
Dezimalstelle verstanden, gerundet gezeigt oder mit „nur ganze Liter" abgelehnt;
ein Minus wird abgelehnt, nicht stumm zum Pluszeichen.

**Folge:** Der Helfer sieht „015" im Feld und merkt es vielleicht; im Stress, mit
dem Daumen und ohne Brille, geht eine Verzehnfachung durch (15 statt 1,5 l
Gemisch, 385 statt 38,5). Der Bedarf wird bestellt, wie er dasteht, und steht so
auf Bogen, PDF und im QR-Code. Die Menge ist bei Gemisch und Benzin klein, bei
Diesel und Verpflegung nicht.

**Empfehlung:** Dezimalzeichen und Minus nicht still entfernen: entweder als
ganze Zahl runden und den gesetzten Wert nennen (wie bei „Höchstens 99 — dein Wert
999 wurde auf 99 gesetzt", R7-E6) oder die Eingabe mit einem Satz ablehnen. Das
führende „0" nach dem Leeren nicht stehen lassen.

**Nachprüfung:** Gemisch „1,5" tippen: Das Feld zeigt eine klare Antwort (gerundet
mit Hinweis oder abgelehnt), nicht „015". „−5" tippen: Hinweis statt 5.

### R9-E2 [P2] Zwei Meldungen hintereinander entfernt: „Rückgängig" holt nur die letzte zurück; die Rückfrage verspricht es ohne diese Grenze (neu)

**Priorität:** P2

**Kennzeichnung:** gemessen (Karten, Zählung und `localStorage` vor und nach den
Schritten).

**Fundstelle / Aufgabe:** Sammlung „Hochwasser Musterstadt" (6 Einheiten) → Karte
Nr. 3 aufklappen → „Mehr…" → „Entfernen" → „Meldung entfernen"; danach die Karte,
die auf Nr. 3 aufgerückt ist, ebenso entfernen; dann „Rückgängig".

**Beobachtung:**

- Nach dem ersten Entfernen zeigt die Leiste „Entfernt: Meldung Nr. 3 „THW Ulm …"
  Die Einheiten Nr. 4–6 rücken auf …" mit „Rückgängig" (gut, R8-D2 hält).
- Nach dem zweiten Entfernen (jetzt „THW Oberhausen-Rheinhausen") steht in der
  Leiste nur noch diese zweite Meldung. Ein Tipp auf „Rückgängig" stellt
  Oberhausen-Rheinhausen wieder her; ein zweites „Rückgängig" gibt es nicht. Ulm ist
  weg (Sammlung bleibt bei 5 Einheiten; im Speicher nur ein Kennzeichen
  `eeb.entfernt.v1` mit 18 Zeichen, keine Meldung).
- Die Rückfrage vor dem zweiten Entfernen sagt wörtlich dasselbe wie vor dem ersten
  („„Rückgängig" stellt die alten Nummern wieder her" / „gibt es nur, solange die
  App geöffnet bleibt") und nennt nicht, dass die erste Rücknahme damit erlischt.
- Bei Personen dagegen holt „Rückgängig" auch zwei hintereinander entfernte
  zurück (R8, Bestätigtes).

**Erwartung der Rolle:** Wer zwei falsche Meldungen nacheinander wegräumt (zwei
doppelt gescannte Einheiten), kann beide zurückholen, oder die Rückfrage sagt
vorher: „Nur die letzte Meldung lässt sich zurückholen."

**Folge:** Meldekopf räumt nach einem Fehlalarm drei Karten auf, merkt bei der
zweiten, dass die erste doch richtig war, und kann sie nicht zurückholen. Die
Meldung samt Historie, Zeiten, Zugzuordnung und Auftragsnotiz ist weg; Stärke
und Bedarf fallen in der Lage. Gerettet werden kann sie nur durch erneutes Scannen
oder Einlesen des Bogens (Zeiten und Historie dabei nicht).

**Empfehlung:** Mehrere Entfernungen hintereinander zurücknehmbar machen (wie bei
Personen) oder die Rückfrage um den Satz „Nur die zuletzt entfernte Meldung lässt
sich zurückholen" ergänzen, sobald schon eine Rücknahme aussteht.

**Nachprüfung:** Zwei Meldungen nacheinander entfernen, zweimal „Rückgängig":
Beide stehen wieder da, Nummern wie vorher. Oder: Die zweite Rückfrage nennt die
Grenze.

### R9-E3 [P3] Zwei-Fenster-Leiste: „Otto, Sandra → Otto, QQQ, Braun, ZZZ → Braun, Felix" – die Richtung der Pfeile steht nirgends, Komma trennt Namen und Einträge zugleich (neu, Nebenwirkung von R8-E4/N6)

**Priorität:** P3

**Kennzeichnung:** gemessen.

**Fundstelle / Aufgabe:** Fenster A und Fenster B im selben Kontext, beide Schritt
3. In B bei Person 1 „Sandra" durch „QQQ" ersetzen, danach in A bei Person 2 „Felix"
durch „ZZZ".

**Beobachtung:**

- Nach nur einer Änderung in B: „Hier wird nichts gespeichert. Das andere Fenster
  hat den Bogen geändert: Personal (1 Eintrag: Otto, Sandra → Otto, QQQ)." Zählung und
  Namen stimmen jetzt (R8-E4 behoben).
- Nach zusätzlicher Änderung in A: „… Personal (2 Einträge: Otto, Sandra → Otto,
  QQQ, Braun, ZZZ → Braun, Felix)." Die Pfeile laufen von „hier" nach „dort", das
  steht nirgends; „Braun, ZZZ" ist die eigene, noch nicht gespeicherte Änderung in A,
  der Satz davor sagt aber „Das andere Fenster hat den Bogen geändert". Die Namen
  tragen ein Komma („Nachname, Vorname"), die Einträge werden mit demselben Komma
  getrennt.
- Die Rückfrage „Meine Fassung behalten?" wiederholt den Text unter „anders:" in
  Klammern und nennt davor „Dort … Hier …" mit Stand und Personenzahl; die
  Richtung bleibt auch dort offen.

**Erwartung der Rolle:** „dort: Sandra → hier: QQQ" oder getrennte Zeilen je
Eintrag, damit klar ist, welche Fassung was enthält.

**Folge:** Der Helfer liest „Braun, ZZZ → Braun, Felix" als „das andere Fenster hat
ZZZ zu Felix gemacht" und entscheidet falsch über „Anderen Stand laden" oder
„Meine Fassung behalten". Die Rückfrage danach nennt Fenster und Stand, daher
kein Datenverlust ohne Frage.

**Empfehlung:** Je Eintrag eine Zeile mit „hier" und „dort" benannt; Namen in
Anführungszeichen oder durch Semikolon vom nächsten Eintrag trennen.

**Nachprüfung:** Zwei Personen in beiden Fenstern ändern: Jede Änderung steht in
einer eigenen Zeile mit „hier" und „dort".

### R9-E4 [P3] „Beiseitegelegtes entfernen…" lässt den Fund bei beschädigten Vorlagen nach dem Neuladen wiederkehren; der Hinweistext spricht von „Listen und Zählung" und „Stärke" (neu)

**Priorität:** P3

**Kennzeichnung:** gemessen (`eeb.vorlagen.v1` um 600 Zeichen gekürzt; Neuladen
nach „Endgültig entfernen"). Die Streuung durch die Tipp-Sperre habe ich
ausgeschlossen (Bestätigung erst nach 1,2 s).

**Fundstelle / Aufgabe:** Startseite mit dem gelben Fund → „Beiseitegelegtes
entfernen…" → „Endgültig entfernen" → Neuladen.

**Beobachtung:**

- Bei beschädigtem Sammlungstext räumt die Aktion auf: `eeb.unlesbar.v1` ist weg, der
  Hinweis verschwindet, auch nach Neuladen.
- Bei beschädigtem Vorlagentext wird nur `eeb.unlesbar.v1` entfernt;
  `eeb.vorlagen.v1` bleibt mit dem beschädigten Rohtext stehen. Nach dem Neuladen
  steht wieder „Nicht lesbar: 1 beschädigter Gesamttext" und `eeb.unlesbar.v1` ist
  neu gefüllt (16 389 Zeichen). Erst eine neu gespeicherte Vorlage überschreibt den
  beschädigten Text; danach lässt sich der Fund mit „Entfernen" dauerhaft räumen.
- Der Hinweis nennt für Vorlagen „Sie fehlen in Listen und Zählung — die Stärke kann
  zu niedrig sein"; bei Vorlagen gibt es weder Zählung noch Stärke.

**Erwartung der Rolle:** „Endgültig entfernen" entfernt wirklich; der Hinweis passt
zur Art der beschädigten Daten.

**Folge:** Gering: ein Hinweis, der nicht weggeht, wird mit der Zeit überlesen und
verdeckt später einen echten Fund. Der Text „Stärke kann zu niedrig sein" beunruhigt
bei Vorlagen ohne Grund.

**Empfehlung:** Beim Entfernen auch den beschädigten Text am Ursprungsort ersetzen
(oder ausdrücklich merken, dass er bekannt ist); den Hinweis je nach Art
(Sammlungen/Vorlagen) formulieren.

**Nachprüfung:** Beschädigte Vorlagen seeden, „Beiseitegelegtes entfernen…" →
„Endgültig entfernen" → Neuladen: kein Hinweis mehr.

### R9-E5 [P3] Bei vollem Speicher scheitert die Rohtext-Rettung stumm: Sammlung wird zu „[]", kein Fund, kein Rohtext (neu)

**Priorität:** P3

**Kennzeichnung:** gemessen im konstruierten Zustand (Speicher bis rund 20 KB unter
der Grenze gefüllt, beschädigter Sammlungstext von 21 654 Zeichen); ob ein Gerät
beides gleichzeitig erreicht, ist Risiko.

**Fundstelle / Aufgabe:** `eeb.einsaetze.v1` abgeschnitten, Speicher fast voll →
Start.

**Beobachtung:**

- Mit 80 KB freiem Platz: `eeb.einsaetze.v1` = „[]", `eeb.unlesbar.v1` mit dem Rohtext,
  Hinweis „Nicht lesbar: 1 beschädigter Gesamttext".
- Mit 20 KB freiem Platz: `eeb.einsaetze.v1` = „[]", **kein** `eeb.unlesbar.v1`, kein
  Hinweis „Nicht lesbar". Sichtbar ist nur die allgemeine Zeile „⚠ Gerätespeicher ist
  voll: 100 %". Die Sammlung ist leer, der beschädigte Text nirgends mehr
  (ebenso mit 2,8 Mio. Zeichen Rohtext).

**Erwartung der Rolle:** Was nicht beiseitegelegt werden kann, bleibt stehen, und
der Helfer erfährt, dass der Text beschädigt ist.

**Folge:** Gering bis mittel, nur bei zugleich voller und beschädigter
Ablage: Der Meldekopf sieht „keine Einsätze" ohne Hinweis darauf, dass etwas
nicht lesbar war, und sichert nichts.

**Empfehlung:** Den ursprünglichen Text erst ersetzen, wenn die Kopie geschrieben
ist, sonst stehen lassen und den Fund trotzdem nennen („nicht lesbar und kein Platz
zum Beiseitelegen").

**Nachprüfung:** Wie oben seeden: Der Rohtext bleibt erhalten oder die Startseite
nennt das Scheitern.

### R9-E6 [P3] Zug „2" und „Z2" werden nicht zu „2. Zug"; die Zwischensummen führen sie als eigene Züge (neu, Rest von R8-N5)

**Priorität:** P3

**Kennzeichnung:** gemessen (drei Einheiten: „2", „2. Zug", „Zug 2").

**Fundstelle / Aufgabe:** Sammlung → Karte → „Zug zuordnen" → Eingabe → „Speichern".

**Beobachtung:**

- „zug 2", „ZUG 2 ", „2 Zug", „Zug2" und „2. Zug" ergeben „2. Zug", „3.Zug" ergibt
  „3. Zug" (Normalisierung hält).
- „2" bleibt „2", „Z2" bleibt „Z2", „Zug zwei" bleibt „Zug zwei". Mit „2", „2. Zug" und
  „Zug 2" an drei Einheiten steht unter „Zwischensummen nach Zug (3 Züge)" ein Zug „2"
  (1 Einheit, Stärke 17) und ein Zug „2. Zug" (2 Einheiten, Stärke 19), obwohl alle
  denselben Zug meinen.

**Erwartung der Rolle:** Eine nackte Ziffer ist im THW-Umfeld der Zug; ähnliche
Namen werden beim Eintippen genannt („Meinst du „2. Zug"?").

**Folge:** Gering: Die Lage zeigt zwei Zugzeilen mit je halber Stärke; der Zugführer
rechnet nach.

**Empfehlung:** Ziffer allein und „Z"+Ziffer ebenfalls normalisieren, oder beim
Speichern auf die vorhandene Schreibweise hinweisen.

**Nachprüfung:** „2" und „2. Zug" eintragen: eine Zeile „2. Zug".

### R9-E7 [P3] „Stärke ändern…": „Stärke übernehmen" ist bei leerem Feld ausgegraut, ohne zu sagen warum (neu)

**Priorität:** P3

**Kennzeichnung:** beobachtet (Screenshot, Zustand des Knopfes abgefragt).

**Fundstelle / Aufgabe:** Sammlung → Karte → „Mehr…" → „Stärke ändern…" → Feld
„Unterführer" leeren.

**Beobachtung:** Der Knopf ist grau und deaktiviert, ein Satz zur Ursache fehlt; das
leere Feld hat keine Markierung. Mit eingetragener Zahl wird er aktiv; 600 statt 60
löst die Rückfrage „Stimmt die Stärke?" mit beiden Werten aus (gut).

**Erwartung der Rolle:** Ein Pflichtfeld, das übersehen wurde, wird genannt („Unterführer
fehlt, 0 eintragen, wenn keiner da ist").

**Folge:** Gering: Der Helfer tippt auf den toten Knopf und sucht den Fehler; die
Tipp-Sperre nach dem Öffnen fühlt sich ähnlich an.

**Empfehlung:** Ein Satz unter dem Knopf oder 0 als Vorbelegung bei leerem Feld.

**Nachprüfung:** Feld leeren: Der Dialog nennt das fehlende Feld.

### Verweise auf Befunde in anderen Berichten

- Anrede im Dialog „Namen einfügen…": „auch wenn Sie das Fenster schließen" bei sonst
  „du"/„dein": Darstellung und Wortwahl, nicht Gegenstand dieser Rolle, hier ohne Zählung.
- Tipps auf die Knöpfe einer Rückfrage werden bis etwa 0,57 s nach dem Erscheinen
  verschluckt, ohne dass die Rückfrage das zeigt: bekannt als R8-H5/S4, siehe Tabelle.

## Bestätigtes (was gut funktioniert und erhalten bleiben sollte)

- **Rohtext-Rettung (R8-D1 u. a.):** abgeschnittener Sammlungstext, Objekt statt Liste,
  `eintraege: null`, Vorlagentext abgeschnitten oder als Objekt: Hinweis „Nicht
  lesbar: n beschädigte Gesamttexte …", „Daten sichern…" erzeugt die Datei
  `eeb-sicherung-2026-10-24.json` mit `eeb.unlesbar.v1` darin, Quittung „Sicherung …
  erzeugt (Downloads)". Dreimaliges Neuladen vervielfacht den Rohtext nicht (37 968
  Zeichen bleiben 37 968). Beschädigter Entwurf und beschädigte Sammlung zugleich:
  beide Hinweise stehen da. Ein selbst beschädigtes `eeb.unlesbar.v1` wird ersetzt, ohne
  dass die App stürzt.
- **Sicherung einspielen:** Die Rückfrage nennt für Dateiinhalt „beschädigt:
  Einsatz-Sammlungen: der gespeicherte Text ist beschädigt und nicht lesbar" und
  „beschädigt: Vorlagen …", dazu was auf dem Gerät verloren geht; „Vorher Sicherung
  erstellen…" ist im Fenster (R8-E1, Sicherungsteil).
- **Bogendateien (R8-E3):** Ohne `einheit`: „stammt aus dieser App, ist aber
  unvollständig: die Einheit fehlt. In der App lässt sich das Fehlende nicht
  nachtragen — beim Absender neu anfordern …"; `personal: null`: „die Personenliste
  fehlt"; ohne `einsatz`: „die Angaben zum Einsatz fehlen"; ohne `organisation`: „die
  Organisation der Einheit fehlt". Leere, abgeschnittene, fremde, Schema-99-, PNG-,
  CSV- und HTML-Dateien haben je eine eigene Meldung mit Ursache und nächstem Schritt.
- **Namen einfügen (R8-E2):** Escape und Zurück-Geste schließen den Dialog; die
  Liste steht beim Wiederöffnen noch da, der Dialog sagt es („Die Liste bleibt stehen
  … bis Sie sie übernehmen oder leeren", „Liste leeren"). Die Vorschau markiert
  „12345" als „wird nicht übernommen / kein Name?". Schließen und sofortiges Wiederöffnen
  (0 bis 150 ms) lässt Zustand und Verlauf in Ordnung; ein späteres Escape schließt.
  Nach dem Neuladen ist die Liste weg (Arbeitsspeicher, nicht Sitzung).
- **Zurück-Verlauf:** Schritt 3 → 5 → 4 → Startseite → App verlassen; Zurück bei offenem
  Dialog schließt nur den Dialog; die späte Rückkehr des eigenen `history.back()` nach
  „Schließen" ändert den Schritt nicht.
- **Rückfragen:** „Person entfernen" (Name, „Rückgängig" genannt), „Fahrzeug entfernen"
  (jetzt ebenfalls „Rückgängig" genannt, R8-E5 hält), „Meldung entfernen" (nennt
  „Nummern ändern sich: Die Einheiten Nr. 4–6 rücken auf und heißen danach Nr. 3–5",
  Neuladen, Export), „Stimmt die Stärke?" mit Gegenüberstellung „0 / 2 / 6 / 8 → 0 /
  2 / 600 / 602" und „Gesamt 8 → 602: mehr als das Dreifache", „Angefangenen Bogen
  verwerfen?" mit Hinweis auf „Zuletzt geschlossener Bogen". Bei 200 % Schrift:
  320 × 568, 360 × 640 und 640 × 360: Überschrift im Bild (44, 95, 63 px), beide
  Knöpfe im Fenster, Fokus auf „Abbrechen"; Knöpfe untereinander, außer quer.
- **Zwei Fenster:** Leiste nur bei echtem Unterschied, „Anderen Stand laden" und „Meine
  Fassung behalten" mit Fenster, Stand mit Sekunden und Personenzahl; die Zählung ist
  jetzt richtig (1 Eintrag je umbenannter Person, Namen genannt).
- **Einsatz löschen mit offenem Lagemonitor-Fenster:** „Dieser Einsatz liegt im
  Papierkorb (30 Tage) — im Hauptfenster wiederherstellen."; das Hauptfenster
  nennt „30 Tage zurückholen".
- **Anonymisierung (R8-D3):** Entwurf 77, 80 und 89 Tage alt: „Namen werden am
  6.11.2026 anonymisiert (noch 13 Tage) — vorher weitergeben oder sichern; Bearbeiten
  beginnt die Frist neu." (zuletzt „noch 1 Tag"); ab 91 Tagen: „Datenschutzfrist
  abgelaufen: … wurden am 23.10.2026 anonymisiert." Bei 70 Tagen kein Hinweis.
- **Falscher Einsatz:** Bogen in „Übung Nord" statt „Hochwasser Musterstadt" abgelegt:
  „In anderen Einsatz verschieben" nennt Ziel und „dort schon gemeldet, wird
  zusammengeführt". „Abrücken" mit „Rückgängig" (Leiste, Summen fallen und kehren
  zurück).
- **Plausibilität vor der Wirkung:** Diesel 62 000 l („mehr als 1.000 l je Fahrzeug.
  Stimmt das?"), Mannschaft 600 beim Stärkewechsel.
- **Einheitstyp wechseln:** Vorbelegung (9 Personen, 2 Fahrzeuge) kommt neben die 38
  erfassten dazu, mit Hinweis „Sie zählen in die Stärke, bis sie ausgefüllt oder
  entfernt sind" und „Vorbelegung entfernen" (bekannt, R7-E).
- **Neuladen:** Name und Einheitstyp nach sofortigem Neuladen im Entwurf; „Fortsetzen"
  landet im Schritt „4. Fahrzeuge".

## Abgleich mit Runde 8

Grundlage: [../runde-8/fehler-und-wiederanlauf.md](../runde-8/fehler-und-wiederanlauf.md) samt „Stand der
Behebung" in [../runde-8/README.md](../runde-8/README.md).

| Runde-8-Befund | Stand laut Runde 8 | Bewertung Runde 9 | Beobachtung |
| --- | --- | --- | --- |
| R8-E1 Beschädigter Vorlagen-Text still ersetzt; Sicherungsrückfrage ohne Hinweis (P3) | behoben (mit O2, D1, H1) | hält, Rest R9-E4/E5 | Rohtext liegt unter `eeb.unlesbar.v1`, Fund wird genannt, Sicherungsrückfrage nennt „beschädigt: Einsatz-Sammlungen / Vorlagen". Rest: Fund kehrt nach „Entfernen" bei Vorlagen zurück (E4), Rettung scheitert bei vollem Speicher stumm (E5). |
| R8-E2 „Namen einfügen…": Escape verwirft die Liste (P3) | behoben | hält | Liste bleibt, Dialog sagt es; nach Neuladen weg (nicht zugesagt). |
| R8-E3 Eigene Bogendateien mit defektem Feld: falsche Ursache (P3) | behoben | hält | Ursache und fehlendes Feld genannt (Einheit, Personenliste, Einsatz, Organisation). |
| R8-E4 Zwei-Fenster-Leiste „2 Einträge" bei einer umbenannten Person (P3) | behoben | hält, Rest R9-E3 | Zählung stimmt, Namen genannt; Richtung der Pfeile und Komma-Trennung offen. |
| R8-E5 „Fahrzeug entfernen" verschweigt „Rückgängig" (P3) | behoben | hält | Satz steht in der Rückfrage. |
| R8-D2/W1 Nummern verschieben sich (Rückfrage) | behoben | hält | Rückfrage nennt „Nr. 4–6 … Nr. 3–5"; Leiste nennt es nach dem Entfernen. Rücknahme nur für die letzte Meldung (R9-E2). |
| R8-H5/S4 Tipp-Sperre nach dem Öffnen | teilweise | teilweise (bekannte Grenze) | Tipp auf „Person entfernen" bis etwa 0,57 s nach dem Erscheinen verschluckt, bei 1,1 s angenommen; „Endgültig entfernen" bis rund 0,45 s; keine Rückmeldung, die Rückfrage bleibt offen. Unter Last mit elf weiteren Prüfern gemessen. |
| R8-D5 „Rückgängig" unter „Abrücken" | teilweise | hält | „✓ Abgerückt" gestrichelt, Leiste „Abgerückt 06:46: Nr. 1 …" mit „Rückgängig"; Summen fallen und kehren zurück. |
| R8-N6/E4 Zwei-Fenster-Rückfrage mit Werten | behoben | hält | „Dort: … 06:52:37 Uhr, 38 Personen. Hier: Stand … zuletzt gespeichert …" und Unterschiedstext. |
| R8-G1/M2 Rückfragen bei Zoom 200 % | behoben | hält | Überschrift im Bild, beide Knöpfe im Fenster bei 320 × 568, 360 × 640, 640 × 360. |
| R8-A3/N5 „n. Zug" normalisiert | behoben | hält teilweise | „zug 2", „2 Zug", „Zug2" → „2. Zug"; „2", „Z2" bleiben (R9-E6). |
| R8-D3 Hinweis zur Anonymisierung 14 Tage vorher | behoben | hält | Frist und Datum genannt, „Bearbeiten beginnt die Frist neu". |
| Späte Rückkehr eines eigenen `history.back()` | behoben | hält | Kein Sprung des Schritts nach „Schließen" oder schnellem Wiederöffnen. |

Bekannte Grenzen: R6-O9 (Uhrstand in der Zukunft, frische Sammlung), R7-G4/M8
(Ecken-Knopf hochkant), R7-G8/H9 (Geräteuhr-Warnung bei 200 % und 320 × 568),
R7-N1 (kein Zusammenführen-Tipp), R7-N9 (Ziffern der Schrittleiste), R8-A1
(Sollstärke zählt mit, mit Marke), R8-M6 (klebende Namensspalte 37–42 %), R8-H5/S4
(Prellschutz 450/800 ms) liegen außerhalb dieser Rolle und habe ich nicht neu
gemessen, außer dem Prellschutz (siehe Tabelle). Nebenwirkungen der Runde-8-Änderungen:
Der Rohtext-Rettung fehlt der Weg zurück zum Ursprungsort (R9-E4) und die
Absicherung bei vollem Speicher (R9-E5); die Unterschiedstexte der Zwei-Fenster-
Leiste sind genauer geworden, aber nicht eindeutig gerichtet (R9-E3). Eine Behebung
hat nichts verschlechtert.

Bilanz: Alle fünf Befunde und die Folgeänderungen aus Runde 8 halten im Browser. Neu
aus den Umbauten: R9-E3, R9-E4, R9-E5; neu aus Randfällen: R9-E1, R9-E2, R9-E6,
R9-E7.

## Abschluss

- **Aufgabe geschafft:** ja. Eigener Bogen, Meldekopf-Erfassung, Korrektur nach
  Fehleingaben, Wiederanlauf nach Neuladen, Abbruch, Zurück-Geste, zweitem Fenster
  und beschädigtem Speicher gehen ohne fremde Hilfe.
- **Fremde Hilfe nötig:** nein. Nur wenn Speicher voll und Text beschädigt zugleich
  vorliegen (R9-E5), bleibt die frühere Sicherungsdatei.
- **Größtes Missverständnis:** „Rückgängig" gilt nach dem Entfernen einer zweiten
  Meldung nur noch für diese eine; der Helfer hält es für die ganze Folge (R9-E2).
- **Größtes Einsatzrisiko:** Ein Komma im Sofortbedarf wird stillschweigend zu einer
  zehnmal größeren Zahl (1,5 l Gemisch werden 15 l), ohne Rückfrage (R9-E1).
- **Top-Priorität für die nächste Iteration:** Zahlenfelder des Sofortbedarfs: Komma
  und Minus nicht still entfernen, sondern ablehnen oder gerundet mit Hinweis
  übernehmen (R9-E1).
