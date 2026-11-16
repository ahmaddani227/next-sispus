"use client";

import { useEffect, useState } from "react";
import { getCurrentUserAction } from "../actions/auth.actions";
import type { TokenPayload } from "@/lib/auth/token";

export function useAuthUser() {
  const [user, setUser] = useState<TokenPayload | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    async function fetchUser() {
      try {
        const currentUser = await getCurrentUserAction();
        if (isMounted) {
          setUser(currentUser);
        }
      } catch {
        if (isMounted) {
          setUser(null);
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    }

    fetchUser();

    return () => {
      isMounted = false;
    };
  }, []);

  return { user, isLoading };
}

