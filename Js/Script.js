const $ = (sel, ctx=document) => ctx.querySelector(sel);
const $$ = (sel, ctx=document) => Array.from(ctx.querySelectorAll(sel));

document.addEventListener('DOMContentLoaded', () => {
  // Year
  const y = $('#y'); if (y) y.textContent = new Date().getFullYear();

  // ===== Mobile Menu (com rótulo dinâmico) ================================
  const nav = $('#site-nav');
  const btn = $('.menu-toggle');
  let backdrop;

  const setMenuLabel = () => { if (btn) btn.textContent = nav?.classList.contains('open') ? 'Fechar' : 'Menu'; };

  const closeMenu = () => {
    if (!nav) return;
    nav.classList.remove('open');
    btn && btn.setAttribute('aria-expanded', 'false');
    backdrop && backdrop.remove(); backdrop = null;
    document.body.style.overflow = '';
    setMenuLabel();
  };
  const openMenu = () => {
    if (!nav) return;
    nav.classList.add('open');
    btn && btn.setAttribute('aria-expanded', 'true');
    backdrop = document.createElement('div');
    backdrop.className = 'nav-backdrop';
    Object.assign(backdrop.style, {
      position:'fixed', inset:'var(--header-h) 0 0 0', background:'rgba(0,0,0,.4)', zIndex:9
    });
    backdrop.addEventListener('click', closeMenu);
    document.body.appendChild(backdrop);
    document.body.style.overflow = 'hidden';
    setMenuLabel();
  };
  btn && btn.addEventListener('click', () => {
    nav && nav.classList.contains('open') ? closeMenu() : openMenu();
  });
  // Close on ESC / link click
  document.addEventListener('keydown', (e) => { if (e.key === 'Escape') closeMenu(); });
  $$('#site-nav a').forEach(a => a.addEventListener('click', closeMenu));
  setMenuLabel(); // define o rótulo correto ao carregar

  // ===== Buttons: WhatsApp / Email ========================================
  const telAnchor = $('#telLink');
  const mailAnchor = $('#mailLink');
  const parsePhone = (raw='') => raw.replace(/[^\d]/g,''); // numbers only

  const openWhatsApp = () => {
    const phoneHref = telAnchor?.getAttribute('href') || '';
    const phone = parsePhone(phoneHref.replace('tel:', '')) || '5575983130394';
    const text = encodeURIComponent('Olá! Vim pelo seu portfólio e gostaria de conversar.');
    window.open(`https://wa.me/${phone}?text=${text}`, '_blank', 'noopener');
  };
  $('#btnWpp')?.addEventListener('click', openWhatsApp);
  $('#btnWpp2')?.addEventListener('click', openWhatsApp);

  $('#btnMail')?.addEventListener('click', () => {
    const mail = (mailAnchor?.getAttribute('href') || '').replace('mailto:','') || 'contato@exemplo.com';
    window.location.href = `mailto:${mail}?subject=Contato%20-%20Portf%C3%B3lio`;
  });

  // Copy helpers
  const copy = async (text) => {
    try { await navigator.clipboard.writeText(text); toast('Copiado!'); }
    catch { alert('Não foi possível copiar.'); }
  };
  $('#btnCopyMail')?.addEventListener('click', () => {
    const mail = mailAnchor?.textContent?.trim() || 'contato@exemplo.com';
    copy(mail);
  });
  $('#btnCopyTel')?.addEventListener('click', () => {
    const tel = telAnchor?.textContent?.trim() || '+55 (00) 0000-0000';
    copy(tel);
  });

  // Simple toast
  function toast(msg='OK'){
    const el = document.createElement('div');
    el.textContent = msg;
    Object.assign(el.style, {
      position:'fixed', left:'50%', bottom:'22px', transform:'translateX(-50%)',
      padding:'10px 14px', borderRadius:'12px', color:'#071018',
      background:'linear-gradient(90deg,#00f0ff,#7c4dff)', fontWeight:'700',
      zIndex:9999, boxShadow:'0 10px 30px rgba(0,0,0,.35)'
    });
    document.body.appendChild(el);
    setTimeout(()=> el.remove(), 1800);
  }

  // ===== Reveal on scroll (IntersectionObserver) ===========================
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (!reduceMotion && 'IntersectionObserver' in window){
    const io = new IntersectionObserver((entries)=>{
      entries.forEach(e=>{
        if (e.isIntersecting){ e.target.classList.add('visible'); io.unobserve(e.target); }
      });
    }, {rootMargin:'-10% 0px -10% 0px', threshold:.15});
    $$('.reveal').forEach(el=> io.observe(el));
  } else {
    $$('.reveal').forEach(el=> el.classList.add('visible'));
  }

  // ===== Counters ==========================================================
  const animateCounter = (el) => {
    const textNum = parseInt((el.textContent || '').replace(/[^\d]/g,''), 10);
    const dataNum = parseInt(el.dataset.count || '0', 10);
    const target = Number.isFinite(dataNum) && dataNum>0 ? dataNum : (Number.isFinite(textNum) ? textNum : 0);
    if (!target || reduceMotion){ el.textContent = formatNum(target); return; }

    const dur = 1200; const start = performance.now();
    const from = 0;
    const step = (t) => {
      const p = Math.min(1, (t - start) / dur);
      const ease = 1 - Math.pow(1 - p, 3);
      const val = Math.round(from + (target - from) * ease);
      el.textContent = formatNum(val);
      if (p < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  };
  const formatNum = (n) => n.toLocaleString('pt-BR');
  $$('.stat b').forEach(animateCounter);

  // ===== Filter by Skill (chips) ===========================================
  const cards = $$('#experiencia .card[data-timeline]');
  const chips = $$('.chip');
  chips.forEach(chip=>{
    chip.addEventListener('click', ()=>{
      const isActive = chip.classList.toggle('active');
      // single-select: deactivate others
      chips.forEach(c=> { if (c!==chip) c.classList.remove('active'); });
      const skill = isActive ? (chip.dataset.skill || '').toLowerCase() : '';
      if (!skill){
        cards.forEach(c=> c.style.display = '');
        return;
      }
      cards.forEach(c=>{
        const tags = (c.dataset.tags || '').toLowerCase();
        c.style.display = tags.includes(skill) ? '' : 'none';
      });
    });
    chip.addEventListener('keydown', (e)=>{
      if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); chip.click(); }
    });
    chip.setAttribute('tabindex','0');
    chip.setAttribute('role','button');
    chip.setAttribute('aria-pressed','false');
    chip.addEventListener('click',()=> chip.setAttribute('aria-pressed', chip.classList.contains('active')?'true':'false'));
  });

  // ===== Improve internal anchors =========================================
  $$('a[href^="#"]').forEach(a=>{
    a.addEventListener('click', (e)=>{
      const id = a.getAttribute('href');
      if (!id || id === '#') return;
      const target = $(id);
      if (!target) return;
      e.preventDefault();
      target.scrollIntoView({behavior: reduceMotion ? 'auto' : 'smooth', block:'start'});
    });
  });

  // ===== PDF links: ensure download attribute ==============================
  $$('a[href$=".pdf"]').forEach(a=> a.setAttribute('download',''));
});

