import React, {
  ChangeEvent,
  KeyboardEvent,
  SetStateAction,
  useState,
} from "react";
import { useNavigate } from "react-router-dom";

import {
  Accordion,
  AccordionButton,
  AccordionIcon,
  AccordionItem,
  AccordionPanel,
  Box,
  Button,
  FormLabel,
  Heading,
  Input,
  Select,
  Tag,
  TagCloseButton,
  TagLabel,
} from "@chakra-ui/react";
import { GraphvizComponent } from "../components/GraphvizComponent";
import { ArrowForwardIcon } from "@chakra-ui/icons";
import { AutomataNoRegex as Automata } from "../interfaces/Automata";
import Swal from "sweetalert2";
import { PAGES } from ".";
import { useAutomata } from "../context/AutomataContext";
import { apiOperaciones } from "../api/Automatas.api";

export const Operations = () => {
  const [alphabet, setAlphabet] = useState<string[]>([]);
  const [inputAlphabet, setInputAlphabet] = useState<string>("");
  const [errorsAlphabet, setErrorsAlphabet] = useState<string>("");

  const [automataA, setAutomataA] = useState<Automata>({
    estados: ["A0", "A1"],
    alfabeto: [],
    estados_finales: ["A1"],
    estado_inicial: "A0",
    transiciones: [],
  });
  const [automataB, setAutomataB] = useState<Automata>({
    estados: ["B0", "B1"],
    alfabeto: [],
    estados_finales: ["B1"],
    estado_inicial: "B0",
    transiciones: [],
  });

  const { addAutomatas } = useAutomata();

  const navigate = useNavigate();

  const handleKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter") {
      const trimmedValue = inputAlphabet
        .trim()
        .toLowerCase()
        .replace(/\s/g, "");
      const lengthValue = inputAlphabet.length;

      if (trimmedValue !== "" && /[a-zA-Z0-9]+/.test(trimmedValue)) {
        if (alphabet.includes(trimmedValue)) {
          setErrorsAlphabet("Caracter repetido");
          return;
        }

        if (lengthValue === 1) {
          setAlphabet([...alphabet, trimmedValue]);
          setInputAlphabet("");
        } else {
          const slitedValue = trimmedValue.split("");

          const newAlphabet: string[] = [];
          slitedValue.forEach((value) => {
            if (
              !alphabet.includes(value) &&
              !newAlphabet.includes(value) &&
              /[a-zA-Z0-9]+/.test(value)
            ) {
              newAlphabet.push(value);
            }
          });

          setAlphabet([...alphabet, ...newAlphabet]);
          setAutomataA((prev) => {
            if (prev) {
              return {
                ...prev,
                alfabeto: [...alphabet, ...newAlphabet],
              };
            } else {
              return prev;
            }
          });
          setAutomataB((prev) => {
            if (prev) {
              return {
                ...prev,
                alfabeto: [...alphabet, ...newAlphabet],
              };
            } else {
              return prev;
            }
          });
          setInputAlphabet("");
        }

        setErrorsAlphabet("");
      }
    }
  };

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    setInputAlphabet(event.target.value);
    setErrorsAlphabet("");
  };

  const handleRemoveTag = (index: number) => {
    const updatedAlphabet = [...alphabet];
    updatedAlphabet.splice(index, 1);
    setAlphabet(updatedAlphabet);
  };

  const handleEstadosFinales = (
    setAutomata: React.Dispatch<SetStateAction<Automata>>,
    index: number = -1,
    newEstadoFinal?: string
  ) => {
    if (typeof index === "undefined") return;

    if (typeof index === "number" && index !== -1) {
      setAutomata((prev) => {
        if (prev) {
          const newEstadosFinales = [...prev.estados_finales];
          newEstadosFinales.splice(index, 1);
          return {
            ...prev,
            estados_finales: newEstadosFinales,
          };
        } else {
          return prev;
        }
      });
      return;
    }

    if (newEstadoFinal) {
      setAutomata((prev) => {
        if (prev && !prev.estados_finales.includes(newEstadoFinal)) {
          return {
            ...prev,
            estados_finales: [...prev.estados_finales, newEstadoFinal],
          };
        } else {
          return prev;
        }
      });
    }
  };

  const handleTransiciones = (
    setAutomata: React.Dispatch<SetStateAction<Automata>>,
    origin: string,
    word: string,
    destiny: string
  ): void => {
    if (!origin || !word || !destiny) return;

    setAutomata((prev) => {
      if (prev) {
        const newTransiciones = [...prev.transiciones];
        const originIndex = newTransiciones.findIndex(
          (transicion) => transicion[origin]
        );

        if (destiny === "--Seleccione un nodo--") {
          if (originIndex !== -1) {
            const originTransicion = newTransiciones[originIndex][origin] || [];
            const wordIndex = originTransicion.findIndex(
              (wordTransicion) => wordTransicion[word]
            );
            if (wordIndex !== -1) {
              originTransicion.splice(wordIndex, 1);
            }
            newTransiciones[originIndex][origin] = originTransicion;
          }
        } else {
          if (originIndex !== -1) {
            const originTransicion = newTransiciones[originIndex][origin] || [];
            const wordIndex = originTransicion.findIndex(
              (wordTransicion) => wordTransicion[word]
            );
            if (wordIndex !== -1) {
              originTransicion[wordIndex][word] = destiny;
            } else {
              originTransicion.push({ [word]: destiny });
            }
            newTransiciones[originIndex][origin] = originTransicion;
          } else {
            newTransiciones.push({ [origin]: [{ [word]: destiny }] });
          }
        }

        return {
          ...prev,
          transiciones: newTransiciones,
        };
      } else {
        return prev;
      }
    });
  };

  const createEstados = (
    number: number,
    setAutomata: React.Dispatch<SetStateAction<Automata>>,
    word: string
  ) => {
    const arrayEstados: string[] = [];

    for (let index = 0; index < number; index++) {
      arrayEstados.push(`${word}${index}`);
    }

    setAutomata((prev) => {
      if (prev) {
        return {
          ...prev,
          estados: arrayEstados,
          estados_finales: [`${word}${number - 1}`],
        };
      } else {
        return prev;
      }
    });
  };

  const createSumidero = (automata: Automata, wordAutomata: string) => {
    const alphabet: string[] = [...automata.alfabeto];
    const estados: string[] = [
      ...automata.estados,
      `${wordAutomata}${automata.estados.length}`,
    ];
    const transiciones: {
      [key: string]: { [key: string]: string }[];
    }[] = JSON.parse(JSON.stringify(automata.transiciones));

    const estadosActivos: string[] = [];

    transiciones.forEach((transicion) => {
      const currentEstado = Object.keys(transicion)[0];
      estadosActivos.push(currentEstado);
    });

    const newTransiciones = estados.filter(
      (elemento) => !estadosActivos.includes(elemento)
    );

    newTransiciones.map((transicion) => {
      transiciones.push({ [transicion]: [] });
    });

    transiciones.forEach((transicion, index) => {
      const currentEstado = Object.keys(transicion)[0];
      const transicionData = transicion[currentEstado];
      const currentAlphabet: string[] = [];

      transicionData.forEach((currentTransicion) => {
        Object.keys(currentTransicion).forEach((word) => {
          currentAlphabet.push(word);
        });
      });

      const diferencia = alphabet.filter(
        (elemento) => !currentAlphabet.includes(elemento)
      );

      if (diferencia.length > 0) {
        alphabet.map((word) => {
          if (diferencia.includes(word)) {
            transiciones[index][Object.keys(transiciones[index])[0]].push({
              [word]: `${wordAutomata}${automata.estados.length}`,
            });
          }
        });
      }
    });

    return {
      ...automata,
      estados,
      transiciones,
    };
  };

  return (
    <div className="flex flex-col justify-center items-center gap-4 mb-12">
      <div className="flex flex-col gap-4">
        <FormLabel>Alfabeto</FormLabel>
        <div className="flex ">
          <Input
            type="text"
            value={inputAlphabet}
            onChange={handleChange}
            onKeyDown={handleKeyDown}
            placeholder="Añadir nuevo caracter"
          />
        </div>

        {errorsAlphabet && (
          <div className="flex justify-center">
            <Tag colorScheme="red">{errorsAlphabet}</Tag>
          </div>
        )}
      </div>

      <div className="flex gap-4">
        {alphabet.length > 0 ? (
          alphabet.map((word, index) => (
            <Tag colorScheme="whatsapp" key={index}>
              <TagLabel>{word}</TagLabel>
              <TagCloseButton onClick={() => handleRemoveTag(index)} />
            </Tag>
          ))
        ) : (
          <Tag colorScheme="red">Aún no hay un alfabeto definido</Tag>
        )}
      </div>

      <div className="flex justify-center gap-4 items-center bg-[#04B4BF]/[.2] p-2 rounded-lg">
        <div className="w-4 h-4 bg-[#03c04a] rounded-full" />
        <p>Estado inicial</p>
      </div>

      <div className="flex justify-evenly w-full">
        <div className="flex flex-col gap-4">
          <Heading>Automata A</Heading>

          <GraphvizComponent automata={automataA} />

          <FormLabel>Número de estados</FormLabel>
          <Select
            onChange={(event: React.ChangeEvent<HTMLSelectElement>) =>
              createEstados(parseInt(event.target.value), setAutomataA, "A")
            }
          >
            <option value={2}>2</option>
            <option value={3}>3</option>
            <option value={4}>4</option>
          </Select>

          <FormLabel>Transiciones</FormLabel>
          <Accordion allowMultiple>
            {automataA.estados &&
              automataA.estados.map((estadoA, index) => (
                <AccordionItem key={index}>
                  <h2>
                    <AccordionButton>
                      <Box as="span" flex="1" textAlign="left">
                        {estadoA}
                      </Box>
                      <AccordionIcon />
                    </AccordionButton>
                  </h2>
                  <AccordionPanel pb={4}>
                    {alphabet.length > 0 ? (
                      alphabet.map((word, index) => (
                        <div
                          className="flex items-center gap-12 mx-12"
                          key={index}
                        >
                          <p className="text-xl">{word}</p>

                          <ArrowForwardIcon />

                          <Select
                            onChange={(
                              event: React.ChangeEvent<HTMLSelectElement>
                            ) =>
                              handleTransiciones(
                                setAutomataA,
                                estadoA,
                                word,
                                event.target.value
                              )
                            }
                          >
                            <option value="--Seleccione un nodo--">
                              --Seleccione un nodo--
                            </option>
                            {automataA.estados &&
                              automataA.estados.map((estado, index) => (
                                <option key={index} value={estado}>
                                  {estado}
                                </option>
                              ))}
                          </Select>
                        </div>
                      ))
                    ) : (
                      <div className="flex justify-center w-full">
                        <Tag colorScheme="red">
                          Aún no hay un alfabeto definido
                        </Tag>
                      </div>
                    )}
                  </AccordionPanel>
                </AccordionItem>
              ))}
          </Accordion>

          <FormLabel>Estados finales</FormLabel>
          <Select
            onChange={(event: React.ChangeEvent<HTMLSelectElement>) => {
              handleEstadosFinales(setAutomataA, -1, event.target.value);
              event.target.value = "";
            }}
          >
            <option value="">--Seleccione un nodo como estado final--</option>
            {automataA.estados &&
              automataA.estados.map((estado, index) => (
                <option key={index} value={estado}>
                  {estado}
                </option>
              ))}
          </Select>

          <div className="flex justify-center gap-4">
            {automataA.estados_finales.length > 0 ? (
              automataA.estados_finales.map((estado, index) => (
                <Tag colorScheme="whatsapp" key={index}>
                  <TagLabel>{estado}</TagLabel>
                  <TagCloseButton
                    onClick={() => handleEstadosFinales(setAutomataA, index)}
                  />
                </Tag>
              ))
            ) : (
              <Tag colorScheme="red">Aún no hay estados finales</Tag>
            )}
          </div>
        </div>

        <div className="flex flex-col gap-4">
          <Heading>Automata B</Heading>

          <GraphvizComponent automata={automataB} />

          <FormLabel>Número de estados</FormLabel>
          <Select
            onChange={(event: React.ChangeEvent<HTMLSelectElement>) =>
              createEstados(parseInt(event.target.value), setAutomataB, "B")
            }
          >
            <option value={2}>2</option>
            <option value={3}>3</option>
            <option value={4}>4</option>
          </Select>

          <FormLabel>Transiciones</FormLabel>
          <Accordion allowMultiple>
            {automataB.estados &&
              automataB.estados.map((estadoB, index) => (
                <AccordionItem key={index}>
                  <h2>
                    <AccordionButton>
                      <Box as="span" flex="1" textAlign="left">
                        {estadoB}
                      </Box>
                      <AccordionIcon />
                    </AccordionButton>
                  </h2>
                  <AccordionPanel pb={4}>
                    {alphabet.length > 0 ? (
                      alphabet.map((word, index) => (
                        <div
                          className="flex items-center gap-12 mx-12"
                          key={index}
                        >
                          <p className="text-xl">{word}</p>

                          <ArrowForwardIcon />
                          <Select
                            onChange={(
                              event: React.ChangeEvent<HTMLSelectElement>
                            ) =>
                              handleTransiciones(
                                setAutomataB,
                                estadoB,
                                word,
                                event.target.value
                              )
                            }
                          >
                            <option value="">--Seleccione un nodo--</option>
                            {automataB.estados &&
                              automataB.estados.map((estado, index) => (
                                <option key={index} value={estado}>
                                  {estado}
                                </option>
                              ))}
                          </Select>
                        </div>
                      ))
                    ) : (
                      <div className="flex justify-center w-full">
                        <Tag colorScheme="red">
                          Aún no hay un alfabeto definido
                        </Tag>
                      </div>
                    )}
                  </AccordionPanel>
                </AccordionItem>
              ))}
          </Accordion>

          <FormLabel>Estados finales</FormLabel>
          <Select
            onChange={(event: React.ChangeEvent<HTMLSelectElement>) => {
              handleEstadosFinales(setAutomataB, -1, event.target.value);
              event.target.value = "";
            }}
          >
            <option value="">--Seleccione un nodo como estado final--</option>
            {automataB.estados &&
              automataB.estados.map((estado, index) => (
                <option key={index} value={estado}>
                  {estado}
                </option>
              ))}
          </Select>

          <div className="flex justify-center gap-4">
            {automataB.estados_finales.length > 0 ? (
              automataB.estados_finales.map((estado, index) => (
                <Tag colorScheme="whatsapp" key={index}>
                  <TagLabel>{estado}</TagLabel>
                  <TagCloseButton
                    onClick={() => handleEstadosFinales(setAutomataB, index)}
                  />
                </Tag>
              ))
            ) : (
              <Tag colorScheme="red">Aún no hay estados finales</Tag>
            )}
          </div>
        </div>
      </div>

      <Button
        colorScheme="whatsapp"
        onClick={() => {
          Swal.fire({
            title: "Verificar",
            text: "Estás seguro de los automatas ingresados?",
            icon: "question",
          }).then((result) => {
            if (result.isConfirmed) {
              const automata1 = createSumidero(automataA, "A");

              const automata2 = createSumidero(automataB, "B");

              apiOperaciones(automata1, automata2)
                .then(({ data: { interseccion, reverso } }) => {
                  Swal.fire({
                    title: `OK`,
                    icon: "success",
                  }).then((result) => {
                    if (result.isConfirmed) {
                      addAutomatas(automata1, interseccion, automata2, reverso);
                      navigate(PAGES.ShowOperations.path);
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
            }
          });
        }}
      >
        Enviar
      </Button>
    </div>
  );
};
