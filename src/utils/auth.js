export const setAuthToken = (token) => {
  document.cookie = `accessToken=${token}; path=/; max-age=${60 * 60 * 24}`;
};

export const setRefreshToken = (token) => {
  document.cookie = `refreshToken=${token}; path=/; max-age=${60 * 60 * 24 * 7}`;
};

export const setUser = (user) => {
  localStorage.setItem('user', JSON.stringify(user));
};

export const getAuthToken = () => {
  return document.cookie.split('; ').find(row => row.startsWith('accessToken='))?.split('=')[1];
};

export const getRefreshToken = () => {
  return document.cookie.split('; ').find(row => row.startsWith('refreshToken='))?.split('=')[1];
};

export const getUser = () => {
  const user = localStorage.getItem('user');
  return user ? JSON.parse(user) : null;
};

export const isAuthenticated = () => {
  return !!getAuthToken();
};

export const clearAuth = () => {
  document.cookie = 'accessToken=; path=/; max-age=0';
  document.cookie = 'refreshToken=; path=/; max-age=0';
  localStorage.removeItem('user');
};
