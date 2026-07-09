/* ==========================================================================
   VESSEL STUDIO — MAIN JS
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {

  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---- NAV: background blur on scroll ---- */
  const nav = document.getElementById('nav');
  const handleNavScroll = () => {
    if (window.scrollY > 40) nav.classList.add('scrolled');
    else nav.classList.remove('scrolled');
  };
  window.addEventListener('scroll', handleNavScroll, { passive: true });
  handleNavScroll();

  /* ---- SCROLL REVEAL ---- */
  const revealEls = document.querySelectorAll('.reveal');
  if (prefersReducedMotion) {
    revealEls.forEach(el => el.classList.add('is-visible'));
  } else {
    const revealObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          revealObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.15, rootMargin: '0px 0px -40px 0px' });

    revealEls.forEach(el => revealObserver.observe(el));
  }

  /* ---- PARALLAX: The Space section ---- */
  const parallaxEl = document.querySelector('[data-parallax]');
  if (parallaxEl && !prefersReducedMotion) {
    let ticking = false;
    const updateParallax = () => {
      const rect = parallaxEl.parentElement.getBoundingClientRect();
      const speed = 0.3;
      const offset = rect.top * speed;
      parallaxEl.style.transform = `translateY(${offset}px)`;
      ticking = false;
    };
    window.addEventListener('scroll', () => {
      if (!ticking) {
        requestAnimationFrame(updateParallax);
        ticking = true;
      }
    }, { passive: true });
    updateParallax();
  }

  /* ---- FAQ ACCORDION ---- */
  const faqItems = document.querySelectorAll('.faq-item');
  faqItems.forEach(item => {
    const question = item.querySelector('.faq-item__question');
    const answer = item.querySelector('.faq-item__answer');

    question.addEventListener('click', () => {
      const isOpen = item.classList.contains('is-open');

      faqItems.forEach(other => {
        other.classList.remove('is-open');
        other.querySelector('.faq-item__answer').style.maxHeight = null;
      });

      if (!isOpen) {
        item.classList.add('is-open');
        answer.style.maxHeight = answer.scrollHeight + 'px';
      }
    });
  });

  /* ---- MOBILE NAV: active state on scroll ---- */
  const mobileLinks = document.querySelectorAll('.mobile-nav a');
  const sections = ['classes', 'schedule', 'join', 'faq']
    .map(id => document.getElementById(id))
    .filter(Boolean);

  const setActiveMobileLink = () => {
    let current = '';
    sections.forEach(section => {
      const rect = section.getBoundingClientRect();
      if (rect.top <= 120 && rect.bottom >= 120) current = section.id;
    });
    mobileLinks.forEach(link => {
      link.classList.toggle('active', link.getAttribute('href') === `#${current}`);
    });
  };
  window.addEventListener('scroll', setActiveMobileLink, { passive: true });
  setActiveMobileLink();

  /* ---- ENQUIRY FORM: submit to WhatsApp ---- */
  const WHATSAPP_NUMBER = '2349033601859'; // placeholder — update with real number
  const enquiryForm = document.getElementById('enquiryForm');

  enquiryForm.addEventListener('submit', (e) => {
    e.preventDefault();

    const name = document.getElementById('name').value.trim();
    const phone = document.getElementById('phone').value.trim();
    const classInterest = document.getElementById('classInterest').value;
    const membershipInterest = document.getElementById('membershipInterest').value;

    const message = `Hi Vessel Studio, I'd like to book a class.%0A%0AName: ${encodeURIComponent(name)}%0APhone: ${encodeURIComponent(phone)}%0AClass Interest: ${encodeURIComponent(classInterest)}%0AMembership Interest: ${encodeURIComponent(membershipInterest)}`;

    const whatsappUrl = `https://wa.me/${WHATSAPP_NUMBER}?text=${message}`;
    window.open(whatsappUrl, '_blank');
  });

});