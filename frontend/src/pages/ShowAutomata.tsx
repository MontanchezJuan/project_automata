import React, { useEffect, useState } from "react";

import { graphviz } from "d3-graphviz";
import Graphviz from "graphviz-react";

import { useAutomata } from "../context/AutomataContext";

export const ShowAutomata = () => {
  const { automata } = useAutomata();
  const [transiciones, setTransiciones] = useState<string>(`digraph {
  q0 -> q1[label="1",weight="0.6"];
  q3 -> q2;
  q0 -> q3;}`);

  const getTransiciones = () => {
    // graphviz()
    let currentAutomata = "digraph {";

    automata.transiciones.forEach((transicion) => {
      const estadoOrigen = Object.keys(transicion)[0];
      const transicionData = transicion[estadoOrigen];

      Object.keys(transicionData).forEach((simbolo) => {
        const estadoDestino = transicionData[simbolo];
        currentAutomata += `\n  ${estadoOrigen} -> ${estadoDestino} [label="${simbolo}",weight="0.6"];`;
      });
    });

    currentAutomata += "\n}";

    setTransiciones(currentAutomata);
  };

  useEffect(() => {
    if (!automata) {
      setTransiciones(`digraph {
  q0 -> q1[label="1",weight="0.6"];
  q3 -> q2;
  q0 -> q3;}`);
      return;
    }
    getTransiciones();

    return () => {};
  }, [automata]);

  return (
    <div className="flex flex-col justify-center items-center gap-4">
      <Graphviz dot={transiciones} />
    </div>
  );
};
