import { useNavigate } from "react-router-dom";

type Stat = {
  label: string;
  value: number;
  color: string;
  route?: string;
};

type Props = {
  stats: Stat[];
};

const StatsGrid = ({ stats }: Props) => {
  const navigate = useNavigate();

  return (
    <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
      {stats.map((s) => (
        <div
          key={s.label}
          onClick={() => s.route && navigate(s.route)}
          className="cursor-pointer rounded-2xl border border-white/10 bg-white/[0.04] backdrop-blur-sm p-5 hover:bg-white/10 transition-all"
        >
          {/* Top Dot */}
          <div className={`w-3 h-3 rounded-full mb-3 ${s.color}`} />

          {/* Label */}
          <p className="text-xs text-white/40 font-bold">{s.label}</p>

          {/* Value */}
          <p className="text-2xl font-black text-white">{s.value}</p>

          {/* Action hint */}
          {s.route && (
            <p className="text-[10px] text-green-400 mt-1">View details →</p>
          )}
        </div>
      ))}
    </div>
  );
};

export default StatsGrid;
