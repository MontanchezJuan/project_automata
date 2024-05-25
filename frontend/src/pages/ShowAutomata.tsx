import React from "react";

import { GraphvizComponent } from "../components/GraphvizComponent";

import { useAutomata } from "../context/AutomataContext";
import { Heading, Text } from "@chakra-ui/react";

export const ShowAutomata = () => {
  const { currentAutomata } = useAutomata();

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
          <span className="text-[#ff0000]">
            {currentAutomata.estados_finales[0]}
          </span>
        </Text>
      </div>

      <GraphvizComponent automata={currentAutomata} />
    </div>
  );
};
