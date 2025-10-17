import React, { useEffect, useState } from "react";
import Header from "../components/Header";
import { Outlet } from "react-router-dom";
import type { User } from "../types/User";
import { fetchBackend } from "../lib/fetch";
import { Toaster } from "@/components/ui/sonner";

export const Layout = (): React.ReactNode | null => {
  const [user, setUser] = useState<User | undefined>(undefined);

  useEffect(() => {
    const fetchUser = async () => {
      const response = await fetchBackend("/api/users/me", {});
      if (response.ok) {
        const data = await response.json();
        setUser(data as User);
      }
    };
    fetchUser();
  }, []);

  const onLogout = () => {
    setUser(undefined);
    cookieStore.delete("ACCESSTOKEN");
    window.location.replace("/auth/login");
  };

  return (
    <>
      <Header user={user} onLogout={onLogout} />
      <main className="min-h-screen bg-background">
        <Outlet context={{ user }} />
      </main>
      <Toaster richColors closeButton position="top-right" />
    </>
  );
};
