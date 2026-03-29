import StatCard from "@/components/common/StatCard";
import { useAdminDashboard } from "@/hooks/useAdminDashboard";

const AdminStatsCards = () => {
  const { stats } = useAdminDashboard();

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
      {stats.map((stat, i) => (
        <StatCard
          key={stat.label}
          label={stat.label}
          value={stat.value}
          icon={stat.icon}
          color={stat.color}
          trend={stat.trend}
          className="fade-in"
          style={{ animationDelay: `${i * 40}ms` }}
        />
      ))}
    </div>
  );
};

export default AdminStatsCards;
