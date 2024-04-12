class Automata:
    def __init__(self, regex) -> None:
        self.estados: list[str] = []
        self.idx_estados:int = 0
        self.alfabeto: list[str] = []
        self.transiciones: list[Transicion] = []
        self.estado_inicial: str = ""
        self.estados_finales: list[str] = []
        self.regex: str = regex
        self.regex_list: list[str] = []
        self.regex_estructurada: list[any] = []
        self.multiplicadores = ["+","*","?"]
        self.operadores = ["|"]
        self.agrupadores = ["(",")"]
        self.quintupla()
    
    def quintupla(self):
        self.regex_to_list()
        self.set_alfabeto()
        self.regex_estructurada = self.estructurar_regex(self.regex_list)
        automata = self.leer_regex(self.regex_estructurada,self.idx_estados)
        self.estados, self.estado_inicial, self.estado_final, self.transiciones= self.get_quintupla(automata)
        
    def regex_to_list(self):
        for char in self.regex:
            self.regex_list.append(char)
            
    def estructurar_regex(self, regex:list[str]):
        temp_regex = regex 
        regex_estructurada: list[any] = []
        idx = 0
        while idx < len(temp_regex):
            if temp_regex[idx] not in self.agrupadores:
                regex_estructurada.append(temp_regex[idx])
                idx+=1
            elif temp_regex[idx] == "(":
                idx_final = idx + self.leer_parentesis(temp_regex,idx)                   
                regex_estructurada.append(self.estructurar_regex(temp_regex[idx+1:idx_final]))
                idx = idx_final+1
            else:
                idx+=1
        return regex_estructurada
                   
    def leer_parentesis(self,regex,idx):
        regex1 = regex.copy()
        regex1 = regex1[idx+1:]
        count1= 1
        count2= 0
        for idx1,char in enumerate(regex1):
            if char == "(":
                count1+=1
            elif char == ")":
                count2+=1
            if count1 == count2:
                return idx1 +1            

    def set_alfabeto(self):
        for char in self.regex:
            if (char not in self.operadores) and (char not in self.agrupadores) and (char not in self.multiplicadores) and (char not in self.alfabeto):
                self.alfabeto.append(char)
                
    def get_quintupla(self,a):
        return a.estados , a.estado_inicial , a.estado_final, a.transiciones
    
    def transiciones_str(self):
        transiciones_str = ""
        for transicion in self.transiciones:
            transiciones_str+= f"origen:{transicion.actual} - destino: {transicion.destino} - operacion: { transicion.operacion}\n"
        return transiciones_str
    
    def leer_regex(self, regex_estructurad: list[any], idx):
        # por que repite S6 a S7?
        # esto pasa con la primera 'a' del parentesis
        regex_estructurada = regex_estructurad
        print(regex_estructurada)
        self.idx_estados = idx
        automata = None
        i=0
        while i < len ( regex_estructurada):
        # for i in range(len(regex_estructurada)):
            if isinstance(regex_estructurada[i],str) and regex_estructurada[i] in self.alfabeto:
                automata,aumento = self.crear_automata_a(regex_estructurada,i, automata)
                i=aumento
            elif isinstance(regex_estructurada[i],list):
                automata,aumento = self.crear_automata_list(regex_estructurada,i,automata)
                i=aumento
            elif isinstance(regex_estructurada[i], str) and regex_estructurada[i] in self.operadores:
                automata,aumento = self.crear_automata_or(regex_estructurada,i,automata)
                i=aumento
            i+=1
        return automata
    
    def crear_automata_a(self, regex_estructurada,i, automata):
        automata_1 = automata
        automata_2 = AutomataTipoA(self.idx_estados,regex_estructurada[i])
        self.idx_estados = automata_2.idx_estados
        if i+1 <len(regex_estructurada) and regex_estructurada[i+1] in self.multiplicadores:
            automata_2 = AutomataMultiplicado(self.idx_estados,automata_2,regex_estructurada[i+1])
            self.idx_estados = automata_2.idx_estados
            i+=1
        if automata_1 is not None:
            automata_1 = AutomataTipoAB(automata_1,automata_2,self.idx_estados)
            self.idx_estados = automata_2.idx_estados
        else:
            automata_1 = automata_2
        return automata_1, i
                
    def crear_automata_list(self, regex_estructurada,i, automata):
        automata_1 = automata
        automata_2 = self.leer_regex(regex_estructurada[i],self.idx_estados)
        self.idx_estados = automata_2.idx_estados
        if i+1 <len(regex_estructurada) and regex_estructurada[i+1] in self.multiplicadores:
            automata_2 = AutomataMultiplicado(self.idx_estados,automata_2,regex_estructurada[i+1])
            self.idx_estados = automata_2.idx_estados
            i+=1
        if automata_1 is not None:
            automata_1 = AutomataTipoAB(automata_1,automata_2,self.idx_estados)
            self.idx_estados = automata_2.idx_estados
        else:
            automata_1 = automata_2
        return automata_1,i
            
    def crear_automata_or(self, regex_estructurada,i, automata):
        automata_1 = automata
        automata_2 = self.leer_regex(regex_estructurada[i+1:],self.idx_estados)
        automata_1 = AutomataAOB(self.idx_estados,automata_1,automata_2)
        self.idx_estados = automata_2.idx_estados
        i += len(regex_estructurada[i+1:])
        return automata_1,i     

class Transicion:
    def __init__(self, actual:str, destino:str, operacion:str) -> None:
        self.actual:str = actual
        self.destino:str = destino
        self.operacion:str = operacion
    

