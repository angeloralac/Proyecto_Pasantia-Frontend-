import apiClient from '@/api/axios'


export function useUserRepo () {

    const getAll = async()=> {

         return await apiClient.post('/users', payload)

    }
    
    const createuser = async(payload)=> {
            const response = await apiClient.post('/users', payload)
            return response.data

    }


    

    return {
        getAll,
        createuser
    }

}