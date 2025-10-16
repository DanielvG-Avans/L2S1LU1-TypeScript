import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useParams, useLocation, useNavigate } from "react-router-dom";
import ProviderBadge from "@/components/elective/ProviderBadge";
import { useEffect, useState, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import type { Module } from "@/types/Elective";
import { fetchBackend } from "@/lib/fetch";

const ModuleDetailPage = () => {
  const { moduleId } = useParams<{ moduleId: string }>();
  const navigate = useNavigate();
  const location = useLocation();

  const [module, setModule] = useState<Module | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadModule = async () => {
      try {
        setLoading(true);

        if (!moduleId) {
          setError("No module ID provided");
          setLoading(false);
          return;
        }

        const response = await fetchBackend(`/api/modules/${moduleId}`);
        if (!response.ok) {
          setError(`Error fetching module: ${response.statusText}`);
        }

        const data = (await response.json()) as Module;
        if (!data) {
          setError("Module not found");
        }

        setModule(data);
      } catch (err: any) {
        setError("Failed to load module details. Please try again later.");
      } finally {
        setLoading(false);
      }
    };
    loadModule();
  }, [moduleId]);

  const meta = useMemo(() => {
    if (!module) return [];
    return [
      { key: "period", label: module.period },
      { key: "duration", label: module.duration },
      { key: "credits", label: module.credits != null ? `${module.credits} EC` : undefined },
      { key: "level", label: module.level },
      { key: "location", label: module.location },
      { key: "language", label: module.language },
    ].filter((m) => m.label) as { key: string; label: string }[];
  }, [module]);

  if (loading)
    return (
      <div className="flex items-center justify-center min-h-[60vh] text-muted-foreground animate-pulse">
        Loading module details...
      </div>
    );

  if (error || !module)
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center p-6">
        <p className="text-muted-foreground mb-4">{error ?? "Module not found."}</p>
        <Button onClick={() => navigate(-1)}>Go Back</Button>
      </div>
    );

  return (
    <div className="max-w-6xl mx-auto px-4 py-10 space-y-8">
      {/* Hero Section */}
      <div className="relative rounded-3xl overflow-hidden shadow-lg group">
        <img
          src="/keuzemodule_fallback_16-9.webp"
          alt={`${module.name} banner`}
          className="w-full h-64 sm:h-96 object-cover transform group-hover:scale-[1.02] transition-transform duration-500"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-background/95 via-background/60 to-transparent backdrop-blur-[2px]" />

        <div className="absolute bottom-8 left-8 sm:left-10 text-white drop-shadow-lg space-y-1">
          <h1 className="text-3xl sm:text-4xl font-bold leading-tight">{module.name}</h1>
          <p className="text-sm sm:text-base opacity-90">
            {module.code} • {module.language}
          </p>
        </div>
      </div>

      {/* Provider + Meta */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <ProviderBadge provider={module.provider} />
        <div className="flex flex-wrap gap-2">
          {meta.map((m) => (
            <Badge
              key={m.key}
              variant="secondary"
              className="text-xs sm:text-sm font-medium bg-muted/70 border border-border/40 hover:bg-muted transition-all"
            >
              {m.label}
            </Badge>
          ))}
        </div>
      </div>

      {/* Description Card */}
      <Card className="border border-border/40 bg-gradient-to-b from-background to-muted/10 rounded-3xl shadow-md hover:shadow-lg transition-shadow">
        <CardHeader className="pb-2">
          <CardTitle className="text-lg sm:text-xl font-semibold tracking-tight text-foreground">
            About this Module
          </CardTitle>
          <CardDescription className="text-sm text-muted-foreground">
            Offered by <span className="font-medium text-foreground">{module.provider}</span>
          </CardDescription>
        </CardHeader>

        <CardContent>
          <p className="text-muted-foreground leading-relaxed whitespace-pre-line text-sm sm:text-base">
            {module.description?.trim() || "No detailed description available for this module."}
          </p>
        </CardContent>
      </Card>

      {/* Footer Actions */}
      <div className="flex justify-end pt-4">
        <Button
          variant="outline"
          onClick={() => navigate(location.state?.from ?? "/modules")}
          className="rounded-xl border-border/50 hover:border-primary/50 transition-all"
        >
          ← Back to Modules
        </Button>
      </div>
    </div>
  );
};

export default ModuleDetailPage;
