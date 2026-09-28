// Prueba de la pantalla de la puerta, con un DOM simulado.
//
// Existe por un caso concreto: el id_token de Google vive una hora, y hasta ahora al vencerse
// el lector mostraba "No válido" — o sea, culpaba a la entrada de la persona. Con cola en la
// puerta eso termina en gente rechazada que tenía todo bien.
//
// Lo que se verifica es la distinción: un problema de SESIÓN pide volver a entrar; un rechazo
// de NEGOCIO sigue mostrando la pantalla roja.
const fs = require('fs');
const vm = require('vm');

let pasaron = 0, fallaron = 0;
function ok(cond, que) {
  if (cond) { console.log('  ok    ' + que); pasaron++; }
  else { console.log('  FALLA ' + que); fallaron++; }
}

// Un JWT de mentira con un vencimiento de verdad: cabecera.carga.firma, y la carga en
// base64url. El código lee únicamente "exp", así que con eso alcanza.
function tokenQueVenceEn(minutos) {
  const carga = Buffer.from(JSON.stringify({ exp: Math.floor(Date.now() / 1000) + minutos * 60 }))
    .toString('base64').replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
  return 'cabecera.' + carga + '.firma';
}

function armar() {
  const nodos = {};
  function nodo(id) {
    if (!nodos[id]) {
      nodos[id] = {
        id, textContent: '', innerHTML: '', className: '', value: '', disabled: false,
        style: {}, dataset: {},
        appendChild() {}, removeChild() {}, remove() { nodos[id].borrado = true; },
        addEventListener() {}, focus() {}, querySelectorAll() { return []; },
        classList: { add() {}, remove() {}, contains() { return false; } },
        getContext() { return { drawImage() {}, getImageData() { return { data: [], width: 0, height: 0 }; } }; },
      };
    }
    return nodos[id];
  }

  const s = {
    console,
    nodos,
    document: {
      getElementById: nodo,
      querySelectorAll() { return []; },
      querySelector() { return null; },
      addEventListener() {},
      createElement: () => nodo('tmp' + Math.random()),
      body: nodo('body'),
      hidden: false,
    },
    window: { addEventListener() {}, matchMedia: () => ({ matches: false }) },
    navigator: { mediaDevices: { getUserMedia: () => Promise.reject(new Error('sin cámara')) }, userAgent: 'test' },
    sessionStorage: { _d: {}, getItem(k) { return this._d[k] ?? null; }, setItem(k, v) { this._d[k] = v; }, removeItem(k) { delete this._d[k]; } },
    // localStorage con memoria: la prueba nueva verifica que el token SOBREVIVA, y un stub que
    // siempre devuelve null no puede distinguir "guardó bien" de "no guardó nada".
    localStorage: {
      _d: {},
      getItem(k) { return k in this._d ? this._d[k] : null; },
      setItem(k, v) { this._d[k] = String(v); },
      removeItem(k) { delete this._d[k]; },
    },
    // El token trae su vencimiento adentro, en base64url. Sin atob no se puede leer.
    atob: (b) => Buffer.from(String(b), 'base64').toString('binary'),
    fetch: () => Promise.resolve({ json: () => Promise.resolve({ ok: false }) }),
    setTimeout: (fn, ms) => { s.__timers.push({ fn, ms }); return s.__timers.length; },
    clearTimeout() {},
    setInterval: () => 0,
    clearInterval() {},
    requestAnimationFrame() { return 0; },
    AudioContext: function () { return { createOscillator: () => ({ connect() {}, start() {}, stop() {}, frequency: {}, type: '' }), createGain: () => ({ connect() {}, gain: { setValueAtTime() {}, exponentialRampToValueAtTime() {} } }), destination: {}, currentTime: 0 }; },
    google: { accounts: { id: { initialize() {}, renderButton() {}, prompt() {} } } },
    jsQR: () => null,
    Date, Math, JSON, String, Number, Boolean, Array, Object, RegExp, Error, Promise, isNaN, parseInt, parseFloat, encodeURIComponent, decodeURIComponent,
    __timers: [],
  };
  s.window.location = { reload() { s.__recargo = true; } };
  s.webkitAudioContext = s.AudioContext;

  vm.createContext(s);
  const html = fs.readFileSync(__dirname + '/acreditacion.html', 'utf8');
  const bloques = html.match(/<script>([\s\S]*?)<\/script>/g) || [];
  const codigo = bloques.map((x) => x.replace(/<\/?script[^>]*>/g, '')).join('\n');
  vm.runInContext(codigo, s);
  return s;
}

