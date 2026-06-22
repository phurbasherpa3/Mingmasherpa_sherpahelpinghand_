/**
 * Sherpa Helping Hand — Website Scripts
 */

const WHATSAPP_NUMBER = '9779842959446';
const ESEWA_NUMBER = '9842959446';

document.addEventListener('DOMContentLoaded', () => {
  initNavigation();
  initContactForm();
  initCopyEsewa();
  initDonateTabs();
  initGalleryLightbox();
  initImpactCounters();
  initScrollAnimations();
  setCurrentYear();
});

/* ---- Navigation ---- */
function initNavigation() {
  const header = document.getElementById('header');
  const navToggle = document.getElementById('navToggle');
  const navMenu = document.getElementById('navMenu');
  const navLinks = document.querySelectorAll('.nav-link');
  const sections = document.querySelectorAll('section[id]');

  window.addEventListener('scroll', () => {
    header.classList.toggle('scrolled', window.scrollY > 50);
    updateActiveNavLink(sections, navLinks);
  });

  navToggle.addEventListener('click', () => {
    const isOpen = navMenu.classList.toggle('open');
    navToggle.classList.toggle('active', isOpen);
    navToggle.setAttribute('aria-expanded', isOpen);
  });

  navLinks.forEach(link => {
    link.addEventListener('click', () => {
      navMenu.classList.remove('open');
      navToggle.classList.remove('active');
      navToggle.setAttribute('aria-expanded', 'false');
    });
  });
}

function updateActiveNavLink(sections, navLinks) {
  const scrollPos = window.scrollY + 100;

  sections.forEach(section => {
    const top = section.offsetTop;
    const height = section.offsetHeight;
    const id = section.getAttribute('id');

    if (scrollPos >= top && scrollPos < top + height) {
      navLinks.forEach(link => {
        link.classList.toggle('active', link.getAttribute('href') === `#${id}`);
      });
    }
  });
}

