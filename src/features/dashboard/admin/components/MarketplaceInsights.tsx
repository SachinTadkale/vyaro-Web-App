import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/common/Table";

const MarketplaceInsights = () => {
  const categories = [
    { name: "Grains & Pulses", volume: "1,240 Tons", growth: "+12.4%", value: "₹2.4 Cr" },
    { name: "Oilseeds", volume: "850 Tons", growth: "+8.2%", value: "₹1.8 Cr" },
    { name: "Spices", volume: "120 Tons", growth: "+24.1%", value: "₹95 L" },
    { name: "Vegetables", volume: "2,400 Tons", growth: "-2.4%", value: "₹1.2 Cr" },
  ];

  return (
    <div className="dashboard-card overflow-hidden">
      <div className="p-4 border-b border-border/50 bg-muted/20">
        <h3 className="text-xs font-black text-muted-foreground uppercase tracking-widest">Marketplace Volume by Category</h3>
      </div>
      <Table>
        <TableHeader>
          <TableRow className="bg-muted/30">
            <TableHead className="text-left font-bold py-2">Category</TableHead>
            <TableHead className="text-center font-bold py-2">Volume</TableHead>
            <TableHead className="text-center font-bold py-2">Growth</TableHead>
            <TableHead className="text-right font-bold py-2">Traded Value</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {categories.map((c) => (
            <TableRow key={c.name} className="hover:bg-muted/50 transition-colors">
              <TableCell className="font-bold py-2">{c.name}</TableCell>
              <TableCell className="text-center py-2">{c.volume}</TableCell>
              <TableCell className={`text-center py-2 font-bold ${c.growth.startsWith("+") ? "text-emerald-500" : "text-destructive"}`}>
                {c.growth}
              </TableCell>
              <TableCell className="text-right font-black py-2">{c.value}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default MarketplaceInsights;
