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
          .select("user_type")
          .eq("id", currentUser.id)
          .single();

        if (error) throw error;

        if (isMounted) {
          setUser(currentUser);
          setUserType(profile?.user_type ?? null);
        }
      } catch (error) {
        console.error("Error fetching user type:", error);
        if (isMounted) {
          setUser(currentUser);
          setUserType(null);
        }
      } finally {
        if (isMounted) setLoading(false);
      }
    }

    async function getInitialUser() {
      try {
        const {
          data: { user },
        } = await supabase.auth.getUser();
        await checkUserAndType(user);
      } catch (error) {
        console.error("Error fetching user session:", error);
        if (isMounted) setLoading(false);
      }
    }

    getInitialUser();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setLoading(true);
      checkUserAndType(session?.user ?? null);
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
