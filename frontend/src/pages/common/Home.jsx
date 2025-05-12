
import { useEffect, useState } from "react";
import axios from "axios";
import { useSelector } from "react-redux";
import { Logout } from "../../components/authcomponent/Logout";
import Navbar from "../../components/navbarcomponent/Navbar";

const Home = () => {
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(true);
  const { name, userType } = useSelector((state) => state.authLogin);

  useEffect(() => {
    const fetchHomeData = async () => {
      try {
        const { data } = await axios.get("http://localhost:8000/home/", {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });
        
        setMessage(data.message);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching home data:", error);
        setLoading(false);
      }
    };

    fetchHomeData();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="bg-white shadow rounded-lg p-6">
          <div className="mb-6">
            <h1 className="text-3xl font-bold text-gray-900">Welcome to GroomNet</h1>
            {loading ? (
              <p className="mt-2 text-gray-600">Loading...</p>
            ) : (
              <p className="mt-2 text-gray-600">{message}</p>
            )}
          </div>

          <div className="bg-blue-50 p-4 rounded-lg mb-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-2">Your Profile</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p className="text-gray-700">
                  <span className="font-medium">Name:</span> {name}
                </p>
                <p className="text-gray-700">
                  <span className="font-medium">Account Type:</span>{" "}
                  {userType === "barber" ? "Barber" : "Customer"}
                </p>
              </div>
            </div>
          </div>

          {userType === "barber" && (
            <div className="bg-green-50 p-4 rounded-lg mb-6">
              <h2 className="text-xl font-semibold text-gray-800 mb-2">Barber Dashboard</h2>
              <p className="text-gray-600 mb-4">
                Access your barber-specific features and manage your bookings.
              </p>
              <button className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded">
                Go to Barber Dashboard
              </button>
            </div>
          )}

          {userType === "customer" && (
            <div className="bg-purple-50 p-4 rounded-lg mb-6">
              <h2 className="text-xl font-semibold text-gray-800 mb-2">Find a Barber</h2>
              <p className="text-gray-600 mb-4">
                Search for barbers in your area and book appointments.
              </p>
              <button className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded">
                Search Barbers
              </button>
            </div>
          )}

          <div className="mt-8 text-center">
            <Logout buttonStyle="bg-red-600 hover:bg-red-700 text-white px-6 py-2 rounded-md font-medium" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;