// AdminSidebar.jsx
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { logout } from '../Slices/UserSlice';
import { FaUser, FaTachometerAlt, FaUsers, FaChartLine, FaSignOutAlt } from 'react-icons/fa';

function AdminSidebar({ activeTab, setActiveTab }) {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleLogout = () => {
    dispatch(logout());
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-gray-800 w-64 text-white flex flex-col">
      <div className="p-4 border-b border-gray-700">
        <h2 className="text-xl font-bold">Admin Panel</h2>
      </div>
      
      <div className="flex-1 overflow-y-auto py-4">
        <ul className="space-y-2 px-2">
          <li>
            <button
              className={`flex items-center w-full p-3 rounded-lg ${activeTab === 'profile' ? 'bg-blue-600' : 'hover:bg-gray-700'}`}
              onClick={() => setActiveTab('profile')}
            >
              <FaUser className="mr-3" />
              <span>Profile</span>
            </button>
          </li>
          
          <li>
            <button
              className={`flex items-center w-full p-3 rounded-lg ${activeTab === 'dashboard' ? 'bg-blue-600' : 'hover:bg-gray-700'}`}
              onClick={() => setActiveTab('dashboard')}
            >
              <FaTachometerAlt className="mr-3" />
              <span>Dashboard</span>
            </button>
          </li>
          
          <li>
            <button
              className={`flex items-center w-full p-3 rounded-lg ${activeTab === 'users' ? 'bg-blue-600' : 'hover:bg-gray-700'}`}
              onClick={() => setActiveTab('users')}
            >
              <FaUsers className="mr-3" />
              <span>User Management</span>
            </button>
          </li>
          
          <li>
            <button
              className={`flex items-center w-full p-3 rounded-lg ${activeTab === 'revenue' ? 'bg-blue-600' : 'hover:bg-gray-700'}`}
              onClick={() => setActiveTab('revenue')}
            >
              <FaChartLine className="mr-3" />
              <span>Revenue</span>
            </button>
          </li>
        </ul>
      </div>
      
      <div className="p-4 border-t border-gray-700">
        <button 
          onClick={handleLogout}
          className="flex items-center w-full p-3 rounded-lg hover:bg-gray-700 text-red-300 hover:text-red-400"
        >
          <FaSignOutAlt className="mr-3" />
          <span>Logout</span>
        </button>
      </div>
    </div>
  );
}

export default AdminSidebar;