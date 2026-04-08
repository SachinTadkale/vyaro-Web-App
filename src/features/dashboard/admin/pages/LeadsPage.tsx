import { useEffect, useState } from "react";
import type { Lead } from "../types/lead.types";
import { getLeads, deleteLead } from "@/services/leads.api";
import { toast } from "sonner";
import LeadsTable from "../components/LeadsTable";

const LeadsPage = () => {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  // 🔥 FETCH
  const fetchLeads = async () => {
    try {
      setLoading(true);
      const data = await getLeads();
      setLeads(data);
    } catch (err) {
      console.error(err);
      toast.error("Failed to load leads from server");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLeads();
  }, []);

  // 🔥 DELETE
  const handleDelete = async (id: string) => {
    const confirmDelete = confirm("Delete this lead?");
    if (!confirmDelete) return;

    try {
      await deleteLead(id);
      toast.info("Lead successfully removed from the system");
      fetchLeads();
    } catch (err) {
      console.error(err);
      toast.error("Failed to remove lead, please try again");
    }
  };

  // 🔍 FILTER
  const filteredLeads = leads.filter(
    (l) =>
      l.email.toLowerCase().includes(search.toLowerCase()) ||
      (l.name || "").toLowerCase().includes(search.toLowerCase()),
  );

  return (
    <div className="space-y-6 pt-2">
      <div className="flex justify-start">
        <div className="relative w-full max-w-sm">
          <input
            placeholder="Search leads..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full px-4 py-2 rounded-lg bg-muted/20 border border-border/40 text-xs font-normal outline-none focus:ring-1 focus:ring-primary/20 transition-all text-foreground placeholder:text-muted-foreground/30"
          />
        </div>
      </div>

      <LeadsTable
        leads={filteredLeads}
        isLoading={loading}
        onDelete={handleDelete}
      />
    </div>
  );
};

export default LeadsPage;
