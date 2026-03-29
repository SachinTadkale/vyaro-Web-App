import StatCard from "@/components/common/StatCard";
import { useCompanyDashboard } from "@/hooks/useCompanyDashboard";

const StatsCards = () => {
  const { stats } = useCompanyDashboard();

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {stats.map((stat, i) => (
        <StatCard
          key={stat.label}
          label={stat.label}
          value={stat.value}
          subValue={stat.subValue}
          icon={stat.icon}
          color={stat.color}
          className="fade-in"
          style={{ animationDelay: `${i * 50}ms` }}
        />
      ))}
    </div>
  );
};

export default StatsCards;
