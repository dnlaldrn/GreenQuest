import { Navigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { supabase } from "../lib/supabase";

function ProtectedRoute({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // 1. Get initial session status
    async function getInitialUser() {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        setUser(user);
      } catch (error) {
        console.error("Error fetching user session:", error);
      } finally {
        setLoading(false);
      }
    }

    getInitialUser();

    // 2. Listen for real-time auth changes (sign-in, sign-out, token refresh)
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
      setLoading(false); // Safeguard in case listener fires before async function resolves
    });

    // 3. Clean up subscription on unmount
    return () => {
      subscription.unsubscribe();
    };
  }, []);

  // Show a loading indicator while Supabase determines the auth state
  if (loading) {
    return (
      <div className="min-h-screen bg-[#0B120F] flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-[#10B981]"></div>
      </div>
    );
  }

  // Once loading is false, either allow entry or redirect
  return user ? children : <Navigate to="/login" replace />;
}

export default ProtectedRoute;