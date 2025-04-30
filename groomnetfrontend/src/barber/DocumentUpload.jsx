"use client"

import { useState, useRef } from "react"
import { FaUpload, FaFile, FaCheck } from "react-icons/fa"

function DocumentUpload() {
  const [documents, setDocuments] = useState({
    license: { file: null, status: "pending" },
    certificate: { file: null, status: "pending" },
    sampleVideo: { file: null, status: "pending" },
  })

  const licenseInputRef = useRef(null)
  const certificateInputRef = useRef(null)
  const videoInputRef = useRef(null)

  const handleFileChange = (e, documentType) => {
    const file = e.target.files[0]
    if (file) {
      setDocuments((prev) => ({
        ...prev,
        [documentType]: {
          file: file,
          status: "pending",
        },
      }))
    }
  }

  const handleUpload = async (documentType) => {
    // In a real app, this would upload the file to a server
    // For now, we'll just simulate the upload process

    setDocuments((prev) => ({
      ...prev,
      [documentType]: {
        ...prev[documentType],
        status: "uploading",
      },
    }))

    // Simulate upload delay
    setTimeout(() => {
      setDocuments((prev) => ({
        ...prev,
        [documentType]: {
          ...prev[documentType],
          status: "uploaded",
        },
      }))
    }, 1500)
  }

  const getStatusBadge = (status) => {
    switch (status) {
      case "pending":
        return <span className="px-2 py-1 text-xs rounded-full bg-yellow-100 text-yellow-800">Pending</span>
      case "uploading":
        return <span className="px-2 py-1 text-xs rounded-full bg-blue-100 text-blue-800">Uploading...</span>
      case "uploaded":
        return <span className="px-2 py-1 text-xs rounded-full bg-green-100 text-green-800">Uploaded</span>
      case "rejected":
        return <span className="px-2 py-1 text-xs rounded-full bg-red-100 text-red-800">Rejected</span>
      case "approved":
        return <span className="px-2 py-1 text-xs rounded-full bg-green-100 text-green-800">Approved</span>
      default:
        return null
    }
  }

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <div className="mb-6">
        <h2 className="text-xl font-semibold mb-2">Document Verification</h2>
        <p className="text-gray-600">
          Please upload the required documents to complete your barber verification process. All documents will be
          reviewed by our admin team.
        </p>
      </div>

      <div className="space-y-6">
        {/* Barber License */}
        <div className="border rounded-lg p-4">
          <div className="flex justify-between items-start">
            <div>
              <h3 className="font-medium text-gray-900">Barber License</h3>
              <p className="text-sm text-gray-500 mt-1">Upload a clear image of your valid barber license</p>
            </div>
            <div>{getStatusBadge(documents.license.status)}</div>
          </div>

          <div className="mt-4">
            {documents.license.file ? (
              <div className="flex items-center justify-between bg-gray-50 p-3 rounded">
                <div className="flex items-center">
                  <FaFile className="text-blue-500 mr-2" />
                  <span className="text-sm text-gray-700 truncate max-w-xs">{documents.license.file.name}</span>
                </div>
                <div className="flex space-x-2">
                  {documents.license.status === "pending" && (
                    <button
                      onClick={() => handleUpload("license")}
                      className="px-3 py-1 bg-blue-600 text-white text-sm rounded hover:bg-blue-700"
                    >
                      Upload
                    </button>
                  )}
                  {documents.license.status === "uploading" && (
                    <div className="animate-pulse px-3 py-1 bg-blue-400 text-white text-sm rounded">Uploading...</div>
                  )}
                  {documents.license.status === "uploaded" && (
                    <div className="flex items-center text-green-600">
                      <FaCheck className="mr-1" /> Uploaded
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <button
                onClick={() => licenseInputRef.current.click()}
                className="w-full flex items-center justify-center px-4 py-2 border border-dashed border-gray-300 rounded-md text-sm text-gray-700 hover:bg-gray-50"
              >
                <FaUpload className="mr-2" />
                Select File
              </button>
            )}
            <input
              type="file"
              ref={licenseInputRef}
              onChange={(e) => handleFileChange(e, "license")}
              accept="image/*,.pdf"
              className="hidden"
            />
          </div>
        </div>

        {/* Certificate */}
        <div className="border rounded-lg p-4">
          <div className="flex justify-between items-start">
            <div>
              <h3 className="font-medium text-gray-900">Professional Certificate</h3>
              <p className="text-sm text-gray-500 mt-1">Upload any professional certificates or qualifications</p>
            </div>
            <div>{getStatusBadge(documents.certificate.status)}</div>
          </div>

          <div className="mt-4">
            {documents.certificate.file ? (
              <div className="flex items-center justify-between bg-gray-50 p-3 rounded">
                <div className="flex items-center">
                  <FaFile className="text-blue-500 mr-2" />
                  <span className="text-sm text-gray-700 truncate max-w-xs">{documents.certificate.file.name}</span>
                </div>
                <div className="flex space-x-2">
                  {documents.certificate.status === "pending" && (
                    <button
                      onClick={() => handleUpload("certificate")}
                      className="px-3 py-1 bg-blue-600 text-white text-sm rounded hover:bg-blue-700"
                    >
                      Upload
                    </button>
                  )}
                  {documents.certificate.status === "uploading" && (
                    <div className="animate-pulse px-3 py-1 bg-blue-400 text-white text-sm rounded">Uploading...</div>
                  )}
                  {documents.certificate.status === "uploaded" && (
                    <div className="flex items-center text-green-600">
                      <FaCheck className="mr-1" /> Uploaded
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <button
                onClick={() => certificateInputRef.current.click()}
                className="w-full flex items-center justify-center px-4 py-2 border border-dashed border-gray-300 rounded-md text-sm text-gray-700 hover:bg-gray-50"
              >
                <FaUpload className="mr-2" />
                Select File
              </button>
            )}
            <input
              type="file"
              ref={certificateInputRef}
              onChange={(e) => handleFileChange(e, "certificate")}
              accept="image/*,.pdf"
              className="hidden"
            />
          </div>
        </div>

        {/* Sample Haircut Video */}
        <div className="border rounded-lg p-4">
          <div className="flex justify-between items-start">
            <div>
              <h3 className="font-medium text-gray-900">Sample Haircut Video</h3>
              <p className="text-sm text-gray-500 mt-1">Upload a short video showcasing your haircut skills</p>
            </div>
            <div>{getStatusBadge(documents.sampleVideo.status)}</div>
          </div>

          <div className="mt-4">
            {documents.sampleVideo.file ? (
              <div className="flex items-center justify-between bg-gray-50 p-3 rounded">
                <div className="flex items-center">
                  <FaFile className="text-blue-500 mr-2" />
                  <span className="text-sm text-gray-700 truncate max-w-xs">{documents.sampleVideo.file.name}</span>
                </div>
                <div className="flex space-x-2">
                  {documents.sampleVideo.status === "pending" && (
                    <button
                      onClick={() => handleUpload("sampleVideo")}
                      className="px-3 py-1 bg-blue-600 text-white text-sm rounded hover:bg-blue-700"
                    >
                      Upload
                    </button>
                  )}
                  {documents.sampleVideo.status === "uploading" && (
                    <div className="animate-pulse px-3 py-1 bg-blue-400 text-white text-sm rounded">Uploading...</div>
                  )}
                  {documents.sampleVideo.status === "uploaded" && (
                    <div className="flex items-center text-green-600">
                      <FaCheck className="mr-1" /> Uploaded
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <button
                onClick={() => videoInputRef.current.click()}
                className="w-full flex items-center justify-center px-4 py-2 border border-dashed border-gray-300 rounded-md text-sm text-gray-700 hover:bg-gray-50"
              >
                <FaUpload className="mr-2" />
                Select Video
              </button>
            )}
            <input
              type="file"
              ref={videoInputRef}
              onChange={(e) => handleFileChange(e, "sampleVideo")}
              accept="video/*"
              className="hidden"
            />
          </div>
        </div>
      </div>

      <div className="mt-8 p-4 bg-blue-50 border border-blue-200 rounded-lg">
        <div className="flex items-start">
          <div className="flex-shrink-0">
            <FaCheck className="h-5 w-5 text-blue-400" />
          </div>
          <div className="ml-3">
            <h3 className="text-sm font-medium text-blue-800">Verification Process</h3>
            <div className="mt-2 text-sm text-blue-700">
              <p>
                Once all documents are uploaded, our admin team will review your application within 1-2 business days.
                You'll receive an email notification when your account is approved.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default DocumentUpload
