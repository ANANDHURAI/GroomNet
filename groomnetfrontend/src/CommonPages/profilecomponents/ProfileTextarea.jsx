

function ProfileTextarea({ label, name, value, onChange, disabled = false, required = false, rows = 4 }) {
  return (
    <div className="space-y-2">
      <label htmlFor={name} className="block text-sm font-medium text-gray-700">
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      <textarea
        name={name}
        id={name}
        rows={rows}
        value={value}
        onChange={onChange}
        disabled={disabled}
        required={required}
        className={`block w-full px-4 py-2 rounded-md border ${
          disabled
            ? "bg-gray-100 border-gray-300 text-gray-500"
            : "border-gray-300 focus:ring-blue-500 focus:border-blue-500"
        }`}
      />
    </div>
  )
}

export default ProfileTextarea
