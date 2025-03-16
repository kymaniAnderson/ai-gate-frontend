"use client";

import { createContext, useContext, useState, useEffect } from "react";

type UserRole = "resident" | "security" | "admin" | null;
type User = {
  id: string;
  name: string;
  email: string;
  role: UserRole;
} | null;

type AuthContextType = {
  user: User;
  login: (email: string, password: string) => Promise<any>; // Changed to return API response
  logout: () => void;
  isLoading: boolean;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check for existing session
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setIsLoading(false);
  }, []);

  const login = async (email: string, password: string) => {
    setIsLoading(true);
    try {
      // Login with Strapi
      const loginResponse = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/auth/local`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            identifier: email,
            password: password,
          }),
        }
      );

      const loginData = await loginResponse.json();

      if (!loginResponse.ok) {
        throw new Error(loginData.error?.message || "Login failed");
      }

      // Get user details including role
      const userResponse = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/users/me`,
        {
          headers: {
            Authorization: `Bearer ${loginData.jwt}`,
          },
        }
      );

      const userData = await userResponse.json();

      // Format user data for storage
      const userToStore = {
        id: userData.id.toString(),
        name: userData.username,
        email: userData.email,
        role: userData.role?.type || "resident", // Default to resident if no role
      };

      // Store user data and token
      localStorage.setItem("token", loginData.jwt);
      localStorage.setItem("user", JSON.stringify(userToStore));
      setUser(userToStore);

      return loginData;
    } catch (error) {
      console.error("Login failed:", error);
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("user");
    localStorage.removeItem("token");
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, isLoading }}>
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
