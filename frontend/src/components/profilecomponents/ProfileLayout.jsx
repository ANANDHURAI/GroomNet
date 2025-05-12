import React from 'react';

const ProfileLayout = ({ children }) => {
  return (
    <div className="max-w-2xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
      <div className="bg-white shadow overflow-hidden sm:rounded-lg p-6">
        {children}
      </div>
    </div>
  );
};

export default ProfileLayout;