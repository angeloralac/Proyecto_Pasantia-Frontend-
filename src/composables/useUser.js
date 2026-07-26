import { ref } from 'vue'
import apiClient from '../api/axios' 

export function useUser() {
  const data = ref(null)
  const errorResponse = ref(null) 
  const isLoading = ref(false)

  const createUser = async (payload) => {
    try {
        isLoading.value = true
        errorResponse.value = null 
        
        const response = await apiClient.post('/users', payload)
        data.value = response.data
        
        localStorage.setItem('token', data.value.token)
        localStorage.setItem('user', JSON.stringify(data.value.user))

    } catch (error) {
        console.log(error)
        errorResponse.value = error.response?.data?.mensaje || 'Error al registrar'
    } finally {
        isLoading.value = false
    }
  }

  const loginUser = async (payload) => {
    try {
        isLoading.value = true
        errorResponse.value = null
        
        const response = await apiClient.post('users/login', payload)
        data.value = response.data
        
        localStorage.setItem('token', data.value.token)
        localStorage.setItem('userId', response.data.user.id)
       localStorage.setItem('user', JSON.stringify(data.value.user))
      
    } catch (error) { 
        console.log(error)
        errorResponse.value = error.response?.data?.mensaje || 'Error al iniciar sesión'
    } finally { 
        isLoading.value = false
    }
  }
   
  return { 
    data, 
    errorResponse, 
    isLoading, 
    createUser, 
    loginUser 
  }
}