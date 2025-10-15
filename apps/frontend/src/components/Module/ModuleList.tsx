import { fetchBackend } from "@/lib/fetch";
import { useEffect, useState } from "react";
import type { Module } from "@/types/Module";
import ModuleCard from "@/components/Module/ModuleCard";

export const ModuleList = () => {
  const [modules, setModules] = useState<Module[] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    // Fetch modules from the backend API
    const fetchModules = async () => {
      try {
        setLoading(true);
        setError(null);

        const response = await fetchBackend("/api/modules");
        if (!response.ok) {
          setError("Failed to fetch modules.");
          return;
        }

        const data = (await response.json()) as Module[];
        if (!data || data.length === 0) {
          setError("No modules found.");
          return;
        }

        setModules(data);
      } catch (error) {
        setError("Failed to fetch modules.");
      } finally {
        setLoading(false);
      }
    };

    fetchModules();
  }, [setModules]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="relative">
          <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-blue-500 border-solid"></div>
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-blue-500 font-bold text-lg">Loading...</span>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="text-red-500 text-6xl mb-4">⚠️</div>
          <p className="text-xl font-semibold text-red-500">Oops! Something went wrong.</p>
          <p className="text-gray-600">{error}</p>
        </div>
      </div>
    );
  }

  if (!modules || modules.length === 0) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="text-gray-500 text-6xl mb-4">📭</div>
          <p className="text-xl font-semibold text-gray-700">No Modules Found</p>
          <p className="text-gray-500">Check back later for updates!</p>
        </div>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-6">
      {modules.map((module) => (
        <ModuleCard key={module.code} module={module} compact={false} />
      ))}
    </div>
  );
};
