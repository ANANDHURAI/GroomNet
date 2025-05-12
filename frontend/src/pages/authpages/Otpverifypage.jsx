import axios from 'axios'
import React, { useState, useEffect } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import { login } from '../../slices/authSlices/authLoginSlice'

function OtpVerifyPage() {
    const [otp, setOtp] = useState('')
    const [email, setEmail] = useState('')
    const [error, setError] = useState('')
    const [loading, setLoading] = useState(false)
    const [success, setSuccess] = useState('')
    
    const navigate = useNavigate()
    const location = useLocation()
    const dispatch = useDispatch()
    
    useEffect(() => {
        if (location.state?.email) {
            setEmail(location.state.email)
        }
    }, [location])
    
    const handleSubmit = async (e) => {
        e.preventDefault()
        setLoading(true)
        setError('')
        setSuccess('')
        
        try {
            // Verify OTP
            await axios.post(
                "http://localhost:8000/verify-otp/", 
                { email, otp },
                {
                    headers: {
                        "Content-Type": "application/json",
                    }
                }
            )
            
            // Get the pending registration data
            const pendingRegistration = JSON.parse(sessionStorage.getItem("pendingRegistration"))
            
            if (!pendingRegistration) {
                setError("Registration data not found. Please register again.")
                setLoading(false)
                return
            }
            
            // Create user
            const { data } = await axios.post(
                "http://localhost:8000/create-user/",
                {
                    ...pendingRegistration,
                    email
                },
                {
                    headers: {
                        "Content-Type": "application/json",
                    }
                }
            )
            
            // Store tokens
            localStorage.setItem("access_token", data.access)
            localStorage.setItem("refresh_token", data.refresh)

            // Update axios default headers
            axios.defaults.headers.common["Authorization"] = `Bearer ${data.access}`
            
            // Dispatch login action
            dispatch(
                login({
                    name: data.name,
                    email: data.email,
                    userType: data.user_type,
                    phone: data.phone || '',
                    accessToken: data.access,
                    refreshToken: data.refresh
                })
            )
            
            // Store user info in local storage
            localStorage.setItem('user', JSON.stringify({
                name: data.name,
                email: data.email,
                userType: data.user_type,
                phone: data.phone || '',
                accessToken: data.access,
                refreshToken: data.refresh,
                islogged: true
            }))
            
            // Remove pending registration from session storage
            sessionStorage.removeItem("pendingRegistration")
            
            // Redirect based on user type
            switch(data.user_type) {
                case 'admin':
                    navigate("/admin/dashboard")
                    break
                case 'barber':
                    navigate("/barber/dashboard")
                    break
                default:
                    navigate("/home")
            }
        } catch (err) {
            console.error("Error during verification/registration:", err)
    
            if (err.response && err.response.data) {
                if (err.response.data.details) {
                    setError(
                        Object.entries(err.response.data.details)
                            .map(([field, errors]) => `${field}: ${errors.join(', ')}`)
                            .join('\n')
                    )
                } else {
                    setError(
                        err.response.data.error || 
                        err.response.data.detail || 
                        "Verification failed. Please try again."
                    )
                }
            } else {
                setError("Verification failed. Please try again.")
            }
        } finally {
            setLoading(false)
        }
    }
    

    const handleResendOTP = async () => {
        if (!email) {
            setError("Email is required to resend OTP")
            return
        }
        
        try {
            setLoading(true)
            setError('')
            setSuccess('')
            
            const { data } = await axios.post(
                "http://localhost:8000/resend-otp/",
                { email },
                {
                    headers: {
                        "Content-Type": "application/json",
                    }
                }
            )
            
            setSuccess("OTP resent successfully!")
            alert("OTP resent successfully!")
        } catch (err) {
            console.error("Failed to resend OTP:", err)
            setError(
                err.response?.data?.error || 
                err.response?.data?.detail || 
                "Failed to resend OTP"
            )
        } finally {
            setLoading(false)
        }
    }
    
    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100">
            <div className="bg-white p-8 rounded-lg shadow-md w-96">
                <h2 className="text-2xl font-bold mb-6 text-center text-gray-800">OTP Verification</h2>
                
                {error && (
                    <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
                        {error}
                    </div>
                )}
                
                {success && (
                    <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4">
                        {success}
                    </div>
                )}
                
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="email">
                            Email
                        </label>
                        <input 
                            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                            id="email"
                            type="email"
                            placeholder="Enter your email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            disabled={loading}
                            required
                        />
                    </div>
                    
                    <div>
                        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="otp">
                            Enter OTP
                        </label>
                        <input 
                            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                            id="otp"
                            type="text"
                            placeholder="Enter 4-digit OTP"
                            value={otp}
                            onChange={(e) => setOtp(e.target.value)}
                            maxLength="4"
                            disabled={loading}
                            required
                        />
                    </div>
                    
                    <button
                        className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline w-full"
                        type="submit"
                        disabled={loading}
                    >
                        {loading ? 'Processing...' : 'Verify OTP & Create Account'}
                    </button>
                    
                    <div className="text-center">
                        <button
                            type="button"
                            onClick={handleResendOTP}
                            className="text-blue-600 hover:text-blue-800 text-sm"
                            disabled={loading}
                        >
                            Didn't receive OTP? Resend
                        </button>
                    </div>
                </form>
            </div>
        </div>
    )
}

export default OtpVerifyPage