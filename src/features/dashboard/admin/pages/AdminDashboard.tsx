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
import { motion } from "framer-motion";

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
  <motion.div 
    variants={{ hidden: { opacity: 0, y: 15 }, show: { opacity: 1, y: 0 } }}
    whileHover={{ scale: 1.02, y: -2 }}
    className="bg-gradient-to-br from-card to-muted/10 border border-border/50 rounded-xl p-5 transition-shadow hover:shadow-lg hover:shadow-primary/5 cursor-default relative overflow-hidden"
  >
    <div className="absolute -top-4 -right-4 w-16 h-16 bg-primary/5 rounded-full blur-xl pointer-events-none" />
    <div className="flex justify-between items-start mb-3 relative z-10">
      <div className={cn("w-10 h-10 rounded-xl flex items-center justify-center bg-muted/30 text-muted-foreground shadow-sm", colorClass)}>
        <Icon size={18} />
      </div>
      <div className={cn("flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider px-2 py-1 rounded-full shadow-sm", 
        isPositive ? "bg-emerald-500/10 text-emerald-500" : "bg-red-500/10 text-red-500"
      )}>
        {isPositive ? <ArrowUpRight size={10} /> : <ArrowDownRight size={10} />}
        {change}
      </div>
    </div>
    <div className="space-y-1 relative z-10">
      <p className="text-[10px] font-bold text-muted-foreground/60 uppercase tracking-widest">{title}</p>
      <h3 className="text-2xl font-black tracking-tight text-foreground drop-shadow-sm">{value}</h3>
    </div>
  </motion.div>
);

