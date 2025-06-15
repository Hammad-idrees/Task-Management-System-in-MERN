import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { motion, AnimatePresence } from "framer-motion";
import {
  FaUser,
  FaEnvelope,
  FaLock,
  FaEye,
  FaEyeSlash,
  FaTasks,
  FaUserPlus,
  FaExclamationTriangle,
} from "react-icons/fa";
import toast from "react-hot-toast";

const Register = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [focusedField, setFocusedField] = useState(null);
  const [errors, setErrors] = useState({});
  const { registerMutation } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    // Name validation
    if (!formData.name.trim()) {
      newErrors.name = "Full name is required";
    } else if (formData.name.trim().length < 2) {
      newErrors.name = "Name must be at least 2 characters";
    }

    // Email validation
    if (!formData.email) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Please enter a valid email address";
    }

    // Password validation
    if (!formData.password) {
      newErrors.password = "Password is required";
    } else if (formData.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
    }

    // Confirm password validation
    if (!formData.confirmPassword) {
      newErrors.confirmPassword = "Please confirm your password";
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      toast.error("Please fix the errors below");
      return;
    }

    setIsLoading(true);

    try {
      // Show loading toast
      const loadingToast = toast.loading("Creating your account...");

      // Attempt registration
      await registerMutation.mutateAsync({
        name: formData.name,
        email: formData.email,
        password: formData.password,
      });

      // Dismiss loading toast
      toast.dismiss(loadingToast);

      // Show success toast
      toast.success("Account created successfully! Please sign in.", {
        duration: 4000,
        icon: "🎉",
      });

      // Navigate to login
      navigate("/login");
    } catch (error) {
      console.error("Registration error:", error);

      // Handle different types of errors
      let errorMessage = "Registration failed. Please try again.";

      if (error.response?.status === 409) {
        errorMessage = "An account with this email already exists";
      } else if (error.response?.status === 400) {
        errorMessage = "Invalid information provided";
      } else if (error.response?.data?.message) {
        errorMessage = error.response.data.message;
      } else if (error.message) {
        errorMessage = error.message;
      }

      toast.error(errorMessage, {
        duration: 4000,
        icon: "❌",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const floatingElements = Array.from({ length: 8 }, (_, i) => (
    <motion.div
      key={i}
      className="absolute w-2 h-2 bg-emerald-300/20 rounded-full"
      initial={{
        x:
          Math.random() *
          (typeof window !== "undefined" ? window.innerWidth : 800),
        y:
          Math.random() *
          (typeof window !== "undefined" ? window.innerHeight : 600),
      }}
      animate={{
        x:
          Math.random() *
          (typeof window !== "undefined" ? window.innerWidth : 800),
        y:
          Math.random() *
          (typeof window !== "undefined" ? window.innerHeight : 600),
      }}
      transition={{
        duration: 10 + Math.random() * 6,
        repeat: Infinity,
        repeatType: "reverse",
        ease: "linear",
      }}
    />
  ));

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-900 via-teal-900 to-cyan-800 flex items-center justify-center p-4 relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        {floatingElements}
        <motion.div
          className="absolute top-1/3 left-1/5 w-72 h-72 bg-emerald-400/10 rounded-full blur-3xl"
          animate={{
            scale: [1, 1.3, 1],
            rotate: [0, 120, 240, 360],
          }}
          transition={{
            duration: 25,
            repeat: Infinity,
            ease: "linear",
          }}
        />
        <motion.div
          className="absolute bottom-1/3 right-1/5 w-56 h-56 bg-teal-400/10 rounded-full blur-3xl"
          animate={{
            scale: [1.3, 1, 1.3],
            rotate: [360, 240, 120, 0],
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: "linear",
          }}
        />
        <motion.div
          className="absolute top-1/2 right-1/3 w-40 h-40 bg-cyan-400/10 rounded-full blur-3xl"
          animate={{
            scale: [1, 1.1, 1],
            x: [0, 50, 0],
            y: [0, -30, 0],
          }}
          transition={{
            duration: 18,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 50, scale: 0.9 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{
          duration: 0.8,
          type: "spring",
          stiffness: 100,
          damping: 15,
        }}
        className="w-full max-w-lg relative z-10"
      >
        <motion.div
          className="bg-white/10 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/20 p-8 space-y-8"
          whileHover={{
            scale: 1.02,
            boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.25)",
          }}
          transition={{ type: "spring", stiffness: 300, damping: 30 }}
        >
          {/* Header with animated logo */}
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.6 }}
            className="text-center relative"
          >
            <motion.div
              className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-emerald-500 to-teal-600 rounded-2xl mb-4 shadow-lg"
              animate={{
                rotateY: [0, 360],
                scale: [1, 1.1, 1],
              }}
              transition={{
                rotateY: { duration: 3, repeat: Infinity, ease: "linear" },
                scale: { duration: 2, repeat: Infinity, ease: "easeInOut" },
              }}
            >
              <FaTasks className="text-white text-2xl" />
            </motion.div>
            <motion.h1
              className="text-4xl font-bold bg-gradient-to-r from-white to-emerald-200 bg-clip-text text-transparent mb-2"
              animate={{
                backgroundPosition: ["0%", "100%", "0%"],
              }}
              transition={{ duration: 3, repeat: Infinity }}
            >
              Join TaskFlow
            </motion.h1>
            <motion.p
              className="text-emerald-100/80 text-lg"
              initial={{ y: 10, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.5 }}
            >
              Create your account and boost productivity
            </motion.p>
          </motion.div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Name Field */}
            <motion.div
              initial={{ x: -50, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.4, type: "spring", stiffness: 100 }}
              className="space-y-2"
            >
              <motion.label
                className="block text-sm font-semibold text-emerald-100"
                animate={{
                  color: focusedField === "name" ? "#FFFFFF" : "#A7F3D0",
                }}
              >
                Full Name
              </motion.label>
              <div className="relative group">
                <motion.div
                  className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none"
                  animate={{
                    scale: focusedField === "name" ? 1.1 : 1,
                    color: errors.name
                      ? "#EF4444"
                      : focusedField === "name"
                      ? "#10B981"
                      : "#9CA3AF",
                  }}
                >
                  <FaUser className="h-5 w-5 transition-colors duration-200" />
                </motion.div>
                <motion.input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  onFocus={() => setFocusedField("name")}
                  onBlur={() => setFocusedField(null)}
                  required
                  className={`block w-full pl-12 pr-4 py-3 bg-white/20 border rounded-xl text-white placeholder-emerald-200/60 focus:ring-2 focus:border-transparent transition-all duration-300 backdrop-blur-sm ${
                    errors.name
                      ? "border-red-400 focus:ring-red-400"
                      : "border-white/30 focus:ring-emerald-400"
                  }`}
                  placeholder="Enter your full name"
                  whileFocus={{ scale: 1.02 }}
                />
                <motion.div
                  className={`absolute inset-0 rounded-xl opacity-0 pointer-events-none ${
                    errors.name
                      ? "bg-gradient-to-r from-red-400/20 to-red-400/20"
                      : "bg-gradient-to-r from-emerald-400/20 to-teal-400/20"
                  }`}
                  animate={{
                    opacity: focusedField === "name" || errors.name ? 1 : 0,
                  }}
                  transition={{ duration: 0.2 }}
                />
              </div>
              <AnimatePresence>
                {errors.name && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="flex items-center text-red-300 text-sm"
                  >
                    <FaExclamationTriangle className="mr-1 h-3 w-3" />
                    {errors.name}
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>

            {/* Email Field */}
            <motion.div
              initial={{ x: -50, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.5, type: "spring", stiffness: 100 }}
              className="space-y-2"
            >
              <motion.label
                className="block text-sm font-semibold text-emerald-100"
                animate={{
                  color: focusedField === "email" ? "#FFFFFF" : "#A7F3D0",
                }}
              >
                Email Address
              </motion.label>
              <div className="relative group">
                <motion.div
                  className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none"
                  animate={{
                    scale: focusedField === "email" ? 1.1 : 1,
                    color: errors.email
                      ? "#EF4444"
                      : focusedField === "email"
                      ? "#10B981"
                      : "#9CA3AF",
                  }}
                >
                  <FaEnvelope className="h-5 w-5 transition-colors duration-200" />
                </motion.div>
                <motion.input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  onFocus={() => setFocusedField("email")}
                  onBlur={() => setFocusedField(null)}
                  required
                  className={`block w-full pl-12 pr-4 py-3 bg-white/20 border rounded-xl text-white placeholder-emerald-200/60 focus:ring-2 focus:border-transparent transition-all duration-300 backdrop-blur-sm ${
                    errors.email
                      ? "border-red-400 focus:ring-red-400"
                      : "border-white/30 focus:ring-emerald-400"
                  }`}
                  placeholder="Enter your email"
                  whileFocus={{ scale: 1.02 }}
                />
                <motion.div
                  className={`absolute inset-0 rounded-xl opacity-0 pointer-events-none ${
                    errors.email
                      ? "bg-gradient-to-r from-red-400/20 to-red-400/20"
                      : "bg-gradient-to-r from-emerald-400/20 to-teal-400/20"
                  }`}
                  animate={{
                    opacity: focusedField === "email" || errors.email ? 1 : 0,
                  }}
                  transition={{ duration: 0.2 }}
                />
              </div>
              <AnimatePresence>
                {errors.email && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="flex items-center text-red-300 text-sm"
                  >
                    <FaExclamationTriangle className="mr-1 h-3 w-3" />
                    {errors.email}
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>

            {/* Password Field */}
            <motion.div
              initial={{ x: -50, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.6, type: "spring", stiffness: 100 }}
              className="space-y-2"
            >
              <motion.label
                className="block text-sm font-semibold text-emerald-100"
                animate={{
                  color: focusedField === "password" ? "#FFFFFF" : "#A7F3D0",
                }}
              >
                Password
              </motion.label>
              <div className="relative group">
                <motion.div
                  className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none"
                  animate={{
                    scale: focusedField === "password" ? 1.1 : 1,
                    color: errors.password
                      ? "#EF4444"
                      : focusedField === "password"
                      ? "#10B981"
                      : "#9CA3AF",
                  }}
                >
                  <FaLock className="h-5 w-5 transition-colors duration-200" />
                </motion.div>
                <motion.input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  onFocus={() => setFocusedField("password")}
                  onBlur={() => setFocusedField(null)}
                  required
                  className={`block w-full pl-12 pr-12 py-3 bg-white/20 border rounded-xl text-white placeholder-emerald-200/60 focus:ring-2 focus:border-transparent transition-all duration-300 backdrop-blur-sm ${
                    errors.password
                      ? "border-red-400 focus:ring-red-400"
                      : "border-white/30 focus:ring-emerald-400"
                  }`}
                  placeholder="Create a password"
                  whileFocus={{ scale: 1.02 }}
                />
                <motion.button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-4 flex items-center"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <AnimatePresence mode="wait">
                    {showPassword ? (
                      <motion.div
                        key="hide"
                        initial={{ opacity: 0, rotate: -90 }}
                        animate={{ opacity: 1, rotate: 0 }}
                        exit={{ opacity: 0, rotate: 90 }}
                        transition={{ duration: 0.2 }}
                      >
                        <FaEyeSlash className="h-5 w-5 text-emerald-200 hover:text-white transition-colors" />
                      </motion.div>
                    ) : (
                      <motion.div
                        key="show"
                        initial={{ opacity: 0, rotate: -90 }}
                        animate={{ opacity: 1, rotate: 0 }}
                        exit={{ opacity: 0, rotate: 90 }}
                        transition={{ duration: 0.2 }}
                      >
                        <FaEye className="h-5 w-5 text-emerald-200 hover:text-white transition-colors" />
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.button>
                <motion.div
                  className={`absolute inset-0 rounded-xl opacity-0 pointer-events-none ${
                    errors.password
                      ? "bg-gradient-to-r from-red-400/20 to-red-400/20"
                      : "bg-gradient-to-r from-emerald-400/20 to-teal-400/20"
                  }`}
                  animate={{
                    opacity:
                      focusedField === "password" || errors.password ? 1 : 0,
                  }}
                  transition={{ duration: 0.2 }}
                />
              </div>
              <AnimatePresence>
                {errors.password && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="flex items-center text-red-300 text-sm"
                  >
                    <FaExclamationTriangle className="mr-1 h-3 w-3" />
                    {errors.password}
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>

            {/* Confirm Password Field */}
            <motion.div
              initial={{ x: -50, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.7, type: "spring", stiffness: 100 }}
              className="space-y-2"
            >
              <motion.label
                className="block text-sm font-semibold text-emerald-100"
                animate={{
                  color:
                    focusedField === "confirmPassword" ? "#FFFFFF" : "#A7F3D0",
                }}
              >
                Confirm Password
              </motion.label>
              <div className="relative group">
                <motion.div
                  className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none"
                  animate={{
                    scale: focusedField === "confirmPassword" ? 1.1 : 1,
                    color: errors.confirmPassword
                      ? "#EF4444"
                      : focusedField === "confirmPassword"
                      ? "#10B981"
                      : "#9CA3AF",
                  }}
                >
                  <FaLock className="h-5 w-5 transition-colors duration-200" />
                </motion.div>
                <motion.input
                  type={showConfirmPassword ? "text" : "password"}
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  onFocus={() => setFocusedField("confirmPassword")}
                  onBlur={() => setFocusedField(null)}
                  required
                  className={`block w-full pl-12 pr-12 py-3 bg-white/20 border rounded-xl text-white placeholder-emerald-200/60 focus:ring-2 focus:border-transparent transition-all duration-300 backdrop-blur-sm ${
                    errors.confirmPassword
                      ? "border-red-400 focus:ring-red-400"
                      : "border-white/30 focus:ring-emerald-400"
                  }`}
                  placeholder="Confirm your password"
                  whileFocus={{ scale: 1.02 }}
                />
                <motion.button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute inset-y-0 right-0 pr-4 flex items-center"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <AnimatePresence mode="wait">
                    {showConfirmPassword ? (
                      <motion.div
                        key="hide"
                        initial={{ opacity: 0, rotate: -90 }}
                        animate={{ opacity: 1, rotate: 0 }}
                        exit={{ opacity: 0, rotate: 90 }}
                        transition={{ duration: 0.2 }}
                      >
                        <FaEyeSlash className="h-5 w-5 text-emerald-200 hover:text-white transition-colors" />
                      </motion.div>
                    ) : (
                      <motion.div
                        key="show"
                        initial={{ opacity: 0, rotate: -90 }}
                        animate={{ opacity: 1, rotate: 0 }}
                        exit={{ opacity: 0, rotate: 90 }}
                        transition={{ duration: 0.2 }}
                      >
                        <FaEye className="h-5 w-5 text-emerald-200 hover:text-white transition-colors" />
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.button>
                <motion.div
                  className={`absolute inset-0 rounded-xl opacity-0 pointer-events-none ${
                    errors.confirmPassword
                      ? "bg-gradient-to-r from-red-400/20 to-red-400/20"
                      : "bg-gradient-to-r from-emerald-400/20 to-teal-400/20"
                  }`}
                  animate={{
                    opacity:
                      focusedField === "confirmPassword" ||
                      errors.confirmPassword
                        ? 1
                        : 0,
                  }}
                  transition={{ duration: 0.2 }}
                />
              </div>
              <AnimatePresence>
                {errors.confirmPassword && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="flex items-center text-red-300 text-sm"
                  >
                    <FaExclamationTriangle className="mr-1 h-3 w-3" />
                    {errors.confirmPassword}
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>

            {/* Submit Button */}
            <motion.div
              initial={{ y: 30, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.8, type: "spring", stiffness: 100 }}
            >
              <motion.button
                type="submit"
                disabled={isLoading}
                className={`w-full py-3 px-6 rounded-xl text-white font-semibold text-lg shadow-lg
                  ${
                    isLoading
                      ? "bg-emerald-400/50 cursor-not-allowed"
                      : "bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700"
                  } transition-all duration-300 backdrop-blur-sm border border-white/20`}
                whileHover={
                  !isLoading
                    ? {
                        scale: 1.02,
                        boxShadow: "0 10px 25px rgba(16, 185, 129, 0.4)",
                      }
                    : {}
                }
                whileTap={!isLoading ? { scale: 0.98 } : {}}
              >
                <AnimatePresence mode="wait">
                  {isLoading ? (
                    <motion.div
                      key="loading"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="flex items-center justify-center"
                    >
                      <motion.div
                        className="w-6 h-6 border-2 border-white border-t-transparent rounded-full mr-3"
                        animate={{ rotate: 360 }}
                        transition={{
                          duration: 1,
                          repeat: Infinity,
                          ease: "linear",
                        }}
                      />
                      <motion.span
                        animate={{ opacity: [1, 0.5, 1] }}
                        transition={{ duration: 1.5, repeat: Infinity }}
                      >
                        Creating account...
                      </motion.span>
                    </motion.div>
                  ) : (
                    <motion.div
                      key="create"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="flex items-center justify-center"
                    >
                      <FaUserPlus className="mr-2" />
                      Create Your Account
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.button>
            </motion.div>
          </form>

          {/* Sign in link */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.9 }}
            className="text-center"
          >
            <motion.p
              className="text-emerald-100/80"
              whileHover={{ scale: 1.02 }}
            >
              Already have a TaskFlow account?{" "}
              <Link
                to="/login"
                className="text-emerald-300 hover:text-white font-semibold transition-colors duration-200 relative group"
              >
                <span className="relative z-10">Sign In</span>
                <motion.span
                  className="absolute inset-x-0 bottom-0 h-0.5 bg-gradient-to-r from-emerald-400 to-teal-400 origin-left"
                  initial={{ scaleX: 0 }}
                  whileHover={{ scaleX: 1 }}
                  transition={{ duration: 0.3 }}
                />
              </Link>
            </motion.p>
          </motion.div>

          {/* Decorative elements */}
          <motion.div
            className="absolute -top-4 -right-4 w-8 h-8 bg-gradient-to-r from-emerald-400 to-teal-500 rounded-full opacity-60"
            animate={{
              scale: [1, 1.2, 1],
              rotate: [0, 180, 360],
            }}
            transition={{
              duration: 4,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />
          <motion.div
            className="absolute -bottom-4 -left-4 w-6 h-6 bg-gradient-to-r from-teal-400 to-cyan-500 rounded-full opacity-60"
            animate={{
              scale: [1.2, 1, 1.2],
              rotate: [360, 180, 0],
            }}
            transition={{
              duration: 3,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />
          <motion.div
            className="absolute top-1/2 -left-2 w-4 h-4 bg-gradient-to-r from-emerald-300 to-teal-400 rounded-full opacity-40"
            animate={{
              scale: [1, 1.3, 1],
              y: [0, -15, 0],
            }}
            transition={{
              duration: 6,
              repeat: Infinity,
              repeatType: "reverse",
              ease: "easeInOut",
            }}
          />
        </motion.div>
      </motion.div>
    </div>
  );
};

export default Register;
