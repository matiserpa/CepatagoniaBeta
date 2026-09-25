// Service worker de la pantalla de acreditación.
//
// QUÉ HACE Y QUÉ NO. Esto NO da acreditación sin internet: acreditar es un POST al backend, y
// sin señal no hay forma de registrar un ingreso. Para eso haría falta una cola local que
// guarde los escaneos y los sincronice después, que es otra feature y bastante más grande.
//
// Lo que sí da: que la app abra al instante y que una conexión mala no deje a alguien mirando
// una pantalla en blanco en la puerta con una fila esperando.
//
// DOS REGLAS QUE NO SE TOCAN, porque romperlas es peor que no tener service worker:
//
//  1. Solo se cachean GET del propio dominio. Los POST al backend, el login de Google y el
//     lector de QR del CDN pasan de largo SIEMPRE. Cachear una respuesta del backend haría
//     que la puerta mostrara "falta entrar" de alguien que ya entró.
//
//  2. El HTML va a la red PRIMERO. La ventaja de la web sobre una app de tienda es que se
//     publica y todos tienen la versión nueva; un service worker mal hecho reintroduce
//     justamente el problema de la gente pegada a una versión vieja. Acá el caché del HTML es
//     solo el paracaídas para cuando no hay red.
const CACHE = 'cepa-acreditacion-v1';

const CASCARA = [
  '/acreditacion.html',
  '/assets/acred-icono-192.png',
  '/assets/acred-icono-512.png',
  '/assets/acred-apple-touch.png',
];

self.addEventListener('install', (e) => {
  // skipWaiting: al publicar una versión nueva toma el control en la siguiente carga, sin
  // esperar a que se cierren todas las pestañas. El día del evento nadie las cierra.
  e.waitUntil(caches.open(CACHE).then((c) => c.addAll(CASCARA)).then(() => self.skipWaiting()));
});

self.addEventListener('activate', (e) => {
  e.waitUntil(
    caches.keys()
      .then((claves) => Promise.all(claves.filter((k) => k !== CACHE).map((k) => caches.delete(k))))
      .then(() => self.clients.claim()),
  );
});

self.addEventListener('fetch', (e) => {
  const req = e.request;

  // Regla 1: cualquier cosa que no sea un GET del propio dominio se deja pasar sin tocar.
  // Eso cubre los POST al backend de Apps Script, el login de Google y el jsQR del CDN.
  if (req.method !== 'GET') return;
  if (new URL(req.url).origin !== self.location.origin) return;

  // Regla 2: el HTML, a la red primero.
  if (req.mode === 'navigate') {
    e.respondWith(
      fetch(req)
        .then((res) => {
          const copia = res.clone();
          caches.open(CACHE).then((c) => c.put(req, copia));
          return res;
        })
        .catch(() => caches.match('/acreditacion.html')),
    );
    return;
  }

  // Los estáticos (íconos): del caché, y se refrescan de fondo para la próxima vez.
  e.respondWith(
    caches.match(req).then((enCache) => {
      const red = fetch(req)
        .then((res) => {
          const copia = res.clone();
          caches.open(CACHE).then((c) => c.put(req, copia));
          return res;
        })
        .catch(() => enCache);
      return enCache || red;
    }),
  );
});
