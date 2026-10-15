import { subscribeToPush } from './push'

export default async function EnableNotifications() {
    try {
        const permission = await Notification.requestPermission()
        if (permission !== 'granted') {
            throw new Error('Notification permission denied')
        }
        console.log('Permission granted! Subscribing to push notifications...')
        await subscribeToPush()
        console.log('Subscribed!')
    } catch (err) {
        console.error(err)
    }
}