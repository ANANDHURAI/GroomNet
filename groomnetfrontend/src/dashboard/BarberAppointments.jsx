
import { useState } from "react"
import { FaCheck, FaTimes, FaClock } from "react-icons/fa"

function BarberAppointments() {
  const [filter, setFilter] = useState("upcoming")
  const appointments = [
    {
      id: 1,
      client: "James Wilson",
      date: "2023-05-15",
      time: "10:30 AM",
      service: "Haircut & Beard Trim",
      status: "upcoming",
      price: "$45",
    },
    {
      id: 2,
      client: "Emily Johnson",
      date: "2023-05-15",
      time: "1:15 PM",
      service: "Hair Styling",
      status: "upcoming",
      price: "$60",
    },
    
  ]

  const filteredAppointments = appointments.filter((appointment) => {
    if (filter === "all") return true
    return appointment.status === filter
  })

  const getStatusBadge = (status) => {
    switch (status) {
      case "upcoming":
        return (
          <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800">
            <FaClock className="mr-1" /> Upcoming
          </span>
        )
      case "completed":
        return (
          <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
            <FaCheck className="mr-1" /> Completed
          </span>
        )
      case "cancelled":
        return (
          <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-red-100 text-red-800">
            <FaTimes className="mr-1" /> Cancelled
          </span>
        )
      default:
        return null
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">Appointments</h2>
        <div className="flex space-x-2">
          <button
            onClick={() => setFilter("upcoming")}
            className={`px-3 py-1 text-sm rounded-md ${filter === "upcoming" ? "bg-blue-600 text-white" : "bg-gray-200 text-gray-700"}`}
          >
            Upcoming
          </button>
          <button
            onClick={() => setFilter("completed")}
            className={`px-3 py-1 text-sm rounded-md ${filter === "completed" ? "bg-blue-600 text-white" : "bg-gray-200 text-gray-700"}`}
          >
            Completed
          </button>
          <button
            onClick={() => setFilter("cancelled")}
            className={`px-3 py-1 text-sm rounded-md ${filter === "cancelled" ? "bg-blue-600 text-white" : "bg-gray-200 text-gray-700"}`}
          >
            Cancelled
          </button>
          <button
            onClick={() => setFilter("all")}
            className={`px-3 py-1 text-sm rounded-md ${filter === "all" ? "bg-blue-600 text-white" : "bg-gray-200 text-gray-700"}`}
          >
            All
          </button>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Client
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Date & Time
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Service
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Price
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredAppointments.length > 0 ? (
                filteredAppointments.map((appointment) => (
                  <tr key={appointment.id}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="font-medium text-gray-900">{appointment.client}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-gray-900">{appointment.date}</div>
                      <div className="text-gray-500">{appointment.time}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-gray-900">{appointment.service}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-gray-900">{appointment.price}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">{getStatusBadge(appointment.status)}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      {appointment.status === "upcoming" && (
                        <div className="flex space-x-2">
                          <button className="text-blue-600 hover:text-blue-900">Details</button>
                          <button className="text-red-600 hover:text-red-900">Cancel</button>
                        </div>
                      )}
                      {appointment.status === "completed" && (
                        <button className="text-blue-600 hover:text-blue-900">Details</button>
                      )}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="6" className="px-6 py-4 text-center text-gray-500">
                    No appointments found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

export default BarberAppointments
