from automata_regex import AutomataRegex
from automata_operaciones import AutomataOperaciones
from operaciones import Operaciones as ops
from flask import Flask, request, jsonify
from flask_cors import CORS
import traceback

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
                traceback.print_exc()
                return jsonify({'error': str(e)}), 400

        @self.app.route('/operaciones', methods=['POST'])
        def operaciones():
            try:
                data = request.get_json()
                automata1 = AutomataOperaciones(data.get("automata1"))
                ops.quitar_inalcanzables(automata1)
                automata2 = AutomataOperaciones(data.get("automata2"))
                ops.quitar_inalcanzables(automata2)
                interseccion_json = ops.interseccion(automata1,automata2)
                interseccion_automata = AutomataOperaciones(interseccion_json)
                reverso = ops.reverso(interseccion_automata)
                return jsonify({"interseccion" : interseccion_json , "reverso" : reverso}),200
            except Exception as e:
                print("Se produjo un error:", e)
                traceback.print_exc()
                return jsonify({'error': str(e)}), 400
                
    def run(self):
        self.app.run(debug=True)

if __name__ == "__main__":
    main_instance = Main()
    main_instance.run()