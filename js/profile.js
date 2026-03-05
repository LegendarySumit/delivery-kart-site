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
    city: "dk_city",
    state: "dk_state",
    postal: "dk_postal",
    address: "dk_address",
    deliveryPhone: "dk_delivery_phone",
    landmark: "dk_landmark",
    defaultAddress: "dk_default_address",
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
    getCity() { return localStorage.getItem(Keys.city) || ""; },
    setCity(v) { localStorage.setItem(Keys.city, v || ""); },
    getState() { return localStorage.getItem(Keys.state) || ""; },
    setState(v) { localStorage.setItem(Keys.state, v || ""); },
    getPostal() { return localStorage.getItem(Keys.postal) || ""; },
    setPostal(v) { localStorage.setItem(Keys.postal, v || ""); },
    getAddress() { return localStorage.getItem(Keys.address) || ""; },
    setAddress(v) { localStorage.setItem(Keys.address, v || ""); },
    getDeliveryPhone() { return localStorage.getItem(Keys.deliveryPhone) || ""; },
    setDeliveryPhone(v) { localStorage.setItem(Keys.deliveryPhone, v || ""); },
    getLandmark() { return localStorage.getItem(Keys.landmark) || ""; },
    setLandmark(v) { localStorage.setItem(Keys.landmark, v || ""); },
    getDefaultAddress() { return localStorage.getItem(Keys.defaultAddress) === "true"; },
    setDefaultAddress(v) { localStorage.setItem(Keys.defaultAddress, v ? "true" : "false"); },
    clearLogin() {
      localStorage.removeItem(Keys.logged);
      localStorage.removeItem(Keys.role);
      // DO NOT remove name, email, phone, address - keep user profile data
    }
  };

  // Elements
  const asideNameEl = document.getElementById("aside-name");
  const asideEmailEl = document.getElementById("aside-email");
  const roleBadgeEl = document.getElementById("role-badge");
  const nameInp = document.getElementById("name");
  const emailInp = document.getElementById("email");
  const phoneInp = document.getElementById("phone");
  const cityInp = document.getElementById("city");
  const stateInp = document.getElementById("state");
  const postalInp = document.getElementById("postal");
  const addressTa = document.getElementById("address");
  const deliveryPhoneInp = document.getElementById("delivery-phone");
  const landmarkInp = document.getElementById("landmark");
  const defaultAddressCheck = document.getElementById("default-address");
  const saveProfileBtn = document.getElementById("save-profile");
  const saveAddressBtn = document.getElementById("save-address");
  const logoutBtn = document.getElementById("aside-logout");

  function populateUI() {
    const name = LS.getName();
    const email = LS.getEmail();
    const phone = LS.getPhone();
    const city = LS.getCity();
    const state = LS.getState();
    const postal = LS.getPostal();
    const address = LS.getAddress();
    const deliveryPhone = LS.getDeliveryPhone();
    const landmark = LS.getLandmark();
    const isDefault = LS.getDefaultAddress();
    const role = localStorage.getItem(Keys.role) || "user";

    asideNameEl.textContent = name || "User";
    asideEmailEl.textContent = email || "—";
    nameInp.value = name;
    emailInp.value = email;
    phoneInp.value = phone;
    cityInp.value = city;
    stateInp.value = state;
    postalInp.value = postal;
    addressTa.value = address;
    deliveryPhoneInp.value = deliveryPhone;
    landmarkInp.value = landmark;
    defaultAddressCheck.checked = isDefault;

    // Update role badge
    if (role === "brand") {
      roleBadgeEl.innerHTML = '<i class="fa-solid fa-store"></i> Brand Partner';
    } else {
      roleBadgeEl.innerHTML = '<i class="fa-solid fa-briefcase"></i> Personal User';
    }

    // Profile completion bar
    const fields = [name, email, phone, city, state, postal, address, deliveryPhone, landmark];
    const filled = fields.filter(Boolean).length;
    const pct = Math.round((filled / fields.length) * 100);
    const fillEl = document.getElementById("completion-fill");
    const pctEl = document.getElementById("completion-pct");
    if (fillEl) fillEl.style.width = pct + "%";
    if (pctEl) pctEl.textContent = pct + "%";

    // Last login
    const lastLoginEl = document.getElementById("last-login");
    if (lastLoginEl) {
      const stored = localStorage.getItem("dk_last_login");
      if (stored) {
        const d = new Date(stored);
        const today = new Date();
        const isToday = d.toDateString() === today.toDateString();
        lastLoginEl.textContent = isToday ? "Today" : d.toLocaleDateString("en-IN", { day: "numeric", month: "short" });
      }
    }
  }

  // Save profile
  saveProfileBtn.addEventListener("click", function () {
    const name = nameInp.value.trim();
    const phone = phoneInp.value.trim();
    const city = cityInp.value.trim();
    const state = stateInp.value.trim();
    const postal = postalInp.value.trim();

    if (name) {
      LS.setName(name);
      asideNameEl.textContent = name;
    }
    if (phone) {
      LS.setPhone(phone);
    }
    if (city) {
      LS.setCity(city);
    }
    if (state) {
      LS.setState(state);
    }
    if (postal) {
      LS.setPostal(postal);
    }

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
    const dPhone = deliveryPhoneInp.value.trim();
    const lmark = landmarkInp.value.trim();
    const isDefault = defaultAddressCheck.checked;

    LS.setAddress(addr);
    if (dPhone) LS.setDeliveryPhone(dPhone);
    if (lmark) LS.setLandmark(lmark);
    LS.setDefaultAddress(isDefault);

    populateUI();
    showToast("Address saved successfully");
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

  // Stamp last login on first visit to this session
  if (!sessionStorage.getItem("dk_login_stamped")) {
    localStorage.setItem("dk_last_login", new Date().toISOString());
    sessionStorage.setItem("dk_login_stamped", "1");
  }

  // init
  populateUI();

  // safety: expose a small API for testing in console
  window.__DKProfile = {
    populateUI,
    ls: LS
  };

})();
