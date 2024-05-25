import React, { useEffect, useState } from "react";

import Graphviz from "graphviz-react";

import { AutomataNoRegex as Automata } from "../interfaces/Automata";

interface Props {
  automata: Automata | undefined;
}

export const GraphvizComponent: React.FC<Props> = ({ automata }) => {
  const [transiciones, setTransiciones] = useState<string>(`digraph {\n
      node [style="filled"];\n
      q0 [fillcolor="#03c04a"];\n
      q0 -> q1[label="",weight="0.6"];
      }`);

  useEffect(() => {
    if (!automata) {
      setTransiciones(`digraph {\n
      node [style="filled"];\n
      graph [center=1 rankdir=LR];\n
      q0 [fillcolor="#03c04a"];\n
      q0 -> q1[label="",weight="0.6"];
      }`);
    } else {
      getTransiciones();
    }
  }, [automata]);

  const getTransiciones = () => {
    if (!automata) return;

    if (automata.transiciones.length < 1) {
      getEstados();
      return;
    }

    let cAutomata = `digraph {
    node [style="filled"];\n
    graph [center=1 rankdir=LR];\n
    ${getEstadosFinales()}
    ${getEstadoInicial()}`;

    automata.transiciones.forEach((transicion) => {
      const currentEstado = Object.keys(transicion)[0];
      const transicionData = transicion[currentEstado];
      const finalTransiciones: { [key: string]: string[] } = {};

      transicionData.forEach((currentTransicion) => {
        Object.keys(currentTransicion).forEach((word) => {
          const finalEstado = currentTransicion[word];

          if (!finalTransiciones[finalEstado]) {
            finalTransiciones[finalEstado] = [];
          }

          finalTransiciones[finalEstado].push(word);
        });
      });

      Object.keys(finalTransiciones).forEach((finalEstado) => {
        const words = finalTransiciones[finalEstado];
        cAutomata += `\n  ${currentEstado} -> ${finalEstado} [label="${words}",weight="0.6"];`;
      });
    });

    cAutomata += "\n}";

    setTransiciones(cAutomata);
  };

  const getEstados = () => {
    if (!automata) return;

    let cAutomata = `digraph {\n
      node [style="filled"];\n
      graph [center=1 rankdir=LR];\n
      ${getEstadosFinales()}
      ${getEstadoInicial()}`;

    automata.estados.forEach((estado) => {
      cAutomata += `${estado};\n`;
    });

    cAutomata += `
    ${getRank()}
    \n}`;

    setTransiciones(cAutomata);
  };

  const getEstadoInicial = () => {
    if (!automata) return "";
    if (!automata.estado_inicial) return "";

    return `node [shape = circle]; ${automata.estado_inicial} [fillcolor="#03c04a"];\n`;
  };

  const getEstadosFinales = () => {
    if (!automata) return "";
    if (automata.estados_finales.length === 0) return "";

    let estadosFinales = `node [shape = doublecircle];`;

    automata.estados_finales.forEach((estado_final) => {
      estadosFinales += ` ${estado_final}`;
    });
    estadosFinales += `;\n`;

    return estadosFinales;
  };

  const getRank = () => {
    if (!automata) return "";

    let rank: string = ``;

    automata?.estados.forEach((estado) => {
      rank += "{rank=min; ";
      rank += ` ${estado};`;
      rank += "}";
    });

    return rank;
  };

  return <Graphviz dot={transiciones} />;
};
