import { useLocation, useNavigate } from "react-router-dom";
import { CheckCircle, ShoppingBag, ArrowRight } from "lucide-react";
import { motion } from "framer-motion";

const OrderSuccessPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const state = location.state as {
    orderId?: string;
    productName?: string;
    qty?: string;
    totalPrice?: string;
  } | null;

  if (!state?.orderId) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center pt-20">
        <h2 className="text-xl font-bold">No order found</h2>
        <button onClick={() => navigate("/dashboard/company/marketplace")} className="mt-4 text-primary hover:underline">Return to Marketplace</button>
      </div>
    );
  }

  return (
    <div className="flex-1 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-card border border-border rounded-3xl p-8 w-full max-w-md shadow-2xl relative overflow-hidden"
      >
        <div className="absolute top-0 inset-x-0 h-1.5 bg-green-500 rounded-t-3xl" />
        
        <div className="flex flex-col items-center text-center mb-8 pt-4">
          <div className="w-20 h-20 bg-green-500/10 rounded-full flex items-center justify-center border-2 border-green-500/20 mb-4">
            <CheckCircle size={40} className="text-green-500" />
          </div>
          <h2 className="text-2xl font-black text-foreground mb-2 tracking-tight">Order Confirmed!</h2>
          <p className="text-sm text-muted-foreground">
            Your procurement request has been successfully submitted to the farmer.
          </p>
        </div>

        <div className="bg-muted/30 border border-border/50 rounded-2xl p-5 mb-8">
          <h3 className="text-[10px] font-black text-muted-foreground uppercase tracking-widest mb-3">Order Summary</h3>
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-sm font-semibold text-muted-foreground">Order ID</span>
              <span className="text-sm font-black text-foreground">{state.orderId}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm font-semibold text-muted-foreground">Product</span>
              <span className="text-sm font-black text-foreground">{state.productName}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm font-semibold text-muted-foreground">Quantity</span>
              <span className="text-sm font-black text-foreground">{state.qty}</span>
            </div>
            <div className="flex justify-between items-center border-t border-border/50 pt-3 mt-1">
              <span className="text-[11px] font-black text-primary uppercase tracking-widest">Total Value</span>
              <span className="text-lg font-black text-primary">₹{state.totalPrice}</span>
            </div>
          </div>
        </div>

        <div className="space-y-3">
          <button
            onClick={() => navigate("/orders", { state: { highlightOrderId: state.orderId } })}
            className="w-full flex items-center justify-center gap-2 bg-primary text-primary-foreground font-black rounded-xl py-3.5 text-sm hover:bg-primary/90 active:scale-[0.98] transition-all shadow-md shadow-primary/20"
          >
            <ShoppingBag size={16} />
            View Orders
          </button>
          
          <button
            onClick={() => navigate("/dashboard/company/marketplace")}
            className="w-full flex items-center justify-center gap-2 bg-transparent text-foreground font-bold rounded-xl py-3.5 text-sm hover:bg-muted active:scale-[0.98] transition-all"
          >
            Continue Shopping
            <ArrowRight size={16} />
          </button>
        </div>
      </motion.div>
    </div>
  );
};

export default OrderSuccessPage;
