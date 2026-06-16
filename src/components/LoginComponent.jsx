import { useState } from 'react';


export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  return (
    <form >
      <label>Enter your email address:
        <input type="text" value={email} onChange={(e)=>{setEmail(e.target.value)} } />
      </label>
      <label>Enter your password:
        <input type="password" value={password} onChange={(e)=>{setPassword(e.target.value)}}/>
      </label>
      <button>Log In</button>
    </form>
    
  )
 
  ;
}