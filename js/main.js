// ===== SHAW'S BUTCHERS - Main JavaScript =====

// ---------- Dark Mode (runs before DOMContentLoaded to prevent flash) ----------
(function() {
  const saved = localStorage.getItem('shaws-dark-mode');
  if (saved === 'true' || (saved === null && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
    document.body.classList.add('dark-mode');
  }
})();

document.addEventListener('DOMContentLoaded', () => {

  // ---------- Dark Mode Toggle ----------
  const darkToggle = document.getElementById('darkToggle');
  if (darkToggle) {
    darkToggle.addEventListener('click', () => {
      document.body.classList.toggle('dark-mode');
      const isDark = document.body.classList.contains('dark-mode');
      localStorage.setItem('shaws-dark-mode', isDark);
    });
  }

  // Listen for system preference changes
  window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
    const saved = localStorage.getItem('shaws-dark-mode');
    if (saved === null) {
      document.body.classList.toggle('dark-mode', e.matches);
    }
  });

  // ---------- Navbar Scroll Effect ----------
  const navbar = document.querySelector('.navbar');
  const handleScroll = () => {
    if (window.scrollY > 50) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
  };
  window.addEventListener('scroll', handleScroll, { passive: true });
  handleScroll(); // check on load for subpages

  // ---------- Mobile Menu ----------
  const hamburger = document.querySelector('.hamburger');
  const navMenu = document.querySelector('.nav-menu');
  const overlay = document.querySelector('.mobile-overlay');

  const toggleMenu = () => {
    hamburger.classList.toggle('active');
    navMenu.classList.toggle('open');
    overlay.classList.toggle('active');
    document.body.style.overflow = navMenu.classList.contains('open') ? 'hidden' : '';
  };

  hamburger?.addEventListener('click', toggleMenu);
  overlay?.addEventListener('click', toggleMenu);

  // Close menu when clicking nav links
  document.querySelectorAll('.nav-menu .nav-link:not(.nav-dropdown-toggle)').forEach(link => {
    link.addEventListener('click', () => {
      if (navMenu.classList.contains('open')) {
        toggleMenu();
      }
    });
  });

  // Mobile dropdown toggle
  document.querySelectorAll('.nav-dropdown-toggle').forEach(toggle => {
    toggle.addEventListener('click', (e) => {
      if (window.innerWidth <= 768) {
        e.preventDefault();
        const parent = toggle.closest('.nav-dropdown');
        parent.classList.toggle('mobile-open');
      }
    });
  });

  // ---------- Scroll Animations ----------
  const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, observerOptions);

  document.querySelectorAll('.fade-in').forEach(el => {
    observer.observe(el);
  });

  // ---------- Smooth scroll for anchor links ----------
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', (e) => {
      const href = anchor.getAttribute('href');
      if (href === '#') return;
      e.preventDefault();
      const target = document.querySelector(href);
      if (target) {
        const offset = navbar.offsetHeight + 20;
        const targetPosition = target.getBoundingClientRect().top + window.scrollY - offset;
        window.scrollTo({
          top: targetPosition,
          behavior: 'smooth'
        });
      }
    });
  });

  // ---------- Add to cart animation ----------
  // (Handled by cart.js — basket system)

  // ---------- Contact Form ----------
  const contactForm = document.querySelector('.contact-form form');
  contactForm?.addEventListener('submit', (e) => {
    e.preventDefault();
    const formData = new FormData(contactForm);
    const data = Object.fromEntries(formData);
    
    // Honeypot spam check
    if (data.website_verification_code) {
      console.warn("Contact form spam detected.");
      contactForm.reset();
      return;
    }
    
    // Show success message
    const btn = contactForm.querySelector('.form-submit');
    const originalText = btn.textContent;
    btn.textContent = 'Message Sent!';
    btn.style.background = 'linear-gradient(135deg, #2d7a3a, #1e5c28)';
    
    setTimeout(() => {
      btn.textContent = originalText;
      btn.style.background = '';
      contactForm.reset();
    }, 3000);
  });

  // ---------- Navbar active state on subpages ----------
  const currentPage = window.location.pathname.split('/').pop().replace('.html', '') || 'index';
  document.querySelectorAll('.nav-link').forEach(link => {
    const href = link.getAttribute('href');
    if (href) {
      const linkPage = href.replace('.html', '').replace('./', '');
      if (linkPage === currentPage || 
          (currentPage === 'index' && (linkPage === '' || linkPage === 'index')) ||
          (linkPage === currentPage)) {
        link.classList.add('active');
      }
    }
  });

  // Force scrolled state on subpages (non-homepage)
  if (!document.querySelector('.hero')) {
    navbar.classList.add('scrolled');
  }
});
