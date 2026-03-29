import { useNavigate } from "react-router-dom";
import { 
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  BarChart, Bar
} from 'recharts';
import { 
  TrendingUp, 
  Users, 
  ShoppingBag, 
  ArrowUpRight, 
  ArrowDownRight, 
  AlertCircle,
  Clock,
  MapPin,
  FileWarning
} from 'lucide-react';
import { cn } from "@/utils/utils";

// --- BI MOCK DATA ---
const GROWTH_DATA = [
  { name: 'Week 1', farmers: 400, companies: 240, orders: 150 },
  { name: 'Week 2', farmers: 600, companies: 300, orders: 200 },
  { name: 'Week 3', farmers: 850, companies: 420, orders: 380 },
  { name: 'Week 4', farmers: 1200, companies: 550, orders: 460 },
];

const MARKETPLACE_DATA = [
  { name: 'Mon', listings: 45, sales: 32 },
  { name: 'Tue', listings: 52, sales: 38 },
  { name: 'Wed', listings: 48, sales: 42 },
  { name: 'Thu', listings: 61, sales: 50 },
  { name: 'Fri', listings: 55, sales: 48 },
  { name: 'Sat', listings: 40, sales: 35 },
  { name: 'Sun', listings: 38, sales: 30 },
];

const TOP_CROPS = [
  { crop: 'Premium Wheat', volume: '1,240 Tons', change: '+12.5%', status: 'up' },
  { crop: 'Organic Basmati', volume: '850 Tons', change: '+8.2%', status: 'up' },
  { crop: 'Red Onions', volume: '620 Tons', change: '-4.1%', status: 'down' },
  { crop: 'Soyabean', volume: '510 Tons', change: '+15.0%', status: 'up' },
];

const RECENT_ORDERS = [
  { id: '#ORD-9201', user: 'Ramesh Patil', amount: '₹12,450', status: 'Pending Approval' },
  { id: '#ORD-9198', user: 'AgroCorp India', amount: '₹45,200', status: 'In Transit' },
  { id: '#ORD-9195', user: 'Suresh Jadhav', amount: '₹8,900', status: 'Delivered' },
  { id: '#ORD-9192', user: 'Green Valley', amount: '₹32,000', status: 'Disputed' },
];

const FAILED_TRANSACTIONS = [
  { id: '#TXN-4421', reason: 'Payment Gateway Timeout', time: '2m ago' },
  { id: '#TXN-4418', reason: 'Identity Verification Failed', time: '15m ago' },
  { id: '#TXN-4412', reason: 'Insufficient Stock Lock', time: '1h ago' },
];

// --- SUB-COMPONENTS ---

const KpiCard = ({ title, value, change, isPositive, icon: Icon, colorClass }: any) => (
  <div className="bg-card border border-border/50 rounded-xl p-5 transition-all hover:border-primary/20">
    <div className="flex justify-between items-start mb-3">
      <div className={cn("w-10 h-10 rounded-lg flex items-center justify-center bg-muted/30 text-muted-foreground", colorClass)}>
        <Icon size={18} />
      </div>
      <div className={cn("flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider px-2 py-1 rounded-full", 
        isPositive ? "bg-emerald-500/10 text-emerald-500" : "bg-red-500/10 text-red-500"
      )}>
        {isPositive ? <ArrowUpRight size={10} /> : <ArrowDownRight size={10} />}
        {change}
      </div>
    </div>
    <div className="space-y-1">
      <p className="text-[10px] font-bold text-muted-foreground/60 uppercase tracking-widest">{title}</p>
      <h3 className="text-2xl font-bold tracking-tight text-foreground">{value}</h3>
    </div>
  </div>
);

