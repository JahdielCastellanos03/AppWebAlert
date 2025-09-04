<template>
  <q-page class="q-pa-md">
    <!--v-model hace un enlace bidireccional-->
    <q-select
      v-model="sensorGraficado"
      :options="sensoresDisponibles"
      label="Selecciona sensor para graficar"
      dense
      class="q-mb-md"
    />

    <!--v-if es una condicional si sensor es mayor a nulo muestra y grafica-->
    <GraficaLecturas v-if="sensorGraficado" :lecturas="lecturas" :sensor="sensorGraficado" />

    <!-- Botón  para   escalas-->
    <q-btn
      color="primary"
      label="Agregar Escala de valores"
      class="q-mb-lg"
      flat
      @click="abrirDialogoEscala"
    />
    <q-dialog v-model="dialogoEscalaVisible" persistent>
      <q-card style="min-width: 400px; max-width: 90vw">
        <q-card-section>
          <div class="text-h6">Agregar nueva Escala de valores</div>
        </q-card-section>

        <q-card-section class="q-pt-none">
          <q-input v-model="nombreEscala" label="Nombre de la escala" dense />
          <q-input
            v-model="descripcionEscala"
            label="Descripción"
            type="textarea"
            dense
            class="q-mt-sm"
          />
          <q-select
            v-model="sensorParaEscala"
            :options="sensoresDisponibles"
            label="Selecciona un sensor"
            dense
            class="q-mt-sm"
          />
        </q-card-section>

        <q-card-actions align="right">
          <q-btn flat label="Cancelar" color="negative" @click="dialogoEscalaVisible = false" />
          <q-btn flat label="Guardar" color="positive" @click="guardarEscala" />
        </q-card-actions>
      </q-card>
    </q-dialog>

    <!-- Botón  para Rangos -->
    <q-btn color="primary" label="Agregar rango" class="q-mb-lg" flat @click="agregarRango" />

    <q-dialog v-model="dialogoAgregarVisible" persistent>
      <q-card style="min-width: 400px; max-width: 90vw">
        <q-card-section>
          <div class="text-h6">Agregar nuevo rango</div>
        </q-card-section>

        <q-card-section class="q-pt-none">
          <q-select
            v-model="escalaSeleccionada"
            :options="escalasDisponibles"
            option-label="label"
            option-value="value"
            emit-value
            map-options
            label="Selecciona una escala"
            dense
          />

          <q-input v-model="nombreRango" label="Nombre del rango" dense />
          <q-input
            v-model="descripcionRango"
            label="Descripción"
            type="textarea"
            dense
            class="q-mt-sm"
          />
          <div class="row q-col-gutter-md q-mt-sm">
            <q-color
              v-model="colorRango"
              format="hex"
              default-view="palette"
              style="max-width: 250px"
              class="q-mt-sm"
            />
            <div class="col">
              <q-input v-model.number="primerValor" label="Primer valor" type="number" dense />
            </div>

            <div class="col">
              <q-input v-model.number="segundoValor" label="Segundo valor" type="number" dense />
            </div>
          </div>
        </q-card-section>

        <q-card-actions align="right">
          <q-btn flat label="Cancelar" color="negative" @click="dialogoAgregarVisible = false" />
          <q-btn flat label="Guardar" color="positive" @click="guardarRango" />
        </q-card-actions>
      </q-card>
    </q-dialog>

    <!-- Lista de rangos existentes -->
    <q-card class="q-mt-lg">
      <q-card-section>
        <div class="text-h6">Lista de Rangos Existentes</div>
      </q-card-section>

      <q-table
        :rows="rangos"
        :columns="columnasRangos"
        row-key="id"
        flat
        bordered
        dense
        class="q-mb-md"
        :pagination="{ rowsPerPage: 0 }"
      >
        <template #body-cell-acciones="props">
          <q-td align="center">
            <q-btn
              flat
              icon="edit"
              color="primary"
              size="sm"
              @click="abrirEdicionRango(props.row)"
            />
            <q-btn
              flat
              icon="delete"
              color="negative"
              size="sm"
              @click="confirmarEliminarRango(props.row.id)"
            />
          </q-td>
        </template>
      </q-table>
    </q-card>
  </q-page>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import GraficaLecturas from '../components/GraficaLecturas.vue';

//import { watch } from 'vue';

interface Lectura {
  fecha: string;
  [claveSensor: string]: string;
}

const lecturas = ref<Lectura[]>([]);
const sensoresDisponibles = ref<string[]>([]);
const sensorGraficado = ref<string | null>(null);
const colorRango = ref('#FF0001');

const dialogoAgregarVisible = ref(false);
const nombreRango = ref('');
const descripcionRango = ref('');
const primerValor = ref<number | null>(null);
const segundoValor = ref<number | null>(null);
const modoEdicion = ref(false);
const idRangoEditando = ref<number | null>(null);

const dialogoEscalaVisible = ref(false);
const nombreEscala = ref('');
const descripcionEscala = ref('');
const sensorParaEscala = ref<string | null>(null);

const escalasDisponibles = ref<{ label: string; value: number }[]>([]);
const escalaSeleccionada = ref<number | null>(null);
/*
watch(escalaSeleccionada, () => {
  console.log(escalaSeleccionada.value);
});
*/
interface Rango {
  id: number;
  nombre: string;
  valor_minimo: number;
  valor_maximo: number;
  color: string;
  escala: number;
}

