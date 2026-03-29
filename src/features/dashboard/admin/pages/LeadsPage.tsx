import { useEffect, useState } from "react";
import type { Lead } from "../types/lead.types";
import { getLeadsAPI, deleteLeadAPI } from "@/services/leads.api";

const LeadsPage = () => {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  // 🔥 FETCH
  const fetchLeads = async () => {
    try {
      setLoading(true);
      const data = await getLeadsAPI();
      setLeads(data);
    } catch (err) {
      console.error(err);
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
      await deleteLeadAPI(id);
      fetchLeads();
    } catch (err) {
      console.error(err);
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

      {/* LOADING */}
      {loading && (
        <div className="text-muted-foreground text-center py-10">Loading leads...</div>
      )}

      {/* EMPTY */}
      {!loading && filteredLeads.length === 0 && (
        <div className="text-muted-foreground text-center py-10">No leads found</div>
      )}

      {/* TABLE */}
      {!loading && filteredLeads.length > 0 && (
        <div className="rounded-2xl border border-border overflow-hidden bg-card">
          <table className="w-full text-sm">
            <thead className="bg-muted/50 text-muted-foreground text-xs">
              <tr>
                <th className="px-5 py-3 text-left">Name</th>
                <th className="px-5 py-3 text-left">Email</th>
                <th className="px-5 py-3 text-left">Role</th>
                <th className="px-5 py-3 text-left">Created</th>
                <th className="px-5 py-3 text-left">Action</th>
              </tr>
            </thead>

            <tbody>
              {filteredLeads.map((l) => (
                <tr
                  key={l.id}
                  className="border-t border-border hover:bg-muted/20 transition-colors"
                >
                  <td className="px-5 py-4 text-foreground font-bold">
                    {l.name || "-"}
                  </td>

                  <td className="px-5 py-4 text-muted-foreground">{l.email}</td>

                  <td className="px-5 py-4">
                    <span
                      className={`text-xs px-2 py-1 rounded-full ${
                        l.role === "FARMER"
                          ? "bg-green-500/20 text-green-400"
                          : "bg-blue-500/20 text-blue-400"
                      }`}
                    >
                      {l.role}
                    </span>
                  </td>

                  <td className="px-5 py-4 text-xs text-muted-foreground">
                    {new Date(l.createdAt).toLocaleDateString()}
                  </td>

                  <td className="px-5 py-4">
                    <button
                      onClick={() => handleDelete(l.id)}
                      className="text-red-400 text-xs font-bold"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default LeadsPage;
