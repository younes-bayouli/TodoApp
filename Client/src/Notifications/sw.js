
import { precacheAndRoute } from 'workbox-precaching'
import { initializeApp } from 'firebase/app'
import { getMessaging } from 'firebase/messaging/sw'
import { onBackgroundMessage } from 'firebase/messaging/sw'

precacheAndRoute(self.__WB_MANIFEST)

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: "notificationstest-1185a.firebaseapp.com",
  projectId: "notificationstest-1185a",
  storageBucket: "notificationstest-1185a.firebasestorage.app",
  messagingSenderId: "807802765745",
  appId: "1:807802765745:web:6c2add16c7796a1d5dfd90",
  measurementId: "G-M88DYX6D82"
}

const app = initializeApp(firebaseConfig)
const messaging = getMessaging(app)

onBackgroundMessage(messaging, async (payload) => {
  // FCM automatically displays notification messages.
  // We only display data-only messages ourselves.
  if (payload.notification) return

  const title = payload.data?.title || 'TodoApp'

  await self.registration.showNotification(title, {
    body: payload.data?.body || 'You have a new notification.',
    icon: '/logo.png',
    data: {
      url: payload.data?.url || '/',
    },
  })
})

self.addEventListener('notificationclick', (event) => {
  event.notification.close()

  event.waitUntil(
    clients.openWindow(event.notification.data?.url || '/')
  )
})