const AdminDashboard = () => {
  const navigate = useNavigate();

  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.05 }
    }
  };

  const sectionVariants = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { duration: 0.4 } }
  };

  return (
    <div className="space-y-6 pb-12 pt-2">
      {/* 🔝 Platform Health (Top KPIs) */}
      <motion.div 
        variants={containerVariants} 
        initial="hidden" 
        animate="show" 
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4"
      >
        <KpiCard title="Total Users" value="1,842" change="+14.2%" isPositive={true} icon={Users} colorClass="text-primary/70" />
        <KpiCard title="Active (7d)" value="942" change="+5.1%" isPositive={true} icon={TrendingUp} colorClass="text-primary/60" />
        <KpiCard title="New Users" value="28" change="+12.5%" isPositive={true} icon={Users} colorClass="text-primary/50" />
        <KpiCard title="Listings" value="412" change="+21.3%" isPositive={true} icon={ShoppingBag} colorClass="text-primary/70" />
        <KpiCard title="Total Orders" value="156" change="-2.4%" isPositive={false} icon={ShoppingBag} colorClass="text-primary" />
        <KpiCard title="Conv Rate" value="4.2%" change="+0.8%" isPositive={true} icon={TrendingUp} colorClass="text-primary/80" />
      </motion.div>

      {/* 📊 Growth Insights (Charts) */}
      <motion.div variants={sectionVariants} initial="hidden" animate="show" className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-gradient-to-br from-card to-muted/5 border border-border/50 rounded-xl p-6 shadow-sm relative overflow-hidden">
          <div className="absolute -left-20 -top-20 w-40 h-40 bg-primary/10 rounded-full blur-3xl pointer-events-none" />
          <div className="flex justify-between items-center mb-8 relative z-10">
            <h3 className="text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground/50">User Growth Trends</h3>
            <div className="flex gap-4">
              <div className="flex items-center gap-2 text-[10px] font-bold text-primary italic lowercase tracking-tight">— farmers</div>
              <div className="flex items-center gap-2 text-[10px] font-bold text-muted-foreground opacity-40 italic lowercase tracking-tight">— companies</div>
            </div>
          </div>
          <div className="h-[320px] w-full relative z-10">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={GROWTH_DATA}>
                <defs>
                  <linearGradient id="colorFarmers" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.15}/>
                    <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--border))" opacity={0.4} />
                <XAxis dataKey="name" fontSize={10} axisLine={false} tickLine={false} tick={{fill: 'hsl(var(--muted-foreground))', opacity: 0.6}} />
                <YAxis fontSize={10} axisLine={false} tickLine={false} tick={{fill: 'hsl(var(--muted-foreground))', opacity: 0.6}} />
                <Tooltip 
                  contentStyle={{ backgroundColor: 'hsl(var(--card))', borderColor: 'hsl(var(--border))', fontSize: '12px', borderRadius: '8px', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' }}
                  itemStyle={{ color: 'hsl(var(--foreground))' }}
                />
                <Area type="monotone" dataKey="farmers" stroke="hsl(var(--primary))" fillOpacity={1} fill="url(#colorFarmers)" strokeWidth={2.5} />
                <Area type="monotone" dataKey="companies" stroke="hsl(var(--muted-foreground))" fill="transparent" strokeWidth={2} strokeDasharray="6 6" opacity={0.5} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-gradient-to-br from-card to-muted/5 border border-border/50 rounded-xl p-6 shadow-sm relative overflow-hidden">
          <div className="absolute -right-20 -top-20 w-40 h-40 bg-primary/5 rounded-full blur-3xl pointer-events-none" />
          <h3 className="text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground/50 mb-8 relative z-10">Weekly Activity (Units)</h3>
          <div className="h-[320px] w-full relative z-10">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={MARKETPLACE_DATA}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--border))" opacity={0.4} />
                <XAxis dataKey="name" fontSize={10} axisLine={false} tickLine={false} tick={{fill: 'hsl(var(--muted-foreground))', opacity: 0.6}} />
                <YAxis fontSize={10} axisLine={false} tickLine={false} tick={{fill: 'hsl(var(--muted-foreground))', opacity: 0.6}} />
                <Tooltip 
                  contentStyle={{ backgroundColor: 'hsl(var(--card))', borderColor: 'hsl(var(--border))', fontSize: '10px', borderRadius: '8px', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' }}
                  itemStyle={{ color: 'hsl(var(--foreground))' }}
                  cursor={{ fill: 'hsl(var(--muted))', opacity: 0.1 }}
                />
                <Bar dataKey="listings" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} barSize={16} />
                <Bar dataKey="sales" fill="hsl(var(--muted-foreground))" fillOpacity={0.3} radius={[4, 4, 0, 0]} barSize={16} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </motion.div>

      {/* ⚠️ Marketplace Insights & Alerts */}
      <motion.div variants={sectionVariants} initial="hidden" animate="show" className="grid lg:grid-cols-2 gap-6">
        <div className="bg-card border border-border/50 rounded-xl p-6 shadow-sm">
          <h3 className="text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground/50 mb-6 flex items-center gap-2">
            <MapPin size={12} className="text-primary" />
            Top Traded Crops (MT)
          </h3>
          <div className="space-y-4">
            {TOP_CROPS.map((item, idx) => (
              <div key={idx} className="flex items-center justify-between p-3.5 rounded-xl bg-muted/10 border border-transparent hover:border-border/50 hover:bg-muted/20 transition-all group">
                <div className="flex items-center gap-4">
                  <div className="w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center text-[11px] font-black text-primary shadow-sm group-hover:scale-105 transition-transform">{idx + 1}</div>
                  <div>
                    <p className="text-sm font-bold text-foreground tracking-tight">{item.crop}</p>
                    <p className="text-[10px] text-muted-foreground font-medium uppercase tracking-wider mt-0.5">{item.volume}</p>
                  </div>
                </div>
                <div className={cn("text-[10px] font-bold px-2 py-1 rounded-md shadow-sm", 
                  item.status === 'up' ? "bg-emerald-500/10 text-emerald-500" : "bg-red-500/10 text-red-500"
                )}>
                  {item.change}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-card border border-border/50 rounded-xl p-6 shadow-sm flex flex-col h-full relative overflow-hidden">
          <div className="absolute -left-10 -bottom-10 w-32 h-32 bg-red-500/5 rounded-full blur-2xl pointer-events-none" />
          <div className="absolute -right-10 -top-10 w-32 h-32 bg-orange-500/5 rounded-full blur-2xl pointer-events-none" />
          
          <h3 className="text-[10px] font-bold uppercase tracking-[0.2em] text-red-500/80 mb-6 flex items-center gap-2 relative z-10">
            <AlertCircle size={12} />
            Platform Performance Alerts
          </h3>
          <div className="grid grid-cols-2 gap-4 mb-4 relative z-10">
            <div className="bg-gradient-to-br from-red-500/5 to-red-500/[0.02] border border-red-500/10 rounded-xl p-5 flex flex-col justify-between aspect-square hover:border-red-500/30 transition-colors">
              <p className="text-[10px] font-bold text-red-500/70 uppercase tracking-widest leading-normal">Unverified Users<br/>(Drop-off Risk)</p>
              <div>
                <h4 className="text-3xl font-black text-red-500 drop-shadow-sm">12.4%</h4>
                <p className="text-[9px] text-red-500/50 font-bold uppercase tracking-widest mt-1">Target: &lt;5%</p>
              </div>
            </div>
            <div className="bg-gradient-to-br from-orange-500/5 to-orange-500/[0.02] border border-orange-500/10 rounded-xl p-5 flex flex-col justify-between aspect-square hover:border-orange-500/30 transition-colors">
              <p className="text-[10px] font-bold text-orange-500/70 uppercase tracking-widest leading-normal">Dead Listings<br/>(No Engagement)</p>
              <div>
                <h4 className="text-3xl font-black text-orange-500 drop-shadow-sm">42</h4>
                <p className="text-[9px] text-orange-500/50 font-bold uppercase tracking-widest mt-1">Pending Removal</p>
              </div>
            </div>
          </div>
          <div className="bg-card border border-border/50 p-4 rounded-xl flex items-center justify-between mt-auto shadow-sm relative z-10">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-red-500/10 flex items-center justify-center text-red-500 shadow-sm">
                <FileWarning size={14} />
              </div>
              <p className="text-[10px] font-bold text-foreground/70 uppercase tracking-widest">Cancelled Orders (today)</p>
            </div>
            <span className="text-lg font-black text-foreground drop-shadow-sm">08</span>
          </div>
        </div>
      </motion.div>

      {/* 📋 Recent Activity (Tables) */}
      <motion.div variants={sectionVariants} initial="hidden" animate="show" className="grid lg:grid-cols-5 gap-6">
        <div className="lg:col-span-3 bg-card border border-border/50 rounded-xl overflow-hidden shadow-sm flex flex-col">
          <div className="px-6 py-4 border-b border-border/30 flex justify-between items-center bg-muted/5">
             <h3 className="text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground/50">Recent Marketplace Orders</h3>
             <button 
               onClick={() => navigate("/dashboard/admin/users")}
               className="text-[9px] font-black uppercase tracking-widest text-primary hover:text-primary/80 transition-colors"
             >
               View All &rarr;
             </button>
          </div>
          <div className="overflow-x-auto flex-1">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-border/30 bg-muted/10">
                  <th className="px-6 py-3.5 text-[9px] font-bold text-muted-foreground uppercase tracking-widest">Order ID</th>
                  <th className="px-6 py-3.5 text-[9px] font-bold text-muted-foreground uppercase tracking-widest">Entity</th>
                  <th className="px-6 py-3.5 text-[9px] font-bold text-muted-foreground uppercase tracking-widest">Value</th>
                  <th className="px-6 py-3.5 text-[9px] font-bold text-muted-foreground uppercase tracking-widest text-right">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/10">
                {RECENT_ORDERS.map((order, i) => (
                  <tr key={i} className="hover:bg-muted/30 transition-colors group">
                    <td className="px-6 py-4 text-xs font-mono font-bold text-foreground/80 group-hover:text-primary transition-colors">{order.id}</td>
                    <td className="px-6 py-4 text-xs font-bold text-foreground/90">{order.user}</td>
                    <td className="px-6 py-4 text-xs font-black text-foreground">{order.amount}</td>
                    <td className="px-6 py-4 text-right">
                      <span className={cn("text-[9px] font-black uppercase tracking-widest px-2 py-1 rounded-md shadow-sm border", 
                        order.status === 'Delivered' ? "bg-emerald-500/10 text-emerald-500 border-emerald-500/20" : 
                        order.status === 'Disputed' ? "bg-red-500/10 text-red-500 border-red-500/20" :
                        "bg-muted border-border/50 text-foreground/70"
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

        <div className="lg:col-span-2 bg-gradient-to-br from-card to-muted/5 border border-border/50 rounded-xl p-6 shadow-sm flex flex-col">
          <h3 className="text-[10px] font-bold uppercase tracking-[0.2em] text-red-500/70 mb-6 flex items-center gap-2">
            <Clock size={12} className="text-red-500/70" />
            Failed Transactions
          </h3>
          <div className="space-y-3 flex-1">
            {FAILED_TRANSACTIONS.map((txn, i) => (
              <div key={i} className="flex flex-col gap-1.5 p-3.5 rounded-xl border border-red-500/10 bg-red-500/5 hover:bg-red-500/10 transition-all cursor-pointer group">
                <div className="flex justify-between items-center">
                  <span className="text-[11px] font-mono font-bold text-red-500/90 tracking-tight">{txn.id}</span>
                  <span className="text-[9px] font-bold text-red-500/50 group-hover:text-red-500/70 transition-colors">{txn.time}</span>
                </div>
                <p className="text-xs font-bold text-foreground/90 tracking-tight">{txn.reason}</p>
              </div>
            ))}
          </div>
          <button className="w-full mt-6 py-2.5 bg-background hover:bg-muted border border-border/60 rounded-xl text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground hover:text-foreground transition-all shadow-sm">
            View Issue Logs
          </button>
        </div>
      </motion.div>
    </div>
  );
};

export default AdminDashboard;
