import { useNavigate } from "react-router-dom";

const AdminDashboard = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="mx-auto max-w-6xl space-y-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Admin Dashboard</h1>
            <p className="text-sm text-muted-foreground mt-1">Simple admin overview and quick actions.</p>
          </div>
          <button
            onClick={() => navigate("/admin/login")}
            className="rounded-2xl border border-border px-4 py-3 text-sm font-medium text-foreground hover:bg-muted transition"
          >
            Sign Out
          </button>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {[
            { label: "Users", value: "125" },
            { label: "Companies", value: "24" },
            { label: "Open Tickets", value: "8" },
            { label: "Pending Reviews", value: "3" },
          ].map((card) => (
            <div key={card.label} className="rounded-3xl border border-border bg-card p-5 shadow-sm">
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">{card.label}</p>
              <p className="mt-4 text-4xl font-bold text-foreground">{card.value}</p>
            </div>
          ))}
        </div>

        <div className="grid gap-4 lg:grid-cols-2">
          <div className="rounded-3xl border border-border bg-card p-6 shadow-sm">
            <h2 className="text-xl font-bold text-foreground mb-4">Recent Activity</h2>
            <ul className="space-y-3 text-sm text-foreground">
              <li className="rounded-2xl bg-muted p-4">New company registered today.</li>
              <li className="rounded-2xl bg-muted p-4">User support ticket assigned.</li>
              <li className="rounded-2xl bg-muted p-4">Profile verification completed.</li>
            </ul>
          </div>

          <div className="rounded-3xl border border-border bg-card p-6 shadow-sm">
            <h2 className="text-xl font-bold text-foreground mb-4">Quick Notes</h2>
            <div className="space-y-3 text-sm text-foreground">
              <p>Keep the dashboard simple and easy to use.</p>
              <p>Use the sign out button to return to admin login.</p>
              <p>Refresh the browser if you want to start over.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
