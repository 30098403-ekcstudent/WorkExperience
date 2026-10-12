import { Link } from "react-router-dom";

function Navbar({ user, onLogout }) {

  async function handleLogout() {
    try {
      const response = await fetch("http://localhost:3000/logout", {
        method: "POST",
        credentials: "include"
      });

      const data = await response.text();
      console.log("Logout response:", response.status, data);
      if (response.ok) {
        onLogout();
      } else {
        console.error("Logout failed:", data);
      }
    } catch (error) {
      console.error("Could not contact the server:", error);
    }
  }

  return (
    <nav className="navbar" id="the-navbar">
      <ul>
        <li><Link to="/">Home</Link></li>

        {user ? (
          <li className="right">
            Welcome, {user.username}!
            {" "}

            <Link to="/login" onClick={(e) => {
              e.preventDefault();
              handleLogout();
            }}>
              Log Out
            </Link>
          </li>
        ) : (
          <>
            <li className="right">
              <Link to="/login">Log In</Link>
            </li>
            <li className="right">
              <Link to="/signup">Sign Up</Link>
            </li>
          </>
        )}
      </ul>
    </nav>
  );
}

export default Navbar;