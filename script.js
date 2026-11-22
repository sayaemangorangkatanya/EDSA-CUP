/* ==========================================================
   EDSA CUP 2026 - script.js
   ========================================================== */

/* ---------- CONFIG: edit this part only ---------- */
const CONFIG = {
  // Ganti dengan link pendaftaran (Google Form, dll.)
  registerUrl: "#",

  // Instagram
  instagram: {
    text: "@edsacup.26",
    href: "https://www.instagram.com/edsacup.26/reels/",
  },

  // Contact person WhatsApp (href = wa.me/<nomor tanpa + dan tanpa 0 depan>)
  contacts: [
    { label: "Jihan", text: "+62 812-6570-0706", href: "https://wa.me/6281265700706" },
    { label: "Farah", text: "+62 895-3208-54856", href: "https://wa.me/62895320854856" },
  ],
};
/* ------------------------------------------------- */

document.addEventListener("DOMContentLoaded", () => {
  setupRegisterLinks();
  renderContacts();
  setupInstagram();
  setupNavbarShadow();

  // animasi reveal baru mulai setelah intro selesai
  setupIntro(() => setTimeout(setupRevealOnScroll, 250));
});

/* Sudah pernah lihat intro di tab ini? (aman kalau storage diblokir browser) */
function introSeen() {
  try {
    return !!sessionStorage.getItem("edsaIntroSeen");
  } catch (e) {
    return false;
  }
}

/* Intro: full-screen video, lalu slide ke atas. Hanya sekali per kunjungan. */
function setupIntro(onDone) {
  const intro = document.getElementById("intro");
  const video = document.getElementById("intro-video");
  const skip = document.getElementById("intro-skip");
  const body = document.body;

  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  // tidak ada intro / user minta minim animasi / sudah pernah lihat di kunjungan ini
  if (!intro || !video || reduceMotion || introSeen()) {
    if (intro) intro.remove();
    body.classList.remove("is-intro");
    onDone();
    return;
  }

  let finished = false;
  let timer;

  const finish = () => {
    if (finished) return;
    finished = true;
    clearTimeout(timer);

    try { sessionStorage.setItem("edsaIntroSeen", "1"); } catch (e) { /* abaikan */ }

    window.scrollTo(0, 0);
    intro.classList.add("is-hidden"); // slide ke atas
    body.classList.remove("is-intro");
    video.pause();

    setTimeout(() => intro.remove(), 1100);
    onDone();
  };

  video.addEventListener("ended", finish);
  video.addEventListener("error", finish);
  skip.addEventListener("click", finish);

  // kalau video belum jalan dalam 8 detik (koneksi lambat / diblokir), lewati
  timer = setTimeout(finish, 8000);

  // begitu mulai main, pasang pengaman sesuai durasi video
  video.addEventListener("playing", () => {
    clearTimeout(timer);
    const remaining = isFinite(video.duration) ? (video.duration - video.currentTime) * 1000 : 15000;
    timer = setTimeout(finish, remaining + 2000);
  }, { once: true });

  // 1) coba putar DENGAN suara
  video.muted = false;
  const attempt = video.play();

  if (attempt && typeof attempt.catch === "function") {
    attempt.catch(() => {
      // 2) browser memblokir suara otomatis -> putar tanpa suara dulu,
      //    lalu nyalakan suara begitu pengunjung menyentuh/klik layar
      video.muted = true;

      const enableSound = () => {
        video.muted = false;
        ["pointerdown", "touchstart", "keydown"].forEach((ev) =>
          window.removeEventListener(ev, enableSound)
        );
      };
      ["pointerdown", "touchstart", "keydown"].forEach((ev) =>
        window.addEventListener(ev, enableSound, { passive: true })
      );

      const fallback = video.play();
      if (fallback && typeof fallback.catch === "function") fallback.catch(finish);
    });
  }
}

/* All buttons with [data-register] point to the same registration link */
function setupRegisterLinks() {
  const isPlaceholder = CONFIG.registerUrl === "#" || CONFIG.registerUrl.trim() === "";

  document.querySelectorAll("[data-register]").forEach((el) => {
    el.setAttribute("href", CONFIG.registerUrl);

    if (isPlaceholder) {
      // belum ada link: jangan lompat ke atas halaman
      el.addEventListener("click", (e) => e.preventDefault());
      return;
    }

    el.setAttribute("target", "_blank");
    el.setAttribute("rel", "noopener noreferrer");
  });
}

/* Build contact list in the footer */
function renderContacts() {
  const box = document.getElementById("contact-list");
  if (!box) return;

  if (!CONFIG.contacts.length) {
    box.remove();
    return;
  }

  CONFIG.contacts.forEach((c) => {
    const li = document.createElement("li");
    li.append(`${c.label} (WhatsApp): `);

    const a = document.createElement("a");
    a.textContent = c.text;
    a.href = c.href || "#";
    if (c.href) {
      a.target = "_blank";
      a.rel = "noopener noreferrer";
    }

    li.append(a);
    box.append(li);
  });
}

/* Instagram link in the footer */
function setupInstagram() {
  const link = document.getElementById("instagram-link");
  const text = document.getElementById("instagram-text");
  if (!link || !CONFIG.instagram) return;

  link.href = CONFIG.instagram.href;
  if (text) text.textContent = CONFIG.instagram.text;
}

/* Shadow on navbar after scrolling */
function setupNavbarShadow() {
  const navbar = document.getElementById("navbar");
  if (!navbar) return;

  const onScroll = () => navbar.classList.toggle("is-scrolled", window.scrollY > 10);
  onScroll();
  window.addEventListener("scroll", onScroll, { passive: true });
}

/* Fade-in elements when they enter the viewport */
function setupRevealOnScroll() {
  const items = document.querySelectorAll(".reveal");
  if (!items.length) return;

  if (!("IntersectionObserver" in window)) {
    items.forEach((el) => el.classList.add("is-visible"));
    return;
  }

  const observer = new IntersectionObserver(
    (entries, obs) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          obs.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.15 }
  );

  items.forEach((el) => observer.observe(el));
}