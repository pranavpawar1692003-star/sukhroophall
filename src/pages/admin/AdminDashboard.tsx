import { useState, useEffect } from "react";
import { Link, Outlet, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import { 
  Image, 
  LogOut, 
  Users, 
  Star, 
  MapPin, 
  Info,
  Utensils,
  Layout,
  Menu as MenuIcon,
  X as CloseIcon
} from "lucide-react";

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState("hero");
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
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

  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);

  if (loading) {
    return (
      <div className="min-h-screen bg-royal flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gold"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-royal text-cream">
      {/* Mobile Header Overlay */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[70] lg:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Mobile Top Bar */}
      <div className="lg:hidden flex items-center justify-between p-4 bg-royal border-b border-gold/20 sticky top-0 z-[60]">
        <div className="flex items-center gap-2">
          <MenuIcon 
            className="w-6 h-6 text-gold cursor-pointer hover:scale-110 transition-transform" 
            onClick={toggleSidebar}
          />
          <h1 className="font-display text-xl font-bold text-gold">Admin Panel</h1>
        </div>
        <div className="w-8 h-8 rounded-full bg-gold/20 flex items-center justify-center text-[10px] font-bold text-gold border border-gold/30 uppercase">
          {user?.email?.charAt(0) || "A"}
        </div>
      </div>

      <div className="flex flex-col lg:flex-row h-screen lg:overflow-hidden overflow-visible">
        {/* Sidebar */}
        <aside 
          className={`fixed lg:static inset-y-0 left-0 w-64 bg-royal border-r border-gold/20 flex flex-col z-[80] transform transition-transform duration-300 ease-in-out ${
            isSidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
          }`}
        >
          <div className="p-6 border-b border-gold/20 flex items-center justify-between">
            <div>
              <h1 className="font-display text-2xl font-bold text-gold">Admin Panel</h1>
              <p className="text-xs text-cream/60 mt-1">Sukhrup Garden Management</p>
            </div>
            <CloseIcon 
              className="lg:hidden w-6 h-6 text-cream/60 hover:text-gold cursor-pointer" 
              onClick={() => setIsSidebarOpen(false)}
            />
          </div>

          <nav className="flex-1 overflow-y-auto p-4 space-y-2 custom-scrollbar">
            {menuItems.map((item) => (
              <button
                key={item.id}
                onClick={() => {
                  setActiveTab(item.id);
                  navigate(`/admin/${item.id}`);
                  setIsSidebarOpen(false); // Close on selection on mobile
                }}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all group ${
                  activeTab === item.id
                    ? "bg-gold/20 text-gold shadow-[0_0_15px_rgba(212,175,55,0.1)]"
                    : "text-cream/70 hover:bg-white/5 hover:text-cream"
                }`}
              >
                <item.icon className={`w-5 h-5 transition-transform group-hover:scale-110 ${activeTab === item.id ? "text-gold" : "text-cream/50"}`} />
                <span className="font-medium">{item.label}</span>
              </button>
            ))}
          </nav>

          <footer className="p-4 border-t border-gold/20">
            <button
              onClick={handleLogout}
              className="w-full flex items-center gap-3 px-4 py-3 text-red-400 hover:bg-red-500/10 rounded-lg transition-all group"
            >
              <LogOut className="w-5 h-5 transition-transform group-hover:-translate-x-1" />
              <span className="font-medium">Logout</span>
            </button>
          </footer>
        </aside>

        {/* Main Content Area */}
        <main className="flex-1 overflow-y-auto bg-gradient-to-br from-royal to-royal-light/50">
          <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto">
            <header className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
              <div>
                <h2 className="font-display text-3xl sm:text-4xl font-bold text-gold tracking-tight">
                  {menuItems.find((i) => i.id === activeTab)?.label}
                </h2>
                <div className="h-1 w-12 bg-gold mt-2 rounded-full" />
              </div>
              
              <div className="hidden sm:flex items-center gap-4 bg-white/5 border border-gold/20 px-4 py-2 rounded-xl backdrop-blur-sm">
                <div className="text-right">
                  <p className="text-sm font-bold text-cream select-none">{user?.email}</p>
                  <p className="text-[10px] uppercase tracking-widest text-gold font-bold opacity-80">Administrator</p>
                </div>
                <div className="w-10 h-10 rounded-full bg-gold flex items-center justify-center text-royal font-display font-bold text-lg shadow-lg border-2 border-gold/30 uppercase">
                  {user?.email?.charAt(0) || "A"}
                </div>
              </div>
            </header>

            <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 fill-mode-both">
              <Outlet />
            </div>
          </div>
        </main>
      </div>

      <style>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(212, 175, 55, 0.2);
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: rgba(212, 175, 55, 0.4);
        }
      `}</style>
    </div>
  );
};

export default AdminDashboard;
