import { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { motion, AnimatePresence } from "framer-motion";
import {
  FaEnvelope,
  FaLock,
  FaEye,
  FaEyeSlash,
  FaTasks,
  FaCheckCircle,
  FaExclamationTriangle,
} from "react-icons/fa";
import toast from "react-hot-toast";

const Login = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [focusedField, setFocusedField] = useState(null);
  const [errors, setErrors] = useState({});
  const { loginMutation } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

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
      const loadingToast = toast.loading("Signing you in...");

      // Attempt login
      await loginMutation.mutateAsync(formData);

      // Dismiss loading toast
      toast.dismiss(loadingToast);

      // Show success toast
      toast.success("Welcome back! Login successful", {
        duration: 3000,
        icon: "🎉",
      });

      // Navigate to the intended page or dashboard
      const from = location.state?.from?.pathname || "/dashboard";
      navigate(from, { replace: true });
    } catch (error) {
      console.error("Login error:", error);

      // Handle different types of errors
      let errorMessage = "Login failed. Please try again.";

      if (error.response?.status === 401) {
        errorMessage = "Invalid email or password";
      } else if (error.response?.status === 404) {
        errorMessage = "Account not found. Please check your email.";
      } else if (error.response?.status === 429) {
        errorMessage = "Too many login attempts. Please try again later.";
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

  const floatingElements = Array.from({ length: 6 }, (_, i) => (
    <motion.div
      key={i}
      className="absolute w-2 h-2 bg-blue-300/20 rounded-full"
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
        duration: 8 + Math.random() * 4,
        repeat: Infinity,
        repeatType: "reverse",
        ease: "linear",
      }}
    />
  ));

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-800 flex items-center justify-center p-4 relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        {floatingElements}
        <motion.div
          className="absolute top-1/4 left-1/4 w-64 h-64 bg-blue-400/10 rounded-full blur-3xl"
          animate={{
            scale: [1, 1.2, 1],
            rotate: [0, 180, 360],
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: "linear",
          }}
        />
        <motion.div
          className="absolute bottom-1/4 right-1/4 w-48 h-48 bg-purple-400/10 rounded-full blur-3xl"
          animate={{
            scale: [1.2, 1, 1.2],
            rotate: [360, 180, 0],
          }}
          transition={{
            duration: 15,
            repeat: Infinity,
            ease: "linear",
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
        className="w-full max-w-md relative z-10"
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
              className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl mb-4 shadow-lg"
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
              className="text-4xl font-bold bg-gradient-to-r from-white to-blue-200 bg-clip-text text-transparent mb-2"
              animate={{
                backgroundPosition: ["0%", "100%", "0%"],
              }}
              transition={{ duration: 3, repeat: Infinity }}
            >
              TaskFlow
            </motion.h1>
            <motion.p
              className="text-blue-100/80 text-lg"
              initial={{ y: 10, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.5 }}
            >
              Welcome back to your productivity hub
            </motion.p>
          </motion.div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Email Field */}
            <motion.div
              initial={{ x: -50, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.4, type: "spring", stiffness: 100 }}
              className="space-y-2"
            >
              <motion.label
                className="block text-sm font-semibold text-blue-100"
                animate={{
                  color: focusedField === "email" ? "#FFFFFF" : "#BFDBFE",
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
                      ? "#3B82F6"
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
                  className={`block w-full pl-12 pr-4 py-3 bg-white/20 border rounded-xl text-white placeholder-blue-200/60 focus:ring-2 focus:border-transparent transition-all duration-300 backdrop-blur-sm ${
                    errors.email
                      ? "border-red-400 focus:ring-red-400"
                      : "border-white/30 focus:ring-blue-400"
                  }`}
                  placeholder="Enter your email"
                  whileFocus={{ scale: 1.02 }}
                />
                <motion.div
                  className={`absolute inset-0 rounded-xl opacity-0 pointer-events-none ${
                    errors.email
                      ? "bg-gradient-to-r from-red-400/20 to-red-400/20"
                      : "bg-gradient-to-r from-blue-400/20 to-purple-400/20"
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
              transition={{ delay: 0.5, type: "spring", stiffness: 100 }}
              className="space-y-2"
            >
              <motion.label
                className="block text-sm font-semibold text-blue-100"
                animate={{
                  color: focusedField === "password" ? "#FFFFFF" : "#BFDBFE",
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
                      ? "#3B82F6"
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
                  className={`block w-full pl-12 pr-12 py-3 bg-white/20 border rounded-xl text-white placeholder-blue-200/60 focus:ring-2 focus:border-transparent transition-all duration-300 backdrop-blur-sm ${
                    errors.password
                      ? "border-red-400 focus:ring-red-400"
                      : "border-white/30 focus:ring-blue-400"
                  }`}
                  placeholder="Enter your password"
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
                        <FaEyeSlash className="h-5 w-5 text-blue-200 hover:text-white transition-colors" />
                      </motion.div>
                    ) : (
                      <motion.div
                        key="show"
                        initial={{ opacity: 0, rotate: -90 }}
                        animate={{ opacity: 1, rotate: 0 }}
                        exit={{ opacity: 0, rotate: 90 }}
                        transition={{ duration: 0.2 }}
                      >
                        <FaEye className="h-5 w-5 text-blue-200 hover:text-white transition-colors" />
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.button>
                <motion.div
                  className={`absolute inset-0 rounded-xl opacity-0 pointer-events-none ${
                    errors.password
                      ? "bg-gradient-to-r from-red-400/20 to-red-400/20"
                      : "bg-gradient-to-r from-blue-400/20 to-purple-400/20"
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

            {/* Submit Button */}
            <motion.div
              initial={{ y: 30, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.6, type: "spring", stiffness: 100 }}
            >
              <motion.button
                type="submit"
                disabled={isLoading}
                className={`w-full py-3 px-6 rounded-xl text-white font-semibold text-lg shadow-lg
                  ${
                    isLoading
                      ? "bg-blue-400/50 cursor-not-allowed"
                      : "bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                  } transition-all duration-300 backdrop-blur-sm border border-white/20`}
                whileHover={
                  !isLoading
                    ? {
                        scale: 1.02,
                        boxShadow: "0 10px 25px rgba(59, 130, 246, 0.4)",
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
                        Signing you in...
                      </motion.span>
                    </motion.div>
                  ) : (
                    <motion.div
                      key="signin"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="flex items-center justify-center"
                    >
                      <FaCheckCircle className="mr-2" />
                      Sign In to TaskFlow
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.button>
            </motion.div>
          </form>

          {/* Sign up link */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.7 }}
            className="text-center"
          >
            <motion.p className="text-blue-100/80" whileHover={{ scale: 1.02 }}>
              New to TaskFlow?{" "}
              <Link
                to="/register"
                className="text-blue-300 hover:text-white font-semibold transition-colors duration-200 relative group"
              >
                <span className="relative z-10">Create Account</span>
                <motion.span
                  className="absolute inset-x-0 bottom-0 h-0.5 bg-gradient-to-r from-blue-400 to-purple-400 origin-left"
                  initial={{ scaleX: 0 }}
                  whileHover={{ scaleX: 1 }}
                  transition={{ duration: 0.3 }}
                />
              </Link>
            </motion.p>
          </motion.div>

          {/* Decorative elements */}
          <motion.div
            className="absolute -top-4 -right-4 w-8 h-8 bg-gradient-to-r from-blue-400 to-purple-500 rounded-full opacity-60"
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
            className="absolute -bottom-4 -left-4 w-6 h-6 bg-gradient-to-r from-purple-400 to-pink-500 rounded-full opacity-60"
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
        </motion.div>
      </motion.div>
    </div>
  );
};

export default Login;
