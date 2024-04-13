export interface Automata {
  regex: string;
  estados: string[];
  alfabeto: string[];
  transiciones: { [key: string]: { [key: string]: string }[] }[];
  estado_inicial: string;
  estado_final: string;
}
