import { ref, computed, readonly } from 'vue'
import { useRouter } from 'vue-router'

const token = ref(localStorage.getItem('token') || null)
const user = ref(JSON.parse(localStorage.getItem('user')) || null)
const authError = ref('')

export const useAuth = () => {
  const router = useRouter()

  const isAuthenticated = computed(() => !!token.value)

  const setToken = (newToken) => {
    token.value = newToken
    localStorage.setItem('token', newToken)
  }

  const setUser = (newUser) => {
    user.value = newUser
    localStorage.setItem('user', JSON.stringify(newUser))
  }

  const getUser = async () => {
    const BASE_API_URL = import.meta.env.VITE_BASE_API_URL;
    authError.value = null;

    try {
      const response = await fetch(`${BASE_API_URL}/user`, {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token.value}`,
        },
      });

      const data = await response.json();

      if (data.status === 'error') {
        authError.value = data.message;
        return null;
      }

      return data.data;
    } catch (e) {
      authError.value = e.message;
      return null;
    }
  };

  const logout = async () => {
    const BASE_API_URL = import.meta.env.VITE_BASE_API_URL;
    authError.value = null;

    try {
      const response = await fetch(`${BASE_API_URL}/logout`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token.value}`,
        },
      });

      const data = await response.json();

      if (data.status === 'error') {
        authError.value = data.message;
        return false;
      }

      setToken(null);
      setUser(null);
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      return true;
    } catch (e) {
      authError.value = e.message;
      return false;
    }
  };

  const login = async (credentials) => {
    const BASE_API_URL = import.meta.env.VITE_BASE_API_URL;
    const { username, password } = credentials;

    authError.value = null;

    try {
      const response = await fetch(`${BASE_API_URL}/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }),
      });

      const data = await response.json();

      if (data.status === 'error') {
        authError.value = data.message;
        return false;
      }

      setToken(data.token);
      setUser(data.user);
      return true;
    } catch (e) {
      authError.value = e.message;
      return false;
    }
  };

  const checkAuth = async () => {
    const BASE_API_URL = import.meta.env.VITE_BASE_API_URL;
    if (!token.value) return false;

    try {
      const response = await fetch(`${BASE_API_URL}/verify-token`, {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${token.value}`,
        },
      });

      const data = await response.json();

      if (data.status === 'error') {
        // Solo limpiar el estado local, no hacer llamadas adicionales
        setToken(null);
        setUser(null);
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        return false;
      }

      return true;
    } catch (e) {
      // En caso de error de red, solo limpiar el estado local
      // NO llamar a logout() para evitar loops infinitos
      setToken(null);
      setUser(null);
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      authError.value = e.message;
      return false;
    }
  };

  return {
    user: readonly(user),
    token: readonly(token),
    authError,
    isAuthenticated,
    login,
    logout,
    checkAuth,
    setToken,
    setUser,
    getUser,
  };
}

