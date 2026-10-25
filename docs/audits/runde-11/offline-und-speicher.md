# Audit Runde 11 – Offline und Speicher

Prüfer: Rollenaudit `thw-offline-resilience-reviewer` · Datum: 2026-10-25 · Zählung: P0 0 · P1 0 · P2 1 · P3 4

Reiner Prüfbericht, keine Codeänderung. Gegen die laufende App auf Port 4173 (Produktionsbuild, `vite preview`),
Playwright mit Chromium, Telefon 390 × 844 und 360 × 640, `isMobile`/`hasTouch`, Locale de-DE, je Lauf ein eigener
Browser-Kontext. Der Rechner war während der Prüfung stark ausgelastet (Load etwa 17); Wartezeiten der Skripte sind
darauf abgestimmt, die Tipp-Sperre von 0,9 s ist beachtet.

Nicht neu gemeldet sind die bekannten Grenzen (R6-O9, R7-G4/M8, R7-G8/H9, R7-N1, R7-N9, R8-A1, R8-M6, R9-M3, R9-G5,
R8-H5/S4) und die Reste aus Runde 10 (leere Karten bei „Nur Stärke“, Rückgängig für Meldungen überlebt das Neuladen
nicht, Tabellenzeilenhöhe bei 180 × 320).

## Urteil

Die Offline-Fähigkeit trägt weiter. Ohne Netz gehen alle Ausgänge (Lageblatt, Sammel-PDF, Bogen-PDF, CSV, Excel,
Blanko-Vordruck) und der Lagemonitor; beim Neuladen ohne Netz kommt die App samt letzter Sammlung. Bei vollem Speicher
scheitern Abrücken, Auftrag/Notiz und „Einsatz löschen…“ sichtbar mit Grund und Weg („Speichern fehlgeschlagen …“, „Nicht
gelöscht“), der Stand bleibt unverändert. Blockiert der Browser `localStorage` ganz, sagt die Startseite es und verweist
auf PDF. Der Import kaputter oder fremder Dateien nennt Ursache und Weg. Der Abgleich zweier Geräte nennt Widersprüche
mit beiden Werten. Offene Entwürfe in zwei Fenstern werden mit Rückfrage geschützt.

Die Aufgaben „Einsatz führen, übergeben, importieren, abgleichen, sichern“ gelingen ohne fremde Hilfe. Neu gefunden sind
ein P2 (eingetippter, noch nicht gespeicherter Text in den Karten-Feldern geht beim Neuladen verloren) und vier P3
(stille oder flüchtige Rückmeldungen).

## Befunde

### P2

#### R11-O1 – Eingetippter Auftrag, Notiz oder Zug geht beim Neuladen oder Seitenwechsel verloren (gemessen)

- **Priorität:** P2
- **Kennzeichnung:** gemessen bei 390 × 844 und 360 × 640. Neuladen per Skript und `visibilitychange`/`pagehide`
  nachgestellt; echtes Verwerfen der Seite durch das Betriebssystem nicht prüfbar.
- **Fundstelle:** Einsatzansicht, Karte einer Einheit aufklappen, „Auftrag/Notiz“ (Feld „z. B. Deichabschnitt Nord ab 14:00“)
  und „Zug zuordnen“ (Feld „z. B. 2. Zug“).
- **Beobachtung:** Text ist eingetippt, „Speichern“ nicht angetippt, Feld noch im Fokus. Neuladen: Text weg, nichts in
  `eeb.einsaetze.v1`. Dasselbe, wenn `visibilitychange` (hidden) und `pagehide` ausgelöst werden: nichts gespeichert,
  nach dem Neuladen leer. Wird das Feld vorher verlassen (Tipp auf eine andere Stelle), steht der Text im Speicher und
  nach dem Neuladen da (die Behebung S5 „speichern beim Verlassen“ greift also nur beim Verlassen des Feldes). Eine
  Rückfrage oder Warnung gab es nicht.
- **Erwartung der Rolle:** Wer auf dem Telefon einen Auftrag tippt und kurz in die Funk-App wechselt, findet ihn nach der
  Rückkehr wieder, auch wenn der Browser die Seite zwischenzeitlich verworfen hat. Der Bogen-Entwurf verhält sich so
  (sofort gespeichert).
- **Folge:** Ein Auftrag („Deich Nord ab 14:00 sichern“) oder Zug fehlt in Karte, Lageblatt, CSV und Übergabe, ohne dass
  es auffällt; der Helfer glaubt ihn eingetragen.
