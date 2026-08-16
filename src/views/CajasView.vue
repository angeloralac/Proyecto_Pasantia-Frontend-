<script setup>
import { ref, onMounted } from 'vue';
import { useCaja } from '../composables/useCaja';

const {
  cajaActiva,
  estaAbierta,
  historialCajas,
  cargando,
  verificarCajaAbierta,
  abrirCaja,
  cerrarCaja,
  obtenerHistorial
} = useCaja();

// Estados locales para los formularios y modales
const montoInicialInput = ref(0);
const montoRealInput = ref(0);
const dialogCierre = ref(false);
const mensajeFeedback = ref({ texto: '', tipo: '' });

// ID de usuario temporal por defecto (puedes cambiarlo si ya manejas sesiones en el frontend)
const usuarioIdTemporal = ref(1); 

onMounted(async () => {
  await verificarCajaAbierta();
  await obtenerHistorial();
});

const handleAbrirCaja = async () => {
  const resultado = await abrirCaja(montoInicialInput.value, usuarioIdTemporal.value);
  if (resultado.success) {
    mostrarMensaje(resultado.message, 'success');
    montoInicialInput.value = 0;
  } else {
    mostrarMensaje(resultado.message, 'error');
  }
};

const handleCerrarCaja = async () => {
  if (!cajaActiva.value) return;
  
  const resultado = await cerrarCaja(cajaActiva.value.id, montoRealInput.value);
  if (resultado.success) {
    dialogCierre.value = false;
    mostrarMensaje(`Corte exitoso. Diferencia: ${resultado.corte.diferencia}`, 'success');
    montoRealInput.value = 0;
    await obtenerHistorial();
  } else {
    mostrarMensaje(resultado.message, 'error');
  }
};

const mostrarMensaje = (texto, tipo) => {
  mensajeFeedback.value = { texto, tipo };
  setTimeout(() => {
    mensajeFeedback.value = { texto: '', tipo: '' };
  }, 4000);
};

const formatearMoneda = (cantidad) => {
  return new Intl.NumberFormat('es-GT', { style: 'currency', currency: 'GTQ' }).format(cantidad || 0);
};
</script>

