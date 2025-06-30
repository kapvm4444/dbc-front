"use client";
import { createContext, useContext, useState, useEffect } from "react";

const AuthContext = createContext();

export function useAuth() {
  return useContext(AuthContext);
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const login = async (email, password) => {
    try {
      const response = await fetch(
        "https://dbcapi.khush.pro/api/v1/users/login",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include", // This ensures cookies are sent/received
          body: JSON.stringify({
            email,
            password,
          }),
        },
      );

      const data = await response.json();
      console.log(data);
      if (!response.ok) {
        throw new Error(data.message || "Login failed");
      }

      // Assuming the API returns user data in the response
      const userData = {
        id: data.data?.user?._id || data.user?._id,
        name: data.data?.user?.name || data.user?.name,
        email: data.data?.user?.email || data.user?.email,
        image:
          data.data?.user?.image ||
          data.user?.image ||
          "/placeholder.svg?height=40&width=40",
        dialCode: data.data?.user?.dialCode || data.user?.dialCode,
        mobile: data.data?.user?.mobile || data.user?.mobile,
      };

      setUser(userData);

      // Store user data in localStorage as backup
      localStorage.setItem("user", JSON.stringify(userData));

      return { success: true, user: userData };
    } catch (error) {
      console.error("Login error:", error);
      throw new Error(error.message || "Login failed");
    }
  };

  const signup = async (userData) => {
    try {
      const response = await fetch(
        "https://dbcapi.khush.pro/api/v1/users/signup",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include", // This ensures cookies are sent/received
          body: JSON.stringify({
            name: userData.name,
            email: userData.email,
            dialCode: userData.dialCode,
            mobile: Number.parseInt(userData.mobile),
            image: userData.image || "default-avatar",
            password: userData.password,
            passwordConfirm: userData.confirmPassword,
          }),
        },
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Signup failed");
      }

      // Assuming the API returns user data in the response
      const newUser = {
        id: data.data?.user?._id || data.user?._id,
        name: data.data?.user?.name || data.user?.name,
        email: data.data?.user?.email || data.user?.email,
        image:
          data.data?.user?.image ||
          data.user?.image ||
          "/placeholder.svg?height=40&width=40",
        dialCode: data.data?.user?.dialCode || data.user?.dialCode,
        mobile: data.data?.user?.mobile || data.user?.mobile,
      };

      setUser(newUser);

      // Store user data in localStorage as backup
      localStorage.setItem("user", JSON.stringify(newUser));

      return { success: true, user: newUser };
    } catch (error) {
      console.error("Signup error:", error);
      throw new Error(error.message || "Signup failed");
    }
  };

  const logout = async () => {
    try {
      // Call logout API to clear server-side session/cookie
      await fetch("https://dbcapi.khush.pro/api/v1/users/logout", {
        method: "POST",
        credentials: "include",
      });
    } catch (error) {
      console.error("Logout API error:", error);
    } finally {
      // Clear local state regardless of API call success
      setUser(null);
      localStorage.removeItem("user");
    }
  };

  useEffect(() => {
    const checkAuthStatus = async () => {
      try {
        // First check localStorage for user data
        const storedUser = localStorage.getItem("user");
        if (storedUser) {
          const userData = JSON.parse(storedUser);

          // Verify the session is still valid by calling a protected endpoint
          const response = await fetch(
            "https://dbcapi.khush.pro/api/v1/users/me",
            {
              credentials: "include",
            },
          );

          if (response.ok) {
            const data = await response.json();
            const currentUser = {
              id: data.data?.user?._id || data.user?._id,
              name: data.data?.user?.name || data.user?.name,
              email: data.data?.user?.email || data.user?.email,
              image:
                data.data?.user?.image ||
                data.user?.image ||
                "/placeholder.svg?height=40&width=40",
              dialCode: data.data?.user?.dialCode || data.user?.dialCode,
              mobile: data.data?.user?.mobile || data.user?.mobile,
            };
            setUser(currentUser);
            localStorage.setItem("user", JSON.stringify(currentUser));
          } else {
            // Session expired, clear stored data
            localStorage.removeItem("user");
          }
        }
      } catch (error) {
        console.error("Auth check error:", error);
        localStorage.removeItem("user");
      } finally {
        setLoading(false);
      }
    };

    checkAuthStatus();
  }, []);

  const value = {
    user,
    login,
    signup,
    logout,
    loading,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
