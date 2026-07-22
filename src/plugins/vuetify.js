import 'vuetify/styles'
import '@mdi/font/css/materialdesignicons.css'
import { createVuetify } from 'vuetify'

export default createVuetify({
    ssr: true,
  theme: {
    defaultTheme: 'light', // Activamos el tema claro por defecto
    themes: {
      light: {
        colors: {
          // Acciones principales (por ejemplo, el botón "Ingresar" o "Cobrar")
          primary: '#1E88E5',    // Un azul limpio y profesional
          
          // Acciones secundarias (por ejemplo, botones de cancelar o limpiar)
          secondary: '#7E57C2',  // Un tono morado o el que prefieras
          
          // Detalles o elementos del negocio
          accent: '#8D6E63',     // Un color café/marrón sutil para el estilo del local

          // Estados del sistema
          error: '#e53535',      // El color rojo que usa tu v-alert
          success: '#4CAF50',    // Verde para ventas exitosas
          warning: '#FB8C00',    // Naranja para alertas del inventario
          
          // Fondos y superficies
          background: '#F5F5F5', // El fondo gris bajito que querías para la aplicación
          surface: '#FFFFFF',    // El color blanco de tus tarjetas de login/registro
        },
      },
    },
  },
})