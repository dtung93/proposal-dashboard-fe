import React, {
  createContext,
  useState,
  useEffect,
  useCallback,
  ReactNode,
} from "react";
import { User } from "../types";
import { login, getMe } from "../services/api";
import { getAuthToken, removeAuthToken, setAuthToken } from "./authService";

interface AuthContextType {
  isAuthenticated: boolean;
  user: User | null;
  login: (credentials: { email: string; password: string }) => Promise<void>;
  logout: () => void;
  isLoading: boolean;
}

export const AuthContext = createContext<AuthContextType | undefined>(
  undefined
);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [user, setUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const verifyAuth = useCallback(async () => {
    setIsLoading(true);
    const token = getAuthToken();
    if (token) {
      try {
        const userData = await getMe();
        setUser(userData);
        setIsAuthenticated(true);
      } catch (error) {
        console.error("Auth verification failed", error);
        removeAuthToken();
        setUser(null);
        setIsAuthenticated(false);
      }
    } else {
      setUser(null);
      setIsAuthenticated(false);
    }
    setIsLoading(false);
  }, []);

  useEffect(() => {
    verifyAuth();
  }, [verifyAuth]);

  const handleLogin = async (credentials: {
    email: string;
    password: string;
  }) => {
    const { access_token } = await login(credentials);
    setAuthToken(access_token);
    await verifyAuth();
  };

  const logout = () => {
    removeAuthToken();
    setUser(null);
    setIsAuthenticated(false);
  };

  const value = {
    isAuthenticated,
    user,
    login: handleLogin,
    logout,
    isLoading,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
