// ui.js
// Handles UI logic: dark mode, navigation, scroll, animations, back-to-top, etc.
document.addEventListener('DOMContentLoaded', function() {
  // Dark mode toggle
  const darkModeToggle = document.getElementById('dark-mode-toggle');
  const darkModeIcon = document.getElementById('dark-mode-icon');
  const body = document.body;
  function setDarkMode(isDark) {
    if (isDark) {
      body.classList.add('dark');
      darkModeIcon.classList.remove('fa-moon');
      darkModeIcon.classList.add('fa-sun');
    } else {
      body.classList.remove('dark');
      darkModeIcon.classList.remove('fa-sun');
      darkModeIcon.classList.add('fa-moon');
    }
  }
  const userDark = localStorage.getItem('darkMode');
  setDarkMode(userDark === 'true');
  darkModeToggle.addEventListener('click', () => {
    const isDark = !body.classList.contains('dark');
    setDarkMode(isDark);
    localStorage.setItem('darkMode', isDark);
  });
  // Mobile menu toggle
  const mobileMenuBtn = document.getElementById('mobile-menu-btn');
  const mobileMenu = document.getElementById('mobile-menu');
  mobileMenuBtn.addEventListener('click', () => {
    mobileMenu.classList.toggle('hidden');
  });
  const mobileNavLinks = document.querySelectorAll('.mobile-nav-link');
  mobileNavLinks.forEach(link => {
    link.addEventListener('click', () => {
      mobileMenu.classList.add('hidden');
    });
  });
  // Smooth scrolling for navigation links
  const navLinks = document.querySelectorAll('.nav-link, .mobile-nav-link');
  navLinks.forEach(link => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      const targetId = link.getAttribute('href');
      const targetSection = document.querySelector(targetId);
      if (targetSection) {
        const offsetTop = targetSection.offsetTop - 80;
        window.scrollTo({ top: offsetTop, behavior: 'smooth' });
      }
    });
  });
  // Back to top button
  const backToTopBtn = document.getElementById('back-to-top');
  window.addEventListener('scroll', () => {
    if (window.pageYOffset > 300) {
      backToTopBtn.classList.remove('opacity-0', 'pointer-events-none');
      backToTopBtn.classList.add('opacity-100');
    } else {
      backToTopBtn.classList.add('opacity-0', 'pointer-events-none');
      backToTopBtn.classList.remove('opacity-100');
    }
  });
  backToTopBtn.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
  // Add scroll animations
  const observerOptions = { threshold: 0.1, rootMargin: '0px 0px -50px 0px' };
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.style.opacity = '1';
        entry.target.style.transform = 'translateY(0)';
      }
    });
  }, observerOptions);
  // Observe project cards for animation
  const projectCards = document.querySelectorAll('.project-card');
  projectCards.forEach(card => {
    card.style.opacity = '0';
    card.style.transform = 'translateY(20px)';
    card.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
    observer.observe(card);
  });
  // Observe skill items for animation
  const skillItems = document.querySelectorAll('.skill-item');
  skillItems.forEach((item, index) => {
    item.style.opacity = '0';
    item.style.transform = 'translateX(-20px)';
    item.style.transition = `opacity 0.6s ease ${index * 0.1}s, transform 0.6s ease ${index * 0.1}s`;
    observer.observe(item);
  });
  // Add typing animation to hero text and subtitle/description
  const heroSub = document.querySelectorAll('#home .animate-fade-in');
  if (heroSub.length > 0) {
    heroSub.forEach((el, idx) => {
      el.style.opacity = '0';
      el.style.transform = 'translateY(30px)';
      el.style.transition = `opacity 1s ease, transform 1s ease`;
    });
    setTimeout(() => {
      heroSub[0].style.opacity = '1';
      heroSub[0].style.transform = 'translateY(0)';
    }, 300);
    if (heroSub[1]) {
      setTimeout(() => {
        heroSub[1].style.opacity = '1';
        heroSub[1].style.transform = 'translateY(0)';
      }, 500);
    }
    if (heroSub[2]) {
      setTimeout(() => {
        heroSub[2].style.opacity = '1';
        heroSub[2].style.transform = 'translateY(0)';
      }, 700);
    }
  }
  // Fade-in from right for About section
  const aboutFadeIn = document.querySelectorAll('.animate-fade-in-right');
  aboutFadeIn.forEach((el, idx) => {
    el.style.opacity = '0';
    el.style.transform = 'translateX(30px)';
    el.style.transition = `opacity 1s ease ${idx * 0.1}s, transform 1s ease ${idx * 0.1}s`;
    observer.observe(el);
  });
});
