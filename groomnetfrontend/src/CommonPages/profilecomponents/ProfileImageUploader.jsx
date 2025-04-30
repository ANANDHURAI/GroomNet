
import { useRef } from "react"
import { FaCamera, FaTrash } from "react-icons/fa"

function ProfileImageUploader({ isEditing, imagePreview, profilePicture, onImageChange, onRemoveImage }) {
  const fileInputRef = useRef(null)

  const handleFileChange = (e) => {
    const file = e.target.files[0]
    if (file) {
      const reader = new FileReader()
      reader.onloadend = () => {
        onImageChange(file, reader.result)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleButtonClick = () => {
    fileInputRef.current.click()
  }

  return (
    <div className="flex flex-col items-center">
      <div className="relative w-40 h-40 mb-4">
        <div className="w-40 h-40 rounded-full overflow-hidden border-4 border-white shadow-lg">
          {imagePreview || profilePicture ? (
            <img src={imagePreview || profilePicture} alt="Profile" className="w-full h-full object-cover" />
          ) : (
            <div className="w-full h-full bg-gray-200 flex items-center justify-center">
              <span className="text-gray-400 text-5xl">
                <FaCamera />
              </span>
            </div>
          )}
        </div>

        {isEditing && (
          <div className="absolute bottom-0 right-0 flex space-x-2">
            <button
              type="button"
              onClick={handleButtonClick}
              className="bg-blue-600 text-white p-2 rounded-full shadow-md hover:bg-blue-700 transition-colors"
            >
              <FaCamera />
            </button>

            {(imagePreview || profilePicture) && (
              <button
                type="button"
                onClick={onRemoveImage}
                className="bg-red-600 text-white p-2 rounded-full shadow-md hover:bg-red-700 transition-colors"
              >
                <FaTrash />
              </button>
            )}
          </div>
        )}
      </div>

      <input type="file" ref={fileInputRef} onChange={handleFileChange} accept="image/*" className="hidden" />
    </div>
  )
}

export default ProfileImageUploader
