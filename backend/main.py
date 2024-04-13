from automataModel import Automata       
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
                automata = Automata(regex)
                data_response = automata.estructurar_api()
                return jsonify({"regex":automata.regex,'message': 'Automata creado correctamente', 'automata': data_response})
            except Exception as e:
                return jsonify({'error': str(e)}), 400

    def run(self):
        self.app.run(debug=True)

if __name__ == "__main__":
    main_instance = Main()
    main_instance.run()