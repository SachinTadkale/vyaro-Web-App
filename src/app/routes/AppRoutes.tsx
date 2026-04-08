import { Routes, Route, Navigate } from "react-router-dom";
import EntryPage from "@/features/entry/entryPage";
import AuthPage from "@/features/auth/pages/AuthPage";
import AdminLogin from "@/features/auth/pages/AdminLogin";
import ProtectedRoute from "@/components/layout/ProtectedRoute";
import DashboardLayout from "@/components/layout/DashboardLayout";
import PageNotFound from "@/app/routes/NotFound";

// Admin Pages
import AdminDashboard from "@/features/dashboard/admin/pages/AdminDashboard";
import KycPage from "@/features/dashboard/admin/pages/KycPage";
import UsersPage from "@/features/dashboard/admin/pages/UsersPage";
import CompaniesPage from "@/features/dashboard/admin/pages/CompaniesPage";
import LeadsPage from "@/features/dashboard/admin/pages/LeadsPage";
import AdminSettingsPage from "@/features/auth/pages/AdminSettingsPage";
import AdminOrdersPage from "@/features/dashboard/admin/pages/AdminOrdersPage";
import AdminListingsPage from "@/features/dashboard/admin/pages/AdminListingsPage";
import AdminTransactionsPage from "@/features/dashboard/admin/pages/AdminTransactionsPage";
import AdminNotificationsPage from "@/features/dashboard/admin/pages/AdminNotificationsPage";
import AdminDisputesPage from "@/features/dashboard/admin/pages/AdminDisputesPage";
import AdminAuditLogsPage from "@/features/dashboard/admin/pages/AdminAuditLogsPage";

// Company Pages
import CompanyDashboard from "@/features/dashboard/company/pages/CompanyDashboard";
import MarketplaceProductDetail from "@/features/dashboard/company/pages/MarketplaceProductDetail";
import OrdersPage from "@/features/dashboard/company/pages/OrdersPage";
import OrderDetailPage from "@/features/dashboard/company/pages/OrderDetailPage";
import SettingsPage from "@/features/dashboard/company/pages/SettingsPage";
import PaymentsPage from "@/features/dashboard/company/pages/PaymentsPage";
import MessagesPage from "@/features/dashboard/company/pages/MessagesPage";
import OrderSuccessPage from "@/features/dashboard/company/pages/OrderSuccessPage";

const AppRoutes = () => {
  return (
    <Routes>
      {/* PUBLIC ROUTES */}
      <Route path="/" element={<EntryPage />} />
      <Route path="/login" element={<AuthPage />} />
      <Route path="/register" element={<AuthPage />} />
      <Route path="/admin/login" element={<AdminLogin />} />

      {/* DASHBOARD ROOT (Role Protected) */}
      <Route
        path="/dashboard"
        element={<ProtectedRoute allowedRoles={["ADMIN", "COMPANY"]} />}
      >
        {/* ADMIN AREA */}
        <Route path="admin" element={<DashboardLayout role="ADMIN" />}>
          <Route index element={<Navigate to="overview" replace />} />
          <Route path="overview" element={<AdminDashboard />} />
          <Route path="kyc" element={<KycPage />} />
          <Route path="users" element={<UsersPage />} />
          <Route path="companies" element={<CompaniesPage />} />
          <Route path="orders" element={<AdminOrdersPage />} />
          <Route path="listings" element={<AdminListingsPage />} />
          <Route path="transactions" element={<AdminTransactionsPage />} />
          <Route path="notifications" element={<AdminNotificationsPage />} />
          <Route path="disputes" element={<AdminDisputesPage />} />
          <Route path="logs" element={<AdminAuditLogsPage />} />
          <Route path="leads" element={<LeadsPage />} />
          <Route path="settings" element={<AdminSettingsPage />} />
        </Route>

        {/* COMPANY AREA */}
        <Route path="company" element={<DashboardLayout role="COMPANY" />}>
          <Route index element={<Navigate to="overview" replace />} />
          <Route path="order-success" element={<OrderSuccessPage />} />
          <Route path="marketplace/:id" element={<MarketplaceProductDetail />} />
          <Route path=":tab" element={<CompanyDashboard />} />
        </Route>
      </Route>

      <Route element={<ProtectedRoute allowedRoles={["COMPANY", "ADMIN"]} />}>
        <Route path="/orders" element={<DashboardLayout role="COMPANY" />}>
          <Route index element={<OrdersPage />} />
          <Route path=":id" element={<OrderDetailPage />} />
        </Route>
        <Route path="/messages" element={<DashboardLayout role="COMPANY" />}>
          <Route index element={<MessagesPage />} />
        </Route>
        <Route path="/payments" element={<DashboardLayout role="COMPANY" />}>
          <Route index element={<PaymentsPage />} />
        </Route>
        <Route path="/settings" element={<DashboardLayout role="COMPANY" />}>
          <Route index element={<SettingsPage />} />
        </Route>
      </Route>

      {/* FALLBACK */}
      <Route path="*" element={<PageNotFound />} />
    </Routes>
  );
};

export default AppRoutes;