console.log('');
console.log('── 1 · Entrar NO borra el botón de Google');
{
  const s = armar();
  s.entrarConToken('tok-123');
  ok(!s.nodos.login.borrado, 'el div del login sigue en el DOM');
  ok(s.nodos.login.style.display === 'none', 'solo se esconde');
  ok(s.sessionStorage.getItem('cepaAcredToken') === 'tok-123', 'el token queda guardado');
}

console.log('');
console.log('── 2 · La sesión se renueva sola ANTES de vencer');
{
  // El acreditador no puede quedarse afuera en medio de la fila. Cinco minutos antes de que el
  // token muera se pide uno nuevo en silencio; el cartel de "volvé a entrar" es el último
  // recurso, no el primero.
  const s = armar();
  s.entrarConToken(tokenQueVenceEn(60));
  const renov = s.__timers.filter((t) => t.ms > 40 * 60 * 1000 && t.ms < 60 * 60 * 1000);
  ok(renov.length === 1, 'programa una renovación dentro de la hora');
  ok(renov.length === 1 && Math.abs(renov[0].ms - 55 * 60 * 1000) < 5000,
    'a los 55 minutos: cinco antes de que venza a los 60');
}
{
  // Un token que Google devuelve ya usado no dura 60 minutos. Antes se renovaba a los 50 fijos
  // y lo agarraba muerto; ahora la cuenta sale del vencimiento que trae el token.
  const s = armar();
  s.entrarConToken(tokenQueVenceEn(20));
  const renov = s.__timers.filter((t) => t.ms > 10 * 60 * 1000 && t.ms < 20 * 60 * 1000);
  ok(renov.length === 1, 'un token de 20 minutos se renueva a los 15, no a los 50');
}
{
  // Y si el token no se puede leer, no se programa nada negativo ni nada eterno.
  const s = armar();
  s.entrarConToken('esto-no-es-un-jwt');
  const renov = s.__timers.filter((t) => t.ms >= 10000 && t.ms < 60000);
  ok(renov.length === 1, 'un token ilegible se renueva enseguida, no nunca');
  ok(!s.__timers.some((t) => t.ms < 0), 'y nunca con un plazo negativo');
}

console.log('');
console.log('── 2b · El token sobrevive a cerrar el navegador');
{
  // sessionStorage se borra al cerrar la pestaña. En una jornada de ocho horas el acreditador
  // cierra y abre el teléfono varias veces, y no puede tener que loguearse cada vez.
  const s = armar();
  s.entrarConToken('tok-abc');
  ok(s.localStorage.getItem('cepaAcredToken') === 'tok-abc', 'queda en localStorage');
  ok(s.sessionStorage.getItem('cepaAcredToken') === 'tok-abc', 'y también en sessionStorage, de respaldo');

  // Al volver a abrir, se lee de localStorage aunque sessionStorage esté vacío.
  const s2 = armar();
  s2.localStorage.setItem('cepaAcredToken', 'tok-guardado');
  ok(s2.leerToken() === 'tok-guardado', 'al reabrir lo encuentra');
  s2.olvidarToken();
  ok(s2.leerToken() === null, 'y al olvidarlo se va de los dos lados');
}

