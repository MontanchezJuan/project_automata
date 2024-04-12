export interface Automata {
  estados: string[];
  alfabeto: string[];
  transiciones: { [key: string]: { [key: string]: string } }[];
  estado_inicial: string;
  estados_finales: string[];
}
