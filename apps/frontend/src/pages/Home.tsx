import ErrorState from "@/components/ErrorState";
import { fetchBackend } from "@/lib/fetch";
import type { Module } from "@/types/Module";
import React, { useEffect, useState } from "react";

export default function ModulePage(): React.ReactNode {
  // UI state
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [modulesData, setModulesData] = useState<Module[]>([]);

  // Fetched data
  useEffect(() => {
    const fetchModules = async () => {
      try {
        const response = await fetchBackend("/api/modules");
        if (response.ok) {
          const data = (await response.json()) as Module[];
          if (Array.isArray(data)) {
            setModulesData(data);
          } else {
            setError("Ongeldige data ontvangen van de server.");
          }
        }
      } catch (err) {
        setError((err as Error).message);
      } finally {
        setLoading(false);
      }
    };
    fetchModules();
  }, []);

  if (loading) {
    return <ErrorState loading={true} />;
  }

  if (error) {
    return <ErrorState error={error} />;
  }

  if (modulesData.length === 0) {
    return <ErrorState itemsCount={0} />;
  }

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Beschikbare Modules</h1>
    </div>
  );
}
