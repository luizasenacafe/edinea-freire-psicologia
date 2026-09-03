const header = document.querySelector(".site-header");
const menuButton = document.querySelector(".menu-toggle");
const nav = document.querySelector(".main-nav");
const navLinks = nav.querySelectorAll("a");
const lightbox = document.querySelector(".lightbox");
const lightboxImage = lightbox.querySelector("img");
const lightboxClose = lightbox.querySelector(".lightbox-close");
const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

document.getElementById("year").textContent = new Date().getFullYear();

function updateHeader() {
  header.classList.toggle("scrolled", window.scrollY > 24);
}

function closeMenu() {
  nav.classList.remove("is-open");
  document.body.classList.remove("menu-open");
  menuButton.setAttribute("aria-expanded", "false");
  menuButton.setAttribute("aria-label", "Abrir menu");
}

menuButton.addEventListener("click", () => {
  const isOpen = nav.classList.toggle("is-open");
  document.body.classList.toggle("menu-open", isOpen);
  menuButton.setAttribute("aria-expanded", String(isOpen));
  menuButton.setAttribute("aria-label", isOpen ? "Fechar menu" : "Abrir menu");
});

navLinks.forEach((link) => link.addEventListener("click", closeMenu));
window.addEventListener("scroll", updateHeader, { passive: true });
updateHeader();

if (reduceMotion) {
  document.querySelectorAll(".reveal").forEach((element) => element.classList.add("is-visible"));
} else {
  const revealObserver = new IntersectionObserver(
    (entries, observer) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.12, rootMargin: "0px 0px -40px" }
  );

  document.querySelectorAll(".reveal").forEach((element) => revealObserver.observe(element));
}

document.querySelectorAll("[data-lightbox]").forEach((button) => {
  button.addEventListener("click", () => {
    lightboxImage.src = button.dataset.lightbox;
    lightbox.showModal();
  });
});

function closeLightbox() {
  lightbox.close();
  lightboxImage.src = "";
}

lightboxClose.addEventListener("click", closeLightbox);
lightbox.addEventListener("click", (event) => {
  if (event.target === lightbox) closeLightbox();
});

const canvas = document.getElementById("stars");
const context = canvas.getContext("2d");
let stars = [];
let animationFrame;

function sizeCanvas() {
  const density = Math.min(window.devicePixelRatio || 1, 2);
  canvas.width = Math.floor(window.innerWidth * density);
  canvas.height = Math.floor(window.innerHeight * density);
  canvas.style.width = `${window.innerWidth}px`;
  canvas.style.height = `${window.innerHeight}px`;
  context.setTransform(density, 0, 0, density, 0, 0);

  const starCount = Math.min(150, Math.floor((window.innerWidth * window.innerHeight) / 9000));
  stars = Array.from({ length: starCount }, () => ({
    x: Math.random() * window.innerWidth,
    y: Math.random() * window.innerHeight,
    radius: Math.random() * 1.25 + 0.25,
    alpha: Math.random() * 0.55 + 0.15,
    speed: Math.random() * 0.12 + 0.025,
    drift: (Math.random() - 0.5) * 0.045,
    pulse: Math.random() * Math.PI * 2
  }));
}

function drawStars(timestamp = 0) {
  context.clearRect(0, 0, window.innerWidth, window.innerHeight);

  stars.forEach((star) => {
    star.y -= star.speed;
    star.x += star.drift;

    if (star.y < -3) {
      star.y = window.innerHeight + 3;
      star.x = Math.random() * window.innerWidth;
    }

    if (star.x < -3) star.x = window.innerWidth + 3;
    if (star.x > window.innerWidth + 3) star.x = -3;

    const shimmer = Math.sin(timestamp * 0.0012 + star.pulse) * 0.14;
    context.beginPath();
    context.arc(star.x, star.y, star.radius, 0, Math.PI * 2);
    context.fillStyle = `rgba(220, 247, 255, ${Math.max(0.08, star.alpha + shimmer)})`;
    context.fill();
  });

  animationFrame = window.requestAnimationFrame(drawStars);
}

let resizeTimer;
window.addEventListener("resize", () => {
  window.clearTimeout(resizeTimer);
  resizeTimer = window.setTimeout(sizeCanvas, 150);
  if (window.innerWidth > 1020) closeMenu();
});

sizeCanvas();
if (reduceMotion) {
  drawStars(0);
  window.cancelAnimationFrame(animationFrame);
} else {
  drawStars();
}

window.addEventListener("DOMContentLoaded", () => {
  if (window.lucide) window.lucide.createIcons();
});
