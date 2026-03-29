import { motion } from "framer-motion";
import { cn } from "@/utils/utils";

type Props = {
  activeTab: "farmers" | "companies";
  onTabChange: (tab: "farmers" | "companies") => void;
  counts: { farmers: number; companies: number };
};

const KycTabs = ({ activeTab, onTabChange, counts }: Props) => {
  const tabs = [
    { id: "farmers", label: "Farmers", count: counts.farmers },
    { id: "companies", label: "Companies", count: counts.companies },
  ] as const;

  return (
    <div className="flex bg-muted/20 p-1 rounded-xl border border-border/40 backdrop-blur-sm self-start">
      {tabs.map((tab) => {
        const isActive = activeTab === tab.id;
        return (
          <button
            key={tab.id}
            onClick={() => onTabChange(tab.id)}
            className={cn(
              "relative px-4 py-1.5 rounded-lg text-xs font-medium transition-all duration-200 flex items-center gap-2 outline-none",
              isActive 
                ? "text-primary-foreground shadow-sm" 
                : "text-muted-foreground hover:text-foreground hover:bg-white/5"
            )}
          >
            {isActive && (
              <motion.div
                layoutId="kyc-active-tab"
                className="absolute inset-0 bg-primary rounded-lg"
                initial={false}
                transition={{ type: "spring", stiffness: 500, damping: 30 }}
              />
            )}
            <span className="relative z-10">{tab.label}</span>
            <span className={cn(
              "relative z-10 px-1.5 py-0.5 rounded-md text-[10px] font-bold",
              isActive ? "bg-white/20 text-white" : "bg-muted/30 text-muted-foreground"
            )}>
              {tab.count}
            </span>
          </button>
        );
      })}
    </div>
  );
};

export default KycTabs;
