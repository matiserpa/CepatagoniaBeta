<!doctype html>
<html lang="es">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <meta name="theme-color" content="#0b0f14" />
  <title>CEPATAGONIA — Congreso</title>
  <meta name="description" content="Congreso de capacitación profesional en estética regenerativa y biotecnología aplicada." />

  <style>
    :root{
      --bg:#070a0f; --text:rgba(255,255,255,.92);
      --muted:rgba(255,255,255,.70); --muted2:rgba(255,255,255,.58);
      --line:rgba(255,255,255,.12); --panel:rgba(255,255,255,.05);
      --a1:#52ffd6; --a2:#7aa7ff; --r:18px; --max:1160px;
      --pad:clamp(18px,3vw,28px);
    }
    *{box-sizing:border-box} body{margin:0;font-family:system-ui,-apple-system,Segoe UI,Roboto,Arial;color:var(--text);
      background:radial-gradient(1200px 700px at 15% 10%, rgba(82,255,214,.12), transparent 55%),
                 radial-gradient(900px 650px at 85% 15%, rgba(122,167,255,.12), transparent 55%),
                 var(--bg);
      line-height:1.35; overflow-x:hidden;
    }
    a{color:inherit;text-decoration:none}
    .container{width:min(var(--max), calc(100% - (var(--pad)*2))); margin:0 auto;}
    .nav{position:sticky;top:0;z-index:50;backdrop-filter:blur(12px);background:rgba(7,10,15,.55);border-bottom:1px solid var(--line);}
    .nav-inner{display:flex;align-items:center;justify-content:space-between;gap:14px;padding:14px 0;}
    .brand{display:flex;align-items:center;gap:12px;letter-spacing:.16em;text-transform:uppercase;font-weight:700;font-size:12px;}
    .mark{width:34px;height:34px;border-radius:12px;background:
      radial-gradient(18px 18px at 30% 30%, rgba(82,255,214,.85), transparent 60%),
      radial-gradient(20px 20px at 70% 65%, rgba(122,167,255,.85), transparent 65%),
      rgba(255,255,255,.06); border:1px solid rgba(255,255,255,.10);
    }
    .btn{display:inline-flex;align-items:center;justify-content:center;gap:10px;padding:12px 14px;border-radius:14px;
      border:1px solid rgba(255,255,255,.14); background:rgba(255,255,255,.06); color:var(--text);
      font-weight:650;font-size:13px; cursor:pointer; user-select:none; white-space:nowrap;
    }
    .btn-primary{border-color:rgba(82,255,214,.40); background:linear-gradient(135deg, rgba(82,255,214,.18), rgba(122,167,255,.12));}
    .btn-ghost{background:transparent;border-color:rgba(255,255,255,.12);color:var(--muted);}
    .nav-links{display:flex;gap:18px;align-items:center;font-size:13px;color:var(--muted);}
    .nav-links a{padding:10px 10px;border-radius:12px;border:1px solid transparent;}
    .nav-links a:hover{background:rgba(255,255,255,.05);border-color:rgba(255,255,255,.08);color:var(--text);}
    .hamburger{display:none;}
    .mobile{display:none;border-top:1px solid var(--line);padding:10px 0 16px;}
    .mobile a{display:block;padding:10px 8px;color:var(--muted);}
    .mobile a:hover{color:var(--text);background:rgba(255,255,255,.05);border-radius:12px;}

    header{padding:clamp(54px,7vw,92px) 0 44px;}
    .kicker{display:inline-flex;gap:10px;align-items:center;padding:8px 12px;border-radius:999px;border:1px solid rgba(255,255,255,.14);
      background:rgba(255,255,255,.05);color:var(--muted);font-size:12px;letter-spacing:.10em;text-transform:uppercase;}
    .dot{width:8px;height:8px;border-radius:99px;background:var(--a1);box-shadow:0 0 20px rgba(82,255,214,.55);}
    h1{margin:18px 0 10px;font-size:clamp(34px,4.8vw,58px);line-height:1.02;letter-spacing:-.02em;text-transform:uppercase;}
    .sub{color:var(--muted);font-size:clamp(16px,1.5vw,18px);max-width:64ch;margin:12px 0 22px;}
    section{padding:58px 0;border-top:1px solid var(--line);}
    .section-head{display:flex;align-items:flex-end;justify-content:space-between;gap:18px;margin-bottom:22px;}
    .section-head h2{margin:0;font-size:18px;letter-spacing:.18em;text-transform:uppercase;color:var(--muted);}
    .section-head p{margin:0;color:var(--muted2);max-width:72ch;font-size:13.5px;}
    .grid3{display:grid;grid-template-columns:repeat(3,1fr);gap:14px;}
    .grid2{display:grid;grid-template-columns:repeat(2,1fr);gap:14px;}
    .card{border-radius:var(--r);border:1px solid rgba(255,255,255,.12);background:rgba(255,255,255,.04);padding:18px;}
    .card h3{margin:0 0 8px;font-size:14px;letter-spacing:.10em;text-transform:uppercase;}
    .card p{margin:0;color:var(--muted);font-size:13.5px;}
    .tag{display:inline-flex;align-items:center;gap:8px;padding:8px 10px;border-radius:999px;
      border:1px solid rgba(82,255,214,.22); background:rgba(82,255,214,.08); color:rgba(82,255,214,.92); font-size:12px;}
    details{border-radius:16px;border:1px solid rgba(255,255,255,.12);background:rgba(255,255,255,.03);padding:14px 16px;}
    details + details{margin-top:10px;}
    summary{cursor:pointer;font-weight:800;color:var(--text);list-style:none;}
    summary::-webkit-details-marker{display:none;}
    ul{margin:10px 0 0;padding-left:18px;color:var(--muted);font-size:13.5px;}
    .muted{color:var(--muted2);font-size:13px;}
    footer{padding:28px 0 44px;color:var(--muted2);}

    @media (max-width:920px){
      .grid3,.grid2{grid-template-columns:1fr;}
      .nav-links{display:none;}
      .hamburger{display:inline-flex;}
      .mobile{display:block;}
      .mobile[hidden]{display:none;}
    }
  </style>
