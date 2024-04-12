import React, { ChangeEvent, useState } from "react";
import { useNavigate } from "react-router-dom";

import { Button, Heading, Input } from "@chakra-ui/react";
import Swal from "sweetalert2";

import { useAutomata } from "../context/AutomataContext";

const OPERANDOS: string[] = ["(", ")", "|", "+", "*", "?"];

export const Landing = () => {
  const [regex, setRegex] = useState<string>("");
  const [position, setPosition] = useState<number | null>(0);

  const navigate = useNavigate();

  const { updateAutomata } = useAutomata();

  const handleClick = (e: React.MouseEvent<HTMLInputElement>) => {
    const target = e.target as HTMLInputElement;
    setPosition(target.selectionStart);
  };

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { value, selectionStart } = e.target;

    setPosition(selectionStart);
    setRegex(value.toLocaleLowerCase());
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "ArrowLeft") {
      const target = e.target as HTMLInputElement;
      if (target.selectionStart === null) return;
      setPosition(target.selectionStart - 1);
    } else if (e.key === "ArrowRight") {
      const target = e.target as HTMLInputElement;
      if (target.selectionStart === null) return;
      setPosition(target.selectionStart + 1);
    }
  };

  const handleRegex = (value: string) => {
    if (position === null) return;
    const newValue =
      regex.substring(0, position) + value + regex.substring(position);
    setRegex(newValue);
  };

  const validateRegex = () => {
    if (regex === null || regex === "") {
      Swal.fire({
        title: "Ups!",
        text: "Aún no se ha encontrado una expresión regular",
        icon: "error",
      });
      return;
    }

    const regexSplited = regex.split("");
    const notValid = regexSplited.some((value, i) => {
      if (i - 1 < 0) return false;

      if (!OPERANDOS.includes(value) && !/[a-zA-Z]/.test(value)) {
        Swal.fire({
          title: `Operador inválido ${value}`,
          text: `Te recomendamos cambiar el operador inválido ${value}`,
          icon: "error",
        });
        return true;
      }

      if (value === "|") {
        if (regexSplited[i - 1] === "(") {
          Swal.fire({
            title: `Operadores inválidos ${regexSplited[i - 1] + value}`,
            text: `Te recomendamos cambiar el operador inválido ${value} de la siguiente parte de la expresión ${
              regexSplited[i - 1] + value
            }`,
            icon: "error",
          });
          return true;
        } else if (regexSplited[i + 1] === ")") {
          Swal.fire({
            title: `Operadores inválidos ${value + regexSplited[i + 1]}`,
            text: `Te recomendamos cambiar el operador inválido ${value} de la siguiente parte de la expresión ${
              value + regexSplited[i + 1]
            }`,
            icon: "error",
          });
          return true;
        }
      }

      if (value === regexSplited[i - 1]) {
        Swal.fire({
          title: `Operador repetido ${value}`,
          text: `Te recomendamos cambiar alguno de los operadores repetidos ${
            regexSplited[i - 1] + regexSplited[i]
          }`,
          icon: "question",
        });
        return true;
      }

      return false;
    });

    if (notValid) return;

    Swal.fire({
      title: `OK`,
      icon: "success",
    }).then((result) => {
      if (result.isConfirmed) {
        updateAutomata({
          estados: ["q0", "q1", "q2", "q3", "q4", "q5"],
          alfabeto: ["a", "b", "c"],
          transiciones: [
            { q0: { a: "q1", "b,c": "q3" } },
            { q1: { c: "q2", a: "q4", b: "q3" } },
            { q2: { "a,b,c": "q2" } },
            { q3: { a: "q4", "b,c": "q3" } },
            { q4: { a: "q4", b: "q5", c: "q3" } },
            { q5: { a: "q4", "b,c": "q3" } },
          ],
          estado_inicial: "q0",
          estados_finales: ["q2", "q4"],
        });
        navigate("/automata");
      }
    });
  };

  return (
    <div className="flex flex-col justify-center items-center gap-4">
      <Heading>
        Regex: <span className="text-[#385898]">{regex}</span>
      </Heading>

      <div>
        <Input
          value={regex}
          type="text"
          onChange={(e) => handleInputChange(e)}
          onClick={(e) => handleClick(e)}
          onKeyDown={(e) => handleKeyDown(e)}
          placeholder="(a|b)*a"
        />
      </div>

      <div className="flex justify-center items-center gap-4">
        {OPERANDOS.map((operando, index) => (
          <Button
            key={index}
            colorScheme="whatsapp"
            onClick={() => handleRegex(operando)}
          >
            {operando}
          </Button>
        ))}
      </div>

      <div className="flex justify-center items-center">
        <Button colorScheme="whatsapp" onClick={validateRegex}>
          Validate regex
        </Button>
      </div>
    </div>
  );
};
