/* ============================================================
   GLOBAL LOGIN STATE USING LOCALSTORAGE
   ============================================================ */

function setLoggedInUser(name, email) {
  localStorage.setItem("dk_logged_in", "true");
  localStorage.setItem("dk_user_name", name || "");
  localStorage.setItem("dk_user_email", email || "");
  updateHeaderUI();
}
/* ===== REPLACED logoutUser to clear and redirect ===== */
function logoutUser() {
  // Clear only login session, NOT user profile data
  localStorage.removeItem("dk_logged_in");
  localStorage.removeItem("dk_role");
  // Keep: dk_user_name, dk_name, dk_user_email, dk_email, dk_phone, dk_address
  
  // update header then redirect to home
  try { updateHeaderUI(); } catch(e){/*ignore*/}

  // redirect to home (ensures from profile.html it always goes to index)
  const pathPrefix = window.location.pathname.includes('/pages/') ? '../' : '';
  window.location.href = pathPrefix + "index.html";
}

/* ===== updateHeaderUI: more robust key handling and name fallback ===== */
function updateHeaderUI() {
  const loginLi = document.querySelector('.right-links li:nth-child(1)');
  const signupLi = document.querySelector('.right-links li:nth-child(2)');
  const existingProfile = document.getElementById("profile-btn");

  // ---- mobile navbar-auth elements ----
  const navbarAuth = document.querySelector('.navbar-auth');
  const existingMobileProfile = document.getElementById('navbar-mobile-profile');

  // accept both variants that appear in your flows
  const isLoggedIn = localStorage.getItem("dk_logged_in") === "true";
  const storedName = localStorage.getItem("dk_user_name") || localStorage.getItem("dk_name") || "";
  const storedEmail = localStorage.getItem("dk_user_email") || localStorage.getItem("dk_email") || "";

  if (isLoggedIn) {
    if (loginLi) loginLi.style.display = "none";
    if (signupLi) signupLi.style.display = "none";

    // ---- mobile: hide Login/Sign Up links, show profile pill with dropdown ----
    if (navbarAuth) {
      navbarAuth.querySelectorAll(':scope > a').forEach(a => a.style.display = 'none');
      if (!existingMobileProfile) {
        const profilePath = window.location.pathname.includes('/pages/') ? 'profile.html' : 'pages/profile.html';
        const wrap = document.createElement('div');
        wrap.id = 'navbar-mobile-profile';
        wrap.className = 'mobile-profile-wrap';
        wrap.innerHTML = `
          <button class="navbar-auth-profile" id="mobile-profile-btn" aria-expanded="false">
            <span class="mobile-profile-avatar"><i class="fa-solid fa-user"></i></span>
            <span class="mobile-profile-name">${storedName || 'Profile'}</span>
            <i class="fa-solid fa-chevron-down mobile-profile-caret"></i>
          </button>
          <div class="mobile-profile-dropdown profile-dropdown" id="mobile-profile-dropdown">
            <div class="profile-dropdown-header">
              <div class="pd-avatar"><i class="fa-solid fa-user"></i></div>
              <div>
                <div class="pd-name">${storedName || 'User'}</div>
                <div class="pd-email">${storedEmail || ''}</div>
              </div>
            </div>
            <div class="profile-dropdown-body">
              <a href="${profilePath}" class="pd-item">
                <span class="pd-icon"><i class="fa-solid fa-id-card"></i></span> View Profile
              </a>
              <a href="${profilePath}#address" class="pd-item">
                <span class="pd-icon"><i class="fa-solid fa-map-location-dot"></i></span> My Address
              </a>
              <a href="#" class="pd-item">
                <span class="pd-icon"><i class="fa-solid fa-box-open"></i></span> My Orders
              </a>
            </div>
            <div class="profile-dropdown-footer">
              <button class="pd-logout" id="mobile-logout-btn">
                <span class="pd-icon"><i class="fa-solid fa-right-from-bracket"></i></span> Logout
              </button>
            </div>
          </div>
        `;
        navbarAuth.appendChild(wrap);

        const mobileBtn = document.getElementById('mobile-profile-btn');
        const mobileDropdown = document.getElementById('mobile-profile-dropdown');

        mobileBtn.addEventListener('click', (e) => {
          e.stopPropagation();
          const open = mobileBtn.getAttribute('aria-expanded') === 'true';
          mobileBtn.setAttribute('aria-expanded', String(!open));
          mobileDropdown.classList.toggle('open', !open);
        });

        document.addEventListener('click', () => {
          if (mobileBtn) {
            mobileBtn.setAttribute('aria-expanded', 'false');
            mobileDropdown.classList.remove('open');
          }
        });

        document.getElementById('mobile-logout-btn').addEventListener('click', (e) => {
          e.preventDefault();
          if (typeof logoutUser === 'function') {
            try { logoutUser(); } catch(err) {/**/}
          } else {
            ['dk_logged_in', 'dk_role'].forEach(k => localStorage.removeItem(k));
            updateHeaderUI();
          }
        });

      } else {
        const nameEl = existingMobileProfile.querySelector('.mobile-profile-name');
        if (nameEl) nameEl.textContent = storedName || 'Profile';
        const pdName = existingMobileProfile.querySelector('.pd-name');
        if (pdName) pdName.textContent = storedName || 'User';
        const pdEmail = existingMobileProfile.querySelector('.pd-email');
        if (pdEmail) pdEmail.textContent = storedEmail || '';
      }
    }

    if (!existingProfile) {
      const navList = document.querySelector(".right-links");
      const li = document.createElement("li");
      li.className = "profile-dropdown-wrap";
      li.innerHTML = `
        <button id="profile-btn" class="profile-pill" aria-expanded="false">
          <span class="profile-pill-avatar"><i class="fa-solid fa-user"></i></span>
          <span class="profile-pill-name">${storedName || "Profile"}</span>
          <i class="fa-solid fa-chevron-down profile-pill-caret"></i>
        </button>
        <div class="profile-dropdown" id="profile-dropdown">
          <div class="profile-dropdown-header">
            <div class="pd-avatar"><i class="fa-solid fa-user"></i></div>
            <div>
              <div class="pd-name">${storedName || "User"}</div>
              <div class="pd-email">${storedEmail || ""}</div>
            </div>
          </div>
          <div class="profile-dropdown-body">
            <a href="${window.location.pathname.includes('/pages/') ? '' : 'pages/'}profile.html" class="pd-item">
              <span class="pd-icon"><i class="fa-solid fa-id-card"></i></span> View Profile
            </a>
            <a href="${window.location.pathname.includes('/pages/') ? '' : 'pages/'}profile.html#address" class="pd-item">
              <span class="pd-icon"><i class="fa-solid fa-map-location-dot"></i></span> My Address
            </a>
            <a href="#" class="pd-item">
              <span class="pd-icon"><i class="fa-solid fa-box-open"></i></span> My Orders
            </a>
          </div>
          <div class="profile-dropdown-footer">
            <button class="pd-logout" id="header-logout-btn">
              <span class="pd-icon"><i class="fa-solid fa-right-from-bracket"></i></span> Logout
            </button>
          </div>
        </div>
      `;
      navList.appendChild(li);

      // Toggle dropdown
      const pillBtn = document.getElementById("profile-btn");
      const dropdown = document.getElementById("profile-dropdown");

      pillBtn.addEventListener("click", (e) => {
        e.stopPropagation();
        const open = pillBtn.getAttribute("aria-expanded") === "true";
        pillBtn.setAttribute("aria-expanded", String(!open));
        dropdown.classList.toggle("open", !open);
      });

      document.addEventListener("click", () => {
        pillBtn.setAttribute("aria-expanded", "false");
        dropdown.classList.remove("open");
      });

      document.getElementById("header-logout-btn").addEventListener("click", (e) => {
        e.preventDefault();
        if (typeof logoutUser === "function") {
          try { logoutUser(); } catch(err) {/**/}
        } else {
          ["dk_logged_in","dk_role"].forEach(k => localStorage.removeItem(k));
          updateHeaderUI();
        }
      });

    } else {
      // update name/email in existing dropdown
      const nameEl = document.querySelector(".pd-name");
      const emailEl = document.querySelector(".pd-email");
      const pillName = document.querySelector(".profile-pill-name");
      if (nameEl) nameEl.textContent = storedName || "User";
      if (emailEl) emailEl.textContent = storedEmail || "";
      if (pillName) pillName.textContent = storedName || "Profile";
    }

  } else {
    if (loginLi) loginLi.style.display = "inline-block";
    if (signupLi) signupLi.style.display = "inline-block";

    // ---- mobile: restore Login/Sign Up, remove profile dropdown ----
    if (navbarAuth) {
      navbarAuth.querySelectorAll(':scope > a').forEach(a => a.style.display = '');
      const mp = document.getElementById('navbar-mobile-profile');
      if (mp) mp.remove();
    }

    if (existingProfile) existingProfile.parentElement.remove();
  }
}


