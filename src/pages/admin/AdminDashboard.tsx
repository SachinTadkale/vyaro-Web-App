import { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faChartLine, faFileCircleCheck, faUsers,
  faCheck, faXmark, faBan, faUnlock, faSearch,
  faShieldHalved, faCircleCheck, faCircleXmark,
  faHourglass, faTriangleExclamation, faChevronRight,
  faSun, faMoon,
} from "@fortawesome/free-solid-svg-icons";
import { motion, AnimatePresence } from "framer-motion";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { fetchUsersAPI, approveUserAPI, rejectUserAPI, blockUserAPI, unblockUserAPI } from "@/api/admin.api";

// ── Types ──────────────────────────────────────────────────
type VerificationStatus = "PENDING" | "APPROVED" | "REJECTED" | "BLOCKED";

export interface KycData {
  kycId: string;
  docType: string;
  docNo: string;
  createdAt: string;
}

export interface User {
  user_id: string;
  name: string;
  email: string;
  phone_no: string;
  address: string;
  isBlocked: boolean;
  verificationStatus: VerificationStatus;
  createdAt: string;
  kyc?: KycData;
}

type Tab = "overview" | "kyc" | "users";

const initials = (name: string) =>
  name.split(" ").map(w => w[0]).join("").slice(0, 2).toUpperCase();

// Fallback Mock Data for when backend is not connected
const MOCK_USERS: User[] = [
  { user_id: "u1", name: "Shubham Dhakate",  email: "shubhamdhakate44257@gmail.com", phone_no: "1234567890",  address: "Pune",        isBlocked: false, verificationStatus: "PENDING",  createdAt: "2026-02-28T04:54:57.932Z", kyc: { kycId: "k1", docType: "AADHAR", docNo: "4712 2120 9858", createdAt: "2026-02-28T04:58:09.932Z" } },
  { user_id: "u2", name: "Sanket Andhale",   email: "sanketandhale75@gmail.com",      phone_no: "9370423531",  address: "Ahilyanagar", isBlocked: false, verificationStatus: "PENDING",  createdAt: "2026-03-02T06:18:57.932Z", kyc: { kycId: "k2", docType: "AADHAR", docNo: "1234 5678 9013", createdAt: "2026-03-02T06:24:07.932Z" } },
  { user_id: "u4", name: "Farmer One",       email: "farmer1@gmail.com",              phone_no: "9876543210",  address: "Nashik",      isBlocked: false, verificationStatus: "APPROVED", createdAt: "2026-01-15T10:00:00.932Z", kyc: { kycId: "k4", docType: "PAN",    docNo: "ABCDE 1234 F",   createdAt: "2026-01-15T12:00:00.932Z" } },
  { user_id: "u6", name: "SeedCo Pvt Ltd",   email: "seedco@gmail.com",               phone_no: "8877665544",  address: "Nagpur",      isBlocked: true,  verificationStatus: "BLOCKED",  createdAt: "2026-02-10T07:00:00.932Z", kyc: { kycId: "k6", docType: "AADHAR", docNo: "9876 9876 9876", createdAt: "2026-02-10T09:00:00.932Z" } },
];

// ── Status Pill ─────────────────────────────────────────────
const StatusPill = ({ status, isBlocked}: { status: VerificationStatus; isBlocked: boolean; dark: boolean }) => {
  if (isBlocked) return <span className="inline-flex items-center gap-1.5 bg-orange-500/15 text-orange-400 text-[10px] font-bold px-2.5 py-1 rounded-full"><FontAwesomeIcon icon={faBan} className="text-[9px]" /> Blocked</span>;
  const cfg: Record<VerificationStatus, { bg: string; text: string; icon: typeof faCheck }> = {
    APPROVED: { bg: "bg-green-500/15",  text: "text-green-400",  icon: faCircleCheck   },
    PENDING:  { bg: "bg-amber-500/15",  text: "text-amber-400",  icon: faHourglass     },
    REJECTED: { bg: "bg-red-500/15",    text: "text-red-400",    icon: faCircleXmark   },
    BLOCKED:  { bg: "bg-orange-500/15", text: "text-orange-400", icon: faBan           },
  };
  const c = cfg[status];
  return <span className={`inline-flex items-center gap-1.5 text-[10px] font-bold px-2.5 py-1 rounded-full ${c.bg} ${c.text}`}><FontAwesomeIcon icon={c.icon} className="text-[9px]" />{status}</span>;
};

