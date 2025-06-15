import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  SunIcon,
  MoonIcon,
  BellIcon,
  GlobeAltIcon,
} from "@heroicons/react/24/outline";
import { useTheme } from "../context/ThemeContext";

const Settings = () => {
  const { isDarkMode, toggleDarkMode } = useTheme();
  const [notifications, setNotifications] = useState({
    email: true,
    push: true,
    taskReminders: true,
  });

  const handleNotificationChange = (type) => {
    setNotifications((prev) => ({
      ...prev,
      [type]: !prev[type],
    }));
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white dark:bg-gray-800 shadow rounded-lg"
        >
          <div className="px-4 py-5 sm:p-6">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
              Settings
            </h2>

            {/* Theme Settings */}
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-medium text-gray-900 dark:text-white flex items-center">
                  <SunIcon className="h-5 w-5 mr-2" />
                  Appearance
                </h3>
                <div className="mt-4">
                  <button
                    onClick={toggleDarkMode}
                    className="flex items-center justify-between w-full px-4 py-3 bg-gray-50 dark:bg-gray-700 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors"
                  >
                    <span className="text-gray-700 dark:text-gray-200">
                      Dark Mode
                    </span>
                    <div
                      className={`relative inline-flex h-6 w-11 items-center rounded-full ${
                        isDarkMode ? "bg-indigo-600" : "bg-gray-200"
                      }`}
                    >
                      <span
                        className={`inline-block h-4 w-4 transform rounded-full bg-white transition ${
                          isDarkMode ? "translate-x-6" : "translate-x-1"
                        }`}
                      />
                    </div>
                  </button>
                </div>
              </div>

              {/* Notification Settings */}
              <div>
                <h3 className="text-lg font-medium text-gray-900 dark:text-white flex items-center">
                  <BellIcon className="h-5 w-5 mr-2" />
                  Notifications
                </h3>
                <div className="mt-4 space-y-3">
                  <button
                    onClick={() => handleNotificationChange("email")}
                    className="flex items-center justify-between w-full px-4 py-3 bg-gray-50 dark:bg-gray-700 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors"
                  >
                    <span className="text-gray-700 dark:text-gray-200">
                      Email Notifications
                    </span>
                    <div
                      className={`relative inline-flex h-6 w-11 items-center rounded-full ${
                        notifications.email ? "bg-indigo-600" : "bg-gray-200"
                      }`}
                    >
                      <span
                        className={`inline-block h-4 w-4 transform rounded-full bg-white transition ${
                          notifications.email
                            ? "translate-x-6"
                            : "translate-x-1"
                        }`}
                      />
                    </div>
                  </button>

                  <button
                    onClick={() => handleNotificationChange("push")}
                    className="flex items-center justify-between w-full px-4 py-3 bg-gray-50 dark:bg-gray-700 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors"
                  >
                    <span className="text-gray-700 dark:text-gray-200">
                      Push Notifications
                    </span>
                    <div
                      className={`relative inline-flex h-6 w-11 items-center rounded-full ${
                        notifications.push ? "bg-indigo-600" : "bg-gray-200"
                      }`}
                    >
                      <span
                        className={`inline-block h-4 w-4 transform rounded-full bg-white transition ${
                          notifications.push ? "translate-x-6" : "translate-x-1"
                        }`}
                      />
                    </div>
                  </button>

                  <button
                    onClick={() => handleNotificationChange("taskReminders")}
                    className="flex items-center justify-between w-full px-4 py-3 bg-gray-50 dark:bg-gray-700 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors"
                  >
                    <span className="text-gray-700 dark:text-gray-200">
                      Task Reminders
                    </span>
                    <div
                      className={`relative inline-flex h-6 w-11 items-center rounded-full ${
                        notifications.taskReminders
                          ? "bg-indigo-600"
                          : "bg-gray-200"
                      }`}
                    >
                      <span
                        className={`inline-block h-4 w-4 transform rounded-full bg-white transition ${
                          notifications.taskReminders
                            ? "translate-x-6"
                            : "translate-x-1"
                        }`}
                      />
                    </div>
                  </button>
                </div>
              </div>

              {/* Language Settings */}
              <div>
                <h3 className="text-lg font-medium text-gray-900 dark:text-white flex items-center">
                  <GlobeAltIcon className="h-5 w-5 mr-2" />
                  Language
                </h3>
                <div className="mt-4">
                  <select className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-700 rounded-lg text-gray-700 dark:text-gray-200 border-0 focus:ring-2 focus:ring-indigo-500">
                    <option value="en">English</option>
                    <option value="es">Español</option>
                    <option value="fr">Français</option>
                    <option value="de">Deutsch</option>
                  </select>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Settings;
