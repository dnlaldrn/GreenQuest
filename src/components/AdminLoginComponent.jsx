import { useState } from 'react';
import {AdminsignIn} from '../services/authService'
import { useNavigate } from "react-router-dom";



export default function AdminLogin() {
    const navigate = useNavigate()
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null)
   const [loading, setLoading] = useState(false)

  const handleAdminLogin = async (e)=>{
  e.preventDefault();
     
       try {
         setLoading(true);
         setError(null);
     
         const result = await AdminsignIn(email, password);
     
         if (result.error) {
           setError(result.error.message);
           return;
         }
     
         navigate("/adminDasboard");
       } catch (err) {
         setError(err.message);
       } finally {
         setLoading(false);
       }
  }

  return (
    <form
  onSubmit={handleAdminLogin}
  className="max-w-md mx-auto mt-20 p-8 bg-white rounded-xl shadow-lg flex flex-col gap-4"
>
  <h2 className="text-2xl font-bold text-center text-gray-800">
    Admin Login
  </h2>

  {error && (
    <p className="bg-red-100 text-red-700 p-3 rounded-md text-sm">
      {error}
    </p>
  )}

  <div className="flex flex-col gap-1">
    <label className="text-sm font-medium text-gray-700">
      Admin Email
    </label>
    <input
      type="email"
      value={email}
      onChange={(e) => setEmail(e.target.value)}
      className="border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
      placeholder="Enter your email"
    />
  </div>

  <div className="flex flex-col gap-1">
    <label className="text-sm font-medium text-gray-700">
      Admin Password
    </label>
    <input
      type="password"
      value={password}
      onChange={(e) => setPassword(e.target.value)}
      className="border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
      placeholder="Enter your password"
    />
  </div>

  <button
    type="submit"
    disabled={loading}
    className="bg-green-600 text-white py-2 rounded-lg font-medium hover:bg-green-700 transition disabled:bg-gray-400 disabled:cursor-not-allowed"
  >
    {loading ? "Logging in..." : "Log In"}
  </button>
</form>
    
  )
 
  ;
}