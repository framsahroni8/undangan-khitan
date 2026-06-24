import {
  db,
  doc,
  getDoc,
  collection,
  addDoc,
  query,
  orderBy,
  onSnapshot,
} from "./firebase.js";

/* =====================================
   PREMIUM KHITANAN INVITATION
===================================== */

/* =====================================
   ELEMENT
===================================== */

const loader = document.getElementById("loader");
const openBtn = document.getElementById("openInvitation");
const opening = document.getElementById("opening");
const music = document.getElementById("bgMusic");
const mainContent = document.getElementById("mainContent");

const guestElements = document.querySelectorAll(".guestName");

const daysElement = document.getElementById("days");
const hoursElement = document.getElementById("hours");
const minutesElement = document.getElementById("minutes");
const secondsElement = document.getElementById("seconds");

const lightbox = document.getElementById("lightbox");
const lightboxImage = document.getElementById("lightboxImage");

const qrisImage = document.getElementById("qrisImage");
const qrisModal = document.getElementById("qrisModal");
const closeQris = document.getElementById("closeQris");

const wishForm = document.getElementById("wishForm");
const wishName = document.getElementById("wishName");
const wishMessage = document.getElementById("wishMessage");
const wishList = document.getElementById("wishList");

const rsvpBtn = document.querySelector(".rsvp-btn");

const params = new URLSearchParams(window.location.search);
const guestId = params.get("guest");

let currentGuest = {
  nama: "Tamu Undangan",
  kehadiran: false,
  person: 1,
};

/* =====================================
   AOS INIT
===================================== */

document.addEventListener("DOMContentLoaded", () => {
  if (typeof AOS !== "undefined") {
    AOS.init({
      duration: 1000,
      once: true,
    });
  }
});

/* =====================================
   LOADER
===================================== */

