import { Link } from "react-router-dom";
import type { User } from "@/types/User";
import keuzekompasLogo from "@/assets/keuzekompas.svg";
import React, { useEffect, useRef, useState } from "react";

type HeaderProps = {
  user: User | undefined;
  onLogout?: () => void;
};

const navItems = [
  { title: "Home", href: "/" },
  { title: "Modules", href: "/modules" },
];

const Header: React.FC<HeaderProps> = ({ user, onLogout }) => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const profileRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    function onOutside(e: MouseEvent) {
      if (profileRef.current && !profileRef.current.contains(e.target as Node)) {
        setProfileOpen(false);
      }
    }
    document.addEventListener("mousedown", onOutside);
    return () => document.removeEventListener("mousedown", onOutside);
  }, []);

  const initials = user ? user.firstName[0].toUpperCase() + user.lastName[0].toUpperCase() : "";

  return (
    <header className="bg-white shadow-sm">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Left: Logo */}
          <Link
            to="/"
            className="flex items-center gap-3 text-gray-900 no-underline"
            aria-label="Homepage"
          >
            {keuzekompasLogo && (
              <img src={keuzekompasLogo} alt="Keuzekompas Logo" className="h-8 w-auto" />
            )}
            <span className="font-semibold text-lg">Keuzekompas</span>
          </Link>

          {/* Center: Nav (desktop) */}
          <nav className="hidden md:flex items-center space-x-6">
            {navItems.map((item) => (
              <Link
                key={item.title}
                to={item.href}
                className="text-gray-600 hover:text-gray-900 transition-colors"
              >
                {item.title}
              </Link>
            ))}
          </nav>

          {/* Right: Auth / Mobile toggle */}
          <div className="flex items-center gap-3">
            <div className="hidden md:block">
              {user ? (
                <div className="relative" ref={profileRef}>
                  <button
                    onClick={() => setProfileOpen((s) => !s)}
                    className="flex items-center gap-2 px-3 py-1.5 rounded-full hover:bg-gray-100 focus:outline-none"
                    aria-haspopup="true"
                    aria-expanded={profileOpen}
                  >
                    <span className="w-8 h-8 rounded-full bg-indigo-600 text-white flex items-center justify-center text-sm font-medium">
                      {initials}
                    </span>
                    <span className="text-sm text-gray-800">{user?.firstName}</span>
                  </button>

                  {profileOpen && (
                    <div className="absolute right-0 mt-2 w-44 bg-white border rounded-md shadow-lg py-1 z-10">
                      <Link
                        to="/profile"
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                      >
                        Profile
                      </Link>
                      <button
                        onClick={() => {
                          setProfileOpen(false);
                          onLogout?.();
                        }}
                        className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                      >
                        Logout
                      </button>
                    </div>
                  )}
                </div>
              ) : null}
            </div>

            {/* Mobile menu button */}
            <button
              className="md:hidden inline-flex items-center justify-center p-2 rounded-md text-gray-600 hover:bg-gray-100"
              onClick={() => setMobileOpen((s) => !s)}
              aria-expanded={mobileOpen}
              aria-label="Toggle menu"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                {mobileOpen ? (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                ) : (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                )}
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile panel */}
      {mobileOpen && (
        <div className="md:hidden border-t">
          <div className="px-4 pt-4 pb-3 space-y-2">
            {navItems.map((item) => (
              <Link
                key={item.title}
                to={item.href}
                className="block px-2 py-2 text-gray-700 rounded hover:bg-gray-50"
              >
                {item.title}
              </Link>
            ))}

            {user ? (
              <div className="pt-2 border-t">
                <div className="flex items-center gap-3 px-2 py-2">
                  <div className="w-10 h-10 rounded-full bg-indigo-600 text-white flex items-center justify-center font-medium">
                    {initials}
                  </div>
                  <div>
                    <div className="text-sm font-medium text-gray-900">{user?.firstName}</div>
                    <Link to="/profile" className="text-xs text-gray-500 hover:underline">
                      View profile
                    </Link>
                  </div>
                </div>
                <div className="px-2 pb-3">
                  <button
                    onClick={() => {
                      setMobileOpen(false);
                      onLogout?.();
                    }}
                    className="w-full text-left px-3 py-2 rounded-md bg-red-50 text-red-600 text-sm"
                  >
                    Logout
                  </button>
                </div>
              </div>
            ) : null}
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;
