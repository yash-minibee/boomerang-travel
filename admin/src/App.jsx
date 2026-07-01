import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "./context/AuthContext";
import Layout from "./components/layout/Layout";
import LoginPage from "./pages/LoginPage";
import Dashboard from "./pages/Dashboard";
import PackagesPage from "./pages/PackagesPage";
import AddPackagePage from "./pages/AddPackagePage";
import DestinationsPage from "./pages/DestinationsPage";
import AddDestinationPage from "./pages/AddDestinationPage";
import InquiriesPage from "./pages/InquiriesPage";
import TestimonialsPage from "./pages/TestimonialsPage";
import ContentPage from "./pages/ContentPage";
import SettingsPage from "./pages/SettingsPage";
import ProfilePage from "./pages/ProfilePage";

function ProtectedRoute({ children }) {
  const { user, loading } = useAuth();
  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-stone-50">
      <div className="w-8 h-8 border-4 border-teal-600 border-t-transparent rounded-full animate-spin" />
    </div>
  );
  return user ? children : <Navigate to="/login" replace />;
}

function AppRoutes() {
  const { user } = useAuth();
  return (
    <Routes>
      <Route path="/login" element={user ? <Navigate to="/dashboard" replace /> : <LoginPage />} />
      <Route element={<ProtectedRoute><Layout /></ProtectedRoute>}>
        <Route index element={<Navigate to="/dashboard" replace />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/packages" element={<PackagesPage />} />
        <Route path="/packages/add" element={<AddPackagePage />} />
        <Route path="/packages/:id/edit" element={<AddPackagePage />} />
        <Route path="/destinations" element={<DestinationsPage />} />
        <Route path="/destinations/add" element={<AddDestinationPage />} />
        <Route path="/destinations/:id/edit" element={<AddDestinationPage />} />
        <Route path="/inquiries" element={<InquiriesPage />} />
        <Route path="/inquiries/custom" element={<InquiriesPage />} />
        <Route path="/testimonials" element={<TestimonialsPage />} />
        <Route path="/content/home" element={<ContentPage section="home" />} />
        <Route path="/content/about" element={<ContentPage section="about" />} />
        <Route path="/content/contact" element={<ContentPage section="contact" />} />
        <Route path="/settings" element={<SettingsPage />} />
        <Route path="/profile" element={<ProfilePage />} />
        <Route path="*" element={<Navigate to="/  dashboard" replace />} />
      </Route>
    </Routes>
  );
}

export default function App() {
  return (
    <BrowserRouter basename="/admin">
      <AuthProvider>
        <AppRoutes />
      </AuthProvider>
    </BrowserRouter>
  );
}
