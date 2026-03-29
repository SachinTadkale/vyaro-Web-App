import { useState } from "react";
import { 
  CheckCircle, 
  Store, 
  AlertTriangle,
  Bell
} from "lucide-react";

// Types
export interface Product {
  productId: string;
  productName: string;
  category: string;
  unit: string;
}

export interface Notification {
  id: number;
  icon: any;
  color: string;
  text: string;
  time: string;
}

export interface FarmerListing {
  id: string;
  farmer: string;
  location: string;
  produce: string;
  qty: string;
  price: string;
  verified: boolean;
}

// Mock Data
const MOCK_PRODUCTS: Product[] = [
  { productId: "1", productName: "Premium Wheat", category: "Grain", unit: "KG" },
  { productId: "2", productName: "Basmati Rice", category: "Grain", unit: "KG" },
  { productId: "3", productName: "Soybean Oil", category: "Liquid", unit: "Litre" },
  { productId: "4", productName: "Cotton Bales", category: "Textile", unit: "Bundle" },
];

const MOCK_NOTIFS: Notification[] = [
  {
    id: 1,
    icon: CheckCircle,
    color: "success",
    text: "Your account has been verified and approved by admin.",
    time: "2 hours ago",
  },
  {
    id: 2,
    icon: Store,
    color: "info",
    text: "New farmer listing — Organic Turmeric, Nashik.",
    time: "4 hours ago",
  },
  {
    id: 3,
    icon: AlertTriangle,
    color: "warning",
    text: "GST Certificate renewal due in 30 days.",
    time: "1 day ago",
  },
];

const MOCK_FARMERS: FarmerListing[] = [
  {
    id: "f1",
    farmer: "Ramesh Patil",
    location: "Nashik, MH",
    produce: "Organic Onion",
    qty: "500 KG",
    price: "₹18/kg",
    verified: true,
  },
  {
    id: "f2",
    farmer: "Suresh Jadhav",
    location: "Solapur, MH",
    produce: "Jowar",
    qty: "1200 KG",
    price: "₹22/kg",
    verified: true,
  },
  {
    id: "f3",
    farmer: "Anil Kumar",
    location: "Aurangabad, MH",
    produce: "Soybean",
    qty: "800 KG",
    price: "₹45/kg",
    verified: true,
  },
];

export const useCompanyDashboard = () => {
  const [products, setProducts] = useState<Product[]>(MOCK_PRODUCTS);
  const [notifications] = useState<Notification[]>(MOCK_NOTIFS);
  const [farmerListings] = useState<FarmerListing[]>(MOCK_FARMERS);

  const stats = [
    {
      label: "Total Products",
      value: products.length,
      subValue: "Active in catalog",
      icon: Store,
      color: "primary",
    },
    {
      label: "Farmer Listings",
      value: farmerListings.length,
      subValue: "Available produce",
      icon: Store,
      color: "secondary",
    },
    {
      label: "Account Status",
      value: "Verified",
      subValue: "KYC Approved",
      icon: CheckCircle,
      color: "green",
    },
    {
      label: "Notifications",
      value: notifications.length,
      subValue: "Unread alerts",
      icon: Bell,
      color: "yellow",
    },
  ];

  const addProduct = (product: Omit<Product, "productId">) => {
    setProducts([...products, { ...product, productId: Date.now().toString() }]);
  };

  const deleteProduct = (id: string) => {
    setProducts(products.filter((p) => p.productId !== id));
  };

  return {
    products,
    notifications,
    farmerListings,
    stats,
    addProduct,
    deleteProduct,
  };
};

