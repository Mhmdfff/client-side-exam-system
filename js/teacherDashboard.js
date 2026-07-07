import { AuthService } from "./services/AuthService.js";
import { ExamService } from "./services/ExamService.js";

const currentUser = AuthService.getCurrentUser();

if (!currentUser || currentUser.role !== "teacher") {
  window.location.href = "login.html";
}

const teacherName = document.getElementById("teacherName");
const logoutBtn = document.getElementById("logoutBtn");
const createExamForm = document.getElementById("createExamForm");
const teacherExamsList = document.getElementById("teacherExamsList");

teacherName.textContent = currentUser.name;

// Logout button
logoutBtn.addEventListener("click", function () {
  AuthService.logout();
  window.location.href = "login.html";
});

// Create new exam
createExamForm.addEventListener("submit", function (event) {
  event.preventDefault();

  const title = document.getElementById("examTitle").value.trim();
  const description = document.getElementById("examDescription").value.trim();
  const category = document.getElementById("examCategory").value.trim();
  const code = document.getElementById("examCode").value.trim();
  const duration = Number(document.getElementById("examDuration").value);

  try {
    ExamService.createExam(
      currentUser.id,
      title,
      description,
      category,
      code,
      duration
    );

    alert("המבחן נוצר בהצלחה");
    createExamForm.reset();
    renderTeacherExams();
  } catch (error) {
    alert(error.message);
  }
});

// Show teacher exams
function renderTeacherExams() {
  const exams = ExamService.getExamsByTeacher(currentUser.id);

  if (exams.length === 0) {
    teacherExamsList.innerHTML = "<p>עדיין לא יצרת מבחנים.</p>";
    return;
  }

  teacherExamsList.innerHTML = "";

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

      <a class="btn" href="exam-details.html?id=${exam.id}">ניהול מבחן</a>
      <button class="btn btn-danger delete-exam-btn" data-id="${exam.id}">
        מחק מבחן
      </button>
    `;

    teacherExamsList.appendChild(examCard);
  });

  const deleteButtons = document.querySelectorAll(".delete-exam-btn");

  deleteButtons.forEach(button => {
    button.addEventListener("click", function () {
      const examId = this.dataset.id;

      const confirmDelete = confirm("האם אתה בטוח שברצונך למחוק את המבחן?");

      if (confirmDelete) {
        ExamService.deleteExam(examId);
        renderTeacherExams();
      }
    });
  });
}

renderTeacherExams();