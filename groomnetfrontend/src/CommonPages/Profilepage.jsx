// ProfilePage.jsx
import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { getProfile, updateProfile } from '../Slices/profileService';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import { FaArrowLeft, FaUser, FaEnvelope, FaPhone, FaMapMarkerAlt, FaCheck, FaTimes } from 'react-icons/fa';

import ProfileInput from '../CommonPages/profilecomponents/ProfileInput';
import ProfileTextarea from '../CommonPages/profilecomponents/ProfileTextarea';
import ProfileImageUploader from '../CommonPages/profilecomponents/ProfileImageUploader';
import ConfirmationModal from '../CommonPages/profilecomponents/ConfirmationModal';
import StarRating from '../CommonPages/profilecomponents/StarRating';

function ProfilePage() {
  const user = useSelector(state => state.user);
  const [profile, setProfile] = useState({});
  const [form, setForm] = useState({});
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [imagePreview, setImagePreview] = useState(null);
  const [fileSelected, setFileSelected] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const navigate = useNavigate();

  const userDataFromStorage = localStorage.getItem('userData');
  const userData = user.islogged ? user : (userDataFromStorage ? JSON.parse(userDataFromStorage) : null);
  const userType = userData?.user_type || userData?.userType || '';

  useEffect(() => {
    if (!userData && !localStorage.getItem('accessToken')) {
      navigate('/');
      return;
    }
    fetchProfileData();
  }, [userData, navigate]);

  const fetchProfileData = async () => {
    try {
      setIsLoading(true);
      const data = await getProfile();
      setProfile(data);
      setForm(data);
    } catch (error) {
      console.error('Error fetching profile:', error);
      toast.error('Failed to load profile data.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (file, preview) => {
    setForm(prev => ({ ...prev, picture: file }));
    setImagePreview(preview);
    setFileSelected(true);
  };

  const handleRemoveImage = () => {
    setShowDeleteConfirm(true);
  };

  const confirmRemoveImage = () => {
    setForm(prev => ({ ...prev, picture: null }));
    setImagePreview(null);
    setFileSelected(false);
    setShowDeleteConfirm(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!form.full_name || form.full_name.trim() === '') {
      toast.error('Full name is required');
      return;
    }
    
    if (!form.email || form.email.trim() === '') {
      toast.error('Email is required');
      return;
    }

    setIsLoading(true);

    try {
      const formData = new FormData();
      Object.keys(form).forEach(key => {
        if (key !== 'picture' || (key === 'picture' && fileSelected)) {
          if (form[key] !== null && form[key] !== undefined) {
            formData.append(key, form[key]);
          }
        }
      });

      if (form.picture === null) {
        formData.append('remove_picture', 'true');
      }

      await updateProfile(formData);
      toast.success('Profile updated successfully!');
      await fetchProfileData();
      setIsEditing(false);
      setFileSelected(false);
    } catch (error) {
      console.error('Error updating profile:', error);
      toast.error('Failed to update profile. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const formatJoinedDate = (dateString) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
  };

  return (
    <div className="bg-gray-50 min-h-screen">
      <ToastContainer position="top-right" autoClose={3000} />
      
      <div className="max-w-4xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        <div className="mb-6 flex items-center">
          <button 
            onClick={() => navigate(-1)} 
            className="flex items-center text-blue-600 hover:text-blue-800 font-medium transition duration-150"
          >
            <FaArrowLeft className="mr-2" /> Back
          </button>
        </div>

        <div className="bg-white shadow-lg rounded-lg overflow-hidden">
          {/* Profile Header */}
          <div className="bg-gradient-to-r from-blue-500 to-indigo-600 px-6 py-8">
            <h1 className="text-white text-2xl font-bold">My Profile</h1>
            <p className="text-blue-100 mt-1">
              Member since {formatJoinedDate(profile.joined_on)}
            </p>
          </div>

          {isLoading ? (
            <div className="flex justify-center items-center p-12">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
              <span className="ml-3 text-gray-700">Loading profile...</span>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {/* Left Column - Profile Picture */}
                <div className="md:col-span-1">
                  <ProfileImageUploader
                    isEditing={isEditing}
                    imagePreview={imagePreview}
                    profilePicture={profile.picture}
                    onImageChange={handleImageChange}
                    onRemoveImage={handleRemoveImage}
                  />
                  
                  {userType === 'barber' && (
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
                      </div>
                    </div>
                  )}
                </div>
                
                {/* Right Column - Profile Details */}
                <div className="md:col-span-2">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <ProfileInput 
                      label="Full Name" 
                      name="full_name" 
                      value={form.full_name || ''} 
                      onChange={handleChange} 
                      disabled={!isEditing}
                      required={true}
                      icon={<FaUser className="text-gray-400" />}
                    />
                    
                    <ProfileInput 
                      label="Email" 
                      name="email" 
                      type="email"
                      value={form.email || ''} 
                      onChange={handleChange} 
                      disabled={!isEditing}
                      required={true}
                      icon={<FaEnvelope className="text-gray-400" />}
                    />
                    
                    <ProfileInput 
                      label="Phone" 
                      name="phone" 
                      value={form.phone || ''} 
                      onChange={handleChange} 
                      disabled={!isEditing}
                      icon={<FaPhone className="text-gray-400" />}
                    />
                    
                    <ProfileInput 
                      label="Location" 
                      name="location" 
                      value={form.location || ''} 
                      onChange={handleChange} 
                      disabled={!isEditing}
                      icon={<FaMapMarkerAlt className="text-gray-400" />}
                    />
                  </div>

                  {/* Barber Specific Fields */}
                  {userType === 'barber' && (
                    <div className="mt-8">
                      <h3 className="text-lg font-semibold text-gray-800 mb-4 border-b pb-2">Barber Information</h3>

                      <ProfileTextarea 
                        label="Professional Bio" 
                        name="bio" 
                        value={form.bio || ''} 
                        onChange={handleChange} 
                        disabled={!isEditing} 
                      />
                      
                      <div className="mt-4">
                        <ProfileInput 
                          label="Travel Radius (km)" 
                          type="number" 
                          name="travel_radius_km" 
                          value={form.travel_radius_km || ''} 
                          onChange={handleChange} 
                          disabled={!isEditing} 
                        />
                      </div>
                    </div>
                  )}

                  {/* Action Buttons */}
                  <div className="mt-8 flex justify-end">
                    {isEditing ? (
                      <div className="flex space-x-4">
                        <button 
                          type="button" 
                          onClick={() => { 
                            setIsEditing(false); 
                            setForm(profile); 
                            setImagePreview(null);
                            setFileSelected(false);
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
                </div>
              </div>
            </form>
          )}
        </div>
      </div>

      {/* Confirm Remove Modal */}
      {showDeleteConfirm && (
        <ConfirmationModal 
          message="Are you sure you want to remove your profile image?"
          onConfirm={confirmRemoveImage}
          onCancel={() => setShowDeleteConfirm(false)}
        />
      )}
    </div>
  );
}

export default ProfilePage;