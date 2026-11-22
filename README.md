<p align="center">
  <img src="Picture/Edsa cup.png" alt="EDSA logo" width="160">
</p>

<h1 align="center">EDSA Cup 2026</h1>

<p align="center">
  <em>More Than a Competition, It's a Celebration of Unity.</em><br>
  Official website of the EDSA Cup 26 sports tournament, organized by the<br>
  <strong>English Department Student Association (EDSA)</strong>, UIN Ar-Raniry, Banda Aceh.
</p>

<p align="center">
  <a href="https://sayaemangorangkatanya.github.io/EDSA-CUP/"><strong>Visit the website</strong></a>
  &nbsp;·&nbsp;
  <a href="https://sayaemangorangkatanya.github.io/EDSA-CUP/register.html"><strong>Register</strong></a>
  &nbsp;·&nbsp;
  <a href="https://www.instagram.com/edsacup.26/"><strong>Instagram</strong></a>
</p>

---

## About

EDSA Cup 26 is a sports tournament that brings students together through the spirit of
sportsmanship, teamwork, and healthy competition. This repository contains the event's
static website, where visitors can read about the competitions and register.

**Play Bold, Stay Gold.**

## Competitions

| | Futsal | Badminton |
|---|---|---|
| **Event date** | 6 December 2026 | 5 & 6 December 2026 |
| **Location** | Zidane Futsal | UIN Ar-Raniry |
| **Registration** | 23 - 30 November 2026 | 23 - 30 November 2026 |
| **Fee** | Rp 500.000 / team | Rp 80.000 / student, Rp 100.000 / lecturer (per person) |

Registration is done through Google Forms. The links and QR codes are on the
[register page](https://sayaemangorangkatanya.github.io/EDSA-CUP/register.html).

## Features

- Two pages: a home page (about, competitions, contact) and a register page
- Full-screen intro video that plays once per visit, then slides up
- White slide transition between pages (reversed direction when going back)
- Registration links and QR codes for each category
- Contact person (WhatsApp) and Instagram, filled in from one config
- Responsive layout for desktop and mobile
- Plain HTML, CSS, and JavaScript, with no build step or framework

## Project structure

```
EDSA-CUP/
├── index.html        # Home page
├── register.html     # Registration page
├── style.css         # Shared styles (navbar, footer, intro, transitions, home page)
├── register.css      # Styles for the register page
├── script.js         # Intro video, page transition, contacts, scroll animation
├── Background/       # Section background frames (1920 x 1000)
├── Picture/          # Logos, photos, mascots, QR codes
└── Video/            # Intro motion video (.mp4)
```

## Run locally

No installation is needed.

1. Clone or download this repository.
2. Open `index.html` in a browser.

For the most accurate result (video, fonts, and page transitions), serve the folder with a
local server, for example the **Live Server** extension in VS Code, or:

```bash
python3 -m http.server 8000
# then open http://localhost:8000
```

## Editing content

| What to change | Where |
|---|---|
| Contact persons (WhatsApp) and Instagram | `CONFIG` at the top of `script.js` |
| Event dates, fees, and location | `index.html` and `register.html` |
| Registration form links | `register.html` (each "Open Form" button and QR link) |
| QR code images | `Picture/` (replace the files, keep the same names) |
| Page order for transition direction | `ORDER` inside `setupPageTransition()` in `script.js` |
| Colors and fonts | `:root` variables at the top of `style.css` |

## Deployment

The site is hosted on **GitHub Pages**.

1. Go to **Settings → Pages**.
2. Under **Build and deployment**, choose **Deploy from a branch**.
3. Select the `main` branch and the `/ (root)` folder, then save.

After each push, wait a minute or two and hard refresh (`Ctrl + F5`) to see the update.

> **Note:** GitHub Pages is case-sensitive. File and folder names must match exactly
> (for example `Picture/MAHASISWA.png` is not the same as `picture/mahasiswa.png`).

## Built with

- HTML5, CSS3, and vanilla JavaScript
- [Montserrat](https://fonts.google.com/specimen/Montserrat) via Google Fonts

## Credits

- Organized by the **English Department Student Association (EDSA)**, UIN Ar-Raniry
- Design and development by **M. Zuhry Rustam (Jupry)**

---

<p align="center">
  &copy; 2026 English Department Student Association (EDSA) · UIN Ar-Raniry
</p>
