/* =====================================
   PREMIUM KHITANAN INVITATION
===================================== */

document.addEventListener("DOMContentLoaded", () => {
  AOS.init({
    duration: 1000,
    once: true,
  });
});

/* =====================================
   LOADER
===================================== */

window.addEventListener("load", () => {
  const loader = document.getElementById("loader");

  setTimeout(() => {
    loader.style.opacity = "0";

    setTimeout(() => {
      loader.style.display = "none";
    }, 500);
  }, 1500);
});

/* =====================================
   OPEN INVITATION
===================================== */

const openBtn = document.getElementById("openInvitation");
const opening = document.getElementById("opening");
const music = document.getElementById("bgMusic");

const mainContent = document.getElementById("mainContent");

openBtn?.addEventListener("click", () => {
  opening.style.opacity = "0";

  setTimeout(() => {
    opening.style.display = "none";

    mainContent.style.opacity = "1";
    mainContent.style.visibility = "visible";
  }, 800);

  music.play().catch(() => {});
});

openBtn?.addEventListener("click", () => {
  opening.style.opacity = "0";

  setTimeout(() => {
    opening.style.display = "none";
  }, 800);

  music.play().catch(() => {});

  document.body.style.overflowY = "auto";
});

/* =====================================
   ENCRYPTED GUEST NAME
   ?guest=QWxhbg==
===================================== */

const params = new URLSearchParams(window.location.search);

const encryptedGuest = params.get("guest");

const guestElement = document.getElementById("guestName");

if (encryptedGuest && guestElement) {
  try {
    const guest = atob(encryptedGuest);

    guestElement.innerHTML = guest;
  } catch (error) {
    guestElement.innerHTML = "Tamu Undangan";
  }
}

/* =====================================
   COUNTDOWN
===================================== */

const targetDate = new Date("July 20, 2026 09:00:00").getTime();

const countdown = () => {
  const now = new Date().getTime();

  const distance = targetDate - now;

  const days = Math.floor(distance / (1000 * 60 * 60 * 24));

  const hours = Math.floor(
    (distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60),
  );

  const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));

  const seconds = Math.floor((distance % (1000 * 60)) / 1000);

  document.getElementById("days").innerHTML = days.toString().padStart(2, "0");

  document.getElementById("hours").innerHTML = hours
    .toString()
    .padStart(2, "0");

  document.getElementById("minutes").innerHTML = minutes
    .toString()
    .padStart(2, "0");

  document.getElementById("seconds").innerHTML = seconds
    .toString()
    .padStart(2, "0");
};

countdown();

setInterval(countdown, 1000);

/* =====================================
   SWIPER GALLERY
===================================== */

new Swiper(".gallerySwiper", {
  loop: true,

  speed: 800,

  autoplay: {
    delay: 3000,
  },

  pagination: {
    el: ".swiper-pagination",

    clickable: true,
  },
});

/* =====================================
   LIGHTBOX
===================================== */

const lightbox = document.getElementById("lightbox");

const lightboxImage = document.getElementById("lightboxImage");

document.querySelectorAll(".swiper-slide img").forEach((img) => {
  img.addEventListener("click", () => {
    lightbox.style.display = "flex";

    lightboxImage.src = img.src;
  });
});

lightbox?.addEventListener("click", () => {
  lightbox.style.display = "none";
});

/* =====================================
   COPY REKENING
===================================== */

const copyButtons = document.querySelectorAll(".copy-btn");

copyButtons.forEach((button) => {
  button.addEventListener("click", () => {
    const rekening = button.parentElement.querySelector("p").innerText;

    navigator.clipboard.writeText(rekening).then(() => {
      const original = button.innerText;

      button.innerText = "Berhasil Disalin";

      setTimeout(() => {
        button.innerText = original;
      }, 2000);
    });
  });
});

/* =====================================
   QRIS MODAL
===================================== */

const qrisImage = document.getElementById("qrisImage");

const qrisModal = document.getElementById("qrisModal");

const closeQris = document.getElementById("closeQris");

qrisImage?.addEventListener("click", () => {
  qrisModal.style.display = "flex";
});

