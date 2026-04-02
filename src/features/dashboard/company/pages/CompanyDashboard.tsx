import { useState, useEffect, useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { fetchFarmerListingsAPI, fetchCompanyProfileAPI, updateCompanyProfileImageAPI, deleteCompanyProfileImageAPI } from "@/services/company.api";
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
  Key,
  Smartphone,
  ShieldAlert,
  Edit,
  Globe,
  MapPin,
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
import { Skeleton } from "@/components/ui/skeleton";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUser } from "@fortawesome/free-solid-svg-icons";

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
  minOrder: string;
  price: string;
  createdAt: string;
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



const MOCK_NOTIFS = [
  { id: 1, icon: CheckCircle, color: "text-primary", bg: "bg-primary/10", text: "Your account has been verified.", time: "2h ago" },
  { id: 2, icon: Store, color: "text-blue-400", bg: "bg-blue-500/10", text: "New farmer listing — Organic Turmeric.", time: "4h ago" },
  { id: 3, icon: AlertTriangle, color: "text-amber-400", bg: "bg-amber-500/10", text: "GST renewal due in 30 days.", time: "1d ago" },
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
  const queryClient = useQueryClient();
  const user = useAuthStore(state => state.user);
  const updateUser = useAuthStore(state => state.updateUser);
  const [modalOpen, setModalOpen] = useState(false);
  const [procureListing, setProcureListing] = useState<FarmerListing | null>(null);
  const [editProduct, setEditProduct] = useState<Product | null>(null);
  const [search, setSearch] = useState("");
  const [showImageMenu, setShowImageMenu] = useState(false);

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

  const fileInputRef = useRef<HTMLInputElement>(null);
  const uploadImageMutation = useMutation({
    mutationFn: updateCompanyProfileImageAPI,
    onSuccess: (res) => {
      queryClient.invalidateQueries({ queryKey: ["companyProfile"] });
      if (res.data?.profileImageUrl) {
        updateUser({ profileImageUrl: res.data.profileImageUrl });
        toast.success("Profile Image updated successfully!");
      }
    },
    onError: (err) => {
      console.error("Upload failed", err);
      toast.error("Failed to upload image.");
    }
  });

  const deleteImageMutation = useMutation({
    mutationFn: deleteCompanyProfileImageAPI,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["companyProfile"] });
      updateUser({ profileImageUrl: undefined });
      setShowImageMenu(false);
      toast.info("Profile Image removed.");
    },
    onError: (err) => {
      console.error("Delete failed", err);
      toast.error("Failed to delete image.");
    }
  });

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      uploadImageMutation.mutate(file);
      setShowImageMenu(false);
    }
  };

  const [marketplaceSearch, setMarketplaceSearch] = useState("");

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
        };
      })
    : []; // No more fallback to MOCK_FARMERS

  const filteredFarmerListings = farmerListings.filter(fl => {
    const q = marketplaceSearch.toLowerCase();
    return fl.produce.toLowerCase().includes(q) || fl.farmer.toLowerCase().includes(q) || fl.location.toLowerCase().includes(q);
  });

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
              <input className="w-full bg-card border border-border pl-12 pr-4 py-3 rounded-2xl text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary shadow-sm" value={marketplaceSearch} onChange={(e) => setMarketplaceSearch(e.target.value)} placeholder="Search farmers, produce, locations..." />
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
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary flex-shrink-0"><Leaf size={16} /></div>
                          <div className="flex flex-col">
                            <span className="text-[13px] font-black text-foreground">{fl.produce}</span>
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
            <div className="bg-card border border-border rounded-2xl shadow-sm overflow-hidden flex flex-col">
              {isLoadingProfile ? (
                <>
                  <div className="h-28 w-full bg-gradient-to-r from-primary/10 via-primary/5 to-transparent relative">
                    <Skeleton className="absolute inset-0 rounded-none bg-white/30" />
                  </div>

                  <div className="px-6 pb-6 relative -mt-12">
                    <div className="flex items-end gap-5 mb-6">
                      <div className="relative">
                        <div className="w-24 h-24 rounded-2xl bg-card p-1.5 border border-border shadow-sm relative z-10">
                          <Skeleton className="w-full h-full rounded-xl bg-primary/10" />
                        </div>
                        {/* <Skeleton className="absolute -bottom-2 -right-2 w-8 h-8 rounded-full border border-border shadow-md z-20" /> */}
                      </div>
                    </div>

                    <div className="space-y-2 pt-2">
                      {[
                        "5rem",
                        "6rem",
                        "7rem",
                        "8rem",
                        "10rem",
                      ].map((valueWidth, index) => (
                        <div key={index} className="flex justify-between py-3 border-b border-border/50 last:border-0 items-center gap-4">
                          <Skeleton className="h-3 w-24" />
                          <Skeleton className="h-8 rounded-lg" style={{ width: valueWidth }} />
                        </div>
                      ))}
                    </div>
                  </div>
                </>
              ) : (
                <>
                  {/* SaaS Banner */}
                  <div className="h-28 w-full bg-gradient-to-r from-primary/20 via-primary/5 to-transparent relative"></div>
                  
                  <div className="px-6 pb-6 relative -mt-12">
                    <div className="flex items-end gap-5 mb-6">
                      <div className="relative">
                        {/* Profile Image Bubble */}
                        <div className="w-24 h-24 rounded-2xl bg-card p-1.5 border border-border shadow-sm relative z-10">
                          <div className="w-full h-full rounded-xl bg-primary/10 flex items-center justify-center text-3xl font-black text-primary overflow-hidden">
                            {profileData?.data?.profileImageUrl ? (
                              <img src={profileData.data.profileImageUrl} alt="Company Logo" className="w-full h-full object-cover" />
                            ) : (
                              <FontAwesomeIcon icon={faUser} />
                            )}
                          </div>
                        </div>
                        
                        {/* Edit Icon (Bottom Right, Half Overlapping) */}
                        <div 
                          onClick={() => setShowImageMenu(!showImageMenu)}
                          className="absolute -bottom-2 -right-2 w-8 h-8 bg-background rounded-full flex items-center justify-center cursor-pointer z-30 shadow-md border border-border hover:bg-muted transition-colors"
                          title="Edit Options"
                        >
                          <Pencil size={13} className="text-foreground" />
                        </div>
                        
                        {/* Dropdown Menu */}
                        {showImageMenu && (
                          <div className="absolute top-full left-full mt-2 -ml-6 w-40 bg-card border border-border rounded-xl shadow-xl z-50 py-1 overflow-hidden" onMouseLeave={() => setShowImageMenu(false)}>
                            <button 
                              onClick={() => { setShowImageMenu(false); fileInputRef.current?.click(); }}
                              className="w-full text-left px-4 py-2.5 text-xs font-bold text-foreground hover:bg-muted transition-colors"
                            >
                              Update picture
                            </button>
                            {profileData?.data?.profileImageUrl && (
                              <button 
                                onClick={() => { setShowImageMenu(false); deleteImageMutation.mutate(); }}
                                className="w-full text-left px-4 py-2.5 text-xs font-bold text-destructive hover:bg-destructive/10 transition-colors"
                              >
                                Delete picture
                              </button>
                            )}
                          </div>
                        )}
                        
                        <input type="file" ref={fileInputRef} className="hidden" accept="image/*" onChange={handleImageUpload} />
                        {uploadImageMutation.isPending && (
                          <div className="absolute inset-0 bg-black/50 rounded-2xl flex items-center justify-center z-40 backdrop-blur-sm">
                            <span className="w-6 h-6 rounded-full border-2 border-white/40 border-t-white animate-spin"></span>
                          </div>
                        )}
                      </div>
                      
                      <div className="pb-1">
                        <h3 className="text-xl font-bold text-foreground leading-tight tracking-tight">{profileData?.data?.companyName || user?.companyName || user?.name || "Unknown Company"}</h3>
                        <p className="text-xs text-muted-foreground mt-0.5">{profileData?.data?.email || user?.email}</p>
                        <div className="mt-2.5 flex items-center gap-2">
                          <span className="bg-primary/15 text-primary text-[10px] font-bold px-2.5 py-1 rounded-full uppercase flex items-center gap-1.5 border border-primary/20">
                            <ShieldCheck size={12} /> {profileData?.data?.verification === 'VERIFIED' ? 'Verified Company' : 'Pending Verification'}
                          </span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="space-y-2 pt-2">
                      {[
                        ["GST Number", profileData?.data?.gstNumber || "N/A"], 
                        ["Registration", profileData?.data?.registrationNo || "N/A"], 
                        ["Head Office", profileData?.data?.hqLocation || "N/A"],
                        ["Support Phone", "+91 98765 43210"],
                        ["Website", "www.farmzy-example.com"]
                      ].map(([k, v]) => (
                        <div key={k} className="flex justify-between py-3 border-b border-border/50 last:border-0 items-center">
                          <span className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">{k}</span>
                          <span className="text-xs font-bold text-foreground bg-muted/40 px-3 py-1.5 rounded-lg border border-border/30">{v}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </>
              )}
            </div>
            <div className="flex flex-col gap-5">
              <div className="bg-card border border-border rounded-2xl p-6 shadow-sm flex-1">
                <div className="flex items-center justify-between mb-5">
                  <h4 className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">Compliance Status</h4>
                  <button className="text-[10px] font-bold text-primary hover:underline flex items-center gap-1">
                    <Edit size={12} /> Manage
                  </button>
                </div>
                
                <div className="space-y-4">
                  {[
                    { label: "GST Certificate", status: "Verified", icon: FileCheck, color: "text-green-500", bg: "bg-green-500/10" },
                    { label: "Business License", status: "Verified", icon: Store, color: "text-green-500", bg: "bg-green-500/10" },
                    { label: "KYC Status", status: "Approved", icon: ShieldCheck, color: "text-primary", bg: "bg-primary/10" }
                  ].map((item, i) => (
                    <div key={i} className="flex items-center justify-between p-3 rounded-xl border border-border/50 bg-muted/20 hover:bg-muted/40 transition-colors">
                      <div className="flex items-center gap-3">
                        <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${item.bg}`}>
                          <item.icon size={14} className={item.color} />
                        </div>
                        <span className="text-sm font-semibold text-foreground">{item.label}</span>
                      </div>
                      <span className="bg-primary/10 text-primary text-[10px] font-bold px-2.5 py-1 rounded-full flex items-center gap-1.5 uppercase border border-primary/20"><CheckCircle size={10} /> {item.status}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-card border border-border rounded-2xl p-6 shadow-sm">
                <h4 className="text-[10px] font-black text-muted-foreground uppercase tracking-widest mb-5">Account & Security</h4>
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-3 rounded-xl border border-border/50 hover:bg-muted/30 transition-colors cursor-pointer group">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-muted flex items-center justify-center text-muted-foreground group-hover:text-foreground transition-colors"><Key size={14} /></div>
                      <div>
                        <p className="text-sm font-semibold text-foreground">Password</p>
                        <p className="text-[10px] text-muted-foreground">Last changed 3 months ago</p>
                      </div>
                    </div>
                    <button className="text-xs font-bold text-foreground border border-border px-3 py-1.5 rounded-lg hover:bg-muted">Change</button>
                  </div>
                  <div className="flex items-center justify-between p-3 rounded-xl border border-border/50 hover:bg-muted/30 transition-colors cursor-pointer group">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-orange-500/10 flex items-center justify-center text-orange-500"><Smartphone size={14} /></div>
                      <div>
                        <p className="text-sm font-semibold text-foreground">Two-Factor Authentication</p>
                        <p className="text-[10px] text-muted-foreground">Not configured</p>
                      </div>
                    </div>
                    <button className="text-xs font-bold text-orange-500 border border-orange-500/20 px-3 py-1.5 rounded-lg hover:bg-orange-500/10">Enable</button>
                  </div>
                </div>
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
