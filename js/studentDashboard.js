import { AuthService } from "./services/AuthService.js";

const currentUser = AuthService.getCurrentUser();

if (!currentUser || currentUser.role !== "student") {
  window.location.href = "login.html";
}

document.getElementById("studentName").textContent = currentUser.name;

document.getElementById("logoutBtn").addEventListener("click", function () {
  AuthService.logout();
  window.location.href = "login.html";
});