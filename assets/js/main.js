(() => {
  const $ = (s, root = document) => root.querySelector(s);
  const $$ = (s, root = document) => [...root.querySelectorAll(s)];
  const config = window.PORTFOLIO_CONFIG || {};

  const header = $('.site-header');
  const nav = $('.main-nav');
  const navToggle = $('.nav-toggle');
  const themeToggle = $('.theme-toggle');
  const toast = $('#toast');
  const copyButton = $('#copyMessage');
  const formNote = $('#formNote');
  let preparedMessage = '';

  const showToast = (message) => {
    toast.textContent = message;
    toast.classList.add('show');
    window.setTimeout(() => toast.classList.remove('show'), 2600);
  };

  window.addEventListener('scroll', () => header.classList.toggle('scrolled', window.scrollY > 20));

  navToggle?.addEventListener('click', () => {
    const open = nav.classList.toggle('open');
    navToggle.setAttribute('aria-expanded', String(open));
  });
  $$('.main-nav a').forEach(a => a.addEventListener('click', () => nav.classList.remove('open')));

  const savedTheme = localStorage.getItem('portfolio-theme');
  if (savedTheme) document.documentElement.dataset.theme = savedTheme;
  themeToggle?.addEventListener('click', () => {
    const next = document.documentElement.dataset.theme === 'dark' ? 'light' : 'dark';
    document.documentElement.dataset.theme = next;
    localStorage.setItem('portfolio-theme', next);
  });

  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => entry.isIntersecting && entry.target.classList.add('visible'));
  }, { threshold: .12 });
  $$('.reveal').forEach(el => observer.observe(el));

  $('#year').textContent = new Date().getFullYear();

  const socials = $('#socialLinks');
  const socialItems = [
    ['Email', config.email ? `mailto:${config.email}` : ''],
    ['WhatsApp', config.whatsapp ? `https://wa.me/${config.whatsapp}` : ''],
    ['GitHub', config.github || ''],
    ['LinkedIn', config.linkedin || '']
  ].filter(([, url]) => url);
  socialItems.forEach(([label, url]) => {
    const a = document.createElement('a');
    a.href = url;
    a.textContent = label;
    if (url.startsWith('http')) { a.target = '_blank'; a.rel = 'noopener'; }
    socials.appendChild(a);
  });
  if (!socialItems.length) socials.innerHTML = '<span style="color:var(--muted);font-size:.8rem">Coordonnées à configurer</span>';
  if (formNote && config.whatsapp) formNote.textContent = 'Votre demande sera ouverte directement dans WhatsApp.';

  $('#contactForm')?.addEventListener('submit', (event) => {
    event.preventDefault();
    const name = $('#name').value.trim();
    const business = $('#business').value.trim();
    const projectType = $('#projectType').value;
    const details = $('#message').value.trim();
    preparedMessage = `Bonjour Ismail, je m'appelle ${name}. Mon activité: ${business}. Je souhaite discuter d'un projet: ${projectType}. Détails: ${details}`;

    if (config.whatsapp) {
      window.open(`https://wa.me/${config.whatsapp}?text=${encodeURIComponent(preparedMessage)}`, '_blank', 'noopener');
      showToast('Ouverture de WhatsApp...');
    } else if (config.email) {
      window.location.href = `mailto:${config.email}?subject=${encodeURIComponent('Demande de projet web')}&body=${encodeURIComponent(preparedMessage)}`;
      showToast('Ouverture de votre messagerie...');
    } else {
      copyButton.classList.remove('hidden');
      showToast('Message préparé. Ajoutez vos coordonnées ou copiez-le.');
    }
  });

  copyButton?.addEventListener('click', async () => {
    try {
      await navigator.clipboard.writeText(preparedMessage);
      showToast('Message copié.');
    } catch {
      showToast('Copie impossible. Sélectionnez le texte manuellement.');
    }
  });
})();
