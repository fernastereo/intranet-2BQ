import { ref } from 'vue'

export const useCategoriaDocumentos = () => {
  const BASE_API_URL = import.meta.env.VITE_BASE_API_URL;

  const categoriasDocumentos = ref([]);
  const loading = ref(false);
  const apiError = ref('');

  const getCategoriaDocumentos = async () => {
    apiError.value = null;
    loading.value = true;

    try {
      const response = await fetch(`${BASE_API_URL}/categorias-documentos`, {
        headers: {
          'Content-Type': 'application/json',
        }
      });

      const data = await response.json();

      if (data.status === 'error') {
        apiError.value = data.message;
        return null;
      }

      categoriasDocumentos.value = data.data || data;
      return categoriasDocumentos.value;
    } catch (error) {
      apiError.value = error.message;
      return null;
    } finally {
      loading.value = false;
    }
  };

  const getSubCategoriasDocumentos = (categoriaId) => {
    if (!categoriaId || !categoriasDocumentos.value.length) return [];
    
    const categoria = categoriasDocumentos.value.find(
      cat => cat.id === categoriaId
    );

    return categoria?.subcategorias || [];
  }

  return {
    categoriasDocumentos,
    getCategoriaDocumentos,
    getSubCategoriasDocumentos,
    loading,
    apiError,
  }
}