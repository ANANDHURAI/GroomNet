import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import LogoutIcon from "../authcomponent/LogoutIcon";
import axios from "axios";

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [profileImage, setProfileImage] = useState(null);

  const authInfo = useSelector((state) =>
    state.authLogin?.islogged
      ? state.authLogin
      : { islogged: false, name: "", isAdmin: false }
  );

  const { islogged, name, accessToken, userType } = authInfo;

  useEffect(() => {
    const fetchProfileImage = async () => {
      if (!accessToken) return;

      try {
        const endpoint =
          userType === "customer"
            ? "http://localhost:8000/profile/customer/profile"
            : userType === "barber"
            ? "http://localhost:8000/profile/barber/profile"
            : null;

        if (!endpoint) return;

        const { data } = await axios.get(endpoint, {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        });
        setProfileImage(data.profile_image);
      } catch (error) {
        console.error(`Error fetching profile image:`, error);
      }
    };

    if (islogged) {
      fetchProfileImage();
    }
  }, [accessToken, userType, islogged]);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const getProfileLink = () => {
    if (userType === "customer") return "/profile/customer";
    if (userType === "barber") return "/profile/barber";
    return "/login";
  };

  return (
    <nav className="bg-white shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <div className="flex-shrink-0 flex items-center">
              <Link to="/" className="text-blue-600 font-bold text-xl">
                GroomNet
              </Link>
            </div>
          </div>

          {/* Desktop navigation */}
          <div className="hidden md:flex items-center space-x-4">
            {islogged ? (
              <>
                <Link
                  to="/home"
                  className="text-gray-600 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium"
                >
                  Home
                </Link>
                <Link to={getProfileLink()}>
                  <img
                    src={profileImage || "/default-profile.png"}
                    alt="Profile"
                    className="w-8 h-8 rounded-full border border-gray-300 object-cover hover:scale-105 transition-transform"
                  />
                </Link>

                <div className="flex items-center space-x-2">
                  <span className="text-gray-700 font-medium">{name}</span>
                  <LogoutIcon />
                </div>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  className="text-gray-600 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium"
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-2 rounded-md text-sm font-medium"
                >
                  Register
                </Link>
              </>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="flex items-center md:hidden">
            <button
              onClick={toggleMenu}
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-blue-500"
              aria-expanded="false"
            >
              <span className="sr-only">Open main menu</span>
              <svg
                className={`${isMenuOpen ? "hidden" : "block"} h-6 w-6`}
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                aria-hidden="true"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
              </svg>
              <svg
                className={`${isMenuOpen ? "block" : "hidden"} h-6 w-6`}
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                aria-hidden="true"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      <div className={`${isMenuOpen ? "block" : "hidden"} md:hidden`}>
        <div className="pt-2 pb-3 space-y-1">
          {islogged ? (
            <>
              <Link
                to="/home"
                className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-50"
              >
                Home
              </Link>
              <Link to={getProfileLink()} className="block px-3 py-2">
                <img
                  src={profileImage || "/default-profile.png"}
                  alt="Profile"
                  className="w-8 h-8 rounded-full border border-gray-300 object-cover"
                />
              </Link>
              <div className="flex items-center justify-between px-3 py-2">
                <span className="text-gray-700 font-medium">{name}</span>
                <LogoutIcon />
              </div>
            </>
          ) : (
            <>
              <Link
                to="/login"
                className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-50"
              >
                Login
              </Link>
              <Link
                to="/register"
                className="block px-3 py-2 rounded-md text-base font-medium bg-blue-600 text-white hover:bg-blue-700"
              >
                Register
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
