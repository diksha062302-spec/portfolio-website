
// MOBILE NAVIGATION

const menuToggle = document.getElementById("menu-toggle");
const navLinks = document.getElementById("nav-links");

menuToggle.addEventListener("click", () => {
  const isOpen = navLinks.classList.toggle("open");

  menuToggle.setAttribute("aria-expanded", String(isOpen));

  menuToggle.innerHTML = isOpen
    ? '<i class="fa-solid fa-xmark"></i>'
    : '<i class="fa-solid fa-bars"></i>';
});

document.querySelectorAll(".nav-links a").forEach(link => {
  link.addEventListener("click", () => {
    navLinks.classList.remove("open");
    menuToggle.setAttribute("aria-expanded", "false");
    menuToggle.innerHTML = '<i class="fa-solid fa-bars"></i>';
  });
});


// AUTOMATIC COPYRIGHT YEAR

document.getElementById("year").textContent =
  new Date().getFullYear();


// SCROLL PROGRESS

const progressBar = document.getElementById("scroll-progress");
const backToTop = document.getElementById("back-to-top");

function updateScrollUI() {
  const scrollable =
    document.documentElement.scrollHeight - window.innerHeight;

  const progress = scrollable > 0
    ? (window.scrollY / scrollable) * 100
    : 0;

  progressBar.style.width = `${progress}%`;

  backToTop.classList.toggle(
    "visible",
    window.scrollY > 450
  );
}

window.addEventListener("scroll", updateScrollUI, {
  passive: true
});

updateScrollUI();

backToTop.addEventListener("click", () => {
  window.scrollTo({
    top: 0,
    behavior: "smooth"
  });
});


// ACTIVE NAVIGATION LINK

const sections = document.querySelectorAll("main section[id]");
const navItems = document.querySelectorAll(".nav-links a");

const sectionObserver = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      navItems.forEach(link => {
        link.classList.toggle(
          "active",
          link.getAttribute("href") === `#${entry.target.id}`
        );
      });
    }
  });
}, {
  rootMargin: "-35% 0px -55% 0px"
});

sections.forEach(section => {
  sectionObserver.observe(section);
});


// SCROLL REVEAL ANIMATION

const revealElements = document.querySelectorAll(
  ".reveal, .timeline-item"
);

const revealObserver = new IntersectionObserver(
  (entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add("visible");
        observer.unobserve(entry.target);
      }
    });
  },
  {
    threshold: 0.12,
    rootMargin: "0px 0px -40px 0px"
  }
);

revealElements.forEach(element => {
  revealObserver.observe(element);
});


// PROJECT FILTERS

const filterButtons = document.querySelectorAll(".filter-button");
const projectCards = document.querySelectorAll(".project-card");

filterButtons.forEach(button => {
  button.addEventListener("click", () => {
    const filter = button.dataset.filter;

    filterButtons.forEach(item => {
      item.classList.toggle("active", item === button);
    });

    projectCards.forEach(card => {
      const show =
        filter === "all" ||
        card.dataset.category === filter;

      card.classList.toggle("is-hidden", !show);
    });
  });
});


// DARK / LIGHT MODE

const themeToggle = document.getElementById("theme-toggle");

const savedTheme = localStorage.getItem(
  "diksha-portfolio-theme"
);

if (savedTheme === "dark") {
  document.body.classList.add("dark");
}

function updateThemeButton() {
  const dark = document.body.classList.contains("dark");

  themeToggle.innerHTML = dark
    ? '<i class="fa-regular fa-sun"></i>'
    : '<i class="fa-regular fa-moon"></i>';

  themeToggle.setAttribute(
    "aria-label",
    dark ? "Switch to light theme" : "Switch to dark theme"
  );
}

updateThemeButton();

themeToggle.addEventListener("click", () => {
  document.body.classList.toggle("dark");

  localStorage.setItem(
    "diksha-portfolio-theme",
    document.body.classList.contains("dark")
      ? "dark"
      : "light"
  );

  updateThemeButton();
});


// 3D PROJECT AND SKILL CARD TILT

const supportsFinePointer = window.matchMedia(
  "(hover: hover) and (pointer: fine)"
).matches;

if (supportsFinePointer) {
  document.querySelectorAll(
    ".project-card, .skill-card"
  ).forEach(card => {

    card.addEventListener("pointermove", event => {
      const rect = card.getBoundingClientRect();

      const x = event.clientX - rect.left;
      const y = event.clientY - rect.top;

      const rotateY =
        ((x - rect.width / 2) / (rect.width / 2)) * 5;

      const rotateX =
        ((rect.height / 2 - y) / (rect.height / 2)) * 5;

      card.style.transform = `
        perspective(900px)
        rotateX(${rotateX}deg)
        rotateY(${rotateY}deg)
        translateY(-5px)
      `;
    });

    card.addEventListener("pointerleave", () => {
      card.style.transform = "";
    });

  });
}


// ANIMATED STATISTICS

const counters = document.querySelectorAll("[data-count]");

const counterObserver = new IntersectionObserver(
  (entries, observer) => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;

      const counter = entry.target;
      const target = Number(counter.dataset.count);
      const decimals = Number(counter.dataset.decimals || 0);

      const duration = 1600;
      const startTime = performance.now();

      function updateCounter(now) {
        const progress = Math.min(
          (now - startTime) / duration,
          1
        );

        const eased = 1 - Math.pow(1 - progress, 4);

        counter.textContent =
          (target * eased).toFixed(decimals);

        if (progress < 1) {
          requestAnimationFrame(updateCounter);
        } else {
          counter.textContent = target.toFixed(decimals);
        }
      }

      requestAnimationFrame(updateCounter);
      observer.unobserve(counter);
    });
  },
  { threshold: 0.7 }
);

counters.forEach(counter => {
  counterObserver.observe(counter);
});


// CONTACT FORM

// This opens an email draft.
// It does not send messages through a server.

const contactForm = document.getElementById("contact-form");
const formStatus = document.getElementById("form-status");

contactForm.addEventListener("submit", event => {
  event.preventDefault();

  if (!contactForm.reportValidity()) return;

  const data = new FormData(contactForm);

  const name = data.get("name").trim();
  const email = data.get("email").trim();
  const subject = data.get("subject").trim();
  const message = data.get("message").trim();

  const mailSubject = encodeURIComponent(
    `Portfolio enquiry: ${subject}`
  );

  const mailBody = encodeURIComponent(
    `Hello Diksha,

${message}

Regards,
${name}
Reply to: ${email}`
  );

  formStatus.textContent = "Opening your email application...";

  window.location.href =
    `mailto:diksha062302@gmail.com?subject=${mailSubject}&body=${mailBody}`;
});
