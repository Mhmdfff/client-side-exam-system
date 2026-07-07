import { AuthService } from "./services/AuthService.js";

// This file is used by both register.html and login.html.

const registerForm = document.getElementById("registerForm");
const loginForm = document.getElementById("loginForm");

// Register form logic
if (registerForm) {
  registerForm.addEventListener("submit", function (event) {
    event.preventDefault();

    const name = document.getElementById("name").value.trim();
    const email = document.getElementById("email").value.trim();
    const password = document.getElementById("password").value;
    const role = document.getElementById("role").value;

    try {
      AuthService.register(name, email, password, role);
      alert("ההרשמה הצליחה! עכשיו אפשר להתחבר.");
      window.location.href = "login.html";
    } catch (error) {
      alert(error.message);
    }
  });
}

// Login form logic
if (loginForm) {
  loginForm.addEventListener("submit", function (event) {
    event.preventDefault();

    const email = document.getElementById("email").value.trim();
    const password = document.getElementById("password").value;

    try {
      const user = AuthService.login(email, password);

      if (user.role === "teacher") {
        window.location.href = "teacher-dashboard.html";
      } else {
        window.location.href = "student-dashboard.html";
      }
    } catch (error) {
      alert(error.message);
    }
  });
}