const AdminDashboard = () => {
  const navigate = useNavigate();

  return (
    <div className="space-y-6 pb-12">
      {/* 🔝 Platform Health (Top KPIs) */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
        <KpiCard title="Total Users" value="1,842" change="+14.2%" isPositive={true} icon={Users} colorClass="text-primary/70" />
        <KpiCard title="Active (7d)" value="942" change="+5.1%" isPositive={true} icon={TrendingUp} colorClass="text-primary/60" />
        <KpiCard title="New Users" value="28" change="+12.5%" isPositive={true} icon={Users} colorClass="text-primary/50" />
        <KpiCard title="Listings" value="412" change="+21.3%" isPositive={true} icon={ShoppingBag} colorClass="text-primary/70" />
        <KpiCard title="Total Orders" value="156" change="-2.4%" isPositive={false} icon={ShoppingBag} colorClass="text-primary" />
        <KpiCard title="Conv Rate" value="4.2%" change="+0.8%" isPositive={true} icon={TrendingUp} colorClass="text-primary/80" />
      </div>

      {/* 📊 Growth Insights (Charts) */}
      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-card border border-border/50 rounded-xl p-6">
          <div className="flex justify-between items-center mb-8">
            <h3 className="text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground/40">User Growth Trends</h3>
            <div className="flex gap-4">
              <div className="flex items-center gap-2 text-[10px] font-bold text-primary italic lowercase tracking-tight">— farmers</div>
              <div className="flex items-center gap-2 text-[10px] font-bold text-muted-foreground opacity-30 italic lowercase tracking-tight">— companies</div>
            </div>
          </div>
          <div className="h-[320px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={GROWTH_DATA}>
                <defs>
                  <linearGradient id="colorFarmers" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.1}/>
                    <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--border))" opacity={0.5} />
                <XAxis dataKey="name" fontSize={10} axisLine={false} tickLine={false} tick={{fill: 'hsl(var(--muted-foreground))', opacity: 0.5}} />
                <YAxis fontSize={10} axisLine={false} tickLine={false} tick={{fill: 'hsl(var(--muted-foreground))', opacity: 0.5}} />
                <Tooltip 
                  contentStyle={{ backgroundColor: 'hsl(var(--card))', borderColor: 'hsl(var(--border))', fontSize: '12px', borderRadius: '8px' }}
                  itemStyle={{ color: 'hsl(var(--foreground))' }}
                />
                <Area type="monotone" dataKey="farmers" stroke="hsl(var(--primary))" fillOpacity={1} fill="url(#colorFarmers)" strokeWidth={2} />
                <Area type="monotone" dataKey="companies" stroke="hsl(var(--muted-foreground))" fill="transparent" strokeWidth={1.5} strokeDasharray="6 6" opacity={0.6} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-card border border-border/50 rounded-xl p-6">
          <h3 className="text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground/40 mb-8">Weekly Activity (Units)</h3>
          <div className="h-[320px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={MARKETPLACE_DATA}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--border))" opacity={0.5} />
                <XAxis dataKey="name" fontSize={10} axisLine={false} tickLine={false} />
                <YAxis fontSize={10} axisLine={false} tickLine={false} />
                <Tooltip 
                  contentStyle={{ backgroundColor: 'hsl(var(--card))', borderColor: 'hsl(var(--border))', fontSize: '10px', borderRadius: '8px' }}
                  itemStyle={{ color: 'hsl(var(--foreground))' }}
                />
                <Bar dataKey="listings" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} barSize={20} />
                <Bar dataKey="sales" fill="hsl(var(--muted))" radius={[4, 4, 0, 0]} barSize={20} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* ⚠️ Marketplace Insights & Alerts */}
      <div className="grid lg:grid-cols-2 gap-6">
        <div className="bg-card border border-border/50 rounded-xl p-6">
          <h3 className="text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground/40 mb-6 flex items-center gap-2">
            <MapPin size={12} />
            Top Traded Crops (MT)
          </h3>
          <div className="space-y-4">
            {TOP_CROPS.map((item, idx) => (
              <div key={idx} className="flex items-center justify-between p-3 rounded-lg bg-muted/10 border border-transparent hover:border-border/50 transition-all">
                <div className="flex items-center gap-4">
                  <div className="w-8 h-8 rounded bg-primary/10 flex items-center justify-center text-[10px] font-bold text-primary">{idx + 1}</div>
                  <div>
                    <p className="text-xs font-bold text-foreground">{item.crop}</p>
                    <p className="text-[10px] text-muted-foreground font-medium">{item.volume}</p>
                  </div>
                </div>
                <div className={cn("text-[10px] font-bold px-2 py-1 rounded bg-muted/30", 
                  item.status === 'up' ? "text-emerald-500" : "text-red-500"
                )}>
                  {item.change}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-card border border-border/50 rounded-xl p-6 flex flex-col h-full">
          <h3 className="text-[10px] font-bold uppercase tracking-[0.2em] text-red-500/60 mb-6 flex items-center gap-2">
            <AlertCircle size={12} />
            Platform Performance Alerts
          </h3>
          <div className="grid grid-cols-2 gap-4 mb-4">
            <div className="bg-red-500/5 border border-red-500/10 rounded-xl p-4 flex flex-col justify-between aspect-square">
              <p className="text-[10px] font-bold text-red-500/60 uppercase tracking-widest leading-normal">Unverified Users<br/>(Drop-off Risk)</p>
              <div>
                <h4 className="text-2xl font-bold text-red-500">12.4%</h4>
                <p className="text-[9px] text-red-500/40 font-bold uppercase tracking-widest mt-1">Target: &lt;5%</p>
              </div>
            </div>
            <div className="bg-orange-500/5 border border-orange-500/10 rounded-xl p-4 flex flex-col justify-between aspect-square">
              <p className="text-[10px] font-bold text-orange-500/60 uppercase tracking-widest leading-normal">Dead Listings<br/>(No Engagement)</p>
              <div>
                <h4 className="text-2xl font-bold text-orange-500">42</h4>
                <p className="text-[9px] text-orange-500/40 font-bold uppercase tracking-widest mt-1">Pending Removal</p>
              </div>
            </div>
          </div>
          <div className="bg-muted/10 border border-border/30 p-4 rounded-xl flex items-center justify-between mt-auto">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-red-500/10 flex items-center justify-center text-red-500">
                <FileWarning size={14} />
              </div>
              <p className="text-[10px] font-bold text-foreground/70 uppercase tracking-widest">Cancelled Orders (today)</p>
            </div>
            <span className="text-lg font-bold text-foreground">08</span>
          </div>
        </div>
      </div>

      {/* 📋 Recent Activity (Tables) */}
      <div className="grid lg:grid-cols-5 gap-6">
        <div className="lg:col-span-3 bg-card border border-border/50 rounded-xl overflow-hidden">
          <div className="px-6 py-4 border-bottom border-border/50 flex justify-between items-center">
             <h3 className="text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground/40">Recent Marketplace Orders</h3>
             <button 
               onClick={() => navigate("/admin/users")}
               className="text-[9px] font-bold uppercase tracking-widest text-primary hover:underline"
             >
               View All ↗
             </button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="border-y border-border/30 bg-muted/10">
                  <th className="px-6 py-3 text-[9px] font-bold text-muted-foreground uppercase tracking-widest">Order ID</th>
                  <th className="px-6 py-3 text-[9px] font-bold text-muted-foreground uppercase tracking-widest">Entity</th>
                  <th className="px-6 py-3 text-[9px] font-bold text-muted-foreground uppercase tracking-widest">Value</th>
                  <th className="px-6 py-3 text-[9px] font-bold text-muted-foreground uppercase tracking-widest">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/20">
                {RECENT_ORDERS.map((order, i) => (
                  <tr key={i} className="hover:bg-muted/10 transition-colors">
                    <td className="px-6 py-3 text-xs font-mono font-bold text-foreground/80">{order.id}</td>
                    <td className="px-6 py-3 text-xs font-bold text-foreground/80">{order.user}</td>
                    <td className="px-6 py-3 text-xs font-bold text-emerald-500">{order.amount}</td>
                    <td className="px-6 py-3">
                      <span className={cn("text-[8px] font-black uppercase tracking-widest px-1.5 py-0.5 rounded border", 
                        order.status === 'Delivered' ? "bg-emerald-500/10 text-emerald-500 border-emerald-500/20" : 
                        order.status === 'Disputed' ? "bg-red-500/10 text-red-500 border-red-500/20" :
                        "bg-muted/40 text-muted-foreground border-border/50"
                      )}>
                        {order.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="lg:col-span-2 bg-card border border-border/50 rounded-xl p-6">
          <h3 className="text-[10px] font-bold uppercase tracking-[0.2em] text-red-500/60 mb-6 flex items-center gap-2">
            <Clock size={12} />
            Failed Transactions
          </h3>
          <div className="space-y-4">
            {FAILED_TRANSACTIONS.map((txn, i) => (
              <div key={i} className="flex flex-col gap-1 p-3 rounded-lg border border-red-500/5 bg-red-500/[0.02] hover:bg-red-500/[0.04] transition-all cursor-pointer">
                <div className="flex justify-between items-center">
                  <span className="text-[10px] font-mono font-bold text-red-500/80">{txn.id}</span>
                  <span className="text-[9px] font-bold text-muted-foreground/40">{txn.time}</span>
                </div>
                <p className="text-xs font-medium text-foreground tracking-tight">{txn.reason}</p>
              </div>
            ))}
          </div>
          <button className="w-full mt-6 py-2 border border-border/50 rounded-lg text-[10px] font-bold uppercase tracking-widest text-muted-foreground hover:bg-muted/30 transition-all">
            Open Transactions Logs
          </button>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
