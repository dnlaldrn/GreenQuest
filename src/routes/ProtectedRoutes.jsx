import { Navigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { supabase } from "../lib/supabase";

function ProtectedRoute({ children }) {
  const [user, setUser] = useState(undefined);

  useEffect(() => {
    async function checkUser() {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      setUser(user);
    }

    checkUser();
  }, []);

  if (user === undefined) {
    return <p>Loading...</p>;
  }

  return user ? children : <Navigate to="/login" />;
}

export default ProtectedRoute;