window.addEventListener("load", () => {
  if (!loader) return;

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

openBtn?.addEventListener("click", () => {
  if (opening) {
    opening.style.opacity = "0";
    opening.style.pointerEvents = "none";

    setTimeout(() => {
      opening.style.display = "none";
    }, 800);
  }

  if (mainContent) {
    mainContent.style.opacity = "1";
    mainContent.style.visibility = "visible";
  }

  if (music) {
    music.play().catch(() => {});
  }

  document.body.style.overflowY = "auto";
});

/* =====================================
   NAMA TAMU DARI FIRESTORE
   URL:
   index.html?guest=DOCUMENT_ID_FIRESTORE

   Collection:
   nama-tamu

   Field:
   - nama: string
   - kehadiran: boolean
   - person: number
===================================== */

function setGuestName(nama) {
  guestElements.forEach((element) => {
    element.textContent = nama;
  });
}

async function loadGuestName() {
  if (!guestId) {
    setGuestName("Tamu Undangan");
    updateRsvpLink();
    return;
  }

  try {
    const guestRef = doc(db, "nama-tamu", guestId);
    const guestSnapshot = await getDoc(guestRef);

    if (guestSnapshot.exists()) {
      const guestData = guestSnapshot.data();

      currentGuest = {
        nama: guestData.nama || "Tamu Undangan",
        kehadiran: Boolean(guestData.kehadiran),
        person: Number(guestData.person || 1),
      };

      setGuestName(currentGuest.nama);

      if (wishName) {
        wishName.value = currentGuest.nama;
      }
    } else {
      console.warn("Data tamu tidak ditemukan dengan ID:", guestId);

      currentGuest = {
        nama: "Tamu Undangan",
        kehadiran: false,
        person: 1,
      };

      setGuestName("Tamu Undangan");
    }
  } catch (error) {
    console.error("Gagal mengambil data tamu:", error);

    currentGuest = {
      nama: "Tamu Undangan",
      kehadiran: false,
      person: 1,
    };

    setGuestName("Tamu Undangan");
  }

  updateRsvpLink();
}

/* =====================================
   RSVP WHATSAPP DINAMIS
===================================== */

function updateRsvpLink() {
  if (!rsvpBtn) return;

  const namaTamu = currentGuest.nama || "Tamu Undangan";
  const jumlahOrang = currentGuest.person || 1;

  const message = encodeURIComponent(
    `Assalamu'alaikum.

Saya ${namaTamu}
InsyaAllah akan hadir pada acara khitanan.

Jumlah kehadiran: ${jumlahOrang} orang.

Terima kasih.`,
  );

  rsvpBtn.href = `https://wa.me/6281234567890?text=${message}`;
}

/* =====================================
   COUNTDOWN
===================================== */

const targetDate = new Date("July 20, 2026 09:00:00").getTime();

function countdown() {
  const now = new Date().getTime();
  const distance = targetDate - now;

  if (distance <= 0) {
    if (daysElement) daysElement.textContent = "00";
    if (hoursElement) hoursElement.textContent = "00";
    if (minutesElement) minutesElement.textContent = "00";
    if (secondsElement) secondsElement.textContent = "00";
    return;
  }

  const days = Math.floor(distance / (1000 * 60 * 60 * 24));

  const hours = Math.floor(
    (distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60),
  );

  const minutes = Math.floor(
    (distance % (1000 * 60 * 60)) / (1000 * 60),
  );

  const seconds = Math.floor((distance % (1000 * 60)) / 1000);

  if (daysElement) {
    daysElement.textContent = days.toString().padStart(2, "0");
  }

  if (hoursElement) {
    hoursElement.textContent = hours.toString().padStart(2, "0");
  }

  if (minutesElement) {
    minutesElement.textContent = minutes.toString().padStart(2, "0");
  }

  if (secondsElement) {
    secondsElement.textContent = seconds.toString().padStart(2, "0");
  }
}

countdown();
setInterval(countdown, 1000);

/* =====================================
   SWIPER GALLERY
===================================== */

if (typeof Swiper !== "undefined") {
  new Swiper(".gallerySwiper", {
    loop: true,
    speed: 800,

    autoplay: {
      delay: 3000,
      disableOnInteraction: false,
    },

    pagination: {
      el: ".swiper-pagination",
      clickable: true,
    },
  });
}

/* =====================================
   LIGHTBOX GALERI
===================================== */

document.querySelectorAll(".swiper-slide img").forEach((image) => {
  image.addEventListener("click", () => {
    if (!lightbox || !lightboxImage) return;

    lightboxImage.src = image.src;
    lightbox.style.display = "flex";
  });
});

lightbox?.addEventListener("click", () => {
  lightbox.style.display = "none";
});

/* =====================================
   COPY NOMOR REKENING
===================================== */

document.querySelectorAll(".copy-btn").forEach((button) => {
  button.addEventListener("click", async () => {
    const rekening = button.dataset.rekening;

    if (!rekening) {
      alert("Nomor rekening belum tersedia.");
      return;
    }

    try {
      await navigator.clipboard.writeText(rekening);

      const originalText = button.textContent;

      button.textContent = "Berhasil Disalin";

      setTimeout(() => {
        button.textContent = originalText;
      }, 2000);
    } catch (error) {
      console.error("Gagal menyalin rekening:", error);
      alert("Gagal menyalin nomor rekening.");
    }
  });
});

/* =====================================
   QRIS MODAL
===================================== */

qrisImage?.addEventListener("click", () => {
  if (qrisModal) {
    qrisModal.style.display = "flex";
  }
});

closeQris?.addEventListener("click", () => {
  if (qrisModal) {
    qrisModal.style.display = "none";
  }
});

qrisModal?.addEventListener("click", (event) => {
  if (event.target === qrisModal) {
    qrisModal.style.display = "none";
  }
});

/* =====================================
   UCAPAN TAMU REALTIME
   Collection: ucapan-tamu

   Field:
   - nama: string
   - ucapan: string
===================================== */

function escapeHtml(text) {
  const element = document.createElement("div");
  element.textContent = text || "";
  return element.innerHTML;
}

if (wishForm && wishName && wishMessage && wishList) {
  wishForm.addEventListener("submit", async (event) => {
    event.preventDefault();

    const nama = wishName.value.trim();
    const ucapan = wishMessage.value.trim();

    if (!nama || !ucapan) {
      alert("Nama dan ucapan wajib diisi.");
      return;
    }

    const submitButton = wishForm.querySelector("button");

    try {
      if (submitButton) {
        submitButton.disabled = true;
        submitButton.textContent = "Mengirim...";
      }

      await addDoc(collection(db, "ucapan-tamu"), {
        nama: nama,
        ucapan: ucapan,
      });

      wishMessage.value = "";

      alert("Ucapan berhasil dikirim. Terima kasih.");
    } catch (error) {
      console.error("Gagal mengirim ucapan:", error);
      alert("Ucapan gagal dikirim. Silakan coba lagi.");
    } finally {
      if (submitButton) {
        submitButton.disabled = false;
        submitButton.textContent = "Kirim Ucapan";
      }
    }
  });

  const ucapanQuery = query(
    collection(db, "ucapan-tamu"),
    orderBy("nama", "asc"),
  );

  onSnapshot(
    ucapanQuery,
    (snapshot) => {
      if (snapshot.empty) {
        wishList.innerHTML = `
          <div class="wish-card">
            <p>Belum ada ucapan. Jadilah yang pertama memberikan doa terbaik.</p>
          </div>
        `;
        return;
      }

      wishList.innerHTML = snapshot.docs
        .map((item) => {
          const data = item.data();

          return `
            <article class="wish-card">
              <h4>${escapeHtml(data.nama)}</h4>
              <p>${escapeHtml(data.ucapan)}</p>
            </article>
          `;
        })
        .join("");

      if (typeof AOS !== "undefined") {
        AOS.refresh();
      }
    },
    (error) => {
      console.error("Gagal memuat ucapan:", error);

      wishList.innerHTML = `
        <div class="wish-card">
          <p>Ucapan belum dapat dimuat.</p>
        </div>
      `;
    },
  );
}

/* =====================================
   AUTO DARK MODE
===================================== */

const currentHour = new Date().getHours();

if (currentHour >= 18 || currentHour <= 5) {
  document.body.classList.add("night-mode");

  const moon = document.createElement("div");
  moon.classList.add("moon");

  document.body.appendChild(moon);
}

/* =====================================
   ACTIVE BOTTOM NAV
===================================== */

const sections = document.querySelectorAll("section[id]");
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
  link.addEventListener("click", (event) => {
    const targetId = link.getAttribute("href");

    if (!targetId || !targetId.startsWith("#")) return;

    const target = document.querySelector(targetId);

    if (target) {
      event.preventDefault();

      target.scrollIntoView({
        behavior: "smooth",
      });
    }
  });
});

