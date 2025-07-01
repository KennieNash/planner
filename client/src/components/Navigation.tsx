import React from 'react';
import { Link, useLocation } from 'wouter';
import { Home, MessageSquare, ClipboardList, Settings, Calendar, LogOut, Search, User, UserPlus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';

const Navigation = () => {
  const [location] = useLocation();
  const { user, logout } = useAuth();

  const navItems = [
    { path: '/', icon: Home, label: 'Home', requireAuth: false },
    { path: '/services', icon: Search, label: 'Services', requireAuth: false },
    { path: '/customer-dashboard', icon: Settings, label: 'Dashboard', requireAuth: true },
    { path: '/my-requests', icon: ClipboardList, label: 'My Requests', requireAuth: true },
    { path: '/messages', icon: MessageSquare, label: 'Messages', requireAuth: true },
    { path: '/calendar', icon: Calendar, label: 'Calendar', requireAuth: true },
  ];

  const authItems = !user ? [
    { path: '/login', icon: User, label: 'Login', requireAuth: false },
    { path: '/register', icon: UserPlus, label: 'Register', requireAuth: false }
  ] : [];

  const filteredNavItems = navItems.filter(item => !item.requireAuth || user);
  const allNavItems = [...filteredNavItems, ...authItems];

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white/10 backdrop-blur-md border-t border-white/20 p-4 lg:hidden">
      <div className="flex justify-around items-center max-w-md mx-auto">
        {allNavItems.map((item) => {
          const Icon = item.icon;
          const isActive = location === item.path;
          
          return (
            <Link key={item.path} to={item.path}>
              <Button
                variant="ghost"
                size="sm"
                className={`flex flex-col items-center space-y-1 text-xs ${
                  isActive ? 'text-blue-400' : 'text-white hover:text-blue-300'
                }`}
              >
                <Icon className="w-5 h-5" />
                <span>{item.label}</span>
              </Button>
            </Link>
          );
        })}
        {user && (
          <Button
            variant="ghost"
            size="sm"
            className="flex flex-col items-center space-y-1 text-xs text-white hover:text-red-400"
            onClick={logout}
          >
            <LogOut className="w-5 h-5" />
            <span>Logout</span>
          </Button>
        )}
      </div>
    </nav>
  );
};

export default Navigation;
