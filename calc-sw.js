const CACHE_NAME = 'tp-calc-v1';
const ASSETS = [
    'tp_mfia.html',
    'calc-manifest.json',
    'https://cdn-icons-png.flaticon.com/512/564/564429.png'
];

// نصب سرویس ورکر و ذخیره فایل‌ها
self.addEventListener('install', (event) => {
    event.waitUntil(
        caches.open(CACHE_NAME).then((cache) => {
            return cache.addAll(ASSETS);
        })
    );
});

// مدیریت درخواست‌ها برای کارکرد آفلاین (این بخش در اسکرین‌شات شما نبود)
self.addEventListener('fetch', (event) => {
    event.respondWith(
        caches.match(event.request).then((response) => {
            return response || fetch(event.request);
        })
    );
});
