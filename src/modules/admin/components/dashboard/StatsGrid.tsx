type Props = {
  total: number;
};

const StatsGrid = ({ total }: Props) => {
  return (
    <div className="grid grid-cols-2 gap-4">
      <div className="bg-white/5 p-4 rounded-xl">
        <p className="text-white/40 text-xs">Total Users</p>
        <p className="text-white text-xl font-bold">{total}</p>
      </div>
    </div>
  );
};

export default StatsGrid;