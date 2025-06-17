import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import { BrowserRouter } from "react-router-dom";
import Router from "./routes/Rourer.jsx";
import { AuthProvider } from "./context/AuthProvider.jsx";
import { Toaster } from "sonner";

// ✅ React Query setup
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { LandingPageProvider } from "./context/LandingPageContext.jsx";
const queryClient = new QueryClient();

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <LandingPageProvider>
        <BrowserRouter>
          <AuthProvider>
            <Router />
            <Toaster position="top-center" richColors />
          </AuthProvider>
        </BrowserRouter>
      </LandingPageProvider>
    </QueryClientProvider>
  </StrictMode>
);
