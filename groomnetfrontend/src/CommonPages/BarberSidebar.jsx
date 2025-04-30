
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';

import { logout } from '../Slices/UserSlice';
import { 
  FaUser, 
  FaTachometerAlt, 
  FaCalendarAlt, 
  FaMoneyBillWave, 
  FaCut,
  FaSignOutAlt 
} from 'react-icons/fa';

function BarberSidebar({ activeTab, setActiveTab }) {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleLogout = () => {
    dispatch(logout());
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-900 to-indigo-800 w-64 text-white flex flex-col">
      <div className="p-6 border-b border-blue-700 flex items-center">
        <FaCut className="text-2xl mr-3" />
        <h2 className="text-xl font-bold">Barber Portal</h2>
      </div>
      
      <div className="flex-1 overflow-y-auto py-6">
        <ul className="space-y-3 px-4">
          <li>
            <button
              className={`flex items-center w-full p-3 rounded-lg transition-colors ${activeTab === 'profile' ? 'bg-blue-600' : 'hover:bg-blue-700'}`}
              onClick={() => setActiveTab('profile')}
            >
              <FaUser className="mr-3" />
              <span>My Profile</span>
            </button>
          </li>
          
          <li>
            <button
              className={`flex items-center w-full p-3 rounded-lg transition-colors ${activeTab === 'dashboard' ? 'bg-blue-600' : 'hover:bg-blue-700'}`}
              onClick={() => setActiveTab('dashboard')}
            >
              <FaTachometerAlt className="mr-3" />
              <span>Dashboard</span>
            </button>
          </li>
          
          <li>
            <button
              className={`flex items-center w-full p-3 rounded-lg transition-colors ${activeTab === 'appointments' ? 'bg-blue-600' : 'hover:bg-blue-700'}`}
              onClick={() => setActiveTab('appointments')}
            >
              <FaCalendarAlt className="mr-3" />
              <span>Appointments</span>
            </button>
          </li>
          
          <li>
            <button
              className={`flex items-center w-full p-3 rounded-lg transition-colors ${activeTab === 'earnings' ? 'bg-blue-600' : 'hover:bg-blue-700'}`}
              onClick={() => setActiveTab('earnings')}
            >
              <FaMoneyBillWave className="mr-3" />
              <span>Earnings</span>
            </button>
          </li>
        </ul>
      </div>
      
      <div className="p-4 border-t border-blue-700">
        <button 
          onClick={handleLogout}
          className="flex items-center w-full p-3 rounded-lg hover:bg-blue-700 text-blue-200 hover:text-white transition-colors"
        >
          <FaSignOutAlt className="mr-3" />
          <span>Logout</span>
        </button>
      </div>
    </div>
  );
}

export default BarberSidebar;
