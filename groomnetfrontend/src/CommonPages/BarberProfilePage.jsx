

import { useEffect, useState } from "react"
import { useSelector } from "react-redux"
import { useNavigate } from "react-router-dom"
import { getProfile, updateProfile } from "../Slices/profileService"
import { toast, ToastContainer } from "react-toastify"
import "react-toastify/dist/ReactToastify.css"

import { FaUser, FaEnvelope, FaPhone, FaMapMarkerAlt, FaCheck, FaTimes } from "react-icons/fa"

import ProfileInput from "./profilecomponents/ProfileInput"
import ProfileTextarea from "./profilecomponents/ProfileTextarea"
import ProfileImageUploader from "./profilecomponents/ProfileImageUploader"
import ConfirmationModal from "./profilecomponents/ConfirmationModal"
import StarRating from "./profilecomponents/StarRating"
import BarberSidebar from "./BarberSidebar"
import BarberDashboard from "../dashboard/BarberDashboard"
import BarberAppointments from "../dashboard/BarberAppointments"
import BarberEarnings from "../dashboard/BarberEarnings"
import DocumentUpload from "../barber/DocumentUpload"


function BarberProfilePage() {
  const user = useSelector((state) => state.user)
  const [profile, setProfile] = useState({})
  const [form, setForm] = useState({})
  const [isEditing, setIsEditing] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [imagePreview, setImagePreview] = useState(null)
  const [fileSelected, setFileSelected] = useState(false)
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)
  const [activeTab, setActiveTab] = useState("profile")
  const [isVerified, setIsVerified] = useState(false) // In a real app, this would come from the API
  const navigate = useNavigate()

  const userDataFromStorage = localStorage.getItem("userData")
  const userData = user.islogged ? user : userDataFromStorage ? JSON.parse(userDataFromStorage) : null

  useEffect(() => {
    if (!userData && !localStorage.getItem("accessToken")) {
      navigate("/")
      return
    }

    if (userData?.userType !== "barber" && userData?.user_type !== "barber") {
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

      // In a real app, verification status would come from the API
      // For demo purposes, we'll just set it based on a random condition
      setIsVerified(data.is_premium || false)
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

  const handleImageChange = (file, preview) => {
    setForm((prev) => ({ ...prev, picture: file }))
    setImagePreview(preview)
    setFileSelected(true)
  }

  const handleRemoveImage = () => {
    setShowDeleteConfirm(true)
  }

  const confirmRemoveImage = () => {
    setForm((prev) => ({ ...prev, picture: null }))
    setImagePreview(null)
    setFileSelected(false)
    setShowDeleteConfirm(false)
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
        if (key !== "picture" || (key === "picture" && fileSelected)) {
          if (form[key] !== null && form[key] !== undefined) {
            formData.append(key, form[key])
          }
        }
      })

      if (form.picture === null) {
        formData.append("remove_picture", "true")
      }

      await updateProfile(formData)
      toast.success("Profile updated successfully!")
      await fetchProfileData()
      setIsEditing(false)
      setFileSelected(false)
    } catch (error) {
      console.error("Error updating profile:", error)
      toast.error("Failed to update profile. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  const formatJoinedDate = (dateString) => {
    if (!dateString) return "N/A"
    const date = new Date(dateString)
    return date.toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })
  }

  const renderProfileContent = () => (
    <form onSubmit={handleSubmit} className="bg-white shadow rounded-lg overflow-hidden">
      <div className="bg-gradient-to-r from-blue-600 to-indigo-700 px-6 py-8">
        <h1 className="text-white text-2xl font-bold">Barber Profile</h1>
        <p className="text-blue-100 mt-1">Member since {formatJoinedDate(profile.joined_on)}</p>
      </div>

      <div className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Left Column */}
          <div className="md:col-span-1">
            <ProfileImageUploader
              isEditing={isEditing}
              imagePreview={imagePreview}
              profilePicture={profile.picture}
              onImageChange={handleImageChange}
              onRemoveImage={handleRemoveImage}
            />
            <div className="mt-6 bg-gray-50 p-4 rounded-lg">
              <h4 className="font-semibold text-gray-700 mb-3">Barber Status</h4>
              <div className="space-y-3">
                {profile.is_premium ? (
                  <div className="flex items-center text-green-600">
                    <FaCheck className="mr-2" /> Premium Member
                  </div>
                ) : (
                  <div className="flex items-center text-gray-500">
                    <FaTimes className="mr-2" /> Basic Member
                  </div>
                )}
                <div>
                  <span className="text-gray-600 block mb-1">Current Rating</span>
                  <StarRating rating={profile.rating || 0} />
                </div>
                <div className="mt-2">
                  <span className="text-gray-600 block mb-1">Status</span>
                  <div className={`flex items-center ${profile.available_now ? "text-green-600" : "text-red-600"}`}>
                    <span
                      className={`w-3 h-3 rounded-full mr-2 ${profile.available_now ? "bg-green-600" : "bg-red-600"}`}
                    ></span>
                    {profile.available_now ? "Available Now" : "Not Available"}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column */}
          <div className="md:col-span-2">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <ProfileInput
                label="Full Name"
                name="full_name"
                value={form.full_name || ""}
                onChange={handleChange}
                disabled={!isEditing}
                required={true}
                icon={<FaUser className="text-gray-400" />}
              />
              <ProfileInput
                label="Email"
                name="email"
                type="email"
                value={form.email || ""}
                onChange={handleChange}
                disabled={!isEditing}
                required={true}
                icon={<FaEnvelope className="text-gray-400" />}
              />
              <ProfileInput
                label="Phone"
                name="phone"
                value={form.phone || ""}
                onChange={handleChange}
                disabled={!isEditing}
                icon={<FaPhone className="text-gray-400" />}
              />
              <ProfileInput
                label="Location"
                name="location"
                value={form.location || ""}
                onChange={handleChange}
                disabled={!isEditing}
                icon={<FaMapMarkerAlt className="text-gray-400" />}
              />
            </div>

            {/* Professional Bio */}
            <div className="mt-8">
              <h3 className="text-lg font-semibold text-gray-800 mb-4 border-b pb-2">Professional Information</h3>
              <ProfileTextarea
                label="Professional Bio"
                name="bio"
                value={form.bio || ""}
                onChange={handleChange}
                disabled={!isEditing}
              />
              <div className="mt-4">
                <ProfileInput
                  label="Travel Radius (km)"
                  type="number"
                  name="travel_radius_km"
                  value={form.travel_radius_km || ""}
                  onChange={handleChange}
                  disabled={!isEditing}
                />
              </div>
            </div>

            {/* Buttons */}
            <div className="mt-8 flex justify-end">
              {isEditing ? (
                <div className="flex space-x-4">
                  <button
                    type="button"
                    onClick={() => {
                      setIsEditing(false)
                      setForm(profile)
                      setImagePreview(null)
                      setFileSelected(false)
                    }}
                    className="px-5 py-2 border border-gray-400 text-gray-600 rounded-lg hover:bg-gray-100 transition"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition"
                  >
                    Save Changes
                  </button>
                </div>
              ) : (
                <button
                  type="button"
                  onClick={() => setIsEditing(true)}
                  className="px-5 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
                >
                  Edit Profile
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </form>
  )

  const renderContent = () => {
    if (!isVerified && activeTab !== "profile") {
      return (
        <div className="bg-white shadow rounded-lg p-6">
          <div className="text-center py-8">
            <div className="mx-auto w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mb-4">
              <FaTimes className="text-yellow-600 text-xl" />
            </div>
            <h2 className="text-xl font-semibold text-gray-800 mb-2">Verification Required</h2>
            <p className="text-gray-600 mb-6">
              You need to complete the verification process before accessing this feature.
            </p>
            <button
              onClick={() => setActiveTab("profile")}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition"
            >
              Go to Profile
            </button>
          </div>
        </div>
      )
    }

    switch (activeTab) {
      case "profile":
        return renderProfileContent()
      case "dashboard":
        return <BarberDashboard />
      case "appointments":
        return <BarberAppointments />
      case "earnings":
        return <BarberEarnings />
      case "verification":
        return <DocumentUpload />
      default:
        return renderProfileContent()
    }
  }

  return (
    <div className="flex min-h-screen bg-gray-100">
      <BarberSidebar activeTab={activeTab} setActiveTab={setActiveTab} />
      <div className="flex-1 p-6">
        <ToastContainer />

        {!isVerified && activeTab === "profile" && (
          <div className="mb-6 bg-yellow-50 border-l-4 border-yellow-400 p-4">
            <div className="flex">
              <div className="flex-shrink-0">
                <FaTimes className="h-5 w-5 text-yellow-400" />
              </div>
              <div className="ml-3">
                <p className="text-sm text-yellow-700">
                  Your account is pending verification. Please complete the verification process to access all features.
                </p>
                <div className="mt-2">
                  <button
                    onClick={() => setActiveTab("verification")}
                    className="text-sm font-medium text-yellow-700 hover:text-yellow-600 underline"
                  >
                    Complete Verification
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {isLoading ? (
          <div className="text-center py-40">
            <div className="text-gray-500">Loading...</div>
          </div>
        ) : (
          renderContent()
        )}
      </div>

      <ConfirmationModal
        isOpen={showDeleteConfirm}
        onCancel={() => setShowDeleteConfirm(false)}
        onConfirm={confirmRemoveImage}
        message="Are you sure you want to remove your profile picture?"
      />
    </div>
  )
}

export default BarberProfilePage
