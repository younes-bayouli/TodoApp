import { getFCMToken } from "./firebase-messaging";

export async function enableNotifications() {
  if (!('Notification' in window)) return 'unsupported'

  const permission = await Notification.requestPermission()

  const token = await getFCMToken()

  return permission
}