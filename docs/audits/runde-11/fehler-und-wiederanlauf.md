# Audit „Fehler und Wiederanlauf", Runde 11 (Bedienfehler provozieren, selbst korrigieren)

Prüfer: Rollenaudit `thw-error-recovery-reviewer`
Datum: 25.10.2026
Zählung: **P0 0 · P1 0 · P2 3 · P3 5** (8 neue Befunde)

Prüfgegenstand: Web-App im Produktionsbuild auf `http://localhost:4173`. Reiner Prüfbericht, keine
Codeänderung. Vorab gelesen: `docs/audits/README.md` und `docs/audits/runde-10/README.md`.
Die dort genannten Grenzen und Reste wurden nicht neu gemeldet: R6-O9, R7-G4/M8, R7-G8/H9,
R7-N1, R7-N9, R8-A1, R8-M6, R9-M3, R9-G5, R8-H5/S4, leere Karten bei „Nur Stärke",
Rückgängig für Meldungen ohne Überleben des Neuladens, Tabellenzeilenhöhe bei 180 × 320.

## Prüfaufbau

Playwright (`require('playwright')`, `chromium.launch()` ohne Optionen), `isMobile`/`hasTouch`,
Locale de-DE, Dichte 2. Telefon 390 × 844 und 360 × 640; Dialoge zusätzlich bei 640 × 360 und
320 × 568. Neue Browser-Kontexte je Lauf. Zustände entstanden durch Bedienung und durch
`localStorage`-Seeds aus `examples/thw/` (mit `uebung: false`, `stand` auf heute).

Geprüft: Zugehörigkeit (OV-Verzeichnis, Telefon, E-Mail, Ebenenwechsel), Datum und Zeiten
(Jahr 2062, Ende vor Beginn, Eintreffzeit in der Zukunft und im Vorjahr), Personen („Namen
einfügen…" mit gemischten Zeilen, Kontaktart, Telefon), Fahrzeuge (Kennzeichen, Sitzplätze
„abc", „-3", „8,5", „100", Typwechsel), Sofortbedarf und Freitext, Übersicht und QR-Übergabe,
Browser-Zurück und Neuladen, Datensicherung (falsche, beschädigte und neuere Dateien),
Einsatz-Sammlung (Anlegen, Doppeltipp, manuelle Aufnahme, Dubletten, Eintreffzeit ändern,
Lagemonitor-Beginn, CSV).

Hinweis zum Aufbau: Das Playwright der Repo-`node_modules` (1.64) findet die installierten
Browser nicht; verwendet wurde die globale Installation (`/opt/node-tools`, 1.56). Es wurde
nichts installiert.

## Urteil

