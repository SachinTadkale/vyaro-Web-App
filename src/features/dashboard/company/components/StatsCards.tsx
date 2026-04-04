import StatCard from "@/components/common/StatCard";

const stats = [
  { label: "Views", value: 1240, subValue: "Today", icon: "👀", color: "primary" },
  { label: "Orders", value: 78, subValue: "This week", icon: "📦", color: "secondary" },
  { label: "Revenue", value: "₹12k", subValue: "Monthly", icon: "💰", color: "green" },
  { label: "Reviews", value: 19, subValue: "New", icon: "⭐", color: "yellow" },
];

const StatsCards = () => {
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
