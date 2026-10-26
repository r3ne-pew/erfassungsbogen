# Rollenaudits, Runde 12 (Stand 26.10.2026)

Zwölfte Prüfrunde nach der Behebung der Befunde aus [Runde 11](../runde-11/README.md).
Zwölf Prüfberichte, die elf THW-Rollen und die allgemeine Mobile-UI, alle gegen
den Produktionsbuild (`vite build` + `vite preview`, Port 4173), Code-Stand
Commit `2c96abe` (Stand `main` nach Runde 11). Reine Prüfberichte ohne
Codeänderung.

Es gibt keine P0- und keine P1-Befunde. Zusammengeführt sind:

- Altersangabe im Kopf der Einsatzansicht in „Standard" und „Feld" unlesbar
  (1,7 : 1): R12-K1 (P2) mit R12-L1 (P2).
- Bedarfszeile ohne Leerzeichen („52Personen"): R12-K4 (P3) mit R12-H1 (P3).

| Bericht | P0 | P1 | P2 | P3 |
| --- | --- | --- | --- | --- |
| [Neuer Nutzer](neuer-nutzer.md) | 0 | 0 | 0 | 7 |
| [Feldtauglichkeit](feldtauglichkeit.md) | 0 | 0 | 0 | 3 |
| [Arbeitsablauf](arbeitsablauf.md) | 0 | 0 | 1 | 3 |
| [Fehler und Wiederanlauf](fehler-und-wiederanlauf.md) | 0 | 0 | 1 | 4 |
| [Zerstörende Handlungen](zerstoerende-handlungen.md) | 0 | 0 | 1 | 2 |
| [Offline und Speicher](offline-und-speicher.md) | 0 | 0 | 0 | 4 |
| [Stress und Unterbrechung](stress-und-unterbrechung.md) | 0 | 0 | 1 | 1 |
| [Handschuh-Bedienung](handschuh-bedienung.md) | 0 | 0 | 2 | 1 |
| [Nacht und Sicht](nacht-und-sicht.md) | 0 | 0 | 1 | 0 |
| [Führungssicht](fuehrungssicht.md) | 0 | 0 | 1 | 3 |
| [Analog-first](analog-first.md) | 0 | 0 | 1 | 0 |
| [Mobile-UI](mobile-ui.md) | 0 | 0 | 0 | 3 |
| Summe ohne Doppelungen | 0 | 0 | 8 | 30 |

## Stand der Behebung (26.10.2026)

Von 38 Befunden ohne Doppelungen sind 33 behoben und 5 teilweise (R12-W3,
R12-H3, R12-O2, R12-O4, R12-G3); keiner ist offen. Bundle-Budget neu gesetzt
(JavaScript gesamt 5 570 244 Byte, Startbündel 1 169 895 Byte). Der erste
Entwurf der Behebung hatte das Startbündel auf 1,75 MB gehoben, weil `hilfen.ts`
die Datenschutzfrist aus `eeb-format` importierte und damit das Verzeichnis der
Ortsverbände aus den nachgeladenen Brocken zog; `hilfen.ts` rechnet die Frist
jetzt selbst nach. Neuer Speicherschlüssel `eeb.sicherung.stand.v1`.

| Befund | Stand | Umsetzung |
| --- | --- | --- |
| A1 Anonymisierung auf Papier | behoben | Vermerk „ANONYMISIERT" auf Lageblatt und Übergabe, keine Mangelhinweise für entfernte Rufnummern |
| W1 Absenderkontakt | behoben | `tel:`/`mailto:`-Verknüpfungen, 44 px |
| W2, W4 | behoben | Vegetarier-Hinweis nur bei angeforderter Verpflegung; Warnung vor „Bisher/Neu/Geändert" |
| W3 „Weitergegeben" | teilweise | „Weitergabe-Datei erzeugt, Empfang nicht bestätigt"; keine Bestätigung der Übergabe |
| E1 bis E5 | behoben | zweite Nummer beim Tippen, gemeinsame E-Mail-Prüfung, Zeitraum leeren, Eintreffzeit in der Vergangenheit, leerer Einsatz ohne Weitergabe |
| D1 bis D3 | behoben | Vorlage ersetzen mit Gegenüberstellung und Rückgängig, Historie-Knöpfe 44 px, Geräteschlüssel-Dialog |
| O1, O3 | behoben | Hinweis mit eingetipptem Text bei entfernter Einheit, Satz bei abgelehntem dauerhaftem Speicher |
| O2 Widersprüche | teilweise | „Erledigt" mit Rückgängig; kein Knopf „Wert der Datei übernehmen" |
| O4 Sicherungsstand | teilweise | Quittung mit Dateiname und Zählstand; Anzeige nicht in der Einsatzansicht |
| S1, S2 | behoben | Löschen-Rückfrage nennt die angefangene Erfassung; „Einheitstyp fehlt" in den offenen Punkten |
| G1, G2 | behoben | Tipp neben ein Funktionsfeld löscht nichts mehr, Sperre von 2 s bei Ausgaben |
| G3 Knöpfe nach Abrücken | teilweise | Rand vorab, feste Mindestbreite; 26 px Versatz nach unten bleibt (zusätzliche Zeile) |
| K1, L1 Kontrast Alterszeile | behoben | Kopf-Schriftfarbe, fett, ≥ 4,5 : 1 in allen vier Ansichten (gerechnet) |
| K2, K3, K4, H1 | behoben | Sortierung und Filter „älter als 1 Std", Altersangaben in Tabelle, Zugsummen und Lageblatt, Leerzeichen in der Bedarfszeile |
| H2 | behoben | „Gesamt: 11 (bisher 4)" beim Stärke-Ändern |
| H3 Ortsname „SchwäbischHall" | teilweise | Anzeige trennt die Wörter; das Verzeichnis liegt im Submodul `vendor/bos-vokabulare` und bleibt unverändert |
| N1 bis N7 | behoben | Anleitung angeglichen, Organisationswechsel nennt die letzte Wahl, Langform des Fahrzeugtyps, Knopfname, Erklärung im Lagemonitor, Ansicht bleibt bei „Namen einfügen", Kennzeichen „THW-80101" |
| M1 bis M3 | behoben | Aufklappmarke, Kachelschrift 12 px quer, Namensspalte 34 % |
