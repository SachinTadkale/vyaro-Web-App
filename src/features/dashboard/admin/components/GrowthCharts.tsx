import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  Legend,
} from "recharts";

const growthData = [
  { name: "Mon", users: 400, orders: 240 },
  { name: "Tue", users: 520, orders: 198 },
  { name: "Wed", users: 600, orders: 310 },
  { name: "Thu", users: 580, orders: 280 },
  { name: "Fri", users: 750, orders: 390 },
  { name: "Sat", users: 900, orders: 450 },
  { name: "Sun", users: 1120, orders: 520 },
];

const GrowthCharts = () => {
  return (
    <div className="grid md:grid-cols-2 gap-5">
      <div className="dashboard-card p-5">
        <h3 className="text-sm font-black text-muted-foreground uppercase tracking-widest mb-6">User Growth Trends</h3>
        <div className="h-[250px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={growthData}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--border))" />
              <XAxis 
                dataKey="name" 
                axisLine={false} 
                tickLine={false} 
                tick={{ fontSize: 10, fill: "hsl(var(--muted-foreground))" }} 
              />
              <YAxis 
                axisLine={false} 
                tickLine={false} 
                tick={{ fontSize: 10, fill: "hsl(var(--muted-foreground))" }} 
              />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: "hsl(var(--card))", 
                  borderColor: "hsl(var(--border))",
                  fontSize: "12px",
                  borderRadius: "8px"
                }} 
              />
              <Line 
                type="monotone" 
                dataKey="users" 
                stroke="hsl(var(--primary))" 
                strokeWidth={3} 
                dot={false} 
                activeDot={{ r: 6, strokeWidth: 0 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="dashboard-card p-5">
        <h3 className="text-sm font-black text-muted-foreground uppercase tracking-widest mb-6">Marketplace Activity</h3>
        <div className="h-[250px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={growthData}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--border))" />
              <XAxis 
                dataKey="name" 
                axisLine={false} 
                tickLine={false} 
                tick={{ fontSize: 10, fill: "hsl(var(--muted-foreground))" }} 
              />
              <YAxis 
                axisLine={false} 
                tickLine={false} 
                tick={{ fontSize: 10, fill: "hsl(var(--muted-foreground))" }} 
              />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: "hsl(var(--card))", 
                  borderColor: "hsl(var(--border))",
                  fontSize: "12px",
                  borderRadius: "8px"
                }} 
              />
              <Legend verticalAlign="top" height={36} iconType="circle" wrapperStyle={{ fontSize: '10px', textTransform: 'uppercase', fontWeight: 'bold' }} />
              <Bar dataKey="users" name="Active Users" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} barSize={20} />
              <Bar dataKey="orders" name="Orders" fill="hsl(var(--muted-foreground))" radius={[4, 4, 0, 0]} barSize={20} opacity={0.3} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default GrowthCharts;
