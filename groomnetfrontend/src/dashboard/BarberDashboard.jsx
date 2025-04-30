import { FaCalendarCheck, FaMoneyBillWave, FaUserClock, FaStar } from "react-icons/fa"

function BarberDashboard() {

  const stats = [
    { id: 1, title: "Today's Appointments", value: "3", icon: <FaCalendarCheck />, color: "bg-blue-500" },
    { id: 2, title: "Weekly Earnings", value: "$450", icon: <FaMoneyBillWave />, color: "bg-green-500" },
    { id: 3, title: "Pending Requests", value: "5", icon: <FaUserClock />, color: "bg-yellow-500" },
    { id: 4, title: "Average Rating", value: "4.8", icon: <FaStar />, color: "bg-purple-500" },
  ]


  const appointments = [
    { id: 1, client: "James Wilson", time: "10:30 AM", service: "Haircut & Beard Trim", status: "confirmed" },
    { id: 2, client: "Emily Johnson", time: "1:15 PM", service: "Hair Styling", status: "confirmed" },
    { id: 3, client: "Michael Brown", time: "4:00 PM", service: "Haircut", status: "confirmed" },
  ]

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold">Barber Dashboard</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat) => (
          <div key={stat.id} className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className={`p-3 rounded-full ${stat.color} text-white mr-4`}>{stat.icon}</div>
              <div>
                <p className="text-sm text-gray-500">{stat.title}</p>
                <p className="text-2xl font-bold">{stat.value}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="px-6 py-4 border-b">
          <h3 className="text-lg font-semibold">Today's Appointments</h3>
        </div>
        <div className="divide-y divide-gray-200">
          {appointments.length > 0 ? (
            appointments.map((appointment) => (
              <div key={appointment.id} className="px-6 py-4">
                <div className="flex justify-between items-center">
                  <div>
                    <p className="font-medium text-gray-900">{appointment.client}</p>
                    <p className="text-sm text-gray-500">{appointment.service}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-medium text-gray-900">{appointment.time}</p>
                    <p className="text-sm">
                      <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                        {appointment.status}
                      </span>
                    </p>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="px-6 py-4 text-center text-gray-500">No appointments scheduled for today</div>
          )}
        </div>
      </div>

      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-semibold mb-4">Verification Status</h3>
        <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
          <div className="flex items-start">
            <div className="flex-shrink-0">
              <FaUserClock className="h-5 w-5 text-yellow-400" />
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-yellow-800">Verification Pending</h3>
              <div className="mt-2 text-sm text-yellow-700">
                <p>Your account is currently under review. This process typically takes 1-2 business days.</p>
              </div>
              <div className="mt-4">
                <div className="relative pt-1">
                  <div className="overflow-hidden h-2 text-xs flex rounded bg-yellow-200">
                    <div
                      style={{ width: "60%" }}
                      className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-yellow-500"
                    ></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default BarberDashboard
