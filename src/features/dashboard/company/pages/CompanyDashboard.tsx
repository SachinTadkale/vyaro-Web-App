import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { fetchFarmerListingsAPI, fetchCompanyProfileAPI } from "@/services/company.api";
import { useAuthStore } from "@/store/useAuthStore";
import {
  Search,
  CheckCircle,
  ShieldCheck,
  FileCheck,
  Plus,
  Pencil,
  Trash,
  Boxes,
  Store,
  AlertTriangle,
  Leaf,
  ShoppingCart,
  Bell,
  Edit,
  Landmark,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";
import StatCard from "@/components/common/StatCard";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/common/Table";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/common/Tooltip";
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as RechartsTooltip,
  ResponsiveContainer
} from "recharts";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUser } from "@fortawesome/free-solid-svg-icons";

// ── Types ──────────────────────────────────────────────────
export interface Product {
  productId: string;
  productName: string;
  category: string;
  unit: string;
  stockQuantity: number;
}

export interface Notification {
  id: number;
  icon: any;
  color: string;
  bg: string;
  text: string;
  time: string;
  type: string;
  isRead: boolean;
  action?: string;
}

export interface FarmerListing {
  id: string;
  farmer: string;
  location: string;
  produce: string;
  qty: string;
  minOrder: string;
  price: string;
  createdAt: string;
  verified: boolean;
  category: string;
  priceValue: number;
}

type Tab =
  | "overview"
  | "marketplace"
  | "products"
  | "notifications"
  | "profile";

// ── Fallback Mocks ──────────────────────────────────────────
const MOCK_PRODUCTS: Product[] = [
  { productId: "1", productName: "Premium Wheat", category: "KG", unit: "Grain", stockQuantity: 500 },
  { productId: "2", productName: "Basmati Rice", category: "KG", unit: "Grain", stockQuantity: 0 },
  { productId: "3", productName: "Soybean Oil", category: "Litre", unit: "Liquid", stockQuantity: 100 },
  { productId: "4", productName: "Cotton Bales", category: "Bundle", unit: "Textile", stockQuantity: 50 },
];

const MOCK_CHART_DATA = [
  { name: "Jan", orders: 45, revenue: 3200 },
  { name: "Feb", orders: 52, revenue: 4100 },
  { name: "Mar", orders: 38, revenue: 2900 },
  { name: "Apr", orders: 65, revenue: 5800 },
  { name: "May", orders: 48, revenue: 3700 },
  { name: "Jun", orders: 74, revenue: 6900 },
];

const MOCK_NOTIFS: Notification[] = [
  { id: 1, icon: CheckCircle, color: "text-primary", bg: "bg-primary/10", text: "Your account has been verified.", time: "2h ago", type: "General", isRead: false },
  { id: 2, icon: ShoppingCart, color: "text-blue-400", bg: "bg-blue-500/10", text: "New Order received for Premium Wheat.", time: "4h ago", type: "Orders", isRead: false, action: "View Order" },
  { id: 3, icon: AlertTriangle, color: "text-amber-400", bg: "bg-amber-500/10", text: "GST renewal due in 30 days.", time: "1d ago", type: "Alerts", isRead: true },
];


// ── ProductModal ────────────────────────────────────────────
const ProductModal = ({
  open,
  onClose,
  onSave,
  initial,
}: {
  open: boolean;
  onClose: () => void;
  onSave: (d: { productName: string; category: string; unit: string; stockQuantity: number }) => void;
  initial?: Product | null;
}) => {
  const [name, setName] = useState(initial?.productName ?? "");
  const [cat, setCat] = useState(initial?.category ?? "");
  const [unit, setUnit] = useState(initial?.unit ?? "");
  const [qty, setQty] = useState((initial?.stockQuantity ?? 0).toString());

  if (!open) return null;

  const inputCls = "w-full rounded-xl py-2.5 px-4 text-sm focus:outline-none focus:ring-2 focus:ring-primary bg-background border border-border text-foreground placeholder:text-muted-foreground/50";

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 px-4" onClick={(e) => e.target === e.currentTarget && onClose()}>
      <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="bg-card border border-border rounded-2xl p-6 w-full max-w-sm shadow-2xl">
        <h3 className="text-sm font-bold text-foreground mb-5">{initial ? "Edit Product" : "Add New Product"}</h3>
        <div className="space-y-4">
          <div>
            <label className="block text-xs font-semibold mb-1.5 text-muted-foreground uppercase tracking-widest">Product Name</label>
            <input className={inputCls} value={name} onChange={(e) => setName(e.target.value)} placeholder="e.g. Premium Wheat" />
          </div>
          <div>
            <label className="block text-xs font-semibold mb-1.5 text-muted-foreground uppercase tracking-widest">Category</label>
            <input className={inputCls} value={cat} onChange={(e) => setCat(e.target.value)} placeholder="e.g. Grain" />
          </div>
          <div>
            <label className="block text-xs font-semibold mb-1.5 text-muted-foreground uppercase tracking-widest">Unit</label>
            <input className={inputCls} value={unit} onChange={(e) => setUnit(e.target.value)} placeholder="e.g. KG" />
          </div>
          <div>
            <label className="block text-xs font-semibold mb-1.5 text-muted-foreground uppercase tracking-widest">Stock Quantity</label>
            <input type="number" min="0" className={inputCls} value={qty} onChange={(e) => setQty(e.target.value)} placeholder="e.g. 100" />
          </div>
        </div>
        <div className="flex gap-2.5 mt-6">
          <button onClick={onClose} className="flex-1 rounded-xl py-2.5 text-sm font-semibold border border-border text-muted-foreground hover:bg-muted transition-colors">Cancel</button>
          <button onClick={() => { if (name && cat && unit) onSave({ productName: name, category: cat, unit, stockQuantity: parseInt(qty) || 0 }); onClose(); }} className="flex-1 bg-primary text-primary-foreground font-bold rounded-xl py-2.5 text-sm hover:bg-primary/90 transition-colors">Save</button>
        </div>
      </motion.div>
    </div>
  );
};

// ── ProcureModal ────────────────────────────────────────────
const ProcureModal = ({
  listing,
  onClose,
}: {
  listing: FarmerListing | null;
  onClose: () => void;
}) => {
  if (!listing) return null;
  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-[100] px-4" onClick={(e) => e.target === e.currentTarget && onClose()}>
      <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="bg-card border border-border rounded-2xl p-6 w-full max-w-md shadow-2xl">
        <h3 className="text-lg font-black text-foreground mb-1">Procure Produce</h3>
        <p className="text-xs text-muted-foreground mb-5">Review details before initiating procurement.</p>
        
        <div className="bg-muted/20 border border-border/50 rounded-xl p-4 space-y-3 mb-6">
          <div className="flex justify-between items-center"><span className="text-xs font-bold text-muted-foreground uppercase tracking-widest">Produce</span><span className="text-sm font-black text-primary">{listing.produce}</span></div>
          <div className="flex justify-between items-center"><span className="text-xs font-bold text-muted-foreground uppercase tracking-widest">Seller</span><span className="text-sm font-bold text-foreground">{listing.farmer}</span></div>
          <div className="flex justify-between items-center"><span className="text-xs font-bold text-muted-foreground uppercase tracking-widest">Location</span><span className="text-xs font-medium text-muted-foreground">{listing.location}</span></div>
          <hr className="border-border/50 my-2" />
          <div className="flex justify-between items-center"><span className="text-xs font-bold text-muted-foreground uppercase tracking-widest">Available Qty</span><span className="text-sm font-black text-foreground">{listing.qty}</span></div>
          <div className="flex justify-between items-center"><span className="text-xs font-bold text-muted-foreground uppercase tracking-widest">Min Order</span><span className="text-sm font-bold text-amber-500">{listing.minOrder}</span></div>
          <div className="flex justify-between items-center"><span className="text-xs font-bold text-muted-foreground uppercase tracking-widest">Price</span><span className="text-sm font-black text-green-500">{listing.price}</span></div>
          <div className="flex justify-between items-center"><span className="text-xs font-bold text-muted-foreground uppercase tracking-widest">Listed On</span><span className="text-xs font-medium text-muted-foreground">{listing.createdAt}</span></div>
        </div>
        
        <div className="flex gap-2.5">
          <button onClick={onClose} className="flex-1 rounded-xl py-2.5 text-sm font-semibold border border-border text-muted-foreground hover:bg-muted transition-colors">Cancel</button>
          <button onClick={() => { toast.info("Procurement payment gateway and flow is under development. Connecting to farmer..."); onClose(); }} className="flex-1 bg-primary text-primary-foreground font-bold rounded-xl py-2.5 text-sm hover:bg-primary/90 transition-colors">Confirm Order</button>
        </div>
      </motion.div>
    </div>
  );
};