console.log('');
console.log('── 2c · Lo que hace que no haya que loguearse de nuevo');
{
  const html = fs.readFileSync(__dirname + '/acreditacion.html', 'utf8');
  ok(/auto_select:\s*true/.test(html),
    'auto_select está puesto: Google devuelve el token sin mostrar nada');
  ok(/google\.accounts\.id\.prompt\(/.test(html),
    'y se le pide un token nuevo en silencio cuando hace falta');
}

console.log('');
console.log('── 2d · Antes de molestar a nadie, intenta renovar en silencio');
{
  // Los bloques de arriba prueban el RESPALDO, porque en ese sandbox window.google no existe.
  // Este prueba el camino que de verdad va a ocurrir el 10 de octubre: Google disponible, y
  // la sesion renovandose sin que el acreditador vea nada.
  const s = armar();
  let pedidos = 0;
  s.window.google = { accounts: { id: { prompt(cb) { pedidos++; } } } };
  s.google = s.window.google;
  s.entrarConToken(tokenQueVenceEn(60));
  s.nodos.login.style.display = 'none';

  s.resultadoNegativo({ ok: false, motivo: 'Token inválido o vencido' });
  ok(pedidos === 1, 'le pide a Google un token nuevo');
  ok(s.nodos.login.style.display === 'none',
    'y NO muestra el cartel todavía: el acreditador sigue trabajando');

  // Recién si esa renovación no trae nada, aparece el cartel.
  s.resultadoNegativo({ ok: false, motivo: 'Token inválido o vencido' });
  ok(s.nodos.login.style.display === 'flex', 'si el segundo intento falla, ahí sí aparece');
  ok(/sesi/i.test(s.nodos.loginErr.textContent), 'y dice que el problema es la sesión');
  ok(/entrada de la persona est/i.test(s.nodos.loginErr.textContent),
    'no la entrada de quien está parado enfrente');
}


console.log('── 3 · EL CASO DEL BUG: un error de sesión no se muestra como entrada inválida');
{
  const MOTIVOS_SESION = [
    'Token inválido o vencido',
    'Token de otra aplicación',
    'Falta id_token',
    'No se pudo validar el token',
    'Tu cuenta (x@y.com) no tiene acceso al panel',
  ];
  MOTIVOS_SESION.forEach(function (motivo) {
    const s = armar();
    s.entrarConToken('tok');
    s.nodos.login.style.display = 'none';
    s.resultadoNegativo({ ok: false, motivo: motivo });
    const pidioLogin = s.nodos.login.style.display === 'flex';
    const dijoNoValido = /No v[áa]lido/i.test(String((s.nodos.rTitulo && s.nodos.rTitulo.textContent) || ''));
    ok(pidioLogin && !dijoNoValido, JSON.stringify(motivo.slice(0, 34)) + ' → pide reingreso');
  });
}

console.log('');
console.log('── 4 · Y un rechazo de verdad SIGUE siendo una pantalla roja');
{
  const MOTIVOS_NEGOCIO = [
    'La orden CEP-X no está paga (estado: EXPIRADO)',
    'Esta entrada no incluye el Post Congreso de E. Finci',
    'Persona inexistente en la orden (3 de 2)',
    'Código no encontrado',
  ];
  MOTIVOS_NEGOCIO.forEach(function (motivo) {
    const s = armar();
    s.entrarConToken('tok');
    s.nodos.login.style.display = 'none';
    s.resultadoNegativo({ ok: false, motivo: motivo });
    const pidioLogin = s.nodos.login.style.display === 'flex';
    const dijoNoValido = /No v[áa]lido/i.test(String((s.nodos.rTitulo && s.nodos.rTitulo.textContent) || ''));
    ok(dijoNoValido && !pidioLogin, JSON.stringify(motivo.slice(0, 34)) + ' → sigue en rojo');
  });
}

console.log('');
console.log('── 5 · "Ya ingresó" tampoco se confunde con un problema de sesión');
{
  const s = armar();
  s.entrarConToken('tok');
  s.nodos.login.style.display = 'none';
  s.resultadoNegativo({
    ok: false, motivo: 'YA INGRESÓ',
    detalle: { persona: 'Meylin Gutiérrez', codigo: 'CEP-AAA-P1', yaIngreso: new Date().toISOString() },
  });
  ok(s.nodos.login.style.display === 'none', 'no pide reingreso');
  ok(/Ya ingres/i.test(String((s.nodos.rTitulo && s.nodos.rTitulo.textContent) || '')), 'muestra "Ya ingresó"');
}

console.log('');

console.log('');
console.log('── 6 · El teclado del teléfono no puede taparle la cámara al acreditador');
{
  // El campo manual se enfoca a propósito, porque el lector USB escribe como un teclado. Pero
  // en un teléfono cada foco abre el teclado en pantalla ENCIMA de la cámara: hay que bajarlo
  // a mano para poder apuntar, y después de cada persona vuelve a subir.
  const html = fs.readFileSync(__dirname + '/acreditacion.html', 'utf8');
  ok(/any-pointer: fine/.test(html), 'distingue un teléfono de una notebook con lector USB');
  ok(html.indexOf('if(!HAY_TECLADO && CAMARA_ANDANDO) return;') > 0,
    'el intervalo que robaba el foco CADA SEGUNDO se frena en el teléfono');
  ok(html.indexOf("m.value=''; enfocarManual();") > 0,
    'y cerrar el resultado ya no hace focus() directo después de cada persona');
}
{
  // El sandbox no tiene any-pointer: fine, o sea que se comporta como teléfono.
  const s = armar();
  s.CAMARA_ANDANDO = true;
  s.HAY_TECLADO = false;
  let focos = 0;
  s.nodos.manual.focus = () => { focos++; };
  s.enfocarManual();
  ok(focos === 0, 'en un teléfono con cámara, entrar NO abre el teclado');

  // Pero si la cámara no arrancó, escribir es la única forma de acreditar: ahí sí.
  s.enfocarManual(true);
  ok(focos === 1, 'sin cámara el teclado aparece solo, que es lo que hace falta');
}
{
  // Y en una notebook con lector USB el comportamiento de siempre no se toca.
  const s = armar();
  s.HAY_TECLADO = true;
  s.CAMARA_ANDANDO = true;
  let focos = 0;
  s.nodos.manual.focus = () => { focos++; };
  s.enfocarManual();
  ok(focos === 1, 'con teclado físico el foco sigue yendo al campo, para el lector USB');
}


console.log('');
console.log('── 7 · El lector entra solo si el permiso ya se dio en el panel');
{
  // Este era el error: auto_select estaba puesto en initialize() pero NO SE USABA. En Google
  // Identity Services auto_select solo actúa cuando se dispara One Tap con prompt(), y prompt()
  // se llamaba únicamente al renovar — nunca al abrir. Resultado: el panel entraba solo (por el
  // localStorage) y el lector seguía pidiendo permiso, justo al revés de lo que se quería.
  const html = fs.readFileSync(__dirname + '/acreditacion.html', 'utf8');
  ok(/function entrarSinMolestar/.test(html), 'existe el intento silencioso al abrir');
  ok(/else \s*\{[\s\S]{0,60}entrarSinMolestar/.test(html),
    'y se llama cuando NO hay token guardado, que es la apertura limpia');
  ok(/auto_select:\s*true/.test(html), 'con auto_select puesto, que es lo que lo hace silencioso');
}
{
  // Con Google disponible, abrir sin token guardado tiene que pedirle un token — sin mostrar
  // el botón ni molestar a nadie.
  const s = armar();
  let pedidos = 0;
  s.window.google = { accounts: { id: { prompt(cb) { pedidos++; } } } };
  s.google = s.window.google;
  s.entrarSinMolestar();
  ok(pedidos === 1, 'le pide el token a Google al abrir');
}
{
  // Y si la librería de Google no cargó, no explota ni deja la página colgada esperando.
  const s = armar();
  s.window.google = undefined;
  let exploto = false;
  try { s.entrarSinMolestar(); } catch (e) { exploto = true; }
  ok(!exploto, 'sin la librería de Google no explota');
  ok(s.__timers.some((t) => t.ms === 500), 'reintenta, porque el script de Google puede tardar');
}


console.log('');
console.log('── 8 · La pantalla de login no puede parpadear');
{
  // Antes aparecía un segundo y se iba: el acreditador ve un login que no llega a leer y no
  // sabe si tiene que hacer algo. Ahora arranca mostrando que está entrando, y el botón se
  // revela SOLO si la entrada silenciosa no sale.
  const html = fs.readFileSync(__dirname + '/acreditacion.html', 'utf8');
  ok(html.indexOf("class=\"login verificando\"") > 0,
    'arranca en estado de verificación, no pidiendo login');
  ok(/\.login\.verificando \.gwrap/.test(html), 'y con el botón de Google escondido');
  ok(/function mostrarBotonDeGoogle/.test(html), 'existe la función que lo revela');
}
{
  const s = armar();
  const quitados = [];
  s.document.getElementById('login').classList.remove = (c) => { quitados.push(c); };
  s.mostrarBotonDeGoogle();
  ok(quitados.indexOf('verificando') >= 0, 'revelar el botón saca el estado de verificación');
}
{
  // Y si Google nunca contesta, el botón aparece igual: quedarse en "Entrando" para siempre
  // sería peor que el parpadeo que esto viene a arreglar.
  const s = armar();
  s.window.google = { accounts: { id: { prompt() {} } } };
  s.google = s.window.google;
  // entrarSinMolestar ya corrio al cargar la pagina, asi que se mide la DIFERENCIA y no el
  // total: contar el total daria dos y la prueba pasaria o fallaria por el motivo equivocado.
  const antes = s.__timers.filter((t) => t.ms === 6000).length;
  s.entrarSinMolestar();
  const tope = s.__timers.filter((t) => t.ms === 6000);
  ok(tope.length === antes + 1, 'programa un tope de seis segundos');
  const quitados = [];
  s.document.getElementById('login').classList.remove = (c) => { quitados.push(c); };
  if (tope.length) tope[0].fn();
  ok(quitados.indexOf('verificando') >= 0, 'y al cumplirse muestra el botón');
}

console.log('────────────────────────────────────────────────────────────────');
console.log('  pasaron: ' + pasaron + '   ·   fallaron: ' + fallaron);
process.exitCode = fallaron ? 1 : 0;
