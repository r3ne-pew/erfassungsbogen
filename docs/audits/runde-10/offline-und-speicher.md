# Audit Runde 10 – Offline und Speicher (Erstladen, Funkloch, voller Speicher, zwei Fenster, Sicherung, Lagemonitor, Geräteuhr, Rohtext-Rettung)

Stand: 25.10.2026 · Code-Stand: Commit `441811c` (Produktionsbuild, `vite preview` auf Port 4173) · Prüfer: Rollenaudit
`thw-offline-resilience-reviewer`

Reiner Prüfbericht, keine Codeänderung. Schwerpunkt waren die Behebungen aus Runde 9, soweit sie Offline-Betrieb und
Speicher berühren: Rohtext-Rettung bei vollem Speicher (R9-O1), Lagemonitor bei unlesbarer Sammlung (R9-O2), Absenderkarte
und „Alle Daten löschen“ (R9-O3), Sicherung einspielen mit Beiseitegelegtem, Rückfragen in den neuen Wegen, dazu die
parallelen Änderungen aus der Erprobung („Ort der Einheit (Pflicht)“).

## Prüfaufbau

- **Server:** der gemeinsame Server auf Port 4173, nicht neu gebaut, nicht angehalten, kein eigener Proxy. Funkloch-Läufe
  mit `setOffline` nach geladenem Service Worker (`navigator.serviceWorker.controller` vorhanden).
- **Geräte:** Telefon 360 × 640 als Grundeinstellung, dazu 320 × 568 mit `html{font-size:200%}`, 640 × 360 quer mit 200 %,
  Browser-Zoom nachgestellt (180 × 320 bei Gerätefaktor 2). `isMobile`/`hasTouch`, Locale de-DE, je Lauf ein eigener
  Browser-Kontext. Tablet nicht eigens: Die geprüften Zustände hängen nicht an der Breite.
- **Zustände:** `localStorage`-Seeds (Entwurf Verstärkter Bergungszug, Sammlung „Hochwasser Musterstadt“ mit 6 Einheiten aus
  `examples/thw/`), alle `uebung: false`, Stand auf heute. Beschädigte Gesamttexte in `eeb.einsaetze.v1`
  (`[{"id":"s1","name":"Hoch`), `eeb.vorlagen.v1` (`[[[`), `eeb.absenderkarte.v1` (`{"x`), `eeb.entwurf.v1` (abgebrochen).
  Speicher voll per `setItem`-Stub (`QuotaExceededError`), gezielt für `eeb.unlesbar.v1` und `eeb.entwurf.beschaedigt.v1`
  bzw. für `eeb.entwurf.v1`; zweites Fenster im selben Kontext, das Schlüssel direkt schreibt; Uhrstand `eeb.uhr.v1`
  100 Tage voraus; Füllschlüssel mit 3,5 Mio. Zeichen für die Speicheranzeige.
- **Reihenfolge:** Blind getestet wurden Offline-Erstladen und Neuladen, beschädigte Texte, voller Speicher beim Entwurf,
  Sammlung im zweiten Fenster. Danach habe ich den Bericht Runde 9 und „Stand der Behebung“ gelesen und die Behebungen
  gezielt nachgestellt. Bildschirmfotos habe ich angesehen.
- Skripte und Bildschirmfotos: Scratchpad `runde10/o/` (nicht im Repo).

**Nicht prüfbar:** Kamera-Scan und Nahbereichs-Weitergabe, echter Flugmodus und echte Funkzelle, hängende (statt tote)
Leitung, Speicherräumung durch iOS/Safari, Update-Banner bei neuer Fassung (zweiter Build nötig), native Builds,
Wiederherstellung des Sitzungsspeichers nach Prozess-Ende des Browsers.

## Urteil

