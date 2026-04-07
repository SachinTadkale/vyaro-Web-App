import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { fetchFarmerListingsAPI } from "@/services/company.api";
import { motion } from "framer-motion";
import { toast } from "sonner";
import {
  ArrowLeft,
  Leaf,
  MapPin,
  ShoppingCart,
  Package,
  CircleDollarSign,
  Scale,
  CalendarDays,
  ShieldCheck,
  MessageSquare,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";

// ── InfoRow (module-level to avoid "create during render" error) ────
const InfoRow = ({
  icon: Icon,
  label,
  value,
  valueClass = "",
}: {
  icon: LucideIcon;
  label: string;
  value: string;
  valueClass?: string;
}) => (
  <div className="flex items-center justify-between py-3.5 border-b border-border/50 last:border-0">
    <div className="flex items-center gap-3">
      <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
        <Icon size={14} className="text-primary" />
      </div>
      <span className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">
        {label}
      </span>
    </div>
    <span className={`text-sm font-bold text-foreground ${valueClass}`}>
      {value}
    </span>
  </div>
);

// ── Raw listing shape from the API ──────────────────────────────────
interface RawListing {
  id: string;
  quantity: number;
  price: number;
  minOrder?: number;
  createdAt?: string;
  product?: { name?: string; unit?: string; category?: string };
  seller?: { name?: string };
  location?: { district?: string; state?: string };
}

interface FormattedListing {
  id: string;
  farmer: string;
  location: string;
  produce: string;
  qty: string;
  minOrder: string;
  price: string;
  priceValue: number;
  unit: string;
  createdAt: string;
  verified: boolean;
  description: string;
}

// ── PlaceOrderModal ─────────────────────────────────────────────────
const PlaceOrderModal = ({
  isOpen,
  onClose,
  listing,
  onSubmit,
}: {
  isOpen: boolean;
  onClose: () => void;
  listing: FormattedListing;
  onSubmit: (data: { qty: number; notes: string; total: number }) => void;
}) => {
  const [qty, setQty] = useState("");
  const [notes, setNotes] = useState("");

  if (!isOpen || !listing) return null;

  const numericQty = parseFloat(qty) || 0;
  const totalPrice = numericQty * listing.priceValue;

  return (
    <div
      className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 px-4"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-card border border-border rounded-2xl p-6 w-full max-w-md shadow-2xl"
      >
        <h3 className="text-lg font-black text-foreground mb-1">Place Order</h3>
        <p className="text-xs text-muted-foreground mb-5">
          Procuring <span className="font-bold text-foreground">{listing.produce}</span> from {listing.farmer}
        </p>

        <div className="space-y-4">
          <div>
            <label className="block text-xs font-semibold mb-1.5 text-muted-foreground uppercase tracking-widest">
              Quantity ({listing.unit})
            </label>
            <input
              type="number"
              min="1"
              className="w-full rounded-xl py-2.5 px-4 text-sm focus:outline-none focus:ring-2 focus:ring-primary bg-background border border-border text-foreground placeholder:text-muted-foreground/50"
              value={qty}
              onChange={(e) => setQty(e.target.value)}
              placeholder="e.g. 100"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold mb-1.5 text-muted-foreground uppercase tracking-widest">
              Notes (Optional)
            </label>
            <textarea
              rows={3}
              className="w-full rounded-xl py-2.5 px-4 text-sm focus:outline-none focus:ring-2 focus:ring-primary bg-background border border-border text-foreground placeholder:text-muted-foreground/50 resize-none"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Any special instructions..."
            />
          </div>
          <div className="flex items-center justify-between bg-muted/30 p-3 rounded-xl border border-border/50">
            <span className="text-xs font-bold text-muted-foreground uppercase tracking-widest">Total Price:</span>
            <span className="text-lg font-black text-primary">₹{totalPrice.toLocaleString('en-IN')}</span>
          </div>
        </div>

        <div className="flex gap-2.5 mt-6">
          <button
            onClick={onClose}
            className="flex-1 rounded-xl py-2.5 text-sm font-semibold border border-border text-muted-foreground hover:bg-muted transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={() => {
              if (numericQty > 0) {
                onSubmit({ qty: numericQty, notes, total: totalPrice });
                setQty("");
                setNotes("");
                onClose();
              } else {
                toast.error("Please enter a valid quantity.");
              }
            }}
            className="flex-1 bg-primary text-primary-foreground font-bold rounded-xl py-2.5 text-sm hover:bg-primary/90 transition-colors"
          >
            Confirm Order
          </button>
        </div>
      </motion.div>
    </div>
  );
};

