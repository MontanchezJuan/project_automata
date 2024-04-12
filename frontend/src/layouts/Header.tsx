import React from "react";
import { useNavigate } from "react-router-dom";

import { Heading, Tab, TabList, Tabs } from "@chakra-ui/react";

export const Header = () => {
  const navigate = useNavigate();

  return (
    <>
      <div className="flex justify-center items-center h-16">
        <Heading>Lector de expresiones regulares</Heading>
      </div>

      <Tabs isFitted variant="enclosed">
        <TabList mb="1em">
          <Tab onClick={() => navigate("/")}>
            <p>Inicio</p>
          </Tab>

          <Tab onClick={() => navigate("/history")}>
            <p>Historial</p>
          </Tab>
        </TabList>
      </Tabs>
    </>
  );
};
