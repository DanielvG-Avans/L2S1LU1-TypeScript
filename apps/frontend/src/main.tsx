import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { createRoot } from "react-dom/client";
import { StrictMode } from "react";
import HomePage from "./pages/home";
import "./index.css";
import Layout from "./Layout";

const router = createBrowserRouter([{ path: "/", element: <HomePage /> }]);

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <Layout>
      <RouterProvider router={router} />
    </Layout>
  </StrictMode>
);
