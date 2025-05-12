import React from 'react';

const ProfileImage = ({ src, alt }) => {
  return (
    <div className="flex justify-center">
      <div className="w-32 h-32 rounded-full overflow-hidden bg-gray-200">
        {src ? (
          <img 
            src={src} 
            alt={alt || "Profile"} 
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gray-300">
            <svg 
              xmlns="http://www.w3.org/2000/svg" 
              className="h-16 w-16 text-gray-500" 
              fill="none" 
              viewBox="0 0 24 24" 
              stroke="currentColor"
            >
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth={1} 
                d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14c-4.418 0-8 1.79-8 4v2h16v-2c0-2.21-3.582-4-8-4z" 
              />
            </svg>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProfileImage;