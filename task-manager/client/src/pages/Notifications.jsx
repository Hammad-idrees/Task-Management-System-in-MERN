import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getNotifications,
  markNotificationRead,
  deleteNotification,
} from "../services/notifications";
import { format } from "date-fns";
import toast from "react-hot-toast";
import { motion, AnimatePresence } from "framer-motion";

function Notifications() {
  const queryClient = useQueryClient();

  const {
    data: response,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["notifications"],
    queryFn: getNotifications,
  });

  const notifications = response?.notifications || [];

  const markAsReadMutation = useMutation({
    mutationFn: markNotificationRead,
    onSuccess: (data) => {
      queryClient.setQueryData(["notifications"], (oldData) => ({
        notifications: oldData.notifications.filter(
          (n) => n._id !== data.notification._id
        ),
      }));
      toast.success("Notification marked as read", {
        icon: "👌",
        style: {
          background: "#4ade80",
          color: "#166534",
        },
      });
    },
    onError: (error) => {
      toast.error(
        error.response?.data?.message || "Failed to mark notification as read",
        {
          style: {
            background: "#f87171",
            color: "#7f1d1d",
          },
        }
      );
    },
  });

  const deleteMutation = useMutation({
    mutationFn: deleteNotification,
    onSuccess: () => {
      queryClient.invalidateQueries(["notifications"]);
      toast.success("Notification deleted", {
        icon: "🗑️",
        style: {
          background: "#fbbf24",
          color: "#854d0e",
        },
      });
    },
    onError: (error) => {
      toast.error(
        error.response?.data?.message || "Failed to delete notification",
        {
          style: {
            background: "#f87171",
            color: "#7f1d1d",
          },
        }
      );
    },
  });

  const handleMarkAsRead = async (id) => {
    try {
      await markAsReadMutation.mutateAsync(id);
    } catch (error) {
      console.error("Error marking notification as read:", error);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this notification?")) {
      try {
        await deleteMutation.mutateAsync(id);
      } catch (error) {
        console.error("Error deleting notification:", error);
      }
    }
  };

  if (isLoading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="animate-pulse space-y-8">
          <div className="h-10 w-64 bg-gray-200 rounded-xl mb-8"></div>
          {[...Array(5)].map((_, i) => (
            <div
              key={i}
              className="bg-white/80 backdrop-blur-sm border border-white/20 shadow-lg rounded-2xl p-6"
            >
              <div className="flex justify-between">
                <div className="space-y-3">
                  <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                  <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                </div>
                <div className="flex space-x-3">
                  <div className="h-8 w-20 bg-gray-200 rounded-lg"></div>
                  <div className="h-8 w-20 bg-gray-200 rounded-lg"></div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center p-8 bg-white/80 backdrop-blur-sm rounded-2xl border border-red-200 shadow-xl">
          <div className="w-16 h-16 mx-auto mb-4 bg-red-100 rounded-full flex items-center justify-center">
            <svg
              className="w-8 h-8 text-red-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"
              ></path>
            </svg>
          </div>
          <h3 className="text-xl font-semibold text-gray-900 mb-2">
            Failed to Load Notifications
          </h3>
          <p className="text-red-600">
            {error.response?.data?.message ||
              "Failed to load notifications. Please try again later."}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="space-y-8"
      >
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            Notifications
          </h1>
          <div className="flex items-center gap-2 bg-white/80 backdrop-blur-sm px-4 py-2 rounded-xl border border-white/20 shadow-sm">
            <span className="text-gray-600">Total:</span>
            <span className="font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              {notifications.length}
            </span>
          </div>
        </div>

        {notifications.length === 0 ? (
          <div className="text-center py-16 bg-white/80 backdrop-blur-sm rounded-2xl border border-white/20 shadow-xl">
            <div className="w-24 h-24 mx-auto mb-6 bg-gray-100 rounded-full flex items-center justify-center">
              <svg
                className="w-12 h-12 text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
                />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              No notifications yet
            </h3>
            <p className="text-gray-500 max-w-md mx-auto">
              You're all caught up! When you have new notifications, they'll
              appear here.
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            <AnimatePresence>
              {notifications.map((notification, index) => (
                <motion.div
                  key={notification._id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.05 }}
                  className={`bg-white/80 backdrop-blur-sm rounded-2xl border border-white/20 shadow-lg hover:shadow-xl transition-all duration-300 p-6 ${
                    notification.read ? "" : "ring-2 ring-blue-500"
                  }`}
                >
                  <div className="flex justify-between items-start">
                    <div className="flex items-start gap-4">
                      <div
                        className={`mt-1 p-2 rounded-full ${
                          notification.read ? "bg-gray-100" : "bg-blue-100"
                        }`}
                      >
                        <svg
                          className={`w-5 h-5 ${
                            notification.read
                              ? "text-gray-500"
                              : "text-blue-500"
                          }`}
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
                          />
                        </svg>
                      </div>
                      <div>
                        <p
                          className={`text-gray-900 ${
                            notification.read ? "" : "font-semibold"
                          }`}
                        >
                          {notification.message}
                        </p>
                        <p className="text-sm text-gray-500 mt-2">
                          <svg
                            className="w-4 h-4 inline mr-1 -mt-0.5"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth="2"
                              d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                            />
                          </svg>
                          {format(
                            new Date(notification.createdAt),
                            "MMM d, yyyy 'at' h:mm a"
                          )}
                        </p>
                      </div>
                    </div>
                    <div className="flex space-x-2">
                      {!notification.read && (
                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={() => handleMarkAsRead(notification._id)}
                          className="px-3 py-1 text-sm bg-blue-50 text-blue-600 hover:bg-blue-100 rounded-lg transition-colors flex items-center gap-1"
                        >
                          <svg
                            className="w-4 h-4"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth="2"
                              d="M5 13l4 4L19 7"
                            />
                          </svg>
                          Mark as read
                        </motion.button>
                      )}
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => handleDelete(notification._id)}
                        className="px-3 py-1 text-sm bg-red-50 text-red-600 hover:bg-red-100 rounded-lg transition-colors flex items-center gap-1"
                      >
                        <svg
                          className="w-4 h-4"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                          />
                        </svg>
                        Delete
                      </motion.button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        )}
      </motion.div>
    </div>
  );
}

export default Notifications;
