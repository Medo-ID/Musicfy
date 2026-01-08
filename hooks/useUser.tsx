import { Subscription, UserDetails } from "@/types";
import { createContext, useContext, useEffect, useState } from "react";
import { Session, User } from "@supabase/supabase-js";
import { createClient } from "@/utils/supabase/client";

type UserContextType = {
  accessToken: string | null;
  user: User | null;
  userDetails: UserDetails | null;
  isLoading: boolean;
  subscription: Subscription | null;
};

export const UserContext = createContext<UserContextType | undefined>(
  undefined
);

export const MyUserContextProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const supabase = createClient();

  const [session, setSession] = useState<Session | null>(null);
  const [userDetails, setUserDetails] = useState<UserDetails | null>(null);
  const [subscription, setSubscription] = useState<Subscription | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [hasCheckedAuth, setHasCheckedAuth] = useState(false);

  const user = session?.user ?? null;

  // Fetch session once + listen to changes
  useEffect(() => {
    let mounted = true;

    supabase.auth.getSession().then(({ data }) => {
      if (!mounted) return;
      setSession(data.session ?? null);
      setHasCheckedAuth(true);
      setIsLoading(false);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, [supabase]);

  // Fetch user-related data only when authenticated
  useEffect(() => {
    if (!hasCheckedAuth || !user) {
      setUserDetails(null);
      setSubscription(null);
      return;
    }

    let cancelled = false;
    setIsLoading(true);

    Promise.allSettled([
      supabase.from("users").select("*").single(),
      supabase
        .from("subscriptions")
        .select("*, prices(*, products(*))")
        .in("status", ["trialing", "active"])
        .single(),
    ]).then((results) => {
      if (cancelled) return;

      const [userDetailsRes, subscriptionRes] = results;

      if (userDetailsRes.status === "fulfilled") {
        setUserDetails(userDetailsRes.value.data as UserDetails);
      }

      if (subscriptionRes.status === "fulfilled") {
        setSubscription(subscriptionRes.value.data as Subscription);
      }

      setIsLoading(false);
    });

    return () => {
      cancelled = true;
    };
  }, [user, hasCheckedAuth, supabase]);

  const value: UserContextType = {
    accessToken: session?.access_token ?? null,
    user,
    userDetails,
    subscription,
    isLoading,
  };

  return <UserContext.Provider value={value}>{children}</UserContext.Provider>;
};

export const useUser = () => {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error("useUser must be used within a MyUserContextProvider");
  }

  return context;
};
