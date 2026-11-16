/* Service worker du Lycée Le Triomphe : affiche les notifications (appels, messages, annonces)
   et ouvre le site quand on touche une notification. À mettre à côté de index.html. */
self.addEventListener("install", function () { self.skipWaiting(); });
self.addEventListener("activate", function (e) { e.waitUntil(self.clients.claim()); });
self.addEventListener("push", function (e) {
  var d = {}; try { d = e.data ? e.data.json() : {}; } catch (x) { try { d = { body: e.data.text() }; } catch (y) { } }
  var n = d.notification || d;
  e.waitUntil(self.registration.showNotification(n.title || "Lycée Le Triomphe", {
    body: n.body || "", tag: n.tag || "lt-push", renotify: true, vibrate: [300, 150, 300], data: { url: n.url || self.registration.scope }
  }));
});
self.addEventListener("notificationclick", function (e) {
  e.notification.close();
  e.waitUntil(self.clients.matchAll({ type: "window", includeUncontrolled: true }).then(function (l) {
    for (var i = 0; i < l.length; i++) { if ("focus" in l[i]) return l[i].focus(); }
    return self.clients.openWindow((e.notification.data && e.notification.data.url) || self.registration.scope);
  }));
});
