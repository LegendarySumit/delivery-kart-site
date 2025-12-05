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

  // accept both variants that appear in your flows
  const isLoggedIn = localStorage.getItem("dk_logged_in") === "true";
  const storedName = localStorage.getItem("dk_user_name") || localStorage.getItem("dk_name") || "";
  const storedEmail = localStorage.getItem("dk_user_email") || localStorage.getItem("dk_email") || "";

  if (isLoggedIn) {
    if (loginLi) loginLi.style.display = "none";
    if (signupLi) signupLi.style.display = "none";

    if (!existingProfile) {
      const navList = document.querySelector(".right-links");
      const li = document.createElement("li");

      li.innerHTML = `
        <a href="#" id="profile-btn">${storedName ? storedName : "Profile"} <i class="fa-solid fa-user"></i></a>
      `;

      navList.appendChild(li);

      document.getElementById("profile-btn").onclick = (e) => {
        e.preventDefault();
        const role = localStorage.getItem("dk_role") || "user";
        const pathPrefix = window.location.pathname.includes('/pages/') ? '' : 'pages/';
        window.location.href = `${pathPrefix}profile.html?mode=${role}`;
      };
    } else {
      // if profile link exists update label
      existingProfile.innerHTML = `${storedName ? storedName : "Profile"} <i class="fa-solid fa-user"></i>`;
    }

  } else {
    if (loginLi) loginLi.style.display = "inline-block";
    if (signupLi) signupLi.style.display = "inline-block";

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

const loginBtn = document.getElementById("login-btn");
const loginModal = document.getElementById("login-modal");
const loginForm = document.getElementById("login-form");
const closeLoginBtn = loginModal?.querySelector(".close-btn");

if (loginBtn && loginModal) {
  loginBtn.addEventListener("click", (e) => {
    e.preventDefault();
    openModal("login-modal");
  });

  if (closeLoginBtn) closeLoginBtn.addEventListener("click", () => closeModal("login-modal"));

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

const signupBtn = document.querySelector('.right-links li:nth-child(2) a');
const signupModal = document.getElementById("signup-modal");
const signupClose = signupModal?.querySelector(".close-btn");
const signupForm = document.getElementById("signup-form");
const signupToggle = document.getElementById("toggleSignupPassword");
const signupPassword = document.getElementById("signup-password");

if (signupBtn && signupModal) {
  signupBtn.addEventListener("click", (e) => {
    e.preventDefault();
    openModal("signup-modal");
  });

  if (signupClose) signupClose.addEventListener("click", () => closeModal("signup-modal"));

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
