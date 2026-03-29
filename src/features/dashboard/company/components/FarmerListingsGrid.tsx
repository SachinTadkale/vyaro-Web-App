import type { FarmerListing } from "@/hooks/useCompanyDashboard";
import Badge from "@/components/common/Badge";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCircleCheck, faMapMarkerAlt, faLeaf } from "@fortawesome/free-solid-svg-icons";

interface Props {
  listings: FarmerListing[];
}

const FarmerListingsGrid = ({ listings }: Props) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {listings.map((item) => (
        <div key={item.id} className="dashboard-card flex flex-col hover:border-primary/50 cursor-pointer">
          <div className="flex items-start justify-between mb-4">
            <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
              <FontAwesomeIcon icon={faLeaf} size="sm" />
            </div>
            {item.verified && (
              <Badge variant="success" className="gap-1 px-2">
                <FontAwesomeIcon icon={faCircleCheck} className="text-[9px]" />
                Verified
              </Badge>
            )}
          </div>
          
          <h4 className="text-sm font-black text-foreground mb-1">
            {item.produce}
          </h4>
          <div className="flex items-center gap-1.5 text-muted-foreground mb-4">
            <FontAwesomeIcon icon={faMapMarkerAlt} className="text-[10px]" />
            <span className="text-[11px] font-medium leading-none">
              {item.farmer} • {item.location}
            </span>
          </div>

          <div className="mt-auto pt-4 border-t border-border flex items-center justify-between">
            <div className="flex flex-col">
              <span className="text-[10px] text-muted-foreground font-bold uppercase tracking-wider">Quantity</span>
              <span className="text-xs font-bold text-foreground">{item.qty}</span>
            </div>
            <div className="flex flex-col items-end">
              <span className="text-[10px] text-muted-foreground font-bold uppercase tracking-wider">Price</span>
              <span className="text-sm font-black text-primary">{item.price}</span>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default FarmerListingsGrid;
