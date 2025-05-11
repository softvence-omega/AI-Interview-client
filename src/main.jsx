import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import { BrowserRouter } from "react-router-dom"; // ✅ import this
import { AuthProvider } from "./context/AuthProvider.jsx";
import Container from "./container/container.jsx";
import Router from "./routes/Rourer.jsx";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <BrowserRouter>
      <Container>
        <AuthProvider>
          <Router/>
        </AuthProvider>
      </Container>
    </BrowserRouter>
  </StrictMode>
);
