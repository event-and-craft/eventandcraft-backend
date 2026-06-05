import { AuthProvider } from 'react-admin';

export const authProvider: AuthProvider = {
  login: async ({ email, password }) => {
    console.log("---", email, password)
    const response = await fetch('/api/auth/admin-login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
      headers: new Headers({ 'Content-Type': 'application/json' }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || 'Authentication failed');
    }

    const data = await response.json();
    localStorage.setItem('admin_token', data.accessToken);
    localStorage.setItem('admin_user', JSON.stringify(data.user));
    return Promise.resolve();
  },

  logout: () => {
    localStorage.removeItem('admin_token');
    localStorage.removeItem('admin_user');
    return Promise.resolve();
  },

  checkError: (error) => {
    const status = error.status;
    if (status === 401 || status === 403) {
      localStorage.removeItem('admin_token');
      localStorage.removeItem('admin_user');
      return Promise.reject();
    }
    return Promise.resolve();
  },

  checkAuth: () => {
    return localStorage.getItem('admin_token') ? Promise.resolve() : Promise.reject();
  },

  getPermissions: () => {
    const userStr = localStorage.getItem('admin_user');
    if (!userStr) return Promise.resolve([]);
    try {
      const user = JSON.parse(userStr);
      if (user.email && user.email.endsWith('@eventcraft.com')) {
        return Promise.resolve(['admin']);
      }
    } catch { }
    return Promise.resolve([]);
  },

  getIdentity: () => {
    const userStr = localStorage.getItem('admin_user');
    if (!userStr) return Promise.reject();
    try {
      const user = JSON.parse(userStr);
      return Promise.resolve({
        id: user.id,
        fullName: `${user.firstName || 'System'} ${user.lastName || 'Admin'}`.trim(),
        avatar: undefined,
      });
    } catch {
      return Promise.reject();
    }
  },
};
