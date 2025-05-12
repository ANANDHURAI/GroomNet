import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import ProfileImage from '../../components/profilecomponents/ProfileImage';
import ProfileField from '../../components/profilecomponents/ProfileField';
import ProfileFormControls from '../../components/profilecomponents/ProfileFormControls';
import ImageUploader from '../../components/profilecomponents/ImageUploader';
import ProfileLayout from '../../components/profilecomponents/ProfileLayout';
import fetchAdminProfile from '../../slices/profile/adminProfile/fetchAdminProfile';
import updateAdminProfile from '../../slices/profile/adminProfile/updateAdminProfile';
import { clearErrors } from '../../slices/profile/adminProfile/adminProfileSlice';
import { Navigate } from 'react-router-dom';

const AdminProfilePage = () => {
  const dispatch = useDispatch();
  const { profile, loading, error } = useSelector(state => state.adminProfile);
  const { isAuthenticated, userType } = useSelector(state => state.authLogin);

  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    profile_image: null,
  });
  const [previewImage, setPreviewImage] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (isAuthenticated) dispatch(fetchAdminProfile());
  }, [dispatch, isAuthenticated]);

  useEffect(() => {
    if (profile) {
      setFormData({ ...profile });
      setPreviewImage(profile.profile_image);
    }
  }, [profile]);

  const handleImageChange = (file) => {
    if (!file) return;
    setFormData({ ...formData, profile_image: file });

    const reader = new FileReader();
    reader.onloadend = () => setPreviewImage(reader.result);
    reader.readAsDataURL(file);
  };

  const handleSubmit = () => {
    if (isSubmitting) return;
    setIsSubmitting(true);

    const data = new FormData();
    if (formData.profile_image instanceof File) {
      data.append('profile_image', formData.profile_image);
    }
    
    if (formData.bio !== profile.bio) {
      data.append('bio', formData.bio);
    }

    dispatch(updateAdminProfile(data))
      .unwrap()
      .then(() => {
        setIsEditing(false);
        dispatch(fetchAdminProfile());
      })
      .catch((err) => console.error("Update failed", err))
      .finally(() => setIsSubmitting(false));
  };

  const handleCancel = () => {
    setIsEditing(false);
    setFormData({ ...profile });
    setPreviewImage(profile?.profile_image);
  };

  if (!isAuthenticated) return <Navigate to="/admin/login" replace />;
  if (userType !== 'admin') return <Navigate to="/" replace />;

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
        <h1 className="text-2xl font-bold">Admin Profile</h1>
        {error && <div className="mt-2 text-red-500 text-sm">{error}</div>}
      </div>

      <div className="mb-6">
        <ProfileImage src={previewImage} alt={profile?.user?.name || "Admin"} />
        {isEditing && <ImageUploader onImageChange={handleImageChange} />}
      </div>

      <div className="space-y-4">
        <ProfileField label="Name" value={profile?.user?.name} isEditing={false} name="name" />
        <ProfileField label="Email" value={profile?.user?.email} isEditing={false} name="email" type="email" />
        <ProfileField label="Bio" value={isEditing ? formData.bio : (profile?.bio || "No bio set")} 
          isEditing={isEditing} 
          name="bio" 
          onChange={(e) => setFormData({...formData, bio: e.target.value})} />

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

export default AdminProfilePage;