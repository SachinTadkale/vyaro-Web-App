import { useState} from "react";
import { useLocation, useNavigate } from "react-router-dom";
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
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
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

// ── Types ──────────────────────────────────────────────────
export interface Product {
  productId: string;
  productName: string;
  category: string;
  unit: string;
}

export interface Notification {
  id: number;
  icon: any;
  color: string;
  bg: string;
  text: string;
  time: string;
}

export interface FarmerListing {
  id: string;
  farmer: string;
  location: string;
  produce: string;
  qty: string;
  price: string;
  verified: boolean;
}

type Tab =
  | "overview"
  | "marketplace"
  | "products"
  | "notifications"
  | "profile";

// ── Fallback Mocks ──────────────────────────────────────────
const MOCK_PRODUCTS: Product[] = [
  { productId: "1", productName: "Premium Wheat", category: "KG", unit: "Grain" },
  { productId: "2", productName: "Basmati Rice", category: "KG", unit: "Grain" },
  { productId: "3", productName: "Soybean Oil", category: "Litre", unit: "Liquid" },
  { productId: "4", productName: "Cotton Bales", category: "Bundle", unit: "Textile" },
];

const MOCK_COMPANY = {
  name: "AgroTech Pvt Ltd",
  email: "agrotech@farmzy.com",
  gst: "27AABCU9603R1ZX",
  reg: "MH-2019-001234",
  location: "Pune, Maharashtra",
};

const MOCK_NOTIFS = [
  { id: 1, icon: CheckCircle, color: "text-primary", bg: "bg-primary/10", text: "Your account has been verified.", time: "2h ago" },
  { id: 2, icon: Store, color: "text-blue-400", bg: "bg-blue-500/10", text: "New farmer listing — Organic Turmeric.", time: "4h ago" },
  { id: 3, icon: AlertTriangle, color: "text-amber-400", bg: "bg-amber-500/10", text: "GST renewal due in 30 days.", time: "1d ago" },
];

const MOCK_FARMERS = [
  { id: "f1", farmer: "Ramesh Patil", location: "Nashik, MH", produce: "Organic Onion", qty: "500 KG", price: "₹18/kg", verified: true },
  { id: "f2", farmer: "Suresh Jadhav", location: "Solapur, MH", produce: "Jowar", qty: "1200 KG", price: "₹22/kg", verified: true },
  { id: "f3", farmer: "Anil Kumar", location: "Aurangabad, MH", produce: "Soybean", qty: "800 KG", price: "₹45/kg", verified: true },
  { id: "f4", farmer: "Vijay More", location: "Kolhapur, MH", produce: "Sugarcane", qty: "2000 KG", price: "₹3.5/kg", verified: false },
  { id: "f5", farmer: "Dnyaneshwar", location: "Pune, MH", produce: "Turmeric", qty: "300 KG", price: "₹95/kg", verified: true },
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
  onSave: (d: { productName: string; category: string; unit: string }) => void;
  initial?: Product | null;
}) => {
  const [name, setName] = useState(initial?.productName ?? "");
  const [cat, setCat] = useState(initial?.category ?? "");
  const [unit, setUnit] = useState(initial?.unit ?? "");

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
        </div>
        <div className="flex gap-2.5 mt-6">
          <button onClick={onClose} className="flex-1 rounded-xl py-2.5 text-sm font-semibold border border-border text-muted-foreground hover:bg-muted transition-colors">Cancel</button>
          <button onClick={() => { if (name && cat && unit) onSave({ productName: name, category: cat, unit }); onClose(); }} className="flex-1 bg-primary text-primary-foreground font-bold rounded-xl py-2.5 text-sm hover:bg-primary/90 transition-colors">Save</button>
        </div>
      </motion.div>
    </div>
  );
};

