import { ref } from 'vue'
import { useRouter } from 'vue-router'
import apiClient from '../api/axios' 
import { useUserRepo } from './useUserRepo'

export function useUser() {
  const router = useRouter()
  const data = ref(null)
  const errorResponse = ref(null) 
  const isLoading = ref(false)
const { getAll: getAllRepo, createuser: createUserRepo } = useUserRepo();
  const payload = ref({
  email: '',
  contrasena: ''
})

  const createUser = async (payload) => {
    try {
        isLoading.value = true
        errorResponse.value = null 
  
        data.value = await createUserRepo(payload)
        
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

  const handleLogin = async () => {
  await loginUser(payload.value)
  if (!errorResponse.value) {
  alert('¡Bienvenido al sistema!')
  router.push('/dashboard') 
    }
    }
  return { 
    data, 
    errorResponse, 
    isLoading, 
    createUser, 
    loginUser ,
    handleLogin, payload
  }
}