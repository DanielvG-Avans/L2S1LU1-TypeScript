import { cn } from "@/lib/utils";
import { MapPin, Info } from "lucide-react";
import type { Module } from "@/types/Module";
import { Button } from "@/components/ui/button";

interface ModuleCardProps {
  module: Module;
  compact?: boolean; // halves the size
  onInfoClick?: () => void;
  onRegisterClick?: () => void;
}

export default function ModuleCard({
  module,
  compact = false,
  onInfoClick,
  onRegisterClick,
}: ModuleCardProps) {
  return (
    <div
      className={cn(
        "relative bg-zinc-900 text-white rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300",
        compact ? "w-[350px]" : "w-[700px]",
      )}
    >
      {/* Image */}
      <div className={cn("relative", compact ? "h-40" : "h-60")}>
        <img
          src="/keuzemodule_fallback_16-9.webp"
          alt={module.name}
          className="object-cover w-full h-full"
        />
        <div className="absolute top-3 left-3 flex flex-wrap gap-2">
          <span className="bg-purple-600 text-xs px-3 py-1 rounded-full">{module.period}</span>
          <span className="bg-purple-600 text-xs px-3 py-1 rounded-full">
            {module.credits} ECTS
          </span>
          <span className="bg-purple-600 text-xs px-3 py-1 rounded-full">NL</span>
        </div>
      </div>

      {/* Content */}
      <div className="p-5">
        <p className="text-sm text-zinc-400 mb-1">{module.code}</p>
        <h3 className={cn("font-bold leading-tight", compact ? "text-lg" : "text-2xl")}>
          {module.name}
        </h3>
        <p className={cn("text-zinc-300 mt-2", compact ? "line-clamp-2 text-sm" : "line-clamp-3")}>
          {module.description}
        </p>

        {/* Location */}
        {module.location && (
          <div className="flex items-center gap-2 mt-3 text-zinc-400 text-sm">
            <MapPin size={16} /> {module.location}
          </div>
        )}

        {/* Actions */}
        <div className="flex justify-between items-center mt-5">
          <Button variant="secondary" size="sm" onClick={onInfoClick}>
            <Info size={16} className="mr-2" /> Meer info
          </Button>
          <Button variant="default" size="sm" onClick={onRegisterClick}>
            Aanmelden via Osiris
          </Button>
        </div>
      </div>
    </div>
  );
}