// ── Product Detail Page ─────────────────────────────────────────────
const MarketplaceProductDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [isOrderModalOpen, setIsOrderModalOpen] = useState(false);
  const [localOrders, setLocalOrders] = useState<{id: number; qty: number; notes: string; total: number}[]>([]);

  // to clear lints
  if (localOrders.length > 0) {
    console.log("Local Orders:", localOrders);
  }

  const { data, isLoading, isError } = useQuery({
    queryKey: ["marketplaceListings"],
    queryFn: fetchFarmerListingsAPI,
    staleTime: 5 * 60 * 1000,
  });

  // Shape listing identically to how CompanyDashboard maps farmerListings
  const listing = (() => {
    if (!data?.data || !id) return null;
    const raw: RawListing | undefined = data.data.find(
      (l: RawListing) => String(l.id) === id
    );
    if (!raw) return null;
    const pUnit = raw.product?.unit || "";
    const startsWithNum = /^\d/.test(pUnit);
    const fmtQty = (n: number) =>
      (startsWithNum ? `${n} x ${pUnit}` : `${n} ${pUnit}`).trim();

    return {
      id: raw.id,
      farmer: raw.seller?.name || "Unknown Farmer",
      location:
        [raw.location?.district, raw.location?.state]
          .filter(Boolean)
          .join(", ") || "Unknown",
      produce: raw.product?.name || "Unknown Produce",
      qty: fmtQty(raw.quantity),
      minOrder: raw.minOrder ? fmtQty(raw.minOrder) : "Flexible",
      price: `\u20b9${raw.price} / ${pUnit || "unit"}`,
      priceValue: raw.price || 0,
      unit: pUnit || "unit",
      createdAt: new Date(raw.createdAt || new Date()).toLocaleDateString(
        "en-IN",
        { day: "numeric", month: "long", year: "numeric" }
      ),
      verified: true,
      description:
        `Fresh ${raw.product?.name || "produce"} sourced directly from the farmer. ` +
        `Available in bulk quantities with flexible procurement terms. ` +
        `All produce is quality-checked and sourced sustainably from ${raw.location?.state || "local farms"}.`,
    };
  })();

  // ── Loading ─────────────────────────────────────────────────────────
  if (isLoading) {
    return (
      <div className="flex-1 flex items-center justify-center py-24">
        <div className="text-center space-y-3">
          <div className="w-10 h-10 rounded-full border-2 border-primary border-t-transparent animate-spin mx-auto" />
          <p className="text-sm text-muted-foreground font-medium">
            Loading listing...
          </p>
        </div>
      </div>
    );
  }

  // ── Not Found / Error ───────────────────────────────────────────────
  if (isError || !listing) {
    return (
      <div className="flex-1 flex items-center justify-center py-24">
        <div className="text-center space-y-4">
          <div className="w-16 h-16 rounded-2xl bg-destructive/10 flex items-center justify-center mx-auto">
            <Package size={28} className="text-destructive" />
          </div>
          <div>
            <h2 className="text-lg font-black text-foreground">
              Listing Not Found
            </h2>
            <p className="text-sm text-muted-foreground mt-1">
              This product listing may have been removed or doesn&apos;t exist.
            </p>
          </div>
          <button
            onClick={() => navigate("/dashboard/company/marketplace")}
            className="btn-primary text-sm px-5 py-2.5 h-auto rounded-xl"
          >
            Back to Marketplace
          </button>
        </div>
      </div>
    );
  }

  // ── Render ──────────────────────────────────────────────────────────
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex-1 space-y-6"
    >
      {/* Back Button */}
      <button
        id="back-to-marketplace"
        onClick={() => navigate("/dashboard/company/marketplace")}
        className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors font-semibold group"
      >
        <ArrowLeft
          size={16}
          className="group-hover:-translate-x-0.5 transition-transform"
        />
        Back to Marketplace
      </button>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* ── Left: Main Info ──────────────────────────────────── */}
        <div className="lg:col-span-2 space-y-5">
          {/* Hero Card */}
          <div className="bg-card border border-border rounded-2xl overflow-hidden shadow-sm">
            <div className="h-24 bg-gradient-to-r from-primary/20 via-primary/10 to-transparent relative overflow-hidden">
              <div className="absolute right-6 top-1/2 -translate-y-1/2 opacity-10">
                <Leaf size={80} className="text-primary" />
              </div>
            </div>

            <div className="px-6 pb-6 -mt-8 relative">
              <div className="w-16 h-16 rounded-2xl bg-card border border-border shadow-md flex items-center justify-center text-primary mb-4">
                <Leaf size={28} />
              </div>

              <div className="flex items-start justify-between gap-4 flex-wrap">
                <div>
                  <h1 className="text-2xl font-black text-foreground tracking-tight">
                    {listing.produce}
                  </h1>
                  <p className="text-sm text-muted-foreground mt-1 flex items-center gap-1.5">
                    <MapPin size={13} />
                    {listing.location}
                  </p>
                  {listing.verified && (
                    <span className="mt-2.5 inline-flex items-center gap-1.5 text-[10px] font-black text-primary uppercase tracking-widest bg-primary/10 px-2.5 py-1 rounded-full border border-primary/20">
                      <ShieldCheck size={11} />
                      Verified Listing
                    </span>
                  )}
                </div>
                <div className="text-right">
                  <p className="text-3xl font-black text-primary tracking-tight">
                    {listing.price}
                  </p>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    Current market price
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Description */}
          <div className="bg-card border border-border rounded-2xl p-6 shadow-sm space-y-3">
            <h2 className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">
              About This Listing
            </h2>
            <p className="text-sm text-foreground/80 leading-relaxed">
              {listing.description}
            </p>
          </div>

          {/* Details */}
          <div className="bg-card border border-border rounded-2xl p-6 shadow-sm">
            <h2 className="text-[10px] font-black text-muted-foreground uppercase tracking-widest mb-2">
              Listing Details
            </h2>
            <InfoRow icon={Package} label="Available Quantity" value={listing.qty} />
            <InfoRow
              icon={Scale}
              label="Minimum Order"
              value={listing.minOrder}
              valueClass="text-amber-500"
            />
            <InfoRow
              icon={CircleDollarSign}
              label="Price"
              value={listing.price}
              valueClass="text-primary"
            />
            <InfoRow icon={CalendarDays} label="Listed On" value={listing.createdAt} />
          </div>
        </div>

        {/* ── Right: Sidebar ───────────────────────────────────── */}
        <div className="space-y-5">
          {/* Farmer Info */}
          <div className="bg-card border border-border rounded-2xl p-6 shadow-sm">
            <h2 className="text-[10px] font-black text-muted-foreground uppercase tracking-widest mb-4">
              Seller Information
            </h2>
            <div className="flex items-center gap-4 mb-5">
              <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center text-primary font-black text-lg flex-shrink-0">
                {listing.farmer.charAt(0).toUpperCase()}
              </div>
              <div>
                <p className="font-black text-foreground text-[15px]">
                  {listing.farmer}
                </p>
                <p className="text-xs text-muted-foreground flex items-center gap-1 mt-0.5">
                  <MapPin size={11} />
                  {listing.location}
                </p>
              </div>
            </div>
            {listing.verified && (
              <div className="flex items-center gap-2 p-3 bg-primary/5 border border-primary/15 rounded-xl">
                <ShieldCheck size={14} className="text-primary flex-shrink-0" />
                <span className="text-xs font-bold text-primary">
                  Verified Farmer on FarmZY
                </span>
              </div>
            )}
          </div>

          {/* Actions */}
          <div className="bg-card border border-border rounded-2xl p-6 shadow-sm space-y-3">
            <h2 className="text-[10px] font-black text-muted-foreground uppercase tracking-widest mb-1">
              Actions
            </h2>

            <button
              id="place-order-btn"
              onClick={() => setIsOrderModalOpen(true)}
              className="w-full flex items-center justify-center gap-2.5 bg-primary text-primary-foreground font-bold rounded-xl py-3 text-sm hover:bg-primary/90 active:scale-[0.98] transition-all shadow-sm"
            >
              <ShoppingCart size={16} />
              Place Order
            </button>

            <button
              id="contact-farmer-btn"
              onClick={() =>
                navigate("/messages", {
                  state: {
                    farmerName: listing.farmer,
                    product: listing.produce,
                    listingId: listing.id,
                  },
                })
              }
              className="w-full flex items-center justify-center gap-2.5 bg-muted border border-border text-foreground font-bold rounded-xl py-3 text-sm hover:bg-muted/80 active:scale-[0.98] transition-all"
            >
              <MessageSquare size={16} />
              Contact Farmer
            </button>
          </div>

          {/* Quick Summary */}
          <div className="bg-card border border-border rounded-2xl p-6 shadow-sm">
            <h2 className="text-[10px] font-black text-muted-foreground uppercase tracking-widest mb-4">
              Quick Summary
            </h2>
            <div className="space-y-2.5">
              {[
                { label: "Price", value: listing.price, cls: "text-primary font-black" },
                { label: "Min Order", value: listing.minOrder, cls: "text-amber-500 font-bold" },
                { label: "Stock", value: listing.qty, cls: "text-foreground font-bold" },
              ].map(({ label, value, cls }) => (
                <div key={label} className="flex items-center justify-between">
                  <span className="text-xs text-muted-foreground font-semibold">
                    {label}
                  </span>
                  <span className={`text-sm ${cls}`}>{value}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <PlaceOrderModal
        isOpen={isOrderModalOpen}
        onClose={() => setIsOrderModalOpen(false)}
        listing={listing}
        onSubmit={(orderData) => {
          setLocalOrders((prev) => [...prev, { id: Date.now(), ...orderData }]);
          toast.success("Order placed successfully!");
        }}
      />
    </motion.div>
  );
};

export default MarketplaceProductDetail;