/* =================== Ripple em botões =================== */
(function initRipples(){
  const addRipple = (e) => {
    const target = e.currentTarget;
    const rect = target.getBoundingClientRect();
    const r = Math.max(rect.width, rect.height) * 0.5;
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const span = document.createElement('span');
    span.className = 'ripple';
    span.style.width = span.style.height = `${r * 2}px`;
    span.style.left = `${x}px`;
    span.style.top  = `${y}px`;
    target.appendChild(span);
    setTimeout(()=> span.remove(), 650);
  };

  const candidates = document.querySelectorAll('.btn, .cta, .chip');
  candidates.forEach(el=>{
    el.style.position = getComputedStyle(el).position === 'static' ? 'relative' : getComputedStyle(el).position;
    el.addEventListener('pointerdown', addRipple, {passive:true});
  });
})();

/* =================== Canvas Tech Background =================== */
(function techBackground(){
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const canvas = document.getElementById('techbg');
  if (!canvas) return;
  if (reduceMotion){ canvas.style.display = 'none'; return; }

  const ctx = canvas.getContext('2d');
  let w, h, dpr, nodes = [], mouse = {x:0, y:0, active:false};
  const styles = getComputedStyle(document.documentElement);
  const C1 = styles.getPropertyValue('--c1').trim() || '#00f0ff';
  const C2 = styles.getPropertyValue('--c2').trim() || '#7c4dff';

  const rand = (min, max) => Math.random() * (max - min) + min;
  const dist2 = (a, b) => {
    const dx = a.x - b.x, dy = a.y - b.y; return dx*dx + dy*dy;
  };

  function resize(){
    dpr = Math.max(1, Math.min(2, window.devicePixelRatio || 1));
    w = canvas.width = Math.floor(innerWidth  * dpr);
    h = canvas.height = Math.floor(innerHeight * dpr);
    canvas.style.width = innerWidth + 'px';
    canvas.style.height = innerHeight + 'px';

    // densidade proporcional à tela
    const target = Math.round((innerWidth * innerHeight) / 22000);
    const count = Math.max(40, Math.min(160, target));

    nodes = Array.from({length: count}, ()=> ({
      x: rand(0, w), y: rand(0, h),
      vx: rand(-.12, .12) * dpr,
      vy: rand(-.12, .12) * dpr,
      r: rand(1.2, 2.2) * dpr
    }));
  }

  function step(){
    ctx.clearRect(0,0,w,h);

    // desenha conexões
    const maxDist2 = (140 * dpr) ** 2;
    for (let i=0; i<nodes.length; i++){
      const a = nodes[i];

      // update
      a.x += a.vx; a.y += a.vy;

      // parallax leve em direção ao mouse
      if (mouse.active){
        a.x += (mouse.x - a.x) * 0.00004 * dpr;
        a.y += (mouse.y - a.y) * 0.00004 * dpr;
      }

      // bordas
      if (a.x < 0 || a.x > w) a.vx *= -1;
      if (a.y < 0 || a.y > h) a.vy *= -1;

      // ponto
      ctx.beginPath();
      ctx.arc(a.x, a.y, a.r, 0, Math.PI*2);
      const g = ctx.createRadialGradient(a.x, a.y, 0, a.x, a.y, a.r*2);
      g.addColorStop(0, C1 + 'AA'); g.addColorStop(1, C2 + '00');
      ctx.fillStyle = g; ctx.fill();

      // linhas
      for (let j=i+1; j<nodes.length; j++){
        const b = nodes[j];
        const d2 = dist2(a, b);
        if (d2 < maxDist2){
          const alpha = 1 - (d2 / maxDist2);
          ctx.beginPath();
          ctx.moveTo(a.x, a.y); ctx.lineTo(b.x, b.y);
          ctx.strokeStyle = `rgba(0, 240, 255, ${alpha * 0.6})`;
          ctx.lineWidth = Math.max(0.6, 1.4 * alpha) * dpr;
          ctx.stroke();
        }
      }
    }

    raf = requestAnimationFrame(step);
  }

  let raf = null;
  function start(){ if (!raf) raf = requestAnimationFrame(step); }
  function stop(){ if (raf) { cancelAnimationFrame(raf); raf = null; } }

  // eventos
  window.addEventListener('resize', resize);
  window.addEventListener('mouseenter', start);
  window.addEventListener('focus', start);
  window.addEventListener('mouseleave', stop);
  window.addEventListener('blur', stop);
  window.addEventListener('pointermove', (e)=>{
    const rect = canvas.getBoundingClientRect();
    mouse.x = (e.clientX - rect.left) * dpr;
    mouse.y = (e.clientY - rect.top)  * dpr;
    mouse.active = true;
  });

  // init
  resize();
  start();
})();