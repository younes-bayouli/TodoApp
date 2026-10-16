const API_URL = import.meta.env.VITE_API_URL
const SYNCED_KEY = 'push:syncedEndpoint'

function urlBase64ToUint8Array(base64String) {
  const padding = '='.repeat((4 - (base64String.length % 4)) % 4)
  const base64 = (base64String + padding).replace(/-/g, '+').replace(/_/g, '/')
  const raw = atob(base64)
  return Uint8Array.from([...raw].map((c) => c.charCodeAt(0)))
}

export function isPushSupported() {
  return 'serviceWorker' in navigator && 'PushManager' in window && 'Notification' in window
}

export async function subscribeToPush() {
  if (!isPushSupported()) throw new Error('Push is not supported in this browser')

  const registration = await navigator.serviceWorker.ready

  let subscription = await registration.pushManager.getSubscription()
  if (!subscription) {
    subscription = await registration.pushManager.subscribe({
      userVisibleOnly: true,
      applicationServerKey: urlBase64ToUint8Array(import.meta.env.VITE_VAPID_PUBLIC_KEY),
    })
  }

  // Only send to the server if it hasn't received this exact subscription yet
  if (localStorage.getItem(SYNCED_KEY) !== subscription.endpoint) {
    const res = await fetch(`${API_URL}/push/subscribe`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(subscription),
    })
    if (!res.ok) throw new Error(`Server rejected subscription (${res.status})`)

    // Remember only after the server confirmed
    localStorage.setItem(SYNCED_KEY, subscription.endpoint)
  }

  return subscription
}

export async function unsubscribeFromPush() {
  if (!('serviceWorker' in navigator)) return

  const registration = await navigator.serviceWorker.ready
  const subscription = await registration.pushManager.getSubscription()
  if (subscription) await subscription.unsubscribe()

  localStorage.removeItem(SYNCED_KEY)
}