Die Offline-Fähigkeit trägt. Nach dem Erstladen (549 Zusatzdateien, nach etwa 10 s „✓ Jetzt offline bereit. Funktioniert
komplett offline“) liefern Startseite, Anleitung und unbekannte Pfade auch ohne Netz die App; beim Start gehen nur Abrufe
an die eigene Adresse. Die Behebung des einzigen P2 dieser Rolle aus Runde 9 (R9-O1) hält in allen drei gemessenen Wegen:
Ist der Speicher voll und lässt sich ein beschädigter Text nicht beiseitelegen, bleibt er unverändert unter seinem
Schlüssel, und die Startseite sagt es („Speicher voll – beschädigte Daten nicht gesichert … Der Text liegt unverändert auf
dem Gerät, die App überschreibt ihn nicht“, Wege „Daten sichern…“ und „Beschädigten Text verwerfen…“). Auch das Anlegen
einer neuen Sammlung in diesem Zustand überschreibt nichts: Der Dialog „Sammlung nicht angelegt“ nennt Grund und Weg. Der
Lagemonitor sagt bei unlesbarem Text jetzt „Sammlung nicht lesbar – letzter Stand von 10:19 Uhr; Hauptfenster: ‚Daten
sichern…‘“ und zeigt den Stand weiter (R9-O2). Absenderkarte wird beiseitegelegt und gemeldet, „Alle Daten löschen“ und
„Sicherung einspielen“ nennen das Beiseitegelegte mit Zahl.

Neue Befunde sind nur Wortlaut und Anzeige (vier P3). Die Aufgaben „offline weiterarbeiten, übergeben, sichern, in der
Sammlung zusammenführen, Lage ansehen, Daten retten“ gelingen ohne fremde Hilfe.

## Befunde

P0: keine. P1: keine. P2: keine. P3: vier.

### P3

#### R10-O1 – Hinweis „Speicher voll – beschädigte Daten nicht gesichert“ mit falscher Grammatik (gemessen)

- **Priorität:** P3
- **Kennzeichnung:** gemessen (Startseite, Speicher für `eeb.unlesbar.v1` gesperrt).
- **Fundstelle:** Startseite, Hinweis zu nicht beiseitegelegtem Text; `src/app/unlesbar.ts` und Startseiten-Hinweis.
- **Beobachtung:** Der Satz lautet „gespeicherte Einsatz-Sammlungen ist nicht lesbar und konnte nicht beiseitegelegt werden“
  bzw. „gespeicherte Vorlagen ist nicht lesbar“. Der Plural steht mit „ist“, der Satz klingt wie ein Tippfehler. Bei der
  Absenderkarte (Singular) stimmt der Bau im Normalfall.
- **Erwartung der Rolle:** Ein Hinweis im Ausnahmefall liest sich unter Stress ohne Stolpern; ein holpriger Satz lässt am
  Inhalt zweifeln.
- **Folge:** Gering. Die Aussage bleibt verständlich, kostet aber Vertrauen genau im Fehlerfall.
- **Empfehlung:** Den Namen der Art im Satz beugen („Die gespeicherten Einsatz-Sammlungen sind nicht lesbar …“).
- **Nachprüfung:** Beschädigten Text und gesperrtes Beiseitelegen setzen; Satz für Sammlungen, Vorlagen und Absenderkarte
  lesen.

#### R10-O2 – Ratschlag bei vollem Speicher nennt Wege, die bei unlesbarer Sammlung nicht offenstehen (gemessen)

- **Priorität:** P3
- **Kennzeichnung:** gemessen im konstruierten Zustand (unlesbare Sammlung und gesperrtes Beiseitelegen); dass beides
  zugleich auftritt, ist Risiko.
- **Fundstelle:** Startseite, aufgeklappter Hinweis „Speicher voll – beschädigte Daten nicht gesichert“ und die Leiste
  „Der Speicher dieses Geräts ist voll … Platz schafft nur Löschen: nicht mehr benötigte Einsätze sichern, den Papierkorb
  leeren oder einen gesicherten Einsatz dort ‚Endgültig löschen…‘“.
- **Beobachtung:** Die Sammlungen sind unlesbar, die Liste ist leer. Der Rat „Papierkorb leeren oder gesicherte Einsätze
  löschen“ führt ins Leere: Es gibt weder Einsatz noch Papierkorb zum Anfassen. Offen bleiben nur „Daten sichern…“,
  „Beschädigten Text verwerfen…“, Vorlagen und Entwurf. Der Hinweis nennt das nicht; der Weg „verwerfen“ steht nur als
  Knopf.
