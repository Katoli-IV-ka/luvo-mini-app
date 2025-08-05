import { App } from "./App";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

import "./index.css";
import "react-datepicker/dist/react-datepicker.css";

export const queryClient = new QueryClient();

const container = document.getElementById("root");
const root = createRoot(container);

root.render(
  <QueryClientProvider client={queryClient}>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </QueryClientProvider>
);
