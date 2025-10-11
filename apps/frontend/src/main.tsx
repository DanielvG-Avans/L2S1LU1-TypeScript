import ProtectedRoute from "./components/ProtectedRoute";
import { AuthLayout } from "./pages/Layouts/AuthLayout";
import { Layout } from "./pages/Layouts/Layout";
import { createRoot } from "react-dom/client";
import LoginPage from "./pages/Login";
import HomePage from "./pages/Home";
import { StrictMode } from "react";
import "./index.css";
import {
  createBrowserRouter,
  RouterProvider,
  Navigate,
} from "react-router-dom";

const router = createBrowserRouter([
  {
    // Main app layout (protected)
    element: <Layout />,
    children: [
      {
        path: "/",
        element: (
          <ProtectedRoute>
            <HomePage />
          </ProtectedRoute>
        ),
      },
    ],
  },
  {
    // Auth layout (login/register pages)
    element: <AuthLayout />,
    children: [{ path: "/auth/login", element: <LoginPage /> }],
  },
  // fallback for unknown routes
  { path: "*", element: <Navigate to="/" /> },
]);

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>
);
