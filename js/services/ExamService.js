import { Exam } from "../models/Exam.js";
import { Question } from "../models/Question.js";
import { StorageService } from "./StorageService.js";

// ExamService handles all exam operations using localStorage.
export class ExamService {
  static getAllExams() {
    return StorageService.get("exams");
  }

  static saveAllExams(exams) {
    StorageService.set("exams", exams);
  }

  static getExamsByTeacher(teacherId) {
    const exams = this.getAllExams();
    return exams.filter(exam => exam.teacherId === teacherId);
  }

  static getExamById(examId) {
    const exams = this.getAllExams();
    return exams.find(exam => exam.id === examId);
  }

  static createExam(teacherId, title, description, category, code, duration) {
    const exams = this.getAllExams();

    const existingCode = exams.find(exam => exam.code === code);

    if (existingCode) {
      throw new Error("קוד מבחן זה כבר קיים. בחר קוד אחר.");
    }

    const id = Date.now().toString();

    const newExam = new Exam(
      id,
      teacherId,
      title,
      description,
      category,
      code,
      duration
    );

    exams.push(newExam);
    this.saveAllExams(exams);

    return newExam;
  }

  static updateExam(examId, title, description, category, code, duration) {
    const exams = this.getAllExams();

    const examIndex = exams.findIndex(exam => exam.id === examId);

    if (examIndex === -1) {
      throw new Error("המבחן לא נמצא");
    }

    const existingCode = exams.find(
      exam => exam.code === code && exam.id !== examId
    );

    if (existingCode) {
      throw new Error("קוד מבחן זה כבר קיים במבחן אחר");
    }

    exams[examIndex].title = title;
    exams[examIndex].description = description;
    exams[examIndex].category = category;
    exams[examIndex].code = code;
    exams[examIndex].duration = duration;

    this.saveAllExams(exams);

    return exams[examIndex];
  }

  static deleteExam(examId) {
    const exams = this.getAllExams();
    const updatedExams = exams.filter(exam => exam.id !== examId);

    this.saveAllExams(updatedExams);
  }

  static addQuestionToExam(examId, text, options, correctAnswerIndex) {
    const exams = this.getAllExams();

    const examIndex = exams.findIndex(exam => exam.id === examId);

    if (examIndex === -1) {
      throw new Error("המבחן לא נמצא");
    }

    const questionId = Date.now().toString();

    const newQuestion = new Question(
      questionId,
      text,
      options,
      Number(correctAnswerIndex)
    );

    exams[examIndex].questions.push(newQuestion);

    this.saveAllExams(exams);

    return newQuestion;
  }

  static deleteQuestionFromExam(examId, questionId) {
    const exams = this.getAllExams();

    const examIndex = exams.findIndex(exam => exam.id === examId);

    if (examIndex === -1) {
      throw new Error("המבחן לא נמצא");
    }

    exams[examIndex].questions = exams[examIndex].questions.filter(
      question => question.id !== questionId
    );

    this.saveAllExams(exams);
  }
}