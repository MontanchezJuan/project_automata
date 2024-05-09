from automata_operaciones import AutomataOperaciones
from automata_regex import Transicion

class Operaciones:
    
    @staticmethod
    def interseccion(automata1: AutomataOperaciones,automata2: AutomataOperaciones):
        if automata1.alfabeto != automata2.alfabeto:
            return
        alfabeto: list[str] = automata1.alfabeto
        estados, estado_inicial, estados_finales = Operaciones.crear_estados(automata1,automata2)
        transiciones = Operaciones.crear_transiciones(automata1,automata2, estados)
        automata_interseccion = AutomataOperaciones({"alfabeto": alfabeto, "estados": estados, "estado_inicial":estado_inicial, "estados_finales": estados_finales, "transiciones":Operaciones.transiciones_to_json(transiciones)})
        Operaciones.quitar_inalcanzables(automata_interseccion)
        return {"alfabeto":automata_interseccion.alfabeto, "estados":automata_interseccion.estados, "estado_inicial":automata_interseccion.estado_inicial, "estados_finales":automata_interseccion.estados_finales, "transiciones":Operaciones.transiciones_to_json(automata_interseccion.transiciones)}
      
    @staticmethod
    def crear_estados(automata1: AutomataOperaciones,automata2: AutomataOperaciones):
        estados: list[str] = []
        estado_inicial: str
        estados_finales : list[str] = []
        for estado1 in automata1.estados:
            for estado2 in automata2.estados:
                nuevo_estado = estado1 + estado2
                estados.append(nuevo_estado)
                if estado1 == automata1.estado_inicial and estado2 == automata2.estado_inicial:
                    estado_inicial = nuevo_estado
                if estado1 in automata1.estados_finales and estado2 in automata2.estados_finales:
                    estados_finales.append(nuevo_estado)
        return estados, estado_inicial, estados_finales
    
    @staticmethod
    def crear_transiciones(automata1: AutomataOperaciones,automata2: AutomataOperaciones, estados):
        transiciones : list[Transicion] = []
        for estado in estados:
            for transicion_a in automata1.transiciones:
                for transicion_b in automata2.transiciones:
                    if (transicion_a.actual + transicion_b.actual == estado) and (transicion_a.operacion == transicion_b.operacion):
                        destino = transicion_a.destino + transicion_b.destino
                        transiciones.append(Transicion(estado,destino,transicion_a.operacion))
        return transiciones
    
    @staticmethod
    def quitar_inalcanzables(automata:AutomataOperaciones):
        estados_a_remover = []
        for estado in automata.estados:
            if estado != automata.estado_inicial:
                eliminar =True
                for transicion in automata.transiciones:
                    if transicion.destino == estado:
                        eliminar = False
                if eliminar == True:
                    estados_a_remover.append(estado)
                    transiciones_a_remover = Operaciones.transiciones_a_eliminar(automata,estado)
                    Operaciones.eliminar_de_lista(automata.transiciones,transiciones_a_remover)
        Operaciones.eliminar_de_lista(automata.estados,estados_a_remover)
    
    @staticmethod
    def transiciones_a_eliminar(automata: AutomataOperaciones,estado:str) -> list[Transicion]:
        transiciones_a_remover = []
        for transicion in automata.transiciones:
            if transicion.actual == estado:
                transiciones_a_remover.append(transicion)
        return transiciones_a_remover
    
    @staticmethod
    def eliminar_de_lista(lista:list, lista_a_eliminar:list):
        for item in lista_a_eliminar:
            lista.remove(item)        
    
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