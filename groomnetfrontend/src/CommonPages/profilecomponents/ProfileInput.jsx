
function ProfileInput({
  label,
  name,
  value,
  onChange,
  disabled = false,
  required = false,
  type = "text",
  icon = null,
}) {
  return (
    <div className="space-y-2">
      <label htmlFor={name} className="block text-sm font-medium text-gray-700">
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      <div className="relative rounded-md shadow-sm">
        {icon && <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">{icon}</div>}
        <input
          type={type}
          name={name}
          id={name}
          value={value}
          onChange={onChange}
          disabled={disabled}
          required={required}
          className={`block w-full ${icon ? "pl-10" : "pl-4"} pr-4 py-2 rounded-md border ${
            disabled
              ? "bg-gray-100 border-gray-300 text-gray-500"
              : "border-gray-300 focus:ring-blue-500 focus:border-blue-500"
          }`}
        />
      </div>
    </div>
  )
}

export default ProfileInput
