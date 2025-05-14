import axios from 'axios'
import React, { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import { register } from '../../slices/authSlices/authRegisterSlice'

function RegisterPage() {
    const [name, setName] = useState('')
    const [email, setEmail] = useState('')
    const [phone, setPhone] = useState('')
    const [password, setPassword] = useState('')
    const [confirmPassword, setConfirmPassword] = useState('')
    const [error, setError] = useState('')
    const [loading, setLoading] = useState(false)
    const [userType, setUserType] = useState('customer') 
    
    const navigate = useNavigate()
    const dispatch = useDispatch()

    const validateForm = () => {
       
        setError('')

        
        if (name.trim().length < 5) {
            setError('Name must be at least 5 characters long')
            return false
        }

        if (password.length < 6) {
            setError('Password must be at least 6 characters long')
            return false
        }


        if (password !== confirmPassword) {
            setError('Passwords do not match')
            return false
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
        if (!emailRegex.test(email)) {
            setError('Please enter a valid email address')
            return false
        }

        
        if (!phone.trim()) {
            setError('Phone number is required')
            return false
        }

        if (userType.toLowerCase() === 'admin') {
            setError('Administrator accounts cannot be created through this portal')
            return false
        }

        return true
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        
        
        if (!validateForm()) {
            return
        }
        
        setLoading(true)

        try {
            const registrationData = { 
                name, 
                email, 
                phone, 
                password, 
                user_type: userType.toLowerCase()
            }
            
         
            const { data } = await axios.post(
                "http://localhost:8000/register/",
                registrationData,
                {
                    headers: {
                        "Content-Type": "application/json",
                    },
                }
            )
            
          
            sessionStorage.setItem("pendingRegistration", JSON.stringify(registrationData))

           
            dispatch(register({
                name,
                email,
                phone,
                userType: userType.toLowerCase()
            }))

            navigate("/otp", { state: { email } })
        } catch (err) {
            console.error("Registration error:", err)
            
            if (err.response && err.response.data) {
                if (err.response.data.details) {
                    setError(
                        Object.entries(err.response.data.details)
                            .map(([field, errors]) => `${field}: ${errors.join(', ')}`)
                            .join('\n')
                    )
                } else {
                    setError(
                        err.response?.data?.error || 
                        err.response?.data?.message || 
                        err.response?.data?.details || 
                        'Registration failed. Please try again.'
                    )
                }
            } else {
                setError('Registration failed. Please try again.')
            }
        } finally {
            setLoading(false)
        }
    }
    
    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100">
            <div className="bg-white p-8 rounded-lg shadow-md w-96">
                <h2 className="text-2xl font-bold mb-6 text-center text-gray-800">{userType.charAt(0).toUpperCase() + userType.slice(1)} Register</h2>
                
                {error && (
                    <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4 whitespace-pre-line">
                        {error}
                    </div>
                )}
                
                <form onSubmit={handleSubmit}>
                    <div className="mb-4">
                        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="name">
                            Name
                        </label>
                        <input
                            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                            id="name"
                            type="text"
                            placeholder="Name (min 5 characters)"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            required
                        />
                        {name && name.trim().length < 5 && (
                            <p className="text-red-500 text-xs mt-1">Name must be at least 5 characters</p>
                        )}
                    </div>

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
                            required
                        />
                    </div>
                    
                    <div className="mb-4">
                        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="phone">
                            Phone No
                        </label>
                        <input
                            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                            id="phone"
                            type="text"
                            placeholder="Phone number"
                            value={phone}
                            onChange={(e) => setPhone(e.target.value)}
                            required
                        />
                    </div>
                    
                    <div className="mb-4">
                        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="userType">
                            Register as
                        </label>
                        <select
                            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                            id="userType"
                            value={userType}
                            onChange={(e) => setUserType(e.target.value)}
                        >
                            <option value="customer">Customer</option>
                            <option value="barber">Barber</option>
                        </select>
                    </div>
                    
                    <div className="mb-4">
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
                            required
                        />
                        {password && password.length < 6 && (
                            <p className="text-red-500 text-xs mt-1">Password must be at least 6 characters</p>
                        )}
                    </div>
                    
                    <div className="mb-6">
                        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="confirmPassword">
                            Confirm Password
                        </label>
                        <input
                            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                            id="confirmPassword"
                            type="password"
                            placeholder="Confirm Password"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            required
                        />
                        {confirmPassword && password !== confirmPassword && (
                            <p className="text-red-500 text-xs mt-1">Passwords do not match</p>
                        )}
                    </div>
                    
                    <div className="flex flex-col space-y-4">
                        <button
                            className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline w-full"
                            type="submit"
                            disabled={loading}
                        >
                            {loading ? 'Processing...' : 'Request OTP'}
                        </button>
                        
                        <div className="text-center">
                            <Link to="/login" className="text-blue-600 hover:text-blue-800 text-sm">
                                Already have an account? Login
                            </Link>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    )
}

export default RegisterPage