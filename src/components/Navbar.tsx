import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext.tsx';
import { 
  Hotel, User, LogOut, Bell, Shield, Briefcase, ChevronDown, Check, RefreshCw
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface NavbarProps {
  currentView: string;
  setView: (view: string) => void;
}

export const Navbar: React.FC<NavbarProps> = ({ currentView, setView }) => {
  const { dbUser, login, logout, notifications, fetchNotifications, token } = useAuth();
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const unreadNotifications = notifications.filter(n => !n.isRead);

  const handleMarkAsRead = async (id: number) => {
    if (!token) return;
    try {
      await fetch(`/api/user/notifications/${id}/read`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      await fetchNotifications();
    } catch (err) {
      console.error(err);
    }
  };

  const triggerRefreshNotifications = async () => {
    setIsRefreshing(true);
    await fetchNotifications();
    setTimeout(() => setIsRefreshing(false), 800);
  };

  const getRoleLabel = (roleName: string) => {
    switch (roleName) {
      case 'super_admin': return 'Super Admin';
      case 'hotel_manager': return 'Hotel Manager';
      case 'receptionist': return 'Receptionist';
      case 'accountant': return 'Accountant';
      default: return 'Guest';
    }
  };

  return (
    <header className="sticky top-0 z-50 bg-white/95 border-b border-[#d9d5ce] backdrop-blur-md shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          
          {/* Logo */}
          <div 
            onClick={() => setView('landing')} 
            className="flex items-center gap-3 cursor-pointer group"
            id="navbar-logo"
          >
            <div className="bg-gradient-to-tr from-[#c5a880] to-[#e6d5b8] p-2.5 rounded-lg text-white shadow-lg shadow-[#c5a880]/10 group-hover:scale-105 transition-transform duration-300">
              <Hotel className="h-6 w-6 stroke-[1.8]" />
            </div>
            <div>
              <span className="font-serif text-xl font-bold tracking-widest text-[#1a1a1a] block">
                SOVEREIGN
              </span>
              <span className="font-mono text-[9px] text-[#c5a059] tracking-[0.3em] block uppercase">
                Grand Hotel & Spa
              </span>
            </div>
          </div>

          {/* Nav Links */}
          <nav className="hidden md:flex items-center gap-1">
            {[
              { id: 'landing', label: 'Home' },
              { id: 'rooms', label: 'Suites' },
              { id: 'services', label: 'Services' },
              { id: 'gallery', label: 'Gallery' },
              { id: 'about', label: 'About' },
              { id: 'contact', label: 'Contact' },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setView(tab.id)}
                className={`px-4 py-2 text-sm font-medium tracking-wide rounded-md transition-all duration-300 ${
                  currentView === tab.id 
                    ? 'text-[#c5a059] bg-[#c5a059]/8 font-semibold' 
                    : 'text-gray-600 hover:text-black hover:bg-gray-50'
                }`}
                id={`nav-${tab.id}`}
              >
                {tab.label}
              </button>
            ))}
          </nav>

          {/* Actions / Auth */}
          <div className="flex items-center gap-4">
            
            {dbUser ? (
              <>
                {/* Notifications Bell */}
                <div className="relative">
                  <button
                    onClick={() => {
                      setShowNotifications(!showNotifications);
                      setShowUserMenu(false);
                    }}
                    className="p-2 text-gray-400 hover:text-[#c5a880] hover:bg-[#20242d] rounded-lg transition-colors relative"
                    id="bell-btn"
                  >
                    <Bell className="h-5 w-5" />
                    {unreadNotifications.length > 0 && (
                      <span className="absolute top-1 right-1 h-4 w-4 bg-[#c5a880] text-[#0f1115] text-[9px] font-bold rounded-full flex items-center justify-center animate-pulse">
                        {unreadNotifications.length}
                      </span>
                    )}
                  </button>

                  <AnimatePresence>
                    {showNotifications && (
                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 10 }}
                        className="absolute right-0 mt-3 w-80 bg-white border border-[#d9d5ce] rounded-xl shadow-2xl z-50 overflow-hidden"
                      >
                        <div className="p-4 border-b border-[#d9d5ce] flex justify-between items-center bg-gray-50">
                          <span className="text-xs font-semibold tracking-wider uppercase text-[#c5a059]">Notifications</span>
                          <button 
                            onClick={triggerRefreshNotifications}
                            className={`text-gray-500 hover:text-black transition-colors p-1 ${isRefreshing ? 'animate-spin' : ''}`}
                          >
                            <RefreshCw className="h-3.5 w-3.5" />
                          </button>
                        </div>
                        <div className="max-h-72 overflow-y-auto divide-y divide-[#d9d5ce]">
                          {notifications.length === 0 ? (
                            <div className="p-8 text-center text-xs text-gray-500">No notifications yet.</div>
                          ) : (
                            notifications.map((n) => (
                              <div key={n.id} className={`p-4 transition-colors ${n.isRead ? 'opacity-60 bg-transparent' : 'bg-[#c5a059]/10'}`}>
                                <div className="flex items-start justify-between gap-2">
                                  <div>
                                    <h5 className="text-xs font-semibold text-[#1a1a1a]">{n.title}</h5>
                                    <p className="text-[11px] text-gray-600 mt-1 leading-relaxed">{n.message}</p>
                                    <span className="font-mono text-[9px] text-gray-500 mt-1 block">
                                      {new Date(n.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                    </span>
                                  </div>
                                  {!n.isRead && (
                                    <button 
                                      onClick={() => handleMarkAsRead(n.id)}
                                      className="text-[#c5a059] hover:text-[#b08e4a] p-0.5 bg-[#c5a059]/10 rounded"
                                    >
                                      <Check className="h-3 w-3" />
                                    </button>
                                  )}
                                </div>
                              </div>
                            ))
                          )}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                {/* User Dropdown */}
                <div className="relative">
                  <button
                    onClick={() => {
                      setShowUserMenu(!showUserMenu);
                      setShowNotifications(false);
                    }}
                    className="flex items-center gap-2 bg-gray-50 border border-[#d9d5ce] px-3.5 py-1.5 rounded-lg hover:border-[#c5a059]/40 transition-colors"
                    id="profile-dropdown-btn"
                  >
                    <div className="h-6 w-6 rounded bg-[#c5a059]/20 flex items-center justify-center text-[#c5a059] font-bold text-xs">
                      {dbUser.name[0].toUpperCase()}
                    </div>
                    <div className="text-left hidden lg:block">
                      <span className="text-xs font-medium text-[#1a1a1a] block truncate max-w-[100px]">{dbUser.name}</span>
                      <span className="font-mono text-[9px] text-[#c5a059] tracking-wider block">
                        {getRoleLabel(dbUser.role?.name || 'customer')}
                      </span>
                    </div>
                    <ChevronDown className="h-3 w-3 text-gray-500" />
                  </button>

                  <AnimatePresence>
                    {showUserMenu && (
                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 10 }}
                        className="absolute right-0 mt-3 w-56 bg-white border border-[#d9d5ce] rounded-xl shadow-2xl z-50 overflow-hidden"
                      >
                        <div className="p-4 border-b border-[#d9d5ce] bg-[#f5f2ed]">
                          <span className="text-xs font-semibold text-[#1a1a1a] block truncate">{dbUser.name}</span>
                          <span className="text-[10px] text-gray-500 block truncate mt-0.5">{dbUser.email}</span>
                        </div>
                        <div className="p-1">
                          
                          {/* Portal View */}
                          <button
                            onClick={() => {
                              setView('portal');
                              setShowUserMenu(false);
                            }}
                            className="w-full flex items-center gap-2.5 px-3.5 py-2.5 text-xs text-gray-700 hover:text-black hover:bg-[#c5a059]/10 rounded-lg transition-colors text-left font-medium"
                          >
                            <User className="h-4 w-4 text-[#c5a059]" />
                            My Reservations
                          </button>

                          {/* Admin Dashboard (If authorized) */}
                          {['super_admin', 'hotel_manager', 'receptionist', 'accountant'].includes(dbUser.role?.name || '') && (
                            <button
                              onClick={() => {
                                setView('admin');
                                setShowUserMenu(false);
                              }}
                              className="w-full flex items-center gap-2.5 px-3.5 py-2.5 text-xs text-gray-700 hover:text-black hover:bg-[#c5a059]/10 rounded-lg transition-colors text-left font-medium"
                            >
                              <Shield className="h-4 w-4 text-[#c5a059]" />
                              Admin Platform
                            </button>
                          )}

                          <hr className="my-1 border-[#d9d5ce]" />

                          <button
                            onClick={() => {
                              logout();
                              setShowUserMenu(false);
                            }}
                            className="w-full flex items-center gap-2.5 px-3.5 py-2.5 text-xs text-red-600 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors text-left"
                          >
                            <LogOut className="h-4 w-4" />
                            Log Out
                          </button>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </>
            ) : (
              <button
                onClick={login}
                className="bg-gradient-to-r from-[#c5a880] to-[#e6d5b8] text-[#0f1115] px-5 py-2 rounded-lg text-xs font-semibold tracking-wider uppercase hover:opacity-90 active:scale-[0.98] transition-all shadow-lg shadow-[#c5a880]/10 flex items-center gap-2"
                id="login-btn"
              >
                <User className="h-3.5 w-3.5" />
                Guest Portal
              </button>
            )}

          </div>

        </div>
      </div>
    </header>
  );
};
