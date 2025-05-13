import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Navigate, useNavigate } from 'react-router-dom';
import ProfileImage from '../../components/profilecomponents/ProfileImage';
import ProfileField from '../../components/profilecomponents/ProfileField';
import ProfileFormControls from '../../components/profilecomponents/ProfileFormControls';
import ImageUploader from '../../components/profilecomponents/ImageUploader';
import AdminNavbar from '../../components/navbarcomponent/AdminNavbar';
import fetchAdminProfile from '../../slices/profile/adminProfile/fetchAdminProfile';
import updateAdminProfile from '../../slices/profile/adminProfile/updateAdminProfile';
import { clearErrors } from '../../slices/profile/adminProfile/adminProfileSlice';

const AdminProfilePage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { profile, loading, error } = useSelector(state => state.adminProfile || {});
  const { isAdmin, accessToken } = useSelector(state => state.authAdminLogin || {});
  const { name, email } = useSelector(state => state.authAdminLogin || {});

  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    profile_image: null,
    bio: '',
  });
  const [previewImage, setPreviewImage] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Check authentication
  useEffect(() => {
    // If we don't have an access token, redirect to login
    if (!accessToken) {
      navigate('/aadmin/login');
    }
  }, [accessToken, navigate]);

  useEffect(() => {
    // Clear any existing errors when the component mounts
    dispatch(clearErrors());
    
    // Fetch profile data
    dispatch(fetchAdminProfile())
      .unwrap()
      .catch(err => {
        console.error("Failed to fetch profile:", err);
        // If we get a 401 or 403, redirect to login
        if (err?.response?.status === 401 || err?.response?.status === 403) {
          navigate('/aadmin/login');
        }
      });
  }, [dispatch, navigate]);

  useEffect(() => {
    if (profile) {
      setFormData({ 
        ...profile,
        bio: profile.bio || '' 
      });
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

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({...formData, [name]: value});
  };

  const handleSubmit = () => {
    if (isSubmitting) return;
    setIsSubmitting(true);

    const data = new FormData();
    if (formData.profile_image instanceof File) {
      data.append('profile_image', formData.profile_image);
    }
    
    if (formData.bio !== (profile?.bio || '')) {
      data.append('bio', formData.bio);
    }

    // Only proceed with the API call if there's data to update
    const hasData = Array.from(data.entries()).length > 0;
    if (!hasData) {
      setIsEditing(false);
      setIsSubmitting(false);
      return;
    }

    dispatch(updateAdminProfile(data))
      .unwrap()
      .then(() => {
        setIsEditing(false);
        // Re-fetch the profile to ensure we have the latest data
        dispatch(fetchAdminProfile());
      })
      .catch((err) => {
        console.error("Update failed", err);
      })
      .finally(() => setIsSubmitting(false));
  };

  const handleCancel = () => {
    setIsEditing(false);
    if (profile) {
      setFormData({ 
        ...profile,
        bio: profile.bio || '' 
      });
      setPreviewImage(profile.profile_image);
    }
    // Clear any errors that might be showing
    dispatch(clearErrors());
  };

  // If not authenticated as admin, redirect to login
  if (!accessToken) {
    return <Navigate to="/aadmin/login" replace />;
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <AdminNavbar />
      
      <div className="mx-auto max-w-3xl py-8 px-4 sm:px-6 lg:px-8">
        <div className="bg-white shadow overflow-hidden rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <div className="text-center mb-8">
              <h1 className="text-2xl font-bold text-gray-900">Admin Profile</h1>
              {error && <div className="mt-2 text-red-500 text-sm">{error}</div>}
            </div>

            {loading ? (
              <div className="flex justify-center items-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
              </div>
            ) : (
              <>
                <div className="flex flex-col items-center mb-6">
                  <ProfileImage 
                    src={previewImage} 
                    alt={name || "Admin"} 
                  />
                  {isEditing && <ImageUploader onImageChange={handleImageChange} />}
                </div>

                <div className="space-y-4">
                  <ProfileField 
                    label="Name" 
                    value={name || ''} 
                    isEditing={false} 
                    name="name" 
                  />
                  <ProfileField 
                    label="Email" 
                    value={email || ''} 
                    isEditing={false} 
                    name="email" 
                    type="email" 
                  />
                  <ProfileField 
                    label="Bio" 
                    value={isEditing ? formData.bio : (profile?.bio || "No bio set")} 
                    isEditing={isEditing} 
                    name="bio" 
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
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminProfilePage;