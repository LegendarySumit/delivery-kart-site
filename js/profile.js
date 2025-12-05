// profile.js
// Handles localStorage persistence and UI wiring for profile.html

(function () {
  "use strict";

  // Local storage keys: keep compatibility with previous keys
  const Keys = {
    name1: "dk_user_name",
    name2: "dk_name",
    email1: "dk_user_email",
    email2: "dk_email",
    phone: "dk_phone",
    address: "dk_address",
    logged: "dk_logged_in",
    role: "dk_role"
  };

  const LS = {
    getName() { return localStorage.getItem(Keys.name1) || localStorage.getItem(Keys.name2) || ""; },
    setName(v) { 
      localStorage.setItem(Keys.name1, v || ""); 
      localStorage.setItem(Keys.name2, v || ""); 
    },
    getEmail() { return localStorage.getItem(Keys.email1) || localStorage.getItem(Keys.email2) || ""; },
    setEmail(v) { 
      localStorage.setItem(Keys.email1, v || ""); 
      localStorage.setItem(Keys.email2, v || ""); 
    },
    getPhone() { return localStorage.getItem(Keys.phone) || ""; },
    setPhone(v) { localStorage.setItem(Keys.phone, v || ""); },
    getAddress() { return localStorage.getItem(Keys.address) || ""; },
    setAddress(v) { localStorage.setItem(Keys.address, v || ""); },
    clearLogin() {
      localStorage.removeItem(Keys.logged);
      localStorage.removeItem(Keys.role);
      // DO NOT remove name, email, phone, address - keep user profile data
    }
  };

  // Elements
  const asideNameEl = document.getElementById("aside-name");
  const asideEmailEl = document.getElementById("aside-email");
  const nameInp = document.getElementById("name");
  const emailInp = document.getElementById("email");
  const phoneInp = document.getElementById("phone");
  const addressTa = document.getElementById("address");
  const saveProfileBtn = document.getElementById("save-profile");
  const saveAddressBtn = document.getElementById("save-address");
  const logoutBtn = document.getElementById("aside-logout");
  const continueLink = document.getElementById("aside-continue");
  const editAddressBtn = document.getElementById("edit-address-btn");

  function populateUI() {
    const name = LS.getName();
    const email = LS.getEmail();
    const phone = LS.getPhone();
    const address = LS.getAddress();

    asideNameEl.textContent = name || "User";
    asideEmailEl.textContent = email || "—";
    nameInp.value = name;
    emailInp.value = email;
    phoneInp.value = phone;
    addressTa.value = address;

    // ensure continue link respects role if present
    const role = localStorage.getItem(Keys.role) || "user";
    continueLink.href = role === "brand" ? "businesspart.html" : "index.html";
  }

  // Save profile
  saveProfileBtn.addEventListener("click", function () {
    const name = nameInp.value.trim();
    const phone = phoneInp.value.trim();

    if (name) {
      LS.setName(name);
      asideNameEl.textContent = name;
    }
    if (phone) {
      LS.setPhone(phone);
    }

    // If page didn't have an email but the user typed one elsewhere previously, we preserve.
    // (email is readonly here — it's set at signup/login)
    populateUI();

    // if the global header updater exists, call it
    if (typeof updateHeaderUI === "function") {
      try { updateHeaderUI(); } catch (e) { /* ignore */ }
    }

    // small confirmation
    showToast("Profile saved");
  });

  // Save address
  saveAddressBtn.addEventListener("click", function () {
    const addr = addressTa.value.trim();
    LS.setAddress(addr);
    populateUI();
    showToast("Default address saved");
  });

  // Edit address button - focuses the textarea and scrolls to it
  editAddressBtn.addEventListener("click", function () {
    addressTa.focus();
    addressTa.scrollIntoView({ behavior: "smooth", block: "center" });
  });

  // Logout clears login flags and redirects to homepage
  logoutBtn.addEventListener("click", function () {
    // prefer global logoutUser if present so other global cleanup happens
    if (typeof logoutUser === "function") {
      try { logoutUser(); } catch (e) { /* ignore */ }
      // logoutUser() already handles the redirect, so don't do it again
    } else {
      LS.clearLogin();
      // redirect explicitly (profile.html is in pages/ folder)
      window.location.href = "../index.html";
    }
  });

  // small toast / alert replacement (non-blocking)
  function showToast(msg) {
    // lightweight non-blocking toast: create, show, remove
    const t = document.createElement("div");
    t.textContent = msg;
    t.style.position = "fixed";
    t.style.right = "20px";
    t.style.bottom = "20px";
    t.style.background = "linear-gradient(135deg,var(--purple1),var(--purple2))";
    t.style.color = "#fff";
    t.style.padding = "10px 14px";
    t.style.borderRadius = "8px";
    t.style.boxShadow = "0 8px 20px rgba(0,0,0,0.12)";
    t.style.zIndex = 9999;
    t.style.fontWeight = 700;
    document.body.appendChild(t);
    setTimeout(()=> {
      t.style.transition = "all .3s ease";
      t.style.transform = "translateY(10px)";
      t.style.opacity = "0";
    }, 1200);
    setTimeout(()=> document.body.removeChild(t), 1600);
  }

  // init
  populateUI();

  // safety: expose a small API for testing in console
  window.__DKProfile = {
    populateUI,
    ls: LS
  };

})();
