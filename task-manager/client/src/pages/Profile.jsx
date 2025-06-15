import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateProfile } from "../services/auth";
import toast from "react-hot-toast";

function Profile() {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: user?.name || "",
    email: user?.email || "",
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const updateProfileMutation = useMutation({
    mutationFn: updateProfile,
    onSuccess: () => {
      queryClient.invalidateQueries(["user"]);
      toast.success("Profile updated successfully");
      setIsEditing(false);
      setFormData({
        ...formData,
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || "Failed to update profile");
    },
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (formData.newPassword !== formData.confirmPassword) {
      toast.error("New passwords do not match");
      return;
    }
    updateProfileMutation.mutate(formData);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 py-8 px-4">
      <div className="max-w-2xl mx-auto">
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl border border-white/20 shadow-xl p-8 animate-fade-in">
          <div className="flex items-center gap-3 mb-6 pb-4 border-b border-gray-100">
            <div className="w-2 h-10 bg-gradient-to-b from-blue-600 to-purple-600 rounded-full"></div>
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Profile Settings
            </h2>
          </div>

          <div className="space-y-6">
            {/* Profile Picture */}
            <div className="flex items-center gap-4">
              <div className="w-20 h-20 rounded-full bg-gradient-to-r from-blue-600 to-purple-600 flex items-center justify-center text-white text-2xl font-bold">
                {user?.name?.charAt(0).toUpperCase() || "U"}
              </div>
              <div>
                <h3 className="text-xl font-semibold text-gray-900">
                  {user?.name}
                </h3>
                <p className="text-gray-600">{user?.email}</p>
              </div>
            </div>

            {/* Profile Form */}
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Name
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    disabled={!isEditing}
                    className="w-full px-4 py-2 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition-all duration-300 disabled:bg-gray-50 disabled:text-gray-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Email
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    disabled={!isEditing}
                    className="w-full px-4 py-2 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition-all duration-300 disabled:bg-gray-50 disabled:text-gray-500"
                  />
                </div>
              </div>

              {isEditing && (
                <div className="space-y-6 pt-6 border-t border-gray-100">
                  <h4 className="text-lg font-semibold text-gray-900">
                    Change Password
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Current Password
                      </label>
                      <input
                        type="password"
                        name="currentPassword"
                        value={formData.currentPassword}
                        onChange={handleChange}
                        className="w-full px-4 py-2 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition-all duration-300"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        New Password
                      </label>
                      <input
                        type="password"
                        name="newPassword"
                        value={formData.newPassword}
                        onChange={handleChange}
                        className="w-full px-4 py-2 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition-all duration-300"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Confirm New Password
                      </label>
                      <input
                        type="password"
                        name="confirmPassword"
                        value={formData.confirmPassword}
                        onChange={handleChange}
                        className="w-full px-4 py-2 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition-all duration-300"
                      />
                    </div>
                  </div>
                </div>
              )}

              <div className="flex justify-end gap-4 pt-6 border-t border-gray-100">
                {isEditing ? (
                  <>
                    <button
                      type="button"
                      onClick={() => {
                        setIsEditing(false);
                        setFormData({
                          name: user?.name || "",
                          email: user?.email || "",
                          currentPassword: "",
                          newPassword: "",
                          confirmPassword: "",
                        });
                      }}
                      className="px-6 py-3 bg-gray-100 text-gray-700 rounded-xl font-medium hover:bg-gray-200 transition-colors duration-200"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={updateProfileMutation.isLoading}
                      className="px-6 py-3 bg-blue-600 text-white rounded-xl font-medium hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
                    >
                      {updateProfileMutation.isLoading
                        ? "Saving..."
                        : "Save Changes"}
                    </button>
                  </>
                ) : (
                  <button
                    type="button"
                    onClick={() => setIsEditing(true)}
                    className="px-6 py-3 bg-blue-600 text-white rounded-xl font-medium hover:bg-blue-700 transition-colors duration-200"
                  >
                    Edit Profile
                  </button>
                )}
              </div>
            </form>
          </div>
        </div>
      </div>

      <style>
        {`
          @keyframes fadeIn {
            from {
              opacity: 0;
              transform: translateY(20px);
            }
            to {
              opacity: 1;
              transform: translateY(0);
            }
          }

          .animate-fade-in {
            animation: fadeIn 0.6s ease-out;
          }
        `}
      </style>
    </div>
  );
}

export default Profile;