- **Empfehlung:** Eingetippten Text dieser Felder auch beim Wechsel der Sichtbarkeit und beim Verlassen der Seite
  sichern oder als Entwurf je Karte vorhalten; mindestens beim Neuladen mit offenem Feld den Text zurückgeben.
- **Nachprüfung:** Text tippen, ohne zu speichern, Seite ausblenden/neu laden: Text steht in Feld oder Karte.

### P3

#### R11-O2 – Aufnahme „für Einsatz“ wird still zum eigenen Bogen, wenn der Einsatz im anderen Fenster gelöscht wird (gemessen)

- **Priorität:** P3
- **Kennzeichnung:** gemessen (zwei Fenster, ein Kontext, 390 × 844).
- **Fundstelle:** „Einheit manuell erfassen…“ im Einsatz („Aufnahme für: …“, „In Einsatz übernehmen“), zweites Fenster:
  „Einsatz löschen…“ → „In den Papierkorb“.
- **Beobachtung:** Fenster A hat „Leer“ als Ort eingetippt. Nach dem Löschen in Fenster B springt A ohne Hinweis auf den
  gewöhnlichen Bogen („‹ Startseite“, keine Marke „Aufnahme für“, Knopf „In Einsatz übernehmen“ weg). Die Eingabe
  bleibt erhalten, der Einsatz liegt im Papierkorb (`geloeschtAm` gesetzt, nichts verloren).
- **Erwartung der Rolle:** Ein Satz „Der Einsatz wurde gelöscht (Papierkorb) – die Eingabe ist jetzt ein eigener Bogen“.
- **Folge:** Der Helfer sucht den fehlenden Knopf und kann die Meldung nicht mehr ablegen, ohne zu wissen warum.
- **Empfehlung:** Hinweis beim Wechsel; Weg „Einsatz zurückholen und dort ablegen“ nennen.
- **Nachprüfung:** Aufnahme öffnen, Einsatz im anderen Fenster löschen: Hinweis erscheint.

#### R11-O3 – „Widerspruch zwischen den Geräten“ ist nur bis zum Neuladen sichtbar (gemessen)

- **Priorität:** P3
- **Kennzeichnung:** gemessen (zwei Kontexte, Sammel-PDF von Gerät B in Gerät A eingelesen, beide ohne Netz nicht nötig).
- **Fundstelle:** Einsatzansicht nach „Einsatz importieren…“.
- **Beobachtung:** Beide Geräte haben dieselbe Einheit mit verschiedenem Auftrag versehen. Nach dem Import steht klar:
  „1 Widerspruch … hier Auftrag ‚Notiz von A: Pumpe‘, in der Datei Auftrag ‚Notiz von B: Sandsäcke‘; der Stand dieses Geräts
  bleibt.“ Die Zeile bleibt mindestens 6 s stehen, nach dem Neuladen ist sie weg; der Auftrag von B steht nirgends mehr in
  der App (nur noch in der Datei).
- **Erwartung der Rolle:** Ein Widerspruch bleibt an der Karte sichtbar, bis er entschieden ist.
- **Folge:** Wer die Meldung bei Unterbrechung nicht liest, verliert den Gegenstand des Widerspruchs unbemerkt.
- **Empfehlung:** Marke „Widerspruch“ an der Karte mit beiden Werten und Übernehmen-Knopf, bis bestätigt.
- **Nachprüfung:** Widerspruch erzeugen, neu laden: Marke steht noch.

#### R11-O4 – „Zur Kenntnis genommen“ bei vollem Speicher ohne Rückmeldung (gemessen)

- **Priorität:** P3
- **Kennzeichnung:** gemessen (Speicher per `setItem`-Stub voll, 390 × 844 und 360 × 640).
- **Fundstelle:** Einsatzansicht, Block „Neu seit der letzten Kenntnisnahme“.
- **Beobachtung:** Das Schreiben von `eeb.kenntnis-stand.v1` scheitert; der Block verschwindet trotzdem, es gibt weder
  Hinweis noch Dialog. Nach dem Neuladen steht „Neu seit der letzten Kenntnisnahme“ mit denselben Einheiten wieder da.
  Abrücken und Auftrag/Notiz melden dieselbe Lage dagegen klar.
