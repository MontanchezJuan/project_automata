import React, { createContext, useState, useContext, ReactNode } from "react";
import { Automata } from "../interfaces/Automata";

interface AutomataContextType {
  automata: Automata;
  updateAutomata: (newAutomata: Automata) => void;
}

const InitialAutomata: Automata = {
  estados: [],
  alfabeto: [],
  transiciones: [],
  estado_inicial: "",
  estados_finales: [],
};

const getInitialAutomata = (): Automata => {
  if (!localStorage.getItem("automata")) return InitialAutomata;

  const savedAutomata = JSON.parse(localStorage.getItem("automata")!);
  return (savedAutomata as Automata) || InitialAutomata;
};

const AutomataContext = createContext<AutomataContextType | undefined>(
  undefined
);

export const AutomataProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [automata, setAutomata] = useState<Automata>(getInitialAutomata);

  const updateAutomata = (newAutomata: Automata) => {
    if (!newAutomata) return;

    localStorage.setItem("automata", JSON.stringify(newAutomata));
    setAutomata(newAutomata);
  };

  return (
    <AutomataContext.Provider value={{ automata, updateAutomata }}>
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
