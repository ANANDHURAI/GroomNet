import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { logout } from '../../slices/authSlices/authLogoutSlice';

const AdminNavbar = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { name } = useSelector((state) => state.authAdminLogin || {});
  const { profile } = useSelector((state) => state.adminProfile || {});
  
  const handleLogout = () => {
    dispatch(logout());
    navigate('/aadmin/login');
  };

  // Function to navigate to admin profile
  const goToProfile = () => {
    navigate('/profile/admin');
  };

  return (
    <nav className="bg-white shadow">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 justify-between items-center">
          <div className="flex items-center">
            <Link to="/admin/dashboard" className="text-xl font-bold text-gray-800">
              Admin Dashboard
            </Link>
          </div>
          
          <div className="flex items-center space-x-4">
            <span className="text-sm font-medium text-gray-700">Hello, {name || 'Admin'}</span>
            
            <div className="relative">
              {/* Using onClick instead of Link for more reliable navigation */}
              <button 
                onClick={goToProfile} 
                className="group flex items-center focus:outline-none"
              >
                <div className="h-8 w-8 rounded-full overflow-hidden border-2 border-gray-300 flex items-center justify-center bg-gray-100">
                  {profile?.profile_image ? (
                    <img 
                      src={profile.profile_image} 
                      alt={`${name || 'Admin'}'s profile`}
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <span className="text-gray-600 text-sm font-medium">
                      {name ? name.charAt(0).toUpperCase() : 'A'}
                    </span>
                  )}
                </div>
                <span className="ml-1 text-xs text-gray-500 group-hover:text-gray-700">Profile</span>
              </button>
            </div>
            
            <button
              onClick={handleLogout}
              className="px-3 py-1 text-sm rounded-md bg-red-600 hover:bg-red-700 text-white transition-all duration-200"
            >
              Logout
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default AdminNavbar;