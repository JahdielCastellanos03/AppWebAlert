<template>
  <!-- Contenedor principal centrado en pantalla -->
  <q-page class="flex flex-center bg-grey-2">
    <!-- Tarjeta con sombra y padding -->
    <q-card class="q-pa-lg shadow-2" style="width: 100%; max-width: 400px; border-radius: 12px">
      <!--desde que plataforma se accede-->

      <div class="flex flex-center">version {{ plataforma }}</div>

      <!--Logo inova-->
      <img src="/images/innovaLogoNegro.png" />

      <!-- Sección superior de la tarjeta con título -->
      <q-card-section class="text-center">
        <div class="text-h5">Inicio de sesión</div>
      </q-card-section>

      <!-- Formulario con validación y espacio entre elementos -->
      <q-form @submit.prevent="iniciarSesion" ref="formulario" class="q-gutter-md">
        <!-- Campo de entrada para el usuario -->
        <q-input filled v-model="usuario" label="Usuario" :rules="[campoObligatorio]" lazy-rules />

        <!-- Campo de entrada para la contraseña -->
        <q-input
          filled
          v-model="contrasena"
          label="Contraseña"
          type="password"
          :rules="[campoObligatorio]"
          lazy-rules
        />

        <!-- Botón de envío -->
        <q-btn label="Ingresar" type="submit" color="positive" class="full-width" />
      </q-form>

      <!-- Componente de Firebase Messaging (temporal para pruebas) -->
      <div class="q-mt-lg">
        <FirebaseMessaging />
      </div>
    </q-card>
  </q-page>
</template>

<script lang="ts" setup>
// Importamos funciones de Vue y
import { ref, computed } from 'vue';
//notificacion de quasar y plataforma
import { Notify, Platform } from 'quasar';
import { useRouter } from 'vue-router'; //importante para redirección
import { onMounted } from 'vue';
import FirebaseMessaging from '../components/FirebaseMessaging.vue';

onMounted(() => {
  console.log('Modo PWA:', window.matchMedia('(display-mode: standalone)').matches);

  // Verificar Firebase
  console.log('Verificando Firebase...');
  if (typeof window !== 'undefined' && 'firebase' in window) {
    console.log('Firebase global disponible');
  } else {
    console.log('Firebase global no disponible');
  }
});
// Variables reactivas para almacenar los valores del formulario
const usuario = ref('');
const contrasena = ref('');

// Referencia al formulario para poder validar manualmente
const formulario = ref();
const router = useRouter();

// Función que se usa como regla para validar campos requeridos
const campoObligatorio = (val: string) => !!val || 'Este campo es obligatorio';

//devolvemos desde donde se accede
const plataforma = computed(() => {
  if (Platform.is.android) return 'android';
  if (Platform.is.ios) return 'ios';
  if (Platform.is.win) return 'windows';
  return 'otro';
});

// Función que se ejecuta cuando se envía el formulario
async function iniciarSesion() {
  console.log('inicio de sesion');
  const esValido = await formulario.value?.validate();
  if (!esValido) return;

  if (usuario.value === 'a' && contrasena.value === '1') {
    Notify.create({
      type: 'positive',
      message: `Inicio de sesion exitoso`,
    });

    //nse modifica routes y agregamos la direcccion para redirigir a otra pagina
    setTimeout(() => {
      void router.push('/PagPrincipal');
    }, 1000);
  } else {
    Notify.create({
      type: 'negative',
      message: `Datos incorrectos`,
    });
  }
}
</script>
