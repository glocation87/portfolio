// Main Scroll/Navigation
const sections = document.querySelectorAll("section");
const navLinks = document.querySelectorAll(".nav-link");
const topbar = document.getElementById("top-socials");
const scroll = new LocomotiveScroll({
  el: document.querySelector('[data-scroll-container]'),
  smooth: true,
  multiplier: 0.8,
  inertia: 1, 
});


scroll.on("scroll", (args) => {
    if (args.scroll.y <= 40) {
        topbar.style.transform = "translateY(0)";
        topbar.style.opacity = "1";
    } else {
        topbar.style.transform = "translateY(-100%)";
        topbar.style.opacity = "0";
  }

  let current = "";

  sections.forEach(section => {
    const sectionTop = section.getBoundingClientRect().top + scroll.scroll.instance.scroll.y;
    const sectionHeight = section.clientHeight;

    if (args.scroll.y >= sectionTop - sectionHeight / 6) {
      current = section.getAttribute("id");
    }
  });

  navLinks.forEach(link => {
    link.classList.remove("bg-[#44475a]", "text-[#50fa7b]");
  });

  const activeLink = document.querySelector(`.nav-link[href="#${current}"]`);
  if (activeLink) {
    activeLink.classList.add("bg-[#44475a]", "text-[#50fa7b]");
  }
});

navLinks.forEach(link => {
  link.addEventListener("click", (e) => {
    e.preventDefault();
    const targetId = link.getAttribute("href").slice(1); 
    if (targetId == "top-socials") {
      scroll.scrollTo(0);
    } else {
      scroll.scrollTo(document.getElementById(targetId));
    }
    
  });
});

window.addEventListener("DOMContentLoaded", () => {
    const aboutSection = document.getElementById("about");
    if (aboutSection) {
        scroll.scrollTo(aboutSection);
    }
});

//Particle Effects
const canvas = document.createElement("canvas");
canvas.id = "particle-bg";
canvas.classList.add("fixed", "top-0", "left-0", "w-full", "h-full", "z-0");
document.body.prepend(canvas);

const ctx = canvas.getContext("2d");

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

const particles = [];
const particleCount = 80;
const maxDistance = 100;
let mouse = { x: null, y: null };

window.addEventListener("mousemove", e => {
  mouse.x = e.clientX;
  mouse.y = e.clientY;
});

window.addEventListener("resize", () => {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
});

class Particle {
  constructor() {
    this.x = Math.random() * canvas.width;
    this.y = Math.random() * canvas.height;
    this.vx = (Math.random() - 0.5) * 0.5;
    this.vy = (Math.random() - 0.5) * 0.5;
    this.size = Math.random() * 2 + 1;
  }
  draw() {
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.size, 0, Math.PI*2);
    ctx.fillStyle = "rgba(255, 255, 255, 0.42)";
    ctx.fill();
  }
  update() {
    this.x += this.vx;
    this.y += this.vy;

    if(this.x < 0 || this.x > canvas.width) this.vx *= -1;
    if(this.y < 0 || this.y > canvas.height) this.vy *= -1;
  }
}

for(let i=0; i<particleCount; i++) particles.push(new Particle());

function connectParticles() {
  for(let a=0; a<particles.length; a++) {
    for(let b=a; b<particles.length; b++) {
      let dx = particles[a].x - particles[b].x;
      let dy = particles[a].y - particles[b].y;
      let distance = Math.sqrt(dx*dx + dy*dy);
      if(distance < maxDistance) {
        ctx.beginPath();
        ctx.strokeStyle = `rgba(255,255,255,${1 - distance/maxDistance})`;
        ctx.lineWidth = 0.4;
        ctx.moveTo(particles[a].x, particles[a].y);
        ctx.lineTo(particles[b].x, particles[b].y);
        ctx.stroke();
      }
      if(mouse.x && mouse.y) {
        let mdx = particles[a].x - mouse.x;
        let mdy = particles[a].y - mouse.y;
        let mdistance = Math.sqrt(mdx*mdx + mdy*mdy);
        if(mdistance < maxDistance) {
          ctx.beginPath();
          ctx.strokeStyle = `rgba(255,255,255,${1 - mdistance/maxDistance})`;
          ctx.lineWidth = 0.4;
          ctx.moveTo(particles[a].x, particles[a].y);
          ctx.lineTo(mouse.x, mouse.y);
          ctx.stroke();
        }
      }
    }
  }
}

function animateParticles() {
  ctx.clearRect(0,0,canvas.width,canvas.height);
  particles.forEach(p => { p.update(); p.draw(); });
  connectParticles();
  requestAnimationFrame(animateParticles);
}

animateParticles();

const socials = document.querySelectorAll(".social-link");


const tabs = document.querySelectorAll('.tab-btn');
  const codeTabs = document.querySelectorAll('.code-tab');

  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      // Hide all tabs
      codeTabs.forEach(ct => ct.classList.add('hidden'));
      // Show the selected tab
      const target = document.getElementById(tab.dataset.target);
      target.classList.remove('hidden');

      // Optional: highlight active button
      tabs.forEach(t => t.classList.remove('bg-[#6272a4]'));
      tab.classList.add('bg-[#6272a4]');

      scroll.update()
    });
  });