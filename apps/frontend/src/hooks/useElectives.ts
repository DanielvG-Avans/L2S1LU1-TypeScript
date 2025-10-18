// Custom hook for loading electives

import { useEffect, useState } from "react";
import { toast } from "sonner";
import { fetchBackend } from "@/lib/fetch";
import type { Elective } from "@/types/Elective";

export function useElectives() {
  const [electives, setElectives] = useState<Elective[] | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    const load = async () => {
      try {
        setLoading(true);
        const res = await fetchBackend("/api/electives");
        if (!res.ok) throw new Error("Kon modules niet laden");
        const data = (await res.json()) as Elective[];
        if (!cancelled) setElectives(data);
      } catch (err: any) {
        console.error(err);
        if (!cancelled) {
          setError(err?.message ?? "Fout bij laden");
          toast.error(err?.message ?? "Fout bij laden", {
            style: { background: "#ff4d4f", color: "white" },
          });
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    load();

    return () => {
      cancelled = true;
    };
  }, []);

  return { electives, loading, error };
}
