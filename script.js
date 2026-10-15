
(() => {
  const body = document.body;
  const menuIcon = document.querySelector('#menu-icon');
  const navbar = document.querySelector('.navbar');
  const themeButton = document.querySelector('#dark-mode-btn');
  const progress = document.querySelector('.scroll-progress');
  const header = document.querySelector('.header');

  // Restore the visitor's chosen appearance.
  if (localStorage.getItem('darkMode') === 'active') body.classList.add('dark-mode');
  themeButton?.setAttribute('aria-label', 'Toggle light and dark theme');
  themeButton?.addEventListener('click', () => {
    body.classList.toggle('dark-mode');
    localStorage.setItem('darkMode', body.classList.contains('dark-mode') ? 'active' : 'inactive');
  });

  // Mobile navigation.
  menuIcon?.setAttribute('aria-label', 'Open navigation');
  menuIcon?.setAttribute('role', 'button');
  menuIcon?.setAttribute('tabindex', '0');
  const toggleMenu = () => {
    const opened = navbar?.classList.toggle('active');
    menuIcon.classList.toggle('bx-x', !!opened);
    menuIcon.classList.toggle('bx-menu', !opened);
    menuIcon.setAttribute('aria-label', opened ? 'Close navigation' : 'Open navigation');
  };
  menuIcon?.addEventListener('click', toggleMenu);
  menuIcon?.addEventListener('keydown', e => {
    if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); toggleMenu(); }
  });
  navbar?.querySelectorAll('a').forEach(link => link.addEventListener('click', () => {
    navbar.classList.remove('active');
    menuIcon?.classList.add('bx-menu');
    menuIcon?.classList.remove('bx-x');
  }));

  // Scroll progress, sticky header, active section, back-to-top.
  const backTop = document.createElement('button');
  backTop.id = 'back-to-top';
  backTop.type = 'button';
  backTop.innerHTML = '<i class="bx bx-up-arrow-alt" aria-hidden="true"></i>';
  backTop.setAttribute('aria-label', 'Back to top');
  body.appendChild(backTop);
  backTop.addEventListener('click', () => window.scrollTo({top: 0, behavior: 'smooth'}));

  const sections = [...document.querySelectorAll('section[id]')];
  const navLinks = [...document.querySelectorAll('.navbar a')];
  const onScroll = () => {
    const max = document.documentElement.scrollHeight - window.innerHeight;
    if (progress) progress.style.width = `${max > 0 ? (window.scrollY / max) * 100 : 0}%`;
    header?.classList.toggle('sticky', window.scrollY > 24);
    backTop.classList.toggle('visible', window.scrollY > 650);
    let current = 'home';
    sections.forEach(section => { if (window.scrollY >= section.offsetTop - 190) current = section.id; });
    navLinks.forEach(link => link.classList.toggle('active', link.getAttribute('href') === `#${current}`));
  };
  window.addEventListener('scroll', onScroll, {passive: true});
  onScroll();

  // Reveal content as it enters the viewport.
  const revealTargets = document.querySelectorAll(
    'section > .heading, .about-img, .about-content, .timeline-item, .services-box, .certificate-container, .work-items, .work1-items, .contact form'
  );
  revealTargets.forEach((el, i) => {
    el.classList.add('reveal');
    if (el.matches('.work-items,.work1-items,.services-box')) el.style.transitionDelay = `${(i % 4) * 65}ms`;
  });
  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target);
        }
      });
    }, {threshold: 0.12, rootMargin: '0px 0px -35px 0px'});
    revealTargets.forEach(el => observer.observe(el));
  } else revealTargets.forEach(el => el.classList.add('is-visible'));
  // Never leave key profile imagery hidden if an observer is interrupted or unsupported.
  window.setTimeout(() => {
    document.querySelectorAll('.home-img,.about-img,.brand-mark,.logo').forEach(el => {
      el.style.opacity = '1';
      el.style.visibility = 'visible';
    });
    document.querySelectorAll('.about-img.reveal,.home-img.reveal').forEach(el => el.classList.add('is-visible'));
  }, 900);

  // Certificate slider controls.
  window.scrollToSlide = index => {
    const box = document.querySelector('.certificate-box');
    if (!box) return;
    box.scrollTo({left: box.clientWidth * index, behavior: 'smooth'});
  };

  // Click a design image to inspect it in a clean, keyboard-accessible viewer.
  const viewer = document.createElement('div');
  viewer.className = 'image-viewer';
  viewer.innerHTML = '<button class="image-viewer-close" aria-label="Close image viewer">&times;</button><img alt="Expanded portfolio work"><p>PORTFOLIO / SELECTED WORK</p>';
  Object.assign(viewer.style, {
    position:'fixed', inset:'0', zIndex:'3000', display:'none', alignItems:'center',
    justifyContent:'center', flexDirection:'column', gap:'1.2rem', padding:'5rem 2rem 2rem',
    background:'rgba(5,5,9,.94)', backdropFilter:'blur(18px)'
  });
  const viewerImage = viewer.querySelector('img');
  Object.assign(viewerImage.style, {maxWidth:'min(92vw,1200px)',maxHeight:'78vh',objectFit:'contain',borderRadius:'10px',boxShadow:'0 25px 90px rgba(0,0,0,.5)'});
  const viewerClose = viewer.querySelector('button');
  Object.assign(viewerClose.style, {position:'absolute',top:'2rem',right:'2.5rem',width:'4.5rem',height:'4.5rem',borderRadius:'50%',border:'1px solid rgba(255,255,255,.25)',background:'#17151f',color:'#fff',fontSize:'3rem',cursor:'pointer'});
  const viewerCaption = viewer.querySelector('p');
  Object.assign(viewerCaption.style, {font:'1.1rem "DM Mono",monospace',letterSpacing:'.15em',color:'#c4b5fd'});
  body.appendChild(viewer);
  const closeViewer = () => { viewer.style.display = 'none'; viewerImage.src = ''; body.style.overflow = ''; };
  viewerClose.addEventListener('click', closeViewer);
  viewer.addEventListener('click', e => { if (e.target === viewer) closeViewer(); });
  document.addEventListener('keydown', e => { if (e.key === 'Escape') closeViewer(); });
  document.querySelectorAll('.work-items img,.work1-items img').forEach(img => {
    img.loading = 'lazy';
    img.style.cursor = 'zoom-in';
    img.addEventListener('click', () => {
      viewerImage.src = img.currentSrc || img.src;
      viewerImage.alt = img.alt || 'Portfolio work';
      viewer.style.display = 'flex';
      body.style.overflow = 'hidden';
    });
  });

  // Subtle pointer glow for desktop cards.
  document.querySelectorAll('.services-box,.timeline-content,.work-items,.work1-items').forEach(card => {
    card.addEventListener('pointermove', e => {
      const r = card.getBoundingClientRect();
      card.style.setProperty('--pointer-x', `${e.clientX-r.left}px`);
      card.style.setProperty('--pointer-y', `${e.clientY-r.top}px`);
    });
  });


  // Portfolio motion / AI ads: play with sound while hovered, pause on exit.
  // Browsers may block audible autoplay until the visitor interacts with the page; in that case the video starts muted.
  document.querySelectorAll('.hover-sound-video').forEach(video => {
    video.controls = false;
    video.muted = true;
    video.loop = true;
    video.playsInline = true;
    video.addEventListener('pointerenter', async () => {
      const card = video.closest('.work1-items');
      video.muted = false;
      try { await video.play(); card?.classList.add('is-playing'); }
      catch (err) { video.muted = true; try { await video.play(); card?.classList.add('is-playing'); } catch (_) {} }
    });
    video.addEventListener('pointerleave', () => {
      video.pause();
      video.currentTime = 0;
      video.muted = true;
      video.closest('.work1-items')?.classList.remove('is-playing');
    });
    // Tap toggles playback on touch screens, where hover is not available.
    video.addEventListener('click', async () => {
      if (video.paused) { video.muted = false; try { await video.play(); } catch (_) { video.muted = true; await video.play().catch(()=>{}); } video.closest('.work1-items')?.classList.add('is-playing'); }
      else { video.pause(); video.closest('.work1-items')?.classList.remove('is-playing'); }
    });
  });

  const year = document.querySelector('#year');
  if (year) year.textContent = new Date().getFullYear();
})();
