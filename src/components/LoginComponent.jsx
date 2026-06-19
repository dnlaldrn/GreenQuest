import { useState } from 'react';
import {signIn} from '../services/authService'
import { useNavigate } from "react-router-dom";



export default function Login() {
  const navigate = useNavigate()
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null)
   const [loading, setLoading] = useState(false)

  
  const handleSignIn = async (e) =>{
     e.preventDefault();
    
      try {
        setLoading(true);
        setError(null);
    
        const result = await signIn(email, password);
    
        if (result.error) {
          setError(result.error.message);
          return;
        }
    
        navigate("/userDasboard");
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
  }
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-100 to-emerald-200">
  <form
    onSubmit={handleSignIn}
    className="w-full max-w-md bg-white p-8 rounded-xl shadow-lg flex flex-col gap-4"
  >
    <h2 className="text-2xl font-bold text-center text-green-700">
      User Login
    </h2>

    {error && (
      <p className="bg-red-100 text-red-700 p-3 rounded-md text-sm">
        {error}
      </p>
    )}

    <div className="flex flex-col gap-1">
      <label className="text-sm font-medium text-gray-700">
        Email Address
      </label>
      <input
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="Enter your email"
        className="border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
      />
    </div>

    <div className="flex flex-col gap-1">
      <label className="text-sm font-medium text-gray-700">
        Password
      </label>
      <input
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        placeholder="Enter your password"
        className="border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
      />
    </div>

    <button
      type="submit"
      disabled={loading}
      className="bg-green-600 text-white py-2 rounded-lg font-medium hover:bg-green-700 transition disabled:bg-gray-400 disabled:cursor-not-allowed"
    >
      {loading ? "Logging in..." : "Log in"}
    </button>
  </form>
</div>
    
  )
 
  ;
}