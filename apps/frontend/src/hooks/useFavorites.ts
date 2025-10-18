// Custom hook for managing favorites

import { toast } from "sonner";
import { fetchBackend } from "@/lib/fetch";

export function useFavorites() {
  const addFavorite = async (electiveId: string) => {
    try {
      const res = await fetchBackend("/api/electives/favorites", {
        method: "POST",
        body: JSON.stringify({ electiveId }),
      });
      if (!res.ok) throw new Error("Kon favoriet niet toevoegen");
      toast.success("Favoriet toegevoegd!", { style: { background: "#52c41a", color: "white" } });
    } catch (err: any) {
      console.error(err);
      toast.error(err?.message ?? "Kon favoriet niet toevoegen", {
        style: { background: "#ff4d4f", color: "white" },
      });
    }
  };

  return { addFavorite };
}
