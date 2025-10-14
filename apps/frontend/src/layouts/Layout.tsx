import React, { useEffect, useState } from "react";
import Header from "../components/Header";
import { Outlet } from "react-router-dom";
import type { User } from "../types/User";
import { useUser } from "../hooks/useUser";

export const Layout = (): React.ReactNode | null => {
  const [user, setUser] = useState<User | null>(null);
  const fetchedUser = useUser();

  useEffect(() => {
    setUser(fetchedUser);
  }, [fetchedUser]);

  return user ? (
    <>
      <Header user={user} />
      <main>
        <Outlet />
      </main>
    </>
  ) : null;
};
