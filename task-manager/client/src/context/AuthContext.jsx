import { createContext, useContext, useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate, useLocation } from "react-router-dom";
import {
  login as loginService,
  register as registerService,
  getCurrentUser,
} from "../services/auth";
import toast from "react-hot-toast";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(localStorage.getItem("token"));
  const navigate = useNavigate();
  const location = useLocation();
  const queryClient = useQueryClient();

  const { data: user, isLoading } = useQuery({
    queryKey: ["user"],
    queryFn: getCurrentUser,
    enabled: !!token,
    onError: (error) => {
      if (error.response?.status === 401) {
        setToken(null);
        localStorage.removeItem("token");
        navigate("/login");
      }
    },
  });

  const loginMutation = useMutation({
    mutationFn: loginService,
    onSuccess: (data) => {
      setToken(data.token);
      localStorage.setItem("token", data.token);
      queryClient.invalidateQueries(["user"]);
      const from = location.state?.from?.pathname || "/";
      navigate(from, { replace: true });
      toast.success("Login successful");
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || "Login failed");
    },
  });

  const registerMutation = useMutation({
    mutationFn: registerService,
    onSuccess: () => {
      toast.success("Registration successful. Please login.");
      navigate("/login");
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || "Registration failed");
    },
  });

  const logout = () => {
    setToken(null);
    localStorage.removeItem("token");
    queryClient.clear();
    navigate("/login", { replace: true });
    toast.success("Logged out successfully");
  };

  const value = {
    user,
    isLoading,
    loginMutation,
    registerMutation,
    logout,
    isAuthenticated: !!token,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
