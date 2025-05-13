import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import ProfileImage from '../../components/profilecomponents/ProfileImage';
import ProfileField from '../../components/profilecomponents/ProfileField';
import ProfileFormControls from '../../components/profilecomponents/ProfileFormControls';
import ImageUploader from '../../components/profilecomponents/ImageUploader';
import ProfileLayout from '../../components/profilecomponents/ProfileLayout';
import fetchBarberProfile from '../../slices/profile/barberProfile/fetchBarberProfile';
import updateBarberProfile from '../../slices/profile/barberProfile/updateBarberProfile';
import { Navigate } from 'react-router-dom';

const BarberProfilePage = () => {
  const dispatch = useDispatch();
  const { profile, loading, error } = useSelector(state => state.barberProfile);
  
  // Fix: Get auth info from the correct Redux state slices
  const authInfo = useSelector((state) =>
    state.authLogin?.islogged
      ? state.authLogin
      : state.authAdminLogin?.islogged
      ? state.authAdminLogin
      : { islogged: false, userType: null }
  );
  
  const { islogged, userType } = authInfo;
  
  const [isEditing, setIsEditing] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    profile_image: null,
    bio: '',
    travel_radius_km: 5,
    available_now: false
  });
  const [previewImage, setPreviewImage] = useState(null);

  useEffect(() => {
    if (islogged) {
      dispatch(fetchBarberProfile());
    }
  }, [dispatch, islogged]);

  useEffect(() => {
    if (profile) {
      setFormData({
        ...profile,
        travel_radius_km: profile.travel_radius_km || 5,
        bio: profile.bio || '',
        available_now: profile.available_now || false
      });
      if (profile.profile_image) {
        setPreviewImage(profile.profile_image);
      }
    }
  }, [profile]);

  const handleImageChange = (file) => {
    if (!file) return;
    
    setFormData({
      ...formData,
      profile_image: file
    });
    
    // Create preview URL
    const reader = new FileReader();
    reader.onloadend = () => {
      setPreviewImage(reader.result);
    };
    reader.readAsDataURL(file);
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value
    });
  };

  const handleSubmit = () => {
    setIsSubmitting(true);
    const data = new FormData();
    
    // Only append the profile image if it's a File object (newly uploaded)
    if (formData.profile_image instanceof File) {
      data.append('profile_image', formData.profile_image);
    }
    
    // Append other fields
    data.append('bio', formData.bio);
    data.append('travel_radius_km', formData.travel_radius_km);
    data.append('available_now', formData.available_now);

    // Only dispatch if there are changes
    dispatch(updateBarberProfile(data))
      .unwrap()
      .then(() => {
        setIsEditing(false);
        setIsSubmitting(false);
      })
      .catch((err) => {
        console.error("Failed to update profile:", err);
        setIsSubmitting(false);
      });
  };

  const handleCancel = () => {
    setIsEditing(false);
    setFormData({
      ...profile,
      travel_radius_km: profile?.travel_radius_km || 5,
      bio: profile?.bio || '',
      available_now: profile?.available_now || false
    });
    setPreviewImage(profile?.profile_image);
  };

  // Redirect if not logged in
  if (!islogged) {
    return <Navigate to="/login" replace />;
  }

  // If user is a customer, redirect to customer profile
  if (userType === 'customer') {
    return <Navigate to="/profile/customer" replace />;
  }

  if (loading) {
    return (
      <ProfileLayout>
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      </ProfileLayout>
    );
  }

  return (
    <ProfileLayout>
      <div className="text-center mb-8">
        <h1 className="text-2xl font-bold">Barber Profile</h1>
        {error && (
          <div className="mt-2 text-red-500 text-sm">
            {error}
          </div>
        )}
      </div>
      
      <div className="mb-6">
        <ProfileImage 
          src={isEditing ? previewImage : profile?.profile_image} 
          alt={profile?.name || "Barber"} 
        />
        {isEditing && <ImageUploader onImageChange={handleImageChange} />}
      </div>

      <div className="space-y-4">
        <ProfileField 
          label="Name" 
          value={profile?.name} 
          isEditing={false}
          name="name"
        />
        
        <ProfileField 
          label="Email" 
          value={profile?.email} 
          isEditing={false}
          name="email"
          type="email"
        />
        
        <ProfileField 
          label="Phone" 
          value={profile?.phone} 
          isEditing={false}
          name="phone"
        />
        
        <ProfileField 
          label="Bio" 
          value={formData.bio} 
          isEditing={isEditing}
          name="bio"
          onChange={handleInputChange}
          type="textarea"
        />
        
        <ProfileField 
          label="Travel Radius (km)" 
          value={formData.travel_radius_km} 
          isEditing={isEditing}
          name="travel_radius_km"
          onChange={handleInputChange}
          type="number"
        />
        
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2">
            Available Now
          </label>
          <div className={isEditing ? "" : "py-2 px-3 bg-gray-100 rounded"}>
            <input
              type="checkbox"
              name="available_now"
              checked={formData.available_now}
              onChange={handleInputChange}
              disabled={!isEditing}
              className="mr-2 leading-tight h-4 w-4"
            />
            <span className="text-sm">
              {formData.available_now ? "Yes, I'm available" : "Not available right now"}
            </span>
          </div>
        </div>

        {profile?.is_verified && (
          <div className="my-4 bg-green-100 border border-green-400 text-green-700 px-4 py-2 rounded">
            Your profile is verified ✓
          </div>
        )}

        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2">
            Rating
          </label>
          <div className="py-2 px-3 bg-gray-100 rounded flex items-center">
            <span className="text-yellow-500 mr-1">★</span>
            <span>{profile?.rating?.toFixed(1) || "0.0"}</span>
          </div>
        </div>

        <ProfileFormControls 
          isEditing={isEditing}
          onEdit={() => setIsEditing(true)}
          onSave={handleSubmit}
          onCancel={handleCancel}
          isSubmitting={isSubmitting}
        />
      </div>
    </ProfileLayout>
  );
};

export default BarberProfilePage;