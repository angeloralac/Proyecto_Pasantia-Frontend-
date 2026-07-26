import { ref } from 'vue'
import apiClient from '../api/axios'

export function useCrud(endpoint) {
  const items = ref([])
  const dialogVisible = ref(false)
  const modoEdicion = ref(false)
  const formulario = ref({})

  const obtenerItems = async () => {
    try {
      const response = await apiClient.get(endpoint)
      items.value = response.data
    } catch (error) {
      console.log(`Error al obtener datos de ${endpoint}:`, error)
    }
  }

  const abrirModalCrear = (itemVacio = {}) => {
    modoEdicion.value = false
    formulario.value = { ...itemVacio }
    dialogVisible.value = true
  }

  const abrirModalEditar = (item) => {
    modoEdicion.value = true
    formulario.value = { ...item }
    dialogVisible.value = true
  }

  const guardarItem = async () => {
    try {
      if (modoEdicion.value) {
        await apiClient.put(`${endpoint}/${formulario.value.id}`, formulario.value)
      } else {
        await apiClient.post(endpoint, formulario.value)
      }
      dialogVisible.value = false
      await obtenerItems()
    } catch (error) {
      console.log("Error al guardar:", error)
    }
  }

  const eliminarItem = async (id) => {
    if (confirm("¿Estás seguro de eliminar este registro?")) {
      try {
        await apiClient.delete(`${endpoint}/${id}`)
        await obtenerItems()
      } catch (error) {
        console.log("Error al eliminar:", error)
      }
    }
  }

  return {
    items,
    dialogVisible,
    modoEdicion,
    formulario,
    obtenerItems,
    abrirModalCrear,
    abrirModalEditar,
    guardarItem,
    eliminarItem
  }
}