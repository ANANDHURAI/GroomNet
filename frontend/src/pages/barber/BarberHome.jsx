import React, { useEffect } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import Navbar from "../../components/navbarcomponent/Navbar";
import Logout from "../../components/authcomponent/Logout";

function BarberHome() {
  const navigate = useNavigate();
  
  const auth = useSelector((state) => state.authLogin);
  const { islogged, name, email, userType } = auth || {};
 
  useEffect(() => {
    if (!islogged) {
      navigate("/login");
    } else if (userType !== "barber") {
      
      navigate("/home");
    }
  }, [islogged, userType, navigate]);

  if (!islogged) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <p className="text-gray-700 text-lg">Loading profile...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="bg-white shadow rounded-lg p-6">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Welcome, {name}!</h1>
          <p className="text-gray-600 mb-6">This is your dedicated barber dashboard.</p>

          <div className="bg-green-50 p-4 rounded-lg mb-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-2">Your Profile</h2>
            <p className="text-gray-700"><span className="font-medium">Name:</span> {name}</p>
            <p className="text-gray-700"><span className="font-medium">Email:</span> {email}</p>
          </div>

          <div className="bg-blue-50 p-4 rounded-lg mb-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-2">Manage Bookings</h2>
            <p className="text-gray-600">Here you will be able to view and manage your appointments.</p>
            <button className="mt-4 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded">
              View Appointments
            </button>
          </div>

          <div className="mt-8 text-center">
            <Logout buttonStyle="bg-red-600 hover:bg-red-700 text-white px-6 py-2 rounded-md font-medium" />
          </div>
        </div>
      </div>
    </div>
  );
}

export default BarberHome;