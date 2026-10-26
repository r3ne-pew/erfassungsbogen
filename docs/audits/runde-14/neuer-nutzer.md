# Runde 14 – Helfer ohne Einweisung

- Prüfer: Rolle „Helfer ohne Einweisung“ (thw-new-user-reviewer)
- Datum: 2026-10-26
- Zählung: P0 0 · P1 0 · P2 0 · P3 3
- Prüfaufbau: Produktionsbuild auf http://localhost:4173 (Code-Stand Commit 429c41a, `main` nach Runde 13), Playwright/Chromium über das globale Modul (die Projektkopie fand keinen passenden Browser), Telefon 390×844 und 360×640, Touch, de-DE. Kamera, Handschuhe, Bildschirmtastatur und native Builds nicht prüfbar. Die bekannten Grenzen aus `docs/audits/README.md` sowie Runde 10 bis 13 wurden nicht neu gemeldet.

## Urteil

Ein Helfer ohne Einweisung kommt ohne fremde Hilfe zum Ziel. Geprüft wurden Startseite, Assistent Schritt 1 bis 5 und Übersicht (Einheitstyp-Suche, Ortsverzeichnis mit Ergänzung und „Rückgängig“, Einsatz, Personal, Fahrzeuge, Entfernen-Rückfrage), Anlegen einer Einsatz-Sammlung, manuelle Erfassung mit den Rückfragen „Ort der Einheit fehlt“ und „Nur Sollplätze, keine gemeldete Stärke“, Karte mit Hinweisen, Abrücken mit Quittung und „Wieder anwesend“, Hinweis „Alle Einheiten sind abgerückt“, Schnellerfassung bis zur Übersicht, Fehlermeldungen beim Einlesen falscher Dateien (drei Importwege) und der Scanner ohne Kamera. Die Rückfragen sind verständlich, der Fehlertext liegt im Blickfeld, bei 360 px trat kein horizontaler Überlauf auf. Neu sind nur drei Befunde auf Stufe P3, alle Wortwahl und Statusangaben.

## Befunde

### R14-N1 (P3) – Schritt 3: Warnung nennt 7 Personenkarten, der Knopf darunter 9 Personen

- Ort: Schritt 3 „Personal“ nach Wahl von „FGr R (A)“ (9 Sollplätze); Warnung „7 Personenkarten ohne Angaben“ und Knopf „Vorbelegung entfernen (9 Personen ohne Namen)“.
- Beobachtung: Zwei Plätze tragen schon eine Stelle (GrFü, TrFü), sieben sind ganz leer. Die Warnung zählt 7, der Knopf 9, die Stärkezeile 9. Dieselbe Zahlendifferenz steht auf der Karte im Einsatz (Hinweisliste „7 Personenkarten ohne Angaben“, Stärke 9). Die Behebung von R13-N2 hat die Knöpfe vereinheitlicht, die Zahlen aber nicht.
- Erwartung der Rolle: Eine Zahl für denselben Sachverhalt; oder erkennbar, dass der Knopf auch die zwei Plätze mit Stelle mitnimmt.
- Folge: Gering. Der Helfer rechnet nach, zögert vor dem Antippen, ob die zwei Plätze mit Stelle erhalten bleiben. „Rückgängig“ steht nach dem Antippen bereit.
- Empfehlung: Warnung und Knopf mit derselben Zahl und demselben Wort beschriften und sagen, was mit den Plätzen mit Stelle, aber ohne Namen geschieht.
- Nachprüfung: Schritt 3 mit Sollplätzen öffnen; Warnung, Knopf und Karten-Hinweis nennen dieselbe Zahl.

### R14-N2 (P3) – Karte: „Hinweise: leere Personenkarte + 9 weitere“ lässt sich als 10 Personenkarten lesen

- Ort: Einsatzansicht, Einheitenkarte einer abgelegten Sollstärke (FGr R (A)); Zeile unter der Marke „Sollstärke, nicht gemeldet“.
- Beobachtung: Die unterstrichene Zeile steht als Verweis da. Antippen klappt eine Liste von zehn Hinweisen auf (7 Personenkarten ohne Angaben, Geschlecht „männlich“ vorbelegt, Ort/Auftrag leer, keine Erreichbarkeit, vier Fahrzeuge ohne Kennzeichen, Sitzplätze). Die Zeile selbst nennt nur den ersten Hinweis im Singular („leere Personenkarte“) und „9 weitere“; die Karte hat aber 9 Personen. Die vollständigen Hinweise stehen sonst nur im Titeltext, der am Telefon nicht erscheint.
- Erwartung der Rolle: „Weitere“ bezieht sich auf Personenkarten, also 1 + 9 = 10 Karten; oder die Zeile sagt, dass es zehn Hinweise sind.
- Folge: Gering. Der Helfer liest eine falsche Zahl von Personenkarten heraus oder tippt gar nicht, weil er den Inhalt der Zeile für vollständig hält.
- Empfehlung: „10 Hinweise zur Vollständigkeit“ (mit Tippmarke) statt Hinweistext mit Rest.
- Nachprüfung: Karte mit Sollstärke ablegen; Zeile nennt die Anzahl der Hinweise, Tipp zeigt dieselbe Zahl in der Liste.

