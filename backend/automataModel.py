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
            
    def estructurar_api(self):
        copia_transiciones = self.transiciones.copy()
        transiciones = []
        while len(copia_transiciones) !=0:
            print(copia_transiciones[0].actual)
            print(copia_transiciones[0].operacion)
            print(copia_transiciones[0].destino)
            quitar = [0]
            for i in range(1,len(copia_transiciones)):
                if copia_transiciones[0].actual == copia_transiciones[i].actual:
                    quitar.append(i)
            operaciones = []
            for i in quitar:
                operaciones.append({copia_transiciones[i].operacion:copia_transiciones[i].destino})
            print(operaciones)
            transicion = {copia_transiciones[0].actual:operaciones}
            transiciones.append(transicion)
            quitar.sort(reverse=True)
            for i in quitar:
                copia_transiciones.pop(i)
        return  {  "estados":self.estados,
                   "alfabeto":self.alfabeto,
                   "transiciones":transiciones,
                   "estado_inicial":self.estado_inicial,
                   "estado_final":self.estado_final}
            
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
        regex_estructurada = regex_estructurad
        self.idx_estados = idx
        automata = None
        i=0
        while i < len ( regex_estructurada):
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
        self.transiciones.append(Transicion(a.estado_final,b.estado_inicial,"λ"))
        
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
        self.transiciones.append(Transicion(self.estado_inicial,a.estado_inicial,"λ"))
        self.transiciones.append(Transicion(self.estado_inicial,b.estado_inicial,"λ"))
        self.transiciones.append(Transicion(a.estado_final,self.estado_final,"λ"))
        self.transiciones.append(Transicion(b.estado_final,self.estado_final,"λ"))      

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
            self.a.transiciones.append(Transicion(self.a.estados[len(self.a.estados)-2],self.a.estado_inicial,"λ"))
            self.a.transiciones.append(Transicion(self.a.estados[len(self.a.estados)-2],self.a.estados[len(self.a.estados)-1],"λ"))
            self.a.transiciones.append(Transicion(self.a.estado_final,self.a.estados[len(self.a.estados)-1],"λ"))
            self.a.transiciones.append(Transicion(self.a.estado_final,self.a.estado_inicial,"λ"))
            self.a.estado_inicial = self.a.estados[len(self.a.estados)-2]
            self.a.estado_final = self.a.estados[len(self.a.estados)-1]
            self.idx_estados+=2
        if self.multiplicador == "?":
            self.a.transiciones.append(Transicion(self.a.estado_inicial,self.a.estado_final,"λ"))
        if self.multiplicador == "+":
            self.a.estados.extend([f"S{self.idx_estados}",f"S{self.idx_estados+1}"])
            self.a.transiciones.append(Transicion(self.a.estados[len(self.a.estados)-2],self.a.estado_inicial,"λ"))
            self.a.transiciones.append(Transicion(self.a.estado_final,self.a.estados[len(self.a.estados)-1],"λ"))
            self.a.transiciones.append(Transicion(self.a.estado_final,self.a.estado_inicial,"λ"))
            self.a.estado_inicial = self.a.estados[len(self.a.estados)-2]
            self.a.estado_final = self.a.estados[len(self.a.estados)-1]
            self.idx_estados+=2