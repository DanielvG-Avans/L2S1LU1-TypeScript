import { Suspense, useEffect, useState } from "react";
import { fetchBackend } from "../lib/fetch";
import type { Module } from "../types/Module";
import ModuleCard from "../components/ModuleCard";

const HomePage = () => {
  return (
    <div className="p-6 mx-auto container">
      <h1 className="text-2xl font-semibold mb-6">Available Modules</h1>
      <Suspense fallback={<div>Loading modules...</div>}>
        <ModuleList />
      </Suspense>
    </div>
  );
};

const ModuleList = () => {
  const [modules, setModules] = useState<Module[] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    // Fetch modules from the backend API
    const fetchModules = async () => {
      try {
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
    return <div>Loading modules...</div>;
  }

  if (error) {
    return <div className="text-red-500">Error: {error}</div>;
  }

  if (!modules || modules.length === 0) {
    return <div>No modules available.</div>;
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {modules.map((module) => (
        <ModuleCard key={module.code} module={module} compact={false} />
      ))}
    </div>
  );
};

export default HomePage;
