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

  // transisi antar halaman -> intro (kalau ada) -> animasi reveal
  setupPageTransition(() => {
    setupIntro(() => setTimeout(setupRevealOnScroll, 250));
  });
});

/* Transisi antar halaman dengan layar putih.
   Maju  (index -> register): putih naik dari bawah, di halaman baru slide ke ATAS.
   Balik (register -> index): putih turun dari atas, di halaman baru slide ke BAWAH.
   Urutan halaman ada di ORDER; makin kecil nomornya = makin "awal". */
function setupPageTransition(onReady) {
  const body = document.body;
  const LAST_KEY = "edsaLastPage";
  const ORDER = ["index", "register"];
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  const pageId = (pathname) => {
    const name = pathname.split("/").pop().replace(/\.html$/i, "");
    return name || "index";
  };
  const rank = (id) => Math.max(0, ORDER.indexOf(id));
  const isBack = (fromId, toId) => rank(toId) < rank(fromId);

  const getLast = () => { try { return sessionStorage.getItem(LAST_KEY); } catch (e) { return null; } };
  const setLast = (id) => { try { sessionStorage.setItem(LAST_KEY, id); } catch (e) { /* abaikan */ } };

  const current = pageId(window.location.pathname);
  const last = getLast();
  setLast(current);

  // Kalau intro video akan diputar, intro itu sendiri yang jadi pembuka -> lewati transisi
  const introWillPlay = !!document.getElementById("intro") && !introSeen() && !reduceMotion;
  const arrivedFromOtherPage = !!last && last !== current;

  /* ---- MASUK ---- */
  if (!arrivedFromOtherPage || reduceMotion || introWillPlay) {
    body.classList.add("wipe-skip"); // tidak ada animasi, layar putih langsung hilang
    onReady();
  } else {
    if (isBack(last, current)) body.classList.add("wipe-back"); // balik -> slide ke bawah

    let revealed = false;
    const reveal = () => {
      if (revealed) return;
      revealed = true;
      requestAnimationFrame(() => {
        body.classList.add("wipe-done");
        setTimeout(onReady, 250);
      });
    };
    // tunggu halaman selesai dimuat (maksimal 1,2 detik)
    if (document.readyState === "complete") reveal();
    else {
      window.addEventListener("load", reveal, { once: true });
      setTimeout(reveal, 1200);
    }
  }

  if (reduceMotion) return;

  /* ---- KELUAR (klik link ke halaman lain) ---- */
  document.addEventListener("click", (e) => {
    if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;

    const a = e.target.closest ? e.target.closest("a[href]") : null;
    if (!a || (a.target && a.target !== "_self") || a.hasAttribute("download")) return;

    let url;
    try { url = new URL(a.href, window.location.href); } catch (err) { return; }

    // hanya link internal ke halaman lain (bukan #anchor di halaman yang sama / link luar)
    if (url.protocol !== window.location.protocol || url.host !== window.location.host) return;
    if (url.pathname === window.location.pathname) return;

    e.preventDefault();
    if (body.classList.contains("wipe-out")) return; // sudah berjalan

    const back = isBack(current, pageId(url.pathname));

    // siapkan posisi awal layar putih TANPA animasi (atas kalau balik, bawah kalau maju)
    body.classList.remove("wipe-after-up", "wipe-after-down");
    body.classList.add("wipe-reset");
    body.classList.toggle("wipe-from-top", back);
    void body.offsetWidth; // paksa browser menerapkan posisi awal
    body.classList.remove("wipe-reset");

    body.classList.add("wipe-out"); // layar putih menutup
    setTimeout(() => { window.location.href = url.href; }, 650);

    // pengaman: kalau pindah halaman macet, kembalikan tampilan
    setTimeout(() => body.classList.remove("wipe-out"), 5000);
  });

  /* ---- Tombol Back/Forward browser: halaman dipulihkan dari cache dalam keadaan tertutup putih ---- */
  window.addEventListener("pageshow", (e) => {
    if (!e.persisted) return;

    const from = getLast();
    setLast(current);
    const back = !!from && from !== current && isBack(from, current);

    if (body.classList.contains("wipe-out")) {
      // putih sedang menutup -> buka ke arah yang sesuai
      body.classList.add(back ? "wipe-after-down" : "wipe-after-up");
      body.classList.remove("wipe-out");
    }
  });
}

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
    return;a
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