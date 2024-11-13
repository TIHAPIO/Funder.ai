import Cookies from 'js-cookie';

export const setAuthToken = (token: string) => {
  Cookies.set('firebaseToken', token, {
    expires: 7, // 7 days
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax'
  });
};

export const removeAuthToken = () => {
  Cookies.remove('firebaseToken');
};

export const getAuthToken = () => {
  return Cookies.get('firebaseToken');
};

export const isAuthenticated = () => {
  return !!getAuthToken();
};

export const getAuthHeaders = () => {
  const token = getAuthToken();
  return token ? {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json',
  } : {
    'Content-Type': 'application/json',
  };
};
