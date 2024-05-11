from automata_regex import Transicion

class AutomataOperaciones:
    def __init__(self,quintupla:dict) -> None:
        self.estados : list[str] = quintupla.get("estados")
        self.alfabeto: list[str] = quintupla.get("alfabeto")
        self.transiciones: list[Transicion] = self.estructurar_transiciones(quintupla.get("transiciones"))
        self.estado_inicial: str = quintupla.get("estado_inicial")
        self.estados_finales: list[str] = quintupla.get("estados_finales")
    
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

    def to_json(self):
        return {"alfabeto":self.alfabeto, "estados":self.estados, "estado_inicial":self.estado_inicial, "estados_finales":self.estados_finales, "transiciones":self.transiciones_to_json(self.transiciones)}
    
    @staticmethod
    def transiciones_to_json(transiciones:list[Transicion]):
        copia_transiciones = transiciones.copy()
        transiciones = []
        while len(copia_transiciones) !=0:
            quitar = [0]
            for i in range(1,len(copia_transiciones)):
                if copia_transiciones[0].actual == copia_transiciones[i].actual:
                    quitar.append(i)
            operaciones = []
            for i in quitar:
                operaciones.append({copia_transiciones[i].operacion:copia_transiciones[i].destino})
            transicion = {copia_transiciones[0].actual:operaciones}
            transiciones.append(transicion)
            quitar.sort(reverse=True)
            for i in quitar:
                copia_transiciones.pop(i)
        return transiciones