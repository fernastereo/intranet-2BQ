import { ref } from 'vue';
import { useAuth } from './useAuth';

export const useTiposDocumento = () => {
  const BASE_API_URL = import.meta.env.VITE_BASE_API_URL;
  const { token } = useAuth();

  const tiposDocumento = ref([]);
  const loading = ref(false);
  const apiError = ref('');

  const getTiposDocumento = async () => {
    apiError.value = null;
    loading.value = true;

    try {
      const response = await fetch(`${BASE_API_URL}/tipos-documento`, {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token.value}`,
        },
      });

      const data = await response.json();

      if (data.status === 'error') {
        apiError.value = data.message;
        return null;
      }

      tiposDocumento.value = data.data || data;
      return tiposDocumento.value;
    } catch (error) {
      apiError.value = error.message;
      return null;
    } finally {
      loading.value = false;
    }
  };

  return {
    tiposDocumento,
    loading,
    apiError,
    getTiposDocumento,
  };
};
