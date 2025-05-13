import React from 'react';

const InputField = ({ label, type, name, value, onChange, placeholder }) => {
  return (
    <div className="input-field">
      <label>{label}</label>
      <input
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className="input"
        required
      />
    </div>
  );
};

export default InputField;
