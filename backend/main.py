from automata_regex import AutomataRegex
from automata_operaciones import AutomataOperaciones
from operaciones import Operaciones as ops
from flask import Flask, request, jsonify
from flask_cors import CORS

class Main:
    def __init__(self):
        self.app = Flask(__name__)
        CORS(self.app)

        @self.app.route('/crear-automata', methods=['POST'])
        def crear_autamata():
            try:
                data = request.get_json()
                regex = data.get('regex')
                # Aquí puedes agregar tu lógica para procesar el String recibido
                automata = AutomataRegex(regex)
                data_response = automata.estructurar_api()
                return jsonify({'message': 'Automata creado correctamente', 'automata': data_response})
            except Exception as e:
                return jsonify({'error': str(e)}), 400

        @self.app.route('/operaciones', methods=['POST'])
        def operaciones():
            try:
                data = request.get_json()
                automata1 = AutomataOperaciones(data.get("automata1"))
                automata2 = AutomataOperaciones(data.get("automata2"))
                interseccion = ops.interseccion(automata1,automata2)
                # reverso = ops.reverso(interseccion)
                return jsonify({"interseccion" : interseccion , "reverso" : "reverso"}),200
            except Exception as e:
                return jsonify({'error': str(e)}), 400
                
        

    def run(self):
        self.app.run(debug=True)

if __name__ == "__main__":
    main_instance = Main()
    main_instance.run()