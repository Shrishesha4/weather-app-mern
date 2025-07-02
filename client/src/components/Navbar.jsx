import React, { useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import "./Navbar.css";
const Navbar = ({ onShowAuth, onShowFavorites }) => {
  const { user, logout } = useContext(AuthContext);
  return (
    <nav className="navbar">
      <div className="navbar-brand">WeatherApp</div>
      <div className="navbar-links">
        {user ? (
          <>
            {/* <span className="navbar-user">Hi, {user.username}</span> */}
            <button onClick={onShowFavorites} className="navbar-button">
              Favorites
            </button>
            <button onClick={logout} className="navbar-button logout">
              Logout
            </button>
          </>
        ) : (
          <>
            <button
              onClick={() => onShowAuth("login")}
              className="navbar-button"
            >
              Login
            </button>
            <button
              onClick={() => onShowAuth("register")}
              className="navbar-button register"
            >
              Register
            </button>
          </>
        )}
      </div>
    </nav>
  );
};
export default Navbar;
