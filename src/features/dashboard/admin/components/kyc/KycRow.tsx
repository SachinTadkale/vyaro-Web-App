import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye } from "@fortawesome/free-solid-svg-icons";
import StatusPill from "./StatusPill";

type Props = {
  type: "farmers" | "companies";
  item: any;
  onView: (item: any) => void;
};

const KycRow = ({ type, item, onView }: Props) => {
  return (
    <tr className="hover:bg-white/[0.02] transition-colors group">
      {type === "farmers" ? (
        <>
          <td className="px-4 py-3">
            <div className="flex flex-col">
              <span className="text-xs  text-foreground">{item.name}</span>
              <span className="text-[10px] text-muted-foreground/60">{item.email}</span>
            </div>
          </td>
          <td className="px-4 py-3 text-xs text-muted-foreground">
            <div className="flex flex-col">
              <span>{item.district}, {item.state?.slice(0, 2).toUpperCase()}</span>
              <span className="text-[10px] opacity-40">{item.village}</span>
            </div>
          </td>
          <td className="px-4 py-3">
            <span className="px-1.5 py-0.5 rounded bg-blue-500/10 text-blue-400 text-[10px]  border border-blue-500/20 uppercase tracking-tighter">
              {item.docType}
            </span>
          </td>
        </>
      ) : (
        <>
          <td className="px-4 py-3">
            <div className="flex flex-col">
              <span className="text-xs  text-foreground">{item.companyName}</span>
              <span className="text-[10px] text-muted-foreground/60">{item.email}</span>
            </div>
          </td>
          <td className="px-4 py-3 text-xs text-muted-foreground font-mono opacity-80">{item.regNumber}</td>
          <td className="px-4 py-3 text-xs text-muted-foreground font-mono opacity-80">{item.gstNumber}</td>
        </>
      )}
      <td className="px-4 py-3 text-[10px] text-muted-foreground/60 font-medium italic">{item.submittedAt}</td>
      <td className="px-4 py-3">
        <StatusPill status={item.status} />
      </td>
      <td className="px-4 py-3">
        <button
          onClick={() => onView(item)}
          className="w-8 h-8 rounded-lg bg-primary/10 text-primary flex items-center justify-center hover:bg-primary hover:text-primary-foreground transition-all border border-primary/20 group/btn"
          title="View Details"
        >
          <FontAwesomeIcon icon={faEye} className="text-[10px] group-hover/btn:scale-110 transition-transform" />
        </button>
      </td>
    </tr>
  );
};

export default KycRow;
