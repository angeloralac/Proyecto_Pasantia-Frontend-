import { ref } from 'vue'
import apiClient from '../api/axios' 

export function useFetch(endpoint) {
  const data = ref(null)
  const error = ref(null)
  const isLoading = ref(false)

  const execute = async () => {
    isLoading.value = true
    error.value = null
    try {
     
      const response = await apiClient.get(endpoint)
      data.value = response.data
    } catch (err) {
      error.value = err.response?.data?.mensaje || err.message
    } finally {
      isLoading.value = false
    }
  }

  return { data, error, isLoading, execute }
}