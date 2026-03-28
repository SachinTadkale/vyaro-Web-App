type Activity = {
  id: string;
  type: "USER" | "LEAD" | "COMPANY" | "KYC";
  message: string;
  time: string;
};

type Props = {
  activities: Activity[];
};

const ActivityFeed = ({ activities }: Props) => {
  const getColor = (type: Activity["type"]) => {
    switch (type) {
      case "USER":
        return "bg-blue-500/20 text-blue-400";
      case "LEAD":
        return "bg-green-500/20 text-green-400";
      case "COMPANY":
        return "bg-purple-500/20 text-purple-400";
      case "KYC":
        return "bg-yellow-500/20 text-yellow-400";
      default:
        return "bg-white/10 text-white";
    }
  };

  return (
    <div className="rounded-2xl border border-white/10 bg-white/[0.04] backdrop-blur-sm p-5">
      {/* Header */}
      <div className="flex justify-between items-center mb-4">
        <p className="text-sm font-semibold text-white">Recent Activity</p>
      </div>

      {/* Empty */}
      {activities.length === 0 && (
        <div className="text-center text-white/30 py-6 text-sm">
          No activity yet
        </div>
      )}

      {/* Timeline */}
      <div className="space-y-4 max-h-64 overflow-y-auto pr-1">
        {activities.map((a) => (
          <div key={a.id} className="flex items-start gap-3">
            {/* Dot */}
            <div
              className={`w-2.5 h-2.5 mt-1 rounded-full ${getColor(a.type)}`}
            />

            {/* Content */}
            <div>
              <p className="text-xs text-white">{a.message}</p>
              <p className="text-[10px] text-white/40">{a.time}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ActivityFeed;
