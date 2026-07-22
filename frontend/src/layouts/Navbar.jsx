import React, { useContext, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { Car, LogOut, LayoutDashboard, Shield, Menu, X, User } from 'lucide-react';

const Navbar = () => {
  const { user, logout, isAdmin } = useContext(AuthContext);
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  return (
    <nav className="bg-white/85 backdrop-blur-md sticky top-0 z-50 px-6 py-4 border-b border-zinc-100">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        {/* Brand / Logo */}
        <Link to="/" className="flex items-center space-x-2 text-zinc-900 group">
          <div className="bg-zinc-900 p-2 rounded-xl group-hover:scale-105 transition-transform duration-200 shadow-sm">
            <Car className="h-5 w-5 text-white" />
          </div>
          <span className="font-display font-bold text-xl tracking-[0.2em] text-zinc-900">
            DRIVE<span className="text-zinc-500 font-light">ELITE</span>
          </span>
        </Link>

        {/* Desktop Menu */}
        <div className="hidden md:flex items-center space-x-6">
          {user ? (
            <>
              <Link
                to="/dashboard"
                className="flex items-center space-x-1.5 text-zinc-600 hover:text-black font-medium text-xs uppercase tracking-wider transition-colors duration-200"
              >
                <LayoutDashboard className="h-3.5 w-3.5" />
                <span>Dashboard</span>
              </Link>

              {isAdmin() && (
                <Link
                  to="/admin"
                  className="flex items-center space-x-1.5 bg-zinc-100 text-zinc-700 hover:bg-zinc-200 hover:text-black px-3.5 py-2 rounded-xl font-semibold text-xs uppercase tracking-wider transition-all duration-200 border border-zinc-200"
                >
                  <Shield className="h-3.5 w-3.5" />
                  <span>Admin Panel</span>
                </Link>
              )}

              <div className="h-4 w-[1px] bg-zinc-200"></div>

              <div className="flex items-center space-x-2 bg-zinc-50 px-3 py-1.5 rounded-xl border border-zinc-200">
                <div className="bg-zinc-200 p-1 rounded-full">
                  <User className="h-3.5 w-3.5 text-zinc-500" />
                </div>
                <span className="text-xs font-semibold text-zinc-700 max-w-[120px] truncate">
                  {user.name}
                </span>
                {isAdmin() && (
                  <span className="text-[9px] uppercase font-bold tracking-wider px-1.5 py-0.5 rounded bg-zinc-200 text-zinc-600 border border-zinc-300">
                    Admin
                  </span>
                )}
              </div>

              <button
                onClick={handleLogout}
                className="flex items-center space-x-1.5 bg-zinc-50 hover:bg-zinc-100 text-zinc-600 hover:text-zinc-900 px-4 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider border border-zinc-200 transition-all duration-200 cursor-pointer"
              >
                <LogOut className="h-3.5 w-3.5" />
                <span>Logout</span>
              </button>
            </>
          ) : (
            <>
              <Link
                to="/login"
                className="text-zinc-600 hover:text-black font-bold text-xs uppercase tracking-wider transition-colors"
              >
                Login
              </Link>
              <Link
                to="/register"
                className="bg-zinc-900 hover:bg-zinc-800 text-white font-bold px-5 py-2.5 rounded-xl text-xs uppercase tracking-wider transition-all duration-200 shadow-sm"
              >
                Register
              </Link>
            </>
          )}
        </div>

        {/* Mobile Menu Button */}
        <div className="md:hidden">
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="text-zinc-600 hover:text-black p-2 rounded-lg hover:bg-zinc-100"
          >
            {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden mt-4 pt-4 border-t border-zinc-100 flex flex-col space-y-4">
          {user ? (
            <>
              <div className="px-2 py-1.5 flex items-center space-x-3 bg-zinc-50 rounded-xl border border-zinc-100">
                <div className="bg-zinc-200 p-1.5 rounded-full">
                  <User className="h-4 w-4 text-zinc-500" />
                </div>
                <div>
                  <div className="text-xs font-bold text-zinc-900">{user.name}</div>
                  <div className="text-[10px] text-zinc-500">{user.email}</div>
                </div>
                {isAdmin() && (
                  <span className="ml-auto text-[9px] uppercase font-bold tracking-wider px-1.5 py-0.5 rounded bg-zinc-200 text-zinc-600 border border-zinc-300">
                    Admin
                  </span>
                )}
              </div>

              <Link
                to="/dashboard"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center space-x-2 text-zinc-600 hover:text-black px-3 py-2 rounded-xl text-xs font-bold uppercase tracking-wider hover:bg-zinc-50"
              >
                <LayoutDashboard className="h-4 w-4" />
                <span>Dashboard</span>
              </Link>

              {isAdmin() && (
                <Link
                  to="/admin"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center space-x-2 text-zinc-700 hover:text-black px-3 py-2 rounded-xl text-xs font-bold uppercase tracking-wider bg-zinc-100 border border-zinc-200"
                >
                  <Shield className="h-4 w-4" />
                  <span>Admin Panel</span>
                </Link>
              )}

              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  handleLogout();
                }}
                className="flex items-center space-x-2 text-zinc-600 hover:text-zinc-900 px-3 py-2 rounded-xl text-xs font-bold uppercase tracking-wider hover:bg-zinc-50 text-left w-full cursor-pointer"
              >
                <LogOut className="h-4 w-4" />
                <span>Logout</span>
              </button>
            </>
          ) : (
            <div className="flex flex-col space-y-2 px-2">
              <Link
                to="/login"
                onClick={() => setMobileMenuOpen(false)}
                className="text-center text-zinc-600 hover:text-black py-2 rounded-xl text-xs font-bold uppercase tracking-wider hover:bg-zinc-50"
              >
                Login
              </Link>
              <Link
                to="/register"
                onClick={() => setMobileMenuOpen(false)}
                className="text-center bg-zinc-900 text-white py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider"
              >
                Register
              </Link>
            </div>
          )}
        </div>
      )}
    </nav>
  );
};

export default Navbar;
