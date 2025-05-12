import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Navigate } from 'react-router-dom';
import ProfileImage from '../../components/profilecomponents/ProfileImage';
import ProfileField from '../../components/profilecomponents/ProfileField';
import ProfileFormControls from '../../components/profilecomponents/ProfileFormControls';
import ImageUploader from '../../components/profilecomponents/ImageUploader';
import ProfileLayout from '../../components/profilecomponents/ProfileLayout';
import fetchCustomerProfile from '../../slices/profile/customerProfile/fetchCustomerProfile';
import updateCustomerProfile from '../../slices/profile/customerProfile/updateCustomerProfile';
import { clearErrors } from '../../slices/profile/customerProfile/customerProfileSlice';

const CustomerProfilePage = () => {
  const dispatch = useDispatch();
  const { profile, loading, error } = useSelector(state => state.customerProfile);
  const { isAuthenticated, userType } = useSelector(state => state.authLogin);
  
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    profile_image: null,
    name: '',
    email: '',
    phone: ''
  });
  const [previewImage, setPreviewImage] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Clear errors when component unmounts
  useEffect(() => {
    return () => {
      dispatch(clearErrors());
    };
  }, [dispatch]);

  // Fetch profile data when component mounts
  useEffect(() => {
    if (isAuthenticated) {
      dispatch(fetchCustomerProfile());
    }
  }, [dispatch, isAuthenticated]);

  // Update local state when profile data changes
  useEffect(() => {
    if (profile) {
      setFormData({
        ...profile,
        profile_image: null // Reset file input
      });
      setPreviewImage(profile.profile_image);
    }
  }, [profile]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (file) => {
    if (!file) return;
    
    setFormData(prev => ({ ...prev, profile_image: file }));

    const reader = new FileReader();
    reader.onloadend = () => setPreviewImage(reader.result);
    reader.readAsDataURL(file);
  };

  const handleSubmit = () => {
    if (isSubmitting) return;
    setIsSubmitting(true);

    const data = new FormData();
    
    // Only append fields that have changed
    if (formData.profile_image instanceof File) {
      data.append('profile_image', formData.profile_image);
    }
    
    if (formData.name !== profile.name) {
      data.append('name', formData.name);
    }
    
    if (formData.phone !== profile.phone) {
      data.append('phone', formData.phone);
    }

    if (formData.email !== profile.email) {
      data.append('email', formData.email);
    }

    dispatch(updateCustomerProfile(data))
      .unwrap()
      .then(() => {
        setIsEditing(false);
        dispatch(fetchCustomerProfile());
      })
      .catch((err) => console.error("Update failed", err))
      .finally(() => setIsSubmitting(false));
  };

  const handleCancel = () => {
    setIsEditing(false);
    if (profile) {
      setFormData({
        ...profile,
        profile_image: null
      });
      setPreviewImage(profile.profile_image);
    }
  };

  if (!isAuthenticated) return <Navigate to="/login" replace />;
  if (userType === 'barber') return <Navigate to="/profile/barber" replace />;

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
        <h1 className="text-2xl font-bold">Customer Profile</h1>
        {error && <div className="mt-2 text-red-500 text-sm">{error}</div>}
      </div>

      <div className="mb-6 flex flex-col items-center">
        <ProfileImage src={previewImage} alt={profile?.name || "Customer"} />
        {isEditing && <ImageUploader onImageChange={handleImageChange} />}
      </div>

      <div className="space-y-4">
        <ProfileField 
          label="Name" 
          value={formData.name} 
          isEditing={isEditing} 
          name="name" 
          onChange={handleInputChange}
        />
        <ProfileField 
          label="Email" 
          value={formData.email} 
          isEditing={false} 
          name="email" 
          type="email" 
          onChange={handleInputChange}
        />
        <ProfileField 
          label="Phone" 
          value={formData.phone} 
          isEditing={isEditing} 
          name="phone" 
          onChange={handleInputChange}
        />

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

export default CustomerProfilePage;