import { useState, useEffect } from "react";
import { Link, Outlet, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import { 
  Image, 
  LogOut, 
  Users, 
  Star, 
  MapPin, 
  Calendar,
  Info,
  Utensils,
  Layout
} from "lucide-react";

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState("hero");
  const { user, loading, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const menuItems = [
    { id: "hero", label: "Hero Slides", icon: Layout },
    { id: "about", label: "About Section", icon: Info },
    { id: "facilities", label: "Facilities", icon: Utensils },
    { id: "services", label: "Services", icon: Star },
    { id: "gallery", label: "Gallery", icon: Image },
    { id: "testimonials", label: "Testimonials", icon: Users },
    { id: "contact", label: "Contact Info", icon: MapPin },
    { id: "booking", label: "Booking Banner", icon: Calendar },
  ];

  useEffect(() => {
    if (!loading && !user && location.pathname.startsWith("/admin")) {
      navigate("/admin/login");
    }
    
    // Set active tab based on URL path
    const pathParts = location.pathname.split("/");
    const lastPart = pathParts[pathParts.length - 1];
    if (menuItems.some(i => i.id === lastPart)) {
      setActiveTab(lastPart);
    }
  }, [user, loading, location.pathname, navigate]);

  const handleLogout = async () => {
    await logout();
    navigate("/admin/login");
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-royal flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gold"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-royal/95 text-cream">
      <div className="flex h-screen overflow-hidden">
        {/* Sidebar */}
        <div className="w-64 bg-royal border-r border-gold/20 flex flex-col">
          <div className="p-6 border-b border-gold/20">
            <h1 className="font-display text-2xl font-bold text-gold">Admin Panel</h1>
            <p className="text-xs text-cream/60 mt-1">Sukhrup Garden Management</p>
          </div>

          <nav className="flex-1 overflow-y-auto p-4 space-y-2">
            {menuItems.map((item) => (
              <button
                key={item.id}
                onClick={() => {
                  setActiveTab(item.id);
                  navigate(`/admin/${item.id}`);
                }}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
                  activeTab === item.id
                    ? "bg-gold/20 text-gold"
                    : "text-cream/70 hover:bg-white/5 hover:text-cream"
                }`}
              >
                <item.icon className="w-5 h-5" />
                <span className="font-medium">{item.label}</span>
              </button>
            ))}
          </nav>

          <div className="p-4 border-t border-gold/20">
            <button
              onClick={handleLogout}
              className="w-full flex items-center gap-3 px-4 py-3 text-red-400 hover:bg-red-500/10 rounded-lg transition-all"
            >
              <LogOut className="w-5 h-5" />
              <span className="font-medium">Logout</span>
            </button>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 overflow-y-auto">
          <div className="p-6">
            <div className="flex justify-between items-center mb-8">
              <h2 className="font-display text-3xl font-bold text-gold">
                {menuItems.find((i) => i.id === activeTab)?.label}
              </h2>
              <div className="flex items-center gap-3">
                <div className="text-right">
                  <p className="text-sm font-medium text-cream">{user?.email}</p>
                  <p className="text-xs text-cream/60">Administrator</p>
                </div>
              </div>
            </div>

            <Outlet />
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
