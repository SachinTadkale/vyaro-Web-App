import { useEffect, useState } from "react";
import type { Lead, LeadRole } from "../types/lead.types";
import { getLeadsAPI, deleteLeadAPI, createLeadAPI } from "@/api/leads.api";

const LeadsPage = () => {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  // ✅ FIXED TYPE
  const [form, setForm] = useState<{
    email: string;
    role: LeadRole;
    name: string;
  }>({
    email: "",
    role: "FARMER",
    name: "",
  });

  const [showModal, setShowModal] = useState(false);

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

  // 🔥 CREATE
  const handleCreate = async () => {
    try {
      await createLeadAPI(form);
      setShowModal(false);
      setForm({ email: "", role: "FARMER", name: "" });
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
    <div className="space-y-6">
      {/* HEADER */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-lg font-black text-white">Leads</h1>
          <p className="text-sm text-white/40">Manage all leads</p>
        </div>

        <button
          onClick={() => setShowModal(true)}
          className="bg-green-500 text-black px-4 py-2 rounded-xl text-sm font-bold"
        >
          + Add Lead
        </button>
      </div>

      {/* SEARCH */}
      <input
        placeholder="Search..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="w-full px-4 py-2 rounded-xl bg-white/5 border border-white/10 text-white"
      />

      {/* LOADING */}
      {loading && (
        <div className="text-white/40 text-center py-10">Loading leads...</div>
      )}

      {/* EMPTY */}
      {!loading && filteredLeads.length === 0 && (
        <div className="text-white/40 text-center py-10">No leads found</div>
      )}

      {/* TABLE */}
      {!loading && filteredLeads.length > 0 && (
        <div className="rounded-2xl border border-white/10 overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-white/5 text-white/50 text-xs">
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
                  className="border-t border-white/5 hover:bg-white/5"
                >
                  <td className="px-5 py-4 text-white font-bold">
                    {l.name || "-"}
                  </td>

                  <td className="px-5 py-4 text-white/70">{l.email}</td>

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

                  <td className="px-5 py-4 text-xs text-white/40">
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

      {/* MODAL */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center">
          <div className="bg-[#0a1428] p-6 rounded-2xl w-80 space-y-4">
            <h2 className="text-white font-bold">Add Lead</h2>

            <input
              placeholder="Email"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-xl text-white"
            />

            <select
              value={form.role}
              onChange={(e) =>
                setForm({
                  ...form,
                  role: e.target.value as LeadRole,
                })
              }
              className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-xl text-white"
            >
              <option value="FARMER">Farmer</option>
              <option value="COMPANY">Company</option>
            </select>

            <input
              placeholder="Name"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-xl text-white"
            />

            <div className="flex gap-2">
              <button
                onClick={handleCreate}
                className="flex-1 bg-green-500 text-black py-2 rounded-xl font-bold"
              >
                Add
              </button>

              <button
                onClick={() => setShowModal(false)}
                className="flex-1 bg-white/10 text-white py-2 rounded-xl"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default LeadsPage;
