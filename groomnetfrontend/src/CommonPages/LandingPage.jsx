import { Link } from "react-router-dom";
import Footer from "../commonMiniComponents/hfn/Footer";
import Navbar from "../commonMiniComponents/hfn/Navbar";

function LandingPage() {
  const userTypes = [
    {
      type: "customer",
      label: "Customer",
      icon: "👤",
      description: "Book appointments with top barbers in your area",
    },
    {
      type: "barber",
      label: "Barber",
      icon: "✂️",
      description: "Grow your business and manage appointments",
    },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-blue-100 via-indigo-100 to-purple-50">
      <Navbar />

      <main className="flex flex-col items-center justify-center flex-grow px-6 py-16">
        {/* Hero Section */}
        <section className="text-center mb-16 max-w-4xl">
          <h1 className="text-5xl md:text-6xl font-extrabold mb-6 leading-tight">
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-600">
              Welcome to Groom Net
            </span>
          </h1>
          <p className="text-lg md:text-2xl text-slate-700 mb-8 font-medium">
            The premier platform connecting customers with professional barbers
          </p>
          <div className="w-28 h-1 bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500 mx-auto rounded-full" />
        </section>

        {/* User Selection Cards */}
        <section className="grid grid-cols-1 md:grid-cols-2 gap-10 max-w-4xl w-full">
          {userTypes.map((user) => (
            <div
              key={user.type}
              className="bg-white rounded-3xl shadow-lg overflow-hidden border border-slate-200 p-8 flex flex-col items-center text-center transform transition-transform duration-300 hover:shadow-2xl hover:-translate-y-2"
            >
              <div className="text-6xl mb-6 bg-gradient-to-br from-blue-100 to-indigo-100 w-24 h-24 rounded-full flex items-center justify-center shadow-md">
                {user.icon}
              </div>
              <h2 className="text-2xl font-bold text-slate-800 mb-4">
                I am a {user.label}
              </h2>
              <p className="text-slate-600 mb-8">{user.description}</p>
              <div className="w-full space-y-4">
                <Link
                  to={`/login/${user.type}`}
                  className="block w-full bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white py-3 rounded-xl font-semibold transition-transform duration-300 shadow-md hover:shadow-lg hover:-translate-y-1"
                >
                  Login
                </Link>
                <Link
                  to={`/register/${user.type}`}
                  className="block w-full bg-white hover:bg-slate-50 text-slate-800 py-3 rounded-xl font-semibold transition-transform duration-300 border-2 border-slate-200 hover:border-slate-300 hover:-translate-y-1"
                >
                  Register
                </Link>
              </div>
            </div>
          ))}
        </section>
      </main>

      <Footer />
    </div>
  );
}

export default LandingPage;