### R14-N3 (P3) – Schnellerfassung: Übersicht meldet „vollständig und plausibel“ bei offenem Einheitstyp, Schritt 2 steht auf „✓“

- Ort: Schnellerfassung (Startseite → „Einheit schnell erfassen (nur Stärke)…“) mit Ort „Freiburg“ und Mannschaft 8; Fortschrittsleiste und Gesamtübersicht.
- Beobachtung: Die Leiste zeigt schon nach Schritt 1 „✓“ an Schritt 2 „Einsatz“, der in der Schnellerfassung übersprungen wird und gar nicht angeboten ist. In der Übersicht steht in einer Zeile „(Einheitstyp offen)“, darunter „✓ Alle Angaben vollständig und plausibel.“; bei „Beginn / Ende“ steht „— / — — für eigene Nachweise in Schritt 2 eintragen“, ein Schritt, der in dieser Erfassung nicht vorkommt.
- Erwartung der Rolle: Ein Haken bedeutet, dass ich etwas getan habe; „vollständig“ verträgt sich nicht mit „Einheitstyp offen“; ein Verweis führt zu einem erreichbaren Schritt.
- Folge: Gering. Der Helfer vertraut dem Haken, obwohl Typ, Auftrag und Fahrzeuge fehlen; die Meldung beim Meldekopf kommt ohne taktisches Zeichen an. „In Einsatz-Sammlung ablegen…“ ist nicht gesperrt, ein Datenverlust entsteht nicht.
- Empfehlung: In der Schnellerfassung übersprungene Schritte nicht abhaken (Strich oder „nicht nötig“), die Vollständigkeitszeile auf „für die Schnellerfassung vollständig“ ändern und den Schrittverweis weglassen oder mit „Weiter“ erreichbar machen.
- Nachprüfung: Schnellerfassung bis zur Übersicht durchlaufen; Leiste, Vollständigkeitszeile und Verweise stimmen mit dem überein, was erfasst wurde.

## Halten die Behebungen aus Runde 13? (nachgeprüft)

- R13-N1 Anleitung: Der Absatz „Einsatz benennen“ nennt jetzt „Schritt 2“ und „Einsatzbeginn eintragen“. Hält.
- R13-N2 Schritt 3: Es gibt nur noch den Knopf „Vorbelegung entfernen (9 Personen ohne Namen)“. Teilweise: Die Zahl in der Warnung weicht ab (R14-N1).
- R13-W6 Abschluss: Nach dem Abrücken der letzten Einheit steht „Alle Einheiten sind abgerückt. Zum Abschluss den Einsatz sichern. Jetzt sichern“. Hält (bekannte Grenze: kein Zustand „beendet“).
- Abrücken: Quittung „Abgerückt 08:00: Nr. 1 …“ mit „Rückgängig“; die Karte zeigt „✓ Abgerückt“ kurz und danach „Wieder anwesend“. Hält.
- Rückfragen „Ort der Einheit fehlt“, „Nur Sollplätze, keine gemeldete Stärke“, „Fahrzeug entfernen?“ (nennt Folge, 15 Minuten Rückgängig): verständlich, mit „Abbrechen“ auf Abstand. Hält.
- Falsche Dateien: Ablehnung mit Dateiname und Hinweis auf den richtigen Weg („Sammel-PDF des Einsatzes“ bzw. „PDF des Bogens“), bei allen drei Importwegen und im Blickfeld (360×640). Hält.
- Ortsverzeichnis: Eingabe „Freiburg“ ergänzt Kürzel, Telefon, E-Mail, RB und LV mit „Rückgängig“. Hält.

Aufgabe geschafft: ja
Fremde Hilfe nötig: nein
Größtes Missverständnis: „Hinweise: leere Personenkarte + 9 weitere“ lässt sich als zehn Personenkarten lesen (R14-N2).
Größtes Einsatzrisiko: Keines oberhalb von P3 belegt; am ehesten der Haken „vollständig“ bei offenem Einheitstyp in der Schnellerfassung (R14-N3).
Top-Priorität für die nächste Iteration: Zahlen in Warnung, Knopf und Kartenhinweis angleichen (R14-N1, R14-N2).
