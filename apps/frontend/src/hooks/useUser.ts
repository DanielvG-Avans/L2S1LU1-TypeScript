import type { User } from "../types/User";
import { fetchBackend } from "../lib/fetch";
import { useEffect, useState } from "react";

export const useUser = (): User | null => {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const fetchUser = async () => {
      const response = await fetchBackend("/auth/me", {});
      if (response.ok) {
        const data = await response.json();
        setUser(data as User);
      }
    };
    fetchUser();
  }, []);

  return user;
};