/* ============================================================
   GLOBAL MODAL SYSTEM
   ============================================================ */

function openModal(id) {
  const modal = document.getElementById(id);
  if (!modal) return;
  modal.style.display = "flex";
  document.body.style.overflow = "hidden";
}

function closeModal(id) {
  const modal = document.getElementById(id);
  if (!modal) return;
  modal.style.display = "none";
  document.body.style.overflow = "auto";
}

/* ============================================================
   LOGIN MODAL
   ============================================================ */

const loginModal = document.getElementById("login-modal");
const loginForm = document.getElementById("login-form");
const closeLoginBtn = loginModal?.querySelector(".close-btn");

// Close login modal if opened programmatically
if (closeLoginBtn) closeLoginBtn.addEventListener("click", () => closeModal("login-modal"));
if (loginModal) {
  window.addEventListener("click", (e) => {
    if (e.target === loginModal) closeModal("login-modal");
  });
}

/* LOGIN PASSWORD TOGGLE */
const togglePassword = document.getElementById("togglePassword");
const passwordInput = document.getElementById("password");

if (togglePassword && passwordInput) {
  togglePassword.addEventListener("click", () => {
    const type = passwordInput.type === "password" ? "text" : "password";
    passwordInput.type = type;
    togglePassword.classList.toggle("fa-eye-slash");
  });
}

