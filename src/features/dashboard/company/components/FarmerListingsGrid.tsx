import type { FarmerListing } from "@/hooks/useCompanyDashboard";
import Badge from "@/components/common/Badge";

interface Props {
  listings: FarmerListing[];
}

const FarmerListingsGrid = ({ listings }: Props) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {listings.map((item) => (
        <div key={item.id} className="dashboard-card flex flex-col hover:border-primary/50 cursor-pointer">
          <div className="flex items-start justify-between mb-4">
            <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center text-primary text-lg">
              🌿
            </div>
            {item.verified && (
              <Badge variant="success" className="gap-1 px-2">
                ✔ Verified
              </Badge>
            )}
          </div>
          
          <h4 className="text-sm font-black text-foreground mb-1">
            {item.produce}
          </h4>
          <div className="flex items-center gap-1.5 text-muted-foreground mb-4">
            <span className="text-[10px]">📍</span>
            <span className="text-[11px] font-medium leading-none">
              {item.location}
            </span>
          </div>

          <div className="mt-auto pt-4 border-t border-border">
            <p className="text-xs text-muted-foreground">{item.details || "Details not available"}</p>
          </div>
        </div>
      ))}
    </div>
  );
};

export default FarmerListingsGrid;
