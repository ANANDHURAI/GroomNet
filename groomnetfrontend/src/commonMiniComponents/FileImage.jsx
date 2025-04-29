import React from 'react';

function FileImage({ name, setFieldValue, error, touched }) {
  return (
    <div className="mb-4">
      <input
        type="file"
        name={name}
        onChange={(event) => setFieldValue(name, event.currentTarget.files[0])}
        className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4
                   file:rounded-md file:border-0
                   file:text-sm file:font-semibold
                   file:bg-blue-50 file:text-blue-700
                   hover:file:bg-blue-100"
      />
      {touched && error && (
        <div className="text-red-500 text-sm mt-1">{error}</div>
      )}
    </div>
  );
}

export default FileImage;
