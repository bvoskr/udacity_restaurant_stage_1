const currCacheName = 'restaurantsSite01';
const filesToCache = ['/', '/index.html', '/restaurant.html', '/js/main.js', '/js/restaurant_info.js', '/js/dbhelper.js', '/css/styles.css', '/data/restaurants.json'];
for (let i = 1; i < 11; i++) {
	filesToCache.push(`/img/${i}.jpg`);
}

self.addEventListener('install', function(event) {
	event.waitUntil(
		caches.open(currCacheName).then(function(cache) {
			return cache.addAll(filesToCache);
		})
	);
});


// Dear reviewer! 
// I gratefully follow your advice and modify fetch listener, using code 
// template for "caching new requests cumulatively" from 
// https://developers.google.com/web/fundamentals/primers/service-workers/
// Looks, though, like it would help to solves accessibility issues,
// only in case some files failed to cache during SW install. 
// And I thought I cache absolutely everything, basically whole site,
// including even unvisited restaurant pages, during SW install event.
//
// Any further feedback/comments on it are greatly appreciated!
// Regards,
// Boris.

self.addEventListener('fetch', function(event) {
    event.respondWith(
        caches.match(event.request).then(function(response) {
            if (response) return response;

            var fetchRequest = event.request.clone();

            return fetch(fetchRequest).then(function(response) {
                // Check if we received a valid response
                if(!response || response.status !== 200 || response.type !== 'basic') {
                    return response;
                }

                var responseToCache = response.clone();

                caches.open(currCacheName).then(function(cache) {
                    cache.put(event.request, responseToCache);
                });

                return response;
            });
		})
    );
});

self.addEventListener('activate', function(event) {
	event.waitUntil(
		caches.keys().then(function(cacheNames) {
			return Promise.all(
				cacheNames.filter(function(cacheName) {
					return cacheName.startsWith('restaurantsSite') &&
					       cacheName != currCacheName;
				}).map(function(cacheName) {
					console.log('[ServiceWorker] Removing old cache ', cacheName);
					return caches.delete(cacheName);
				})
			);
		})
	);
});
