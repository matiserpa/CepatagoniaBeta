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
    localStorage: { getItem: () => null, setItem() {}, removeItem() {} },
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
console.log('── 2 · Se programa el aviso antes de que el token muera');
{
  const s = armar();
  s.entrarConToken('tok-123');
  const aviso = s.__timers.filter((t) => t.ms >= 40 * 60 * 1000 && t.ms < 60 * 60 * 1000);
  ok(aviso.length === 1, 'hay un aviso programado dentro de la hora');
  ok(aviso.length === 1 && aviso[0].ms === 50 * 60 * 1000, 'a los 50 minutos, con 10 de margen');
  // Y que ese aviso haga lo que tiene que hacer.
  if (aviso.length) {
    aviso[0].fn();
    ok(s.nodos.login.style.display === 'flex', 'al dispararse, vuelve a mostrar el login');
    ok(/sesi/i.test(s.nodos.loginErr.textContent), 'con un texto que habla de la sesión');
    ok(/entrada de la persona est/i.test(s.nodos.loginErr.textContent),
      'y que aclara que la entrada de la persona está bien');
  }
}

console.log('');
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
console.log('────────────────────────────────────────────────────────────────');
console.log('  pasaron: ' + pasaron + '   ·   fallaron: ' + fallaron);
process.exitCode = fallaron ? 1 : 0;