- **Erwartung der Rolle:** Der Ratschlag passt zum Zustand: erst sichern, dann verwerfen (schafft den Platz), dann neu
  einlesen.
- **Folge:** Gering. Wer dem Text folgt, sucht Einsätze, die er nicht sehen kann, und verliert Zeit.
- **Empfehlung:** Bei unlesbarer Sammlung den Platz-Rat auf „sichern, dann den beschädigten Text verwerfen“ ändern.
- **Nachprüfung:** Zustand wie oben herstellen; der Rat nennt nur erreichbare Wege.

#### R10-O3 – Pflichtfeld heißt „Ort der Einheit“, Begleittexte und Hinweis sprechen weiter von „Name“ (beobachtet)

- **Priorität:** P3
- **Kennzeichnung:** beobachtet (Schritt 1 Einheit, 360 × 640). Ein anderer Bericht (Neuer Nutzer, Arbeitsablauf) kann die
  Beschriftung ebenfalls treffen: dann Verweis.
- **Fundstelle:** Schritt „1. Einheit“, Erklärtext unter „Zugehörigkeit / Kontaktstellen“ und Pflichthinweis unter dem
  Formular.
- **Beobachtung:** Das Feld heißt „Ort der Einheit (Pflicht)“. Der Erklärtext sagt „Aus Name, Organisation und Einheitstyp
  bildet sich die Bezeichnung“, die Warnung „⚠ Zugehörigkeit: Der Name der eigenen Einheit (unterste Ebene) fehlt.“
- **Erwartung der Rolle:** Feld, Erklärung und Warnung benutzen dasselbe Wort; wer „Name“ liest, sucht ein Feld, das es so
  nicht mehr gibt, und trägt womöglich „Bergungsgruppe 2“ statt des Ortes ein.
- **Folge:** Gering bis mittel für die Übergabe: ein falscher Eintrag steht auf dem Bogen und in der Sammlung (wirkt auf die
  Zusammenführung, R7-N1 bekannte Grenze).
- **Empfehlung:** Erklärtext und Warnung auf „Ort der Einheit“ umstellen.
- **Nachprüfung:** Neuen Bogen öffnen, Schritt 1 lesen: kein „Name“ mehr für dieses Feld.

#### R10-O4 – Speicheranzeige „etwa 1 % (0 von 5 Mio. Zeichen)“ widerspricht sich (gemessen)

- **Priorität:** P3
- **Kennzeichnung:** gemessen (Datensicherung, Entwurf 14 986 und Sammlung 19 851 Zeichen belegt).
- **Fundstelle:** Dialog „Datensicherung“, Zeile „Belegter Speicher“.
- **Beobachtung:** Bei rund 35 000 belegten Zeichen steht „etwa 1 % (0 von 5 Mio. Zeichen)“; bei 0 belegten Zeichen ebenfalls
  „0 %“. Ab 3,5 Mio. Zeichen steht „etwa 71 % (3,5 von 5 Mio.)“ mit Warntext. Die Zahl „0“ wird auf Millionen gerundet und
  passt nicht zu „1 %“.
- **Erwartung der Rolle:** Prozent und Menge sind zueinander stimmig; kleine Mengen in Tausend.
- **Folge:** Gering. Wer „0 von 5 Mio.“ liest, hält den Speicher für leer, obwohl Daten liegen.
- **Empfehlung:** Unter einer Million Zeichen in Tausend angeben („35 Tsd. von 5 Mio.“).
- **Nachprüfung:** Mit kleinem Entwurf Dialog öffnen: Menge und Prozent passen zusammen.

## Bestätigtes

- **Offline-Erstladen:** Fortschritt „(66 von 549)“ → „(369 von 549)“ → „✓ Jetzt offline bereit. Funktioniert komplett offline“;
  danach Neuladen und Pfade `/`, `/anleitung`, `/themen`, `/foo` ohne Netz mit Status 200 und App-Titel; `eeb-zusatz` hält 549
  Einträge. Wer zu früh offline geht, sieht „⏳ Wird für den Offline-Betrieb geladen: 0,7 von 7,0 MB — bitte mit Netz geöffnet
  lassen“.
