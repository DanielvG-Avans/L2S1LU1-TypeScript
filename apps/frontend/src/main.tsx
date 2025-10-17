import { createBrowserRouter, RouterProvider } from "react-router-dom";
import ProtectedRoute from "@/components/ProtectedRoute";
import ElectiveDetailPage from "./pages/ElectiveDetails";
import { ThemeProvider } from "@/components/ThemeProvider";
import { AuthLayout } from "@/layouts/AuthLayout";
import { createRoot } from "react-dom/client";
import ElectivesPage from "./pages/Electives";
import { Layout } from "@/layouts/Layout";
import ProfilePage from "@/pages/Profile";
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
        path: "/electives",
        element: (
          <ProtectedRoute>
            <ElectivesPage />
          </ProtectedRoute>
        ),
      },
      {
        path: "/electives/:electiveId",
        element: (
          <ProtectedRoute>
            <ElectiveDetailPage />
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
    <ThemeProvider
      defaultTheme="system"
      storageKey="theme"
      enableSystem
      disableTransitionOnChange={false}
    >
      <RouterProvider router={router} />
    </ThemeProvider>
  </StrictMode>,
);
