import StatCard from "@/components/common/StatCard";

interface StatsGridProps {
  stats: any[];
}

const StatsGrid = ({ stats }: StatsGridProps) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
      {stats.map((stat, idx) => (
        <StatCard
          key={idx}
          label={stat.label}
          value={stat.value}
          color={stat.color as any}
          trend={stat.trend}
          icon={undefined} // Icons can be added later if needed for Admin KPIs
        />
      ))}
    </div>
  );
};

export default StatsGrid;
