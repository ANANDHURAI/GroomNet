import { useState, useEffect } from "react";
import axios from "axios";
import { useDispatch } from "react-redux";
import { useNavigate, Link } from "react-router-dom";
import { login } from "../../slices/authSlices/authLoginSlice";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.get('type') === 'admin') {
      setError("Please use the admin login page for administrative access");
    }
  }, []);

  const validateForm = () => {
   
    setError("");
    
  
    if (password.length < 6) {
      setError("Password must be at least 6 characters long");
      return false;
    }
    
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    
    if (!validateForm()) {
      return;
    }
    
    setLoading(true);
    
    try {
      const { data } = await axios.post(
        "http://localhost:8000/token/",
        { email, password },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );


      if (data.user_type === 'admin') {
        setError("Administrators must use the admin login portal");
        setLoading(false);
        return;
      }

     
      localStorage.setItem("access_token", data.access);
      localStorage.setItem("refresh_token", data.refresh);

    
      axios.defaults.headers.common["Authorization"] = `Bearer ${data.access}`;
      

      dispatch(
        login({
          name: data.name,
          email: data.email,
          userType: data.user_type,
          phone: data.phone || '',
          accessToken: data.access,
          refreshToken: data.refresh
        })
      );
      
      
      localStorage.setItem('user', JSON.stringify({
        name: data.name,
        email: data.email,
        userType: data.user_type,
        phone: data.phone || '',
        accessToken: data.access,
        refreshToken: data.refresh,
        islogged: true
      }));
      
      switch(data.user_type) {
        case 'barber':
          navigate("/barber/home");
          break;
        default:
          navigate("/home");
      }
    } catch (err) {
      console.error("Login error:", err);
      setError(
        err.response?.data?.error || 
        err.response?.data?.detail || 
        "Invalid email or password"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-md w-96">
        <h2 className="text-2xl font-bold mb-6 text-center text-gray-800">User Login</h2>
        
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}
        
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="email">
              Email
            </label>
            <input
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              id="email"
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={loading}
              required
            />
          </div>
          
          <div className="mb-2">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="password">
              Password
            </label>
            <input
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              id="password"
              type="password"
              placeholder="Password (min 6 characters)"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={loading}
              required
            />
            {password && password.length < 6 && (
              <p className="text-red-500 text-xs mt-1">Password must be at least 6 characters</p>
            )}
          </div>
          
          <div className="mb-6 text-center">
            <Link 
              to="/forgot" 
              className="text-sm text-blue-600 hover:text-blue-800 transition duration-200 ease-in-out"
            >
              Forgot Password?
            </Link>
          </div>
          
          <div className="flex flex-col space-y-4">
            <button
              className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline w-full transition duration-200 ease-in-out transform hover:scale-105"
              type="submit"
              disabled={loading}
            >
              {loading ? 'Signing in...' : 'Sign In'}
            </button>
            
            <div className="text-center">
              <Link to="/register" className="text-blue-600 hover:text-blue-800 text-sm">
                Don't have an account? Register
              </Link>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Login;