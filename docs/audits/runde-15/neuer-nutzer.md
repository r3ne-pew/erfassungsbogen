# Runde 15 – Helfer ohne Einweisung

- Prüfer: Rolle „Helfer ohne Einweisung“ (thw-new-user-reviewer)
- Datum: 2026-10-26
- Zählung: P0 0 · P1 0 · P2 1 · P3 2
- Prüfaufbau: Produktionsbuild auf http://localhost:4173 (Code-Stand Commit a7874f0, `main` nach Runde 14), Playwright/Chromium über das globale Modul (die Projektkopie fand keinen Browser), Telefon 390×844 und 360×640, Touch, de-DE. Kamera, Handschuhe, Bildschirmtastatur, native Datums-/Zeitwähler in der Landessprache und native Builds nicht prüfbar. Die bekannten Grenzen aus `docs/audits/README.md` sowie Runde 10 bis 14 wurden nicht neu gemeldet.

## Urteil

Ein Helfer ohne Einweisung kommt ohne fremde Hilfe zum Ziel. Geprüft wurden Startseite, Assistent Schritt 1 bis 6 (Einheitstyp-Suche, Ortsverzeichnis mit „Rückgängig“, Einsatz, Personal, Fahrzeuge, Sofortbedarf, Übersicht), „Bogen übergeben…“, Anlegen einer Einsatz-Sammlung, manuelle Erfassung mit der Rückfrage „Nur Sollplätze, keine gemeldete Stärke“, Karte mit Hinweisliste, Details, „Mehr…“ (Aufteilen, Stärke ändern, Entfernen), Eintreffzeit ändern, Zug zuordnen, Abrücken mit Quittung, Tabellenansicht, Schnellerfassung bis zur Übersicht, „Bogen schließen“, „In Einsatz-Sammlung ablegen…“ ohne vorhandene Sammlung und der Scanner ohne Kamera. Die Rückfragen sind verständlich, die Quittungen nennen die Folge. Neu sind ein P2 und zwei P3.

## Befunde

### R15-N1 (P2) – Fahrzeuge aus der Vorbelegung tragen „Ausstattung nach StAN: ja“, ohne dass jemand es angegeben hat

- Ort: Neuer Bogen, Einheitstyp „FGr R (A)“ gewählt, Schritt 4 „Fahrzeuge“, Feld „Ausstattung nach StAN“; danach Einsatz-Karte → „Details“ → Tabelle „Fahrzeuge“, Spalte „STAN“.
- Beobachtung: Alle vier vorbelegten Fahrzeuge (Kipper, Bagger, zwei Anhänger) stehen sofort auf „ja“, obwohl die Auswahl auch „— k. A.“ und „nein“ bietet. Kennzeichen und Sitzplätze der Fahrzeuge sind leer und werden als „offen“ gewarnt (Hinweisliste „Fahrzeug 1 hat noch kein Kennzeichen“), das „ja“ dagegen nicht. In „Details“ steht die Spalte „STAN“ mit „ja“ in jeder Zeile, in der Hinweisliste der Karte (10 Punkte) kommt der Punkt nicht vor.
- Erwartung der Rolle: Eine Angabe zur Ausstattung ist etwas, das ich geprüft habe; solange ich nichts angekreuzt habe, steht dort „k. A.“ oder die Zeile ist als offen markiert.
- Folge: Der Meldekopf liest „STAN: ja“ als geprüfte Aussage („Fahrzeug ist vollständig nach StAN ausgestattet“), obwohl sie nur eine Vorbelegung ist. Fehlendes Gerät fällt erst im Einsatz auf. Annahme: Die Bedeutung von „ja“ (vollständig nach StAN) ist aus der Feldbeschriftung abgeleitet, nicht aus einer Vorschrift.
- Empfehlung: Vorbelegte Fahrzeuge starten auf „k. A.“ (oder erhalten einen Hinweispunkt „Ausstattung nicht bestätigt“); „ja“ erst, wenn es jemand setzt.
- Nachprüfung: Einheitstyp mit Fahrzeugen wählen; in Schritt 4 steht „— k. A.“, in „Details“ erscheint „—“ in der Spalte „STAN“, nach Antippen von „ja“ erscheint „ja“.

### R15-N2 (P3) – „Details“: Tabellen reichen über den Rand, die Spalte „STAN“ ist unerklärt