// ── Toast ───────────────────────────────────────────────────
const Toast = ({ msg, type }: { msg: string; type: "success" | "error" | "warn" }) => {
  const cfg = {
    success: { bg: "bg-green-500  text-black", icon: faCircleCheck },
    error:   { bg: "bg-red-500    text-white",  icon: faCircleXmark },
    warn:    { bg: "bg-amber-500  text-black",  icon: faTriangleExclamation },
  }[type];
  return (
    <motion.div initial={{ opacity: 0, y: 20, scale: 0.95 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: 10 }}
      className={`fixed bottom-6 right-6 ${cfg.bg} text-sm font-bold px-5 py-3 rounded-2xl flex items-center gap-2.5 shadow-2xl z-50`}>
      <FontAwesomeIcon icon={cfg.icon} />
      {msg}
    </motion.div>
  );
};

// ── KYC Card ────────────────────────────────────────────────
const KycCard = ({ user, onApprove, onReject, onBlock, dark }: {
  user: User; onApprove: () => void; onReject: () => void; onBlock: () => void; dark: boolean;
}) => {
  const txt  = dark ? "text-white"    : "text-gray-800";
  const txt3 = dark ? "text-white/30" : "text-gray-400";
  const card = dark ? "bg-white/5 border-white/10" : "bg-white border-gray-100";
  const fieldBg = dark ? "bg-white/5" : "bg-gray-50";

  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
      className={`rounded-2xl border p-5 flex flex-col gap-4 hover:border-amber-500/30 transition-all ${card}`}>
      <div className={`flex items-center gap-3 pb-4 border-b ${dark ? "border-white/5" : "border-gray-50"}`}>
        <div className="w-10 h-10 rounded-xl bg-green-500/20 flex items-center justify-center text-xs font-black text-green-400 flex-shrink-0">
          {initials(user.name)}
        </div>
        <div className="flex-1 min-w-0">
          <p className={`text-sm font-black truncate ${txt}`}>{user.name}</p>
          <p className={`text-xs truncate ${txt3}`}>{user.email}</p>
        </div>
        <StatusPill status={user.verificationStatus} isBlocked={user.isBlocked} dark={dark} />
      </div>

      {user.kyc && (
        <div className="grid grid-cols-2 gap-2">
          {[["Doc Type", user.kyc.docType], ["Doc Number", user.kyc.docNo], ["Phone", user.phone_no], ["Location", user.address]].map(([label, value]) => (
            <div key={label} className={`rounded-xl px-3 py-2.5 ${fieldBg}`}>
              <p className={`text-[9px] font-bold uppercase tracking-wider ${txt3}`}>{label}</p>
              <p className={`text-xs font-bold mt-0.5 truncate ${txt}`}>{value}</p>
            </div>
          ))}
        </div>
      )}

      <div className="flex gap-2 mt-auto">
        <button onClick={onApprove} className="flex-1 bg-green-500 hover:bg-green-400 text-black font-black text-xs py-2.5 rounded-xl flex items-center justify-center gap-1.5 transition-colors">
          <FontAwesomeIcon icon={faCheck} className="text-[10px]" /> Approve
        </button>
        <button onClick={onReject} className="flex-1 bg-red-500/10 hover:bg-red-500/20 border border-red-500/20 text-red-400 font-black text-xs py-2.5 rounded-xl flex items-center justify-center gap-1.5 transition-colors">
          <FontAwesomeIcon icon={faXmark} className="text-[10px]" /> Reject
        </button>
        <button onClick={onBlock} className="flex-1 bg-orange-500/10 hover:bg-orange-500/20 border border-orange-500/20 text-orange-400 font-black text-xs py-2.5 rounded-xl flex items-center justify-center gap-1.5 transition-colors">
          <FontAwesomeIcon icon={faBan} className="text-[10px]" /> Block
        </button>
      </div>
    </motion.div>
  );
};

