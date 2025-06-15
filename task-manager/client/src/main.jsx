import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { Toaster } from "react-hot-toast";
import { AuthProvider } from "./context/AuthContext";
import App from "./App";
import "./index.css";

// Create a client
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
      staleTime: 5 * 60 * 1000, // 5 minutes
    },
  },
});

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <BrowserRouter>
      <QueryClientProvider client={queryClient}>
        <LocalizationProvider dateAdapter={AdapterDateFns}>
          <AuthProvider>
            <App />
            <Toaster position="top-right" />
          </AuthProvider>
        </LocalizationProvider>
      </QueryClientProvider>
    </BrowserRouter>
  </React.StrictMode>
);
