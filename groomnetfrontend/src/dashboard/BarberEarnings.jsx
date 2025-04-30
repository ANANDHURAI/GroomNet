

import { useState } from "react"
import { FaMoneyBillWave, FaChartLine, FaCalendarAlt } from "react-icons/fa"

function BarberEarnings() {
  const [timeframe, setTimeframe] = useState("week")

  
  const earningsData = {
    week: {
      total: "$450",
      average: "$64.29",
      transactions: [
        { id: 1, date: "2023-05-14", client: "Sarah Davis", service: "Haircut & Color", amount: "$120" },
        { id: 2, date: "2023-05-14", client: "Robert Miller", service: "Beard Trim", amount: "$25" },
        { id: 3, date: "2023-05-13", client: "Jennifer Wilson", service: "Hair Styling", amount: "$55" },
        { id: 4, date: "2023-05-12", client: "Michael Brown", service: "Haircut", amount: "$30" },
        { id: 5, date: "2023-05-11", client: "Emily Johnson", service: "Hair Styling", amount: "$60" },
        { id: 6, date: "2023-05-10", client: "James Wilson", service: "Haircut & Beard Trim", amount: "$45" },
        { id: 7, date: "2023-05-09", client: "Lisa Martinez", service: "Haircut", amount: "$30" },
        { id: 8, date: "2023-05-08", client: "David Garcia", service: "Beard Trim", amount: "$25" },
      ],
    },
    month: {
      total: "$1,850",
      average: "$61.67",
      transactions: [
        { id: 1, date: "2023-05-14", client: "Sarah Davis", service: "Haircut & Color", amount: "$120" },
        { id: 2, date: "2023-05-14", client: "Robert Miller", service: "Beard Trim", amount: "$25" },
        { id: 3, date: "2023-05-13", client: "Jennifer Wilson", service: "Hair Styling", amount: "$55" },
        
      ],
    },
    year: {
      total: "$21,450",
      average: "$59.58",
      transactions: [
        { id: 1, date: "2023-05-14", client: "Sarah Davis", service: "Haircut & Color", amount: "$120" },
        { id: 2, date: "2023-05-14", client: "Robert Miller", service: "Beard Trim", amount: "$25" },
        
      ],
    },
  }

  const currentData = earningsData[timeframe]

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">Earnings</h2>
        <div className="flex space-x-2">
          <button
            onClick={() => setTimeframe("week")}
            className={`px-3 py-1 text-sm rounded-md ${timeframe === "week" ? "bg-blue-600 text-white" : "bg-gray-200 text-gray-700"}`}
          >
            This Week
          </button>
          <button
            onClick={() => setTimeframe("month")}
            className={`px-3 py-1 text-sm rounded-md ${timeframe === "month" ? "bg-blue-600 text-white" : "bg-gray-200 text-gray-700"}`}
          >
            This Month
          </button>
          <button
            onClick={() => setTimeframe("year")}
            className={`px-3 py-1 text-sm rounded-md ${timeframe === "year" ? "bg-blue-600 text-white" : "bg-gray-200 text-gray-700"}`}
          >
            This Year
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-green-500 text-white mr-4">
              <FaMoneyBillWave />
            </div>
            <div>
              <p className="text-sm text-gray-500">Total Earnings</p>
              <p className="text-3xl font-bold">{currentData.total}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-blue-500 text-white mr-4">
              <FaChartLine />
            </div>
            <div>
              <p className="text-sm text-gray-500">Average Per Day</p>
              <p className="text-3xl font-bold">{currentData.average}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
          <h3 className="text-lg font-semibold">Transaction History</h3>
          <div className="flex items-center text-gray-500">
            <FaCalendarAlt className="mr-2" />
            <span>
              {timeframe === "week" ? "Last 7 days" : timeframe === "month" ? "Last 30 days" : "Last 365 days"}
            </span>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Client
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Service
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Amount
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {currentData.transactions.map((transaction) => (
                <tr key={transaction.id}>
                  <td className="px-6 py-4 whitespace-nowrap text-gray-900">{transaction.date}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-gray-900">{transaction.client}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-gray-900">{transaction.service}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-right font-medium text-gray-900">
                    {transaction.amount}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

export default BarberEarnings