// ── Main Component ──────────────────────────────────────────
const AdminDashboard = () => {
  const [dark,         setDark]         = useState(true);
  const [tab,          setTab]          = useState<Tab>("overview");
  const [search,       setSearch]       = useState("");
  const [statusFilter, setStatusFilter] = useState<VerificationStatus | "">("");
  const [toast,        setToast]        = useState<{ msg: string; type: "success" | "error" | "warn" } | null>(null);

  const queryClient = useQueryClient();

  // API Data Query
  const { data: usersData, isLoading } = useQuery<User[]>({ 
    queryKey: ["adminUsers"], 
    queryFn: fetchUsersAPI,
    retry: 1
  });

  const users = usersData && Array.isArray(usersData) && usersData.length > 0 ? usersData : MOCK_USERS;

  const showToast = (msg: string, type: "success" | "error" | "warn") => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3000);
  };

  const handleOptimisticUpdate = (id: string, patch: Partial<User>) => {
    queryClient.setQueryData(["adminUsers"], (old: User[] | undefined) => 
      old ? old.map(u => u.user_id === id ? { ...u, ...patch } : u) : old
    );
  };

  // Mutations
  const approveMutation = useMutation({
    mutationFn: approveUserAPI,
    onMutate: (id) => handleOptimisticUpdate(id, { verificationStatus: "APPROVED", isBlocked: false }),
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ["adminUsers"] }); showToast("User approved — email sent", "success"); },
    onError: () => { queryClient.invalidateQueries({ queryKey: ["adminUsers"] }); showToast("Failed to approve user.", "error"); }
  });

  const rejectMutation = useMutation({
    mutationFn: rejectUserAPI,
    onMutate: (id) => handleOptimisticUpdate(id, { verificationStatus: "REJECTED" }),
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ["adminUsers"] }); showToast("User rejected", "error"); },
    onError: () => { queryClient.invalidateQueries({ queryKey: ["adminUsers"] }); showToast("Failed to reject user.", "error"); }
  });

  const blockMutation = useMutation({
    mutationFn: blockUserAPI,
    onMutate: (id) => handleOptimisticUpdate(id, { isBlocked: true, verificationStatus: "BLOCKED" }),
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ["adminUsers"] }); showToast("User account blocked", "warn"); },
  });

  const unblockMutation = useMutation({
    mutationFn: unblockUserAPI,
    onMutate: (id) => handleOptimisticUpdate(id, { isBlocked: false, verificationStatus: "APPROVED" }),
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ["adminUsers"] }); showToast("User unblocked", "success"); },
  });

  const handleApprove = (id: string) => approveMutation.mutate(id);
  const handleReject  = (id: string) => rejectMutation.mutate(id);
  const handleBlock   = (id: string) => blockMutation.mutate(id);
  const handleUnblock = (id: string) => unblockMutation.mutate(id);

  const pending  = users.filter(u => u.verificationStatus === "PENDING" && !u.isBlocked);
  const approved = users.filter(u => u.verificationStatus === "APPROVED" && !u.isBlocked);
  const blocked  = users.filter(u => u.isBlocked);

  const filteredUsers = users.filter(u => {
    const matchText   = u.name.toLowerCase().includes(search.toLowerCase()) || u.email.toLowerCase().includes(search.toLowerCase());
    const matchStatus = !statusFilter || u.verificationStatus === statusFilter || (statusFilter === "BLOCKED" && u.isBlocked);
    return matchText && matchStatus;
  });

  // Theme tokens
  const bg       = dark ? "bg-[#060d1f]"    : "bg-[#F8F9FB]";
  const sidebar  = dark ? "bg-[#0a1428] border-white/10" : "bg-white border-gray-100";
  const topbar   = dark ? "bg-[#0a1428] border-white/10" : "bg-white border-gray-100";
  const txt      = dark ? "text-white"      : "text-gray-800";
  const txt2     = dark ? "text-white/50"   : "text-gray-500";
  const txt3     = dark ? "text-white/30"   : "text-gray-400";
  const card     = dark ? "bg-white/5 border-white/10" : "bg-white border-gray-100";
  const hov      = dark ? "hover:bg-white/5" : "hover:bg-gray-50";
  const activeNav = dark ? "bg-green-500/15 text-green-400" : "bg-green-600 text-white";
  const inactNav  = dark ? `${txt2} ${hov} hover:text-white` : `text-gray-500 ${hov} hover:text-gray-700`;

  const navItems = [
    { key: "overview" as Tab, label: "Overview",    icon: faChartLine,       badge: undefined,      badgeRed: false },
    { key: "kyc"      as Tab, label: "Pending KYC", icon: faFileCircleCheck, badge: pending.length,  badgeRed: true  },
    { key: "users"    as Tab, label: "All Users",   icon: faUsers,           badge: users.length,    badgeRed: false },
  ];

  const statsData = [
    { label: "Total Accounts",  value: users.length,    sub: "Registered", accent: "bg-blue-500/20 text-blue-400"    },
    { label: "Pending KYC",     value: pending.length,  sub: "Need review", accent: "bg-amber-500/20 text-amber-400"  },
    { label: "Approved",        value: approved.length, sub: "Active",      accent: "bg-green-500/20 text-green-400"  },
    { label: "Blocked",         value: blocked.length,  sub: "Restricted",  accent: "bg-red-500/20 text-red-400"      },
  ];

  return (
    <div className={`min-h-screen flex font-sans transition-colors duration-300 ${bg}`}>
      {/* ── SIDEBAR ── */}
      <aside className={`hidden md:flex flex-col w-56 border-r fixed h-full z-20 transition-colors duration-300 ${sidebar}`}>
        <div className={`px-5 py-5 border-b flex items-center justify-between ${dark ? "border-white/10" : "border-gray-100"}`}>
          <span className={`text-lg font-black tracking-tight ${dark ? "text-white" : "text-gray-900"}`}>
            Farm<span className="text-green-400">Zy</span>
          </span>
          <button onClick={() => setDark(!dark)} className={`w-7 h-7 rounded-lg flex items-center justify-center transition-colors ${dark ? "bg-white/10 text-white/60 hover:bg-white/15" : "bg-gray-100 text-gray-500 hover:bg-gray-200"}`}>
            <FontAwesomeIcon icon={dark ? faSun : faMoon} className="text-xs" />
          </button>
        </div>

        <nav className="flex-1 px-3 py-4 space-y-0.5">
          <p className={`text-[10px] font-bold uppercase tracking-widest px-3 pb-2 ${txt3}`}>Admin Panel</p>
          {navItems.map(item => (
            <button key={item.key} onClick={() => setTab(item.key)}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-semibold transition-all ${tab === item.key ? activeNav : inactNav}`}>
              <FontAwesomeIcon icon={item.icon} className="w-3.5 flex-shrink-0" />
              <span className="flex-1 text-left">{item.label}</span>
              {item.badge !== undefined && (
                <span className={`text-[10px] px-1.5 py-0.5 rounded-full font-bold ${
                  item.badgeRed && item.badge > 0
                    ? "bg-red-500 text-white"
                    : tab === item.key
                    ? dark ? "bg-green-400/20 text-green-300" : "bg-white/20 text-white"
                    : dark ? "bg-white/10 text-white/40" : "bg-gray-100 text-gray-500"
                }`}>{item.badge}</span>
              )}
            </button>
          ))}
        </nav>

        <div className={`px-3 pb-4 pt-3 border-t ${dark ? "border-white/10" : "border-gray-100"}`}>
          <div className="flex items-center gap-2.5 px-2 py-2">
            <div className="w-8 h-8 rounded-xl bg-red-500/20 flex items-center justify-center text-[11px] font-black text-red-400 flex-shrink-0">AD</div>
            <div>
              <p className={`text-xs font-black ${txt}`}>Administrator</p>
              <p className="text-[10px] text-red-400 font-bold">Super Admin</p>
            </div>
          </div>
        </div>
      </aside>

      {/* ── MAIN ── */}
      <div className="flex-1 md:ml-56 flex flex-col min-h-screen">
        <header className={`border-b px-6 py-4 flex items-center justify-between sticky top-0 z-10 transition-colors duration-300 ${topbar}`}>
          <div>
            <h1 className={`text-base font-black ${txt}`}>
              {tab === "overview" ? "Admin Overview" : tab === "kyc" ? "Pending KYC Approvals" : "All Companies"}
            </h1>
            <p className={`text-xs mt-0.5 ${txt3}`}>
              {tab === "overview" ? "FarmZy platform administration" : tab === "kyc" ? `${pending.length} users awaiting verification` : "Manage all registered accounts"}
            </p>
          </div>
          <span className="inline-flex items-center gap-1.5 bg-red-500/15 text-red-400 text-xs font-black px-3 py-1.5 rounded-xl">
            <FontAwesomeIcon icon={faShieldHalved} className="text-[10px]" /> Super Admin
          </span>
        </header>

        <main className="flex-1 p-6 pb-24 md:pb-6">
          {isLoading && !usersData ? (
             <div className="flex justify-center items-center h-48">
               <div className="animate-spin w-8 h-8 border-4 border-green-500 border-t-transparent rounded-full"></div>
             </div>
          ) : (
            <AnimatePresence mode="wait">
              {tab === "overview" && (
                <motion.div key="overview" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="space-y-6">
                  <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                    {statsData.map((s, i) => (
                      <motion.div key={s.label} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.06 }}
                        className={`rounded-2xl border p-5 transition-colors ${card}`}>
                        <div className={`w-9 h-9 rounded-xl flex items-center justify-center mb-4 ${s.accent}`}>
                          <div className="w-2.5 h-2.5 rounded-full bg-current opacity-70" />
                        </div>
                        <p className={`text-xs font-bold mb-1 ${txt3}`}>{s.label}</p>
                        <p className={`text-2xl font-black mb-1 ${txt}`}>{s.value}</p>
                        <p className={`text-xs ${txt3}`}>{s.sub}</p>
                      </motion.div>
                    ))}
                  </div>

                  <div className="grid lg:grid-cols-5 gap-5">
                    <div className="lg:col-span-3">
                      <div className="flex items-center justify-between mb-3">
                        <p className={`text-sm font-black ${txt}`}>Pending KYC Requests</p>
                        {pending.length > 0 && (
                          <button onClick={() => setTab("kyc")} className="text-xs text-green-400 font-bold flex items-center gap-1 hover:gap-2 transition-all">
                            Review all <FontAwesomeIcon icon={faChevronRight} className="text-[9px]" />
                          </button>
                        )}
                      </div>
                      {pending.length === 0 ? (
                        <div className={`rounded-2xl border py-16 text-center ${card}`}>
                          <FontAwesomeIcon icon={faCircleCheck} className="text-4xl text-green-400/20 mb-3 block mx-auto" />
                          <p className={`text-sm font-bold ${txt3}`}>All reviews complete</p>
                        </div>
                      ) : (
                        <div className="grid gap-3">
                          {pending.slice(0, 2).map(u => (
                            <KycCard key={u.user_id} user={u} dark={dark}
                              onApprove={() => handleApprove(u.user_id)}
                              onReject={() => handleReject(u.user_id)}
                              onBlock={() => handleBlock(u.user_id)} />
                          ))}
                        </div>
                      )}
                    </div>

                    <div className="lg:col-span-2 space-y-4">
                      <div className={`rounded-2xl border p-5 ${card}`}>
                        <p className={`text-[10px] font-black uppercase tracking-widest mb-4 ${txt3}`}>Verification Breakdown</p>
                        <div className="space-y-3">
                          {[
                            { label: "Approved",  count: approved.length, color: "bg-green-500",  pct: Math.round(approved.length / (users.length||1) * 100) || 0 },
                            { label: "Pending",   count: pending.length,  color: "bg-amber-400",  pct: Math.round(pending.length  / (users.length||1) * 100) || 0 },
                            { label: "Blocked",   count: blocked.length,  color: "bg-red-400",    pct: Math.round(blocked.length  / (users.length||1) * 100) || 0 },
                          ].map(s => (
                            <div key={s.label}>
                              <div className="flex justify-between text-xs mb-1.5">
                                <span className={txt3}>{s.label}</span>
                                <span className={`font-black ${txt}`}>{s.count}</span>
                              </div>
                              <div className={`h-1.5 rounded-full overflow-hidden ${dark ? "bg-white/10" : "bg-gray-100"}`}>
                                <motion.div className={`h-full ${s.color} rounded-full`}
                                  initial={{ width: 0 }} animate={{ width: `${s.pct}%` }} transition={{ duration: 0.6, delay: 0.2 }} />
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>

                      <div className={`rounded-2xl border p-5 ${card}`}>
                        <p className={`text-[10px] font-black uppercase tracking-widest mb-4 ${txt3}`}>Recent Registrations</p>
                        <div className="space-y-3">
                          {users.slice(-3).reverse().map(u => (
                            <div key={u.user_id} className="flex items-center gap-3">
                              <div className="w-8 h-8 rounded-xl bg-green-500/20 flex items-center justify-center text-[10px] font-black text-green-400 flex-shrink-0">{initials(u.name)}</div>
                              <div className="flex-1 min-w-0">
                                <p className={`text-xs font-bold truncate ${txt}`}>{u.name}</p>
                                <p className={`text-[10px] ${txt3}`}>{new Date(u.createdAt).toLocaleDateString("en-IN", { day: "2-digit", month: "short" })}</p>
                              </div>
                              <StatusPill status={u.verificationStatus} isBlocked={u.isBlocked} dark={dark} />
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}

              {tab === "kyc" && (
                <motion.div key="kyc" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
                  {pending.length === 0 ? (
                    <div className={`rounded-2xl border py-24 text-center ${card}`}>
                      <FontAwesomeIcon icon={faCircleCheck} className="text-5xl text-green-400/20 mb-4 block mx-auto" />
                      <p className={`text-base font-black ${txt3}`}>All KYC requests reviewed</p>
                      <p className={`text-sm mt-1 ${txt3}`}>Check back later for new registrations</p>
                    </div>
                  ) : (
                    <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-4">
                      {pending.map(u => (
                        <KycCard key={u.user_id} user={u} dark={dark}
                          onApprove={() => handleApprove(u.user_id)}
                          onReject={() => handleReject(u.user_id)}
                          onBlock={() => handleBlock(u.user_id)} />
                      ))}
                    </div>
                  )}
                </motion.div>
              )}

              {tab === "users" && (
                <motion.div key="users" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
                  <div className={`rounded-2xl border overflow-hidden ${card}`}>
                    <div className={`flex items-center gap-3 p-4 border-b ${dark ? "border-white/5" : "border-gray-50"}`}>
                      <div className="flex-1 relative">
                        <FontAwesomeIcon icon={faSearch} className={`absolute left-4 top-1/2 -translate-y-1/2 text-xs pointer-events-none ${txt3}`} />
                        <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search by name or email..."
                          className={`w-full pl-10 pr-4 py-2.5 rounded-xl text-sm border focus:outline-none focus:ring-2 focus:ring-green-500 ${dark ? "bg-white/5 border-white/10 text-white placeholder:text-white/30" : "bg-gray-50 border-gray-100 text-gray-700 placeholder:text-gray-400"}`} />
                      </div>
                      <select onChange={e => setStatusFilter(e.target.value as VerificationStatus | "")}
                        className={`rounded-xl px-3 py-2.5 text-xs border focus:outline-none focus:ring-2 focus:ring-green-500 font-bold ${dark ? "bg-white/5 border-white/10 text-white/60" : "bg-gray-50 border-gray-100 text-gray-600"}`}>
                        <option value="">All Status</option>
                        <option value="PENDING">Pending</option>
                        <option value="APPROVED">Approved</option>
                        <option value="BLOCKED">Blocked</option>
                        <option value="REJECTED">Rejected</option>
                      </select>
                    </div>

                    <div className="overflow-x-auto">
                      <table className="w-full text-sm">
                        <thead>
                          <tr className={`border-b ${dark ? "border-white/5 bg-white/3" : "border-gray-50 bg-gray-50"}`}>
                            {["Company", "Phone", "Doc Type", "Status", "Registered", "Actions"].map(h => (
                              <th key={h} className={`text-left px-5 py-3 text-xs font-black uppercase tracking-wider ${txt3}`}>{h}</th>
                            ))}
                          </tr>
                        </thead>
                        <tbody className={`divide-y ${dark ? "divide-white/5" : "divide-gray-50"}`}>
                          {filteredUsers.map(u => (
                            <tr key={u.user_id} className={`group transition-colors ${hov}`}>
                              <td className="px-5 py-4">
                                <div className="flex items-center gap-3">
                                  <div className="w-8 h-8 rounded-xl bg-green-500/20 flex items-center justify-center text-[10px] font-black text-green-400 flex-shrink-0">{initials(u.name)}</div>
                                  <div>
                                    <p className={`text-sm font-black ${txt}`}>{u.name}</p>
                                    <p className={`text-[10px] ${txt3}`}>{u.email}</p>
                                  </div>
                                </div>
                              </td>
                              <td className={`px-5 py-4 text-sm ${txt2}`}>{u.phone_no}</td>
                              <td className="px-5 py-4">
                                <span className="bg-blue-500/15 text-blue-400 text-[10px] font-bold px-2.5 py-1 rounded-full">{u.kyc?.docType ?? "—"}</span>
                              </td>
                              <td className="px-5 py-4"><StatusPill status={u.verificationStatus} isBlocked={u.isBlocked} dark={dark} /></td>
                              <td className={`px-5 py-4 text-xs ${txt3}`}>
                                {new Date(u.createdAt).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" })}
                              </td>
                              <td className="px-5 py-4">
                                <div className="flex gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity">
                                  {u.verificationStatus === "PENDING" && (
                                    <>
                                      <button onClick={() => handleApprove(u.user_id)} className="flex items-center gap-1 bg-green-500/10 border border-green-500/20 text-green-400 text-[10px] font-bold px-2.5 py-1.5 rounded-lg hover:bg-green-500/20 transition-colors">
                                        <FontAwesomeIcon icon={faCheck} className="text-[9px]" /> Approve
                                      </button>
                                      <button onClick={() => handleReject(u.user_id)} className="flex items-center gap-1 bg-red-500/10 border border-red-500/20 text-red-400 text-[10px] font-bold px-2.5 py-1.5 rounded-lg hover:bg-red-500/20 transition-colors">
                                        <FontAwesomeIcon icon={faXmark} className="text-[9px]" /> Reject
                                      </button>
                                    </>
                                  )}
                                  {!u.isBlocked && u.verificationStatus !== "PENDING" && (
                                    <button onClick={() => handleBlock(u.user_id)} className="flex items-center gap-1 bg-orange-500/10 border border-orange-500/20 text-orange-400 text-[10px] font-bold px-2.5 py-1.5 rounded-lg hover:bg-orange-500/20 transition-colors">
                                      <FontAwesomeIcon icon={faBan} className="text-[9px]" /> Block
                                    </button>
                                  )}
                                  {u.isBlocked && (
                                    <button onClick={() => handleUnblock(u.user_id)} className="flex items-center gap-1 bg-blue-500/10 border border-blue-500/20 text-blue-400 text-[10px] font-bold px-2.5 py-1.5 rounded-lg hover:bg-blue-500/20 transition-colors">
                                      <FontAwesomeIcon icon={faUnlock} className="text-[9px]" /> Unblock
                                    </button>
                                  )}
                                </div>
                              </td>
                            </tr>
                          ))}
                          {filteredUsers.length === 0 && (
                            <tr><td colSpan={6} className="px-5 py-16 text-center">
                              <FontAwesomeIcon icon={faUsers} className={`text-3xl mb-3 block mx-auto ${dark ? "text-white/10" : "text-gray-200"}`} />
                              <p className={`text-sm font-bold ${txt3}`}>No users found</p>
                            </td></tr>
                          )}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          )}
        </main>

        <nav className={`md:hidden fixed bottom-0 left-0 right-0 border-t flex z-20 transition-colors ${dark ? "bg-[#0a1428] border-white/10" : "bg-white border-gray-100"}`}>
          {navItems.map(item => (
            <button key={item.key} onClick={() => setTab(item.key)}
              className={`flex-1 flex flex-col items-center gap-1 py-3 text-[10px] font-bold relative transition-colors ${tab === item.key ? "text-green-400" : txt3}`}>
              <FontAwesomeIcon icon={item.icon} className="text-lg" />
              {item.label.split(" ")[0]}
              {item.badge !== undefined && item.badge > 0 && item.badgeRed && (
                <span className="absolute top-2 right-1/4 min-w-[14px] h-3.5 bg-red-500 text-white text-[8px] font-black rounded-full flex items-center justify-center px-1">
                  {item.badge}
                </span>
              )}
            </button>
          ))}
        </nav>
      </div>

      <AnimatePresence>
        {toast && <Toast msg={toast.msg} type={toast.type} />}
      </AnimatePresence>
    </div>
  );
};

export default AdminDashboard;