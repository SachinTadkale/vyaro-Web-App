import { useEffect, useState } from "react";
import axios from "axios";
import { getLeads, deleteLead, createLead } from "@/api/leads.api";
import type { Lead } from "@/api/leads.api";
import { toast } from "sonner";

const LeadsPage = () => {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newLead, setNewLead] = useState({ name: "", email: "", role: "FARMER" as "FARMER" | "COMPANY" });
  const [creating, setCreating] = useState(false);

  // 🔥 FETCH LEADS
  const fetchLeads = async () => {
    try {
      setLoading(true);
      setError(null);

      const data = await getLeads();
      setLeads(data);
    } catch (err: unknown) {
      if (axios.isAxiosError(err)) {
        const message = err.response?.data?.message;

        // ✅ Handle empty case (NOT error)
        if (message === "No leads found") {
          setLeads([]);
          setError(null);
        } else {
          setError(message || "API Error");
        }
      } else {
        setError("Something went wrong");
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLeads();
  }, []);

  // 🔥 DELETE LEAD
  const handleDelete = async (id: string) => {
    if (!window.confirm("Are you sure you want to delete this lead?")) return;

    try {
      await deleteLead(id);

      // ✅ Optimized (no refetch)
      setLeads((prev) => prev.filter((lead) => lead.id !== id));

      toast.success("Lead deleted successfully");
    } catch {
      toast.error("Failed to delete lead");
    }
  };

  // 🔥 ADD LEAD
  const handleAddLead = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newLead.email) return toast.warning("Email is required");

    try {
      setCreating(true);
      const res = await createLead(newLead);
      const addedLead = res.data.data;
      
      // Update state without refetching
      setLeads((prev) => [addedLead, ...prev]);
      
      setIsModalOpen(false);
      setNewLead({ name: "", email: "", role: "FARMER" });
      toast.success("Lead added successfully!");
    } catch (err: unknown) {
      if (axios.isAxiosError(err)) {
        toast.error(err.response?.data?.message || "Failed to add lead");
      } else {
        toast.error("Something went wrong");
      }
    } finally {
      setCreating(false);
    }
  };

  return (
    <div className="p-6 relative">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-white">Leads Management</h1>
        <button
          onClick={() => setIsModalOpen(true)}
          className="bg-[#00DDA3] text-black px-4 py-2 rounded-lg font-semibold hover:bg-[#00c490] transition"
        >
          + Add Lead
        </button>
      </div>

      {/* 🔄 Loading */}
      {loading && <p>Loading leads...</p>}

      {/* ❌ Error */}
      {error && <p className="text-red-500">{error}</p>}

      {/* ✅ Empty State (Better UI) */}
      {!loading && !error && leads.length === 0 && (
        <div className="text-center mt-10 text-gray-400">
          <p className="text-lg font-semibold">No leads found</p>
          <p className="text-sm">
            Leads will appear here once users show interest.
          </p>
        </div>
      )}

      {/* ✅ Leads List */}
      {!loading &&
        !error &&
        leads.map((lead) => (
          <div
            key={lead.id}
            className="border p-4 rounded-lg mb-3 shadow-sm bg-white"
          >
            <p className="font-semibold">{lead.name || "No Name"}</p>
            <p className="text-sm text-gray-600">{lead.email}</p>
            <p className="text-xs text-gray-500">{lead.role}</p>

            <button
              onClick={() => handleDelete(lead.id)}
              className="mt-2 text-red-500 text-sm"
            >
              Delete
            </button>
          </div>
        ))}

      {/* ✅ Add Lead Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-[#1A1F2B] text-white p-6 rounded-lg shadow-lg w-full max-w-md">
            <h2 className="text-xl font-bold mb-4">Add New Lead</h2>
            <form onSubmit={handleAddLead} className="flex flex-col gap-4">
              <div>
                <label className="block text-sm text-gray-400 mb-1">Name (Optional)</label>
                <input
                  type="text"
                  placeholder="Enter name"
                  value={newLead.name}
                  onChange={(e) => setNewLead({ ...newLead, name: e.target.value })}
                  className="w-full bg-[#11151C] border border-gray-700 rounded p-2 focus:outline-none focus:border-[#00DDA3]"
                />
              </div>

              <div>
                <label className="block text-sm text-gray-400 mb-1">Email <span className="text-red-500">*</span></label>
                <input
                  type="email"
                  placeholder="Enter email address"
                  required
                  value={newLead.email}
                  onChange={(e) => setNewLead({ ...newLead, email: e.target.value })}
                  className="w-full bg-[#11151C] border border-gray-700 rounded p-2 focus:outline-none focus:border-[#00DDA3]"
                />
              </div>

              <div>
                <label className="block text-sm text-gray-400 mb-1">Role <span className="text-red-500">*</span></label>
                <select
                  value={newLead.role}
                  onChange={(e) => setNewLead({ ...newLead, role: e.target.value as "FARMER" | "COMPANY" })}
                  className="w-full bg-[#11151C] border border-gray-700 rounded p-2 focus:outline-none focus:border-[#00DDA3]"
                >
                  <option value="FARMER">Farmer</option>
                  <option value="COMPANY">Company</option>
                </select>
              </div>

              <div className="flex gap-3 justify-end mt-4">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 bg-gray-600 rounded-lg hover:bg-gray-700 transition"
                  disabled={creating}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={creating}
                  className="px-4 py-2 bg-[#00DDA3] text-black font-semibold rounded-lg hover:bg-[#00c490] transition disabled:opacity-50"
                >
                  {creating ? "Saving..." : "Save Lead"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default LeadsPage;