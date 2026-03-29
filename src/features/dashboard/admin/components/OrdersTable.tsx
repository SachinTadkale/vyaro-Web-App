import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/common/Table";

const ordersData = [
  { id: "#ORD-8542", party: "AgroTech ↔ Ramesh Patil", amount: "₹45,200", status: "Completed", date: "10 mins ago" },
  { id: "#ORD-8541", party: "SeedCo ↔ Suresh Jadhav", amount: "₹12,800", status: "In Transit", date: "24 mins ago" },
  { id: "#ORD-8540", party: "FarmTrade ↔ Anil Kumar", amount: "₹32,500", status: "Processing", date: "1h ago" },
  { id: "#ORD-8539", party: "AgroTech ↔ Dnyaneshwar", amount: "₹88,000", status: "Completed", date: "2h ago" },
];

const failedData = [
  { id: "#TRX-1022", reason: "Payment Gateway Timeout", amount: "₹24,500", date: "32 mins ago" },
  { id: "#TRX-1021", reason: "Cancelled by Buyer", amount: "₹12,000", date: "2h ago" },
  { id: "#TRX-1020", reason: "Stock Unavailability", amount: "₹45,000", date: "5h ago" },
];

const OrdersTable = () => {
  return (
    <div className="grid lg:grid-cols-3 gap-5">
      <div className="lg:col-span-2 dashboard-card overflow-hidden">
        <div className="p-4 border-b border-border/50 bg-muted/20">
          <h3 className="text-xs font-black text-muted-foreground uppercase tracking-widest">Recent Platform Orders</h3>
        </div>
        <Table>
          <TableHeader>
            <TableRow className="bg-muted/30">
              <TableHead className="text-left font-bold py-2">Order ID</TableHead>
              <TableHead className="text-left font-bold py-2">Parties</TableHead>
              <TableHead className="text-center font-bold py-2">Amount</TableHead>
              <TableHead className="text-right font-bold py-2">Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {ordersData.map((o) => (
              <TableRow key={o.id} className="hover:bg-muted/50 transition-colors group">
                <TableCell className="font-bold py-2">{o.id}</TableCell>
                <TableCell className="py-2 text-muted-foreground">{o.party}</TableCell>
                <TableCell className="text-center font-black py-2">{o.amount}</TableCell>
                <TableCell className="text-right py-2">
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${o.status === "Completed" ? "bg-primary/20 text-primary" : "bg-muted/50 text-muted-foreground"}`}>{o.status}</span>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <div className="dashboard-card overflow-hidden">
        <div className="p-4 border-b border-border/50 bg-muted/20">
          <h3 className="text-xs font-black text-destructive uppercase tracking-widest flex items-center gap-2">Failed Transactions</h3>
        </div>
        <Table>
          <TableHeader>
            <TableRow className="bg-muted/30">
              <TableHead className="text-left font-bold py-2 text-destructive/80">Reason</TableHead>
              <TableHead className="text-right font-bold py-2 text-destructive/80">Amount</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {failedData.map((f) => (
              <TableRow key={f.id} className="hover:bg-destructive/5 transition-colors border-l-2 border-l-transparent hover:border-l-destructive">
                <TableCell className="py-2">
                  <p className="font-bold text-destructive/90">{f.reason}</p>
                  <p className="text-[10px] text-muted-foreground uppercase">{f.date}</p>
                </TableCell>
                <TableCell className="text-right font-black py-2">{f.amount}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default OrdersTable;