<template>
  <v-container fluid class="bg-background pa-6 h-100">
    
    <div class="mb-6">
      <h2 class="text-h5 font-weight-bold">Control de Caja y Turnos</h2>
      <p class="text-medium-emphasis">Gestiona la apertura, operaciones y cortes de caja diarios</p>
    </div>

    <!-- Alertas de Feedback -->
    <v-alert
      v-if="mensajeFeedback.texto"
      :type="mensajeFeedback.tipo"
      class="mb-4"
      variant="tonal"
    >
      {{ mensajeFeedback.texto }}
    </v-alert>

    <!-- SECCIÓN 1: SI LA CAJA ESTÁ CERRADA (Mostrar Formulario de Apertura) -->
    <v-row v-if="!estaAbierta && !cargando" justify="center" class="my-6">
      <v-col cols="12" md="6">
        <v-card elevation="0" class="border rounded-lg pa-6 text-center">
          <v-avatar color="warning-lighten-4" size="64" class="mb-4">
            <v-icon color="warning" size="36">mdi-cash-lock</v-icon>
          </v-avatar>
          <h3 class="text-h6 font-weight-bold mb-2">No hay ninguna caja abierta</h3>
          <p class="text-medium-emphasis mb-6">Para comenzar a registrar ventas en el sistema, debes ingresar el fondo inicial (sencillo) con el que abres turno.</p>
          
          <v-text-field
            v-model.number="montoInicialInput"
            label="Fondo Inicial (Q.)"
            type="number"
            variant="outlined"
            density="comfortable"
            class="mb-4"
            prefix="Q."
          ></v-text-field>

          <v-btn color="primary" block size="large" @click="handleAbrirCaja">
            Abrir Caja Ahora
          </v-btn>
        </v-card>
      </v-col>
    </v-row>

    <!-- SECCIÓN 2: SI LA CAJA ESTÁ ABIERTA (Mostrar Estado Actual y Botón de Cierre) -->
    <v-row v-if="estaAbierta && !cargando" class="mb-6">
      <v-col cols="12">
        <v-card elevation="0" class="border rounded-lg pa-6 bg-surface" style="border-left: 5px solid #4CAF50 !important;">
          <div class="d-flex flex-wrap justify-space-between align-center gap-4">
            <div>
              <div class="d-flex align-center mb-1">
                <v-chip color="success" size="small" variant="flat" class="font-weight-bold mr-2">CAJA ABIERTA</v-chip>
                <span class="text-subtitle-2 text-medium-emphasis">Turno en curso</span>
              </div>
              <h3 class="text-h4 font-weight-bold text-success mb-2">Fondo Inicial: {{ formatearMoneda(cajaActiva?.monto_inicial) }}</h3>
              <p class="text-caption text-medium-emphasis mb-0">Abierta el: {{ new Date(cajaActiva?.fecha_apertura).toLocaleString() }}</p>
            </div>

            <div>
              <v-btn color="error" size="large" prepend-icon="mdi-cash-check" @click="dialogCierre = true">
                Realizar Corte / Cerrar Caja
              </v-btn>
            </div>
          </div>
        </v-card>
      </v-col>
    </v-row>

    <!-- SECCIÓN 3: HISTORIAL DE CORTES ANTERIORES -->
    <v-card elevation="0" class="border mt-6">
      <v-card-title class="px-4 py-3 font-weight-bold">
        <v-icon color="primary" class="mr-2">mdi-history</v-icon> Historial de Cortes de Caja
      </v-card-title>
      <v-divider></v-divider>
      
      <v-table hover>
        <thead class="bg-grey-lighten-4">
          <tr>
            <th class="font-weight-bold">ID Turno</th>
            <th class="font-weight-bold">Estado</th>
            <th class="font-weight-bold">Fondo Inicial</th>
            <th class="font-weight-bold">Esperado en Sistema</th>
            <th class="font-weight-bold">Efectivo Real</th>
            <th class="font-weight-bold">Diferencia</th>
            <th class="font-weight-bold">Apertura / Cierre</th>
          </tr>
        </thead>
        <tbody>
          <tr v-if="historialCajas.length === 0">
            <td colspan="7" class="text-center text-medium-emphasis py-6 font-italic">No hay registros de cajas anteriores.</td>
          </tr>
          <tr v-for="caja in historialCajas" :key="caja.id">
            <td class="font-weight-bold">#{{ caja.id }}</td>
            <td>
              <v-chip size="small" :color="caja.estado === 'abierta' ? 'success' : 'grey'" variant="flat">
                {{ caja.estado.toUpperCase() }}
              </v-chip>
            </td>
            <td>{{ formatearMoneda(caja.monto_inicial) }}</td>
            <td>{{ caja.monto_esperado ? formatearMoneda(caja.monto_esperado) : 'En curso' }}</td>
            <td>{{ caja.monto_real ? formatearMoneda(caja.monto_real) : 'Pendiente' }}</td>
            <td :class="caja.diferencia < 0 ? 'text-error font-weight-bold' : 'text-success font-weight-bold'">
              {{ caja.diferencia !== null ? formatearMoneda(caja.diferencia) : '-' }}
            </td>
            <td class="text-caption text-medium-emphasis">
              {{ new Date(caja.fecha_apertura).toLocaleDateString() }} 
              <span v-if="caja.fecha_cierre">- {{ new Date(caja.fecha_cierre).toLocaleTimeString() }}</span>
            </td>
          </tr>
        </tbody>
      </v-table>
    </v-card>

    <!-- MODAL DE CIERRE DE CAJA -->
    <v-dialog v-model="dialogCierre" max-width="450px">
      <v-card class="pa-4">
        <v-card-title class="text-h6 font-weight-bold mb-2">Corte de Caja</v-card-title>
        <v-card-text>
          <p class="text-medium-emphasis mb-4">Cuenta todo el dinero físico (billetes y monedas) que hay en la gaveta e ingrésalo a continuación para calcular el cuadre final.</p>
          
          <v-text-field
            v-model.number="montoRealInput"
            label="Efectivo Real Contado (Q.)"
            type="number"
            variant="outlined"
            prefix="Q."
            autofocus
          ></v-text-field>
        </v-card-text>
        <v-card-actions class="justify-end">
          <v-btn variant="text" @click="dialogCierre = false">Cancelar</v-btn>
          <v-btn color="error" variant="flat" @click="handleCerrarCaja">Confirmar Cierre</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

  </v-container>
</template>

<style scoped>
.border {
  border: 1px solid #e5e7eb !important;
}
</style>