// ── Main Component ──────────────────────────────────────────
const CompanyDashboard = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [modalOpen, setModalOpen] = useState(false);
  const [editProduct, setEditProduct] = useState<Product | null>(null);
  const [search, setSearch] = useState("");

  const [products, setProducts] = useState<Product[]>(MOCK_PRODUCTS);
  const [farmerListings] = useState<FarmerListing[]>(MOCK_FARMERS);
  const company = MOCK_COMPANY;
  const notifications = MOCK_NOTIFS;

  const handleSave = (data: { productName: string; category: string; unit: string }) => {
    if (editProduct) {
      setProducts(old => old.map(p => p.productId === editProduct.productId ? { ...p, ...data } : p));
    } else {
      setProducts(old => [...old, { productId: Date.now().toString(), ...data }]);
    }
    setEditProduct(null);
  };

  const handleDelete = (id: string) => setProducts(old => old.filter(p => p.productId !== id));
  const openEdit = (p: Product) => { setEditProduct(p); setModalOpen(true); };

  const tabFromPath = location.pathname.split("/").pop();
  const tab: Tab = (["marketplace", "products", "notifications", "profile"] as Tab[]).includes(tabFromPath as Tab) ? (tabFromPath as Tab) : "overview";

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
            <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground" size={18} />
              <input className="w-full bg-card border border-border pl-12 pr-4 py-3 rounded-2xl text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary shadow-sm" placeholder="Search farmers, produce, locations..." />
            </div>
            <div className="dashboard-card overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow className="bg-muted/30">
                    <TableHead className="text-xs uppercase font-black tracking-widest">Produce</TableHead>
                    <TableHead className="text-xs uppercase font-black tracking-widest">Farmer</TableHead>
                    <TableHead className="text-xs uppercase font-black tracking-widest">Location</TableHead>
                    <TableHead className="text-xs uppercase font-black tracking-widest">Quantity</TableHead>
                    <TableHead className="text-xs uppercase font-black tracking-widest">Price</TableHead>
                    <TableHead className="text-right text-xs uppercase font-black tracking-widest">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {farmerListings.map(fl => (
                    <TableRow key={fl.id} className="group hover:bg-muted/50">
                      <TableCell className="py-3">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center text-primary"><Leaf size={14} /></div>
                          <div className="flex flex-col">
                            <span className="text-sm font-bold">{fl.produce}</span>
                            {fl.verified && <span className="text-[9px] font-black text-primary uppercase italic">Verified Farmer</span>}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell className="py-3 text-sm font-medium">{fl.farmer}</TableCell>
                      <TableCell className="py-3 text-xs text-muted-foreground">{fl.location}</TableCell>
                      <TableCell className="py-3 text-xs font-bold">{fl.qty}</TableCell>
                      <TableCell className="py-3 text-sm font-black text-primary">{fl.price}</TableCell>
                      <TableCell className="py-3 text-right">
                        <TooltipProvider delayDuration={200}>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <button className="bg-primary/10 text-primary p-2 rounded-md hover:bg-primary hover:text-primary-foreground transition-all">
                                <ShoppingCart size={15} />
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
                      <TableCell className="py-3 text-right"><ActionButtons onEdit={() => openEdit(p)} onDelete={() => handleDelete(p.productId)} /></TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </motion.div>
        )}

        {tab === "notifications" && (
          <motion.div key="notifications" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="bg-card border border-border rounded-xl divide-y divide-border overflow-hidden shadow-sm">
            {notifications.map(n => (
              <div key={n.id} className="flex gap-4 p-5 hover:bg-muted/30 transition-colors">
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${n.bg}`}>
                  <n.icon size={18} className={n.color} />
                </div>
                <div>
                  <p className="text-foreground font-semibold leading-normal">{n.text}</p>
                  <p className="text-xs text-muted-foreground mt-1 lowercase first-letter:uppercase">{n.time}</p>
                </div>
              </div>
            ))}
          </motion.div>
        )}

        {tab === "profile" && (
          <motion.div key="profile" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="grid md:grid-cols-2 gap-5">
            <div className="bg-card border border-border rounded-2xl p-5 shadow-sm">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center text-xl font-black text-primary">AG</div>
                <div>
                  <h3 className="text-lg font-bold text-foreground">{company.name}</h3>
                  <p className="text-xs text-muted-foreground">{company.email}</p>
                  <div className="mt-2 flex items-center gap-2">
                    <span className="bg-primary/15 text-primary text-[9px] font-bold px-2 py-0.5 rounded-full uppercase flex items-center gap-1.5 border border-primary/20"><ShieldCheck size={11} /> Verified Company</span>
                  </div>
                </div>
              </div>
              <div className="space-y-3">
                {[["GST Number", company.gst], ["Registration", company.reg], ["Head Office", company.location]].map(([k, v]) => (
                  <div key={k} className="flex justify-between py-2 border-b border-border/50 last:border-0">
                    <span className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">{k}</span>
                    <span className="text-xs font-bold text-foreground">{v}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="bg-card border border-border rounded-2xl p-5 shadow-sm">
              <h4 className="text-[10px] font-black text-muted-foreground uppercase tracking-widest mb-4">Compliance Status</h4>
              <div className="space-y-3">
                {[["GST Certificate", "Verified"], ["Business License", "Verified"], ["KYC Status", "Approved"]].map(([k, v]) => (
                  <div key={k} className="flex justify-between py-2 border-b border-border/50 last:border-0">
                    <span className="text-xs font-medium text-foreground">{k}</span>
                    <span className="bg-primary/10 text-primary text-[9px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1.5 uppercase border border-primary/20"><CheckCircle size={10} /> {v}</span>
                  </div>
                ))}
              </div>
              <button className="w-full mt-6 border border-border text-foreground font-bold py-2.5 rounded-xl hover:bg-muted transition-all flex items-center justify-center gap-2 text-xs">
                <FileCheck size={14} /> Update Documentation
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <ProductModal open={modalOpen} onClose={() => { setModalOpen(false); setEditProduct(null); }} onSave={handleSave} initial={editProduct} />
    </div>
  );
};

export default CompanyDashboard;