closeQris?.addEventListener("click", () => {
  qrisModal.style.display = "none";
});

qrisModal?.addEventListener("click", (e) => {
  if (e.target === qrisModal) {
    qrisModal.style.display = "none";
  }
});

/* =====================================
   AUTO DARK MODE
===================================== */

const currentHour = new Date().getHours();

if (currentHour >= 18 || currentHour <= 5) {
  document.body.classList.add("night-mode");
}

/* =====================================
   ACTIVE BOTTOM NAV
===================================== */

const sections = document.querySelectorAll("section");

const navLinks = document.querySelectorAll(".bottom-nav a");

window.addEventListener("scroll", () => {
  let current = "";

  sections.forEach((section) => {
    const sectionTop = section.offsetTop - 200;

    if (window.scrollY >= sectionTop) {
      current = section.id;
    }
  });

  navLinks.forEach((link) => {
    link.classList.remove("active");

    if (link.getAttribute("href") === `#${current}`) {
      link.classList.add("active");
    }
  });
});

/* =====================================
   SMOOTH SCROLL
===================================== */

navLinks.forEach((link) => {
  link.addEventListener("click", (e) => {
    e.preventDefault();

    const target = document.querySelector(link.getAttribute("href"));

    target?.scrollIntoView({
      behavior: "smooth",
    });
  });
});

/* =====================================
   FLOATING GOLD PARTICLES
===================================== */

function createGoldParticle() {
  const particle = document.createElement("div");

  particle.classList.add("gold-particle");

  particle.style.left = Math.random() * 100 + "vw";

  particle.style.animationDuration = 8 + Math.random() * 8 + "s";

  document.body.appendChild(particle);

  setTimeout(() => {
    particle.remove();
  }, 15000);
}

setInterval(createGoldParticle, 400);

/* =====================================
   FLOATING STARS
===================================== */

function createStars() {
  for (let i = 0; i < 40; i++) {
    const star = document.createElement("div");

    star.classList.add("star");

    const sizes = ["small", "medium", "large"];

    star.classList.add(sizes[Math.floor(Math.random() * sizes.length)]);

    star.style.top = Math.random() * 100 + "vh";

    star.style.left = Math.random() * 100 + "vw";

    star.style.animationDelay = Math.random() * 5 + "s";

    document.body.appendChild(star);
  }
}

createStars();

/* =====================================
   MOON NIGHT MODE
===================================== */

if (document.body.classList.contains("night-mode")) {
  const moon = document.createElement("div");

  moon.classList.add("moon");

  document.body.appendChild(moon);
}

/* =====================================
   PARALLAX HERO
===================================== */

window.addEventListener("scroll", () => {
  const hero = document.querySelector(".hero");

  const scroll = window.pageYOffset;

  hero.style.backgroundPositionY = scroll * 0.4 + "px";
});

/* =====================================
   SHARE INVITATION
===================================== */

function shareInvitation() {
  if (navigator.share) {
    navigator.share({
      title: "Undangan Khitanan",

      text: "Assalamu'alaikum, kami mengundang Anda untuk menghadiri acara khitanan.",

      url: window.location.href,
    });
  }
}

/* =====================================
   RSVP DYNAMIC
===================================== */

const rsvpBtn = document.querySelector(".rsvp-btn");

if (rsvpBtn) {
  const guestName = guestElement?.innerText || "Tamu";

  const waText = encodeURIComponent(
    `Assalamu'alaikum.

Saya ${guestName}
insyaAllah akan hadir pada acara khitanan.

Terima kasih.`,
  );

  rsvpBtn.href = `https://wa.me/6281234567890?text=${waText}`;
}

/* =====================================
   MUSIC AUTO PAUSE
===================================== */

document.addEventListener("visibilitychange", () => {
  if (document.hidden) {
    music.pause();
  } else {
    if (opening.style.display === "none") {
      music.play().catch(() => {});
    }
  }
});

/* =====================================
   PREVENT RIGHT CLICK
===================================== */

document.addEventListener("contextmenu", (e) => e.preventDefault());

/* =====================================
   END
===================================== */
