/**
 * Telefonfeld mit ehrlicher Rückmeldung (R11-E3): Was beim Tippen entfernt oder abgetrennt wird, steht als Satz
 * unter dem Feld; eine auffällig kurze Nummer bekommt nach dem Verlassen den „stimmt das?"-Hinweis. Das führende
 * „+" bleibt erhalten. Gehört in ein `Feld` (dessen Beschriftung benennt das Eingabefeld).
 */

import { useState, type ComponentProps } from "react";
import { telefonBereinigen, telefonKurzHinweis } from "../telefon-eingabe";
import { FREMDE_DATEN, ZahlMeldung } from "./bausteine";

export function TelefonFeld(
  props: { wert: string | undefined; setzen: (wert: string) => void } & Omit<
    ComponentProps<"input">,
    "value" | "onChange" | "type" | "inputMode"
  >,
) {
  const { wert, setzen, onBlur, onFocus, ...rest } = props;
  const [hinweis, setHinweis] = useState("");
  const [kurz, setKurz] = useState(false);
  return (
    <>
      <input
        {...FREMDE_DATEN}
        {...rest}
        type="tel"
        inputMode="tel"
        value={wert ?? ""}
        onChange={(ev) => {
          const r = telefonBereinigen(ev.target.value);
          setHinweis(r.hinweis);
          setKurz(false);
          setzen(r.wert);
        }}
        onFocus={(ev) => {
          setKurz(false);
          onFocus?.(ev);
        }}
        onBlur={(ev) => {
          setKurz(true);
          onBlur?.(ev);
        }}
      />
      <ZahlMeldung meldung={hinweis || (kurz ? telefonKurzHinweis(wert) : "")} />
    </>
  );
}
