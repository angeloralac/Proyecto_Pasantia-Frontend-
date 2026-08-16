<script setup>
import { ref, computed, onMounted } from 'vue';
import { useCaja } from '../composables/useCaja';

const { historialCajas, cargando, obtenerHistorial } = useCaja();
const busqueda = ref('');

onMounted(async () => {
  await obtenerHistorial();
});

// Computed para filtrar el historial por ID o por Nombre de Usuario
const historialFiltrado = computed(() => {
  if (!busqueda.value) return historialCajas.value;
  
  const query = busqueda.value.toLowerCase();
  return historialCajas.value.filter(caja => {
    const idCoincide = caja.id.toString().includes(query);
    // Si tu API incluye la relación del usuario, buscamos por su nombre
    const usuarioCoincide = caja.user?.nombre?.toLowerCase().includes(query) || false;
    
    return idCoincide || usuarioCoincide;
  });
});

const formatearMoneda = (cantidad) => {
  return new Intl.NumberFormat('es-GT', { style: 'currency', currency: 'GTQ' }).format(cantidad || 0);
};
</script>

<template>
  <v-container fluid class="bg-background pa-6 h-100">
    
    <!-- Encabezado -->
    <div class="mb-6 d-flex justify-space-between align-center flex-wrap gap-4">
      <div>
        <h2 class="text-h5 font-weight-bold">Historial de Turnos y Cortes de Caja</h2>
        <p class="text-medium-emphasis">Consulta todos los cierres anteriores y filtra por ID de turno o cajero</p>
      </div>
      <v-btn color="primary" variant="tonal" prepend-icon="mdi-refresh" @click="obtenerHistorial" :loading="cargando">
        Actualizar
      </v-btn>
    </div>

    <!-- Barra de Filtro / Búsqueda -->
    <v-card elevation="0" class="border rounded-lg pa-4 mb-6 bg-surface">
      <v-text-field
        v-model="busqueda"
        label="Buscar por ID de turno o nombre de usuario..."
        prepend-inner-icon="mdi-magnify"
        variant="outlined"
        density="comfortable"
        clearable
        hide-details
      ></v-text-field>
    </v-card>

    <!-- Tabla de Historial -->
    <v-card elevation="0" class="border rounded-lg">
      <v-table hover>
        <thead class="bg-grey-lighten-4">
          <tr>
            <th class="font-weight-bold">ID Turno</th>
            <th class="font-weight-bold">Cajero / Usuario</th>
            <th class="font-weight-bold">Estado</th>
            <th class="font-weight-bold">Fondo Inicial</th>
            <th class="font-weight-bold">Esperado</th>
            <th class="font-weight-bold">Efectivo Real</th>
            <th class="font-weight-bold">Diferencia</th>
            <th class="font-weight-bold">Apertura / Cierre</th>
          </tr>
        </thead>
        <tbody>
          <tr v-if="cargando">
            <td colspan="8" class="text-center text-medium-emphasis py-6">Cargando historial...</td>
          </tr>
          <tr v-else-if="historialFiltrado.length === 0">
            <td colspan="8" class="text-center text-medium-emphasis py-6 font-italic">No se encontraron registros de caja con ese criterio.</td>
          </tr>
          <tr v-for="caja in historialFiltrado" :key="caja.id">
            <td class="font-weight-bold">#{{ caja.id }}</td>
            <td>
              <div class="d-flex align-center">
                <v-avatar color="primary-lighten-4" size="28" class="mr-2 text-primary font-weight-bold">
                  {{ caja.user?.nombre ? caja.user.nombre.charAt(0).toUpperCase() : 'U' }}
                </v-avatar>
                <span>{{ caja.user?.nombre || 'Usuario #' + caja.usuarioId }}</span>
              </div>
            </td>
            <td>
              <v-chip size="small" :color="caja.estado === 'abierta' ? 'success' : 'grey'" variant="flat">
                {{ caja.estado.toUpperCase() }}
              </v-chip>
            </td>
            <td>{{ formatearMoneda(caja.monto_inicial) }}</td>
            <td>{{ caja.monto_esperado ? formatearMoneda(caja.monto_esperado) : 'En curso' }}</td>
            <td>{{ caja.monto_real ? formatearMoneda(caja.monto_real) : 'Pendiente' }}</td>
            <td :class="caja.diferencia < 0 ? 'text-error font-weight-bold' : caja.diferencia > 0 ? 'text-warning font-weight-bold' : 'text-success font-weight-bold'">
              {{ caja.diferencia !== null ? formatearMoneda(caja.diferencia) : '-' }}
            </td>
            <td class="text-caption text-medium-emphasis">
              {{ new Date(caja.fecha_apertura).toLocaleString() }} 
            </td>
          </tr>
        </tbody>
      </v-table>
    </v-card>

  </v-container>
</template>

<style scoped>
.border {
  border: 1px solid #e5e7eb !important;
}
</style>