self.addEventListener("install", function (event) {
  event.waitUntil(
    caches.open("sudoku-app").then(function (cache) {
      cache.addAll(["", "/sudoku", "/sudoku/", "index.html", "style.css", "script.js"]);
    })
  );
  return self.clients.claim();
});

self.addEventListener("fetch", function (event) {
  event.respondWith(
    caches.match(event.request, { ignoreSearch: true }).then(function (res) {
      return res;
    })
  );
});
