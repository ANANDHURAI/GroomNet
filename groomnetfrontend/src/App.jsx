import "./App.css"
import { BrowserRouter as Router, Routes, Route } from "react-router-dom"
import { Provider } from "react-redux"
import { store } from "./reduxStore/store"
import Register from "./CommonPages/Register"
import Home from "./CommonPages/Home"
import LoginPage from "./CommonPages/LoginPage"
import LandingPage from "./CommonPages/LandingPage"
import UserProfilePage from "./CommonPages/UserProfilePage"
import BarberProfilePage from "./CommonPages/BarberProfilePage"
import AdminProfilePage from "./CommonPages/AdminProfilePage"
import ProtectedRoute from "./protect/ProtectedRoute"

function App() {
  return (
    <Provider store={store}>
      <Router>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/login/:userType" element={<LoginPage />} />
          <Route path="/register/:userType" element={<Register />} />
          <Route path="/home" element={<Home />} />

          {/* Protected Routes */}
          <Route
            path="/profile"
            element={
              <ProtectedRoute allowedUserTypes={["customer"]}>
                <UserProfilePage />
              </ProtectedRoute>
            }
          />

          <Route
            path="/profile/barber"
            element={
              <ProtectedRoute allowedUserTypes={["barber"]}>
                <BarberProfilePage />
              </ProtectedRoute>
            }
          />

          <Route
            path="/profile/admin"
            element={
              <ProtectedRoute allowedUserTypes={["admin"]}>
                <AdminProfilePage />
              </ProtectedRoute>
            }
          />
        </Routes>
      </Router>
    </Provider>
  )
}

export default App
