import { Outlet, Link } from "react-router-dom";

export default function MainLayout() {
  return (
    <>
      <nav style={{ padding: "1rem", borderBottom: "1px solid #ccc", display: "flex", gap: "10px" }}>
        <Link to="/login">Login</Link>
        <Link to="/signup">Sign Up</Link>
        <Link to="/dashboard">Dashboard</Link>
      </nav>
      <main>
        <Outlet />
      </main>
    </>
  );
}