- **Rohtext-Rettung (R9-O1):** Mit gesperrtem `eeb.unlesbar.v1` bleiben `eeb.einsaetze.v1` (`[{"id":"s1","name":"Hoch`),
  `eeb.vorlagen.v1` (`[[[`) und `eeb.entwurf.v1` unverändert; Entwurf: „Ein Bogen ließ sich nicht öffnen und nicht
  beiseitelegen — Speicher voll“. Neue Sammlung anlegen in diesem Zustand: „Sammlung nicht angelegt“, Rohtext unverändert.
  Ohne Sperre landen Sammlung, Vorlagen, Absenderkarte in `eeb.unlesbar.v1` und der Startseitenhinweis zählt alle drei.
- **Kasten beschädigter Entwurf:** nennt Ursache, „Als Datei sichern“, „Entfernen…“ und die Löschfrist („23.01.2027, 90 Tage
  nach dem Beiseitelegen“). „Beiseitegelegte Einträge entfernen?“ erklärt, dass der Text am alten Ort durch den lesbaren Rest
  ersetzt wird, und verweist vorher auf „Daten sichern…“.
- **Lagemonitor (R9-O2):** zweites Fenster setzt `eeb.einsaetze.v1` auf `xx`: Stärke 1 / 15 / 43 // 59 bleibt, dazu „Sammlung
  nicht lesbar – letzter Stand von 10:19 Uhr; Hauptfenster: ‚Daten sichern…‘“; nach Wiederherstellung verschwindet der Satz.
- **Alle Daten löschen / Sicherung einspielen (R9-O3, D2):** Liste „Betroffen sind“ nennt „beiseitegelegte, nicht lesbare
  Daten … 1 Eintrag, 107 Zeichen — nur ‚Vorher Sicherung erstellen…‘ hebt sie auf“; der Einspiel-Dialog nennt Sammlung,
  „beschädigt: Vorlagen“, „beiseitegelegt: 1 nicht lesbarer Eintrag … ohne Sicherung weg“, die Datei mit Zeitstempel, einen
  eigenen Haken und „Vorher Sicherung erstellen…“. Sicherungsdatei `eeb-sicherung-2026-10-25.json` (39 849 Byte) entsteht
  ohne Netz.
- **Entwurf sofort gespeichert:** Eingabe in „Ort der Einheit“ steht schon nach 0 ms im Speicher; Seite direkt nach dem
  Tippen geschlossen, beim Wiederöffnen ist der Wert da. Voller Speicher: feste Leiste „⚠ Nicht gespeichert — der Speicher
  dieses Geräts ist voll. Jetzt ‚Bogen übergeben‘ (PDF).“ mit „Was tun?“.
- **Zwei Fenster:** Sammlung: Änderung im anderen Fenster erscheint ohne Neuladen („Neu seit der letzten Kenntnisnahme (1)“,
  Zähler 7). Entwurf: „⚠ Hier wird nichts gespeichert. Das andere Fenster hat den Bogen geändert: Einheit (dort: …, hier: …)“
  mit beiden Werten; weiteres Tippen überschreibt den Speicher nicht; „Meine Fassung behalten“ fragt mit dem Wert des anderen
  Fensters nach und legt ihn unter „Zuletzt geschlossener Bogen“ ab.
- **Geräteuhr:** Uhr 100 Tage zurückgegangen: Warnung „Bis du antwortest, löscht und anonymisiert die App nichts“ mit „Geräteuhr
  stimmt“ / „Uhr korrigieren“.
- **Keine Fremdanfragen:** Beim Start gehen nur Abrufe an die eigene Adresse.

## Bekannte Grenzen (Stand)

