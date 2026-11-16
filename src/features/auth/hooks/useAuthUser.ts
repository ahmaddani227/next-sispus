"use client";

import { useEffect } from "react";
import { useAuthStore } from "../stores/useAuthStore";

export function useAuthUser() {
  const { user, isLoading, isInitialized, fetchUser, setUser, clearUser } =
    useAuthStore();

  useEffect(() => {
    if (!isInitialized && !isLoading) {
      fetchUser();
    }
  }, [isInitialized, isLoading, fetchUser]);

  return { user, isLoading, fetchUser, setUser, clearUser };
}
