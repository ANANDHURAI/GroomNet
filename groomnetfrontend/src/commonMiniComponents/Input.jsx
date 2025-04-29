import React from 'react';
import { useField } from 'formik';

function Input({ name }) {
  const [field, meta] = useField(name);

  return (
    <div className="mb-4">
      <input
        {...field}
        type={name === 'password' || name === 'confirmPassword' ? 'password' : 'text'}
        placeholder={name.charAt(0).toUpperCase() + name.slice(1)}
        className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
      />
      {meta.touched && meta.error && (
        <div className="text-red-500 text-sm mt-1">{meta.error}</div>
      )}
    </div>
  );
}

export default Input;
