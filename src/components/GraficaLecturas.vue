<template>
  <div>
    <Line :data="datosGrafica" :options="opcionesGrafica" />
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { Line } from 'vue-chartjs'
import {
  Chart as ChartJS,
  Title,
  Tooltip,
  Legend,
  LineElement,
  PointElement,
  LinearScale,
  CategoryScale,
} from 'chart.js'

ChartJS.register(Title, Tooltip, Legend, LineElement, PointElement, LinearScale, CategoryScale)

interface Props {
  lecturas: Array<{ fecha: string; [clave: string]: string }>
  sensor: string
}

const props = defineProps<Props>()

const datosGrafica = computed(() => {
  const etiquetas = props.lecturas.map(l => l.fecha)
  const datos = props.lecturas.map(l => Number(l[props.sensor]) || 0)

  return {
    labels: etiquetas,
    datasets: [
      {
        label: props.sensor,
        data: datos,
        fill: false,
        borderColor: 'rgba(75,192,192,1)',
        tension: 0.1
      }
    ]
  }
})

const opcionesGrafica = {
  responsive: true,
  maintainAspectRatio: false
}
</script>

<style scoped>
div {
  height: 400px;
}
</style>
