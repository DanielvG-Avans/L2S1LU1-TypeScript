import { createBrowserRouter, RouterProvider } from "react-router-dom";
import ProtectedRoute from "@/components/ProtectedRoute";
import { AuthLayout } from "@/layouts/AuthLayout";
import { createRoot } from "react-dom/client";
import { Layout } from "@/layouts/Layout";
import ProfilePage from "@/pages/Profile";
import ModulesPage from "./pages/Modules";
import NotFound from "@/pages/NotFound";
import LoginPage from "@/pages/Login";
import HomePage from "@/pages/Home";
import { StrictMode } from "react";
import "@/main.css";

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
      {
        path: "/modules",
        element: (
          <ProtectedRoute>
            <ModulesPage />
          </ProtectedRoute>
        ),
      },
      {
        path: "/modules/:moduleId",
        element: (
          <ProtectedRoute>
            <HomePage />
          </ProtectedRoute>
        ),
      },
      {
        path: "/profile",
        element: (
          <ProtectedRoute>
            <ProfilePage />
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
  { path: "*", element: <NotFound /> },
]);

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>,
);
