import React from "react";

import {
  List,
  Badge,
  Button,
  Card,
  CardFooter,
  CardHeader,
  Heading,
} from "@chakra-ui/react";

import { useAutomata } from "../context/AutomataContext";
import { useNavigate } from "react-router-dom";

import { PAGES } from ".";

export const History = () => {
  const { history, deleteAutomata, setAutomata } = useAutomata();

  const navigate = useNavigate();

  return (
    <div className="flex flex-col justify-center items-center">
      <List spacing={3}>
        {history && history.length > 0 ? (
          history.map((automata) => (
            <Card align="center">
              <CardHeader>
                <Heading size="md">{automata.regex}</Heading>
              </CardHeader>

              <CardFooter className="flex gap-8">
                <Button
                  colorScheme="whatsapp"
                  onClick={() => {
                    setAutomata(automata);
                    navigate(PAGES.ShowAutomata.path);
                  }}
                >
                  Ver Automata
                </Button>
                <Button
                  colorScheme="red"
                  onClick={() => deleteAutomata(automata)}
                >
                  Eliminar
                </Button>
              </CardFooter>
            </Card>
          ))
        ) : (
          <div className="flex flex-col justify-evenly items-center gap-4">
            <Badge colorScheme="red" className="p-4">
              Aún no se han provado automatas
            </Badge>

            <Button
              colorScheme="whatsapp"
              onClick={() => navigate(PAGES.Landing.path)}
            >
              Volver a Inicio
            </Button>
          </div>
        )}
      </List>
    </div>
  );
};
