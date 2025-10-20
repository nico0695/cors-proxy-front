"use client";

import { createContext, useContext, useState, useEffect, useCallback } from "react";
import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import type { PublicUser, LoginPayload, RegisterPayload } from "@/lib/types";
import { api } from "@/lib/api";
import {
  setSession,
  clearSession,
  getStoredUser,
  getAccessToken,
  getRefreshToken,
  isTokenExpired,
  scheduleTokenRefresh,
  cancelTokenRefresh,
} from "@/lib/auth";
import toast from "react-hot-toast";

type AuthStatus = "loading" | "authenticated" | "unauthenticated";

interface AuthContextType {
  user: PublicUser | null;
  status: AuthStatus;
  login: (payload: LoginPayload) => Promise<void>;
  register: (payload: RegisterPayload) => Promise<void>;
  logout: () => void;
  refreshSession: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<PublicUser | null>(null);
  const [status, setStatus] = useState<AuthStatus>("loading");
  const router = useRouter();

  const refreshSession = useCallback(async () => {
    const refreshToken = getRefreshToken();
    if (!refreshToken) {
      throw new Error("No refresh token");
    }

    const response = await api.refresh(refreshToken);
    setSession(
      {
        accessToken: response.accessToken,
        refreshToken: response.refreshToken,
      },
      response.user
    );
    setUser(response.user);

    scheduleTokenRefresh(response.accessToken, refreshSession);
  }, []);

  useEffect(() => {
    const initAuth = async () => {
      const storedUser = getStoredUser();
      const accessToken = getAccessToken();
      const refreshToken = getRefreshToken();

      if (!storedUser || !accessToken || !refreshToken) {
        setStatus("unauthenticated");
        return;
      }

      if (isTokenExpired(accessToken)) {
        try {
          await refreshSession();
          setStatus("authenticated");
        } catch (error) {
          console.error("Failed to refresh session:", error);
          clearSession();
          setUser(null);
          setStatus("unauthenticated");
        }
      } else {
        setUser(storedUser);
        setStatus("authenticated");
        scheduleTokenRefresh(accessToken, refreshSession);

        // If user is blocked, redirect to blocked page
        if (storedUser.status === "blocked") {
          router.push("/blocked");
        }
      }
    };

    initAuth();

    return () => {
      cancelTokenRefresh();
    };
  }, [refreshSession]);

  const loginMutation = useMutation({
    mutationFn: api.login,
    onSuccess: (data) => {
      setSession(
        {
          accessToken: data.accessToken,
          refreshToken: data.refreshToken,
        },
        data.user
      );
      setUser(data.user);
      setStatus("authenticated");
      scheduleTokenRefresh(data.accessToken, refreshSession);

      // Check if user is blocked
      if (data.user.status === "blocked") {
        toast.error("Your account is blocked. Please contact an administrator.");
        router.push("/blocked");
      } else {
        toast.success(`Welcome back, ${data.user.name}!`);
        router.push("/");
      }
    },
    onError: (error: Error) => {
      toast.error(error.message || "Login failed");
    },
  });

  const registerMutation = useMutation({
    mutationFn: api.register,
    onSuccess: (data) => {
      setSession(
        {
          accessToken: data.accessToken,
          refreshToken: data.refreshToken,
        },
        data.user
      );
      setUser(data.user);
      setStatus("authenticated");
      scheduleTokenRefresh(data.accessToken, refreshSession);

      // Registration creates blocked users by default
      toast.success("Account created! Waiting for administrator approval.");
      router.push("/blocked");
    },
    onError: (error: Error) => {
      toast.error(error.message || "Registration failed");
    },
  });

  const login = useCallback(
    async (payload: LoginPayload) => {
      await loginMutation.mutateAsync(payload);
    },
    [loginMutation]
  );

  const register = useCallback(
    async (payload: RegisterPayload) => {
      await registerMutation.mutateAsync(payload);
    },
    [registerMutation]
  );

  const logout = useCallback(() => {
    clearSession();
    setUser(null);
    setStatus("unauthenticated");
    cancelTokenRefresh();
    toast.success("Logged out successfully");
    router.push("/auth");
  }, [router]);

  const value: AuthContextType = {
    user,
    status,
    login,
    register,
    logout,
    refreshSession,
  };

  return (
    <AuthContext.Provider value={value}>
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
