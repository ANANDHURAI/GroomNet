import React, { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { logout } from '../Slices/UserSlice';

function Home() {
  const dispatch = useDispatch();
  const user = useSelector(state => state.user);
  const navigate = useNavigate();
  
  // Get user data from either Redux or localStorage
  const userDataFromStorage = localStorage.getItem('userData');
  const userData = user.islogged ? user : (userDataFromStorage ? JSON.parse(userDataFromStorage) : null);
  
  useEffect(() => {
    // Redirect if not logged in
    if (!userData && !localStorage.getItem('accessToken')) {
      navigate('/');
    }
  }, [userData, navigate]);

  const handleLogout = () => {
    dispatch(logout());
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('userData');
    navigate('/');
  };

  if (!userData) return (
    <div className="flex justify-center items-center h-screen bg-gray-100">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
    </div>
  );

  // Render content based on user type
  const renderUserTypeContent = () => {
    const userType = userData.user_type || userData.userType;

    switch(userType) {
      case 'admin':
        return (
          <div className="bg-indigo-50 p-6 rounded-lg mb-6">
            <h3 className="text-xl font-bold text-indigo-800 mb-3">Admin Dashboard</h3>
            <p className="text-indigo-700">Welcome to the admin panel. Here you can manage users, barbers, and system settings.</p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
              <div className="bg-white p-4 rounded shadow-sm">
                <h4 className="font-medium text-gray-800">Total Users</h4>
                <p className="text-2xl font-bold text-indigo-600">125</p>
              </div>
              <div className="bg-white p-4 rounded shadow-sm">
                <h4 className="font-medium text-gray-800">Active Barbers</h4>
                <p className="text-2xl font-bold text-indigo-600">32</p>
              </div>
              <div className="bg-white p-4 rounded shadow-sm">
                <h4 className="font-medium text-gray-800">Appointments Today</h4>
                <p className="text-2xl font-bold text-indigo-600">18</p>
              </div>
            </div>
          </div>
        );
      
      case 'barber':
        return (
          <div className="bg-green-50 p-6 rounded-lg mb-6">
            <h3 className="text-xl font-bold text-green-800 mb-3">Barber Dashboard</h3>
            <p className="text-green-700">Manage your appointments and client bookings from here.</p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
              <div className="bg-white p-4 rounded shadow-sm">
                <h4 className="font-medium text-gray-800">Today's Appointments</h4>
                <p className="text-2xl font-bold text-green-600">5</p>
              </div>
              <div className="bg-white p-4 rounded shadow-sm">
                <h4 className="font-medium text-gray-800">Current Rating</h4>
                <p className="text-2xl font-bold text-green-600">4.8/5.0</p>
              </div>
            </div>
            <div className="mt-4">
              <button className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-md mr-2">
                Set Availability
              </button>
              <button className="px-4 py-2 bg-green-100 text-green-800 border border-green-300 rounded-md">
                View Schedule
              </button>
            </div>
          </div>
        );
      
      default: // customer
        return (
          <div className="bg-blue-50 p-6 rounded-lg mb-6">
            <h3 className="text-xl font-bold text-blue-800 mb-3">Customer Dashboard</h3>
            <p className="text-blue-700">Book appointments with your favorite barbers and manage your profile.</p>
            <div className="mt-4">
              <button className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md mr-2">
                Book Appointment
              </button>
              <button className="px-4 py-2 bg-blue-100 text-blue-800 border border-blue-300 rounded-md">
                View History
              </button>
            </div>
          </div>
        );
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <header className="bg-white shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-800">Groom Net</h1>
          <button 
            onClick={handleLogout}
            className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-md transition duration-300"
          >
            Logout
          </button>
        </div>
      </header>

      {/* Main content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white shadow-lg rounded-lg overflow-hidden">
          <div className="p-8">
            <div className="text-center">
              <h2 className="text-3xl font-bold text-gray-800 mb-2">
                Welcome, {userData.name}
              </h2>
              <p className="text-gray-600 mb-6">
                You are logged in as a {userData.user_type || userData.userType}
              </p>
            </div>

            {/* User Type Specific Content */}
            {renderUserTypeContent()}

            <div className="mt-8 border-t pt-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 bg-gray-50 rounded-lg">
                  <h3 className="font-medium text-gray-700 mb-2">Email Address</h3>
                  <p className="text-gray-900">{userData.email}</p>
                </div>
                <div className="p-4 bg-gray-50 rounded-lg">
                  <h3 className="font-medium text-gray-700 mb-2">Account Type</h3>
                  <p className="text-gray-900 capitalize">{userData.user_type || userData.userType}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

export default Home;