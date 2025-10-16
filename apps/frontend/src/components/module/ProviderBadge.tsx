import { Badge } from "@/components/ui/badge";

const ProviderBadge = ({ provider }: { provider?: string }) => {
  const prov = provider ?? "Unknown";
  const match = prov.match(/^(.*?)(\s*\([^)]+\))\s*$/);
  const code = match ? match[2].trim() : "";

  return (
    <Badge
      variant={provider ? "secondary" : "outline"}
      className="flex items-center gap-2"
      title={prov}
    >
      {code ? (
        <span className="ml-2 flex-none text-xs opacity-90 whitespace-nowrap">{code}</span>
      ) : null}
    </Badge>
  );
};
export default ProviderBadge;
