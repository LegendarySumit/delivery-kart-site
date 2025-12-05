// Open modals
window.openLogin = () => {
  document.getElementById("login-modal").style.display = "flex";
};
window.openSignup = () => {
  document.getElementById("signup-modal").style.display = "flex";
};
window.openContact = () => {
  document.getElementById("contact-modal").style.display = "flex";
};
window.openTelephone = () => {
  document.getElementById("telephone-modal").style.display = "flex";
};

// Close modals
function closeAllModals() {
  document.querySelectorAll(".modal").forEach(m => m.style.display = "none");
}

document.addEventListener("click", (e) => {
  if (e.target.classList.contains("close-modal")) {
    closeAllModals();
  }
});

// Eye toggle
document.addEventListener("click", (e) => {
  if (e.target.classList.contains("toggle-eye")) {
    const field = document.getElementById(e.target.dataset.target);
    field.type = field.type === "password" ? "text" : "password";
  }
});

// LOGIN LOGIC (LOCAL STORAGE)
document.getElementById("login-form").addEventListener("submit", function(e){
    e.preventDefault();
  
    const email = document.getElementById("login-email").value.trim();
    const pass  = document.getElementById("login-password").value.trim();
  
    if (!email || !pass) {
        alert("Please enter both email and password.");
        return;
    }
  
    // Hide real login btn
    const realLoginBtn = document.getElementById("real-login-btn");
    if (realLoginBtn) realLoginBtn.classList.add("hidden");
  
    // Show role options
    const roleOptions = document.getElementById("login-role-options");
    if (roleOptions) roleOptions.classList.remove("hidden");
  
    localStorage.setItem("dk_email", email);
    localStorage.setItem("dk_user_email", email);
  });
  

// Signup logic
document.getElementById("signup-form").addEventListener("submit", function(e){
    e.preventDefault();
  
    const name = document.getElementById("signup-name").value.trim();
    const email = document.getElementById("signup-email").value.trim();
    const pass = document.getElementById("signup-password").value.trim();
  
    if (!email || !pass || !name) {
        alert("Please fill out all fields.");
        return;
    }
  
    // Hide real signup btn
    const realSignupBtn = document.getElementById("real-signup-btn");
    if (realSignupBtn) realSignupBtn.classList.add("hidden");
  
    // Show role options
    const roleOptions = document.getElementById("signup-role-options");
    if (roleOptions) roleOptions.classList.remove("hidden");
  
    // Save into localStorage
    localStorage.setItem("dk_user_name", name);
    localStorage.setItem("dk_user_email", email);
    localStorage.setItem("dk_name", name);
    localStorage.setItem("dk_email", email);
  });
  

// Role buttons (user/brand)
document.getElementById("login-user")?.addEventListener("click", () => {
  localStorage.setItem("dk_logged_in", "true");
  localStorage.setItem("dk_role", "user");
  closeAllModals();
  if (typeof updateHeaderUI === "function") {
    updateHeaderUI();
  }
});

document.getElementById("login-brand")?.addEventListener("click", () => {
  localStorage.setItem("dk_logged_in", "true");
  localStorage.setItem("dk_role", "brand");
  closeAllModals();
  if (typeof updateHeaderUI === "function") {
    updateHeaderUI();
  }
});

document.getElementById("signup-user")?.addEventListener("click", () => {
  localStorage.setItem("dk_logged_in", "true");
  localStorage.setItem("dk_role", "user");
  closeAllModals();
  if (typeof updateHeaderUI === "function") {
    updateHeaderUI();
  }
});

document.getElementById("signup-brand")?.addEventListener("click", () => {
  localStorage.setItem("dk_logged_in", "true");
  localStorage.setItem("dk_role", "brand");
  closeAllModals();
  if (typeof updateHeaderUI === "function") {
    updateHeaderUI();
  }
});

document.addEventListener("click", function (e) {
    const login = document.getElementById("login-modal");
    const signup = document.getElementById("signup-modal");
    const contact = document.getElementById("contact-modal");
    const telephone = document.getElementById("telephone-modal");
  
    if (!login || !signup) return;
  
    // Close when clicking on modal background
    if (e.target === login) login.style.display = "none";
    if (e.target === signup) signup.style.display = "none";
    if (e.target === contact) contact.style.display = "none";
    if (e.target === telephone) telephone.style.display = "none";
  });
  
// Ensure header UI is updated when this script loads (in case user is already logged in)
if (typeof updateHeaderUI === "function") {
  updateHeaderUI();
}