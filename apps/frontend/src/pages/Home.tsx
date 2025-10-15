import { Suspense, useEffect, useState } from "react";
import { fetchBackend } from "../lib/fetch";
import type { Module } from "../types/Module";
import ModuleCard from "../components/ModuleCard";

const HomePage = () => {
  const [modules, setModules] = useState<Module[]>([]);

  useEffect(() => {
    // Fetch modules from the backend API
    const fetchModules = async () => {
      try {
        const response = await fetchBackend("/api/modules");
        if (!response.ok) {
          return;
        }

        const data = (await response.json()) as Module[];
        if (!data || data.length === 0) {
          return;
        }

        setModules(data);
      } catch (error) {
        console.error("Error fetching modules:", error);
      }
    };

    fetchModules();
  }, [setModules]);

  return (
    <div className="p-6 mx-auto container">
      <h1 className="text-3xl font-bold underline mb-6">Modules Grid</h1>
      <p className="mb-6 text-zinc-400">
        Below is a grid of module cards fetched from the backend API.
      </p>
      <Suspense fallback={<div>Loading modules...</div>}>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {modules.map((module) => (
            <ModuleCard key={module.code} module={module} compact={false} />
          ))}
        </div>
      </Suspense>
    </div>
  );
};

export default HomePage;
