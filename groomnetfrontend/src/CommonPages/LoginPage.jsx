import { useState, useEffect } from "react"
import { Link, useParams, useNavigate } from "react-router-dom"
import { Formik, Form } from "formik"
import * as Yup from "yup"
import Input from "../commonMiniComponents/Input"
import { useAuth } from "../Slices/authService"

function LoginPage() {
  const { userType } = useParams()
  const navigate = useNavigate()
  const { handleLogin } = useAuth()
  const [message, setMessage] = useState({ type: "", text: "" })

  // Validate user type is valid, otherwise redirect to landing
  useEffect(() => {
    const validTypes = ["customer", "barber", "admin"]
    if (!validTypes.includes(userType)) {
      navigate("/")
    }
  }, [userType, navigate])

  const validationSchema = Yup.object({
    email: Yup.string()
      .trim()
      .email("Please enter a valid email address, like example@mail.com.")
      .required("Your email is required to log in."),
    
    password: Yup.string()
      .min(8, "Password must be at least 8 characters long.")
      .max(30, "Password seems too long.")
      .required("Please enter your password."),
  })
  

  const handleSubmit = async (values, { setSubmitting }) => {
    const result = await handleLogin(values.email, values.password, userType)
    setMessage({
      type: result.success ? "success" : "error",
      text: result.message,
    })
    setSubmitting(false)
  }

  
  const formatUserType = (type) => {
    return type.charAt(0).toUpperCase() + type.slice(1)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-100 flex items-center justify-center p-6">
      <div className="max-w-md w-full p-8 bg-white rounded-2xl shadow-2xl border border-slate-100 transform transition-all duration-300 hover:shadow-xl">
        <div className="text-center mb-10">
          <h1 className="text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600 mb-3">
            {formatUserType(userType)} Login
          </h1>
          <p className="text-slate-600">Welcome back to Groom Net</p>
        </div>

        {message.text && (
          <div
            className={`mb-6 p-4 rounded-xl ${
              message.type === "success" 
                ? "bg-emerald-50 text-emerald-700 border border-emerald-200" 
                : "bg-red-50 text-red-700 border border-red-200"
            } animate-fadeIn`}
          >
            {message.text}
          </div>
        )}

        <Formik initialValues={{ email: "", password: "" }} validationSchema={validationSchema} onSubmit={handleSubmit}>
          {({ isSubmitting }) => (
            <Form className="space-y-5">
              <Input name="email" />
              <Input name="password" />

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white py-3.5 rounded-xl font-medium transition-all duration-300 shadow-md hover:shadow-lg mt-6 transform hover:-translate-y-0.5"
              >
                {isSubmitting ? (
                  <div className="flex items-center justify-center">
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Logging in...
                  </div>
                ) : (
                  "Login"
                )}
              </button>
            </Form>
          )}
        </Formik>

        <div className="mt-8 text-center">
          <p className="text-slate-600">
            Don't have an account?{" "}
            <Link
              to={`/register/${userType}`}
              className="text-indigo-600 hover:text-indigo-800 font-medium transition-colors"
            >
              Register
            </Link>
          </p>
        </div>

        <div className="mt-6 text-center">
          <Link to="/" className="text-slate-500 hover:text-slate-700 transition-colors flex items-center justify-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Back to home
          </Link>
        </div>
      </div>
    </div>
  )
}

export default LoginPage