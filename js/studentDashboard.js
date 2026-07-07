import { AuthService } from "./services/AuthService.js";
import { ResultService } from "./services/ResultService.js";
import { ExamService } from "./services/ExamService.js";

const currentUser = AuthService.getCurrentUser();

if (!currentUser || currentUser.role !== "student") {
  window.location.href = "login.html";
}

const studentName = document.getElementById("studentName");
const logoutBtn = document.getElementById("logoutBtn");
const averageGrade = document.getElementById("averageGrade");
const studentResultsList = document.getElementById("studentResultsList");

studentName.textContent = currentUser.name;

// Logout
logoutBtn.addEventListener("click", function () {
  AuthService.logout();
  window.location.href = "login.html";
});

// Show student exam history
function renderStudentResults() {
  const results = ResultService.getResultsByStudent(currentUser.id);

  if (results.length === 0) {
    studentResultsList.innerHTML = "<p>עדיין לא ביצעת מבחנים.</p>";
    averageGrade.textContent = "עדיין אין ציונים.";
    return;
  }

  // Calculate average grade
  const totalGrades = results.reduce((sum, result) => sum + result.score, 0);
  const average = Math.round(totalGrades / results.length);

  averageGrade.innerHTML = `
    <strong>הממוצע שלך:</strong> ${average}
    <br>
    <strong>מספר מבחנים שבוצעו:</strong> ${results.length}
  `;

  studentResultsList.innerHTML = "";

  results.forEach(result => {
    const exam = ExamService.getExamById(result.examId);

    const resultCard = document.createElement("div");
    resultCard.className = "result-card";

    resultCard.innerHTML = `
      <h3>${exam ? exam.title : "מבחן לא נמצא"}</h3>
      <p><strong>ציון:</strong> ${result.score}</p>
      <p><strong>תשובות נכונות:</strong> ${result.score}%</p>
      <p><strong>מספר שאלות:</strong> ${result.totalQuestions}</p>
      <p><strong>תאריך:</strong> ${result.date}</p>
    `;

    studentResultsList.appendChild(resultCard);
  });
}

renderStudentResults();