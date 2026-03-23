import { createContext, useContext, useState, useEffect, ReactNode } from "react";

export interface User {
  id: string;
  email: string;
  name: string;
  role: "user" | "admin";
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
  logout: () => void;
  isAuthenticated: boolean;
  isAdmin: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);

  useEffect(() => {
    const storedToken = localStorage.getItem("jwt_token");
    const storedUser = localStorage.getItem("user");
    if (storedToken && storedUser) {
      // Only restore session if token looks like a real JWT (not old mock token)
      if (storedToken.startsWith("eyJ")) {
        setToken(storedToken);
        setUser(JSON.parse(storedUser));
      } else {
        localStorage.removeItem("jwt_token");
        localStorage.removeItem("user");
      }
    }
  }, []);

  useEffect(() => {
    const handleUnauth = () => {
      setUser(null);
      setToken(null);
      localStorage.removeItem("jwt_token");
      localStorage.removeItem("user");
    };
    window.addEventListener("auth:unauthorized", handleUnauth);
    return () => window.removeEventListener("auth:unauthorized", handleUnauth);
  }, []);

  const login = async (email: string, password: string) => {
    const res = await fetch("/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.error || "Invalid credentials");
    }
    const data = await res.json();
    setUser(data.user);
    setToken(data.token);
    localStorage.setItem("jwt_token", data.token);
    localStorage.setItem("user", JSON.stringify(data.user));
  };

  const register = async (name: string, email: string, password: string) => {
    const res = await fetch("/api/auth/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, email, password }),
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.error || "Registration failed");
    }
    const data = await res.json();
    setUser(data.user);
    setToken(data.token);
    localStorage.setItem("jwt_token", data.token);
    localStorage.setItem("user", JSON.stringify(data.user));
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem("jwt_token");
    localStorage.removeItem("user");
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        login,
        register,
        logout,
        isAuthenticated: !!user,
        isAdmin: user?.role === "admin",
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
