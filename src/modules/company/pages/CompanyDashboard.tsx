import { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faLeaf, faBoxes, faBell, faUser, faChartLine,
  faStore, faPlus, faPencil, faTrash, faSearch,
  faRightFromBracket, faCircleCheck, faShieldHalved,
  faTriangleExclamation, faChevronRight, faFileCircleCheck,
  faSun, faMoon,
} from "@fortawesome/free-solid-svg-icons";
import { motion, AnimatePresence } from "framer-motion";
// import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
// import { 
//   fetchProductsAPI, createProductAPI, updateProductAPI, deleteProductAPI, 
//   fetchFarmerListingsAPI, fetchCompanyProfileAPI, fetchCompanyNotificationsAPI 
// } from "@/api/company.api";

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

type Tab = "overview" | "marketplace" | "products" | "notifications" | "profile";

// ── Fallback Mocks ──────────────────────────────────────────
const MOCK_PRODUCTS: Product[] = [
  { productId: "1", productName: "Premium Wheat",  category: "KG",     unit: "Grain"   },
  { productId: "2", productName: "Basmati Rice",   category: "KG",     unit: "Grain"   },
  { productId: "3", productName: "Soybean Oil",    category: "Litre",  unit: "Liquid"  },
  { productId: "4", productName: "Cotton Bales",   category: "Bundle", unit: "Textile" },
];

const MOCK_COMPANY = { name: "AgroTech Pvt Ltd", email: "agrotech@farmzy.com", gst: "27AABCU9603R1ZX", reg: "MH-2019-001234", location: "Pune, Maharashtra" };

const MOCK_NOTIFS = [
  { id: 1, icon: faCircleCheck,         color: "text-green-400", bg: "bg-green-500/10", text: "Your account has been verified and approved by admin.", time: "2 hours ago" },
  { id: 2, icon: faStore,               color: "text-blue-400",  bg: "bg-blue-500/10",  text: "New farmer listing — Organic Turmeric, Nashik.", time: "4 hours ago" },
  { id: 3, icon: faTriangleExclamation, color: "text-amber-400", bg: "bg-amber-500/10", text: "GST Certificate renewal due in 30 days.", time: "1 day ago" },
];

const MOCK_FARMERS = [
  { id: "f1", farmer: "Ramesh Patil",  location: "Nashik, MH",    produce: "Organic Onion", qty: "500 KG",  price: "₹18/kg",  verified: true  },
  { id: "f2", farmer: "Suresh Jadhav", location: "Solapur, MH",   produce: "Jowar",          qty: "1200 KG", price: "₹22/kg",  verified: true  },
  { id: "f3", farmer: "Anil Kumar",    location: "Aurangabad, MH", produce: "Soybean",        qty: "800 KG",  price: "₹45/kg",  verified: true  },
  { id: "f4", farmer: "Vijay More",    location: "Kolhapur, MH",   produce: "Sugarcane",      qty: "2000 KG", price: "₹3.5/kg", verified: false },
  { id: "f5", farmer: "Dnyaneshwar",   location: "Pune, MH",       produce: "Turmeric",       qty: "300 KG",  price: "₹95/kg",  verified: true  },
];

