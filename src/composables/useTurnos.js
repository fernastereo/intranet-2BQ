import { ref } from 'vue';

const token = ref(localStorage.getItem('token') || null);
export const useTurnos = () => {
  const BASE_API_URL = import.meta.env.VITE_BASE_API_URL;

  const turnos = ref({
    expedientes: [],
    pagination: {
      current_page: 1,
      total_pages: 1,
      total_items: 0,
      item_init: 0,
      item_end: 0,
    },
  });
  const apiError = ref('');

  const getTurnos = async (page = 1, limit = 10) => {
    apiError.value = null;

    try {
      const response = await fetch(
        `${BASE_API_URL}/expedientes?page=${page}&limit=${limit}`,
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token.value}`,
          },
        }
      );

      const data = await response.json();

      if (data.status === 'error') {
        apiError.value = data.message;
        return null;
      }

      const { expedientes, pagination } = data;

      turnos.value = {
        expedientes,
        pagination,
      };

      return turnos.value;
    } catch (error) {
      apiError.value = error.message;
      return null;
    }
  };

  return {
    getTurnos,
    turnos,
    apiError,
  };
};
