import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useQuery } from "@tanstack/react-query";
import { getNotifications } from "../services/notifications";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  UserCircleIcon,
  Cog6ToothIcon,
  ArrowRightOnRectangleIcon,
  SunIcon,
  MoonIcon,
} from "@heroicons/react/24/outline";
import { useTheme } from "../context/ThemeContext";

function Navbar() {
  const { user, logout, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const { isDarkMode, toggleDarkMode } = useTheme();

  const { data: notificationsData } = useQuery({
    queryKey: ["notifications"],
    queryFn: getNotifications,
    enabled: isAuthenticated,
  });

  const unreadCount = notificationsData?.notifications?.filter(
    (n) => !n.read
  ).length;

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Close menus when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (!event.target.closest(".user-menu-container")) {
        setIsUserMenuOpen(false);
      }
      if (!event.target.closest(".mobile-menu-container")) {
        setIsMenuOpen(false);
      }
    };
    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, []);

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  }, [isDarkMode]);

  const handleLogout = async () => {
    try {
      await logout();
      navigate("/login");
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  const toggleMobileMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const toggleUserMenu = () => {
    setIsUserMenuOpen(!isUserMenuOpen);
  };

  const isActiveRoute = (path) => {
    return location.pathname === path;
  };

  const navLinkClass = (path) => {
    const baseClass =
      "relative inline-flex items-center px-3 py-2 text-sm font-medium transition-all duration-200 ease-in-out transform hover:scale-105";
    const activeClass = "text-primary-600 border-b-2 border-primary-600";
    const inactiveClass =
      "text-gray-500 hover:text-gray-700 hover:border-gray-300 border-b-2 border-transparent";

    return `${baseClass} ${isActiveRoute(path) ? activeClass : inactiveClass}`;
  };

  if (!isAuthenticated) return null;

  return (
    <nav
      className={`bg-white dark:bg-gray-800 shadow-sm sticky top-0 z-50 transition-all duration-300 ${
        isScrolled ? "shadow-md backdrop-blur-sm bg-white/95" : ""
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          {/* Logo and Desktop Navigation */}
          <div className="flex">
            <div className="flex-shrink-0 flex items-center">
              <Link
                to="/"
                className="text-xl font-bold text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-500 transition-colors duration-200 flex items-center space-x-2 group"
              >
                <div className="w-8 h-8 bg-gradient-to-br from-primary-500 to-primary-700 rounded-lg flex items-center justify-center text-white font-bold text-sm group-hover:scale-110 transition-transform duration-200">
                  TF
                </div>
                <span className="bg-gradient-to-r from-primary-600 to-primary-700 bg-clip-text text-transparent">
                  Taskflow
                </span>
              </Link>
            </div>

            {/* Desktop Navigation Links */}
            <div className="hidden md:ml-8 md:flex md:space-x-1">
              <Link to="/" className={navLinkClass("/")}>
                <svg
                  className="w-4 h-4 mr-2"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2H5a2 2 0 00-2-2z"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M8 5a2 2 0 012-2h4a2 2 0 012 2v4H8V5z"
                  />
                </svg>
                Dashboard
              </Link>
              <Link to="/tasks" className={navLinkClass("/tasks")}>
                <svg
                  className="w-4 h-4 mr-2"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4"
                  />
                </svg>
                Tasks
              </Link>
              <Link to="/tags" className={navLinkClass("/tags")}>
                <svg
                  className="w-4 h-4 mr-2"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z"
                  />
                </svg>
                Tags
              </Link>
            </div>
          </div>

          {/* Desktop Right Side */}
          <div className="hidden md:flex md:items-center md:space-x-4">
            {/* Notifications */}
            <Link
              to="/notifications"
              className="relative p-2 rounded-full text-gray-400 dark:text-gray-400 hover:text-gray-500 dark:hover:text-gray-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 transition-all duration-200 hover:bg-gray-50 group"
            >
              <span className="sr-only">View notifications</span>
              <svg
                className="h-6 w-6 group-hover:scale-110 transition-transform duration-200"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
                />
              </svg>
              {unreadCount > 0 && (
                <span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-4.5 w-5 bg-red-500 text-xs text-white items-center justify-center">
                    {unreadCount > 9 ? "9+" : unreadCount}
                  </span>
                </span>
              )}
            </Link>

            {/* User Menu */}
            <div className="relative user-menu-container">
              <button
                type="button"
                onClick={toggleUserMenu}
                className="bg-white dark:bg-gray-700 rounded-full flex text-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 transition-all duration-200 hover:scale-105 hover:shadow-md"
                id="user-menu-button"
                aria-expanded={isUserMenuOpen}
                aria-haspopup="true"
              >
                <span className="sr-only">Open user menu</span>
                <div className="h-8 w-8 rounded-full bg-gradient-to-r from-primary-600 to-primary-700 flex items-center justify-center text-white font-medium">
                  {user?.name ? user.name.charAt(0).toUpperCase() : "U"}
                </div>
              </button>

              {/* User Menu Dropdown */}
              {isUserMenuOpen && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="absolute right-0 mt-2 w-48 rounded-md shadow-lg bg-white dark:bg-gray-700 ring-1 ring-black ring-opacity-5 focus:outline-none animate-fade-in"
                  role="menu"
                  aria-orientation="vertical"
                  aria-labelledby="user-menu-button"
                  tabIndex="-1"
                >
                  <div className="py-1" role="none">
                    <Link
                      to="/profile"
                      className="flex items-center px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-600"
                      role="menuitem"
                      tabIndex="-1"
                      onClick={() => setIsUserMenuOpen(false)}
                    >
                      <UserCircleIcon className="h-5 w-5 mr-2" />
                      Profile
                    </Link>
                    <Link
                      to="/settings"
                      className="flex items-center px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-600"
                      role="menuitem"
                      tabIndex="-1"
                      onClick={() => setIsUserMenuOpen(false)}
                    >
                      <Cog6ToothIcon className="h-5 w-5 mr-2" />
                      Settings
                    </Link>
                    <button
                      onClick={toggleDarkMode}
                      className="flex items-center w-full px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-600"
                    >
                      {isDarkMode ? (
                        <>
                          <SunIcon className="h-5 w-5 mr-2" />
                          Light Mode
                        </>
                      ) : (
                        <>
                          <MoonIcon className="h-5 w-5 mr-2" />
                          Dark Mode
                        </>
                      )}
                    </button>
                    <button
                      onClick={handleLogout}
                      className="flex items-center w-full px-4 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-gray-100 dark:hover:bg-gray-600"
                    >
                      <ArrowRightOnRectangleIcon className="h-5 w-5 mr-2" />
                      Logout
                    </button>
                  </div>
                </motion.div>
              )}
            </div>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center mobile-menu-container">
            <button
              onClick={toggleMobileMenu}
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-primary-500 transition-all duration-200"
              aria-expanded="false"
            >
              <span className="sr-only">Open main menu</span>
              <svg
                className={`h-6 w-6 transform transition-transform duration-300 ${
                  isMenuOpen ? "rotate-90" : ""
                }`}
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d={
                    isMenuOpen
                      ? "M6 18L18 6M6 6l12 12"
                      : "M4 6h16M4 12h16M4 18h16"
                  }
                />
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      <div
        className={`md:hidden transform transition-all duration-300 ease-in-out ${
          isMenuOpen
            ? "max-h-96 opacity-100"
            : "max-h-0 opacity-0 overflow-hidden"
        }`}
      >
        <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 bg-gray-50 border-t border-gray-200">
          <Link
            to="/"
            className={`flex items-center px-3 py-2 rounded-md text-base font-medium transition-all duration-200 ${
              isActiveRoute("/")
                ? "text-primary-600 bg-primary-50 border-l-4 border-primary-600"
                : "text-gray-600 hover:text-gray-900 hover:bg-white"
            }`}
            onClick={() => setIsMenuOpen(false)}
          >
            <svg
              className="w-5 h-5 mr-3"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2H5a2 2 0 00-2-2z"
              />
            </svg>
            Dashboard
          </Link>
          <Link
            to="/tasks"
            className={`flex items-center px-3 py-2 rounded-md text-base font-medium transition-all duration-200 ${
              isActiveRoute("/tasks")
                ? "text-primary-600 bg-primary-50 border-l-4 border-primary-600"
                : "text-gray-600 hover:text-gray-900 hover:bg-white"
            }`}
            onClick={() => setIsMenuOpen(false)}
          >
            <svg
              className="w-5 h-5 mr-3"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4"
              />
            </svg>
            Tasks
          </Link>
          <Link
            to="/tags"
            className={`flex items-center px-3 py-2 rounded-md text-base font-medium transition-all duration-200 ${
              isActiveRoute("/tags")
                ? "text-primary-600 bg-primary-50 border-l-4 border-primary-600"
                : "text-gray-600 hover:text-gray-900 hover:bg-white"
            }`}
            onClick={() => setIsMenuOpen(false)}
          >
            <svg
              className="w-5 h-5 mr-3"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z"
              />
            </svg>
            Tags
          </Link>
          <Link
            to="/notifications"
            className="flex items-center px-3 py-2 rounded-md text-base font-medium text-gray-600 hover:text-gray-900 hover:bg-white transition-all duration-200 relative"
            onClick={() => setIsMenuOpen(false)}
          >
            <svg
              className="w-5 h-5 mr-3"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
              />
            </svg>
            Notifications
            {unreadCount > 0 && (
              <span className="ml-auto bg-red-500 text-white text-xs rounded-full px-2 py-1">
                {unreadCount > 9 ? "9+" : unreadCount}
              </span>
            )}
          </Link>

          {/* Mobile User Section */}
          <div className="border-t border-gray-200 pt-3 mt-3">
            <div className="flex items-center px-3 py-2">
              <div className="h-10 w-10 rounded-full bg-gradient-to-br from-primary-500 to-primary-700 flex items-center justify-center text-white font-semibold">
                {user?.name ? user.name.charAt(0).toUpperCase() : "U"}
              </div>
              <div className="ml-3">
                <div className="text-base font-medium text-gray-800">
                  {user?.name || "User"}
                </div>
                <div className="text-sm text-gray-500">{user?.email}</div>
              </div>
            </div>
            <Link
              to="/profile"
              className="flex items-center px-3 py-2 rounded-md text-base font-medium text-gray-600 hover:text-gray-900 hover:bg-white transition-all duration-200"
              onClick={() => setIsMenuOpen(false)}
            >
              <svg
                className="w-5 h-5 mr-3"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                />
              </svg>
              Profile
            </Link>
            <Link
              to="/settings"
              className="flex items-center px-3 py-2 rounded-md text-base font-medium text-gray-600 hover:text-gray-900 hover:bg-white transition-all duration-200"
              onClick={() => setIsMenuOpen(false)}
            >
              <svg
                className="w-5 h-5 mr-3"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
                />
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                />
              </svg>
              Settings
            </Link>
            <button
              onClick={() => {
                handleLogout();
                setIsMenuOpen(false);
              }}
              className="flex items-center w-full px-3 py-2 rounded-md text-base font-medium text-red-600 hover:text-red-700 hover:bg-red-50 transition-all duration-200"
            >
              <svg
                className="w-5 h-5 mr-3"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                />
              </svg>
              Logout
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