interface EscalaDeValor {
  id: number;
  nombre: string;
  descripcion: string;
  sensor: string;
}

const rangos = ref<Rango[]>([]);
const columnasRangos = [
  { name: 'nombre', label: 'Nombre', field: 'nombre', align: 'left' as const },
  { name: 'valor_minimo', label: 'Valor Mínimo', field: 'valor_minimo', align: 'center' as const },
  { name: 'valor_maximo', label: 'Valor Máximo', field: 'valor_maximo', align: 'center' as const },
  { name: 'color', label: 'Color', field: 'color', align: 'center' as const },
  {
    name: 'acciones',
    label: 'Acciones',
    align: 'center' as const,
    field: (row: Rango) => row.id,
  },
];

onMounted(async () => {
  try {
    const res = await fetch('http://127.0.0.1:8000/api/lecturas/5');
    if (!res.ok) throw new Error('Error al cargar datos');
    const data = await res.json();
    lecturas.value = data;

    const sensoresSet = new Set<string>();
    data.forEach((lectura: Lectura) => {
      Object.keys(lectura).forEach((clave) => {
        if (clave !== 'fecha') sensoresSet.add(clave);
      });
    });
    sensoresDisponibles.value = Array.from(sensoresSet);

    await cargarRangos();
    await cargarEscalas();
  } catch (err) {
    console.error('Error al obtener lectura:', err);
  }
});

async function cargarRangos() {
  try {
    const res = await fetch('http://127.0.0.1:8000/dashboard/api/rangos/');
    if (!res.ok) throw new Error('Error al cargar rangos');
    const data = await res.json();
    rangos.value = data;
  } catch (err) {
    console.error('Error al cargar rangos:', err);
  }
}

async function cargarEscalas() {
  try {
    const res = await fetch('http://127.0.0.1:8000/dashboard/api/escala-de-valores/');
    if (!res.ok) throw new Error('Error al cargar escalas');
    const data = await res.json();
    escalasDisponibles.value = data.map((escala: EscalaDeValor) => ({
      label: escala.nombre,
      value: escala.id,
    }));
  } catch (err) {
    console.error('Error al cargar escalas:', err);
  }
}

function agregarRango() {
  dialogoAgregarVisible.value = true;
}

function abrirDialogoEscala() {
  dialogoEscalaVisible.value = true;
}

async function guardarEscala() {
  if (!nombreEscala.value || !sensorParaEscala.value) {
    alert('Por favor completa el nombre y selecciona un sensor');
    return;
  }

  try {
    const res = await fetch('http://127.0.0.1:8000/dashboard/api/escala-de-valores/', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        nombre: nombreEscala.value,
        descripcion: descripcionEscala.value,
        sensor: sensorParaEscala.value,
      }),
    });

    const data = await res.json();
    if (data.status !== 'ok') {
      throw new Error(data.mensaje || 'Error al crear la escala');
    }

    alert('Escala de valores creada correctamente');
    nombreEscala.value = '';
    descripcionEscala.value = '';
    sensorParaEscala.value = null;
    dialogoEscalaVisible.value = false;
    await cargarEscalas();
  } catch (err) {
    console.error('Error al guardar escala:', err);
    alert('Hubo un error al guardar la escala');
  }
}

function abrirEdicionRango(rango: Rango) {
  modoEdicion.value = true;
  idRangoEditando.value = rango.id;
  nombreRango.value = rango.nombre;
  descripcionRango.value = '';
  primerValor.value = rango.valor_minimo;
  segundoValor.value = rango.valor_maximo;
  escalaSeleccionada.value = rango.escala;
  dialogoAgregarVisible.value = true;
}

async function guardarRango() {
  if (
    !nombreRango.value ||
    primerValor.value === null ||
    segundoValor.value === null ||
    !escalaSeleccionada.value
  ) {
    alert('Por favor completa todos los campos');
    return;
  }

  try {
    console.log('Enviando escala_id:', escalaSeleccionada.value);
    const res = await fetch('http://127.0.0.1:8000/dashboard/api/rangos/', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        nombre: nombreRango.value,
        valor_minimo: primerValor.value,
        valor_maximo: segundoValor.value,
        color: colorRango.value,
        escala_id: escalaSeleccionada.value,
      }),
    });

    const data = await res.json();
    if (data.status !== 'ok') {
      throw new Error('Error al crear el rango: ' + data.mensaje);
    }

    alert('Rango agregado correctamente');
    nombreRango.value = '';
    descripcionRango.value = '';
    primerValor.value = null;
    segundoValor.value = null;
    escalaSeleccionada.value = null;
    dialogoAgregarVisible.value = false;
    await cargarRangos();
  } catch (err) {
    console.error('Error en guardarRango:', err);
    alert('Hubo un error al guardar el rango');
  }
}

async function confirmarEliminarRango(id: number) {
  const confirmado = confirm('¿Seguro que deseas eliminar este rango?');
  if (!confirmado) return;

  try {
    const res = await fetch(`http://127.0.0.1:8000/dashboard/api/rangos/${id}/`, {
      method: 'DELETE',
    });

    if (!res.ok) {
      throw new Error('Error al eliminar el rango');
    }

    alert('Rango eliminado correctamente');
    await cargarRangos();
  } catch (err) {
    console.error('Error al eliminar el rango:', err);
    alert('Hubo un error al eliminar el rango');
  }
}
</script>
