"use client";

import ModuleFilter from "@/components/module/ModuleFilter";
import { Search, ArrowUpDown } from "lucide-react";
import React, { useEffect, useState } from "react";
import ModuleCard from "@/components/module/ModuleCard";
import ErrorState from "@/components/ErrorState";
import { Input } from "@/components/ui/input";
import type { Module } from "@/types/Module";
import { fetchBackend } from "@/lib/fetch";
import {
  SelectTrigger,
  SelectContent,
  SelectValue,
  SelectItem,
  Select,
} from "@/components/ui/select";

export default function ModulePage(): React.ReactNode {
  // UI state
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [modules, setModules] = useState<Module[]>([]);
  const [filtered, setFiltered] = useState<Module[]>([]);
  const [query, setQuery] = useState("");
  const [sortBy, setSortBy] = useState("name");

  // Filter states
  const [filters, setFilters] = useState({
    language: "all",
    provider: "all",
    level: "all",
    location: "all",
    credits: "all",
    period: "all",
  });

  // Fetch modules
  useEffect(() => {
    const fetchModules = async () => {
      try {
        const response = await fetchBackend("/api/modules");
        if (response.ok) {
          const data = (await response.json()) as Module[];
          if (Array.isArray(data)) setModules(data);
          else setError("Ongeldige data ontvangen van de server.");
        }
      } catch (err) {
        setError((err as Error).message);
      } finally {
        setLoading(false);
      }
    };
    fetchModules();
  }, []);

  // Filtering & sorting logic
  useEffect(() => {
    let result = [...modules];

    // 🔍 Search
    if (query) {
      result = result.filter((m) =>
        [m.name, m.description, m.provider, m.code].some((f) =>
          f.toLowerCase().includes(query.toLowerCase()),
        ),
      );
    }

    // 🎯 Filters
    (Object.entries(filters) as [keyof typeof filters, string][]).forEach(([key, value]) => {
      if (value !== "all") {
        const moduleKey = key as keyof Module;
        result = result.filter((m) => {
          const prop = m[moduleKey];
          if (prop === undefined || prop === null) return false;
          if (Array.isArray(prop)) {
            // If the module property is an array, check if any element matches the filter value
            return prop.some((p) => String(p).toLowerCase() === value.toLowerCase());
          }
          return String(prop).toLowerCase() === value.toLowerCase();
        });
      }
    });

    // 🔢 Sort
    result.sort((a, b) => {
      if (sortBy === "name") return a.name.localeCompare(b.name);
      if (sortBy === "credits") return b.credits - a.credits;
      return 0;
    });

    setFiltered(result);
  }, [modules, query, sortBy, filters]);

  if (loading) return <ErrorState loading={true} />;
  if (error) return <ErrorState error={error} />;
  if (modules.length === 0) return <ErrorState itemsCount={0} />;

  // Helper for unique dropdown values
  const uniqueValues = (key: keyof Module): { value: string; label: React.ReactNode }[] => {
    const values = modules
      .map((m) => {
        const value = m[key];
        if (Array.isArray(value)) return undefined; // ignore arrays like tags
        if (value === undefined || value === null) return undefined;
        return String(value);
      })
      .filter((v): v is string => !!v);

    const unique = Array.from(new Set(values));

    return [
      { value: "all", label: "All" },
      ...unique.map((v) => ({
        value: v,
        label: v,
      })),
    ];
  };

  return (
    <div className="flex flex-col md:flex-row max-w-7xl mx-auto p-6 gap-6">
      {/* --- FILTER SIDEBAR --- */}
      <aside className="md:w-64 w-full md:sticky md:top-4 self-start md:h-[calc(100vh-2rem)] overflow-y-auto bg-card rounded-xl shadow-sm p-4">
        <h2 className="text-lg font-semibold mb-4">Filters</h2>
        <div className="flex flex-col gap-4">
          <ModuleFilter
            options={uniqueValues("language")}
            onChange={(value) => setFilters((prev) => ({ ...prev, language: value }))}
            defaultValue={filters.language}
            placeholder="Language"
          />

          <ModuleFilter
            options={uniqueValues("provider")}
            onChange={(value) => setFilters((prev) => ({ ...prev, provider: value }))}
            defaultValue={filters.provider}
            placeholder="Provider"
          />

          <ModuleFilter
            options={uniqueValues("level")}
            onChange={(value) => setFilters((prev) => ({ ...prev, level: value }))}
            defaultValue={filters.level}
            placeholder="Level"
          />

          <ModuleFilter
            options={uniqueValues("location")}
            onChange={(value) => setFilters((prev) => ({ ...prev, location: value }))}
            defaultValue={filters.location}
            placeholder="Location"
          />

          <ModuleFilter
            options={uniqueValues("credits")}
            onChange={(value) => setFilters((prev) => ({ ...prev, credits: value }))}
            defaultValue={filters.credits}
            placeholder="Credits"
          />

          <ModuleFilter
            options={uniqueValues("period")}
            onChange={(value) => setFilters((prev) => ({ ...prev, period: value }))}
            defaultValue={filters.period}
            placeholder="Period"
          />
        </div>
      </aside>

      {/* --- MAIN CONTENT --- */}
      <main className="flex-1 flex flex-col gap-6">
        {/* Search + Sort */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search modules..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="pl-9"
            />
          </div>

          <Select onValueChange={setSortBy} defaultValue="name">
            <SelectTrigger className="w-[140px]">
              <ArrowUpDown className="mr-2 h-4 w-4" />
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="name">Name (A–Z)</SelectItem>
              <SelectItem value="credits">Credits (High–Low)</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Results Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filtered.map((m) => (
            <ModuleCard key={m.id} module={m} />
          ))}
        </div>

        {filtered.length === 0 && (
          <div className="text-center text-muted-foreground mt-20">
            No modules found matching your search.
          </div>
        )}
      </main>
    </div>
  );
}