- **Erwartung der Rolle:** Gleiche Rückmeldung wie bei den anderen Aktionen, mindestens ein Satz.
- **Folge:** Gering; bereits gesichtete Meldungen erscheinen später wieder als neu.
- **Empfehlung:** Dieselbe Meldung „Speichern fehlgeschlagen“ oder Block bis zum Neuladen stehen lassen.
- **Nachprüfung:** Speicher füllen, Knopf antippen: Hinweis erscheint.

#### R11-O5 – Funkrufname des Lagemonitors geht bei vollem Speicher still verloren (gemessen)

- **Priorität:** P3
- **Kennzeichnung:** gemessen (Speicher per Stub voll, 390 × 844).
- **Fundstelle:** Einsatzansicht, „Lagemonitor für den Fernseher“, Feld „Funkrufname (optional)“.
- **Beobachtung:** Beim Tippen scheitert das Schreiben von `eeb.lagefunkruf.v1`. Das Feld zeigt „Florian Test 1“, der
  Lagemonitor (zweites Fenster) zeigt in der ersten Zeile keinen Funkrufnamen. Der Einsatzbeginn („Jetzt“) meldet das
  Scheitern dagegen: „Der Beginn konnte nicht gespeichert werden (Speicher voll oder gesperrt).“
- **Erwartung der Rolle:** Beide Felder melden ein Scheitern gleich.
- **Folge:** Der Fernseher zeigt eine Zeile weniger, als der Helfer eingetragen glaubt.
- **Empfehlung:** Die Meldung des Einsatzbeginns auch am Funkrufnamen zeigen.
- **Nachprüfung:** Speicher füllen, Funkrufnamen tippen: Hinweis am Feld.

## Bestätigtes (ohne Befund)

- Erstladen und Neuladen ohne Netz: Dienstarbeiter steuert, App und letzte Sammlung kommen; Statuszeile „✓ Funktioniert
  komplett offline“ (549 Zusatzdateien).
- Alle Ausgänge ohne Netz: Lageblatt (`eeb-lageblatt-251640okt26_…pdf`), Sammel-PDF, Blanko, CSV (zwei), Excel, Bogen als
  PDF (öffnet das PDF in neuem Fenster), keine fehlgeschlagenen Anfragen, keine Seitenfehler.
- Lagemonitor ohne Netz öffnet sich; nach „In den Papierkorb“ im Hauptfenster zeigt er „Dieser Einsatz liegt im Papierkorb
  (30 Tage) …“, auch nach dem Neuladen.
- Voller Speicher: Abrücken, Auftrag/Notiz, „Einsatz löschen…“ mit klarem Dialog, Stand unverändert.
- `localStorage` ganz gesperrt: Hinweis auf der Startseite, App bedienbar, Offline-Zeile ehrlich.
- Datei-Import: kaputtes JSON (abgebrochene Übertragung), fremdes JSON, leeres Array je mit Ursache und Weg; erneutes
  Einlesen desselben Exports: „keine neue Einheit“, keine Dublette.
- Gleichzeitige Aufnahme in zwei Fenstern: Rückfrage mit Namen der angefangenen Einheit und Weg „Zuletzt geschlossenen
  Bogen zurückholen“.
- Einsatzdaten mit höherer `schemaVersion` im Speicher werden beim Lesen auf die eigene Fassung gesetzt (künstlich
  erzeugt; als Risikostelle genannt: unbekannte Felder werden dabei verworfen, ob das im Betrieb vorkommt, ist nicht belegt).

## Nicht prüfbar

Echtes Verwerfen der Seite durch das Betriebssystem, Kamera-Scan, Nahbereich, hängende statt tote Leitung, Update-Banner
bei neuer Fassung, Verhalten eines Dienstarbeiter-Zwischenspeichers bei teilweise geladenen Zusatzdateien (Playwright
fängt dessen Anfragen nicht ab).

## Abschluss

- **Aufgabe geschafft:** ja.
- **Fremde Hilfe nötig:** nein.
- **Größtes Missverständnis:** „Speichern fehlgeschlagen“ und „Abgerückt“ sind klar; ein eingetipptes, aber nicht
  gespeichertes Feld wirkt dagegen wie erledigt (R11-O1).
- **Größtes Einsatzrisiko:** Ein getippter Auftrag oder Zug verschwindet beim Seitenwechsel ohne Spur (R11-O1).
- **Top-Priorität für die nächste Iteration:** R11-O1: Text der Karten-Felder bei Ausblenden und Neuladen sichern.
