import { Link } from "react-router-dom"

function LandingPage() {
  const userTypes = [
    { type: "customer", label: "Customer", icon: "" },
    { type: "barber", label: "Barber", icon: "" },
    { type: "admin", label: "Admin", icon: "" },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-sky-100 via-indigo-50 to-purple-100 flex flex-col items-center justify-center p-6">
      <div className="text-center mb-16">
        <h1 className="text-5xl md:text-6xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-sky-600 to-indigo-600 mb-6">
          Welcome to Groom Net
        </h1>
        <p className="text-xl md:text-2xl text-slate-700">Choose how you want to continue</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl w-full">
        {userTypes.map((user) => (
          <div
            key={user.type}
            className="bg-white rounded-2xl shadow-xl overflow-hidden border border-slate-100 transform transition-all duration-300 hover:shadow-2xl hover:-translate-y-1"
          >
            <div className="p-8 text-center">
              <div className="text-5xl mb-6">{user.icon}</div>
              <h2 className="text-2xl font-bold text-slate-800 mb-6">I am a {user.label}</h2>
              <div className="space-y-4">
                <Link
                  to={`/login/${user.type}`}
                  className="block w-full bg-gradient-to-r from-sky-500 to-indigo-500 hover:from-sky-600 hover:to-indigo-600 text-white py-3.5 rounded-xl font-medium transition-all duration-300 shadow-md hover:shadow-lg"
                >
                  Login
                </Link>
                <Link
                  to={`/register/${user.type}`}
                  className="block w-full bg-white hover:bg-slate-50 text-slate-800 py-3.5 rounded-xl font-medium transition-all duration-300 border-2 border-slate-200 hover:border-slate-300"
                >
                  Register
                </Link>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default LandingPage
