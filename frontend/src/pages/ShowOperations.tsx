import React from "react";

import { Heading } from "@chakra-ui/react";

import { GraphvizComponent } from "../components/GraphvizComponent";
import { useAutomata } from "../context/AutomataContext";

export const ShowOperations = () => {
  const { automataA, automata1, automataB, automata2 } = useAutomata();

  console.log(automataA, automata1, automataB, automata2);

  return (
    <div className="flex flex-col justify-center items-center gap-4 mb-12">
      <div className="flex justify-evenly w-full">
        <div className="flex flex-col justify-center items-center">
          <Heading>Automata A</Heading>
          <GraphvizComponent automata={automataA} />
        </div>

        <div className="flex flex-col justify-center items-center">
          <Heading>Automata B</Heading>
          <GraphvizComponent automata={automataB} />
        </div>
      </div>

      <div className="flex flex-col justify-center items-center">
        <Heading>Intersección automata A y automata B</Heading>
      </div>
      <GraphvizComponent automata={automata1} />

      <div className="flex flex-col justify-center items-center">
        <Heading>
          Reverso de la interseccion del automata A y automata B
        </Heading>
        <GraphvizComponent automata={automata2} />
      </div>
    </div>
  );
};