/* LOGIN SUBMIT */
if (loginForm) {
  loginForm.addEventListener("submit", (e) => {
    e.preventDefault();

    const email = loginForm.querySelector('input[type="email"]').value.trim();
    const pass = passwordInput?.value.trim();

    if (!email || !pass) {
      alert("Please enter both email and password.");
      return;
    }

    // hide real login btn
    const realLoginBtn = document.getElementById("real-login-btn");
    if (realLoginBtn) realLoginBtn.classList.add("hidden");

    // show role options
    const roleOptions = document.getElementById("login-role-options");
    if (roleOptions) roleOptions.classList.remove("hidden");

    localStorage.setItem("dk_email", email);
  });
}

/* LOGIN ROLE CHOICE */
const loginUser = document.getElementById("login-user");
const loginBrand = document.getElementById("login-brand");

if (loginUser) {
  loginUser.onclick = () => {
    localStorage.setItem("dk_logged_in", "true");
    localStorage.setItem("dk_role", "user");
    closeModal("login-modal");
    updateHeaderUI();
  };
}

if (loginBrand) {
  loginBrand.onclick = () => {
    localStorage.setItem("dk_logged_in", "true");
    localStorage.setItem("dk_role", "brand");
    closeModal("login-modal");
    updateHeaderUI();
  };
}

/* ============================================================
   SIGNUP MODAL
   ============================================================ */

const signupModal = document.getElementById("signup-modal");
const signupClose = signupModal?.querySelector(".close-btn");
const signupForm = document.getElementById("signup-form");
const signupToggle = document.getElementById("toggleSignupPassword");
const signupPassword = document.getElementById("signup-password");

// Close signup modal if opened programmatically
if (signupClose) signupClose.addEventListener("click", () => closeModal("signup-modal"));
if (signupModal) {
  signupModal.addEventListener("click", (e) => {
    if (e.target === signupModal) closeModal("signup-modal");
  });
}

if (signupToggle && signupPassword) {
  signupToggle.addEventListener("click", () => {
    const type = signupPassword.type === "password" ? "text" : "password";
    signupPassword.type = type;
    signupToggle.classList.toggle("fa-eye-slash");
  });
}

if (signupForm) {
  signupForm.addEventListener("submit", (e) => {
    e.preventDefault();

    const email = signupForm.querySelector('input[type="email"]').value.trim();
    const name = signupForm.querySelector('input[type="text"]').value.trim();
    const pass = signupPassword?.value.trim();

    if (!email || !pass || !name) {
      alert("Please fill out all fields.");
      return;
    }

    const realSignupBtn = document.getElementById("real-signup-btn");
    if (realSignupBtn) realSignupBtn.classList.add("hidden");

    const roleOptions = document.getElementById("signup-role-options");
    if (roleOptions) roleOptions.classList.remove("hidden");

    localStorage.setItem("dk_name", name);
    localStorage.setItem("dk_email", email);
  });
}