// ── ProductTable ──────────────────────────────────────────
const ProductTable = ({ data, onEdit, onDelete, dark }: { data: Product[]; onEdit: (p: Product) => void; onDelete: (id: string) => void; dark: boolean; }) => (
  <div className={`rounded-2xl border overflow-hidden ${dark ? "border-white/10 bg-white/5" : "border-gray-100 bg-white"}`}>
    <table className="w-full text-sm">
      <thead>
        <tr className={`border-b ${dark ? "border-white/10 bg-white/5" : "border-gray-100 bg-gray-50"}`}>
          {["Product", "Category", "Unit", "Actions"].map(h => (
            <th key={h} className={`text-left px-5 py-3 text-xs font-semibold uppercase tracking-wider ${dark ? "text-white/40" : "text-gray-400"}`}>{h}</th>
          ))}
        </tr>
      </thead>
      <tbody className={`divide-y ${dark ? "divide-white/5" : "divide-gray-50"}`}>
        {data.map((p) => (
          <tr key={p.productId} className={`group transition-colors ${dark ? "hover:bg-white/5" : "hover:bg-green-50/30"}`}>
            <td className="px-5 py-3.5">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-green-500/20 flex items-center justify-center flex-shrink-0"><FontAwesomeIcon icon={faLeaf} className="text-green-400 text-xs" /></div>
                <span className={`font-semibold text-sm ${dark ? "text-white" : "text-gray-800"}`}>{p.productName}</span>
              </div>
            </td>
            <td className="px-5 py-3.5"><span className={`text-xs font-medium px-2.5 py-1 rounded-full ${dark ? "bg-white/10 text-white/60" : "bg-gray-100 text-gray-600"}`}>{p.category}</span></td>
            <td className={`px-5 py-3.5 text-sm ${dark ? "text-white/50" : "text-gray-500"}`}>{p.unit}</td>
            <td className="px-5 py-3.5">
              <div className="flex gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity">
                <button onClick={() => onEdit(p)} className={`w-7 h-7 rounded-lg border flex items-center justify-center transition-all ${dark ? "border-white/10 text-white/40 hover:text-green-400 hover:border-green-500/50 hover:bg-green-500/10" : "border-gray-200 text-gray-400 hover:text-green-600 hover:border-green-300 hover:bg-green-50"}`}><FontAwesomeIcon icon={faPencil} className="text-[10px]" /></button>
                <button onClick={() => onDelete(p.productId)} className={`w-7 h-7 rounded-lg border flex items-center justify-center transition-all ${dark ? "border-white/10 text-white/40 hover:text-red-400 hover:border-red-500/50 hover:bg-red-500/10" : "border-gray-200 text-gray-400 hover:text-red-500 hover:border-red-200 hover:bg-red-50"}`}><FontAwesomeIcon icon={faTrash} className="text-[10px]" /></button>
              </div>
            </td>
          </tr>
        ))}
        {data.length === 0 && (<tr><td colSpan={4} className="px-5 py-14 text-center"><FontAwesomeIcon icon={faBoxes} className={`text-3xl mb-3 block mx-auto ${dark ? "text-white/10" : "text-gray-200"}`} /><p className={`text-sm ${dark ? "text-white/30" : "text-gray-400"}`}>No products found</p></td></tr>)}
      </tbody>
    </table>
  </div>
);

// ── ProductModal ────────────────────────────────────────────
const ProductModal = ({ open, onClose, onSave, initial, dark }: { open: boolean; onClose: () => void; onSave: (d: { productName: string; category: string; unit: string }) => void; initial?: Product | null; dark: boolean; }) => {
  const [name, setName] = useState(initial?.productName ?? "");
  const [cat,  setCat]  = useState(initial?.category    ?? "");
  const [unit, setUnit] = useState(initial?.unit        ?? "");
  if (!open) return null;

  const inputCls = `w-full rounded-xl py-3 px-4 text-sm focus:outline-none focus:ring-2 focus:ring-green-500 ${dark ? "bg-white/5 border border-white/10 text-white placeholder:text-white/30" : "bg-gray-50 border border-gray-200 text-gray-800 placeholder:text-gray-400"}`;

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 px-4" onClick={(e) => e.target === e.currentTarget && onClose()}>
      <motion.div initial={{ opacity: 0, scale: 0.95, y: 10 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95 }} transition={{ duration: 0.18 }}
        className={`rounded-2xl p-6 w-full max-w-sm border ${dark ? "bg-[#0d1526] border-white/10" : "bg-white border-gray-100 shadow-2xl"}`}>
        <div className="flex items-center gap-3 mb-5">
          <div className="w-8 h-8 bg-green-500/20 rounded-xl flex items-center justify-center"><FontAwesomeIcon icon={faLeaf} className="text-green-400 text-sm" /></div>
          <h3 className={`text-sm font-bold ${dark ? "text-white" : "text-gray-800"}`}>{initial ? "Edit Product" : "Add New Product"}</h3>
        </div>
        <div className="space-y-3">
          {[{ label: "Product Name", val: name, set: setName, ph: "e.g. Premium Wheat" }, { label: "Category", val: cat, set: setCat, ph: "e.g. KG" }, { label: "Unit", val: unit, set: setUnit, ph: "e.g. Grain" }].map(({ label, val, set, ph }) => (
            <div key={label}><label className={`block text-xs font-semibold mb-1.5 ${dark ? "text-white/50" : "text-gray-500"}`}>{label}</label><input className={inputCls} placeholder={ph} value={val} onChange={(e) => set(e.target.value)} /></div>
          ))}
        </div>
        <div className="flex gap-2.5 mt-5">
          <button onClick={onClose} className={`flex-1 rounded-xl py-2.5 text-sm font-semibold border transition-colors ${dark ? "border-white/10 text-white/50 hover:bg-white/5" : "border-gray-200 text-gray-500 hover:bg-gray-50"}`}>Cancel</button>
          <button onClick={() => { if (name && cat && unit) { onSave({ productName: name, category: cat, unit }); onClose(); } }} className="flex-1 bg-green-500 hover:bg-green-400 text-black font-bold rounded-xl py-2.5 text-sm transition-colors">{initial ? "Update" : "Add Product"}</button>
        </div>
      </motion.div>
    </div>
  );
};

