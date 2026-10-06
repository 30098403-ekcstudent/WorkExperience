import { Link } from "react-router-dom";

function Navbar() {
  return (
    <nav className="navbar" id="the-navbar">
      <ul>
        <li><Link to="/">Home</Link></li>
        <li className="right"><Link to="/login">Log In</Link></li>
        <li className="right"><Link to="/signup">Sign Up</Link></li>

      </ul>
    </nav>
    );
}

export default Navbar;