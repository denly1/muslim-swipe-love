
import { ReactNode } from "react";
import { Link, useLocation } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { useProfiles } from "@/hooks/useProfiles";
import { Heart, Search, User, Award, Bell, LogOut } from "lucide-react";

type LayoutProps = {
  children: ReactNode;
  hideNavigation?: boolean;
  title?: string;
  showBackButton?: boolean;
};

const Layout = ({ children, hideNavigation = false, title, showBackButton = false }: LayoutProps) => {
  const location = useLocation();
  const { logout, user } = useAuth();
  const { matches } = useProfiles();
  
  return (
    <div className="min-h-screen bg-gradient-to-b from-muslim-green-50 to-white dark:from-muslim-green-900 dark:to-muslim-green-800 flex flex-col">
      {/* Header */}
      <header className="bg-muslim-green-600 text-white shadow-md">
        <div className="safe-area flex items-center h-16">
          {showBackButton && (
            <Link to="/dashboard" className="mr-4">
              <button className="w-8 h-8 flex items-center justify-center rounded-full bg-muslim-green-500 hover:bg-muslim-green-400">
                ←
              </button>
            </Link>
          )}
          
          <h1 className="text-xl font-semibold flex-1 text-center">
            {title || "Halal Match"}
          </h1>
          
          {user && (
            <button
              onClick={logout}
              className="w-8 h-8 flex items-center justify-center"
              aria-label="Logout"
            >
              <LogOut size={20} />
            </button>
          )}
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 safe-area tg-page overflow-y-auto">
        {children}
      </main>

      {/* Navigation */}
      {!hideNavigation && (
        <nav className="bg-white dark:bg-muslim-green-800 shadow-lg border-t border-muslim-green-200 dark:border-muslim-green-700">
          <div className="flex justify-around items-center h-16">
            <Link to="/dashboard" className={`flex flex-col items-center justify-center w-16 h-16 ${location.pathname === '/dashboard' ? 'text-muslim-green-600 dark:text-muslim-gold-400' : 'text-gray-500 dark:text-gray-400'}`}>
              <Search size={20} />
              <span className="text-xs mt-1">Discover</span>
            </Link>
            
            <Link to="/matches" className={`flex flex-col items-center justify-center w-16 h-16 relative ${location.pathname === '/matches' ? 'text-muslim-green-600 dark:text-muslim-gold-400' : 'text-gray-500 dark:text-gray-400'}`}>
              <Heart size={20} />
              <span className="text-xs mt-1">Matches</span>
              {matches.length > 0 && (
                <span className="absolute top-2 right-3 bg-muslim-gold-500 text-muslim-green-800 text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                  {matches.length}
                </span>
              )}
            </Link>
            
            <Link to="/premium" className={`flex flex-col items-center justify-center w-16 h-16 ${location.pathname === '/premium' ? 'text-muslim-green-600 dark:text-muslim-gold-400' : 'text-gray-500 dark:text-gray-400'}`}>
              <Award size={20} />
              <span className="text-xs mt-1">Premium</span>
            </Link>
            
            <Link to="/profile" className={`flex flex-col items-center justify-center w-16 h-16 ${location.pathname === '/profile' ? 'text-muslim-green-600 dark:text-muslim-gold-400' : 'text-gray-500 dark:text-gray-400'}`}>
              <User size={20} />
              <span className="text-xs mt-1">Profile</span>
            </Link>
          </div>
        </nav>
      )}
    </div>
  );
};

export default Layout;
