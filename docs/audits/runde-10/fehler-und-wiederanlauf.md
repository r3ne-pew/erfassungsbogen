# Audit „Fehler und Wiederanlauf", Runde 10 (Bedienfehler provozieren, selbst korrigieren)

Stand: 25.10.2026 · Prüfer: Rollenaudit `thw-error-recovery-reviewer` ·
Prüfgegenstand: Web-App, Produktionsbuild (`vite preview`, Port 4173),
Code-Stand Commit `441811c` (Zweig `main`; der Zweigkopf trägt danach nur noch einen
Prüfbericht unter `docs/audits/runde-10/`, am Code ändert sich nichts).

Reiner Prüfbericht, keine Codeänderung. Wiederholung nach der Behebung der
Runde-9-Befunde ([Runde 9](../runde-9/fehler-und-wiederanlauf.md) samt „Stand der
Behebung" in [../runde-9/README.md](../runde-9/README.md)). Schwerpunkt: Zahlenfelder
(Komma, Minus, Ziffern), Schalter mit Rückfrage („Sofortbedarf erfassen", „Funkrufname",
„Nur Stärke"), Rückwege (Person, Fahrzeug, Meldung), Rohtext-Rettung bei beschädigtem und
bei vollem Speicher, falsche Dateien, manuelle Aufnahme im Meldekopf, Neuladen mitten im
Tippen, Doppeltipp, Browser-Zurück, Rückfragen bei Zoom.

Blind getestet, erst danach den Runde-9-Bericht gelesen.

## Prüfaufbau

Chromium (Playwright aus `node_modules`, `/opt/pw-browsers/chromium`,
`--no-sandbox`), `isMobile`/`hasTouch`, Locale de-DE, Gerätedichte 2. Jeder Lauf hatte
einen eigenen Browser-Kontext; elf weitere Prüfer nutzten denselben Server
(Zeitmessungen daher mit Streuung). Grundeinstellung Telefon 360 × 640 px, dazu
320 × 568, 640 × 360 quer, Zoom nachgestellt (180 × 320 bei Dichte 4) und
`html { font-size: 200% }`. Server nicht angerührt, nichts neu gebaut. Die Geräteuhr
stand auf 25.10.2026.

Zustände entstanden durch Bedienung und durch `localStorage`-Seeds aus
`examples/thw/` (alle mit `uebung: false`, `stand` auf heute):

- `eeb.entwurf.v1`: Bogen „Albstadt Zugtrupp Technischer Zug" (4 Personen, 2 Fahrzeuge)
  und „Crailsheim Fachgruppe Wassergefahren".
- `eeb.einsaetze.v1`: Sammlung „Hochwasser Musterstadt" mit sechs Einheiten; Variante auf
  5 000 Zeichen abgeschnitten (beschädigt); dieselbe Variante bei durch Füllschlüssel
  (`zz.fill…`) vollem Speicher.
- Dateien für die Eingabefehler: eine `.txt`, eine `.json` mit `{"a":1}`, eine
  „PDF" aus Müll, ein gültiger Einzelbogen.

Geprüft (Auswahl): Zahlenfelder Sofortbedarf und Schnellerfassung (`-5`, `1,5`, `12.5`,
`abc`, `1e3`, `0012`, Vollbreite-Ziffer, 99 999 999, 130 statt 13); Schalter
Sofortbedarf, Funkrufname, „Nur Stärke" in beide Richtungen; Person und Fahrzeug
entfernen mit Rückgängig nach Neuladen; Meldung entfernen dreimal und dreimal Rückgängig,
Neuladen danach; Abrücken; „Neuen Bogen erstellen", „Verwerfen", „Zuletzt geschlossenen
Bogen zurückholen" und „Aus Datei laden…" bei vorhandenem Entwurf; leerer Bogen bis
„Bogen übergeben…"; manuelle Aufnahme ohne Namen, mit doppelter Nr.; Doppeltipp auf „+
Person"/„+ Fahrzeug"; Browser-Zurück aus Schritt 3; Neuladen direkt nach dem Tippen;
falsche Dateien an allen drei Dateiwegen; beschädigte und volle Sammlung; „Einsatz
löschen…"; Zug „2".

## Urteil

Der Wiederanlauf trägt weiter und ist seit Runde 9 dichter geworden. Die Zahlenfelder
lesen den Text selbst: Komma wird gerundet und genannt, Minus und Buchstaben werden
abgelehnt mit Satz, die Größe 99 999 999 l löst die Plausibilitätsfrage aus. Rückfragen
nennen Werte und bis zu drei Wege; der Rückgängig-Stapel für Meldungen holt drei
nacheinander entfernte Meldungen in umgekehrter Reihenfolge zurück; Person und Fahrzeug
überleben das Neuladen. Beschädigter Speicher wird beiseitegelegt und genannt, bei vollem
Speicher bleibt der Rohtext unangetastet („Speicher voll – beschädigte Daten nicht
gesichert"). Neuladen mitten im Tippen, Doppeltipp, Zurück-Geste, falsche Dateien und
Zoom 180 × 320 verlieren nichts. Eine Datenverlust-Strecke im Hauptweg fand ich nicht.

Die eine echte Lücke liegt im Umschalter „Personal vollständig erfassen / Nur Stärke":
Die Richtung in die Schnellerfassung fragt zurück, die Gegenrichtung wirft die von Hand
eingetragenen Zahlen kommentarlos weg (R10-E1). Dazu kommen vier kleine Brüche in den
Wörtern und Wegen (Name/Ort, Funkrufname-Merker, Dateihinweis, Nr.-Prüfung nach der
Stärkefrage) und ein dokumentiertes Restrisiko beim Rückgängig-Stapel.

Den eigenen Bogen und die Meldekopf-Aufgaben schafft der Helfer ohne fremde Hilfe.

## Befunde

### R10-E1 [P2] „Personal vollständig erfassen" verwirft die Zahlen der Schnellerfassung ohne Rückfrage und ohne „Rückgängig" (neu)

**Priorität:** P2

**Kennzeichnung:** gemessen (Telefon 360 × 640, Meldekopf-Aufnahme „Einheit manuell
erfassen…", Schritt 3); der Codepfad ist in `src/app/schritte/personal.tsx` im
`onChange` des Radios „Personal vollständig erfassen" nachgelesen.

**Fundstelle / Aufgabe:** Schritt 3 „Personal", Wahl „Nur Stärke (Meldekopf-
Schnellerfassung)" gegenüber „Personal vollständig erfassen"; die beiden Radios stehen
unmittelbar untereinander.

**Beobachtung:** In „Nur Stärke" Führer 1, Unterführer 2, Mannschaft 13 (Gesamt 16)
eingetragen. Tipp auf „Personal vollständig erfassen": keine Rückfrage, keine Leiste mit
„Rückgängig". Die Seite zeigt sofort „Stärke (abgeleitet): 0 / 0 / 0 / 0" und „⚠ Stärke
ist 0 — es ist noch kein Personal erfasst". Ein Rückweg auf „Nur Stärke" zeigt alle
Felder auf 0. Gegenprobe: Die Gegenrichtung (vollständig mit 4 Personen → „Nur Stärke")
fragt zurück („Nur die Stärke melden? 4 erfasste Personen zählen dann nicht mehr einzeln
… startet mit 1 / 1 / 2 / 4", Wege „Nur Stärke melden" / „Abbrechen"). Verloren gehen
auch die manuelle Unterbringung (m/w/d) und die manuelle Verpflegungsaufteilung.

**Erwartung der Rolle:** Wer an dieser Stelle die falsche der beiden benachbarten Wahlen
trifft, erwartet dieselbe Absicherung wie in der anderen Richtung oder eine
Rücknahme-Leiste, wie sie bei Person, Fahrzeug und Meldung steht.

**Folge:** Ein Helfer am Meldekopf, der gerade die Zahlen einer eintreffenden Einheit
abgetippt hat (Zahlendreher-prone Eingabe unter Zeitdruck), verliert sie mit einem
Fehltipp und muss sie vom Zettel neu aufnehmen. Die Warnung „Stärke ist 0" zeigt den
Zustand, nennt aber nicht, dass gerade Zahlen verworfen wurden. Der Schaden ist begrenzt
(Zettel ist noch da), das Muster ist aber genau das, wofür die übrigen Rückwege
eingebaut wurden.

**Empfehlung:** Dieselbe Abfrage wie in der Gegenrichtung, sobald in der Schnellerfassung
Zahlen ungleich 0 stehen („Die eingetragenen Zahlen 1 / 2 / 13 / 16 gehen verloren")
oder die Zahlen wenigstens für „Nur Stärke" merken und beim Zurückschalten wieder
anbieten.

**Nachprüfung:** „Nur Stärke" mit Zahlen füllen, auf „Personal vollständig erfassen"
tippen: Rückfrage mit den Zahlen oder Rücknahme-Leiste; „Abbrechen"/„Rückgängig" stellt
1 / 2 / 13 / 16 und die Verpflegungsaufteilung wieder her.

### R10-E2 [P3] Schalter „Funkrufname" am Fahrzeug: keine Rückfrage, Entwurf verliert Kennwort und Kennzahlen sofort, der Merker hält nur bis zum Neuladen (neu, Rest von R9-D1)

**Priorität:** P3

**Kennzeichnung:** gemessen (Schritt 4, Fahrzeug 1 mit Kennwort „Heros", Kennzahlen
„21/10"); der Merker (`funkrufMerker`) ist im Code als Absicht belegt.

**Fundstelle / Aufgabe:** Schritt 4 „Fahrzeuge", Häkchen „Funkrufname" je Fahrzeugkarte.

**Beobachtung:** Häkchen entfernen: kein Dialog, die Felder verschwinden, in
`eeb.entwurf.v1` steht das Fahrzeug danach ohne `funkrufname`. Häkchen in derselben
Sitzung wieder setzen: Kennwort „Heros" und Kennzahlen „21/10" sind zurück (Merker im
Arbeitsspeicher). Häkchen entfernen, Seite neu laden, wieder setzen: Kennwort „Heros"
kommt aus der Vorbelegung zurück, die Kennzahlen sind leer, das Fahrzeug trägt
`teile: []`.

**Erwartung der Rolle:** Der Auftrag sprach von einem Schalter mit Rückfrage; beim
„Sofortbedarf erfassen" gibt es sie („Sofortbedarf entfernen? Diese Angaben gehen
verloren: Diesel 80 l …", „Behalten" ist erreichbar). Beim Funkrufnamen ersetzt ein
stiller Merker die Rückfrage und verspricht nichts.

**Folge:** Ein Fehltipp auf das Häkchen kostet im Normalfall nichts (Merker). Nach einer
Unterbrechung mit Neuladen oder nach dem Beenden der App durch das Telefon steht der
Funkrufname nur noch halb da, und die Übersicht zeigt „—". Der Verlust ist klein (zwei
Zahlen) und für den Helfer nicht erkennbar.

**Empfehlung:** Den Merker mit in den Entwurf schreiben oder beim Ausschalten bei
ausgefüllten Kennzahlen eine kurze Rückfrage zeigen wie beim Sofortbedarf.

**Nachprüfung:** Häkchen aus, Neuladen, Häkchen an: Kennwort und Kennzahlen wie vorher
oder Rückfrage beim Ausschalten.

### R10-E3 [P3] Nach der Umbenennung bleibt der Begriff „Name" in Warnung, Rückfrage und Übersicht: Feld heißt „Ort der Einheit (Pflicht)", die Texte sprechen von „Name", „Namensfeld" und „Standort" (neu, Nebenwirkung der Rückmeldung aus der Erprobung)

**Priorität:** P3

**Kennzeichnung:** gemessen (Schritt 1 eines leeren Bogens, Schnellaufnahme im Meldekopf,
Übersicht eines leeren Bogens).

**Fundstelle / Aufgabe:** Schritt 1 „Einheit"; „In Einsatz übernehmen" ohne Eintrag;
Gesamtübersicht.

**Beobachtung:** Das Feld trägt die Beschriftung „Ort der Einheit (Pflicht)". Die
Warnung darunter lautet „⚠ Zugehörigkeit: Der Name der eigenen Einheit (unterste Ebene)
fehlt." Bei „In Einsatz übernehmen" ohne Eintrag erscheint die Rückfrage „Name der
Einheit fehlt / Ohne Namen lässt sich die Meldung keiner Einheit zuordnen … Bitte zuerst
den Namen eintragen." mit dem Knopf „Zum Namensfeld" (der Fokus landet im Feld „Ort der
Einheit (Pflicht)"). Die Übersicht nennt dieselbe Lücke „(Standort offen)". Drei Wörter
(Name, Ort, Standort) für ein Feld.

**Erwartung der Rolle:** Ein Helfer liest „Ort der Einheit" und sucht dann ein Feld
„Name". Der Knopf „Zum Namensfeld" und die Anweisung „den Namen eintragen" sagen etwas
anderes als die Beschriftung; wer „Albstadt" (den Ort) einträgt, ist unsicher, ob er der
Aufforderung nachkommt.

**Folge:** Kurzes Zögern, gelegentlich ein Fehleintrag (Einheitsname statt Ort). Kein
Datenverlust.

**Empfehlung:** Warnung, Rückfrage, Knopf und Übersicht auf dasselbe Wort bringen wie die
Feldbeschriftung („Ort der Einheit fehlt", „Zum Feld Ort der Einheit").

**Nachprüfung:** Leeren Bogen anlegen, „In Einsatz übernehmen" tippen, Übersicht öffnen:
in allen drei Meldungen steht „Ort der Einheit" und der Knopf nennt das Feld so.

### R10-E4 [P3] Manuelle Aufnahme: Die Prüfung „Nr. schon vergeben" kommt erst nach der Stärke-Rückfrage, jede Lücke einzeln statt gebündelt (neu)

**Priorität:** P3

**Kennzeichnung:** gemessen (Meldekopf-Aufnahme, Nr. laut Zettel „3" bei bestehender Nr. 3,
Ort „Teststadt", Stärke 0).

**Fundstelle / Aufgabe:** „Einheit manuell erfassen…" → „In Einsatz übernehmen".

**Beobachtung:** Die erste Rückfrage nennt die fehlende Stärke und bietet drei Wege
(„Stärke eintragen" / „Trotzdem mit Stärke 0 übernehmen" / „Abbrechen"). Wer
„Trotzdem …" wählt, bekommt erst danach „Nr. schon vergeben: Nr. 3 gehört schon „THW Ulm
Bergungsgruppe". Eine andere Nummer eintragen oder das Feld leer lassen." mit „Alles
klar". Der Beschluss zur Stärke war damit vorweg gefasst; die Übernahme scheitert trotzdem.

**Erwartung der Rolle:** Beide Mängel auf einmal, oder die Nummernprüfung zuerst.

**Folge:** Ein weiterer Durchlauf am Meldekopf-Telefon im Stehen. Kein Datenverlust; die
Eingaben bleiben erhalten.

**Empfehlung:** Die Nummernprüfung vor die Stärke-Rückfrage ziehen oder beide Hinweise in
einer Rückfrage nennen.

**Nachprüfung:** Wie oben: eine einzige Rückfrage nennt „Nr. vergeben" und „Stärke fehlt",
oder „Nr. vergeben" kommt zuerst.

### R10-E5 [P3] „Rückgängig" für entfernte Meldungen endet mit dem Neuladen; auf dem Telefon kann das Betriebssystem den Tab ohne Zutun beenden (Rest von R9-E2)

**Priorität:** P3

**Kennzeichnung:** gemessen (Neuladen nach „Meldung entfernen" und leer gebliebene
Rückgängig-Leiste); das Beenden des Tabs durch das Betriebssystem ist Risiko, nicht
nachgestellt.

**Fundstelle / Aufgabe:** Sammlung, Karte → „Mehr…" → „Entfernen".

**Beobachtung:** Der Stapel hält: Drei Meldungen nacheinander entfernt, dreimal
„Rückgängig" holt sie in umgekehrter Reihenfolge zurück, die Leiste nennt „· davor noch 2
entfernt". Nach dem Neuladen steht keine Leiste mehr, die Sammlung hat 5 statt 6
Einheiten; `eeb.entfernt.v1` hält nur Kennungen für den Import-Abgleich. Die Rückfrage
sagt die Grenze vorher: „‚Rückgängig' gibt es nur, solange die App geöffnet bleibt".
Person, Fahrzeug und Ebene haben dagegen Rückwege, die das Neuladen überleben (Person
beobachtet).

**Erwartung der Rolle:** Wer nach einem Anruf zum Telefon zurückkehrt, rechnet mit dem
Zustand von vorher. Dass nur manche Rückwege die Unterbrechung überstehen, weiß er nicht.

**Folge:** Eine versehentlich entfernte Meldung ist nach einem Neuladen nur noch über
eine frühere Sammel-PDF oder Sicherung zurückzuholen. Die Rückfrage ist ehrlich, die
Grenze bleibt.

**Empfehlung:** Entfernte Meldungen wie Person und Fahrzeug eine begrenzte Zeit lang
mitspeichern (die Rückfrage nennt sie dann unter „Rückgängig"). Alternativ den Hinweis in
die Leiste selbst setzen, nicht nur in die Rückfrage.

**Nachprüfung:** Meldung entfernen, Seite neu laden: „Rückgängig" oder ein Wiederholungsweg
steht bereit.

### R10-E6 [P3] „Einsatz importieren…" mit falscher Datei: Der Hinweis verweist auf „die PDF des Bogens", nicht auf die Einsatz-Sicherung (neu)

**Priorität:** P3

**Kennzeichnung:** gemessen (`.txt` und `.json` mit `{"a":1}` an den Dateiwegen der
Startseite).

**Fundstelle / Aufgabe:** Startseite, „Einsatz importieren…".

**Beobachtung:** Meldung: „‚falsch.txt' stammt nicht aus dieser App. Beim Absender die
PDF des Bogens anfordern oder den QR-Code scannen." Das ist die Antwort für „Aus Datei
laden…" (Einzelbogen). Wer eine Sammel-PDF oder Einsatzsicherung erwartete, bekommt
einen Rat zu einem anderen Gegenstand. Dagegen nennt „Sicherung einspielen…" richtig
„Eine Sicherung entsteht über ‚Sicherung erstellen…' und heißt eeb-sicherung-….json",
und die Datei „Einzelbogen" im Importweg wird sauber mit „Keine Einsatz-Sammlung in der
Datei … Dafür einen neuen Einsatz anlegen?" beantwortet. Eine Müll-„PDF" nennt die
Ursache („beschädigt oder unvollständig").

**Erwartung der Rolle:** Der Rat nennt die Sammel-PDF des Einsatzes („Einsatz weitergeben
/ sichern").

**Folge:** Ein Umweg bei einer eher seltenen Fehlwahl; kein Datenverlust.

**Empfehlung:** Je Weg die passende Anforderung nennen („… die Sammel-PDF des Einsatzes
beim Absender anfordern").

**Nachprüfung:** Müll-Datei an „Einsatz importieren…": der Hinweis spricht von
Sammel-PDF oder Einsatzsicherung.

### Verweise auf Befunde in anderen Berichten

- Tipps auf die Knöpfe einer Rückfrage oder auf „Rückgängig" gehen kurz nach dem
  Erscheinen verloren, in einer Messreihe mit zwei Rückgängig-Tipps im Abstand von 0,6 bis
  1,2 s wurde der zweite einmal verschluckt: bekannt als R8-H5/S4 (Prellschutz 450/800 ms),
  hier nicht neu gezählt.
- Die Erprobungs-Rückmeldungen (Einheiten-Anzahl-Fläche, linksbündige Organisationslisten)
  habe ich nicht auf Layout geprüft; das ist nicht Gegenstand dieser Rolle.
- Bekannte Grenzen (nicht neu gemeldet): R6-O9, R7-G4/M8, R7-G8/H9, R7-N1, R7-N9, R8-A1,
  R8-M6, R9-M3, R9-G5, R8-H5/S4. Der Stand hat sich in meinen Läufen nicht verändert; die
  Geräteuhr-Warnung und die festen Leisten bei Zoom habe ich nicht gesondert gemessen.

## Bestätigtes (was gut funktioniert und erhalten bleiben sollte)

- **Zahlenfelder** (Schritt 5 und Schnellerfassung): „1,5" → 2 mit „auf ganze Liter
  gerundet: 2", „12.5" → 13, „−5" abgelehnt („Minus geht nicht — … nicht übernommen. Die
  Menge ohne Vorzeichen eintragen."), „abc"/„5"(Vollbreite)/„1e3" als „keine Zahl —
  nicht übernommen", „0012" → 12, 99 999 999 l → Plausibilitätsfrage („mehr als 1.000 l
  je Fahrzeug. Stimmt das?"), 130 Mannschaft → „Stärke: 130 Mannschaft — stimmt das?".
  Ziffernblock (`inputmode="numeric"`) steht an allen Zahlenfeldern. Beim Tippen steht der
  abgelehnte Text kurz im Feld („-3", „3,5"), nach dem Verlassen steht der übernommene
  Wert; die Meldung bleibt stehen.
- **Schalter Sofortbedarf:** „Sofortbedarf entfernen? Diese Angaben gehen verloren: Diesel
  80 l. Die Verpflegung kommt beim erneuten Anhaken wieder aus der Stärke." mit
  „Sofortbedarf entfernen" / „Behalten"; Escape lässt das Häkchen gesetzt.
- **Rückfragen mit Werten und Wegen:** „Lehmann, Tobias entfernen? … ‚Rückgängig' in der
  Leiste unten holt sie zurück"; „Neuen Bogen anfangen?" und „Bogen aus Datei öffnen?"
  nennen den Namen des angefangenen Bogens und den Rückweg „Zuletzt geschlossenen Bogen
  zurückholen"; „Einsatz löschen?" nennt Papierkorb und 30 Tage; „Meldung entfernen?" nennt
  die Nummern, die aufrücken, und die Grenze des Rückgängig.
- **Rückwege:** Person entfernen → Neuladen → Leiste „Entfernt: Lehmann, Tobias /
  Rückgängig" steht weiter, „Rückgängig" holt die Person zurück. Stapel für Meldungen: drei
  entfernt, dreimal zurückgeholt, Reihenfolge stimmt, Nummern kehren zurück. „Abgerückt
  10:20: Nr. 1 …" mit „Rückgängig", Karte zeigt „✓ Abgerückt" gestrichelt.
- **Rohtext-Rettung:** Beschädigte Sammlung → „Nicht lesbar: Sammlung ‚Hochwasser
  Musterstadt' (etwa 2 Meldungen). Liegt beiseite, fehlt in Listen und Zählung." mit „Daten
  sichern…" und „Beiseitegelegtes entfernen…" (Rückfrage „Endgültig entfernen" / „Abbrechen",
  Hinweis auf vorherige Sicherung); Rohtext unter `eeb.unlesbar.v1`. Bei vollem Speicher:
  „Speicher voll – beschädigte Daten nicht gesichert: Sammlung … konnte nicht beiseitegelegt
  werden", der beschädigte Text bleibt unverändert stehen (5 000 Zeichen).
- **Eingabefehler an Dateiwegen:** `.txt` und fremde `.json` am Bogenweg und am
  Sicherungsweg mit Ursache und Anleitung; Müll-„PDF" als „beschädigt oder unvollständig";
  der Sicherungsweg ergänzt „Die Daten auf diesem Gerät sind unverändert".
- **Unterbrechung:** Neuladen direkt nach dem Tippen eines Nachnamens („Müllerxyz") hält den
  Eintrag. Doppeltipp auf „+ Person hinzufügen" und „+ Fahrzeug hinzufügen" legt genau eine
  Karte an; zwei schnelle Mausklicks ebenso. Browser-Zurück aus Schritt 3 geht über die
  Gesamtübersicht zur Startseite, nichts geht verloren. Eine leere Personenkarte zählt in die
  Stärke und wird in „offene Punkte" benannt („1 Personenkarte ohne Angaben zählt in die
  Stärke — ausfüllen oder entfernen").
- **Leerer Bogen:** Alle Schritte sind ohne Pflicht durchlaufbar, die Lücken stehen als
  „3 offene Punkte für die Weitergabe — antippen zum Beheben"; „Bogen übergeben…" nennt sie
  und sagt „Übergeben ist trotzdem möglich".
- **Manuelle Aufnahme:** „Name der Einheit fehlt" führt mit „Zum Namensfeld" an das Feld;
  „Stärke fehlt" bietet drei Wege; „Nr. schon vergeben" nennt, wem die Nummer gehört. Zug
  „2" wird zu „2. Zug", die Zwischensummen führen ihn als eigenen Zug.
- **Rückfragen bei Zoom:** Bei 320 × 568, 180 × 320 (Zoom nachgestellt), 360 × 640 mit
  200 % und 640 × 360 quer mit 200 % liegen Überschrift und beide Knöpfe im Fenster; die
  Knöpfe sind ≥ 44 px hoch und ohne Scrollen erreichbar.
- **„Nur Stärke" aus vollständig:** Rückfrage mit den abgeleiteten Zahlen („startet mit 1
  / 1 / 2 / 4. Die Namen bleiben als Erreichbarkeiten erhalten"), Fokus auf „Abbrechen".

## Abgleich mit Runde 9

Grundlage: [../runde-9/fehler-und-wiederanlauf.md](../runde-9/fehler-und-wiederanlauf.md)
samt „Stand der Behebung" in [../runde-9/README.md](../runde-9/README.md).

| Runde-9-Befund | Stand laut Runde 9 | Bewertung Runde 10 | Beobachtung |
| --- | --- | --- | --- |
| R9-E1 Zahlenfelder: Komma und Minus verschwinden still (P2) | behoben | hält | Gerundet mit Satz, Minus/Text abgelehnt mit Satz, 0012 → 12; Rest siehe Bestätigtes (Text steht bis zum Verlassen im Feld). |
| R9-E2 Rückgängig holt nur die letzte Meldung (P2) | behoben (Stapel von 20, bis Neuladen) | hält, Rest R10-E5 | Drei von drei zurückgeholt, Nummern stimmen; nach Neuladen weg, wie die Rückfrage sagt. |
| R9-E3 Zwei-Fenster-Leiste ohne Richtung (P3) | behoben | nicht neu geprüft | Zwei Fenster nicht nachgestellt; nicht in dieser Runde gemessen. |
| R9-E4 „Beiseitegelegtes entfernen…" bei Vorlagen (P3) | behoben | hält (Sammlung geprüft) | Rückfrage nennt Ersetzen des Originaltextes und vorherige Sicherung; Vorlagen-Fall nicht erneut gemessen. |
| R9-E5 Rohtext-Rettung bei vollem Speicher stumm (P3) | behoben | hält | Meldung „Speicher voll – beschädigte Daten nicht gesichert", Rohtext unverändert. |
| R9-E6 Zug „2"/„Z2" wird nicht „2. Zug" (P3) | behoben | hält teilweise geprüft | „2" → „2. Zug" gemessen; „Z2" nicht erreicht (Messlauf nach der ersten Zuordnung abgebrochen), kein Gegenbefund. |
| R9-E7 „Stärke übernehmen" ausgegraut ohne Grund (P3) | behoben | nicht neu geprüft | Dialog „Stärke ändern…" nicht geöffnet. |
| R9-D1 Funkrufname-Schalter | behoben (Merker) | teilweise | Merker nur bis Neuladen, keine Rückfrage (R10-E2). |
| R8-H5/S4 Tipp-Sperre nach Ansichtswechsel/Erscheinen (P3) | teilweise (bekannte Grenze) | teilweise (bekannte Grenze) | Zweiter Tipp auf „Rückgängig" im Abstand ≈ 0,6 s verschluckt; Weiter-Tipps im Abstand 0,7 s ebenfalls einmal nicht angenommen, bei ≥ 1 s angenommen. |

Nebenwirkungen der Runde-9-Änderungen und der Erprobungs-Rückmeldungen: Die Umbenennung
„Name" → „Ort der Einheit (Pflicht)" ist in Warnung, Rückfrage und Übersicht nicht
mitgezogen worden (R10-E3). Die neuen Rückfragen haben die Schnellerfassung in der einen
Richtung abgesichert, in der anderen nicht (R10-E1). Eine Behebung hat sonst nichts
verschlechtert.

Bilanz: Alle fünf geprüften Runde-9-Befunde halten im Browser (zwei Restpunkte). Neu: R10-E1
(P2), R10-E2 bis R10-E6 (je P3).

## Abschluss

- **Aufgabe geschafft:** ja. Eigener Bogen, Meldekopf-Erfassung, Korrektur nach
  Fehleingaben, Wiederanlauf nach Neuladen, Abbruch, Zurück-Geste, falsche Dateien,
  beschädigter und voller Speicher gehen ohne fremde Hilfe.
- **Fremde Hilfe nötig:** nein.
- **Größtes Missverständnis:** „Personal vollständig erfassen" wirkt wie ein harmloser
  Umschalter; er verwirft die eingetragenen Schnellerfassungs-Zahlen (R10-E1). Und
  „Rückgängig" gilt je nach Gegenstand mit oder ohne Neuladen (R10-E5).
- **Größtes Einsatzrisiko:** Ein Fehltipp auf den Umschalter löscht am Meldekopf die gerade
  abgetippte Stärke einer Einheit, ohne Rückfrage und ohne Rücknahme (R10-E1).
- **Top-Priorität für die nächste Iteration:** Den Umschalter „Personal vollständig
  erfassen" wie die Gegenrichtung absichern (Rückfrage mit den Zahlen oder Rücknahme-Leiste)
  (R10-E1).
