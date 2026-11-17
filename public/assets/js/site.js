// Abas da galeria de capturas (com setas do teclado, como pede o ARIA).
document.querySelectorAll('[role="tablist"]').forEach((list) => {
  const tabs = [...list.querySelectorAll('[role="tab"]')];
  const select = (tab) => {
    tabs.forEach((t) => {
      const on = t === tab;
      t.setAttribute('aria-selected', on);
      t.tabIndex = on ? 0 : -1;
      document.getElementById(t.getAttribute('aria-controls')).hidden = !on;
    });
  };
  tabs.forEach((tab, i) => {
    tab.tabIndex = i === 0 ? 0 : -1;
    tab.addEventListener('click', () => select(tab));
    tab.addEventListener('keydown', (e) => {
      const d = { ArrowRight: 1, ArrowLeft: -1 }[e.key];
      if (!d) return;
      const next = tabs[(i + d + tabs.length) % tabs.length];
      select(next);
      next.focus();
    });
  });
});

// Botões "Copiar" (código PIX e chave): troca o texto por um instante.
document.querySelectorAll('button.copy').forEach((btn) => {
  const label = btn.textContent;
  btn.addEventListener('click', async () => {
    const text = btn.dataset.copy;
    try {
      await navigator.clipboard.writeText(text);
    } catch {
      // Sem a API (página sem HTTPS): seleciona num campo temporário.
      const area = document.createElement('textarea');
      area.value = text;
      document.body.append(area);
      area.select();
      document.execCommand('copy');
      area.remove();
    }
    btn.textContent = btn.dataset.done;
    const live = document.getElementById('live');
    if (live) live.textContent = btn.dataset.done;
    setTimeout(() => { btn.textContent = label; }, 2000);
  });
});

// Menu do celular: abre/fecha, fecha ao escolher um link ou com Esc.
const nav = document.querySelector('.nav');
const menuBtn = nav && nav.querySelector('.menu');
if (menuBtn) {
  const setOpen = (open) => {
    nav.classList.toggle('open', open);
    menuBtn.setAttribute('aria-expanded', open);
    menuBtn.setAttribute('aria-label', open ? menuBtn.dataset.close : menuBtn.dataset.open);
  };
  menuBtn.addEventListener('click', () => setOpen(!nav.classList.contains('open')));
  nav.querySelectorAll('ul a').forEach((a) => a.addEventListener('click', () => setOpen(false)));
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && nav.classList.contains('open')) { setOpen(false); menuBtn.focus(); }
  });
}

// Destaca no menu a seção que está na tela.
const links = new Map([...document.querySelectorAll('.nav ul a[href^="#"]')]
  .map((a) => [a.getAttribute('href').slice(1), a]));
if ('IntersectionObserver' in window && links.size) {
  const io = new IntersectionObserver((entries) => {
    entries.forEach((en) => {
      if (!en.isIntersecting) return;
      links.forEach((a) => a.removeAttribute('aria-current'));
      const a = links.get(en.target.id);
      if (a) a.setAttribute('aria-current', 'true');
    });
  }, { rootMargin: '-45% 0px -50% 0px' });
  links.forEach((_, id) => { const s = document.getElementById(id); if (s) io.observe(s); });
}
