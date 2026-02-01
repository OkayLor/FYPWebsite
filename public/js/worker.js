console.log("Service Worker Loaded...");

self.addEventListener("push", e => {
    const data = e.data.json();
    console.log(data);
    console.log("Push Recieved...");

    fetch("/newestNews")
        .then(response => response.json())
        .then(responseData => {
            console.log(responseData);
            self.registration.showNotification(
                data.title, // title of the notification
                {
                    body: responseData[0].title + "\n" + responseData[0].content, // the body of the push notification
                    data: { url: "/news" } // URL to open
                }
            );
        })
        .catch(error => {
            console.error("Error fetching data:", error);
        });
});

self.addEventListener('notificationclick', function(event) {
    event.notification.close();
    event.waitUntil(
        clients.openWindow(event.notification.data.url) // Open the URL specified in the notification data
    );
});