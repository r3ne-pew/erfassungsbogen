# Audit „Zerstörende Handlungen", Runde 10 (Löschen, Überschreiben, Statuswechsel)

Stand: 25.10.2026 · Prüfer: Rollenaudit `thw-destructive-action-reviewer` ·
Prüfgegenstand: Web-App, Produktionsbuild (`vite preview`, Port 4173),
Code-Stand Commit `441811c` (Zweig `main`).

Reiner Prüfbericht, keine Codeänderung. Wiederholung nach der Behebung der
Runde-9-Befunde (siehe [../runde-9/zerstoerende-handlungen.md](../runde-9/zerstoerende-handlungen.md)
und [../runde-9/README.md → Stand der Behebung](../runde-9/README.md#stand-der-behebung-25102026)).
Zuerst habe ich ohne Blick in die Berichte getestet (Startseite, Assistent,
Sammlung, Datensicherung, Papierkorb, Rohtext-Rettung), danach den Runde-9-Bericht
und den Stand der Behebung gelesen und die Behebungen einzeln nachgespielt.

## Prüfaufbau

Chromium (Playwright aus `node_modules`, `/opt/pw-browsers/chromium`,
`--no-sandbox`), `isMobile`/`hasTouch`, Locale de-DE, Tipps als Touch-Tipp
(`tap`, `touchscreen.tap`), Tastaturfälle mit `keyboard.press`. Grundeinstellung
Telefon 360 × 640; dazu 320 × 568, 640 × 360 quer, Zoom-Nachbildung (Telefon bei
Faktor 2, also 180 × 320 CSS-Pixel) und `html { font-size: 200% }` bei 360 × 640
und 320 × 568. Jeder Lauf in einem eigenen Browser-Kontext; der Server wurde
weder neu gebaut noch angefasst. Die Tablet-Größe 820 × 1180 habe ich in dieser
Runde nicht erneut gespielt (Stand Runde 9 unverändert angenommen, nicht
gemessen).

Zustände kamen aus `localStorage`-Seeds: `eeb.entwurf.v1` mit dem Großbogen
„Verstärkter Bergungszug" (38 Personen, 10 Fahrzeuge) bzw. Bögen aus
`examples/thw/`; `eeb.einsaetze.v1` mit sechs Einheiten; zusätzlich
`eeb.entwurf.ersetzt.v1` (Rückholplatz belegt), ein auf 300 Zeichen
abgeschnittener Sammlungstext (Rohtext-Rettung), eine Sicherungsdatei aus der App
und Bogen-Dateien mit gleichem bzw. neuerem Stand; alle `uebung: false`, Stand auf
heute (25.10.2026).

Szenarien:

1. Startseite: „Verwerfen" (auch mit belegtem Rückholplatz), „Neuen Bogen
   erstellen" mit Entwurf, „Zuletzt geschlossenen Bogen zurückholen" bei
   vorhandenem Entwurf, „Einsatz löschen…" mit Papierkorb, „Wiederherstellen" und
   „Endgültig löschen…", „Alle Daten löschen" (mit und ohne Haken),
   „Geräteschlüssel neu erzeugen", Vorlage speichern und „Löschen".
2. Einsatzansicht: „Abrücken" (Zweittipp nach 0,1 bis 4 s, Rückgängig),
   „Entfernen" (Rückfrage, Doppeltipp, Neuladen), „Stärke ändern…",
   „Verschieben…", „Aufteilen…", „Bögen einlesen…" mit gleichem und neuerem
   Stand, „Einheit manuell erfassen…" (leer übernehmen, Zurück mit Eingaben,
   zweites Öffnen).
3. Assistent: „Person entfernen" (Rückgängig, Schrittwechsel, Neuladen), „Fahrzeug
   entfernen", „Ebene entfernen", Schalter „Sofortbedarf erfassen" und
   „Funkrufname", „Namen einfügen…" mit „Liste leeren", „Bogen schließen".
4. Datensicherung: „Sicherung erstellen…" und „Sicherung einspielen…", jeweils
   auch mit beiseitegelegtem Sammlungstext.
5. Beschädigter Sammlungstext: Karte „Nicht lesbar", „Daten sichern…",
   „Beiseitegelegtes entfernen…".
6. Rückfragen bei 360 × 640, 320 × 568, 640 × 360, 200 % Schrift und 180 × 320:
   Knopfmaße, Lage, Lage des Namens im sichtbaren Teil.

**Nicht prüfbar:** zwei echte Geräte an einer Sammlung, Beenden der App durch
das Betriebssystem, Kamera-Scan, native Builds, Handschuhe, das echte Verstreichen
von 30 bzw. 90 Tagen, eine echt falsch gestellte Geräteuhr, „Lage vom Papier
abgleichen…" und Sicherungen, die größer als der Speicher des Geräts sind. Die
Zeitangabe in den Bogen-Seeds („Stand 14:35" bei Gerätezeit etwa 14:36) kommt aus
meinem Seed, nicht aus der App.

## Urteil

Die Löschwege halten und sind seit Runde 9 dichter geworden. Alle fünf
Runde-9-Befunde aus meiner Rolle sind nachgestellt: Der Schalter „Sofortbedarf
erfassen" fragt mit den Werten, bevor er sie verwirft (R9-D1), „Sicherung
einspielen…" und „Alle Daten löschen" nennen den beiseitegelegten Text mit Zahl und
verlangen für das Einspielen einen eigenen Haken (R9-D2), „Person", „Fahrzeug" und
„Ebene entfernen" haben alle ein „Rückgängig", das auch das Neuladen überlebt
(R9-D3), beide Rückfragen mit ersetzender Wahl haben den Fokus auf der
schonenden Wahl (R9-D4), und die Rückfrage „Meldung entfernen?" beginnt mit der
Nummernfolge (R9-D5, Rest siehe R10-D1). Jede endgültige Handlung nennt vor dem
Auslösen Namen, Zahl und Folge, die Rückfragen setzen den Fokus auf „Abbrechen" bzw.
die schonende Wahl, ein Tipp neben die Rückfrage schließt sie nicht, und ein
Doppeltipp auf die rote Wahl löst nur einmal aus.

Neu sind drei kleine Ränder (alle P3): Bei 180 × 320 steht der Name der zu
entfernenden Meldung unter dem roten Knopf (R10-D1), der Schalter „Funkrufname"
behält die Nummer nur, solange man im selben Schritt bleibt (R10-D2), und
„Liste leeren" in „Namen einfügen…" leert eine eingefügte Liste ohne Rückfrage
(R10-D3). Ein P0, P1 oder P2 habe ich nicht gefunden; alle Aufgaben lassen sich
ohne fremde Hilfe erledigen.

## Übersicht: Handlung → Bestätigung → Rückweg

Alles beobachtet bzw. im Speicher gemessen.

| Handlung | Bestätigung | Rückweg (geprüft) |
| --- | --- | --- |
| „Verwerfen" (Startseite) | Rückfrage mit Name; bei belegtem Rückholplatz der Zusatz „fasst nur einen Bogen … wird endgültig gelöscht" mit Name, Stand, Personenzahl | „Zuletzt geschlossenen Bogen zurückholen" |
| „Neuen Bogen erstellen" mit Entwurf | Rückfrage „Neuen Bogen anfangen?" mit Name | Rückholplatz |
| „Zuletzt geschlossenen Bogen zurückholen" mit Entwurf | Rückfrage „wird durch … ersetzt", tauscht beide | Rückholplatz hält den Verdrängten |
| „Einheit manuell erfassen…" mit angefangener Erfassung | Rückfrage „Angefangene Erfassung" mit „fortsetzen / Verwerfen und neue Einheit erfassen / Abbrechen"; „‹ Einsatz" behält den Entwurf | Entwurf (506 Zeichen) bleibt |
| „Einsatz löschen…" | Rückfrage „30 Tage zurückholen", Zahl der Meldungen, Fokus „Abbrechen" | Papierkorb „Wiederherstellen" (gemessen: Sammlung 19 851 Zeichen wieder da) und „Rückgängig" |
| Papierkorb „Endgültig löschen…" | Rückfrage mit Zahl, „fremde Personendaten", „einzige Kopie", Fokus „Abbrechen" | keiner, bewusst |
| „Alle Daten löschen" | Aufzählung mit Zahlen, auch beiseitegelegter Text („1 Eintrag, 22.338 Zeichen — nur ‚Vorher Sicherung erstellen…' hebt sie auf"), Haken, Knopf `disabled` bis zum Haken | Sicherungsdatei |
| „Sicherung einspielen…" | Aufzählung beider Seiten, Beiseitegelegtes mit eigenem Haken, Knopf `disabled` | Sicherungsdatei |
| „Geräteschlüssel neu erzeugen" | Rückfrage mit Folgen, Fokus „Abbrechen" | Sicherungsdatei |
| „Person entfernen" | Rückfrage mit Name | Quittung „Rückgängig", überlebt Schrittwechsel und Neuladen (gemessen) |
| „Fahrzeug entfernen" | Rückfrage mit Bezeichnung, nennt „auch nach ‚Weiter' oder Neuladen, 15 Minuten" | „Rückgängig" nach Neuladen vorhanden (gemessen) |
| „Ebene entfernen" | Rückfrage nennt Telefon und E-Mail, 15 Minuten | „Rückgängig" nach Neuladen vorhanden; 3 Ebenen wieder da |
| Schalter „Sofortbedarf erfassen" aus | Rückfrage mit Werten („Diesel 620 l, Benzin 40 l, Gemisch 20 l, Unterbringung, Ruhezeit"), Wahl „Behalten" | keiner (Rückfrage genügt als Schutz; siehe Bestätigtes) |
| Schalter „Funkrufname" aus | keine; Nummer bleibt nur im Schritt (R10-D2) | im Schritt: wieder an stellt 71/25 wieder her |
| „Liste leeren" („Namen einfügen…") | keine | keiner (R10-D3) |
| „Abrücken" | keine, mit Quittung | „Rückgängig"; Zweittipp an der Knopfstelle bis 4 s ohne Wirkung |
| „Entfernen" (Meldung) | Rückfrage mit Nummernfolge, Name, „nur solange die App geöffnet bleibt" | „Rückgängig" (nicht nach Neuladen, wie angesagt) |
| „Stärke ändern…" | Dialog mit bisheriger Stärke, „die bisherige Meldung wandert in die Historie" | Historie |
| „Bögen einlesen…" gleicher Stand | Dialog „Zwei Fassungen", Fokus „Bisherige behalten" | Historie |
| „Bögen einlesen…" neuerer Stand | Quittung „Folgemeldung … Stärke 4 → 3 (−1)" | Historie (7 Fassungen im Speicher) |
| „Verschieben…" ohne zweite Sammlung | Hinweis „Es gibt keine andere Einsatz-Sammlung auf diesem Gerät", „Alles klar" | — |
| „Als Vorlage speichern" / Vorlage „Löschen" | Name; Löschen ohne Rückfrage | Papierkorb Vorlagen (30 Tage) und „Rückgängig" |
| Beschädigter Sammlungstext | Karte „Nicht lesbar: Sammlung … (etwa 6 Meldungen)", „Daten sichern…", „Beiseitegelegtes entfernen…" (fragt, Fokus „Abbrechen") | Sicherungsdatei, Rohtext unter `eeb.unlesbar.v1` |
| Sicherung einspielen mit falscher Datei | nicht erneut gespielt (Stand Runde 9) | — |

