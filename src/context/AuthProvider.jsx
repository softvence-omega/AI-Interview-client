// context/AuthContext.js
import { createContext, useContext, useState, useEffect } from "react";

// Create context
export const AuthContext = createContext();

// AuthProvider component
export const AuthProvider = ({ children }) => {
  // Initialize user from localStorage
  const [user, setUser] = useState(() => {
    const storedUser = localStorage.getItem("userData");
    return storedUser ? JSON.parse(storedUser) : null;
  });

  // Initialize otpToken from localStorage
  const [otpToken, setOtpToken] = useState(() => {
    const storedOTP = localStorage.getItem("OTPtoken");
    return storedOTP ? JSON.parse(storedOTP) : null;
  });

  // Sync user to localStorage
  useEffect(() => {
    if (user) {
      localStorage.setItem("userData", JSON.stringify(user));
    } else {
      localStorage.removeItem("userData");
    }
  }, [user]);

  // Sync otpToken to localStorage
  useEffect(() => {
    if (otpToken) {
      localStorage.setItem("OTPtoken", JSON.stringify(otpToken));
    } else {
      localStorage.removeItem("OTPtoken");
    }
  }, [otpToken]);

  // Values passed to context consumers
  const values = {
    user,
    setUser,
    otpToken,
    setOtpToken,
  };

  return (
    <AuthContext.Provider value={values}>
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook for easier use
export const useAuth = () => useContext(AuthContext);
