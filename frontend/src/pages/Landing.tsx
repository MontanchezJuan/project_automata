import React, { ChangeEvent, useState } from "react";
import { useNavigate } from "react-router-dom";

import { Button, Heading, Input } from "@chakra-ui/react";
import Swal from "sweetalert2";

import { useAutomata } from "../context/AutomataContext";

import { PAGES } from ".";
import { apiCrearAutomata } from "../api/Automatas.api";

const OPERANDOS: string[] = ["(", ")", "|", "+", "*", "?"];

export const Landing = () => {
  const [regex, setRegex] = useState<string>("");
  const [position, setPosition] = useState<number | null>(0);

  const navigate = useNavigate();

  const { addAutomata } = useAutomata();

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

      return false;
    });

    if (notValid) return;

    apiCrearAutomata(regex)
      .then((response) => {
        Swal.fire({
          title: `OK`,
          text: response.data.message,
          icon: "success",
        }).then((result) => {
          if (result.isConfirmed) {
            addAutomata(response.data.automata);
            navigate(PAGES.ShowAutomata.path);
          }
        });
      })
      .catch((error) => {
        Swal.fire({
          title: `Error`,
          text: error,
          icon: "error",
        });
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
