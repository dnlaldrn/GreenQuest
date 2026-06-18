import { useState } from 'react';

export default function SignUpComponent() {
  const [username, setUserName] = useState("")
   const [email, setEmail] = useState("")
   const [password, setPassword] = useState("")
  return (
     <form className="h-screen flex">
      <label>Enter your username:
        <input type="text" value={username} onChange={(e)=>{setUserName(e.target.value)}}/>
      </label>
      <label>Enter your email address:
        <input type="text" value={email} onChange={(e)=>{setEmail(e.target.value)}} />
      </label>
      <label>Enter your password:
        <input type="password"  value={password} onChange={(e)=>{setPassword(e.target.value)}} />
      </label>
      <label>Confirm your password:
        <input type="password" />
      </label>
      <button>Sign Up</button>
    </form>
  )
 
  ;
}