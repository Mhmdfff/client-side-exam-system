import { AuthService } from "./services/AuthService.js";
import { ExamService } from "./services/ExamService.js";
import { ResultService } from "./services/ResultService.js";

const currentUser = AuthService.getCurrentUser();

if (!currentUser || currentUser.role !== "teacher") {
  window.location.href = "login.html";
}

// Get exam id from URL.
// Example: exam-details.html?id=123
const urlParams = new URLSearchParams(window.location.search);
const examId = urlParams.get("id");

if (!examId) {
  alert("לא נבחר מבחן");
  window.location.href = "teacher-dashboard.html";
}

let exam = ExamService.getExamById(examId);

if (!exam) {
  alert("המבחן לא נמצא");
  window.location.href = "teacher-dashboard.html";
}

if (exam.teacherId !== currentUser.id) {
  alert("אין לך הרשאה לנהל מבחן זה");
  window.location.href = "teacher-dashboard.html";
}

const editExamForm = document.getElementById("editExamForm");
const addQuestionForm = document.getElementById("addQuestionForm");
const questionsList = document.getElementById("questionsList");
const examResultsList = document.getElementById("examResultsList");
const examIdInput = document.getElementById("examId");
const examTitleInput = document.getElementById("examTitle");
const examDescriptionInput = document.getElementById("examDescription");
const examCategoryInput = document.getElementById("examCategory");
const examCodeInput = document.getElementById("examCode");
const examDurationInput = document.getElementById("examDuration");

// Load exam data into the form
function loadExamData() {
  exam = ExamService.getExamById(examId);

  examIdInput.value = exam.id;
  examTitleInput.value = exam.title;
  examDescriptionInput.value = exam.description;
  examCategoryInput.value = exam.category;
  examCodeInput.value = exam.code;
  examDurationInput.value = exam.duration;
}

// Save exam general information
editExamForm.addEventListener("submit", function (event) {
  event.preventDefault();

  const title = examTitleInput.value.trim();
  const description = examDescriptionInput.value.trim();
  const category = examCategoryInput.value.trim();
  const code = examCodeInput.value.trim();
  const duration = Number(examDurationInput.value);

  try {
    ExamService.updateExam(
      examId,
      title,
      description,
      category,
      code,
      duration
    );

    alert("פרטי המבחן עודכנו בהצלחה");
    loadExamData();
  } catch (error) {
    alert(error.message);
  }
});

// Add new question
addQuestionForm.addEventListener("submit", function (event) {
  event.preventDefault();

  const questionText = document.getElementById("questionText").value.trim();

  const options = [
    document.getElementById("option1").value.trim(),
    document.getElementById("option2").value.trim(),
    document.getElementById("option3").value.trim(),
    document.getElementById("option4").value.trim()
  ];

  const correctAnswerIndex = document.getElementById("correctAnswer").value;

  try {
    ExamService.addQuestionToExam(
      examId,
      questionText,
      options,
      correctAnswerIndex
    );

    alert("השאלה נוספה בהצלחה");
    addQuestionForm.reset();
    renderQuestions();
  } catch (error) {
    alert(error.message);
  }
});

// Show all questions
function renderQuestions() {
  exam = ExamService.getExamById(examId);

  if (exam.questions.length === 0) {
    questionsList.innerHTML = "<p>עדיין אין שאלות במבחן זה.</p>";
    return;
  }

  questionsList.innerHTML = "";

  exam.questions.forEach((question, index) => {
    const questionCard = document.createElement("div");
    questionCard.className = "question-card";

    const optionsHtml = question.options
      .map((option, optionIndex) => {
        const isCorrect = optionIndex === question.correctAnswerIndex;

        return `
          <li class="${isCorrect ? "correct-answer" : ""}">
            ${optionIndex + 1}. ${option}
            ${isCorrect ? " - תשובה נכונה" : ""}
          </li>
        `;
      })
      .join("");

    questionCard.innerHTML = `
      <h3>שאלה ${index + 1}</h3>
      <p>${question.text}</p>

      <ul>
        ${optionsHtml}
      </ul>

      <button class="btn btn-danger delete-question-btn" data-id="${question.id}">
        מחק שאלה
      </button>
    `;

    questionsList.appendChild(questionCard);
  });

  const deleteButtons = document.querySelectorAll(".delete-question-btn");

  deleteButtons.forEach(button => {
    button.addEventListener("click", function () {
      const questionId = this.dataset.id;

      const confirmDelete = confirm("האם אתה בטוח שברצונך למחוק את השאלה?");

      if (confirmDelete) {
        ExamService.deleteQuestionFromExam(examId, questionId);
        renderQuestions();
      }
    });
  });
}
// Show student results for this exam
function renderExamResults() {
  const results = ResultService.getResultsByExam(examId);

  if (results.length === 0) {
    examResultsList.innerHTML = "<p>עדיין אין תוצאות למבחן זה.</p>";
    return;
  }

  examResultsList.innerHTML = "";

  results.forEach(result => {
    const correctCount = result.answers.filter(answer => answer.isCorrect).length;

    const resultCard = document.createElement("div");
    resultCard.className = "result-card";

    resultCard.innerHTML = `
      <h3>${result.studentName}</h3>
      <p><strong>ציון:</strong> ${result.score}</p>
      <p><strong>תשובות נכונות:</strong> ${correctCount} מתוך ${result.totalQuestions}</p>
      <p><strong>תאריך:</strong> ${result.date}</p>
    `;

    examResultsList.appendChild(resultCard);
  });
}
loadExamData();
renderQuestions();
renderExamResults();