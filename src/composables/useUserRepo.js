import apiClient from '@/api/axios'


export function useUserRepo () {

    const getAll = async()=> {

         return await apiClient.post('/users', payload)

    }
    
    const createuser = async(payload)=> {

         return await apiClient.post('/users', payload).data

    }


    

    return {
        getAll,
        createuser
    }

}