</head>

<body>
  <div class="nav">
    <div class="container">
      <div class="nav-inner">
        <div class="brand">
          <div class="mark" aria-hidden="true"></div>
          <div>
            CEPATAGONIA<br/>
            <span style="color:var(--muted);font-weight:560;letter-spacing:.20em;">CONGRESO</span>
          </div>
        </div>

        <nav class="nav-links" aria-label="Navegación">
          <a href="#diferenciales">Diferenciales</a>
          <a href="#ejes">Ejes</a>
          <a href="#speakers">Speakers</a>
          <a href="#dirigido">Dirigido a</a>
        </nav>

        <div style="display:flex;gap:10px;align-items:center;">
          <button class="btn btn-ghost hamburger" id="menuBtn" aria-expanded="false" aria-controls="mobileMenu">Menú</button>
          <a class="btn btn-primary" href="#entradas">Entradas</a>
        </div>
      </div>

      <div class="mobile" id="mobileMenu" hidden>
        <a href="#diferenciales">Diferenciales</a>
        <a href="#ejes">Ejes</a>
        <a href="#speakers">Speakers</a>
        <a href="#dirigido">Dirigido a</a>
        <a href="#entradas">Entradas</a>
      </div>
    </div>
  </div>

  <header>
    <div class="container">
      <div class="kicker"><span class="dot"></span> Capacitación profesional • tecnología • innovación</div>
      <h1 id="heroTitle">CEPATAGONIA</h1>
      <p class="sub" id="heroSubtitle"></p>
      <div style="display:flex;gap:12px;flex-wrap:wrap;">
        <a class="btn btn-primary" href="#ejes">Ver ejes</a>
        <a class="btn" href="#speakers">Ver speakers</a>
        <a class="btn btn-ghost" href="#dirigido">¿A quién está dirigido?</a>
      </div>
      <p class="muted" id="heroTagline" style="margin-top:16px;"></p>
    </div>
  </header>

  <section id="diferenciales">
    <div class="container">
      <div class="section-head">
        <div>
          <h2>Diferenciales</h2>
          <p>Innovación y tecnología como núcleo. Patagonia como marco estratégico.</p>
        </div>
      </div>
      <div class="grid3" id="diferencialesGrid"></div>
    </div>
  </section>

  <section id="ejes">
    <div class="container">
      <div class="section-head">
        <div>
          <h2>Ejes académicos</h2>
          <p>Programa organizado por ejes temáticos (regeneración, biotecnología, innovación y gestión).</p>
        </div>
      </div>
      <div id="ejesList"></div>
    </div>
  </section>

  <section id="speakers">
    <div class="container">
      <div class="section-head">
        <div>
          <h2>Speakers</h2>
          <p>Listado completo con disertación y puntos clave para decidir rápido.</p>
        </div>
      </div>
      <div class="grid2" id="speakersGrid"></div>
    </div>
  </section>

  <section id="dirigido">
    <div class="container">
      <div class="section-head">
        <div>
          <h2>Dirigido a</h2>
          <p>Perfil profesional al que apunta el congreso.</p>
        </div>
      </div>
      <div class="card">
        <div class="tag">Perfil</div>
        <ul id="dirigidoList"></ul>
      </div>
    </div>
  </section>

  <section id="entradas">
    <div class="container">
      <div class="section-head">
        <div>
          <h2>Entradas</h2>
          <p>Dejá acá el link real de compra (Eventbrite / MP / etc.).</p>
        </div>
      </div>
      <div class="card">
        <p class="muted">Link de compra: <b>pendiente</b></p>
        <a class="btn btn-primary" href="#" onclick="alert('Pegá tu link real acá');return false;">Comprar</a>
      </div>
    </div>
  </section>

  <footer>
    <div class="container">
      <div class="muted">© <span id="year"></span> CEPATAGONIA — Ciencia. Innovación. Naturaleza.</div>
    </div>
  </footer>

  <script src="./data.js"></script>
  <script>
    // Menu mobile
    const btn = document.getElementById('menuBtn');
    const menu = document.getElementById('mobileMenu');
    if(btn && menu){
      btn.addEventListener('click', () => {
        const isOpen = btn.getAttribute('aria-expanded') === 'true';
        btn.setAttribute('aria-expanded', String(!isOpen));
        menu.hidden = isOpen;
      });
      menu.querySelectorAll('a').forEach(a => a.addEventListener('click', () => {
        btn.setAttribute('aria-expanded','false');
        menu.hidden = true;
      }));
    }

    // Render
    const CEP = window.CEP;

    document.getElementById('year').textContent = new Date().getFullYear();
    document.getElementById('heroTitle').textContent = `${CEP.meta.title} — ${CEP.meta.subtitle}`;
    document.getElementById('heroSubtitle').textContent =
      "Programa académico de alto nivel: ciencia, biotecnología aplicada, tecnologías no invasivas e inteligencia regenerativa.";
    document.getElementById('heroTagline').textContent = CEP.meta.tagline;

    // Diferenciales
    const difGrid = document.getElementById('diferencialesGrid');
    difGrid.innerHTML = CEP.diferenciales.map(d => `
      <div class="card">
        <div class="tag">${d.icon} ${d.title}</div>
        <p style="margin-top:10px;">${d.desc}</p>
      </div>
    `).join('');

    // Ejes
    const ejesList = document.getElementById('ejesList');
    ejesList.innerHTML = CEP.ejes.map(e => `
      <details>
        <summary>${e.eje} — ${e.titulo}</summary>
        <div class="muted" style="margin-top:8px;">Speakers y contenidos</div>
        ${e.speakers.map(s => `
          <div class="card" style="margin-top:12px;">
            <h3 style="margin:0 0 6px;">${s.nombre}</h3>
            <p class="muted">${s.credenciales || ""}</p>
            <p style="margin-top:10px;"><b>Disertación:</b> ${s.disertacion}</p>
            ${Array.isArray(s.bullets) ? `<ul>${s.bullets.map(b=>`<li>${b}</li>`).join('')}</ul>` : ""}
            ${s.extraTitle ? `
              <div class="tag" style="margin-top:12px;">${s.extraTitle}</div>
              <ul>${(s.extraBullets||[]).map(b=>`<li>${b}</li>`).join('')}</ul>
            ` : ""}
          </div>
        `).join('')}
      </details>
    `).join('');

    // Speakers (flatten)
    const speakers = CEP.ejes.flatMap(e => e.speakers.map(s => ({...s, eje: e.eje, tema: e.titulo})));
    const spGrid = document.getElementById('speakersGrid');
    spGrid.innerHTML = speakers.map(s => `
      <div class="card">
        <div class="tag">${s.eje} • ${s.tema}</div>
        <h3 style="margin-top:12px;">${s.nombre}</h3>
        ${s.credenciales ? `<p class="muted" style="margin-top:6px;">${s.credenciales}</p>` : ""}
        <p style="margin-top:10px;"><b>Disertación:</b> ${s.disertacion}</p>
        ${Array.isArray(s.bullets) ? `<ul>${s.bullets.slice(0,4).map(b=>`<li>${b}</li>`).join('')}</ul>` : ""}
      </div>
    `).join('');

    // Dirigido a
    const dir = document.getElementById('dirigidoList');
    dir.innerHTML = CEP.dirigidoA.map(x => `<li>${x}</li>`).join('');
  </script>
</body>
</html>
