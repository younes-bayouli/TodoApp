
import { getMessaging, getToken, isSupported } from 'firebase/messaging'
import app from './firebase'

const API_URL = "/api"

export async function getFCMToken() {
  if (!(await isSupported())) {
    throw new Error('Firebase Messaging is not supported')
  }

  const messaging = getMessaging(app)
  const registration = await navigator.serviceWorker.ready

  const token = await getToken(messaging, {
    vapidKey: import.meta.env.VITE_VAPID_PUBLIC_KEY,
    serviceWorkerRegistration: registration,
  })

  if (!token) {
    throw new Error('Failed to generate FCM token')
  }

  // Register the token with Spring Boot
  const response = await fetch(`${API_URL}/notifications/fcm/register`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ token }),
  })

  if (!response.ok) {
    throw new Error(`FCM registration failed: ${response.status}`)
  }

  console.log('FCM token registered successfully')

  return token
}
