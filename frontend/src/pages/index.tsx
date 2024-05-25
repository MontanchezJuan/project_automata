interface Pages {
  [key: string]: Page;
}

export interface Page {
  path: string;
  name: string;
}

export const PAGES: Pages = {
  Landing: { path: "/", name: "Inicio" },
  ShowAutomata: { path: "/automata", name: "Visualización automata" },
  History: { path: "/history", name: "Historial" },
  Operations: { path: "/operations", name: "Operaciones" },
  ShowOperations: {
    path: "/show-operations",
    name: "Visualizador de operaciones",
  },
};
