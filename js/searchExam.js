import { AuthService } from "./services/AuthService.js";
import { ExamService } from "./services/ExamService.js";

const currentUser = AuthService.getCurrentUser();

if (!currentUser || currentUser.role !== "student") {
  window.location.href = "login.html";
}

const searchExamForm = document.getElementById("searchExamForm");
const searchInput = document.getElementById("searchInput");
const searchResults = document.getElementById("searchResults");

// Show all available exams when the page loads.
renderExams(ExamService.getAllExams());

searchExamForm.addEventListener("submit", function (event) {
  event.preventDefault();

  const searchValue = searchInput.value.trim().toLowerCase();
  const exams = ExamService.getAllExams();

  const filteredExams = exams.filter(exam => {
    return (
      exam.title.toLowerCase().includes(searchValue) ||
      exam.code.toLowerCase().includes(searchValue) ||
      exam.category.toLowerCase().includes(searchValue)
    );
  });

  renderExams(filteredExams);
});

function renderExams(exams) {
  if (exams.length === 0) {
    searchResults.innerHTML = "<p>לא נמצאו מבחנים מתאימים.</p>";
    return;
  }

  searchResults.innerHTML = "";

  exams.forEach(exam => {
    const examCard = document.createElement("div");
    examCard.className = "exam-card";

    examCard.innerHTML = `
      <h3>${exam.title}</h3>
      <p><strong>תיאור:</strong> ${exam.description}</p>
      <p><strong>קטגוריה:</strong> ${exam.category}</p>
      <p><strong>קוד מבחן:</strong> ${exam.code}</p>
      <p><strong>משך זמן:</strong> ${exam.duration} דקות</p>
      <p><strong>מספר שאלות:</strong> ${exam.questions.length}</p>

      <a href="take-exam.html?id=${exam.id}" class="btn">
        התחל מבחן
      </a>
    `;

    searchResults.appendChild(examCard);
  });
}