// Auth helper functions
export const getToken = () => {
  return localStorage.getItem('token');
};

export const setToken = (token) => {
  if (token) {
    localStorage.setItem('token', token);
  } else {
    localStorage.removeItem('token');
  }
};

export const removeToken = () => {
  localStorage.removeItem('token');
};

export const isAuthenticated = () => {
  return !!getToken();
};

// User management
export const getUser = () => {
  const user = localStorage.getItem('user');
  return user ? JSON.parse(user) : null;
};

export const setUser = (user) => {
  if (user) {
    localStorage.setItem('user', JSON.stringify(user));
  } else {
    localStorage.removeItem('user');
  }
};

export const isAdmin = () => {
  const user = getUser();
  return user && user.isAdmin;
};

export const getCartFromStorage = () => {
  const cart = localStorage.getItem('cart');
  return cart ? JSON.parse(cart) : [];
};

export const setCartToStorage = (cart) => {
  localStorage.setItem('cart', JSON.stringify(cart));
};

export const clearCart = () => {
  localStorage.removeItem('cart');
};

// Logout
export const logout = () => {
  removeToken();
  setUser(null);
  clearCart();
};
