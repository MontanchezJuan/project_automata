import React, { createContext, useState, useContext, ReactNode } from "react";
import { Automata } from "../interfaces/Automata";

interface AutomataContextType {
  addAutomata: (newAutomata: Automata) => void;
  currentAutomata: Automata;
  deleteAutomata: (automata: Automata) => void;
  history: Automata[];
  setAutomata: (automata: Automata) => void;
}

interface InitialAutomataType {
  currentAutomata: Automata;
  history: Automata[];
}

const InitialAutomata: InitialAutomataType = {
  currentAutomata: {
    regex: "",
    estados: [],
    alfabeto: [],
    transiciones: [],
    estado_inicial: "",
    estado_final: "",
  },
  history: [],
};

const getInitialAutomata = (): InitialAutomataType => {
  if (!localStorage.getItem("automata")) return InitialAutomata;

  const savedAutomata = JSON.parse(localStorage.getItem("automata")!);
  return (savedAutomata as InitialAutomataType) || InitialAutomata;
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
    console.log(newHistory);
    localStorage.setItem("automata", JSON.stringify(newHistory));

    setAutomataGlobal({
      history: newHistory,
      currentAutomata: newAutomata,
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
      currentAutomata: automata,
      history: automataGlobal.history,
    });
  };

  return (
    <AutomataContext.Provider
      value={{ ...automataGlobal, addAutomata, deleteAutomata, setAutomata }}
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
