import { ref } from 'vue'
import { useAuth } from './useAuth';

export function useObjetosLicencia() {
  const BASE_API_URL = import.meta.env.VITE_BASE_API_URL;
  const { token } = useAuth();

  const objetosLicencia = ref([]);
  const loading = ref(false);
  const apiError = ref('');

  const getObjetosLicencia = async () => {
    apiError.value = null;
    loading.value = true;

    try {
      const response = await fetch(`${BASE_API_URL}/objetos-licencia`, {
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

      objetosLicencia.value = data.data || data;
      return objetosLicencia.value;
    } catch (error) {
      apiError.value = error.message;
      return null;
    } finally {
      loading.value = false;
    }
  };

  return {
    objetosLicencia,
    loading,
    apiError,
    getObjetosLicencia
  }
} 