import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import UserIndex from "./pages/user/Index";
import { AuthProvider } from "./contexts/AuthContext";
import { DataProvider } from "./contexts/DataContext";
import AdminLogin from "./pages/admin/AdminLogin";
import AdminDashboard from "./pages/admin/AdminDashboard";
import AdminHero from "./pages/admin/AdminHero";
import AdminAbout from "./pages/admin/AdminAbout";
import AdminFacilities from "./pages/admin/AdminFacilities";
import AdminServices from "./pages/admin/AdminServices";
import AdminGallery from "./pages/admin/AdminGallery";
import AdminTestimonials from "./pages/admin/AdminTestimonials";
import AdminContact from "./pages/admin/AdminContact";
import AdminBooking from "./pages/admin/AdminBooking";
import { ProtectedRoute } from "./components/ProtectedRoute";
import { AdminLoginRoute } from "./components/AdminLoginRoute";


const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <AuthProvider>
        <DataProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<UserIndex />} />


              {/* Admin Routes */}
              <Route
                path="/admin/login"
                element={
                  <AdminLoginRoute>
                    <AdminLogin />
                  </AdminLoginRoute>
                }
              />
              <Route
                path="/admin"
                element={
                  <ProtectedRoute>
                    <AdminDashboard />
                  </ProtectedRoute>
                }
              >
                <Route path="hero" element={<AdminHero />} />
                <Route path="about" element={<AdminAbout />} />
                <Route path="facilities" element={<AdminFacilities />} />
                <Route path="services" element={<AdminServices />} />
                <Route path="gallery" element={<AdminGallery />} />
                <Route path="testimonials" element={<AdminTestimonials />} />
                <Route path="contact" element={<AdminContact />} />
                <Route path="booking" element={<AdminBooking />} />
              </Route>

              {/* User Routes - Redirect all unknown to home */}
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </BrowserRouter>
        </DataProvider>
      </AuthProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
