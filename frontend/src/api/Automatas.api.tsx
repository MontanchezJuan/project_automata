import axios from "axios";
import { AutomataNoRegex, Automata } from "../interfaces/Automata";

interface ResponseOperaciones {
  data: { interseccion: AutomataNoRegex; reverso: AutomataNoRegex };
}

interface Response {
  data: { automata: Automata; message: string };
}

export const apiOperaciones = (
  automata1: AutomataNoRegex,
  automata2: AutomataNoRegex
) =>
  axios.post<
    { automata1: AutomataNoRegex; AutomataNoRegex2: Automata },
    ResponseOperaciones
  >("http://127.0.0.1:5000/operaciones", { automata1, automata2 });

export const apiCrearAutomata = (regex: string) =>
  axios.post<{ regex: string }, Response>(
    "http://127.0.0.1:5000/crear-automata",
    { regex }
  );
