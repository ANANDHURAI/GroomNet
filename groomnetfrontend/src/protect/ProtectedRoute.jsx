import { useEffect } from "react"
import { useSelector } from "react-redux"
import { Navigate, useLocation } from "react-router-dom"

function ProtectedRoute({ children, allowedUserTypes = [] }) {
  const user = useSelector((state) => state.user)
  const location = useLocation()

  const userDataFromStorage = localStorage.getItem("userData")
  const userData = user.islogged ? user : userDataFromStorage ? JSON.parse(userDataFromStorage) : null

  const isAuthenticated = userData && (userData.islogged || localStorage.getItem("accessToken"))
  const userType = userData?.userType || userData?.user_type

  const isAuthorized = allowedUserTypes.length === 0 || allowedUserTypes.includes(userType)

  useEffect(() => {
    if (!isAuthenticated) {
      console.log("User not authenticated, redirecting to login")
    } else if (!isAuthorized) {
      console.log(`User type ${userType} not authorized for this route`)
    }
  }, [isAuthenticated, isAuthorized, userType])

  if (!isAuthenticated) {
    // Redirect to login page if not authenticated
    return <Navigate to="/" state={{ from: location }} replace />
  }

  if (!isAuthorized) {
    // Redirect to appropriate profile page based on user type
    if (userType === "customer") {
      return <Navigate to="/profile" replace />
    } else if (userType === "barber") {
      return <Navigate to="/profile/barber" replace />
    } else if (userType === "admin") {
      return <Navigate to="/profile/admin" replace />
    } else {
      return <Navigate to="/" replace />
    }
  }

  return children
}

export default ProtectedRoute