Die Fehlerabsicherung trägt weiter. Gemessen und in Ordnung: Jahr-2062-Hinweis, „bis vor von",
Minus und Buchstaben in Zahlenfeldern mit Satz, Eintreffzeit in der Zukunft („Stimmt die
Zeit?" mit Heute/Gestern, Knöpfe 44 px bei 360 × 640, 640 × 360 und 320 × 568), Doppeltipp auf
„Einsatz anlegen" und „In Einsatz übernehmen" (je eine Einheit), Dublettenerkennung auch bei
„ albstadt " in Kleinschreibung mit Leerzeichen, Ersetzen des Entwurfs nur nach Rückfrage,
Datensicherung (fremde Datei, neuere Version, beschädigter Eintrag werden benannt;
Einspielen nur mit Haken), Formel-Neutralisierung im CSV, Entwurfsrettung nach Neuladen.
Eine Datenverlust-Strecke im Hauptweg fand ich nicht.

Die neuen Befunde liegen alle bei **abhängigen Feldern, die sich nach einer Korrektur falsch
oder gar nicht mitbewegen**, und bei **Telefonnummern**, der Angabe, über die der Meldekopf
zurückruft. Der Helfer schafft die Aufgaben ohne fremde Hilfe, kann aber einen falschen
Rückruf-Kontakt auf den Bogen bringen, ohne es zu merken.

## Befunde

### R11-E1 [P2] Ort der Einheit nachträglich geändert: Kürzel, Telefon, E-Mail, RB und LV des zuerst gewählten Ortsverbands bleiben stehen, die Meldung nennt weiter den alten Ort (neu)

**Priorität:** P2

**Kennzeichnung:** gemessen (390 × 844 und 360 × 640, Schritt 1 „Einheit").

**Fundstelle / Aufgabe:** Schritt 1, Feld „Ort der Einheit (Pflicht)" und die automatisch
ergänzten Ebenen darunter.

**Beobachtung:** „Freiburg" eintippen, Feld verlassen: Die App ergänzt Kürzel OFRE,
Telefon 07612089560, E-Mail OV-Freiburg@thw.de sowie RB Freiburg (GFRE) und LV
Baden-Württemberg, mit der Zeile „Aus dem OV-Verzeichnis ergänzt: Freiburg (OFRE) … Rückgängig".
Dann den Ort auf „Neustadtfeld" (nicht im Verzeichnis) ändern: Der Ort steht neu, alles andere
bleibt, die Meldung „ergänzt: Freiburg (OFRE)" bleibt ebenfalls, eine Warnung gibt es nicht.
Die Übersicht zeigt danach „OV · Neustadtfeld (OFRE) · 07612089560 · OV-Freiburg@thw.de".
Wechsel auf einen Ort, den das Verzeichnis kennt, ersetzt dagegen alles sauber
(Frankfurt (Oder), Hamburg-Harburg gemessen). Auch beim Tippen Zeichen für Zeichen löst
keine Zwischenstufe eine Ergänzung aus („Ulmenau", „Hammerstein" blieben leer), das Problem
entsteht nur nach einer abgeschlossenen Ergänzung.

**Erwartung der Rolle:** Wer den Ort korrigiert, rechnet damit, dass die vom Ort abgeleiteten
Angaben mitgehen oder dass die App nachfragt („Kürzel und Kontaktdaten von Freiburg
behalten?").

**Folge:** Der Bogen trägt ein fremdes Dienststellenkürzel samt Rufnummer und E-Mail einer
anderen Dienststelle. Der Meldekopf ruft im Zweifel die falsche Dienststelle an. Der Helfer
sieht in Schritt 1 nur die richtige Ortsangabe darüber und die alte Meldung, die nach
„erledigt" aussieht. Korrigierbar ist es nur durch Leeren von sieben Feldern von Hand.

**Empfehlung:** Beim Ändern des Orts nach einer Verzeichnis-Ergänzung nachfragen oder die
ergänzten Felder zurücknehmen (Rückgängig anbieten); mindestens die Meldung durch einen
Hinweis „Ort geändert — Kürzel, Telefon und E-Mail stammen noch von Freiburg" ersetzen.

**Nachprüfung:** „Freiburg" ergänzen lassen, Ort auf „Neustadtfeld" ändern: Rückfrage oder
leere Felder; die Übersicht zeigt kein „(OFRE)" hinter „Neustadtfeld".

### R11-E2 [P2] Person, Erreichbarkeit: Wechsel der „Art" (Mobil, Festnetz, E-Mail) löscht die eingetragene Nummer ohne Rückfrage und ohne Rückgängig, auch zwischen Mobil und Festnetz (neu)

**Priorität:** P2

**Kennzeichnung:** gemessen (390 × 844 und 360 × 640, Schritt 3, „+ Erreichbarkeit"); der Code
setzt beim Wechsel ausdrücklich `wert: ""` (`src/app/schritte/personal.tsx`, `KontakteEditor`).

**Fundstelle / Aufgabe:** Schritt 3 „Personal", Karte einer Person, Zeile „Art | Nummer".

**Beobachtung:** Standard ist „Mobil". Nummer 01711234567 eingetragen, Art auf „Festnetz"
gestellt: Feld leer. Wieder auf „E-Mail" oder „Mobil": weiter leer, die Nummer kommt nicht
zurück. Gleiches bei „E-Mail" mit Adresse und Wechsel auf „Mobil". Es erscheint weder eine
Meldung noch eine Rücknahme. Gespeichert ist danach `wert: ""`. Das Entfernen derselben
Zeile über „✕" fragt dagegen zurück („Erreichbarkeit … entfernen?").

**Erwartung der Rolle:** Beide Zeilenwerkzeuge schützen dieselbe Angabe gleich. Mobil nach
Festnetz ist eine reine Beschriftungsänderung, bei der die Nummer bleiben müsste.

**Folge:** Die Art-Auswahl ist das erste Feld der Zeile und eine native Auswahl, die beim
Scrollen mit Handschuh leicht verstellt wird. Folge ist die gelöschte Rückrufnummer der
Ansprechperson, bemerkbar erst über die Warnung „Keine telefonische Erreichbarkeit erfasst"
oder gar nicht, wenn eine zweite Nummer existiert.

**Empfehlung:** Bei Mobil ↔ Festnetz die Nummer behalten; bei Wechsel von oder nach E-Mail
Rückfrage mit dem Wert („Nummer 0171… geht verloren") oder Rückgängig-Leiste wie bei den
übrigen Rückwegen.

**Nachprüfung:** Nummer eintragen, Art Mobil → Festnetz: Nummer bleibt. Art → E-Mail: Rückfrage
oder Rückgängig, das die Nummer zurückbringt.

### R11-E3 [P2] Telefonfelder behalten nur Ziffern: „+49" verliert das Pluszeichen, zwei Nummern werden zu einer verschmolzen, zu kurze Nummern fallen nicht auf (neu)

**Priorität:** P2

**Kennzeichnung:** gemessen (Tastatureingabe, 390 × 844); der Code entfernt alles außer
Ziffern in `einheit.tsx` (Telefon der Zugehörigkeit) und `personal.tsx` (Erreichbarkeit).

**Fundstelle / Aufgabe:** Schritt 1 „Telefon" je Ebene; Schritt 3 „Nummer" je Person.

**Beobachtung:** Eingabe „+49 171 123 45 67" ergibt „491711234567". „0171 1234567 / 0441 99"
ergibt „01711234567044199" (zwei Nummern zu einer, mit Schrägstrich ohne Hinweis).
„0441 abc" ergibt „0441". „0171 12" bleibt als „017112" ohne jede Warnung stehen (kein
Hinweis auf zu kurze Nummer, anders als bei „E-Mail ohne @"). Keine Meldung, dass etwas
entfernt wurde; die Eingabe springt nur zurück.

**Erwartung der Rolle:** Was auf dem Zettel steht, wird so übernommen; wenn es nicht passt,
sagt die App das. Wer eine zweite Nummer mit Schrägstrich oder „oder" dazuschreibt, erwartet
keine verschmolzene Ziffernfolge.

**Folge:** Die Rückrufnummer auf Bogen, PDF und Meldekopf ist falsch, ohne dass der Helfer
es merkt: Ohne „+" ist „49171…" aus dem Inland nicht wählbar, die verschmolzene Nummer führt
zu einem Fremdanschluss. Der Fehler fällt erst beim Rückruf auf.

**Empfehlung:** Nach dem Tippen den ersetzten Wert nennen („Nur Ziffern übernommen"), das
führende „+" erhalten, bei Trennzeichen zwischen Zifferngruppen (Schrägstrich, „oder", Komma)
nachfragen oder ein zweites Feld anbieten, und bei Nummern unter etwa sechs Ziffern den
bekannten Prüfpunkt „stimmt das?" zeigen.

**Nachprüfung:** „+49 171 1234567" eintragen: „+491711234567" oder ausdrücklicher Hinweis;
„0171 1234567 / 0441 99" eintragen: Rückfrage oder Hinweis auf zwei Nummern; „017112": Prüfpunkt.

### R11-E4 [P3] „Namen einfügen…": Namensbestandteile „von der", „van", „de" landen im Vornamen (neu)

**Priorität:** P3

**Kennzeichnung:** gemessen (Schritt 3, Vorschau und Übernahme).

**Fundstelle / Aufgabe:** Schritt 3, „Namen einfügen…" mit der Zeile „Jan-Erik von der Heide-Müller".

**Beobachtung:** Die Vorschau zeigt „Heide-Müller, Jan-Erik von der · Mannschaft", übernommen
wird Vorname „Jan-Erik von der", Nachname „Heide-Müller". Zeilen mit Ziffern, Klammern oder
Semikolon werden dagegen vorbildlich als „wird nicht übernommen · kein Name?" gekennzeichnet.
Bei „Vorname Nachname, Funktion, Telefon" (Lena Nowak, Zugführerin, 0171 99) wird „Lena Nowak"
zum Nachnamen und „Zugführerin" zum Vornamen; das Format ist im Dialog nicht angeboten, die
Vorschau zeigt aber die Fehlbelegung, ohne sie als Zweifel zu kennzeichnen.

**Erwartung der Rolle:** Das Nachnamens-Präfix „von der" gehört zum Nachnamen; die Vorschau
ist der Ort, an dem die Fehlbelegung auffallen müsste.

**Folge:** Sortierung und Anrede nach Nachname im Bogen und im PDF stimmen nicht; Korrektur nur
von Hand je Person. Kein Datenverlust.

**Empfehlung:** Die gängigen Präfixe (von, van, de, zu, der, den, zur) dem Nachnamen
zuschlagen oder in der Vorschau als „unsicher" kennzeichnen.

**Nachprüfung:** „Anna van der Berg" einfügen: Nachname „van der Berg".

### R11-E5 [P3] „Sonstiges (Freitext)" hat keine Grenze und keinen Hinweis; ein langer Text macht aus einem QR-Code 20 Teile, ohne dass der Grund genannt wird (neu)

**Priorität:** P3

**Kennzeichnung:** gemessen (Schritt 5, 10 499 Zeichen zufälliger Wörter, danach „Bogen übergeben…").

**Fundstelle / Aufgabe:** Schritt 5 „Sofortbedarf & Sonstiges", Freitext; Übergabe-Dialog,
QR-Vollbild.

**Beobachtung:** Das Feld nimmt 10 499 Zeichen ohne Zähler, Hinweis oder Obergrenze an
(kein `maxlength`). In der Übergabe steht erst im QR-Bereich „Bogen zu groß für einen Code —
in 20 Teile aufgeteilt. Alle Teile nacheinander scannen". Dass der Freitext die Ursache ist
(der Bogen ohne Personen und ohne Fahrzeuge), steht nirgends.

**Erwartung der Rolle:** Wer einen Einsatzbefehl oder eine Lagemeldung in „Sonstiges"
einfügt, will wissen, dass das den Bogen für den Scan unhandlich macht.

**Folge:** Die Übergabe per Kamera am Meldekopf wird zu 20 aufeinanderfolgenden Scans oder
fällt auf PDF und Link zurück; der Helfer sucht die Ursache in Personal und Fahrzeugen.
Die Übergabe bleibt möglich.

**Empfehlung:** Ab etwa 500 Zeichen unter dem Feld sagen, was der Text kostet („lange Texte
vergrößern den QR-Code"), und im Übergabe-Dialog bei mehr als drei Teilen die größten
Posten nennen.

**Nachprüfung:** 2 000 Zeichen eintragen: Hinweis am Feld; in der Übergabe nennt die Teile-Zeile
den Freitext als Hauptposten.

### R11-E6 [P3] Lagemonitor „Einsatzbeginn": Jahr-Zahlendreher werden ohne Hinweis akzeptiert, der Fernseher zeigt dann „365 Tage" oder „Einsatz beginnt noch" (neu)

**Priorität:** P3

**Kennzeichnung:** gemessen (Einsatzansicht, Feld „Einsatzbeginn", Lagemonitor-Fenster).

**Fundstelle / Aufgabe:** Einsatzansicht, Block „Lagemonitor für den Fernseher".

**Beobachtung:** Beginn 25.10.2025 ergibt auf dem Monitor „seit Beginn: 365 Tage, 8 Stunden,
36 Minuten"; Beginn 25.10.2062 und morgen ergeben „Einsatz beginnt noch". Am Feld selbst gibt
es zu keinem der Werte einen Hinweis, obwohl der Bogen (Schritt 2) und die Eintreffzeit
(„Stimmt die Zeit?") dieselben Fehler abfangen.

**Erwartung der Rolle:** Dieselbe Plausibilitätsprüfung wie bei den anderen Zeitfeldern.

**Folge:** Der Fehler fällt erst auf der Großanzeige auf, vor dem Stab.

**Empfehlung:** Beim Speichern des Beginns dieselbe „Jahr prüfen / liegt in der Zukunft"-Frage
zeigen.

**Nachprüfung:** Beginn 2062 eintragen: Rückfrage oder Hinweis am Feld.

### R11-E7 [P3] „Alle Daten als CSV": Telefonnummern der Einheit stehen als reine Ziffernfolge; Excel streicht die führende Null (Risikostelle, nicht in Excel geprüft)

**Priorität:** P3

**Kennzeichnung:** Beobachtet ist die Datei (UTF-8 mit BOM, Semikolon, Spalte „Telefon Einheit"
mit `04411234567`); dass Excel die Zahl beim Öffnen umwandelt, ist Erfahrungswissen und hier
**nicht** nachgestellt. Texte mit führendem `=`, `+`, `-`, `@` werden dagegen ausdrücklich
neutralisiert (`'=Albstadt`).

**Fundstelle / Aufgabe:** Einsatzansicht, „Alle Daten als CSV".

**Beobachtung:** Kontakte der Personen stehen als Text („Mobil: 5556968346 (P)"), die Telefonspalte
der Einheit als nackte Ziffernfolge.

**Erwartung der Rolle:** Die Rufnummer bleibt beim Öffnen im Tabellenprogramm lesbar und wählbar.

**Folge:** Möglicherweise Rufnummer ohne Vorwahl-Null im Stab; Rückruf scheitert.

**Empfehlung:** Telefonspalte wie die Personenkontakte als Text kennzeichnen oder die Excel-Liste
als Weg nennen.

**Nachprüfung:** CSV in Excel öffnen: Nummer mit führender Null.

### R11-E8 [P3] Nach dem Neuladen im Formular schluckt die Startseite zwei Zurück-Bewegungen, bevor die App verlassen wird (neu)

**Priorität:** P3

**Kennzeichnung:** gemessen (Verlauf `history.length` 5, Zustände; Schritt 3, Neuladen, Zurück).

**Fundstelle / Aufgabe:** Neuladen in Schritt 3 (Seite zeigt Startseite mit „Fortsetzen"), dann Zurück.

**Beobachtung:** Der Verlauf trägt die Schritte aus der Zeit vor dem Neuladen (Schritt 2, 1, 0)
weiter. Zurück von der Startseite zeigt weiter die Startseite (zweimal); erst dann verlässt
die Seite die App. Der Neustart auf der Startseite statt im Schritt ist bekannt (R10-W3), der
Verlaufsrest nicht.

**Erwartung der Rolle:** Zurück auf der Startseite verlässt die App oder bewirkt sichtbar etwas.

**Folge:** Zwei scheinbar tote Zurück-Gesten; der Helfer hält die App für hängend und tippt
sich durch. Kein Datenverlust.

**Empfehlung:** Beim Start den alten Verlauf ersetzen (nur ein Eintrag Startseite).

**Nachprüfung:** In Schritt 3 neu laden, Zurück: Verlassen der App beim ersten Mal.

## Aufgabe und Einschätzung

- **Aufgabe geschafft:** ja
- **Fremde Hilfe nötig:** nein
- **Größtes Missverständnis:** Die Meldung „Aus dem OV-Verzeichnis ergänzt: Freiburg" bleibt
  stehen, auch wenn der Ort inzwischen ein anderer ist.
- **Größtes Einsatzrisiko:** Eine Rückrufnummer, die die App beim Eintippen still verändert oder
  beim Wechsel der Art löscht.
- **Top-Priorität für die nächste Iteration:** Telefonfelder ehrlich behandeln (R11-E3) und
  Art-Wechsel (R11-E2) sowie Ortswechsel (R11-E1) wie die übrigen Rückwege absichern.
