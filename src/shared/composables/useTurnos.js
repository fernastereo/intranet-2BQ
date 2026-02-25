import { ref } from 'vue';
import { useAuth } from './useAuth';

export const useTurnos = () => {
  const BASE_API_URL = import.meta.env.VITE_BASE_API_URL;
  const { token } = useAuth();

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
  const loading = ref(false);

  const getTurnos = async (page = 1, limit = 10, search = '') => {
    apiError.value = null;
    loading.value = true;

    try {
      const url = new URL(`${BASE_API_URL}/expedientes`);
      url.searchParams.append('page', page);
      url.searchParams.append('limit', limit);
      if (search) {
        url.searchParams.append('search', search);
      }

      const response = await fetch(url, {
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

      const { expedientes, pagination } = data;

      turnos.value = {
        expedientes,
        pagination,
      };

      return turnos.value;
    } catch (error) {
      apiError.value = error.message;
      return null;
    } finally {
      loading.value = false;
    }
  };

  const createTurno = async (turnoData) => {
    apiError.value = null;
    loading.value = true;

    try {
      const { user } = useAuth();

      const dataToSend = {
        ...turnoData,
        user_id: user.value?.id || 1,
      };

      console.log('Enviando datos al API:', dataToSend);

      const response = await fetch(`${BASE_API_URL}/expedientes`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token.value}`,
        },
        body: JSON.stringify(dataToSend),
      });

      const data = await response.json();
      console.log('Respuesta del API:', data);

      // Verificar si la respuesta HTTP fue exitosa
      if (!response.ok) {
        apiError.value = data.message || `Error HTTP: ${response.status}`;
        return null;
      }

      // Verificar si hay un campo de error explícito
      if (data.status === 'error') {
        apiError.value = data.message;
        return null;
      }

      // Verificar si la operación fue exitosa
      if (data.status === 'success') {
        return data; // Retornar toda la respuesta que incluye expediente_id, message, etc.
      }

      // Si no hay status o es diferente, asumir éxito si response.ok es true
      return data;
    } catch (error) {
      console.error('Error en createTurno:', error);
      apiError.value = error.message;
      return null;
    } finally {
      loading.value = false;
    }
  };

  const getTurnoById = async (id) => {
    apiError.value = null;
    loading.value = true;

    try {
      const response = await fetch(`${BASE_API_URL}/expedientes/${id}`, {
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

      return data;
    } catch (error) {
      apiError.value = error.message;
      return null;
    } finally {
      loading.value = false;
    }
  };

  const updateTurno = async (id, turnoData) => {
    apiError.value = null;
    loading.value = true;

    try {
      const { user } = useAuth();

      const dataToSend = {
        ...turnoData,
        user_id: user.value?.id || 1,
      };

      const response = await fetch(`${BASE_API_URL}/expedientes/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token.value}`,
        },
        body: JSON.stringify(dataToSend),
      });

      const data = await response.json();

      if (!response.ok) {
        apiError.value = data.message || `Error HTTP: ${response.status}`;
        return null;
      }

      if (data.status === 'error') {
        apiError.value = data.message;
        return null;
      }

      return data;
    } catch (error) {
      console.error('Error en updateTurno:', error);
      apiError.value = error.message;
      return null;
    } finally {
      loading.value = false;
    }
  };

  const updateTurnoFormulario = async (id, turnoData) => {
    apiError.value = null;
    loading.value = true;

    try {
      const response = await fetch(
        `${BASE_API_URL}/expediente-formulario/${id}`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token.value}`,
          },
          body: JSON.stringify(turnoData),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        apiError.value = data.message || `Error HTTP: ${response.status}`;
        return null;
      }

      if (data.status === 'error') {
        apiError.value = data.message;
        return null;
      }

      return data;
    } catch (error) {
      console.error('Error en updateTurnoFormulario:', error);
      apiError.value = error.message;
      return null;
    } finally {
      loading.value = false;
    }
  };

  return {
    getTurnos,
    createTurno,
    getTurnoById,
    updateTurno,
    updateTurnoFormulario,
    turnos,
    apiError,
    loading,
  };
};
