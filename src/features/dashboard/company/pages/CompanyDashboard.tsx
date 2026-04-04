import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

type Product = {
  id: string;
  name: string;
  category: string;
  unit: string;
};

type Listing = {
  id: string;
  product: string;
  farmer: string;
  location: string;
  qty: string;
  price: string;
};

type Notice = {
  id: string;
  text: string;
  time: string;
};

const SAMPLE_PRODUCTS: Product[] = [
  { id: "1", name: "Premium Wheat", category: "Grain", unit: "kg" },
  { id: "2", name: "Basmati Rice", category: "Grain", unit: "kg" },
  { id: "3", name: "Soybean Oil", category: "Liquid", unit: "L" },
];

const SAMPLE_LISTINGS: Listing[] = [
  { id: "1", product: "Wheat", farmer: "Rahul Sharma", location: "Punjab", qty: "500 kg", price: "2,500" },
  { id: "2", product: "Cotton", farmer: "Priya Patel", location: "Gujarat", qty: "30 bales", price: "5,000" },
];

const SAMPLE_NOTICES: Notice[] = [
  { id: "1", text: "Your account has been verified.", time: "2h ago" },
  { id: "2", text: "New crop listing added.", time: "4h ago" },
  { id: "3", text: "GST renewal due soon.", time: "1d ago" },
];

const tabs = ["overview", "marketplace", "products", "notifications", "profile"] as const;
type Tab = (typeof tabs)[number];

const CompanyDashboard = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [products, setProducts] = useState<Product[]>(SAMPLE_PRODUCTS);
  const [search, setSearch] = useState("");

  const current = location.pathname.split("/").pop();
  const tab: Tab = tabs.includes(current as Tab) ? (current as Tab) : "overview";

  const goToTab = (nextTab: Tab) => navigate(`/dashboard/company/${nextTab}`);

  const filteredProducts = products.filter((product) =>
    product.name.toLowerCase().includes(search.toLowerCase()) || product.category.toLowerCase().includes(search.toLowerCase()),
  );

  const addProduct = () => {
    setProducts((prev) => [
      ...prev,
      { id: String(prev.length + 1), name: `New product ${prev.length + 1}`, category: "General", unit: "unit" },
    ]);
  };

  const deleteProduct = (id: string) => setProducts((prev) => prev.filter((product) => product.id !== id));

  return (
    <div className="space-y-8">
      <div className="flex gap-2">
        {tabs.map((item) => (
          <button
            key={item}
            onClick={() => goToTab(item)}
            className={`px-4 py-2 text-sm font-medium rounded-lg transition ${
              tab === item ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:bg-muted"
            }`}
          >
            {item.charAt(0).toUpperCase() + item.slice(1)}
          </button>
        ))}
      </div>

      {tab === "overview" && (
        <div>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {[
              { label: "Products", value: products.length },
              { label: "Listings", value: SAMPLE_LISTINGS.length },
              { label: "Verified", value: "Yes" },
              { label: "Notifications", value: SAMPLE_NOTICES.length },
            ].map((card) => (
              <div key={card.label} className="rounded-lg border border-border bg-card p-5 shadow-sm">
                <p className="text-xs font-bold uppercase tracking-wide text-muted-foreground mb-3">{card.label}</p>
                <p className="text-3xl font-bold text-foreground">{card.value}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {tab === "marketplace" && (
        <div className="space-y-4">
          <h2 className="text-xl font-bold text-foreground">Marketplace</h2>
          <div className="grid gap-4 sm:grid-cols-2">
            {SAMPLE_LISTINGS.map((listing) => (
              <div key={listing.id} className="rounded-lg border border-border bg-card p-5 shadow-sm">
                <h3 className="text-lg font-semibold text-foreground">{listing.product}</h3>
                <p className="text-sm text-muted-foreground mb-3">{listing.farmer}</p>
                <div className="space-y-2 text-sm text-foreground">
                  <p>Location: {listing.location}</p>
                  <p>Qty: {listing.qty}</p>
                  <p>Price: {listing.price}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {tab === "products" && (
        <div className="space-y-5">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <h2 className="text-xl font-bold text-foreground">My Products</h2>
            <button onClick={addProduct} className="rounded-lg bg-primary px-4 py-2 text-sm font-bold text-primary-foreground">
              Add Product
            </button>
          </div>
          <div className="rounded-lg border border-border bg-card p-4 shadow-sm">
            <div className="mb-4">
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search products..."
                className="w-full rounded-lg border border-border bg-muted px-4 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/20"
              />
            </div>
            <table className="w-full text-left text-sm">
              <thead className="border-b border-border">
                <tr>
                  <th className="px-4 py-3 font-bold text-foreground">Product</th>
                  <th className="px-4 py-3 font-bold text-foreground">Category</th>
                  <th className="px-4 py-3 font-bold text-foreground">Unit</th>
                  <th className="px-4 py-3 font-bold text-foreground">Action</th>
                </tr>
              </thead>
              <tbody>
                {filteredProducts.map((product) => (
                  <tr key={product.id} className="border-b border-border hover:bg-muted/30">
                    <td className="px-4 py-3">{product.name}</td>
                    <td className="px-4 py-3">{product.category}</td>
                    <td className="px-4 py-3">{product.unit}</td>
                    <td className="px-4 py-3">
                      <button onClick={() => deleteProduct(product.id)} className="rounded-lg bg-destructive/10 px-3 py-1 text-xs font-semibold text-destructive">
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {tab === "notifications" && (
        <div className="space-y-4">
          <h2 className="text-xl font-bold text-foreground">Notifications</h2>
          <div className="space-y-3">
            {SAMPLE_NOTICES.map((notice) => (
              <div key={notice.id} className="rounded-lg border border-border bg-card p-4 shadow-sm">
                <p className="text-xs font-medium text-muted-foreground mb-2">{notice.time}</p>
                <p className="text-sm text-foreground">{notice.text}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {tab === "profile" && (
        <div className="rounded-lg border border-border bg-card p-6 shadow-sm">
          <h2 className="text-xl font-bold text-foreground mb-4">Company Profile</h2>
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium text-foreground">Company Name</label>
              <p className="text-foreground mt-1">Your Company Ltd.</p>
            </div>
            <div>
              <label className="text-sm font-medium text-foreground">Email</label>
              <p className="text-foreground mt-1">info@yourcompany.com</p>
            </div>
            <div>
              <label className="text-sm font-medium text-foreground">Status</label>
              <p className="text-foreground mt-1">Verified</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CompanyDashboard;
