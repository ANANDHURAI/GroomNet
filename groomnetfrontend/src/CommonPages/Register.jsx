"use client"

import { useState, useEffect } from "react"
import { Link, useParams, useNavigate } from "react-router-dom"
import { Formik, Form } from "formik"
import * as Yup from "yup"
import Input from "../commonMiniComponents/Input"
import { useAuth } from "../Slices/authService"

function Register() {
  const { userType } = useParams()
  const navigate = useNavigate()
  const { handleRegister } = useAuth()
  const [message, setMessage] = useState({ type: "", text: "" })

  // Validate user type is valid, otherwise redirect to landing
  useEffect(() => {
    const validTypes = ["customer", "barber", "admin"]
    if (!validTypes.includes(userType)) {
      navigate("/")
    }
  }, [userType, navigate])

  const validationSchema = Yup.object({
    name: Yup.string().required("Name is required"),
    email: Yup.string().email("Invalid email address").required("Email is required"),
    password: Yup.string().required("Password is required"),
    confirmPassword: Yup.string()
      .oneOf([Yup.ref("password"), null], "Passwords must match")
      .required("Confirm Password is required"),
    phone: Yup.string().matches(/^\d{10}$/, "Phone number must be 10 digits"),
  })

  const handleSubmit = async (values, { setSubmitting, resetForm }) => {
    try {
      // Extract confirmPassword and prepare userData
      const { confirmPassword, ...userData } = values

      // Add confirm_password field that backend expects
      userData.confirm_password = confirmPassword
      userData.user_type = userType

      const result = await handleRegister(userData)
      setMessage({
        type: result.success ? "success" : "error",
        text: result.message,
      })

      if (result.success) {
        resetForm()
      }
    } catch (error) {
      setMessage({
        type: "error",
        text: error.message || "An error occurred during registration",
      })
    }
    setSubmitting(false)
  }

  // Helper function to format user type for display
  const formatUserType = (type) => {
    return type.charAt(0).toUpperCase() + type.slice(1)
  }

  // Additional fields based on user type
  const renderAdditionalFields = () => {
    if (userType === "barber") {
      return (
        <div className="p-5 bg-sky-50 rounded-xl mb-6 border border-sky-100">
          <p className="text-sky-800 text-sm">
            Note: As a barber, you'll need to upload verification documents after registration.
          </p>
        </div>
      )
    }
    return null
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-sky-100 via-indigo-50 to-purple-100 py-12 px-4">
      <div className="max-w-xl mx-auto bg-white rounded-2xl shadow-xl overflow-hidden border border-slate-100">
        <div className="w-full p-8">
          <div className="text-center mb-10">
            <h1 className="text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-sky-600 to-indigo-600 mb-3">
              Register as {formatUserType(userType)}
            </h1>
            <p className="text-slate-600">Join Groom Net today</p>
          </div>

          {message.text && (
            <div
              className={`mb-6 p-4 rounded-xl ${message.type === "success" ? "bg-emerald-50 text-emerald-700 border border-emerald-200" : "bg-red-50 text-red-700 border border-red-200"}`}
            >
              {message.text}
            </div>
          )}

          {renderAdditionalFields()}

          <Formik
            initialValues={{
              name: "",
              email: "",
              password: "",
              confirmPassword: "",
              phone: "",
            }}
            validationSchema={validationSchema}
            onSubmit={handleSubmit}
          >
            {({ isSubmitting }) => (
              <Form className="space-y-5">
                <Input name="name" />
                <Input name="email" />
                <Input name="password" />
                <Input name="confirmPassword" />
                <Input name="phone" />

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-gradient-to-r from-sky-500 to-indigo-500 hover:from-sky-600 hover:to-indigo-600 text-white py-3.5 rounded-xl font-medium transition-all duration-300 shadow-md hover:shadow-lg mt-6"
                >
                  {isSubmitting ? "Registering..." : "Register"}
                </button>
              </Form>
            )}
          </Formik>

          <div className="mt-8 text-center">
            <p className="text-slate-600">
              Already have an account?{" "}
              <Link
                to={`/login/${userType}`}
                className="text-indigo-600 hover:text-indigo-800 font-medium transition-colors"
              >
                Login
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
    </div>
  )
}

export default Register
