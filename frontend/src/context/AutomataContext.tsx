import React, { createContext, useState, useContext, ReactNode } from "react";
import { Automata, AutomataNoRegex } from "../interfaces/Automata";

interface AutomataContextType {
  addAutomata: (newAutomata: Automata) => void;
  addAutomatas: (
    automataA: AutomataNoRegex,
    automata1: AutomataNoRegex,
    automataB: AutomataNoRegex,
    automata2: AutomataNoRegex
  ) => void;
  currentAutomata: Automata;
  automataA: AutomataNoRegex;
  automata1: AutomataNoRegex;
  automataB: AutomataNoRegex;
  automata2: AutomataNoRegex;
  deleteAutomata: (automata: Automata) => void;
  // deleteAutomata1: (automata: Automata) => void;
  // deleteAutomata2: (automata: Automata) => void;
  history: Automata[];
  setAutomata: (automata: Automata) => void;
  // setAutomata1: (automata: Automata) => void;
  // setAutomata2: (automata: Automata) => void;
}

interface InitialAutomataType {
  currentAutomata: Automata;
  automataA: AutomataNoRegex;
  automata1: AutomataNoRegex;
  automataB: AutomataNoRegex;
  automata2: AutomataNoRegex;
  history: Automata[];
}

const InitialAutomata: InitialAutomataType = {
  currentAutomata: {
    regex: "",
    estados: [],
    alfabeto: [],
    transiciones: [],
    estado_inicial: "",
    estados_finales: [],
  },
  automataA: {
    estados: [],
    alfabeto: [],
    transiciones: [],
    estado_inicial: "",
    estados_finales: [],
  },
  automata1: {
    estados: [],
    alfabeto: [],
    transiciones: [],
    estado_inicial: "",
    estados_finales: [],
  },
  automataB: {
    estados: [],
    alfabeto: [],
    transiciones: [],
    estado_inicial: "",
    estados_finales: [],
  },
  automata2: {
    estados: [],
    alfabeto: [],
    transiciones: [],
    estado_inicial: "",
    estados_finales: [],
  },
  history: [],
};

const getInitialAutomata = (): InitialAutomataType => {
  if (!localStorage.getItem("automata")) return InitialAutomata;

  const savedAutomata = JSON.parse(localStorage.getItem("automata")!);
  return (
    {
      history: savedAutomata,
      currentAutomata: {
        regex: "",
        estados: [],
        alfabeto: [],
        transiciones: [],
        estado_inicial: "",
        estados_finales: [],
      },
      automataA: {
        estados: [],
        alfabeto: [],
        transiciones: [],
        estado_inicial: "",
        estados_finales: [],
      },
      automata1: {
        estados: [],
        alfabeto: [],
        transiciones: [],
        estado_inicial: "",
        estados_finales: [],
      },
      automataB: {
        estados: [],
        alfabeto: [],
        transiciones: [],
        estado_inicial: "",
        estados_finales: [],
      },
      automata2: {
        estados: [],
        alfabeto: [],
        transiciones: [],
        estado_inicial: "",
        estados_finales: [],
      },
    } || InitialAutomata
  );
};

const AutomataContext = createContext<AutomataContextType | undefined>(
  undefined
);

export const AutomataProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [automataGlobal, setAutomataGlobal] =
    useState<InitialAutomataType>(getInitialAutomata);

  const addAutomata = (newAutomata: Automata) => {
    if (!newAutomata) return;

    const newHistory =
      automataGlobal.history && automataGlobal.history.length
        ? [...automataGlobal.history, newAutomata]
        : [newAutomata];
    localStorage.setItem("automata", JSON.stringify(newHistory));

    setAutomataGlobal({
      ...automataGlobal,
      history: newHistory,
      currentAutomata: newAutomata,
    });
  };

  const addAutomatas = (
    automataA: AutomataNoRegex,
    automata1: AutomataNoRegex,
    automataB: AutomataNoRegex,
    automata2: AutomataNoRegex
  ) => {
    if (!automata1 || !automataA || !automata2 || !automataB) return;

    // const newHistory =
    //   automataGlobal.history && automataGlobal.history.length
    //     ? [...automataGlobal.history, newAutomata]
    //     : [newAutomata];
    // localStorage.setItem("automata", JSON.stringify(newHistory));

    setAutomataGlobal({
      ...automataGlobal,
      automataA,
      automata1,
      automataB,
      automata2,
    });
  };

  const deleteAutomata = (automataToDelete: Automata) => {
    if (!automataToDelete) return;

    const updatedHistory = automataGlobal.history.filter(
      (automata) => automata !== automataToDelete
    );

    localStorage.setItem("automata", JSON.stringify(updatedHistory));

    if (automataGlobal.currentAutomata === automataToDelete) {
      const newCurrentAutomata =
        updatedHistory.length > 0
          ? updatedHistory[0]
          : InitialAutomata.currentAutomata;
      setAutomataGlobal({
        ...automataGlobal,
        history: updatedHistory,
        currentAutomata: newCurrentAutomata,
      });
    } else {
      setAutomataGlobal({
        ...automataGlobal,
        history: updatedHistory,
      });
    }
  };

  const setAutomata = (automata: Automata) => {
    if (!automata) return;

    setAutomataGlobal({
      ...automataGlobal,
      currentAutomata: automata,
      history: automataGlobal.history,
    });
  };

  return (
    <AutomataContext.Provider
      value={{
        ...automataGlobal,
        addAutomata,
        addAutomatas,
        deleteAutomata,
        setAutomata,
      }}
    >
      {children}
    </AutomataContext.Provider>
  );
};

export const useAutomata = (): AutomataContextType => {
  const context = useContext(AutomataContext);
  if (!context) {
    throw new Error("useAutomata debe ser usado dentro de un AutomataProvider");
  }
  return context;
};
