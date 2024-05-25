import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

import { Heading, Tab, TabList, Tabs } from "@chakra-ui/react";
import { PAGES, Page } from "../pages";

export const Header = () => {
  const [header, setHeader] = useState(PAGES.Landing.name);
  const navigate = useNavigate();

  const rediretTo = (page: Page) => {
    navigate(page.path);
    setHeader(page.name);
  };

  return (
    <>
      <div className="flex justify-center items-center h-16">
        <Heading>{header}</Heading>
      </div>

      <Tabs isFitted variant="enclosed">
        <TabList mb="1em">
          <Tab onClick={() => rediretTo(PAGES.Landing)}>
            <p>{PAGES.Landing.name}</p>
          </Tab>

          <Tab onClick={() => rediretTo(PAGES.Operations)}>
            <p>{PAGES.Operations.name}</p>
          </Tab>

          <Tab onClick={() => rediretTo(PAGES.History)}>
            <p>{PAGES.History.name}</p>
          </Tab>
        </TabList>
      </Tabs>
    </>
  );
};
