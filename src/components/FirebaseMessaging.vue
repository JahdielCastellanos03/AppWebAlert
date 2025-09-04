<template>
  <div class="firebase-messaging">
    <div class="text-subtitle2 q-mb-sm">🔔 Notificaciones</div>

    <!-- Botón para activar manualmente si es necesario -->
    <q-btn
      v-if="!isSubscribed && !loading"
      color="primary"
      size="sm"
      label="Activar"
      @click="requestNotificationPermission"
      class="q-mt-sm"
    />

    <!-- Estado de carga -->
    <div v-if="loading" class="q-mt-sm">
      <q-spinner color="primary" size="1em" />
      <span class="q-ml-sm text-caption">Activando...</span>
    </div>

    <!-- Estado activado -->
    <div v-if="isSubscribed" class="q-mt-sm text-positive text-caption">✅ Activadas</div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { messaging } from 'src/boot/firebase';
import { getToken, onMessage } from 'firebase/messaging';
import { Notify } from 'quasar';

const isSubscribed = ref(false);
const loading = ref(false);

onMounted(() => {
  console.log('FirebaseMessaging component mounted');
  console.log('messaging disponible:', !!messaging);
  console.log('Componente visible en pantalla');

  // Verificar si ya tenemos permisos
  if ('Notification' in window) {
    isSubscribed.value = Notification.permission === 'granted';
    console.log('Permisos de notificación:', Notification.permission);

    // Siempre generar token después de un delay, independientemente de los permisos
    setTimeout(() => {
      console.log('Generando token de notificación...');
      void requestNotificationPermission();
    }, 2000);
  }

  // Escuchar mensajes cuando la app está en primer plano
  if (messaging) {
    onMessage(messaging, (payload) => {
      console.log('Message received in foreground:', payload);

      // Mostrar notificación en primer plano
      Notify.create({
        type: 'positive',
        message: payload.notification?.title || 'Nueva notificación',
        caption: payload.notification?.body || '',
        icon: 'notifications',
        position: 'top-right',
        timeout: 5000,
      });
    });
  }
});

async function requestNotificationPermission() {
  if (!messaging) {
    Notify.create({
      type: 'negative',
      message: 'Firebase Messaging no está disponible',
      position: 'bottom-right',
    });
    return;
  }

  loading.value = true;

  try {
    // Obtener token del dispositivo (ya tenemos permisos)
    const token = await getToken(messaging, {
      vapidKey: import.meta.env.VITE_FIREBASE_VAPID_KEY,
    });

    if (token) {
      console.log('TOKEN DEL DISPOSITIVO:', token);
      isSubscribed.value = true;

      // Aquí deberías enviar el token a tu backend
      // para poder enviar notificaciones a este dispositivo

      Notify.create({
        type: 'positive',
        message: 'Token generado correctamente',
        caption: 'Revisa la consola para ver el token',
        icon: 'check_circle',
        position: 'bottom-right',
        timeout: 8000,
      });
    } else {
      throw new Error('No se pudo generar el token');
    }
  } catch (error) {
    console.error('Error al generar token:', error);
    Notify.create({
      type: 'negative',
      message: 'Error al generar token',
      caption: 'Verifica la VAPID key',
      position: 'bottom-right',
      timeout: 5000,
    });
  } finally {
    loading.value = false;
  }
}
</script>

<style scoped>
.firebase-messaging {
  padding: 12px 16px;
  border: 3px solid #ff5722;
  border-radius: 8px;
  background-color: #fff3e0;
  margin: 16px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
  max-width: 250px;
  text-align: center;
  font-weight: bold;
}
</style>
