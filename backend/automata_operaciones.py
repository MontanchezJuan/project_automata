from backend.automata_regex import Transicion

class AutomataOperaciones:
    def __init__(self,quintupla:dict) -> None:
        self.estados = quintupla.get("estados")
        self.alfabeto = quintupla.get("alfabeto")
        self.transiciones = self.estructurar_transiciones(quintupla.get("transiciones"))
        self.estado_inicial = quintupla.get("estado_inicial")
        self.estados_finales = quintupla.get("estados_finales")    
    
    def estructurar_transiciones(self, transiciones:dict) -> list[Transicion]:
        instancias_transicion = []
        for transicion in transiciones:
            actual = list(transicion.keys())[0]  # Obtiene el estado actual de la transición
            operaciones_destinos = transicion[actual]  # Obtiene las operaciones y destinos asociados al estado actual
            for op_dest in operaciones_destinos:
                operacion, destino = list(op_dest.items())[0]  # Obtiene la operación y destino de la transición
                instancia_transicion = Transicion(actual=actual, destino=destino, operacion=operacion)
                instancias_transicion.append(instancia_transicion)
        return instancias_transicion