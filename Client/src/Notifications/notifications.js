import { subscribeToPush, isPushSupported } from './push'

export async function enableNotifications() {
  if (!isPushSupported()) return 'unsupported'
  const permission = await Notification.requestPermission()
  if (permission !== 'granted') return permission // 'denied' or 'default'
  await subscribeToPush()
  return 'granted'
}