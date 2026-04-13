import { useNavigate, useLocation } from "react-router-dom";
import "./Navbar.css";

const Navbar = ({ user, onLogout }) => {
  const navigate = useNavigate();
  const location = useLocation();

  const isLoginPage = location.pathname === "/login";

  const getInitials = () => {
    if (!user) return "";
    const first = user.firstName ? user.firstName[0] : "";
    const last = user.lastName ? user.lastName[0] : "";
    return (first + last).toUpperCase();
  };

  if (!user || isLoginPage) return null;

  return (
    <nav className="navbar">
      <div className="nav-links">
        <div className="nav-user-area">
          <div
            className="nav-avatar"
            title={`${user.firstName} ${user.lastName}`}
          >
            {getInitials()}
          </div>

          <span className="nav-username">
            {user.firstName} {user.lastName}
          </span>

          <button
            className="nav-logout-btn"
            onClick={() => {
              onLogout();
              navigate("/login");
            }}
          >
            Logout
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;