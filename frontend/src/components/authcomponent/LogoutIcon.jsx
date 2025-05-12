import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { logout } from "../../slices/authSlices/authLogoutSlice";

const LogoutIcon = () => {
  const [isLoading, setIsLoading] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  
  // Access both auth slices correctly
  const { isAdmin, refreshToken } = useSelector((state) =>
    state.authLogin?.islogged
      ? state.authLogin
      : state.authAdminLogin?.islogged
      ? state.authAdminLogin
      : { isAdmin: false, refreshToken: "" }
  );

  const handleLogout = async () => {
    if (isLoading) return; // Prevent multiple clicks
    setIsLoading(true);
    
    try {
      // Only make the API call if we have a refresh token
      if (refreshToken) {
        await axios.post(
          "http://localhost:8000/logout/",
          { refresh_token: refreshToken },
          {
            headers: {
              "Content-Type": "application/json"
            }
          }
        );
      }
      
      // Clear auth header
      axios.defaults.headers.common["Authorization"] = null;
      
      // Clear local storage
      localStorage.removeItem("access_token");
      localStorage.removeItem("refresh_token");
      localStorage.removeItem("user");
      
      // Dispatch the correct action
      dispatch(logout());
      
      // Navigate based on user type
      if (isAdmin) {
        navigate("/admin/login");
      } else {
        navigate("/login");
      }
    } catch (error) {
      console.error("Logout error:", error);
      
      // Clean up local storage even on error
      localStorage.removeItem("access_token");
      localStorage.removeItem("refresh_token");
      localStorage.removeItem("user");
      
      // Dispatch the correct action on error too
      dispatch(logout());
      navigate("/login");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <button
      onClick={handleLogout}
      className="text-gray-600 hover:text-gray-900 focus:outline-none"
      title="Logout"
      disabled={isLoading}
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

export default LogoutIcon;