/* SIGNUP ROLE CHOICE */
const signupUser = document.getElementById("signup-user");
const signupBrand = document.getElementById("signup-brand");

if (signupUser) {
  signupUser.onclick = () => {
    localStorage.setItem("dk_logged_in", "true");
    localStorage.setItem("dk_role", "user");
    closeModal("signup-modal");
    updateHeaderUI();
  };
}

if (signupBrand) {
  signupBrand.onclick = () => {
    localStorage.setItem("dk_logged_in", "true");
    localStorage.setItem("dk_role", "brand");
    closeModal("signup-modal");
    updateHeaderUI();
  };
}

/* ============================================================
   CONTACT MODAL
   ============================================================ */

const contactBtn = document.querySelector('.right-links li:nth-child(3) a');
const contactModal = document.getElementById("contact-modal");
const contactClose = contactModal?.querySelector(".close-btn");
const contactForm = document.getElementById("contact-form");

if (contactBtn && contactModal) {
  contactBtn.addEventListener("click", (e) => {
    e.preventDefault();
    openModal("contact-modal");
  });

  if (contactClose) contactClose.addEventListener("click", () => closeModal("contact-modal"));

  contactModal.addEventListener("click", (e) => {
    if (e.target === contactModal) closeModal("contact-modal");
  });
}

if (contactForm) {
  contactForm.addEventListener("submit", (e) => {
    e.preventDefault();
    alert("Thanks for contacting us! Our support team will get back shortly.");
    closeModal("contact-modal");
    contactForm.reset();
  });
}

/* ============================================================
   TELEPHONE MODAL
   ============================================================ */

const telephoneBtn = document.querySelector('.right-links li:nth-child(4) a');
const telephoneModal = document.getElementById("telephone-modal");
const telephoneClose = telephoneModal?.querySelector(".close-btn");
const telephoneGotIt = document.getElementById("close-tel");

if (telephoneBtn && telephoneModal) {
  telephoneBtn.addEventListener("click", (e) => {
    e.preventDefault();
    openModal("telephone-modal");
  });

  if (telephoneClose) telephoneClose.addEventListener("click", () => closeModal("telephone-modal"));
  if (telephoneGotIt) telephoneGotIt.addEventListener("click", () => closeModal("telephone-modal"));
}

/* ============================================================
   ACTIVE NAV LINK HIGHLIGHT
   ============================================================ */

document.addEventListener("DOMContentLoaded", () => {
  const current = window.location.pathname.split("/").pop();
  const links = document.querySelectorAll(".nav-links a");

  links.forEach(link => {
    if (link.getAttribute("href") === current) {
      link.classList.add("active");
    }
  });
});

/* ============================================================
   PARTNER CTA BUTTON
   ============================================================ */

document.addEventListener("DOMContentLoaded", () => {
  const partnerBtn = document.getElementById("partner-contact-btn");
  if (partnerBtn) {
    partnerBtn.addEventListener("click", () => {
      const pathPrefix = window.location.pathname.includes('/pages/') ? '' : 'pages/';
      window.location.href = pathPrefix + "contact.html";
    });
  }
});

document.addEventListener("DOMContentLoaded", updateHeaderUI);

/* ============================================================
   HAMBURGER MENU TOGGLE
   ============================================================ */
(function () {
  const btn = document.getElementById('hamburger-btn');
  const links = document.getElementById('nav-links');
  if (!btn || !links) return;

  btn.addEventListener('click', function (e) {
    e.stopPropagation();
    const isOpen = links.classList.toggle('is-open');
    btn.classList.toggle('open', isOpen);
    btn.setAttribute('aria-expanded', String(isOpen));
  });

  // Close menu on outside click
  document.addEventListener('click', function (e) {
    if (!btn.contains(e.target) && !links.contains(e.target)) {
      links.classList.remove('is-open');
      btn.classList.remove('open');
      btn.setAttribute('aria-expanded', 'false');
    }
  });

  // Close menu when a nav link is clicked
  links.querySelectorAll('a').forEach(function (link) {
    link.addEventListener('click', function () {
      links.classList.remove('is-open');
      btn.classList.remove('open');
      btn.setAttribute('aria-expanded', 'false');
    });
  });
})();