## Befunde

### R10-D1 [P3] Bei 180 × 320 und 200 % Schrift steht der Name der Einheit in „Meldung entfernen?" unter dem roten Knopf (Rest von R9-D5)

**Priorität:** P3

**Kennzeichnung:** gemessen (Lage der Absätze der Rückfrage und des festen Fußes,
`getBoundingClientRect`).

**Fundstelle / Aufgabe:** Einsatzansicht → Einheit aufklappen → „Mehr…" →
„Entfernen".

**Beobachtung:** Der erste Absatz nennt jetzt die Nummernfolge („Nummern ändern
sich: Die Einheiten Nr. 2–6 rücken auf …"), wie in R9-D5 empfohlen. Die Überschrift
bleibt aber „Meldung entfernen?" ohne Namen; Name der Einheit und Satz zum
„Rückgängig" stehen in Absatz 2 und 3.

| Lage | Fuß (rote Wahl) beginnt bei | Absatz „„THW Hamburg Mitte …" wird … entfernt" | sichtbarer Rumpf |
| --- | --- | --- | --- |
| 360 × 640 | 466 | 203–299 (sichtbar) | 433 von 506 px |
| 320 × 568 | 394 | 227–323 (sichtbar) | 361 von 554 px |
| 360 × 640, 200 % | 414 | 290–440 (zum Teil) | 381 von 785 px |
| 320 × 568, 200 % | 342 | 290–470 (zum Teil) | 309 von 875 px |
| 180 × 320 (Zoom) | 184 | 265–412 (nicht sichtbar) | 153 von 735 px |

Im Zoom steht „Meldung entfernen" (rot, 146 × 44) im Bild, der Name der Meldung
und der Satz „nur solange die App geöffnet bleibt" erst nach dem Rollen. Der Rumpf
rollt, ein Schattenrand deutet es an, alle Knöpfe bleiben 44 px hoch.

**Erwartung der Rolle:** Wer entfernt, sieht im Bild, *was* entfernt wird. Bei
„Person entfernen" und „Fahrzeug entfernen" steht der Name in der Überschrift;
bei der Meldung nicht.

**Folge:** Bei Zoom oder sehr großer Schrift kann der Helfer die Wahl treffen,
ohne die Einheit gelesen zu haben, die er gerade aufgeklappt hat; „Rückgängig"
fängt es ab, solange die App geöffnet bleibt. P3, weil die Einheit unmittelbar
vorher aufgeklappt war und das Zoom-Verhalten sonst hält (Verweis auf bekannte
Grenze R9-G5 für feste Leisten, hier betrifft es den Rumpf einer Rückfrage).

**Empfehlung:** Den Namen in die Überschrift oder in den ersten Satz setzen
(„Nr. 1 „THW Hamburg Mitte …" entfernen?"), die Nummernfolge danach.

**Nachprüfung:** 180 × 320 (Zoom) und 320 × 568 bei 200 %: Der Name der Einheit
steht im Bild, bevor der rote Knopf erscheint.

### R10-D2 [P3] Der Schalter „Funkrufname" behält die Nummer nur im selben Schritt; nach Schrittwechsel ist sie beim Wiedereinschalten leer

**Priorität:** P3

**Kennzeichnung:** gemessen (Funkrufname des Fahrzeugs 1 im Entwurf vor und nach
dem Schalten).

**Fundstelle / Aufgabe:** Assistent Schritt 4 „Fahrzeuge" → Schalter „Funkrufname"
je Fahrzeug.

**Beobachtung:**

- Ausgangslage `{"kennwort":{"code":1},"eigenerStandort":true,"teile":[71,25]}`.
  Aus: `funkrufname` ist nicht mehr im Bogen, es erscheint keine Rückfrage. An
  (im selben Schritt): wieder `teile:[71,25]` — das Gedächtnis aus Runde 9 greift.
- Aus, „5 . Sofortbedarf", zurück zu „4 . Fahrzeuge", an: `teile:[]`, der
  Kennwort-Code bleibt. Die Nummer ist weg, ohne Rückfrage und ohne „Rückgängig".
- Zum Vergleich: „Sofortbedarf erfassen" fragt beim Ausschalten (Werte genannt);
  der Schalter „Funkrufname" nicht.

**Erwartung der Rolle:** Entweder merkt sich der Schalter die Angaben für den
ganzen Bogen (wie „Einsatzbeginn eintragen"), oder er fragt beim Ausschalten wie
der Schalter in Schritt 5.

**Folge:** Wer den Funkrufnamen ausschaltet, den Schritt wechselt und später
wieder einschaltet, findet nur noch den Kennwort-Code vor und muss die Nummer neu
eintippen. Die Nummer ist für den Funkverkehr entscheidend, aber in Sekunden
nachgetragen, und die Lücke zeigt die Übersicht. P3.

**Empfehlung:** Gedächtnis im Entwurf behalten (auch über Schrittwechsel) oder
beim Ausschalten fragen, wenn Nummer oder Teile dahinterstehen.

**Nachprüfung:** Funkrufname aus, Schritt wechseln, zurück, an: Teile 71/25 stehen
wieder da (oder die Rückfrage kam beim Ausschalten).

### R10-D3 [P3] „Liste leeren" in „Namen einfügen…" verwirft eine eingefügte Liste ohne Rückfrage und ohne Rückweg

**Priorität:** P3

**Kennzeichnung:** gemessen (30 eingefügte Zeilen, danach Länge des Textfelds).

**Fundstelle / Aufgabe:** Assistent Schritt 3 „Personal" → „Namen einfügen…" →
Textfeld → „Liste leeren" (105 × 44, y 525; „n Personen übernehmen" liegt bei
y 649).

**Beobachtung:** 30 Namen eingefügt, ein Tipp auf „Liste leeren": Das Textfeld hat
danach die Länge 0, keine Rückfrage, keine Quittung. Der Dialog verspricht zuvor
„Die Liste bleibt stehen, auch wenn Sie das Fenster schließen — bis Sie sie
übernehmen oder leeren."

**Erwartung der Rolle:** Das Gegenstück zum Haltbarkeits-Versprechen ist eine
Rückfrage oder „Rückgängig", wenn viele Zeilen dastehen.

**Folge:** Eine lange Liste, die aus einer Nachricht kopiert wurde, ist weg; die
Quelle liegt meist noch vor, und der Fehltipp setzt einen zweiten Knopf voraus.
P3, nur das Neueinfügen kostet Zeit.

**Empfehlung:** Ab einer Handvoll Zeilen kurz fragen („30 Zeilen verwerfen?") oder
„Rückgängig" in der Dialogzeile anbieten.

**Nachprüfung:** Liste mit 30 Zeilen einfügen, „Liste leeren": Rückfrage bzw.
„Rückgängig".

## Bestätigtes

Alles im Browser nachgespielt:

- **R9-D1 Schalter „Sofortbedarf erfassen" (hält):** Der Tipp auf „Sofortbedarf
  erfassen" bei Werten öffnet „Sofortbedarf entfernen?": „Diese Angaben gehen
  verloren: Diesel 620 l, Benzin 40 l, Gemisch 20 l, Unterbringung, Ruhezeit. Die
  Verpflegung kommt beim erneuten Anhaken wieder aus der Stärke." Wahlen „Sofortbedarf
  entfernen" (rot) und „Behalten", Fokus auf „Behalten". Nach dem Bestätigen
  gibt es kein „Rückgängig"; die Rückfrage hat den Verlust vorher genannt, deshalb
  keine eigene Aufnahme. Für „Funkrufname" siehe R10-D2.
- **R9-D2 Beiseitegelegtes in den Aufzählungen (hält):** Mit abgeschnittenem
  Sammlungstext nennt „Alle Daten löschen": „beiseitegelegte, nicht lesbare Daten
  (Sammlungen oder Vorlagen): 1 Eintrag, 22.338 Zeichen — nur ‚Vorher Sicherung
  erstellen…' hebt sie auf". „Sicherung einspielen…" nennt dasselbe unter „geht
  dabei verloren", bietet „Vorher Sicherung erstellen…" an und sperrt „Einspielen
  und ersetzen" bis zum Haken „Beiseitegelegtes geht verloren — ich habe es
  gesichert … oder brauche es nicht" (`disabled` gemessen).
- **R9-D3 Rückwege (hält):** „Person entfernen": „Rückgängig" nach Schrittwechsel
  („Weiter", „Zurück") und nach Neuladen (Startseite → „Fortsetzen" → „3 .
  Personal") vorhanden, Personenzahl 37 → 38. „Fahrzeug entfernen": nach Neuladen
  „Rückgängig" vorhanden. „Ebene entfernen": „Rückgängig" nach Entfernen (Ebenen 3
  → 2) und nach Neuladen vorhanden, danach wieder 3. Die Rückfrage zu Person nennt
  die Gültigkeitsdauer nicht, die zu Fahrzeug und Ebene („15 Minuten") schon; das
  ist eine Textunebenheit, kein Verlust.
- **R9-D4 Fokus (hält):** „Zwei Fassungen mit demselben Stand": Fokus auf
  „Bisherige behalten", darunter „Die eben eingelesene" und „Die bisherige".
- **R9-D5 Nummernfolge zuerst (teilweise):** Der erste Satz nennt die Nummern;
  der Name der Meldung bleibt in kleinen Lagen unter dem Knopf (R10-D1).
- **Meldung entfernen:** Rückfrage mit Nummernfolge („Nr. 2–6 rücken auf und
  heißen danach Nr. 1–5"), Name, Stand, „Rückgängig … nur, solange die App
  geöffnet bleibt … Mehrere nacheinander entfernte holst du mit mehrmals
  ‚Rückgängig' zurück". Doppeltipp (zwei Touch-Tipps direkt aufeinander) auf
  „Meldung entfernen": nur eine Meldung entfernt (6 → 5). Nach Neuladen ist die
  Meldung weg (5 im Speicher, Quittung nicht mehr da), wie in der Rückfrage
  angesagt. Eine Rückfrage, die man mit einem Tipp neben den Dialog zu schließen
  versucht, bleibt offen (beobachtet bei „Einsatz löschen" und „Geräteschlüssel");
  `Escape` schließt sie ohne Wirkung.
- **Abrücken:** Ohne Rückfrage, mit Quittung „Abgerückt hh:mm: Nr. 1 „THW …"" und
  „Rückgängig" (gemessen: Status 1 → 0). Die Zählung geht von 6 zählend auf 5
  zählend, Stärke 59 → 42; das steht in der Quittung nicht, aber an der Kopfzeile
  und in der Liste. Zweittipp an der Knopfstelle nach 0,1; 0,7; 1,5; 2,4; 2,8 und
  4,0 s: Zahl der abgerückten Einheiten bleibt 1, es kam kein zweiter
  Statuswechsel (die Karte klappt nach dem Abrücken zu). Das schließt den Rest
  aus R8-D5/R9 („nach 2,7 s nimmt der Zweittipp zurück") in meinem Aufbau.
- **Tipp-Sperre 600 ms:** In „Einsatz löschen?" blieb ein Tipp 300 ms nach dem
  Öffnen auf „In den Papierkorb" ohne Wirkung und ohne Hinweis; nach 700 ms löste
  er aus. Das hält gegen Durchtippen, ist aber lautlos (bekannte Grenze
  R8-H5/S4, Stand vermerkt).
- **Papierkorb Einsatz:** „Einsatz löschen…" nennt Namen, „6 gemeldeten
  Einheiten" und „30 Tage"; Papierkorb zeigt „gelöscht am 25.10.2026 — Wird am
  24.11.2026 endgültig entfernt (in 30 Tagen)"; „Wiederherstellen" (nicht
  neben „Endgültig löschen…", getrennt durch Linie, Abstand 40 px) bringt die
  Sammlung wieder (19 851 Zeichen im Speicher). „Endgültig löschen…": „Darin
  stecken fremde Personendaten; rückgängig geht das nicht. Von dieser Sammlung gibt
  es noch keinen Export … es ist die einzige Kopie", Fokus auf „Abbrechen".
- **Rückholplatz:** „Verwerfen" nennt den Verdrängungsfall mit Name, Stand,
  Personenzahl und Anfang des Einsatztexts; „Zuletzt geschlossenen Bogen
  zurückholen" tauscht Entwurf und Rückholplatz und sagt es vorher.
- **Alle Daten löschen:** Knopf `disabled` ohne Haken (Tipp mit `force` ohne
  Wirkung, Speicher unverändert). Fokus auf „Abbrechen" bei den Rückfragen
  „Einsatz löschen" und „Geräteschlüssel".
- **Rohtext-Rettung:** Mit abgeschnittenem Sammlungstext liegt `eeb.unlesbar.v1`
  beiseite, die Karte nennt „Sammlung „Hochwasser Musterstadt" (etwa 6 Meldungen)
  … fehlt in Listen und Zählung", „Daten sichern…" und „Beiseitegelegtes
  entfernen…" (fragt mit „Endgültig entfernen"/„Abbrechen", Fokus „Abbrechen") sowie
  den Weg zurück auf Papier („Bögen daraus mit ‚Bögen einlesen…' neu einlesen").
- **Angefangene Erfassung:** „Einheit manuell erfassen…" mit angefangener
  Erfassung öffnet zuerst die Rückfrage „Angefangene Erfassung … Diese Erfassung
  fortsetzen / Verwerfen und neue Einheit erfassen / Abbrechen". „‹ Einsatz" mit
  Eingaben verliert sie nicht (Entwurf 506 Zeichen im Speicher). „In Einsatz
  übernehmen" ohne Namen: Hinweis „Name der Einheit fehlt … Zum Namensfeld", nichts
  übernommen.
- **Bögen einlesen:** Neuer Stand: „Folgemeldung … Stärke 4 → 3 (−1)" in „Neu
  seit der letzten Kenntnisnahme", frühere Fassung bleibt (7 Fassungen).
- **Sicherung einspielen:** Eine Sicherungsdatei gegen ein Gerät mit
  Einsatzsammlung: Aufzählung „Auf diesem Gerät — geht dabei verloren: Sammlung
  „Hochwasser Musterstadt" mit 6 Meldungen … In der Datei: … kein
  Signatur-Geräteschlüssel", „Die laufenden Sammlungen dieses Geräts sind danach
  weg — ohne Papierkorb. Vorher sichern oder übergeben."
- **Rückfragen bei Lagen:** 180 × 320, 320 × 568 und 200 % Schrift: Knöpfe 44 px
  hoch und erreichbar, Rumpf rollt; 640 × 360: „Entfernen" (rot) steht durch den
  Abstand von 47 px getrennt von „Verschieben…". „✕" an der Person: 44 × 44, 6 px
  Abstand zu „⇑ an die erste Stelle" (bei 320 × 568 66 px bis zur Nachbartaste),
  mit Rückfrage mit Name abgesichert.
- **Namen einfügen…:** hängt Personen an („2 Personen übernehmen", Liste der
  Bestandsliste unverändert), ersetzt nichts.
- **Vorlagen:** „Löschen" ohne Rückfrage in den Papierkorb (30 Tage) mit
  „Rückgängig" (nach dem Speichern: „Papierkorb Vorlagen (1)").

## Abgleich mit Runde 9

| Befund Runde 9 | Stand in Runde 10 | Beleg |
| --- | --- | --- |
| R9-D1 Schalter verwerfen Werte ohne Rückfrage (P2) | teilweise: „Sofortbedarf erfassen" hält, „Funkrufname" nur im Schritt (R10-D2) | Rückfrage mit Werten; Funkrufname nach Schrittwechsel `teile:[]` |
| R9-D2 Einspielen und Löschen verschweigen Beiseitegelegtes (P2) | hält | „1 Eintrag, 22.338 Zeichen"; eigener Haken, Knopf `disabled` |
| R9-D3 Rückwege uneinheitlich (P3) | hält | Person, Fahrzeug, Ebene: „Rückgängig" nach Neuladen vorhanden |
| R9-D4 Fokus auf der ändernden Wahl (P3) | hält | Fokus „Bisherige behalten" (Zahlen-Rückfrage „Stärke ändern…" nicht erneut gespielt) |
| R9-D5 Rückfrage zeigt in kleinen Lagen wenig Text (P3) | teilweise | Nummernfolge zuerst; Name unter dem Knopf bei 180 × 320 (R10-D1) |
| R8-D5 Zweittipp nach Abrücken | hält besser | Zweittipp bis 4 s ohne Wirkung |
| R8-H5/S4 Prellschutz 450/800 ms | Stand vermerkt | Tipp-Sperre 600 ms, lautlos |
| R9-G5 feste Leisten bei Zoom | nicht berührt | Rückfrage-Fuß bleibt im Bild, Rumpf rollt (Verweis) |
| R6-O9, R7-G4/M8, R7-G8/H9, R7-N1, R7-N9, R8-A1, R8-M6, R9-M3 | nicht berührt | bekannte Grenzen, nicht erneut gemeldet |

Nebenwirkungen der Runde-9-Änderungen: Die Rückfragen sind länger geworden (Zusatz
im Verdrängungsfall, Nummernfolge, Beiseitegelegtes); in der engsten Lage rutscht
dadurch der Name der Einheit unter den roten Knopf (R10-D1). Die neuen Texte zu
Rückgängig nennen die Gültigkeit unterschiedlich (Person ohne Angabe, Fahrzeug und
Ebene „15 Minuten", Meldung „bis die App geschlossen wird"); das hält, ist aber
nicht einheitlich.

## Abschluss

- **Aufgabe geschafft:** ja
- **Fremde Hilfe nötig:** nein
- **Größtes Missverständnis:** Wer „Funkrufname" ausschaltet und später wieder
  einschaltet, erwartet seine Nummer noch vorzufinden, bekommt aber nur den
  Kennwort-Code (R10-D2).
- **Größtes Einsatzrisiko:** „Meldung entfernen" bleibt der einzige Weg ohne
  Rückweg nach dem Neuladen; die Rückfrage sagt das vorher klar, bei Zoom aber
  ohne den Namen der Einheit im Bild (R10-D1).
- **Top-Priorität für die nächste Iteration:** Den Namen der Einheit in die
  Überschrift der Rückfrage „Meldung entfernen?" setzen (R10-D1); danach den
  Funkrufnamen für den ganzen Bogen merken (R10-D2).

Zählung: P0 0, P1 0, P2 0, P3 3 (R10-D1 bis R10-D3).
