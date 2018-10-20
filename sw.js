const myCacheName = 'restaurantsSite';
const filesToCache = ['index.html', 'restaurant.html', '/', '/js/main.js', '/js/restaurant_info.js', '/js/dbhelper.js', '/css/styles.css', '/data/restaurants.json'];
for (let i = 1; i < 11; i++) {
	filesToCache.push(`/img/${i}.jpg`);
}

self.addEventListener('install', function(event) {
	event.waitUntil(
		caches.open(myCacheName).then(function(cache) {
			return cache.addAll(filesToCache);
		})
	);
});

self.addEventListener('fetch', function(event) {
	event.respondWith(
		caches.match(event.request).then(function(response) {
			if (response) return response;
			return fetch(event.request);
		})
	);
});