class AutomataTipoA:
    def __init__(self, idx:int, operacion:str) -> None:
        self.idx_estados = idx
        self.estados:list[str] = [f"S{self.idx_estados}",f"S{self.idx_estados+1}"]
        self.estado_inicial:str = self.estados[0]
        self.estado_final: str = self.estados[1] 
        self.transiciones: list[Transicion] = [Transicion(self.estado_inicial,self.estado_final,operacion)]
        self.idx_estados+=len(self.estados)
        
class AutomataTipoAB:
    def __init__(self, a,b, idx :int) -> None:
        self.idx_estados = idx
        self.a = a
        self.b = b
        self.estados = a.estados
        self.estados.extend(b.estados)
        self.estado_inicial = self.a.estado_inicial
        self.estado_final = self.b.estado_final
        self.transiciones:list[Transicion] = self.a.transiciones
        self.transiciones.extend(self.b.transiciones)
        self.transiciones.append(Transicion(a.estado_final,b.estado_inicial,"lambda"))
        
class AutomataAOB:
    def __init__(self,idx:int, a , b) -> None:
        self.idx_estados = idx
        self.a = a
        self.b = b
        self.estados: list[str] = [f"S{self.idx_estados}"]
        self.estados.extend(a.estados)
        self.estados.extend(b.estados)
        self.estados.append(f"S{self.idx_estados+1}")
        self.idx_estados+=2
        self.estado_inicial:str = self.estados[0]
        self.estado_final:str = self.estados[len(self.estados)-1]
        self.transiciones: list[Transicion] = self.a.transiciones
        self.transiciones.extend(self.b.transiciones)
        self.transiciones.append(Transicion(self.estado_inicial,a.estado_inicial,"lambda"))
        self.transiciones.append(Transicion(self.estado_inicial,b.estado_inicial,"lambda"))
        self.transiciones.append(Transicion(a.estado_final,self.estado_final,"lambda"))
        self.transiciones.append(Transicion(b.estado_final,self.estado_final,"lambda"))      

class AutomataMultiplicado:
    def __init__(self, idx:int , a , multiplicador :str) -> None:
        self.idx_estados = idx
        self.a = a
        self.multiplicador = multiplicador
        self.multiplicar()
        self.estados = a.estados
        self.estado_inicial = a.estado_inicial
        self.estado_final = a.estado_final
        self.transiciones = a.transiciones
        
    def multiplicar(self):
        if self.multiplicador == "*":
            self.a.estados.extend([f"S{self.idx_estados}",f"S{self.idx_estados+1}"])
            self.a.transiciones.append(Transicion(self.a.estados[len(self.a.estados)-2],self.a.estado_inicial,"lambda"))
            self.a.transiciones.append(Transicion(self.a.estados[len(self.a.estados)-2],self.a.estados[len(self.a.estados)-1],"lambda"))
            self.a.transiciones.append(Transicion(self.a.estado_final,self.a.estados[len(self.a.estados)-1],"lambda"))
            self.a.transiciones.append(Transicion(self.a.estado_final,self.a.estado_inicial,"lambda"))
            self.a.estado_inicial = self.a.estados[len(self.a.estados)-2]
            self.a.estado_final = self.a.estados[len(self.a.estados)-1]
            self.idx_estados+=2
        if self.multiplicador == "?":
            self.a.transiciones.append(Transicion(self.a.estado_inicial,self.a.estado_final,"lambda"))
        if self.multiplicador == "+":
            self.a.estados.extend([f"S{self.idx_estados}",f"S{self.idx_estados+1}"])
            self.a.transiciones.append(Transicion(self.a.estados[len(self.a.estados)-2],self.a.estado_inicial,"lambda"))
            self.a.transiciones.append(Transicion(self.a.estado_final,self.a.estados[len(self.a.estados)-1],"lambda"))
            self.a.transiciones.append(Transicion(self.a.estado_final,self.a.estado_inicial,"lambda"))
            self.a.estado_inicial = self.a.estados[len(self.a.estados)-2]
            self.a.estado_final = self.a.estados[len(self.a.estados)-1]
            self.idx_estados+=2
             
             
             
             
                


# automata = Automata("aa*(a|(b|ab)*)+c")
# print("alfabeto: ",automata.alfabeto)
# print(automata.regex_estructurada)
# automata = Automata("(a)(a|b)(b)*")
# print("alfabet: ",automata.alfabeto)
# print(automata.regex_estructurada)
automata = Automata("(a|b)*b(a|ab)*")
print("alfabet: ",automata.alfabeto)
# print(automata.regex_estructurada)
# automata = Automata("ab(b)*|(a|b)*b(b)*")
# print("alfabet: ",automata.alfabeto)
# print(automata.regex_estructurada)
print("estados: ",automata.estados)
print("estado_inicial: ",automata.estado_inicial)
print("estado_final: ",automata.estado_final)
print("transiciones: ",automata.transiciones_str())


# estados=["q0", "q1", "q2", "q3", "q4"],
# alfabeto=["0", "1"],
# transiciones=[
#     {"q0": {"0": "q3", "1": "q1"}},
#         {"q1": {"0": "q3", "1": "q2"}},
#         {"q2": {"0": "q3", "1": "q2"}},
#         {"q3": {"0": "q4", "1": "q1"}},
#         {"q4": {"0": "q4", "1": "q1"}},
# ],
# estado_inicial="q0",
# estados_finales=["q2", "q4"],