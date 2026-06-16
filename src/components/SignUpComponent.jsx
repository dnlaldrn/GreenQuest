

export default function SignUpComponent() {
  return (
     <form className="h-screen flex">
      <label>Enter your username:
        <input type="text" />
      </label>
      <label>Enter your email address:
        <input type="text" />
      </label>
      <label>Enter your password:
        <input type="password" />
      </label>
      <label>Confirm your password:
        <input type="password" />
      </label>
      <button>Sign Up</button>
    </form>
  )
 
  ;
}