/* ---- Contact Form → WhatsApp ---- */
function initContactForm() {
  const form = document.getElementById('contactForm');

  form.addEventListener('submit', (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    const name = document.getElementById('name').value.trim();
    const email = document.getElementById('email').value.trim();
    const phone = document.getElementById('phone').value.trim();
    const subject = document.getElementById('subject').value;
    const message = document.getElementById('message').value.trim();

    const whatsappMessage = buildWhatsAppMessage({ name, email, phone, subject, message });
    const whatsappUrl = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(whatsappMessage)}`;

    window.open(whatsappUrl, '_blank');
  });
}

function buildWhatsAppMessage({ name, email, phone, subject, message }) {
  let text = `*New Message from Sherpa Helping Hand Website*\n\n`;
  text += `*Name:* ${name}\n`;
  if (email) text += `*Email:* ${email}\n`;
  if (phone) text += `*Phone:* ${phone}\n`;
  text += `*Subject:* ${subject}\n\n`;
  text += `*Message:*\n${message}`;

  return text;
}

function validateForm() {
  let isValid = true;

  const name = document.getElementById('name');
  const subject = document.getElementById('subject');
  const message = document.getElementById('message');

  clearErrors();

  if (!name.value.trim()) {
    showError('name', 'Please enter your name.');
    isValid = false;
  }

  if (!subject.value) {
    showError('subject', 'Please select a subject.');
    isValid = false;
  }

  if (!message.value.trim()) {
    showError('message', 'Please enter your message.');
    isValid = false;
  } else if (message.value.trim().length < 10) {
    showError('message', 'Message must be at least 10 characters.');
    isValid = false;
  }

  return isValid;
}

function showError(fieldId, errorText) {
  const field = document.getElementById(fieldId);
  const errorEl = document.getElementById(`${fieldId}Error`);
  field.closest('.form-group').classList.add('error');
  errorEl.textContent = errorText;
}

function clearErrors() {
  document.querySelectorAll('.form-group').forEach(group => {
    group.classList.remove('error');
  });
  document.querySelectorAll('.form-error').forEach(el => {
    el.textContent = '';
  });
}

/* ---- Copy eSewa Number ---- */
function initCopyEsewa() {
  const copyBtn = document.getElementById('copyEsewa');

  copyBtn.addEventListener('click', async () => {
    try {
      await navigator.clipboard.writeText(ESEWA_NUMBER);
      copyBtn.classList.add('copied');
      copyBtn.querySelector('span').textContent = 'Copied!';

      setTimeout(() => {
        copyBtn.classList.remove('copied');
        copyBtn.querySelector('span').textContent = 'Copy';
      }, 2000);
    } catch {
      const textArea = document.createElement('textarea');
      textArea.value = ESEWA_NUMBER;
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand('copy');
      document.body.removeChild(textArea);

      copyBtn.classList.add('copied');
      copyBtn.querySelector('span').textContent = 'Copied!';

      setTimeout(() => {
        copyBtn.classList.remove('copied');
        copyBtn.querySelector('span').textContent = 'Copy';
      }, 2000);
    }
  });
}

/* ---- Impact Counter Animation ---- */
function initImpactCounters() {
  const counters = document.querySelectorAll('.impact-number');
  let animated = false;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting && !animated) {
        animated = true;
        counters.forEach(counter => animateCounter(counter));
      }
    });
  }, { threshold: 0.5 });

  const impactSection = document.querySelector('.impact');
  if (impactSection) observer.observe(impactSection);
}

/* ---- Bank QR & Details Toggle + Copy ---- */
/* (Bank QR toggle removed - donation panels handle copy/tabs) */

/* ---- Gallery Lightbox (images & video) ---- */
/* (Gallery lightbox removed in reverted version) */

/* ---- Carousel (swipe + arrows + dots) ---- */
/* (Carousel removed in reverted version) */

/* ---- Donation tabs switching and copy handlers ---- */
function initDonateTabs() {
  const tabs = document.querySelectorAll('.donate-tab');
  const panels = document.querySelectorAll('.donate-panel');
  const donateSection = document.getElementById('donate');
  const switchToEsewa = document.getElementById('switchToEsewa');

  if (!tabs.length) return;

  const activateTab = (targetId, scroll = false) => {
    tabs.forEach(t => { t.classList.remove('active'); t.setAttribute('aria-selected', 'false'); });
    panels.forEach(p => p.hidden = true);

    const tab = document.querySelector(`.donate-tab[data-target="${targetId}"]`);
    const targetPanel = document.getElementById(targetId);

    if (tab) {
      tab.classList.add('active');
      tab.setAttribute('aria-selected', 'true');
    }

    if (targetPanel) {
      targetPanel.hidden = false;
    }

    if (scroll && donateSection) {
      donateSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }

  };

  tabs.forEach(tab => {
    tab.addEventListener('click', () => activateTab(tab.dataset.target, true));
  });

  if (switchToEsewa) {
    switchToEsewa.addEventListener('click', () => {
      activateTab('esewaPanel', true);
    });
  }

  const hash = window.location.hash;
  if (hash === '#esewaPanel' || hash === '#bankPanel') {
    activateTab(hash.slice(1), true);
  }

  // copy handler for bank account
  const copyAccountBtn = document.getElementById('copyAccount');
  if (copyAccountBtn) copyAccountBtn.addEventListener('click', async (event) => {
    event.preventDefault();
    const account = document.getElementById('bankAccount').textContent.trim();
    try {
      await navigator.clipboard.writeText(account);
    } catch {
      const textArea = document.createElement('textarea');
      textArea.value = account;
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand('copy');
      document.body.removeChild(textArea);
    }
    copyAccountBtn.textContent = 'Copied';
    setTimeout(() => { copyAccountBtn.textContent = 'Copy'; }, 1500);
  });
}

function initGalleryLightbox() {
  const galleryItems = document.querySelectorAll('.gallery-figure');
  const lightbox = document.getElementById('galleryLightbox');
  const lightboxImage = document.getElementById('lightboxImage');
  const lightboxCaption = document.getElementById('lightboxCaption');
  const prevButton = document.getElementById('lightboxPrev');
  const nextButton = document.getElementById('lightboxNext');
  const closeButton = document.getElementById('lightboxClose');

  if (!galleryItems.length || !lightbox) return;

  let currentIndex = 0;

  function showLightbox(index) {
    const item = galleryItems[index];
    if (!item) return;

    const image = item.querySelector('img');
    lightboxImage.src = image.src;
    lightboxImage.alt = image.alt;
    lightboxCaption.textContent = image.alt || `Photo ${index + 1}`;
    currentIndex = index;
    lightbox.classList.add('open');
    lightbox.setAttribute('aria-hidden', 'false');
  }

  function closeLightbox() {
    lightbox.classList.remove('open');
    lightbox.setAttribute('aria-hidden', 'true');
  }

  function showNext() {
    showLightbox((currentIndex + 1) % galleryItems.length);
  }

  function showPrev() {
    showLightbox((currentIndex - 1 + galleryItems.length) % galleryItems.length);
  }

  galleryItems.forEach(item => {
    item.addEventListener('click', () => {
      const index = parseInt(item.dataset.index, 10);
      showLightbox(Number.isNaN(index) ? 0 : index);
    });
  });

  nextButton.addEventListener('click', showNext);
  prevButton.addEventListener('click', showPrev);
  closeButton.addEventListener('click', closeLightbox);

  lightboxImage.addEventListener('click', (event) => {
    const rect = lightboxImage.getBoundingClientRect();
    const clickX = event.clientX - rect.left;
    if (clickX < rect.width / 2) {
      showPrev();
    } else {
      showNext();
    }
  });

  let touchStartX = 0;
  lightbox.addEventListener('touchstart', (event) => {
    touchStartX = event.changedTouches[0].screenX;
  }, { passive: true });

  lightbox.addEventListener('touchend', (event) => {
    const touchEndX = event.changedTouches[0].screenX;
    const touchDiff = touchEndX - touchStartX;
    if (Math.abs(touchDiff) > 40) {
      if (touchDiff < 0) {
        showNext();
      } else {
        showPrev();
      }
    }
  }, { passive: true });

  lightbox.addEventListener('click', (event) => {
    if (event.target === lightbox) {
      closeLightbox();
    }
  });

  document.addEventListener('keydown', (event) => {
    if (!lightbox.classList.contains('open')) return;
    if (event.key === 'Escape') closeLightbox();
    if (event.key === 'ArrowRight') showNext();
    if (event.key === 'ArrowLeft') showPrev();
  });
}

function animateCounter(element) {
  const target = parseInt(element.getAttribute('data-target'), 10);
  const duration = 2000;
  const startTime = performance.now();

  function update(currentTime) {
    const elapsed = currentTime - startTime;
    const progress = Math.min(elapsed / duration, 1);
    const eased = 1 - Math.pow(1 - progress, 3);
    const current = Math.floor(eased * target);

    element.textContent = current;

    if (progress < 1) {
      requestAnimationFrame(update);
    } else {
      element.textContent = target;
    }
  }

  requestAnimationFrame(update);
}

/* ---- Scroll Animations ---- */
function initScrollAnimations() {
  const animatedElements = document.querySelectorAll(
    '.program-card, .about-card, .donate-card, .contact-form, .contact-item, .gallery-social'
  );

  animatedElements.forEach(el => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(30px)';
    el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
  });

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.style.opacity = '1';
        entry.target.style.transform = 'translateY(0)';
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15, rootMargin: '0px 0px -40px 0px' });

  animatedElements.forEach(el => observer.observe(el));
}

/* ---- Footer Year ---- */
function setCurrentYear() {
  const yearEl = document.getElementById('currentYear');
  if (yearEl) {
    yearEl.textContent = new Date().getFullYear();
  }
}
