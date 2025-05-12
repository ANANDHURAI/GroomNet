export const initializeAuth = (dispatch) => {
  const userData = localStorage.getItem('user');
  const accessToken = localStorage.getItem('access_token');
  const refreshToken = localStorage.getItem('refresh_token');
  
  if (userData && accessToken && refreshToken) {
    try {
      const user = JSON.parse(userData);
      user.accessToken = accessToken;
      user.refreshToken = refreshToken;
      
      if (user.isAdmin) {
        dispatch(adminLogin({
          name: user.name,
          email: user.email,
          accessToken: user.accessToken,
          refreshToken: user.refreshToken,
          isSuperuser: user.isSuperuser
        }));
      } else {
        dispatch(login({
          name: user.name,
          email: user.email,
          userType: user.userType,
          phone: user.phone,
          accessToken: user.accessToken,
          refreshToken: user.refreshToken
        }));
      }
    } catch (error) {
      console.error('Error parsing user data:', error);
      clearAuthStorage();
    }
  }
};

export const clearAuthStorage = () => {
  localStorage.removeItem('user');
  localStorage.removeItem('access_token');
  localStorage.removeItem('refresh_token');
};