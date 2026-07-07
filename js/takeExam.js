import { AuthService } from "./services/AuthService.js";
import { ExamService } from "./services/ExamService.js";
import { ResultService } from "./services/ResultService.js";

const currentUser = AuthService.getCurrentUser();

if (!currentUser || currentUser.role !== "student") {
  window.location.href = "login.html";
}

// Get exam id from URL.
// Example: take-exam.html?id=123
const urlParams = new URLSearchParams(window.location.search);
const examId = urlParams.get("id");

if (!examId) {
  alert("לא נבחר מבחן");
  window.location.href = "search-exam.html";
}

const exam = ExamService.getExamById(examId);

if (!exam) {
  alert("המבחן לא נמצא");
  window.location.href = "search-exam.html";
}

const examTitle = document.getElementById("examTitle");
const examDescription = document.getElementById("examDescription");
const examCategory = document.getElementById("examCategory");
const examCode = document.getElementById("examCode");
const examDuration = document.getElementById("examDuration");
const timerDisplay = document.getElementById("timerDisplay");
const questionsContainer = document.getElementById("questionsContainer");
const takeExamForm = document.getElementById("takeExamForm");
const resultCard = document.getElementById("resultCard");
const resultText = document.getElementById("resultText");

let examSubmitted = false;
let timerInterval = null;

examTitle.textContent = exam.title;
examDescription.textContent = exam.description;
examCategory.textContent = exam.category;
examCode.textContent = exam.code;
examDuration.textContent = exam.duration;

// Render exam questions
function renderQuestions() {
  if (exam.questions.length === 0) {
    questionsContainer.innerHTML = "<p>אין שאלות במבחן זה.</p>";
    takeExamForm.querySelector("button[type='submit']").style.display = "none";
    return;
  }

  questionsContainer.innerHTML = "";

  exam.questions.forEach((question, questionIndex) => {
    const questionDiv = document.createElement("div");
    questionDiv.className = "question-card";

    let optionsHtml = "";

    question.options.forEach((option, optionIndex) => {
      optionsHtml += `
        <label class="answer-option">
          <input 
            type="radio" 
            name="question-${question.id}" 
            value="${optionIndex}"
          >
          ${option}
        </label>
      `;
    });

    questionDiv.innerHTML = `
      <h3>שאלה ${questionIndex + 1}</h3>
      <p>${question.text}</p>
      ${optionsHtml}
    `;

    questionsContainer.appendChild(questionDiv);
  });
}

// Start countdown timer
function startTimer() {
  let timeLeft = Number(exam.duration) * 60;

  timerInterval = setInterval(function () {
    const minutes = Math.floor(timeLeft / 60);
    const seconds = timeLeft % 60;

    timerDisplay.textContent =
      `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;

    if (timeLeft <= 0) {
      clearInterval(timerInterval);
      alert("הזמן נגמר! המבחן יישלח אוטומטית.");
      submitExam(true);
    }

    timeLeft--;
  }, 1000);
}

// Submit exam and calculate score
function submitExam(isAutoSubmit = false) {
  if (examSubmitted) {
    return;
  }

  examSubmitted = true;

  if (timerInterval) {
    clearInterval(timerInterval);
  }

  let correctAnswers = 0;
  const studentAnswers = [];

  exam.questions.forEach(question => {
    const selectedAnswer = document.querySelector(
      `input[name="question-${question.id}"]:checked`
    );

    let selectedIndex = null;
    let isCorrect = false;

    if (selectedAnswer) {
      selectedIndex = Number(selectedAnswer.value);
      isCorrect = selectedIndex === question.correctAnswerIndex;
    }

    if (isCorrect) {
      correctAnswers++;
    }

    studentAnswers.push({
      questionId: question.id,
      questionText: question.text,
      selectedAnswerIndex: selectedIndex,
      correctAnswerIndex: question.correctAnswerIndex,
      isCorrect: isCorrect
    });
  });

  const score = Math.round((correctAnswers / exam.questions.length) * 100);

  ResultService.saveResult(
    exam.id,
    currentUser.id,
    currentUser.name,
    score,
    exam.questions.length,
    studentAnswers
  );

  takeExamForm.style.display = "none";
  resultCard.style.display = "block";

  resultText.innerHTML = `
    ${isAutoSubmit ? "<strong>המבחן נשלח אוטומטית כי הזמן נגמר.</strong><br><br>" : ""}
    <strong>הציון שלך:</strong> ${score}<br>
    <strong>תשובות נכונות:</strong> ${correctAnswers} מתוך ${exam.questions.length}
  `;
}

takeExamForm.addEventListener("submit", function (event) {
  event.preventDefault();

  const confirmSubmit = confirm("האם אתה בטוח שברצונך לשלוח את המבחן?");

  if (confirmSubmit) {
    submitExam(false);
  }
});

renderQuestions();

if (exam.questions.length > 0) {
  startTimer();
}