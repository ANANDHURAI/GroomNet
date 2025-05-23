import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { logout } from "../../slices/authSlices/authLogoutSlice";

const Logout = ({ buttonStyle }) => {
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
  
  const defaultButtonStyle = "bg-red-600 hover:bg-red-700 text-white font-medium py-2 px-4 rounded";
  const buttonClassName = buttonStyle || defaultButtonStyle;

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
      disabled={isLoading}
      className={`${buttonClassName} ${isLoading ? "opacity-70 cursor-not-allowed" : ""}`}
    >
      {isLoading ? "Logging out..." : "Logout"}
    </button>
  );
};

export default Logout;