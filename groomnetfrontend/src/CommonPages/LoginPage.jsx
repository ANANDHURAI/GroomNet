"use client"

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
    email: Yup.string().email("Invalid email address").required("Email is required"),
    password: Yup.string().required("Password is required"),
  })

  const handleSubmit = async (values, { setSubmitting }) => {
    const result = await handleLogin(values.email, values.password, userType)
    setMessage({
      type: result.success ? "success" : "error",
      text: result.message,
    })
    setSubmitting(false)
  }

  // Helper function to format user type for display
  const formatUserType = (type) => {
    return type.charAt(0).toUpperCase() + type.slice(1)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-sky-100 via-indigo-50 to-purple-100 flex items-center justify-center p-6">
      <div className="max-w-md w-full p-8 bg-white rounded-2xl shadow-xl border border-slate-100">
        <div className="text-center mb-10">
          <h1 className="text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-sky-600 to-indigo-600 mb-3">
            {formatUserType(userType)} Login
          </h1>
          <p className="text-slate-600">Welcome back to Groom Net</p>
        </div>

        {message.text && (
          <div
            className={`mb-6 p-4 rounded-xl ${message.type === "success" ? "bg-emerald-50 text-emerald-700 border border-emerald-200" : "bg-red-50 text-red-700 border border-red-200"}`}
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
                className="w-full bg-gradient-to-r from-sky-500 to-indigo-500 hover:from-sky-600 hover:to-indigo-600 text-white py-3.5 rounded-xl font-medium transition-all duration-300 shadow-md hover:shadow-lg mt-6"
              >
                {isSubmitting ? "Logging in..." : "Login"}
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
          <Link to="/" className="text-slate-500 hover:text-slate-700 transition-colors">
            ← Back to home
          </Link>
        </div>
      </div>
    </div>
  )
}

export default LoginPage
