import { Navigate, Outlet } from "react-router-dom";
import { useEffect, useState } from "react";
import { supabase } from "../lib/supabase";

function ProtectedRoute({ allowedRole }) {
  const [user, setUser] = useState(null);
  const [userType, setUserType] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    async function checkUserAndType(currentUser) {
      if (!currentUser) {
        if (isMounted) {
          setUser(null);
          setUserType(null);
          setLoading(false);
        }
        return;
      }

      try {
        const { data: profile, error } = await supabase
          .from("profiles")
          .select("user_type, role")
          .eq("id", currentUser.id)
          .single();

        if (error) {
          console.warn("Could not query profiles table, falling back to auth metadata:", error.message);
        }

        const effectiveType =
          profile?.role === "admin"
            ? "admin"
            : profile?.user_type ||
              currentUser.user_metadata?.user_type ||
              (profile?.role === "faculty" ? "faculty" : "student");

        if (isMounted) {
          setUser(currentUser);
          setUserType(effectiveType);
        }
      } catch (error) {
        console.error("Error fetching user type:", error);
        if (isMounted) {
          setUser(currentUser);
          const fallbackType =
            currentUser.user_metadata?.role === "admin"
              ? "admin"
              : currentUser.user_metadata?.user_type || "student";
          setUserType(fallbackType);
        }
      } finally {
        if (isMounted) setLoading(false);
      }
    }

    async function getInitialUser() {
      try {
        const {
          data: { session },
        } = await supabase.auth.getSession();
        await checkUserAndType(session?.user ?? null);
      } catch (error) {
        console.error("Error fetching user session:", error);
        if (isMounted) setLoading(false);
      }
    }

    getInitialUser();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, session) => {
      // Completely ignore background token refresh events so that alt-tabbing never triggers re-renders or page flickers
      if (event === "TOKEN_REFRESHED" || event === "INITIAL_SESSION") {
        return;
      }

      if (event === "SIGNED_OUT") {
        if (isMounted) {
          setUser(null);
          setUserType(null);
          setLoading(false);
        }
        return;
      }

      if (event === "SIGNED_IN") {
        checkUserAndType(session?.user ?? null);
      }
    });

    return () => {
      isMounted = false;
      subscription.unsubscribe();
    };
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0B120F] flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-[#10B981]"></div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (userType !== allowedRole) {
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
}

export default ProtectedRoute;