- Ort: Einsatz-Karte → „Details“, Tabellen „Personal“ und „Fahrzeuge“ bei 390 px (Inhaltsbreite 418 bzw. 456 px bei 313 px sichtbar).
- Beobachtung: Die Spalten „Erreichbarkeit“, „STAN“ und „Änderungen“ liegen außerhalb der Sicht; sichtbar ist nur ein Spaltenanfang („ERR“, „S“). Ein Hinweis zum seitlichen Wischen fehlt, anders als bei der Tabellenansicht der Einheiten („Spaltenkopf anklicken …“). „STAN“ wird auf der Seite nicht ausgeschrieben.
- Erwartung der Rolle: Die Tabelle passt auf den Bildschirm oder sagt, dass man wischen kann; Kürzel sind ausgeschrieben.
- Folge: Gering. Wer Erreichbarkeit oder Ausstattung sucht, übersieht die Spalten oder hält die Tabelle für abgeschnitten.
- Empfehlung: Kurzer Hinweis „Zum Weiterlesen seitlich wischen“ über der Tabelle; Spaltenkopf „Ausstattung (StAN)“.
- Nachprüfung: „Details“ bei 390 px öffnen; Hinweis ist sichtbar, kein Spaltenkopf ist unerklärt.

### R15-N3 (P3) – Schnellerfassung: „← Zurück zu Schritt 5 (Sofortbedarf)“ führt zu einem Schritt, der als übersprungen („5 –“) gekennzeichnet ist

- Ort: Schnellerfassung (Startseite → „Einheit schnell erfassen (nur Stärke)…“), Gesamtübersicht, unterster Knopf.
- Beobachtung: Die Fortschrittsleiste zeigt „2 –“ und „5 –“ (nicht nötig), der Rückknopf unter der Übersicht heißt dennoch „← Zurück zu Schritt 5 (Sofortbedarf)“. Die Behebung von R14-N3 (Haken, Vollständigkeitszeile) hält; dieser Verweis blieb stehen.
- Erwartung der Rolle: Der Rückweg führt zum letzten Schritt, den ich bearbeitet habe (Schritt 4) oder benennt ihn als freiwillig.
- Folge: Gering. Der Helfer öffnet einen Schritt, den die Leiste als nicht nötig führt, und fragt sich, ob etwas fehlt.
- Empfehlung: Rückknopf nennt den vorigen zugänglichen Schritt oder „Sofortbedarf (freiwillig)“.
- Nachprüfung: Schnellerfassung bis zur Übersicht; Rückknopf und Leiste stimmen überein.

## Halten die Behebungen aus Runde 14? (im echten Browser nachgeprüft)

- R14-N1 Schritt 3: Warnung „9 Personenkarten ohne Namen zählen in die Stärke (7 davon ganz leer)“ und Knopf „Vorbelegung entfernen (9 Personen ohne Namen)“ nennen dieselbe Zahl. Hält.
- R14-N2 Karte: „Hinweise: 10 Punkte, u. a. leere Personenkarte“; die aufgeklappte Liste hat genau zehn Einträge. Hält.
- R14-N3 Schnellerfassung: Leiste „2 –“, „5 –“, Zeile „Für die Schnellerfassung vollständig (Typ, Fahrzeuge, Bedarf fehlen bewusst)“. Hält (Rest siehe R15-N3).
- R14-G1 Doppeltipp: Tipp unmittelbar nach dem Seitenwechsel wird mit „Einen Moment …“ abgefangen und löst nichts doppelt aus. Hält.
- R14-S1/W3 „neu · kürzlich eingetroffen“, Quittung „Abgerückt 11:29“ mit „Rückgängig“, Hinweis „Alle Einheiten sind abgerückt … Jetzt sichern“: Hält.
- „In Einsatz-Sammlung ablegen…“ ohne Sammlung: Dialog „Noch keine Sammlung vorhanden — der Bogen ist die erste Meldung darin“ mit „Neue Sammlung anlegen…“. Hält.
- „Bogen schließen“, „Meldung entfernen?“ und „Stärke ändern“ nennen Folge und Rückweg, „Abbrechen“ liegt auf Abstand. Hält.
- Bei 360×640 kein horizontaler Überlauf der Seite; die Quittung nach „Abrücken“ verdeckt vorübergehend „Mehr…“ und „Historie“ der Karte (kurzzeitig, keine Folge, daher nicht gewertet).

Aufgabe geschafft: ja
Fremde Hilfe nötig: nein
Größtes Missverständnis: „STAN: ja“ bei nie geprüften Vorbelegungs-Fahrzeugen liest sich als bestätigte Ausstattung (R15-N1).
Größtes Einsatzrisiko: Keines oberhalb von P2 belegt; am ehesten die unbestätigte Ausstattungsangabe beim Meldekopf (R15-N1).
Top-Priorität für die nächste Iteration: Vorbelegte Fahrzeuge auf „k. A.“ statt „ja“ setzen (R15-N1).
