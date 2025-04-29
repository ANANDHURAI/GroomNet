import React from 'react';
import { useField } from 'formik';

function SelectOption({ name }) {
  const [field, meta] = useField(name);

  return (
    <div className="mb-4">
      <label htmlFor={name} className="block mb-1 font-medium text-gray-700">User Type</label>
      <select
        {...field}
        id={name}
        className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
      >
        <option value="">Select Type</option>
        <option value="user">User</option>
        <option value="admin">Admin</option>
        <option value="barber">Barber</option>
      </select>
      {meta.touched && meta.error && (
        <div className="text-red-500 text-sm mt-1">{meta.error}</div>
      )}
    </div>
  );
}

export default SelectOption;