// ── Main Component ──────────────────────────────────────────
const CompanyDashboard = () => {
  const [dark, setDark]           = useState(true);
  const [tab,  setTab]            = useState<Tab>("overview");
  const [modalOpen, setModalOpen] = useState(false);
  const [editProduct, setEditProduct] = useState<Product | null>(null);
  const [search, setSearch]       = useState("");

  const [products, setProducts] = useState<Product[]>(MOCK_PRODUCTS);
  const [farmerListings] = useState<FarmerListing[]>(MOCK_FARMERS);
  const [company] = useState(MOCK_COMPANY);
  const [notifications] = useState<Notification[]>(MOCK_NOTIFS);
  
  const isLoading = false;
  const productsData = products;

  const handleSave = (data: { productName: string; category: string; unit: string }) => {
    if (editProduct) setProducts(old => old.map(p => p.productId === editProduct.productId ? { ...p, ...data } : p));
    else setProducts(old => [...old, { productId: Date.now().toString(), ...data }]);
    setEditProduct(null);
  };
  const handleDelete = (id: string) => setProducts(old => old.filter(p => p.productId !== id));
  const openEdit = (p: Product) => { setEditProduct(p); setModalOpen(true); };

  // Theme tokens
  const bg      = dark ? "bg-[#060d1f]"     : "bg-[#F8F9FB]";
  const sidebar  = dark ? "bg-[#0a1428] border-white/10"  : "bg-white border-gray-100";
  const topbar   = dark ? "bg-[#0a1428] border-white/10"  : "bg-white border-gray-100";
  const txt      = dark ? "text-white"       : "text-gray-800";
  const txt2     = dark ? "text-white/50"    : "text-gray-500";
  const txt3     = dark ? "text-white/30"    : "text-gray-400";
  const card     = dark ? "bg-white/5 border-white/10"    : "bg-white border-gray-100";
  const hov      = dark ? "hover:bg-white/5" : "hover:bg-gray-50";
  const activeNav = dark ? "bg-green-500/15 text-green-400" : "bg-green-600 text-white";
  const inactNav  = dark ? `${txt2} ${hov} hover:text-white` : `text-gray-500 ${hov} hover:text-gray-700`;

  const navItems = [
    { key: "overview"       as Tab, label: "Overview",     icon: faChartLine,  badge: undefined             },
    { key: "marketplace"    as Tab, label: "Marketplace",  icon: faStore,      badge: farmerListings.length },
    { key: "products"       as Tab, label: "My Products",  icon: faBoxes,      badge: products.length       },
    { key: "notifications"  as Tab, label: "Notifications",icon: faBell,       badge: notifications.length  },
    { key: "profile"        as Tab, label: "Profile",      icon: faUser,       badge: undefined             },
  ];

  const statCards = [
    { label: "Total Products",  value: products.length,         sub: "In your catalogue",    accent: "bg-green-500/20 text-green-400"  },
    { label: "Farmer Listings", value: farmerListings.length,   sub: "Available to procure", accent: "bg-blue-500/20 text-blue-400"    },
    { label: "Account Status",  value: "Verified",              sub: "KYC approved",         accent: "bg-emerald-500/20 text-emerald-400" },
    { label: "Notifications",   value: notifications.length,    sub: "Recent alerts",        accent: "bg-amber-500/20 text-amber-400"  },
  ];

  return (
    <div className={`min-h-screen flex font-sans ${bg} transition-colors duration-300`}>
      {/* ── SIDEBAR ── */}
      <aside className={`hidden md:flex flex-col w-56 border-r fixed h-full z-20 transition-colors duration-300 ${sidebar}`}>
        <div className={`px-5 py-5 border-b flex items-center justify-between ${dark ? "border-white/10" : "border-gray-100"}`}>
          <div className="flex items-center gap-2">
            <span className={`text-lg font-black tracking-tight ${dark ? "text-white" : "text-gray-900"}`}>
              Farm<span className="text-green-400">Zy</span>
            </span>
          </div>
          <button onClick={() => setDark(!dark)} className={`w-7 h-7 rounded-lg flex items-center justify-center transition-colors ${dark ? "bg-white/10 text-white/60 hover:bg-white/15" : "bg-gray-100 text-gray-500 hover:bg-gray-200"}`}><FontAwesomeIcon icon={dark ? faSun : faMoon} className="text-xs" /></button>
        </div>

        <nav className="flex-1 px-3 py-4 space-y-0.5 overflow-y-auto">
          <p className={`text-[10px] font-bold uppercase tracking-widest px-3 pb-2 ${txt3}`}>Menu</p>
          {navItems.map(item => (
            <button key={item.key} onClick={() => setTab(item.key)} className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-semibold transition-all ${tab === item.key ? activeNav : inactNav}`}>
              <FontAwesomeIcon icon={item.icon} className="w-3.5 flex-shrink-0" /><span className="flex-1 text-left">{item.label}</span>
              {item.badge !== undefined && (<span className={`text-[10px] px-1.5 py-0.5 rounded-full font-bold ${tab === item.key ? dark ? "bg-green-400/20 text-green-300" : "bg-white/20 text-white" : dark ? "bg-white/10 text-white/40" : "bg-gray-100 text-gray-500"}`}>{item.badge}</span>)}
            </button>
          ))}
        </nav>

        <div className={`px-3 pb-4 pt-3 border-t ${dark ? "border-white/10" : "border-gray-100"}`}>
          <div className={`flex items-center gap-2.5 px-2 py-2 rounded-xl cursor-pointer transition-colors ${hov}`}>
            <div className="w-8 h-8 rounded-xl bg-green-500/20 flex items-center justify-center text-[11px] font-bold text-green-400 flex-shrink-0">AG</div>
            <div className="flex-1 min-w-0"><p className={`text-xs font-bold truncate ${txt}`}>{company.name}</p><p className={`text-[10px] ${txt3}`}>Verified Company</p></div>
            <button className={`${txt3} hover:text-red-400 transition-colors`}><FontAwesomeIcon icon={faRightFromBracket} className="text-xs" /></button>
          </div>
        </div>
      </aside>

      {/* ── MAIN ── */}
      <div className="flex-1 md:ml-56 flex flex-col min-h-screen">
        <header className={`border-b px-6 py-4 flex items-center justify-between sticky top-0 z-10 transition-colors duration-300 ${topbar}`}>
          <div>
            <h1 className={`text-base font-bold ${txt}`}>{tab === "overview" ? "Overview" : tab === "marketplace" ? "Farmer Marketplace" : tab === "products" ? "My Products" : tab === "notifications" ? "Notifications" : "Company Profile"}</h1>
            <p className={`text-xs mt-0.5 ${txt3}`}>{tab === "overview" ? `Welcome back, ${company.name}` : tab === "marketplace" ? "Browse verified farmer produce listings" : tab === "products" ? "Manage your product catalogue" : tab === "notifications" ? "Platform updates and alerts" : "Your company account details"}</p>
          </div>
          <div className="flex items-center gap-2">
            <button onClick={() => setTab("notifications")} className={`relative w-9 h-9 rounded-xl border flex items-center justify-center transition-colors ${dark ? "border-white/10 text-white/50 hover:bg-white/5" : "border-gray-100 text-gray-400 hover:bg-gray-50"}`}>
              <FontAwesomeIcon icon={faBell} className="text-sm" /><span className="absolute top-2 right-2 w-1.5 h-1.5 bg-green-400 rounded-full" />
            </button>
            {(tab === "products" || tab === "overview") && (
              <button onClick={() => { setEditProduct(null); setModalOpen(true); }} className="flex items-center gap-2 bg-green-500 hover:bg-green-400 text-black px-4 py-2 rounded-xl text-xs font-bold transition-colors">
                <FontAwesomeIcon icon={faPlus} className="text-[10px]" /> Add Product
              </button>
            )}
          </div>
        </header>

        <main className="flex-1 p-6 pb-24 md:pb-6">
          {isLoading && !productsData ? (<div className="flex justify-center items-center h-48"><div className="animate-spin w-8 h-8 border-4 border-green-500 border-t-transparent rounded-full"></div></div>) : (
            <AnimatePresence mode="wait">
              {tab === "overview" && (
                <motion.div key="overview" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="space-y-6">
                  <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                    {statCards.map((s, i) => (
                      <motion.div key={s.label} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.06 }} className={`rounded-2xl border p-5 transition-colors ${card}`}>
                        <div className={`w-9 h-9 rounded-xl flex items-center justify-center mb-4 ${s.accent}`}><div className="w-2.5 h-2.5 rounded-full bg-current opacity-70" /></div>
                        <p className={`text-xs font-semibold mb-1 ${txt3}`}>{s.label}</p><p className={`text-2xl font-black mb-1 ${txt}`}>{s.value}</p><p className={`text-xs ${txt3}`}>{s.sub}</p>
                      </motion.div>
                    ))}
                  </div>

                  <div className="grid lg:grid-cols-5 gap-5">
                    <div className="lg:col-span-3">
                      <div className="flex items-center justify-between mb-3"><p className={`text-sm font-bold ${txt}`}>Recent Products</p><button onClick={() => setTab("products")} className={`text-xs text-green-400 font-semibold flex items-center gap-1 hover:gap-2 transition-all`}>View all <FontAwesomeIcon icon={faChevronRight} className="text-[9px]" /></button></div>
                      <ProductTable data={products.slice(0, 3)} onEdit={openEdit} onDelete={handleDelete} dark={dark} />
                    </div>
                    <div className="lg:col-span-2">
                      <div className="flex items-center justify-between mb-3"><p className={`text-sm font-bold ${txt}`}>Recent Activity</p><button onClick={() => setTab("notifications")} className="text-xs text-green-400 font-semibold flex items-center gap-1 hover:gap-2 transition-all">View all <FontAwesomeIcon icon={faChevronRight} className="text-[9px]" /></button></div>
                      <div className={`rounded-2xl border divide-y overflow-hidden ${dark ? "border-white/10 divide-white/5" : "border-gray-100 divide-gray-50"}`}>
                        {notifications.map((n: Notification) => (<div key={n.id} className={`flex gap-3 px-4 py-3.5 items-start transition-colors ${hov}`}><div className={`w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5 ${dark ? "bg-green-500/10" : "bg-green-50"}`}><FontAwesomeIcon icon={n.icon} className={`text-xs ${n.color}`} /></div><div><p className={`text-xs leading-relaxed ${txt}`}>{n.text}</p><p className={`text-[10px] mt-1 ${txt3}`}>{n.time}</p></div></div>))}
                      </div>
                    </div>
                  </div>

                  <div>
                    <div className="flex items-center justify-between mb-3"><p className={`text-sm font-bold ${txt}`}>Available Farmer Listings</p><button onClick={() => setTab("marketplace")} className="text-xs text-green-400 font-semibold flex items-center gap-1 hover:gap-2 transition-all">Browse all <FontAwesomeIcon icon={faChevronRight} className="text-[9px]" /></button></div>
                    <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
                      {farmerListings.slice(0, 3).map((fl: FarmerListing, i: number) => (
                        <motion.div key={fl.id} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.07 }} className={`rounded-2xl border p-4 cursor-pointer transition-all hover:border-green-500/40 ${card}`}>
                          <div className="flex items-start justify-between mb-3"><div className="w-9 h-9 bg-green-500/20 rounded-xl flex items-center justify-center"><FontAwesomeIcon icon={faLeaf} className="text-green-400 text-sm" /></div>{fl.verified ? <span className="bg-green-500/15 text-green-400 text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1"><FontAwesomeIcon icon={faCircleCheck} className="text-[9px]" /> Verified</span> : <span className="bg-amber-500/15 text-amber-400 text-[10px] font-bold px-2 py-0.5 rounded-full">Pending</span>}</div>
                          <p className={`font-bold text-sm ${txt}`}>{fl.produce}</p><p className={`text-xs mt-0.5 ${txt3}`}>{fl.farmer} · {fl.location}</p>
                          <div className={`flex items-center justify-between mt-3 pt-3 border-t ${dark ? "border-white/5" : "border-gray-50"}`}><span className={`text-xs ${txt3}`}>{fl.qty}</span><span className="text-sm font-black text-green-400">{fl.price}</span></div>
                        </motion.div>
                      ))}
                    </div>
                  </div>
                </motion.div>
              )}

              {tab === "marketplace" && (
                <motion.div key="marketplace" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="space-y-4">
                  <div className="relative"><FontAwesomeIcon icon={faSearch} className={`absolute left-4 top-1/2 -translate-y-1/2 text-xs pointer-events-none ${txt3}`} /><input placeholder="Search farmers, produce, location..." className={`w-full pl-10 pr-4 py-3 rounded-xl text-sm border focus:outline-none focus:ring-2 focus:ring-green-500 ${dark ? "bg-white/5 border-white/10 text-white placeholder:text-white/30" : "bg-white border-gray-100 text-gray-700 placeholder:text-gray-400"}`} /></div>
                  <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {farmerListings.map((fl: FarmerListing, i: number) => (
                      <motion.div key={fl.id} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.06 }} className={`rounded-2xl border p-5 cursor-pointer group transition-all hover:border-green-500/50 ${card}`}>
                        <div className="flex items-start justify-between mb-4"><div className="w-10 h-10 bg-green-500/20 rounded-xl flex items-center justify-center group-hover:bg-green-500/30 transition-colors"><FontAwesomeIcon icon={faLeaf} className="text-green-400" /></div>{fl.verified ? <span className="bg-green-500/15 text-green-400 text-[10px] font-bold px-2.5 py-1 rounded-full flex items-center gap-1"><FontAwesomeIcon icon={faCircleCheck} className="text-[9px]" /> Verified</span> : <span className="bg-amber-500/15 text-amber-400 text-[10px] font-bold px-2.5 py-1 rounded-full">Pending</span>}</div>
                        <h3 className={`font-black text-base mb-1 ${txt}`}>{fl.produce}</h3><p className={`text-sm ${txt2}`}>{fl.farmer}</p><p className={`text-xs mt-0.5 ${txt3}`}>{fl.location}</p>
                        <div className={`mt-4 pt-4 border-t flex items-center justify-between ${dark ? "border-white/5" : "border-gray-50"}`}><div><p className={`text-[10px] ${txt3}`}>Quantity</p><p className={`text-sm font-bold ${txt}`}>{fl.qty}</p></div><div className="text-right"><p className={`text-[10px] ${txt3}`}>Price</p><p className="text-lg font-black text-green-400">{fl.price}</p></div></div>
                        <button className="mt-3 w-full bg-green-500/10 hover:bg-green-500 border border-green-500/30 hover:border-green-500 text-green-400 hover:text-black font-bold text-xs py-2.5 rounded-xl transition-all">Contact Farmer</button>
                      </motion.div>
                    ))}
                  </div>
                </motion.div>
              )}

              {tab === "products" && (
                <motion.div key="products" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="space-y-4">
                  <div className="flex gap-3"><div className="flex-1 relative"><FontAwesomeIcon icon={faSearch} className={`absolute left-4 top-1/2 -translate-y-1/2 text-xs pointer-events-none ${txt3}`} /><input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search products..." className={`w-full pl-10 pr-4 py-3 rounded-xl text-sm border focus:outline-none focus:ring-2 focus:ring-green-500 ${dark ? "bg-white/5 border-white/10 text-white placeholder:text-white/30" : "bg-white border-gray-100 text-gray-700 placeholder:text-gray-400"}`} /></div><button onClick={() => { setEditProduct(null); setModalOpen(true); }} className="flex items-center gap-2 bg-green-500 hover:bg-green-400 text-black px-4 py-3 rounded-xl text-xs font-bold transition-colors"><FontAwesomeIcon icon={faPlus} className="text-[10px]" /> Add Product</button></div>
                  <ProductTable data={filtered} onEdit={openEdit} onDelete={handleDelete} dark={dark} />
                </motion.div>
              )}

              {tab === "notifications" && (
                <motion.div key="notifications" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
                  <div className={`rounded-2xl border divide-y overflow-hidden ${dark ? "border-white/10 divide-white/5" : "border-gray-100 divide-gray-50"}`}>
                    {notifications.map((n: Notification, i: number) => (<motion.div key={n.id} initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.06 }} className={`flex gap-4 px-5 py-4 items-start transition-colors ${hov}`}><div className={`w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 mt-0.5 ${dark ? "bg-green-500/10" : "bg-green-50"}`}><FontAwesomeIcon icon={n.icon} className={`text-sm ${n.color}`} /></div><div className="flex-1"><p className={`text-sm leading-relaxed ${txt}`}>{n.text}</p><p className={`text-xs mt-1 ${txt3}`}>{n.time}</p></div></motion.div>))}
                  </div>
                </motion.div>
              )}

              {tab === "profile" && (
                <motion.div key="profile" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="grid md:grid-cols-2 gap-5">
                  <div className={`rounded-2xl border p-6 ${card}`}>
                    <div className={`flex items-center gap-4 mb-6 pb-6 border-b ${dark ? "border-white/10" : "border-gray-50"}`}><div className="w-12 h-12 rounded-2xl bg-green-500/20 flex items-center justify-center text-sm font-black text-green-400">AG</div><div><p className={`font-black ${txt}`}>{company.name}</p><p className={`text-xs mt-0.5 ${txt3}`}>{company.email}</p><span className="inline-flex items-center gap-1.5 text-[10px] font-bold bg-green-500/15 text-green-400 px-2.5 py-1 rounded-full mt-2"><FontAwesomeIcon icon={faShieldHalved} className="text-[9px]" /> Verified Company</span></div></div>
                    <p className={`text-[10px] font-bold uppercase tracking-widest mb-3 ${txt3}`}>Company Details</p>
                    {[["GST Number", company.gst], ["Reg Number", company.reg], ["Head Office", company.location]].map(([k, v]) => (<div key={k} className={`flex justify-between items-center py-3 border-b last:border-0 ${dark ? "border-white/5" : "border-gray-50"}`}><span className={`text-xs ${txt3}`}>{k}</span><span className={`text-xs font-bold ${txt}`}>{v}</span></div>))}
                  </div>
                  <div className={`rounded-2xl border p-6 ${card}`}>
                    <p className={`text-[10px] font-bold uppercase tracking-widest mb-4 ${txt3}`}>Document Verification</p>
                    {[["GST Certificate", "Verified"], ["Business License", "Verified"], ["KYC Status", "Approved"], ["Admin Approval", "Approved"]].map(([label, status]) => (<div key={label} className={`flex justify-between items-center py-3 border-b last:border-0 ${dark ? "border-white/5" : "border-gray-50"}`}><span className={`text-sm ${txt}`}>{label}</span><span className="bg-green-500/15 text-green-400 text-[10px] font-bold px-2.5 py-1 rounded-full flex items-center gap-1.5"><FontAwesomeIcon icon={faCircleCheck} className="text-[9px]" /> {status}</span></div>))}
                    <button className={`mt-5 w-full border text-sm font-semibold py-2.5 rounded-xl transition-colors flex items-center justify-center gap-2 ${dark ? "border-white/10 text-white/40 hover:bg-white/5" : "border-gray-200 text-gray-500 hover:bg-gray-50"}`}><FontAwesomeIcon icon={faFileCircleCheck} className="text-xs" /> Upload Documents</button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          )}
        </main>
        <nav className={`md:hidden fixed bottom-0 left-0 right-0 border-t flex z-20 transition-colors ${dark ? "bg-[#0a1428] border-white/10" : "bg-white border-gray-100"}`}>{navItems.map(item => (<button key={item.key} onClick={() => setTab(item.key)} className={`flex-1 flex flex-col items-center gap-1 py-3 text-[10px] font-bold relative transition-colors ${tab === item.key ? "text-green-400" : txt3}`}><FontAwesomeIcon icon={item.icon} className="text-lg" />{item.label.split(" ")[0]}{item.badge !== undefined && item.badge > 0 && (<span className="absolute top-2 right-1/4 min-w-[14px] h-3.5 bg-green-500 text-black text-[8px] font-black rounded-full flex items-center justify-center px-1">{item.badge}</span>)}</button>))}</nav>
      </div>
      <AnimatePresence>{modalOpen && (<ProductModal open={modalOpen} onClose={() => { setModalOpen(false); setEditProduct(null); }} onSave={handleSave} initial={editProduct} dark={dark} />)}</AnimatePresence>
    </div>
  );
};

export default CompanyDashboard;