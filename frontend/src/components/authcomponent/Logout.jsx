// Logout.jsx
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { authLogoutSlice } from "../../slices/authSlices/authLogoutSlice";

const Logout = ({ buttonStyle }) => {
  const [isLoading, setIsLoading] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { isAdmin, refreshToken } = useSelector((state) =>
  state.authLogin?.islogged
    ? state.authLogin
    : state.authAdminLogin?.islogged
    ? state.authAdminLogin
    : { isAdmin: false, refreshToken: "" }
);

  
  // Default button styles if none provided
  const defaultButtonStyle = "bg-red-600 hover:bg-red-700 text-white font-medium py-2 px-4 rounded";
  const buttonClassName = buttonStyle || defaultButtonStyle;

  const handleLogout = async () => {
    setIsLoading(true);
    
    try {
      // Call the backend logout endpoint to blacklist the token
      await axios.post(
        "http://localhost:8000/logout/",
        { refresh_token: refreshToken },
        {
          headers: {
            "Content-Type": "application/json"
          }
        }
      );
      
      // Clear axios default authorization header
      axios.defaults.headers.common["Authorization"] = null;
      
      // Clear localStorage
      localStorage.removeItem("access_token");
      localStorage.removeItem("refresh_token");
      localStorage.removeItem("user");
      
      // Dispatch logout action to clear Redux state
      dispatch(authLogoutSlice());
      
      // Redirect based on user type
      if (isAdmin) {
        navigate("/admin/login");
      } else {
        navigate("/login");
      }
    } catch (error) {
      console.error("Logout error:", error);
      
      // Even if the server-side logout fails, still clear client-side state
      localStorage.removeItem("access_token");
      localStorage.removeItem("refresh_token");
      localStorage.removeItem("user");
      
      dispatch(authLogoutSlice());
      navigate("/login");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <button
      onClick={handleLogout}
      disabled={isLoading}
      className={`${buttonClassName} ${isLoading ? "opacity-70 cursor-not-allowed" : ""}`}
    >
      {isLoading ? "Logging out..." : "Logout"}
    </button>
  );
};

// LogoutIcon - Minimal version for navbar/header
const LogoutIcon = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { isAdmin, refreshToken } = useSelector(state => state.auth);

  const handleLogout = async () => {
    try {
      await axios.post(
        "http://localhost:8000/logout/",
        { refresh_token: refreshToken },
        {
          headers: {
            "Content-Type": "application/json"
          }
        }
      );
      
      axios.defaults.headers.common["Authorization"] = null;
      localStorage.removeItem("access_token");
      localStorage.removeItem("refresh_token");
      localStorage.removeItem("user");
      
      dispatch(authLogoutSlice());
      
      if (isAdmin) {
        navigate("/admin/login");
      } else {
        navigate("/login");
      }
    } catch (error) {
      console.error("Logout error:", error);
      localStorage.removeItem("access_token");
      localStorage.removeItem("refresh_token");
      localStorage.removeItem("user");
      
      dispatch(logout());
      navigate("/login");
    }
  };

  return (
    <button
      onClick={handleLogout}
      className="text-gray-600 hover:text-gray-900 focus:outline-none"
      title="Logout"
    >
      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
        />
      </svg>
    </button>
  );
};

export { Logout, LogoutIcon };