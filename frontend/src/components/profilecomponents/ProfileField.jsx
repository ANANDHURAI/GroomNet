import React from 'react';

const ProfileField = ({ label, value, isEditing, name, onChange, type = 'text' }) => {
  return (
    <div className="mb-4">
      <label className="block text-gray-700 text-sm font-bold mb-2">
        {label}
      </label>
      {isEditing ? (
        <input
          type={type}
          name={name}
          value={value || ''}
          onChange={onChange}
          className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
        />
      ) : (
        <div className="py-2 px-3 bg-gray-100 rounded">
          {value || 'Not provided'}
        </div>
      )}
    </div>
  );
};

export default ProfileField;