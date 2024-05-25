import "./App.css";
import { BrowserRouter, Route, Routes } from "react-router-dom";

import { ChakraProvider } from "@chakra-ui/react";

import { AutomataProvider } from "./context/AutomataContext";

import { Header } from "./layouts/Header";
import { PAGES } from "./pages";

import { History } from "./pages/History";
import { Landing } from "./pages/Landing";
import { Operations } from "./pages/Operations";
import { ShowAutomata } from "./pages/ShowAutomata";
import { ShowOperations } from "./pages/ShowOperations";

function App() {
  return (
    <AutomataProvider>
      <ChakraProvider>
        <BrowserRouter>
          <Header />

          <Routes>
            <Route path={PAGES.History.path} element={<History />} />
            <Route path={PAGES.Landing.path} element={<Landing />} />
            <Route path={PAGES.Operations.path} element={<Operations />} />
            <Route path={PAGES.ShowAutomata.path} element={<ShowAutomata />} />
            <Route
              path={PAGES.ShowOperations.path}
              element={<ShowOperations />}
            />
          </Routes>
        </BrowserRouter>
      </ChakraProvider>
    </AutomataProvider>
  );
}

export default App;
