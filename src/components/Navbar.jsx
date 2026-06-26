import { Link } from "react-router-dom";

export default function Navbar(){
    return(
        <nav>
            <Link to="/">GreenQuest</Link>
            <div>
                <Link to="/login">Login</Link>
                <Link to="/signup">Sign Up</Link>
            </div>
        </nav>
    )
}