| Grenze | Stand Runde 10 |
| --- | --- |
| R6-O9 Uhrstand in der Zukunft, frische Sammlung | gemessen unverändert: Uhrstand 100 Tage voraus, Sammlung (1 h alt) ist beim Start bereits `[]` (2 Zeichen), die Warnung sagt „löscht … nichts“ |
| R9-G5 feste Leisten bei Zoom | gemessen: Speicher-voll-Leiste bei 320 × 568 mit 200 % 276 von 568 px, zusammen mit der Fußleiste 354 px (62 %), Knopf „Was tun?“ im Bild; bei 180 × 320 90 + 58 px |
| R7-G8/H9 Geräteuhr-Warnung bei 200 % und 320 × 568 | nicht nachgestellt |
| R8-A1, R8-M6, R8-H5/S4, R7-G4/M8, R7-N1, R7-N9, R9-M3 | berühren diese Rolle nicht, nicht nachgestellt |

## Abgleich mit Runde 9

Grundlage: `docs/audits/runde-9/offline-und-speicher.md` (R9-O1 P2, R9-O2 und R9-O3 je P3) und „Stand der Behebung“ in
`docs/audits/runde-9/README.md`. Gegen Build `441811c` nachgestellt.

| Befund Runde 9 | Stand laut Bericht | Bewertung Runde 10 | Beobachtung |
| --- | --- | --- | --- |
| R9-O1 Rohtext bei vollem Speicher still verworfen (P2) | behoben | hält | Sammlung, Vorlagen, Entwurf bleiben unverändert, Hinweis auf der Startseite; Wortlaut siehe R10-O1, R10-O2. |
| R9-O2 Lagemonitor „nicht (mehr) vorhanden“ bei unlesbarem Text (P3) | behoben | hält | „Sammlung nicht lesbar – letzter Stand von 10:19 Uhr“, Stärke bleibt. |
| R9-O3 Absenderkarte als „keine Angabe“ (P3) | behoben | hält | Absenderkarte beiseitegelegt und im Startseitenhinweis genannt. |
| R9-O3 „Alle Daten löschen“ nennt Beiseitegelegtes nicht (P3) | behoben | hält | Zeile mit Zahl und Zeichen; Löschfolge nicht bis zum Ende bedient (Risiko, Dialogtext gemessen). |
| R9-D2 Sicherung einspielen verschweigt Beiseitegelegtes | behoben | hält | Eigene Zeile, eigener Haken, Weg „Vorher Sicherung erstellen…“. |
| R9-E4 Aufräumen ersetzt Originaltext | behoben | hält | Dialog nennt es; nach „Entfernen“ nicht bis zum Ende bedient. |

Nebenwirkungen der Runde-9-Änderungen, die ich gesucht habe:

| Änderung Runde 9 | Nebenwirkung gefunden? |
| --- | --- |
| Hülle lässt kein Überschreiben zu | Nein: neue Sammlung und Entwurf lassen den Rohtext liegen. Nur Wortlaut (R10-O1, R10-O2). |
| Absenderkarte beiseitegelegt | Nein. |
| Rückwege (Stapel, Sitzungsspeicher) | Nicht berührt. |
| Zeitsperre 600 ms nach Ansichtswechsel | Beobachtet: ein Tipp auf „In den Papierkorb“ 600 ms nach dem Öffnen des Dialogs wurde nicht angenommen (Knopf zeigt „Einen Moment …“), nach 1,5 s ging er. Gewollt (R8-H5/S4), kein Befund. |
| Ort der Einheit statt Name | Wortlaut-Rest (R10-O3). |

Bilanz: Alle drei Runde-9-Befunde dieser Rolle sind behoben und halten. Neu in Runde 10: vier P3 (Wortlaut und Anzeige).

## Abschluss

- **Aufgabe geschafft:** ja.
- **Fremde Hilfe nötig:** nein.
- **Größtes Missverständnis:** Wer bei „Speicher voll“ dem Rat folgt, Einsätze zu löschen, sucht Einsätze, die bei unlesbarer
  Sammlung gar nicht erreichbar sind (R10-O2).
- **Größtes Einsatzrisiko:** Der bekannte Fall mit zurückgestellter Uhr (R6-O9): eine frische Sammlung ist beim Start bereits
  weg, die Warnung sagt „löscht nichts“.
- **Top-Priorität für die nächste Iteration:** Wortlaut im Rettungsfall (R10-O1, R10-O2) und Feldname „Ort der Einheit“ in
  Begleittext und Warnung (R10-O3) angleichen.
