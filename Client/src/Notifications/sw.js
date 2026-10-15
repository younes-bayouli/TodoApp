self.addEventListener("push", (event) => {
    let data = {};

    if (event.data) {
        try {
            data = event.data.json();
        } catch {
            data = { message: event.data.text() };
        }
    }

    const title = data.title || "Notification Test";
    const options = {
        body: data.message || "You received a push notification!",
        icon: "/vite.svg",
        data: {
            url: data.url || "/"
        }
    };

    event.waitUntil(
        self.registration.showNotification(title, options)
    );
});

self.addEventListener("notificationclick", (event) => {
    event.notification.close();

    event.waitUntil(
        clients.openWindow(event.notification.data.url || "/")
    );
});