import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useParams, useLocation, useNavigate } from "react-router-dom";
import ProviderBadge from "@/components/elective/ProviderBadge";
import { RoleProtected } from "@/components/auth/RoleProtected";
import { useMemo, useCallback, useState } from "react";
import { useFavorites } from "@/hooks/useFavorites";
import { useElective } from "@/hooks/useElective";
import { Toaster } from "@/components/ui/sonner";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ElectiveEditDialog } from "@/components/elective/ElectiveFormDialog";

const ElectiveDetailPage = () => {
  const { electiveId } = useParams<{ electiveId: string }>();
  const navigate = useNavigate();
  const location = useLocation();

  // Use the new custom hook for fetching elective data
  const { elective, loading, error, isFavorited, setIsFavorited, refetch } =
    useElective(electiveId);
  const { toggleFavorite: toggleFavoriteApi, loading: favoriteLoading } = useFavorites();

  // Edit dialog state
  const [editDialogOpen, setEditDialogOpen] = useState(false);

  // Favorite toggle with optimistic UI
  const toggleFavorite = useCallback(async () => {
    if (!elective?.id || favoriteLoading) return;

    const prevFavorited = isFavorited;
    setIsFavorited(!prevFavorited);

    try {
      await toggleFavoriteApi(elective.id, prevFavorited);
    } catch (err) {
      // Rollback on error
      setIsFavorited(prevFavorited);
    }
  }, [elective?.id, isFavorited, favoriteLoading, toggleFavoriteApi, setIsFavorited]);

  // Meta info
  const meta = useMemo(() => {
    if (!elective) return [];
    return [
      { key: "period", label: elective.period },
      { key: "duration", label: elective.duration },
      { key: "credits", label: elective.credits != null ? `${elective.credits} EC` : undefined },
      { key: "level", label: elective.level },
      { key: "location", label: elective.location },
      { key: "language", label: elective.language },
    ].filter((m) => m.label) as { key: string; label: string }[];
  }, [elective]);

  if (loading)
    return (
      <div className="flex items-center justify-center min-h-[60vh] bg-background">
        <div className="flex flex-col items-center gap-4 p-8 bg-card border border-border rounded-lg">
          <div className="w-8 h-8 border-2 border-t-2 border-primary rounded-full animate-spin" />
          <p className="text-muted-foreground animate-pulse">Loading elective details...</p>
        </div>
      </div>
    );

  if (error || !elective)
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center p-6 bg-background">
        <div className="bg-card border border-border rounded-lg p-8 max-w-md">
          <p className="text-muted-foreground mb-4">{error ?? "Elective not found."}</p>
          <Button onClick={() => navigate(-1)} variant="outline">
            Go Back
          </Button>
        </div>
      </div>
    );

  return (
    <div className="max-w-6xl mx-auto px-4 py-10 space-y-8 bg-background min-h-screen">
      {/* Toast container */}
      <Toaster />

      {/* Hero Section */}
      <div className="relative rounded-3xl overflow-hidden shadow-lg group border border-border">
        <img
          src="/keuzemodule_fallback_16-9.webp"
          alt={`${elective.name} banner`}
          className="w-full h-64 sm:h-96 object-cover transform group-hover:scale-[1.02] transition-transform duration-500"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-background/95 via-background/60 to-transparent backdrop-blur-[2px]" />
        <div className="absolute bottom-8 left-8 sm:left-10 drop-shadow-lg space-y-1">
          <h1 className="text-3xl sm:text-4xl font-bold leading-tight text-foreground drop-shadow-md">
            {elective.name}
          </h1>
          <p className="text-sm sm:text-base text-foreground/90">
            {elective.code} • {elective.language}
          </p>
        </div>
      </div>

      {/* Provider + Meta */}
      <div className="flex flex-wrap items-center justify-between gap-4 px-2">
        <ProviderBadge provider={elective.provider} />
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
            About this Elective
          </CardTitle>
          <CardDescription className="text-sm text-muted-foreground">
            Offered by <span className="font-medium text-foreground">{elective.provider}</span>
          </CardDescription>
        </CardHeader>

        <CardContent>
          <p className="text-muted-foreground leading-relaxed whitespace-pre-line text-sm sm:text-base">
            {elective.description?.trim() || "No detailed description available for this elective."}
          </p>
        </CardContent>
      </Card>

      {/* Teachers Card */}
      {elective.teachers && elective.teachers.length > 0 && (
        <Card className="border border-border/40 bg-gradient-to-b from-background to-muted/10 rounded-3xl shadow-md hover:shadow-lg transition-shadow">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg sm:text-xl font-semibold tracking-tight text-foreground">
              👨‍🏫 Teaching Staff
            </CardTitle>
            <CardDescription className="text-sm text-muted-foreground">
              {elective.teachers.length === 1 ? "Teacher" : "Teachers"} for this elective
            </CardDescription>
          </CardHeader>

          <CardContent>
            <div className="flex flex-wrap gap-3">
              {elective.teachers.map((teacher, index) => (
                <div
                  key={teacher.id || index}
                  className="flex items-center gap-3 px-4 py-3 bg-muted/50 border border-border/30 rounded-xl hover:bg-muted/70 transition-all"
                >
                  <div className="flex items-center justify-center w-10 h-10 bg-primary/10 border border-primary/20 rounded-full text-primary font-semibold">
                    {teacher.firstName?.[0]}
                    {teacher.lastName?.[0]}
                  </div>
                  <div className="flex flex-col">
                    <span className="text-sm font-medium text-foreground">
                      {teacher.firstName} {teacher.lastName}
                    </span>
                    <span className="text-xs text-muted-foreground">{teacher.email}</span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Footer Actions */}
      <div className="flex justify-between pt-4 gap-2">
        <Button
          variant="outline"
          onClick={() => navigate(location.state?.from ?? "/electives")}
          className="rounded-xl border-border/50 hover:border-primary/50 transition-all"
        >
          ← Back to Electives
        </Button>

        <div className="flex gap-2">
          {/* Only admins can edit */}
          <RoleProtected allowedRoles="admin">
            <Button
              variant="default"
              onClick={() => setEditDialogOpen(true)}
              className="rounded-xl transition-all"
            >
              ✏️ Edit Elective
            </Button>
          </RoleProtected>

          {/* Only students can add to favorites */}
          <RoleProtected allowedRoles="student">
            <Button
              variant={isFavorited ? "destructive" : "outline"}
              onClick={toggleFavorite}
              disabled={favoriteLoading}
              className={`rounded-xl border-border/50 hover:border-primary/50 transition-all ${
                favoriteLoading ? "animate-pulse" : ""
              }`}
            >
              {isFavorited ? "★ Favorited" : "☆ Add to Favorites"}
            </Button>
          </RoleProtected>
        </div>
      </div>

      {/* Edit Dialog */}
      {elective && (
        <ElectiveEditDialog
          open={editDialogOpen}
          onOpenChange={setEditDialogOpen}
          elective={elective}
          onSuccess={() => {
            refetch();
          }}
        />
      )}
    </div>
  );
};

export default ElectiveDetailPage;
