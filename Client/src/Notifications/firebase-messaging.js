
import { getMessaging, getToken, isSupported } from 'firebase/messaging'
import app from './firebase'

export async function getFCMToken() {
  if (!(await isSupported())) {
    throw new Error('Firebase Messaging is not supported')
  }

  const messaging = getMessaging(app)

  // Reuse the PWA service worker registered by vite-plugin-pwa
  const registration = await navigator.serviceWorker.ready

  const token = await getToken(messaging, {
    vapidKey: import.meta.env.VITE_VAPID_PUBLIC_KEY,
    serviceWorkerRegistration: registration,
  })

  if (!token) {
    throw new Error('Failed to generate FCM token')
  }

  console.log('FCM Token:', token)

  return token
}
