
import { useEffect, useState } from "react"
import { useSelector } from "react-redux"
import { useNavigate } from "react-router-dom"
import { getProfile, updateProfile } from "../Slices/profileService"
import { toast, ToastContainer } from "react-toastify"
import "react-toastify/dist/ReactToastify.css"

import ProfileInput from "./profilecomponents/ProfileInput"
import AdminSidebar from "./AdminSidebar"
import AdminStats from "../dashboard/AdminStats"


function AdminProfilePage() {
  const user = useSelector((state) => state.user)
  const [profile, setProfile] = useState({})
  const [form, setForm] = useState({})
  const [isEditing, setIsEditing] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [activeTab, setActiveTab] = useState("profile")
  const navigate = useNavigate()

  const userDataFromStorage = localStorage.getItem("userData")
  const userData = user.islogged ? user : userDataFromStorage ? JSON.parse(userDataFromStorage) : null

  useEffect(() => {
    if (!userData && !localStorage.getItem("accessToken")) {
      navigate("/")
      return
    }


    if (userData?.userType !== "admin" && userData?.user_type !== "admin") {
      navigate("/profile")
      return
    }

    fetchProfileData()
  }, [userData, navigate])

  const fetchProfileData = async () => {
    try {
      setIsLoading(true)
      const data = await getProfile()
      setProfile(data)
      setForm(data)
    } catch (error) {
      console.error("Error fetching profile:", error)
      toast.error("Failed to load profile data.")
    } finally {
      setIsLoading(false)
    }
  }

  const handleChange = (e) => {
    const { name, value } = e.target
    setForm((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!form.full_name || form.full_name.trim() === "") {
      toast.error("Full name is required")
      return
    }

    if (!form.email || form.email.trim() === "") {
      toast.error("Email is required")
      return
    }

    setIsLoading(true)

    try {
      const formData = new FormData()
      Object.keys(form).forEach((key) => {
        if (form[key] !== null && form[key] !== undefined) {
          formData.append(key, form[key])
        }
      })

      await updateProfile(formData)
      toast.success("Admin profile updated successfully!")
      await fetchProfileData()
      setIsEditing(false)
    } catch (error) {
      console.error("Error updating profile:", error)
      toast.error("Failed to update profile. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  const renderContent = () => {
    if (activeTab === "profile") {
      return (
        <div className="bg-white shadow rounded-lg p-6">
          <h2 className="text-xl font-semibold mb-6">Admin Profile</h2>

          <form onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <ProfileInput
                label="Full Name"
                name="full_name"
                value={form.full_name || ""}
                onChange={handleChange}
                disabled={!isEditing}
                required={true}
              />

              <ProfileInput
                label="Email"
                name="email"
                type="email"
                value={form.email || ""}
                onChange={handleChange}
                disabled={!isEditing}
                required={true}
              />
            </div>

           
            <div className="mt-8 flex justify-end">
              {isEditing ? (
                <div className="flex space-x-4">
                  <button
                    type="button"
                    onClick={() => {
                      setIsEditing(false)
                      setForm(profile)
                    }}
                    className="px-5 py-2 border border-gray-300 text-gray-700 rounded-md font-medium hover:bg-gray-50 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 bg-blue-600 text-white rounded-md font-medium hover:bg-blue-700 transition-colors"
                  >
                    Save Changes
                  </button>
                </div>
              ) : (
                <button
                  type="button"
                  onClick={() => setIsEditing(true)}
                  className="px-5 py-2 bg-blue-600 text-white rounded-md font-medium hover:bg-blue-700 transition-colors"
                >
                  Edit Profile
                </button>
              )}
            </div>
          </form>
        </div>
      )
    } else if (activeTab === "dashboard") {
      return <AdminStats />
    } else if (activeTab === "users") {
      return (
        <div className="bg-white shadow rounded-lg p-6">
          <h2 className="text-xl font-semibold mb-6">User Management</h2>
          <p className="text-gray-600">User management features will be shown here.</p>
          
        </div>
      )
    } else if (activeTab === "revenue") {
      return (
        <div className="bg-white shadow rounded-lg p-6">
          <h2 className="text-xl font-semibold mb-6">Revenue Management</h2>
          <p className="text-gray-600">Revenue tracking and financial reports will be shown here.</p>
          
        </div>
      )
    }
  }

  return (
    <div className="bg-gray-100 min-h-screen">
      <ToastContainer position="top-right" autoClose={3000} />

      <div className="flex">
        
        <AdminSidebar activeTab={activeTab} setActiveTab={setActiveTab} />
        <div className="flex-1 p-8">
          <div className="max-w-6xl mx-auto">
            <h1 className="text-2xl font-bold text-gray-800 mb-6">Admin Dashboard</h1>

            {isLoading ? (
              <div className="flex justify-center items-center p-12">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
                <span className="ml-3 text-gray-700">Loading...</span>
              </div>
            ) : (
              renderContent()
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default AdminProfilePage
