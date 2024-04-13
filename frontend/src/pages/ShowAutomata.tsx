import React, { useEffect, useState } from "react";

import Graphviz from "graphviz-react";

import { useAutomata } from "../context/AutomataContext";
import { Heading, Text } from "@chakra-ui/react";

export const ShowAutomata = () => {
  const { currentAutomata } = useAutomata();

  const [transiciones, setTransiciones] = useState<string>(`digraph {
  q0 -> q1[label="1",weight="0.6"];
  q3 -> q2;
  q0 -> q3;}`);

  const getTransiciones = () => {
    let cAutomata = `digraph {\n
      \nnode [style="filled"]\n
      ${currentAutomata.estado_final} [fillcolor="#ff0000"]\n
      ${currentAutomata.estado_inicial} [fillcolor="#03c04a"]\n`;

    currentAutomata.transiciones.forEach((transicion) => {
      const estadoOrigen = Object.keys(transicion)[0];
      const transicionData = transicion[estadoOrigen];

      transicionData.forEach((obj) => {
        const simbolos = Object.keys(obj);
        simbolos.forEach((simbolo) => {
          const estadoDestino = obj[simbolo];
          cAutomata += `\n  ${estadoOrigen} -> ${estadoDestino} [label="${simbolo}",weight="0.6"];`;
        });
      });
    });

    cAutomata += "\n}";

    setTransiciones(cAutomata);
  };

  useEffect(() => {
    if (!currentAutomata) {
      setTransiciones(`digraph {
      q0 -> q1[label="1",weight="0.6"];
      q3 -> q2;
      q0 -> q3;}`);
      return;
    }
    getTransiciones();

    return () => {};
  }, [currentAutomata]);

  return (
    <div className="flex justify-evenly items-center gap-4">
      <div className="flex flex-col justify-center items-center gap-4">
        <Heading>
          Regex: <span className="text-[#385898]">{currentAutomata.regex}</span>
        </Heading>

        <Text>
          Alfabeto{" "}
          <span className="flex gap-1">
            {currentAutomata.alfabeto.map((letra) => (
              <span className="text-[#BD2050]">{letra}</span>
            ))}
          </span>
        </Text>

        <Text>
          Estado inicial{" "}
          <span className="text-[#03c04a]">
            {currentAutomata.estado_inicial}
          </span>
        </Text>

        <Text>
          Estado final{" "}
          <span className="text-[#ff0000]">{currentAutomata.estado_final}</span>
        </Text>
      </div>

      <Graphviz dot={transiciones} />
    </div>
  );
};
