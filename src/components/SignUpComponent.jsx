import { useState } from "react";
import { supabase } from "../lib/supabase";

export default function Register() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  async function handleRegister(e) {
    e.preventDefault();

    const { error } = await supabase.auth.signUp({
      email,
      password,
    });

    if (error) {
      alert(error.message);
    } else {
      alert("Registration successful!");
    }
  }

  return (
    <form onSubmit={handleRegister}>
      <input
        type="email"
        onChange={(e) => setEmail(e.target.value)}
      />

      <input
        type="password"
        onChange={(e) => setPassword(e.target.value)}
      />

      <button type="submit">
        Register
      </button>
    </form>
  );
}