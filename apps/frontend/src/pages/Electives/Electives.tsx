import ElectiveFilter from "@/components/elective/ElectiveFilter";
import ElectiveCard from "@/components/elective/ElectiveCard";
import { Search, ArrowUpDown } from "lucide-react";
import React, { useEffect, useState } from "react";
import ErrorState from "@/components/ErrorState";
import { Input } from "@/components/ui/input";
import type { Elective } from "@/types/Elective";
import { fetchBackend } from "@/lib/fetch";
import {
  SelectTrigger,
  SelectContent,
  SelectValue,
  SelectItem,
  Select,
} from "@/components/ui/select";

export default function ElectivePage(): React.ReactNode {
  // UI state
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [electives, setElectives] = useState<Elective[]>([]);
  const [filtered, setFiltered] = useState<Elective[]>([]);
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

  // Fetch electives
  useEffect(() => {
    const fetchElectives = async () => {
      try {
        const response = await fetchBackend("/api/electives");
        if (response.ok) {
          const data = (await response.json()) as Elective[];
          if (Array.isArray(data)) setElectives(data);
          else setError("Ongeldige data ontvangen van de server.");
        } else {
          // Read any body text for more context, include status

          setError(`Server error: ${response.status} ${response.statusText}`);
          return;
        }
      } catch (err) {
        setError((err as Error).message);
      } finally {
        setLoading(false);
      }
    };
    fetchElectives();
  }, []);

  // Filtering & sorting logic
  useEffect(() => {
    let result = [...electives];

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
        const electiveKey = key as keyof Elective;
        result = result.filter((m) => {
          const prop = m[electiveKey];
          if (prop === undefined || prop === null) return false;
          if (Array.isArray(prop)) {
            // If the elective property is an array, check if any element matches the filter value
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
  }, [electives, query, sortBy, filters]);

  if (loading) return <ErrorState loading={true} />;
  if (error) return <ErrorState error={error} />;
  if (electives.length === 0) return <ErrorState itemsCount={0} />;

  // Helper for unique dropdown values
  const uniqueValues = (key: keyof Elective): { value: string; label: React.ReactNode }[] => {
    const values = electives
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
    <div className="flex flex-col md:flex-row max-w-7xl mx-auto p-6 gap-6 bg-background min-h-screen">
      {/* --- FILTER SIDEBAR --- */}
      <aside className="md:w-64 w-full md:sticky md:top-4 self-start md:h-[calc(100vh-2rem)] overflow-y-auto bg-card border border-border rounded-xl shadow-sm p-4">
        <h2 className="text-lg font-semibold mb-4 text-card-foreground">Filters</h2>
        <div className="flex flex-col gap-4">
          <ElectiveFilter
            options={uniqueValues("language")}
            onChange={(value) => setFilters((prev) => ({ ...prev, language: value }))}
            defaultValue={filters.language}
            placeholder="Language"
          />

          <ElectiveFilter
            options={uniqueValues("provider")}
            onChange={(value) => setFilters((prev) => ({ ...prev, provider: value }))}
            defaultValue={filters.provider}
            placeholder="Provider"
          />

          <ElectiveFilter
            options={uniqueValues("level")}
            onChange={(value) => setFilters((prev) => ({ ...prev, level: value }))}
            defaultValue={filters.level}
            placeholder="Level"
          />

          <ElectiveFilter
            options={uniqueValues("location")}
            onChange={(value) => setFilters((prev) => ({ ...prev, location: value }))}
            defaultValue={filters.location}
            placeholder="Location"
          />

          <ElectiveFilter
            options={uniqueValues("credits")}
            onChange={(value) => setFilters((prev) => ({ ...prev, credits: value }))}
            defaultValue={filters.credits}
            placeholder="Credits"
          />

          <ElectiveFilter
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
              placeholder="Search electives..."
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
        <div className="grid grid-cols-1 gap-6">
          {filtered.map((m) => (
            <ElectiveCard key={m.id} elective={m} />
          ))}
        </div>

        {filtered.length === 0 && (
          <div className="text-center text-muted-foreground mt-20 p-8 bg-card border border-border rounded-lg">
            <p className="text-lg font-medium text-card-foreground">No electives found</p>
            <p className="text-sm mt-2">Try adjusting your filters or search query.</p>
          </div>
        )}
      </main>
    </div>
  );
}
