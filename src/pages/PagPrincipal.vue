<template>
  <q-layout view="hHh lpr fFr">
    <q-header elevated style="background-color: #598234; height: 80px" class="text-white">
      <q-toolbar>
        <q-toolbar-title> Bienvenido Jachi </q-toolbar-title>

        <q-btn dense flat round icon="menu" size="30px" @click="toggleRightDrawer" />
      </q-toolbar>
    </q-header>

    <q-drawer v-model="rightDrawerOpen" side="right" bordered class="q-pa-md">
      <!-- Foto de usuario centrada -->
      <div class="q-my-md flex flex-center">
        <q-avatar size="80px">
          <img src="/images/Jachi.jpeg" alt="Foto de usuario" />
        </q-avatar>
      </div>

      <!-- Nombre del usuario centrado -->
      <div class="text-center text-subtitle1 q-mb-lg">Jachiko Nou</div>

      <!-- Lista de opciones de navegación -->
      <q-list padding bordered separator>
        <!-- Opción: Configuración -->
        <q-item clickable v-ripple>
          <q-item-section avatar>
            <q-icon name="settings" />
          </q-item-section>
          <q-item-section> Configuración </q-item-section>
        </q-item>

        <!-- Opción: Reportes -->
        <q-item clickable v-ripple>
          <q-item-section avatar>
            <q-icon name="bar_chart" />
          </q-item-section>
          <q-item-section> Reportes </q-item-section>
        </q-item>

        <!-- Opción: Cerrar sesión -->
        <q-item clickable v-ripple>
          <q-item-section avatar>
            <q-icon name="logout" />
          </q-item-section>
          <q-item-section> Salir </q-item-section>
        </q-item>
      </q-list>
    </q-drawer>

    <q-page-container>
      <!-- Contenedor principal centrado vertical y horizontalmente -->
      <div class="q-pa-md flex flex-center column" style="min-height: 100vh">
        <!-- Título -->
        <div class="text-h4 text-center q-mb-xl">Panel de control</div>

        <!-- Grid de tarjetas -->
        <div class="row q-col-gutter-xl justify-center">
          <!-- Tarjeta: Proyectos -->
          <div class="col-12 col-sm-6 col-md-3">
            <q-card
              class="text-white q-pa-xl flex flex-center column"
              @click="$router.push('/MostrarDatos')"
              style="background-color: #62829e; height: 300px"
              clickable
            >
              <div class="text-h5">Mostrar datos</div>
            </q-card>
          </div>

          <!-- Tarjeta: Alertas -->
          <div class="col-12 col-sm-6 col-md-3">
            <q-card
              class="text-white q-pa-xl flex flex-center column"
              style="background-color: #62829e; height: 300px"
              clickable
            >
              <div class="text-h5">Alertas</div>
            </q-card>
          </div>

          <!-- Tarjeta: Reportes -->
          <div class="col-12 col-sm-6 col-md-3">
            <q-card
              class="text-white q-pa-xl flex flex-center column"
              style="background-color: #62829e; height: 300px"
              clickable
            >
              <div class="text-h5">Reportes</div>
            </q-card>
          </div>

          <!-- Tarjeta: Notas -->
          <div class="col-12 col-sm-6 col-md-3">
            <q-card
              class="text-white q-pa-xl flex flex-center column"
              style="background-color: #62829e; height: 300px"
              clickable
            >
              <div class="text-h5">Notas</div>
            </q-card>
          </div>
        </div>

        <!-- Componente de Firebase Messaging -->
        <div class="q-mt-lg">
          <FirebaseMessaging />
        </div>
      </div>
    </q-page-container>
  </q-layout>
</template>

<script lang="ts" setup>
import { ref } from 'vue';
import FirebaseMessaging from '../components/FirebaseMessaging.vue';

// Indicamos explícitamente que es un booleano
const rightDrawerOpen = ref<boolean>(false);

// Función para alternar el estado del drawer
function toggleRightDrawer(): void {
  rightDrawerOpen.value = !rightDrawerOpen.value;
}
</script>
