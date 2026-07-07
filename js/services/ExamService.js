import { Exam } from "../models/Exam.js";
import { StorageService } from "./StorageService.js";

// ExamService handles all exam operations using localStorage.
export class ExamService {
  static getAllExams() {
    return StorageService.get("exams");
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
    StorageService.set("exams", exams);

    return newExam;
  }

  static deleteExam(examId) {
    const exams = this.getAllExams();
    const updatedExams = exams.filter(exam => exam.id !== examId);

    StorageService.set("exams", updatedExams);
  }
}