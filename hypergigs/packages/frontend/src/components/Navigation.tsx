import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Button } from './ui/button';
import { ThemeToggle } from './theme-toggle';
import { 
  Menu, 
  LogOut, 
  X,
  Home,
  Users,
  Briefcase,
  Folder,
  Info,
  LayoutDashboard,
  Search
} from 'lucide-react';
import { useState } from 'react';
import { useAuthStore } from '@/stores/authStore';
import { motion, AnimatePresence } from 'framer-motion';

export default function Navigation() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { user, logout } = useAuthStore();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const isActive = (path: string) => location.pathname === path;

  const navItems = [
    { path: '/', label: 'Home', icon: Home, strokeWidth: 1 },
    { path: '/teams', label: 'Teams', icon: Users, strokeWidth: 1 },
    { path: '/jobs', label: 'Jobs', icon: Briefcase, strokeWidth: 1 },
    { path: '/freelancers', label: 'Freelancers', icon: Search, strokeWidth: 1 },
    // { path: '/projects', label: 'Projects', icon: Folder, strokeWidth: 1 },
    // { path: '/about', label: 'About', icon: Info, strokeWidth: 1 },
  ];

  return (
    <>
      {/* Desktop Top Navigation */}
      <nav className="hidden md:block fixed top-0 left-0 right-0 h-16 bg-white/95 backdrop-blur-sm border-b border-slate-200 z-50">
        <div className="container mx-auto px-4 h-full flex items-center justify-between">
          {/* Logo */}
          <Link to="/" className="text-xl font-bold tracking-tight uppercase">
            HYPERGIGS
          </Link>

          {/* Navigation Links */}
          <div className="flex items-center gap-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const active = isActive(item.path);
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                    active
                      ? 'bg-primary text-primary-foreground'
                      : 'text-slate-700 hover:bg-slate-100 hover:text-slate-900'
                  }`}
                >
                  <Icon className="w-4 h-4 flex-shrink-0" strokeWidth={1.5} />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </div>

          {/* Right Section */}
          <div className="flex items-center gap-2">
            {user ? (
              <>
                <Link
                  to="/dashboard"
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                    isActive('/dashboard')
                      ? 'bg-primary/10 text-primary'
                      : 'text-slate-700 hover:bg-slate-100'
                  }`}
                >
                  <LayoutDashboard className="w-4 h-4 flex-shrink-0" strokeWidth={1.5} />
                  <span>Dashboard</span>
                </Link>
                <Link
                  to={`/profile/${user.username}`}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                    location.pathname.includes('/profile')
                      ? 'bg-primary/10 text-primary'
                      : 'text-slate-700 hover:bg-slate-100'
                  }`}
                >
                  {user.avatar ? (
                    <img
                      src={user.avatar}
                      alt={user.firstName}
                      className="w-6 h-6 rounded-full object-cover flex-shrink-0"
                    />
                  ) : (
                    <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                      <span className="text-xs font-medium text-primary">
                        {user.firstName?.charAt(0).toUpperCase()}
                      </span>
                    </div>
                  )}
                  <span>{user.firstName}</span>
                </Link>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleLogout}
                  className="gap-2 text-sm font-medium text-slate-700 hover:bg-slate-100"
                >
                  <LogOut className="w-4 h-4 flex-shrink-0" strokeWidth={1.5} />
                  <span>Sign Out</span>
                </Button>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  className="px-4 py-2 rounded-lg text-sm font-medium text-slate-700 hover:bg-slate-100 transition-colors"
                >
                  Sign In
                </Link>
                <Link
                  to="/register"
                  className="px-4 py-2 rounded-lg text-sm font-medium bg-primary text-primary-foreground hover:bg-primary/90 transition-colors"
                >
                  Get Started
                </Link>
              </>
            )}
          </div>
        </div>
      </nav>

      {/* Mobile Menu Button */}
      <div className="md:hidden fixed top-4 left-4 z-50">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="bg-white/95 backdrop-blur-xl border border-slate-200 shadow-sm"
        >
          {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </Button>
      </div>

      {/* Mobile Sidebar Overlay */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="md:hidden fixed inset-0 bg-black/50 z-40"
              onClick={() => setMobileMenuOpen(false)}
            />

            {/* Mobile Sidebar */}
            <motion.aside
              initial={{ x: -280 }}
              animate={{ x: 0 }}
              exit={{ x: -280 }}
              transition={{ duration: 0.3, ease: 'easeInOut' }}
              className="md:hidden fixed left-0 top-0 h-screen w-[280px] bg-white border-r border-slate-200 z-50 flex flex-col"
            >
              {/* Logo */}
              <div className="p-6 border-b border-slate-200">
                <Link 
                  to="/" 
                  className="text-xl font-bold tracking-tight uppercase"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  HYPERGIGS
                </Link>
              </div>

              {/* Navigation Links */}
              <nav className="flex-1 overflow-y-auto py-6 px-3">
                <div className="space-y-1">
                  {navItems.map((item) => {
                    const Icon = item.icon;
                    const active = isActive(item.path);
                    return (
                      <Link
                        key={item.path}
                        to={item.path}
                        onClick={() => setMobileMenuOpen(false)}
                        className={`flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-all ${
                          active
                            ? 'bg-primary text-primary-foreground shadow-sm'
                            : 'text-muted-foreground hover:bg-slate-100 hover:text-foreground'
                        }`}
                      >
                        <Icon className="w-5 h-5 flex-shrink-0" />
                        <span>{item.label}</span>
                      </Link>
                    );
                  })}
                </div>
              </nav>

              {/* Bottom Section */}
              <div className="border-t border-slate-200 p-3 space-y-2">
                {user ? (
                  <>
                    <Link
                      to="/dashboard"
                      onClick={() => setMobileMenuOpen(false)}
                      className={`flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-all ${
                        isActive('/dashboard')
                          ? 'bg-primary text-primary-foreground shadow-sm'
                          : 'text-muted-foreground hover:bg-slate-100 hover:text-foreground'
                      }`}
                    >
                      <LayoutDashboard className="w-5 h-5 flex-shrink-0" />
                      <span>Dashboard</span>
                    </Link>
                    <Link
                      to={`/profile/${user.username}`}
                      onClick={() => setMobileMenuOpen(false)}
                      className={`flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-all ${
                        location.pathname.includes('/profile')
                          ? 'bg-primary text-primary-foreground shadow-sm'
                          : 'text-muted-foreground hover:bg-slate-100 hover:text-foreground'
                      }`}
                    >
                      {user.avatar ? (
                        <img 
                          src={user.avatar} 
                          alt={user.firstName}
                          className="w-8 h-8 rounded-full object-cover flex-shrink-0"
                        />
                      ) : (
                        <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                          <span className="text-sm font-medium text-primary">
                            {user.firstName?.charAt(0).toUpperCase()}
                          </span>
                        </div>
                      )}
                      <span>{user.firstName}</span>
                    </Link>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => {
                        handleLogout();
                        setMobileMenuOpen(false);
                      }}
                      className="w-full justify-start gap-3 px-4 py-3 h-auto text-sm font-medium text-muted-foreground hover:bg-slate-100 hover:text-foreground"
                    >
                      <LogOut className="w-5 h-5 flex-shrink-0" />
                      <span>Sign Out</span>
                    </Button>
                  </>
                ) : (
                  <>
                    <Link
                      to="/login"
                      onClick={() => setMobileMenuOpen(false)}
                      className="flex items-center justify-center gap-2 px-4 py-3 rounded-lg text-sm font-medium transition-colors hover:bg-slate-100"
                    >
                      Sign In
                    </Link>
                    <Link
                      to="/register"
                      onClick={() => setMobileMenuOpen(false)}
                      className="flex items-center justify-center gap-2 px-4 py-3 rounded-lg text-sm font-medium bg-primary text-primary-foreground hover:bg-primary/90 transition-colors"
                    >
                      Get Started
                    </Link>
                  </>
                )}
                <div className="flex justify-center pt-2">
                  <ThemeToggle />
                </div>
              </div>
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
