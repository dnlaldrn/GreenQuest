import { supabase } from "../lib/supabase";

export async function signUp(username, email, password, userType) {
 const { data, error } = await supabase.auth.signUp({
  email,
  password,
  options: {
    data: {
      user_type: userType,
      username: username,
    },
  },
});

  return { data, error };
}

export async function signIn(email, password) {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  return { data, error };
}

export async function AdminsignIn(adminemail, adminpassword) {
  const { data, error } = await supabase.auth.signInWithPassword({
    email: adminemail,
    password: adminpassword,
  });

  return { data, error };
}

export async function signOut() {
  const { error } = await supabase.auth.signOut();
  return { error };
}

export async function getCurrentUser() {
    const { data, error } = await supabase.auth.getUser();
    return { data, error };
}