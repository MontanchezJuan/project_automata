import "./App.css";
import { BrowserRouter, Route, Routes } from "react-router-dom";

import { ChakraProvider } from "@chakra-ui/react";

import { Header } from "./layouts/Header";

import { Landing } from "./pages/Landing";
import { History } from "./pages/History";
import { ShowAutomata } from "./pages/ShowAutomata";
import { AutomataProvider } from "./context/AutomataContext";

function App() {
  return (
    <AutomataProvider>
      <ChakraProvider>
        <BrowserRouter>
          <Header />

          <Routes>
            <Route path="/" element={<Landing />}></Route>
            <Route path="/automata" element={<ShowAutomata />}></Route>
            <Route path="/history" element={<History />}></Route>
          </Routes>
        </BrowserRouter>
      </ChakraProvider>
    </AutomataProvider>
  );
}

export default App;
