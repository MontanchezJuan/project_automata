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
        automata_interseccion = AutomataOperaciones({"alfabeto": alfabeto, "estados": estados, "estado_inicial":estado_inicial, "estados_finales": estados_finales, "transiciones":AutomataOperaciones.transiciones_to_json(transiciones)})
        Operaciones.juntar_sumideros(automata_interseccion,automata1.sumidero,automata2.sumidero)
        return automata_interseccion.to_json()
      
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
    def juntar_sumideros(automata:AutomataOperaciones, sumidero1:str, sumidero2:str):     
        sumidero = "S"   
        for estado in automata.estados:
            if sumidero1 in estado or sumidero2 in estado:
                transiciones_a_eliminar: list = []
                for transicion in automata.transiciones:
                    if transicion.destino == estado:
                        if sumidero1 not in transicion.actual and sumidero2 not in transicion.actual:
                            transicion.destino = sumidero
                        else:
                            transiciones_a_eliminar.append(transicion)
                Operaciones.eliminar_de_lista(automata.transiciones,transiciones_a_eliminar)
                estado = sumidero
        Operaciones.quitar_inalcanzables(automata)
        for simbolo in automata.alfabeto:
            automata.transiciones.append(Transicion(sumidero,sumidero,simbolo))
        automata.estados.append(sumidero)
        automata.sumidero = sumidero
                
    
    @staticmethod
    def quitar_inalcanzables(automata:AutomataOperaciones):
        estados_a_remover = []
        for estado in automata.estados:
            if estado != automata.estado_inicial:
                eliminar =True
                for transicion in automata.transiciones:
                    if transicion.destino == estado and transicion.actual != estado:
                    ##! revisar si ya permite eliminar estados inalcanzables con bucles
                    ##! revisar que se eliminen los estados correctamente
                        eliminar = False
                if eliminar == True:
                    estados_a_remover.append(estado)
                    transiciones_a_remover = Operaciones.transiciones_a_eliminar(automata,estado)
                    Operaciones.eliminar_de_lista(automata.transiciones,transiciones_a_remover)
        Operaciones.eliminar_de_lista(automata.estados,estados_a_remover)
        Operaciones.eliminar_de_lista(automata.estados_finales,estados_a_remover)
        if len(estados_a_remover) >0:
            
            Operaciones.quitar_inalcanzables(automata)
    
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
            if item in lista:
                lista.remove(item)    

    @staticmethod
    def reverso(automata: AutomataOperaciones):
        transiciones_reverso = Operaciones.crear_transiciones_reverso(automata)
        alfabeto = automata.alfabeto.copy()
        estados : list[str] = automata.estados.copy()
        estados_finales: list[str] = [automata.estado_inicial]
        estado_inicial : str
        if len(automata.estados_finales) >1:
            estado_inicial = Operaciones.crear_estado_inicial_reverso(estados,transiciones_reverso,automata)
        else:
            estado_inicial = automata.estados_finales[0] if automata.estados_finales else None
        automata_reverso = AutomataOperaciones({"alfabeto": alfabeto, "estados": estados, "estado_inicial":estado_inicial, "estados_finales": estados_finales, "transiciones":AutomataOperaciones.transiciones_to_json(transiciones_reverso)})
        Operaciones.quitar_inalcanzables(automata_reverso)
        return automata_reverso.to_json()           
        
    @staticmethod
    def crear_transiciones_reverso(automata: AutomataOperaciones):
        transiciones_reverso: list[Transicion] = []
        for transicion in automata.transiciones:
            transicion_nueva = Transicion(transicion.destino,transicion.actual,transicion.operacion)
            transiciones_reverso.append(transicion_nueva)
        return transiciones_reverso
    
    @staticmethod
    def crear_estado_inicial_reverso(estados: list[str],transiciones_reverso:list[Transicion],automata: AutomataOperaciones):
        estado_inicial = "S0"
        estados.append(estado_inicial)
        for estado_final in automata.estados_finales:
            transicion_nueva = Transicion(estado_inicial, estado_final, "λ")
            transiciones_reverso.append(transicion_nueva)
        return estado_inicial