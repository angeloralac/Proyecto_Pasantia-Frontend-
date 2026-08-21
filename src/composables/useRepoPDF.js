import { ref } from 'vue'
import apiClient from '../api/axios'

export function useRepoPDF() {
  const descargandoPDF = ref(false)

  const descargarReporteVentas = async (fechaInicio = null, fechaFin = null) => {
    descargandoPDF.value = true
    
    try {
      const params = {}
      if (fechaInicio && fechaFin) {
        params.fechaInicio = fechaInicio
        params.fechaFin = fechaFin
      }

      const response = await apiClient.get('/reportes/ventas/pdf', {
        params,
        responseType: 'blob' 
      })

      const url = window.URL.createObjectURL(new Blob([response.data]))
      const enlace = document.createElement('a')
      enlace.href = url
      
      const nombreArchivo = fechaInicio 
        ? `reporte-ventas-${fechaInicio}.pdf` 
        : `reporte-ventas-general.pdf`
        
      enlace.setAttribute('download', nombreArchivo)
      document.body.appendChild(enlace)
      enlace.click()
      enlace.remove()
      window.URL.revokeObjectURL(url)

    } catch (error) {
      console.error('Error al descargar el PDF:', error)
      alert('Error al generar el reporte en PDF')
    } finally {
      descargandoPDF.value = false
    }
  }

  return {
    descargandoPDF,
    descargarReporteVentas
  }
}