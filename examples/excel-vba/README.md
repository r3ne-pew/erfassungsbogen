# Excel-Makros: EEB-Codes in eine Arbeitsmappe einlesen

Drei VBA-Module, mit denen eine Excel-Arbeitsmappe die QR-Codes des
Erfassungsbogens über einen USB-Handscanner (Tastatur-Emulation) oder per
eingefügtem Link einliest und als Zeile in ein Stärke-Blatt schreibt. Die
Module sind ein Nachbau des Lesewegs aus `vendor/eeb-format/src/codec.ts` in
reinem VBA (Base41/Base64url, Deflate, Binärstrom), ohne Systembibliotheken.

| Modul | Aufgabe |
| --- | --- |
| `m_digitalerEEBParsing.bas` | Dekoder: Scan-Text → `TEebBogen`. Liest alle Schema-Versionen 2 bis 10 und mehrteilige Codes (`EEBS.`-Serien). |
| `m_digitalerEEBVokabular.bas` | Klartexte zu den Zahlencodes (THW-Einheitstypen, -Funktionen, -Fahrzeugtypen, Funkruf-Kennwörter, Hierarchie-Ebenen). Generiert aus `vendor/bos-vokabulare`. |
| `m_digitalerEEB.bas` | Anbindung an eine konkrete Mappe (Formular `ufr_digitalerEEBEingabe`, Blatt `t_staerke`, Spaltenbelegung). Muss an die eigene Mappe angepasst werden. |

Die Dateien sind in Windows-1252 kodiert (VBA-Import erwartet ANSI) und
werden über *Datei → Importieren* im VBA-Editor eingebunden.

## Stand und Kompatibilität

- Schema 10 (abweichende Dienststelle je Person) wird gelesen; ältere Codes
  (Schema 2 bis 9) weiterhin, dort bleiben die neueren Felder leer.
- Berufe stehen im Transportformat als Freitext mit Präfix `Beruf: ` in den
  Zusatzqualifikationen; der Dekoder trennt sie in `TEebPerson.berufe` ab.
- Mehrteilige Codes: `EebIstSegmentCode` vor `EebBogenLesen` prüfen, Teile mit
  `EebSegmentSammeln` aufnehmen, bei Vollständigkeit `EebSegmenteZuBogen`.
  Die Prüfsumme (FNV-1a) wird wie in der App geprüft.
- Signaturen (`EEB2C`) werden übersprungen, **nicht** geprüft.
- Unbekannte Vokabular-Codes erscheinen als `#123`; beim Nachziehen neuer
  Vokabeln nur das Vokabular-Modul ersetzen.

`testcodes-schema10.txt` enthält einen mit dem echten Codec erzeugten
Schema-10-Bogen als Einzelcode und als dreiteilige Serie samt erwarteten
Werten zum Gegenprüfen in der Mappe.
