import KycRow from "./KycRow";

type Props = {
  type: "farmers" | "companies";
  data: any[];
  onView: (item: any) => void;
};

const KycTable = ({ type, data, onView }: Props) => {
  const headers = type === "farmers" 
    ? ["User", "Location", "Doc Type", "Submitted", "Status", "Action"]
    : ["Company Name", "Registration No", "GST Number", "Submitted", "Status", "Action"];

  return (
    <div className="overflow-x-auto rounded-2xl border border-border/40 bg-card/30 backdrop-blur-md">
      <table className="w-full text-left border-collapse">
        <thead className="bg-muted/30">
          <tr>
            {headers.map((h) => (
              <th key={h} className="px-4 py-3 text-[10px] font-bold uppercase tracking-[0.1em] text-muted-foreground/60 border-b border-border/20">
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-border/10">
          {data.map((item) => (
            <KycRow 
              key={item.id} 
              type={type} 
              item={item} 
              onView={onView} 
            />
          ))}
        </tbody>
      </table>
      {data.length === 0 && (
        <div className="p-10 text-center text-muted-foreground/40 text-xs italic">
          No pending KYC requests found for this category.
        </div>
      )}
    </div>
  );
};

export default KycTable;
