import React from 'react';
import { NavLink } from 'react-router-dom';

const AdminSidebar = () => {
  return (
    <div className="w-64 bg-white h-full border-r border-gray-200 p-4">
      <h2 className="text-xl font-bold mb-6 text-gray-800">Admin Panel</h2>
      <ul className="space-y-2">
        <li>
          <NavLink 
            to="/admin/dashboard" 
            className={({ isActive }) =>
              `block px-4 py-2 rounded-md ${
                isActive ? 'bg-purple-100 text-purple-700' : 'text-gray-700 hover:bg-gray-100'
              }`
            }
          >
            Dashboard
          </NavLink>
        </li>
        <li>
          <NavLink 
            to="/customers" 
            className={({ isActive }) =>
              `block px-4 py-2 rounded-md ${
                isActive ? 'bg-purple-100 text-purple-700' : 'text-gray-700 hover:bg-gray-100'
              }`
            }
          >
            Customers
          </NavLink>
        </li>
        <li>
          <NavLink 
            to="/barbers" 
            className={({ isActive }) =>
              `block px-4 py-2 rounded-md ${
                isActive ? 'bg-purple-100 text-purple-700' : 'text-gray-700 hover:bg-gray-100'
              }`
            }
          >
            Barbers
          </NavLink>
        </li>
        <li>
          <NavLink 
            to="/verifications" 
            className={({ isActive }) =>
              `block px-4 py-2 rounded-md ${
                isActive ? 'bg-purple-100 text-purple-700' : 'text-gray-700 hover:bg-gray-100'
              }`
            }
          >
            Verification Pending
          </NavLink>
        </li>
      </ul>
    </div>
  );
};

export default AdminSidebar;
