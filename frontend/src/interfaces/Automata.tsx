export interface Automata {
  regex: string;
  estados: string[];
  alfabeto: string[];
  transiciones: { [key: string]: { [key: string]: string }[] }[];
  estado_inicial: string;
  estados_finales: string[];
}

export interface AutomataNoRegex {
  estados: string[];
  alfabeto: string[];
  transiciones: { [key: string]: { [key: string]: string }[] }[];
  estado_inicial: string;
  estados_finales: string[];
}
