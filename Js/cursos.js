// ====== Filtro por categoria ======
(function(){
  const chips = document.querySelectorAll('.filters .chip');
  const items = document.querySelectorAll('.gallery .card-course');

  chips.forEach(chip=>{
    chip.addEventListener('click', ()=>{
      chips.forEach(c=>c.classList.remove('active'));
      chip.classList.add('active');

      const filter = chip.dataset.filter || '*';
      items.forEach(item=>{
        const tags = (item.getAttribute('data-tags') || '').toLowerCase();
        const show = filter === '*' ? true : tags.includes(filter);
        item.style.display = show ? '' : 'none';
      });
    });
    chip.setAttribute('role','button');
    chip.setAttribute('tabindex','0');
    chip.addEventListener('keydown', e=>{
      if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); chip.click(); }
    });
  });
})();

// ====== Lightbox (com legenda) ======
(function(){
  const list = Array.from(document.querySelectorAll('.gallery a'));
  if (!list.length) return;

  // cria DOM do lightbox
  const box = document.createElement('div');
  box.className = 'lightbox';
  box.innerHTML = `
    <div class="frame" role="dialog" aria-modal="true" aria-labelledby="lbTitle">
      <button class="btn-close" aria-label="Fechar (Esc)">✕</button>
      <div class="ctrls">
        <button class="btn-ctrl prev" aria-label="Anterior">‹</button>
        <button class="btn-ctrl next" aria-label="Próximo">›</button>
      </div>
      <div class="media"><img alt=""></div>
      <div class="legend">
        <div class="title" id="lbTitle"></div>
        <div class="meta"></div>
        <div class="caption" id="lbCaption"></div>
      </div>
    </div>`;
  document.body.appendChild(box);

  const img = box.querySelector('img');
  const titleEl = box.querySelector('.legend .title');
  const metaEl = box.querySelector('.legend .meta');
  const captionEl = box.querySelector('.legend .caption');
  const btnClose = box.querySelector('.btn-close');
  const btnPrev = box.querySelector('.prev');
  const btnNext = box.querySelector('.next');
  let index = 0, lastFocus = null;

  function open(i){
    index = i;
    const a = list[index];
    const card = a.closest('.card-course');

    const title   = card?.querySelector('.title')?.textContent?.trim()
                 || a.querySelector('img')?.alt
                 || 'Curso';
    const caption = a.getAttribute('data-caption')
                 || a.querySelector('img')?.alt
                 || '';
    const tag     = card?.querySelector('.pill')?.textContent?.trim() || '';

    img.src = a.getAttribute('href');
    img.alt = title;

    titleEl.textContent = title;
    metaEl.textContent = tag;
    captionEl.textContent = caption; // mantém seguro e aceita quebras com CSS (pre-wrap)

    box.classList.add('open');
    lastFocus = document.activeElement;
    btnClose.focus();
    document.body.style.overflow = 'hidden';
  }

  function close(){
    box.classList.remove('open');
    img.src = '';
    document.body.style.overflow = '';
    if (lastFocus) lastFocus.focus();
  }
  function prev(){ open((index - 1 + list.length) % list.length); }
  function next(){ open((index + 1) % list.length); }

  list.forEach((a, i)=>{
    a.addEventListener('click', (e)=>{ e.preventDefault(); open(i); });
  });
  btnClose.addEventListener('click', close);
  btnPrev.addEventListener('click', prev);
  btnNext.addEventListener('click', next);
  box.addEventListener('click', (e)=>{ if (e.target === box) close(); });
  document.addEventListener('keydown', (e)=>{
    if (!box.classList.contains('open')) return;
    if (e.key === 'Escape') close();
    if (e.key === 'ArrowLeft') prev();
    if (e.key === 'ArrowRight') next();
  });
})();