// ── Main Component ──────────────────────────────────────────
const CompanyDashboard = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const user = useAuthStore(state => state.user);

  const [modalOpen, setModalOpen] = useState(false);
  const [procureListing, setProcureListing] = useState<FarmerListing | null>(null);
  const [editProduct, setEditProduct] = useState<Product | null>(null);
  const [search, setSearch] = useState("");

  const [products, setProducts] = useState<Product[]>(MOCK_PRODUCTS);
  
  const tabFromPath = location.pathname.split("/").pop();
  const tab: Tab = (["marketplace", "products", "notifications", "profile"] as Tab[]).includes(tabFromPath as Tab) ? (tabFromPath as Tab) : "overview";

  const { data: farmerListingsData, isLoading: isLoadingListings, isError: isErrorListings, error: errorListings } = useQuery({
    queryKey: ["marketplaceListings"],
    queryFn: fetchFarmerListingsAPI,
    enabled: tab === "marketplace" || tab === "overview",
  });

  const isAuthenticated = useAuthStore(state => state.isAuthenticated);

  useEffect(() => {
    if (tab === "marketplace" && !isAuthenticated()) {
      navigate("/login");
    }
    if (isErrorListings && (errorListings as any)?.response?.status === 401) {
      navigate("/login");
    }
  }, [tab, isAuthenticated, isErrorListings, errorListings, navigate]);

  const { data: profileData, isLoading: isLoadingProfile } = useQuery({
    queryKey: ["companyProfile"],
    queryFn: fetchCompanyProfileAPI,
    enabled: tab === "profile",
  });

  const [marketplaceSearch, setMarketplaceSearch] = useState("");
  const [filterLocation, setFilterLocation] = useState("All");
  const [filterCategory, setFilterCategory] = useState("All");
  const [filterPrice, setFilterPrice] = useState("All");

  const farmerListings: FarmerListing[] = farmerListingsData?.data 
    ? farmerListingsData.data.map((listing: any) => {
        const pUnit = listing.product?.unit || "";
        const startsWithNum = /^\d/.test(pUnit);
        return {
          id: listing.id,
          farmer: listing.seller?.name || "Unknown Farmer",
          location: [listing.location?.district, listing.location?.state].filter(Boolean).join(", ") || "Unknown",
          produce: listing.product?.name || "Unknown Produce",
          qty: (startsWithNum ? `${listing.quantity} x ${pUnit}` : `${listing.quantity} ${pUnit}`).trim(),
          minOrder: listing.minOrder ? (startsWithNum ? `${listing.minOrder} x ${pUnit}` : `${listing.minOrder} ${pUnit}`).trim() : "Flexible",
          price: `₹${listing.price} / ${pUnit || "unit"}`,
          createdAt: new Date(listing.createdAt || new Date()).toLocaleDateString(),
          verified: true,
          category: listing.product?.category || "Uncategorized",
          priceValue: listing.price || 0,
        };
      })
    : []; // No more fallback to MOCK_FARMERS

  // Extract unique filter options
  const uniqueLocations = Array.from(new Set(farmerListings.map(fl => fl.location.split(",")[0].trim()))).filter(Boolean).sort();
  const uniqueCategories = Array.from(new Set(farmerListings.map(fl => fl.category))).filter(Boolean).sort();

  const filteredFarmerListings = farmerListings.filter(fl => {
    // 1. Search
    const q = marketplaceSearch.toLowerCase();
    const matchSearch = !q || fl.produce.toLowerCase().includes(q) || fl.farmer.toLowerCase().includes(q) || fl.location.toLowerCase().includes(q);

    // 2. Location
    const locPrefix = fl.location.split(",")[0].trim();
    const matchLocation = filterLocation === "All" || locPrefix === filterLocation;

    // 3. Category
    const matchCategory = filterCategory === "All" || fl.category === filterCategory;

    // 4. Price
    let matchPrice = true;
    if (filterPrice === "Under ₹500") matchPrice = fl.priceValue < 500;
    else if (filterPrice === "₹500 - ₹2000") matchPrice = fl.priceValue >= 500 && fl.priceValue <= 2000;
    else if (filterPrice === "Above ₹2000") matchPrice = fl.priceValue > 2000;

    return matchSearch && matchLocation && matchCategory && matchPrice;
  });

  const [notifications, setNotifications] = useState<Notification[]>(MOCK_NOTIFS);
  const [notifFilter, setNotifFilter] = useState("All");

  const markAsRead = (id: number) => {
    setNotifications(old => old.map(n => n.id === id ? { ...n, isRead: true } : n));
  };
  const markAllAsRead = () => {
    setNotifications(old => old.map(n => ({ ...n, isRead: true })));
  };

  const filteredNotifications = notifications.filter(n => notifFilter === "All" || n.type === notifFilter);

  const handleSave = (data: { productName: string; category: string; unit: string; stockQuantity: number }) => {
    if (editProduct) {
      setProducts(old => old.map(p => p.productId === editProduct.productId ? { ...p, ...data } : p));
    } else {
      setProducts(old => [...old, { productId: Date.now().toString(), ...data }]);
    }
    setEditProduct(null);
  };

  const handleDelete = (id: string) => setProducts(old => old.filter(p => p.productId !== id));
  const openEdit = (p: Product) => { setEditProduct(p); setModalOpen(true); };


  const goToTab = (nextTab: Tab) => navigate(`/dashboard/company/${nextTab}`);

  const filteredProducts = products.filter(p => {
    const q = search.toLowerCase();
    return p.productName.toLowerCase().includes(q) || p.category.toLowerCase().includes(q);
  });

  const statItems = [
    { label: "Total Products", value: products.length, icon: Boxes, color: "primary" },
    { label: "Farmer Listings", value: farmerListings.length, icon: Store, color: "primary" },
    { label: "Verified Stat", value: "Verified", icon: ShieldCheck, color: "green" },
    { label: "Notifications", value: notifications.length, icon: Bell, color: "yellow" },
  ];

  const ActionButtons = ({ onEdit, onDelete }: { onEdit?: () => void, onDelete?: () => void }) => (
    <TooltipProvider delayDuration={200}>
      <div className="flex items-center gap-1 justify-end">
        {onEdit && (
          <Tooltip>
            <TooltipTrigger asChild>
              <button onClick={onEdit} className="w-8 h-8 rounded-md flex items-center justify-center text-muted-foreground hover:text-primary hover:bg-primary/10 transition-all">
                <Pencil size={15} />
              </button>
            </TooltipTrigger>
            <TooltipContent>Edit item</TooltipContent>
          </Tooltip>
        )}
        {onDelete && (
          <Tooltip>
            <TooltipTrigger asChild>
              <button onClick={onDelete} className="w-8 h-8 rounded-md flex items-center justify-center text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-all">
                <Trash size={15} />
              </button>
            </TooltipTrigger>
            <TooltipContent>Delete item</TooltipContent>
          </Tooltip>
        )}
      </div>
    </TooltipProvider>
  );

  return (
    <div className="flex-1 space-y-5 pt-2">
      <div className="flex justify-end">
        {(tab === "overview" || tab === "products") && (
          <button
            onClick={() => { setEditProduct(null); setModalOpen(true); }}
            className="bg-primary/10 text-primary border border-primary/20 px-4 py-1.5 rounded-lg text-xs font-normal flex items-center gap-2 hover:bg-primary/20 transition-all"
          >
            <Plus size={14} strokeWidth={3} /> Add Product
          </button>
        )}
      </div>

      <AnimatePresence mode="wait">
        {tab === "overview" && (
          <motion.div key="overview" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {statItems.map((s) => (
                <StatCard key={s.label} label={s.label} value={s.value} icon={s.icon} color={s.color} trend={{ value: "4%", isUp: true }} />
              ))}
            </div>

            <div className="grid lg:grid-cols-2 gap-8">
              <div className="bg-card border border-border rounded-xl p-5 shadow-sm space-y-4">
                <h3 className="text-sm font-black uppercase tracking-widest text-muted-foreground">Orders Over Time</h3>
                <div className="h-64 w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={MOCK_CHART_DATA} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke="currentColor" className="opacity-10" vertical={false} />
                      <XAxis dataKey="name" stroke="currentColor" className="text-[10px] uppercase font-bold opacity-50 tracking-widest" tickLine={false} axisLine={false} />
                      <YAxis stroke="currentColor" className="text-[10px] font-bold opacity-50" tickLine={false} axisLine={false} />
                      <RechartsTooltip cursor={{ stroke: 'currentColor', strokeWidth: 1, strokeDasharray: '3 3', opacity: 0.2 }} contentStyle={{ backgroundColor: 'hsl(var(--card))', borderColor: 'hsl(var(--border))', borderRadius: '0.75rem', fontSize: '12px', fontWeight: 'bold' }} itemStyle={{ color: 'hsl(var(--primary))' }} />
                      <Line type="monotone" dataKey="orders" stroke="hsl(var(--primary))" strokeWidth={3} dot={{ r: 4, fill: 'hsl(var(--card))', stroke: 'hsl(var(--primary))', strokeWidth: 2 }} activeDot={{ r: 6, fill: 'hsl(var(--primary))' }} />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </div>
              <div className="bg-card border border-border rounded-xl p-5 shadow-sm space-y-4">
                <h3 className="text-sm font-black uppercase tracking-widest text-muted-foreground">Revenue Trends (₹)</h3>
                <div className="h-64 w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={MOCK_CHART_DATA} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke="currentColor" className="opacity-10" vertical={false} />
                      <XAxis dataKey="name" stroke="currentColor" className="text-[10px] uppercase font-bold opacity-50 tracking-widest" tickLine={false} axisLine={false} />
                      <YAxis stroke="currentColor" className="text-[10px] font-bold opacity-50" tickLine={false} axisLine={false} />
                      <RechartsTooltip cursor={{ fill: 'currentColor', opacity: 0.05 }} contentStyle={{ backgroundColor: 'hsl(var(--card))', borderColor: 'hsl(var(--border))', borderRadius: '0.75rem', fontSize: '12px', fontWeight: 'bold' }} itemStyle={{ color: 'hsl(var(--primary))' }} />
                      <Bar dataKey="revenue" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>

            <div className="grid lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2 space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-black uppercase tracking-widest text-muted-foreground">Recent Products</h3>
                  <button onClick={() => goToTab("products")} className="text-xs text-primary font-bold hover:underline">View All</button>
                </div>
                <div className="dashboard-card overflow-hidden">
                  <Table>
                    <TableHeader>
                      <TableRow className="bg-muted/30">
                        <TableHead className="text-xs uppercase font-black tracking-widest">Product</TableHead>
                        <TableHead className="text-xs uppercase font-black tracking-widest">Category</TableHead>
                        <TableHead className="text-xs uppercase font-black tracking-widest">Unit</TableHead>
                        <TableHead className="text-right text-xs uppercase font-black tracking-widest">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {products.slice(0, 3).map((p) => (
                        <TableRow key={p.productId} className="group hover:bg-muted/50">
                          <TableCell className="py-2.5">
                            <div className="flex items-center gap-3">
                              <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center text-primary"><Leaf size={14} /></div>
                              <span className="text-sm font-bold">{p.productName}</span>
                            </div>
                          </TableCell>
                          <TableCell className="py-2.5">
                            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-muted border border-border">{p.category}</span>
                          </TableCell>
                          <TableCell className="py-2.5 text-xs text-muted-foreground">{p.unit}</TableCell>
                          <TableCell className="py-2.5 text-right"><ActionButtons onEdit={() => openEdit(p)} onDelete={() => handleDelete(p.productId)} /></TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </div>
              <div className="space-y-4">
                <h3 className="text-sm font-black uppercase tracking-widest text-muted-foreground">Recent Activity</h3>
                <div className="bg-card border border-border rounded-xl divide-y divide-border overflow-hidden">
                  {notifications.map(n => (
                    <div key={n.id} className="flex gap-4 p-4 hover:bg-muted/30 transition-colors">
                      <div className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 ${n.bg}`}>
                        <n.icon size={14} className={n.color} />
                      </div>
                      <div>
                        <p className="text-sm text-foreground leading-tight font-medium">{n.text}</p>
                        <p className="text-[10px] text-muted-foreground mt-1">{n.time}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {tab === "marketplace" && (
          <motion.div key="marketplace" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="space-y-6">
            <div className="flex flex-col md:flex-row gap-3">
              <div className="relative flex-1">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground" size={18} />
                <input className="w-full bg-card border border-border pl-12 pr-4 py-3 rounded-2xl text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary shadow-sm" value={marketplaceSearch} onChange={(e) => setMarketplaceSearch(e.target.value)} placeholder="Search farmers, produce, locations..." />
              </div>
              <select className="bg-card border border-border rounded-2xl px-4 py-3 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary shadow-sm cursor-pointer min-w-[150px]" value={filterCategory} onChange={e => setFilterCategory(e.target.value)}>
                <option value="All">All Categories</option>
                {uniqueCategories.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
              <select className="bg-card border border-border rounded-2xl px-4 py-3 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary shadow-sm cursor-pointer min-w-[150px]" value={filterLocation} onChange={e => setFilterLocation(e.target.value)}>
                <option value="All">All Locations</option>
                {uniqueLocations.map(l => <option key={l} value={l}>{l}</option>)}
              </select>
              <select className="bg-card border border-border rounded-2xl px-4 py-3 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary shadow-sm cursor-pointer min-w-[150px]" value={filterPrice} onChange={e => setFilterPrice(e.target.value)}>
                <option value="All">Any Price</option>
                <option value="Under ₹500">Under ₹500</option>
                <option value="₹500 - ₹2000">₹500 - ₹2000</option>
                <option value="Above ₹2000">Above ₹2000</option>
              </select>
            </div>
            <div className="dashboard-card overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow className="bg-muted/30">
                    <TableHead className="text-left px-4 text-xs uppercase font-black tracking-widest">Produce</TableHead>
                    <TableHead className="text-left px-4 text-xs uppercase font-black tracking-widest">Farmer</TableHead>
                    <TableHead className="text-left px-4 text-xs uppercase font-black tracking-widest">Location</TableHead>
                    <TableHead className="text-center px-4 text-xs uppercase font-black tracking-widest">Available qty</TableHead>
                    <TableHead className="text-center px-4 text-xs uppercase font-black tracking-widest">Min Order</TableHead>
                    <TableHead className="text-center px-4 text-xs uppercase font-black tracking-widest">Price</TableHead>
                    <TableHead className="text-center px-4 text-xs uppercase font-black tracking-widest">Listed On</TableHead>
                    <TableHead className="text-center px-4 text-xs uppercase font-black tracking-widest">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {isErrorListings ? (
                    <TableRow>
                      <TableCell colSpan={8} className="py-8 text-center text-destructive font-bold break-words px-4">
                        <AlertTriangle size={24} className="mx-auto mb-3 text-destructive/80" />
                        We encountered an error loading the marketplace data.<br/>
                        <span className="text-xs text-muted-foreground font-normal">{(errorListings as any)?.response?.data?.message || errorListings?.message || "Please check your network connection and try again."}</span>
                      </TableCell>
                    </TableRow>
                  ) : isLoadingListings ? (
                    <TableRow>
                      <TableCell colSpan={8} className="py-8 text-center text-muted-foreground">Loading marketplace listings...</TableCell>
                    </TableRow>
                  ) : filteredFarmerListings.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={8} className="py-8 text-center text-muted-foreground">No listings found.</TableCell>
                    </TableRow>
                  ) : filteredFarmerListings.map(fl => (
                    <TableRow key={fl.id} className="group hover:bg-muted/50">
                      <TableCell className="py-4 px-4 text-left">
                        <div
                          className="flex items-center gap-3 cursor-pointer"
                          onClick={() => navigate(`/dashboard/company/marketplace/${fl.id}`)}
                        >
                          <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary flex-shrink-0"><Leaf size={16} /></div>
                          <div className="flex flex-col">
                            <span className="text-[13px] font-black text-foreground group-hover:text-primary transition-colors">{fl.produce}</span>
                            {fl.verified && <span className="text-[9px] font-black text-primary uppercase italic tracking-widest mt-0.5">Verified Farmer</span>}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell className="py-4 px-4 text-left text-[13px] font-bold text-foreground/80">{fl.farmer}</TableCell>
                      <TableCell className="py-4 px-4 text-left text-xs text-muted-foreground leading-tight max-w-[150px] truncate">{fl.location}</TableCell>
                      <TableCell className="py-4 px-4 text-center text-sm font-black text-foreground">{fl.qty}</TableCell>
                      <TableCell className="py-4 px-4 text-center">
                        <span className="text-[11px] font-bold text-amber-500 bg-amber-500/10 px-2.5 py-1 rounded-md">{fl.minOrder}</span>
                      </TableCell>
                      <TableCell className="py-4 px-4 text-center text-[15px] font-black text-primary tracking-tight">{fl.price}</TableCell>
                      <TableCell className="py-4 px-4 text-center text-[11px] text-muted-foreground font-medium">{fl.createdAt}</TableCell>
                      <TableCell className="py-4 px-4 text-center">
                        <TooltipProvider delayDuration={200}>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <button onClick={() => setProcureListing(fl)} className="bg-primary/10 text-primary p-2.5 rounded-lg hover:bg-primary hover:text-primary-foreground transition-all mx-auto flex">
                                <ShoppingCart size={16} />
                              </button>
                            </TooltipTrigger>
                            <TooltipContent>Procure Now</TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </motion.div>
        )}

        {tab === "products" && (
          <motion.div key="products" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="space-y-6">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground" size={18} />
              <input className="w-full bg-card border border-border pl-12 pr-4 py-3 rounded-2xl text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary shadow-sm" value={search} onChange={e => setSearch(e.target.value)} placeholder="Search your products..." />
            </div>
            <div className="dashboard-card overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow className="bg-muted/30">
                    <TableHead className="text-xs uppercase font-black tracking-widest">Product</TableHead>
                    <TableHead className="text-xs uppercase font-black tracking-widest">Category</TableHead>
                    <TableHead className="text-xs uppercase font-black tracking-widest">Unit</TableHead>
                    <TableHead className="text-center text-xs uppercase font-black tracking-widest">Stock</TableHead>
                    <TableHead className="text-center text-xs uppercase font-black tracking-widest">Status</TableHead>
                    <TableHead className="text-right text-xs uppercase font-black tracking-widest">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredProducts.map((p) => (
                    <TableRow key={p.productId} className="group hover:bg-muted/50">
                      <TableCell className="py-3">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center text-primary"><Boxes size={14} /></div>
                          <span className="text-sm font-bold">{p.productName}</span>
                        </div>
                      </TableCell>
                      <TableCell className="py-3">
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-muted border border-border">{p.category}</span>
                      </TableCell>
                      <TableCell className="py-3 text-xs text-muted-foreground">{p.unit}</TableCell>
                      <TableCell className="py-3 text-center text-sm font-black text-foreground">{p.stockQuantity}</TableCell>
                      <TableCell className="py-3 text-center">
                        {p.stockQuantity > 0 ? (
                          <span className="text-[10px] font-bold px-2.5 py-1 rounded-full bg-green-500/10 text-green-500 border border-green-500/20 uppercase tracking-widest">Active</span>
                        ) : (
                          <span className="text-[10px] font-bold px-2.5 py-1 rounded-full bg-destructive/10 text-destructive border border-destructive/20 uppercase tracking-widest">Out of Stock</span>
                        )}
                      </TableCell>
                      <TableCell className="py-3 text-right"><ActionButtons onEdit={() => openEdit(p)} onDelete={() => handleDelete(p.productId)} /></TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </motion.div>
        )}

        {tab === "notifications" && (
          <motion.div key="notifications" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="space-y-4">
            <div className="flex items-center justify-between mb-4">
              <div className="flex gap-2">
                {["All", "Orders", "Alerts", "General"].map(filter => (
                  <button 
                    key={filter} 
                    onClick={() => setNotifFilter(filter)}
                    className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all ${notifFilter === filter ? 'bg-primary text-primary-foreground shadow-sm' : 'bg-muted text-muted-foreground hover:bg-muted/80'}`}
                  >
                    {filter}
                  </button>
                ))}
              </div>
              <button 
                onClick={markAllAsRead}
                className="text-primary text-[11px] font-bold hover:underline tracking-widest uppercase"
              >
                Mark all as read
              </button>
            </div>
            
            <div className="bg-card border border-border rounded-xl divide-y divide-border overflow-hidden shadow-sm">
              {filteredNotifications.map(n => (
                <div key={n.id} className={`flex gap-4 p-5 transition-colors ${n.isRead ? 'opacity-60 bg-transparent' : 'bg-muted/10'}`}>
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${n.bg}`}>
                    <n.icon size={18} className={n.color} />
                  </div>
                  <div className="flex-1">
                    <p className="text-foreground font-semibold leading-normal">{n.text}</p>
                    <p className="text-xs text-muted-foreground mt-1 lowercase first-letter:uppercase">{n.time}</p>
                    {n.action && (
                      <button className="mt-3 text-[11px] font-bold bg-primary/10 text-primary px-3 py-1.5 rounded-lg hover:bg-primary/20 transition-colors uppercase tracking-widest">
                        {n.action}
                      </button>
                    )}
                  </div>
                  {!n.isRead && (
                    <button onClick={() => markAsRead(n.id)} className="w-8 h-8 rounded-full hover:bg-muted flex items-center justify-center text-muted-foreground flex-shrink-0 transition-colors" title="Mark as read">
                      <CheckCircle size={16} />
                    </button>
                  )}
                </div>
              ))}
              {filteredNotifications.length === 0 && (
                <div className="p-8 text-center text-muted-foreground text-sm font-medium">No {notifFilter.toLowerCase()} notifications.</div>
              )}
            </div>
          </motion.div>
        )}

        {tab === "profile" && (
          <motion.div key="profile" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="grid md:grid-cols-3 gap-6">
            
            {/* Left Column - Main Details */}
            <div className="md:col-span-2 space-y-6">
              
              {/* Header Card */}
              <div className="bg-card border border-border rounded-2xl shadow-sm overflow-hidden flex flex-col">
                {isLoadingProfile ? (
                   <div className="p-5"><p className="text-sm text-muted-foreground animate-pulse font-medium">Loading profile data...</p></div>
                ) : (
                  <>
                    {/* SaaS Banner */}
                    <div className="h-32 w-full bg-gradient-to-r from-primary/20 via-primary/5 to-transparent relative"></div>
                    
                    <div className="px-8 pb-8 relative -mt-12 flex flex-col sm:flex-row items-end gap-6 border-b border-border/50">
                      <div className="relative">
                        {/* Profile Image Bubble */}
                        <div className="w-28 h-28 rounded-2xl bg-card p-1.5 border border-border shadow-sm relative z-10">
                          <div className="w-full h-full rounded-xl bg-primary/10 flex items-center justify-center text-4xl font-black text-primary overflow-hidden">
                            {profileData?.data?.profileImageUrl ? (
                              <img src={profileData.data.profileImageUrl} alt="Company Logo" className="w-full h-full object-cover" />
                            ) : (
                              <FontAwesomeIcon icon={faUser} />
                            )}
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex-1 pb-1">
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                          <div>
                            <h3 className="text-2xl font-black text-foreground leading-tight tracking-tight">{profileData?.data?.companyName || user?.companyName || user?.name || "Unknown Company"}</h3>
                            <p className="text-sm text-muted-foreground mt-0.5">{profileData?.data?.email || user?.email}</p>
                          </div>
                          <div>
                            {profileData?.data?.verification === 'VERIFIED' ? (
                              <span className="bg-green-500/10 text-green-500 text-xs font-bold px-3 py-1.5 rounded-full uppercase flex items-center gap-2 border border-green-500/20 shadow-sm whitespace-nowrap">
                                <ShieldCheck size={14} /> Verified Business
                              </span>
                            ) : (
                              <span className="bg-amber-500/10 text-amber-500 text-xs font-bold px-3 py-1.5 rounded-full uppercase flex items-center gap-2 border border-amber-500/20 shadow-sm whitespace-nowrap">
                                <AlertTriangle size={14} /> Pending Verification
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Contact & Business Info Split */}
                    <div className="grid sm:grid-cols-2 gap-6 p-8">
                      <div className="space-y-4">
                        <h4 className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">Business Details</h4>
                        <div className="space-y-3">
                          <div>
                            <p className="text-[10px] uppercase font-bold text-muted-foreground">GST Number</p>
                            <p className="text-sm font-semibold text-foreground">{profileData?.data?.gstNumber || "Not Provided"}</p>
                          </div>
                          <div>
                            <p className="text-[10px] uppercase font-bold text-muted-foreground">Registration No.</p>
                            <p className="text-sm font-semibold text-foreground">{profileData?.data?.registrationNo || "Not Provided"}</p>
                          </div>
                          <div>
                            <p className="text-[10px] uppercase font-bold text-muted-foreground">HQ Location</p>
                            <p className="text-sm font-medium text-foreground">{profileData?.data?.hqLocation || "No address defined"}</p>
                          </div>
                        </div>
                      </div>

                      <div className="space-y-4">
                        <h4 className="text-[10px] font-black text-muted-foreground uppercase tracking-widest flex items-center justify-between">
                          Contact Info
                          <button onClick={() => toast.info("Settings module controls contact info.")} className="text-primary hover:underline flex items-center gap-1"><Edit size={10} /> Edit</button>
                        </h4>
                        <div className="space-y-3">
                          <div>
                            <p className="text-[10px] uppercase font-bold text-muted-foreground">Support Phone</p>
                            <p className="text-sm font-semibold text-foreground">+91 98765 43210</p>
                          </div>
                          <div>
                            <p className="text-[10px] uppercase font-bold text-muted-foreground">Admin Email</p>
                            <p className="text-sm font-semibold text-foreground">{profileData?.data?.email || user?.email}</p>
                          </div>
                          <div>
                            <p className="text-[10px] uppercase font-bold text-muted-foreground">Website</p>
                            <p className="text-sm font-medium text-primary hover:underline cursor-pointer">www.farmzy-example.com</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </>
                )}
              </div>
              {/* Bank Details Card */}
              <div className="bg-card border border-border rounded-2xl p-8 shadow-sm">
                 <div className="flex items-center justify-between mb-6">
                    <h4 className="text-[10px] font-black text-muted-foreground uppercase tracking-widest flex items-center gap-2">
                       <Landmark size={14} className="text-foreground" /> Bank Settlement Details
                    </h4>
                    <button onClick={() => toast.info("Settings module controls bank info.")} className="text-[10px] font-bold text-primary hover:underline flex items-center gap-1">
                      <Edit size={10} /> Edit
                    </button>
                 </div>
                 
                 <div className="grid sm:grid-cols-2 gap-6 bg-muted/20 p-5 rounded-xl border border-border/50">
                    <div>
                      <p className="text-[10px] uppercase font-bold text-muted-foreground">Account Name</p>
                      <p className="text-sm font-bold text-foreground mt-0.5">{profileData?.data?.companyName || user?.companyName || user?.name || "FarmZY Business"}</p>
                    </div>
                    <div>
                      <p className="text-[10px] uppercase font-bold text-muted-foreground">Bank Name</p>
                      <p className="text-sm font-bold text-foreground mt-0.5">HDFC Bank Ltd.</p>
                    </div>
                    <div>
                      <p className="text-[10px] uppercase font-bold text-muted-foreground">Account Number</p>
                      <p className="text-sm font-mono font-bold text-foreground mt-0.5">•••• •••• •••• 4589</p>
                    </div>
                    <div>
                      <p className="text-[10px] uppercase font-bold text-muted-foreground">IFSC Code</p>
                      <p className="text-sm font-mono font-bold text-foreground mt-0.5">HDFC0••••••</p>
                    </div>
                 </div>
              </div>

            </div>

            {/* Right Column - Sidebar Widgets */}
            <div className="md:col-span-1 space-y-6">
              
              {/* Account Metrics Card */}
              <div className="bg-card border border-border rounded-2xl p-6 shadow-sm">
                <h4 className="text-[10px] font-black text-muted-foreground uppercase tracking-widest mb-5">Account Metrics</h4>
                <div className="space-y-4">
                  <div className="flex justify-between items-center p-3 rounded-xl bg-muted/20 border border-border/50">
                    <span className="text-xs font-semibold text-muted-foreground flex items-center gap-2"><ShoppingCart size={14} /> Total Orders</span>
                    <span className="text-sm font-black text-foreground">1,248</span>
                  </div>
                  <div className="flex justify-between items-center p-3 rounded-xl bg-muted/20 border border-border/50">
                    <span className="text-xs font-semibold text-muted-foreground flex items-center gap-2"><Boxes size={14} /> Active Listings</span>
                    <span className="text-sm font-black text-foreground">14</span>
                  </div>
                  <div className="flex justify-between items-center p-3 rounded-xl bg-primary/5 border border-primary/20 hover:bg-primary/10 transition-colors cursor-pointer">
                    <span className="text-xs font-semibold text-primary flex items-center gap-2"><Store size={14} /> Revenue (YTD)</span>
                    <span className="text-sm font-black text-primary">₹12.4M</span>
                  </div>
                </div>
              </div>

              {/* Compliance & Verification Card */}
              <div className="bg-card border border-border rounded-2xl p-6 shadow-sm">
                <div className="flex items-center justify-between mb-5">
                  <h4 className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">Compliance Status</h4>
                </div>
                
                <div className="space-y-4">
                  {[
                    { label: "GST Certificate", status: "Verified", icon: FileCheck, color: "text-green-500", bg: "bg-green-500/10" },
                    { label: "Business License", status: "Verified", icon: Store, color: "text-green-500", bg: "bg-green-500/10" },
                    { label: "KYC Documents", status: "Approved", icon: ShieldCheck, color: "text-primary", bg: "bg-primary/10" }
                  ].map((item, i) => (
                    <div key={i} className="flex flex-col gap-2 p-3 rounded-xl border border-border/50 bg-muted/10 hover:bg-muted/30 transition-colors">
                      <div className="flex items-center gap-3">
                        <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${item.bg}`}>
                          <item.icon size={14} className={item.color} />
                        </div>
                        <span className="text-xs font-bold text-foreground">{item.label}</span>
                      </div>
                      <div className="flex items-center gap-1.5 mt-1 ml-[44px]">
                        <CheckCircle size={12} className={item.color} />
                        <span className={`text-[10px] font-black uppercase tracking-widest ${item.color}`}>{item.status}</span>
                      </div>
                    </div>
                  ))}
                </div>
                <button onClick={() => toast.info("Document viewer mockup.")} className="w-full mt-4 text-xs font-bold text-primary border border-primary/20 bg-primary/5 py-2.5 rounded-xl hover:bg-primary/10 transition-colors">
                  View Uploaded Documents
                </button>
              </div>

            </div>

          </motion.div>
        )}
      </AnimatePresence>

      <ProductModal open={modalOpen} onClose={() => { setModalOpen(false); setEditProduct(null); }} onSave={handleSave} initial={editProduct} />
      <ProcureModal listing={procureListing} onClose={() => setProcureListing(null)} />
    </div>
  );
};

export default CompanyDashboard;
