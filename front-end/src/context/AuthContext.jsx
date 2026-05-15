import { createContext, useContext, useEffect, useState } from "react";
import authApi from "../services/authApi";
import { useAppNavigation } from "../hooks/useAppNavigation";
import toast from "react-hot-toast";

const AuthContext = createContext();

const normalizeUser = (rawUser) => {
  if (!rawUser) return null;
  const normalizedId = rawUser.id || rawUser._id;
  return { ...rawUser, id: normalizedId, _id: rawUser._id || normalizedId };
};

export const AuthProvider = ({ children }) => {
  const { goHome, goLogin, goAdmin } = useAppNavigation();
  const [user, setUser] = useState(null);
  const [loadingAuth, setLoadingAuth] = useState(true);  

  useEffect(() => {
    const sessionUser = JSON.parse(sessionStorage.getItem("user"));
    if (sessionUser) setUser(normalizeUser(sessionUser));
    setLoadingAuth(false);
  }, []);

  const register = async ({ name, email, password }) => {
    try {

      const res = await authApi.post("/auth/register", {
        username: name,
        email,
        password,
      });

      toast.success("Registration successful! Please login.");
      goLogin();
      return res.data;
    } catch (err) {
      toast.error(err.response?.data?.message || "Something went wrong");
      return null;
    }
  };

  const login = async ({ email, password }) => {
    try {
      const res = await authApi.post("/auth/login", { email, password });
      const foundUser = normalizeUser(res.data);

      if (foundUser?.isBlocked) {
        toast.error("Your access has been restricted");
        return null;
      }

      setUser(foundUser);
      sessionStorage.setItem("user", JSON.stringify(foundUser));
      sessionStorage.setItem("token", foundUser.token);

      if (foundUser?.role === "admin") {
        goAdmin();
        return foundUser;
      }

      goHome();
      return foundUser;
    } catch (err) {
      throw new Error(err.response?.data?.message || "Login failed");
    }
  };

  const logOut = async () => {
    try {
      if (!user?._id) return;
      await authApi.post("/auth/logout", { id: user._id });
      setUser(null);
      sessionStorage.removeItem("user");
      sessionStorage.removeItem("token");
      goLogin();
    } catch (err) {
      console.error("Logout failed:", err);
    }
  };

  const requireAuth = () => {
    if (!user) {
      goLogin();
      return false;
    }
    return true;
  };

  const updateUser = (updatedUser) => {
    const normalized = normalizeUser(updatedUser);
    setUser(normalized);
    sessionStorage.setItem("user", JSON.stringify(normalized));
  };

  return (
    <AuthContext.Provider
      value={{ user, register, login, logOut, loadingAuth, requireAuth, updateUser }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
export default AuthContext;