/* =====================================
   FLOATING GOLD PARTICLES
===================================== */

function createGoldParticle() {
  const particle = document.createElement("div");

  particle.classList.add("gold-particle");
  particle.style.left = `${Math.random() * 100}vw`;
  particle.style.animationDuration = `${8 + Math.random() * 8}s`;

  document.body.appendChild(particle);

  setTimeout(() => {
    particle.remove();
  }, 16000);
}

setInterval(createGoldParticle, 600);

/* =====================================
   FLOATING STARS
===================================== */

function createStars() {
  const sizes = ["small", "medium", "large"];

  for (let index = 0; index < 40; index += 1) {
    const star = document.createElement("div");

    star.classList.add("star");
    star.classList.add(sizes[Math.floor(Math.random() * sizes.length)]);

    star.style.top = `${Math.random() * 100}vh`;
    star.style.left = `${Math.random() * 100}vw`;
    star.style.animationDelay = `${Math.random() * 5}s`;

    document.body.appendChild(star);
  }
}

createStars();

/* =====================================
   PARALLAX HERO
===================================== */

window.addEventListener("scroll", () => {
  const hero = document.querySelector(".hero");

  if (!hero) return;

  const scroll = window.pageYOffset;

  hero.style.backgroundPositionY = `${scroll * 0.25}px`;
});

/* =====================================
   MUSIC AUTO PAUSE
===================================== */

document.addEventListener("visibilitychange", () => {
  if (!music) return;

  if (document.hidden) {
    music.pause();
  } else if (opening?.style.display === "none") {
    music.play().catch(() => {});
  }
});

/* =====================================
   LOAD DATA AWAL
===================================== */

loadGuestName();