from automata_operaciones import AutomataOperaciones
from automata_regex import Transicion


class Operaciones:
    @staticmethod
    def interseccion(automata1: AutomataOperaciones,automata2: AutomataOperaciones):
        estados: list[str]
        alfabeto: list[str]
        transiciones : list[Transicion]
        estado_inicial: str
        estados_finales : list[str]
        
    def crear_estados(automata1: AutomataOperaciones,automata2: AutomataOperaciones):
        estados: list[str] = []
        estado_inicial: str
        estados_finales : list[str]
        for estado1 in automata1.estados:
            for estado2 in automata2.estados:
                estados.append(f"{estado1}{estado2}")