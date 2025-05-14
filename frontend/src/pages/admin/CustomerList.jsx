import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchCustomers, toggleBlock } from '../../slices/adminManagement/customer/customerSlice';
import { useNavigate } from 'react-router-dom';
import AdminSidebar from '../../components/adminComponents/AdminSidebar';

export default function CustomerList() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { list, status, error } = useSelector(state => state.customers);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const { accessToken } = useSelector(state => state.authTokenUpdate);

  useEffect(() => {
  
    if (localStorage.getItem('access_token') || accessToken) {
      dispatch(fetchCustomers());
    } else {
      
      navigate('/aadmin/login');
    }
  }, [dispatch, navigate, accessToken]);

  const handleToggleBlock = (userId) => {
    dispatch(toggleBlock(userId))
      .unwrap()
      .then(() => {
      })
      .catch(error => {
        if (error.includes('Session expired') || error.includes('401')) {
         
          navigate('/aadmin/login');
        }
      });
  };

  const handleRefresh = () => {
    setIsRefreshing(true);
    dispatch(fetchCustomers())
      .finally(() => {
        setIsRefreshing(false);
      });
  };

  
  if (status === 'loading' && !isRefreshing) {
    return (
      <div className="flex h-screen">
        <AdminSidebar />
        <div className="flex-1 p-6 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500 mx-auto"></div>
            <p className="mt-3 text-gray-500">Loading customers...</p>
          </div>
        </div>
      </div>
    );
  }

 
  if (status === 'failed') {
    return (
      <div className="flex h-screen">
        <AdminSidebar />
        <div className="flex-1 p-6 flex items-center justify-center">
          <div className="bg-red-50 p-6 rounded-lg max-w-md text-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-red-500 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
            <h3 className="text-lg font-medium text-red-800 mb-2">Failed to load customers</h3>
            <p className="text-sm text-red-700 mb-4">
              {error && (error.includes('401') || error.includes('Session expired'))
                ? 'Your session has expired. Please login again.'
                : `Error: ${error || 'Unable to connect to server'}`}
            </p>
            <div className="flex justify-center space-x-3">
              <button
                onClick={handleRefresh}
                className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
              >
                Try Again
              </button>
              {(error && (error.includes('401') || error.includes('Session expired'))) && (
                <button
                  onClick={() => navigate('/aadmin/login')}
                  className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500"
                >
                  Login Again
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-gray-50">
      <AdminSidebar />
      <div className="flex-1 p-6 overflow-auto">
        <div className="flex justify-between mb-6 items-center">
          <h1 className="text-xl font-bold text-gray-800">Customer Management</h1>
          <button 
            onClick={handleRefresh}
            className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500"
            disabled={isRefreshing}
          >
            {isRefreshing ? (
              <>
                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-gray-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Refreshing...
              </>
            ) : (
              'Refresh'
            )}
          </button>
        </div>

        <div className="bg-white shadow overflow-hidden rounded-lg">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Name
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Email
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Phone
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Action
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {list && list.length > 0 ? (
                list.map(customer => (
                  <tr key={customer.id}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        {customer.profile_image && (
                          <div className="flex-shrink-0 h-10 w-10 mr-3">
                            <img 
                              className="h-10 w-10 rounded-full object-cover" 
                              src={customer.profile_image} 
                              alt={customer.name} 
                              onError={(e) => {
                                e.target.onerror = null;
                                e.target.src = "https://via.placeholder.com/40?text=User";
                              }}
                            />
                          </div>
                        )}
                        <div className="text-sm font-medium text-gray-900">{customer.name}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-500">{customer.email}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-500">{customer.phone}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        customer.is_blocked ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'
                      }`}>
                        {customer.is_blocked ? 'Blocked' : 'Active'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <button
                        onClick={() => handleToggleBlock(customer.id)}
                        className={`px-3 py-1 rounded-md text-sm font-medium ${
                          customer.is_blocked 
                            ? 'bg-green-50 text-green-700 hover:bg-green-100' 
                            : 'bg-red-50 text-red-700 hover:bg-red-100'
                        }`}
                        disabled={customer.isUpdating}
                      >
                        {customer.isUpdating ? (
                          <span className="inline-flex items-center">
                            <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-current" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                          </span>
                        ) : (
                          customer.is_blocked ? 'Unblock' : 'Block'
                        )}
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="5" className="px-6 py-4 text-center text-sm text-gray-500">
                    No customers found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}