// Type definitions for Company Dashboard

export interface FarmerListing {
  id: string;
  produce: string;
  location: string;
  verified: boolean;
  details?: string;
}

export interface Notification {
  id: string;
  title: string;
  message: string;
  timestamp: string;
  read: boolean;
}

export interface Product {
  id: string;
  name: string;
  price: number;
  quantity: number;
  description?: string;
}

// Hook for company dashboard - placeholder
// This is a simplified version since APIs are removed
export const useCompanyDashboard = () => ({
  farmerListings: [] as FarmerListing[],
  notifications: [] as Notification[],
  products: [] as Product[],
});
