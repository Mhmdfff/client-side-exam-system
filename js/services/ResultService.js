import { Result } from "../models/Result.js";
import { StorageService } from "./StorageService.js";

// ResultService handles saving and reading exam results from localStorage.
export class ResultService {
  static getAllResults() {
    return StorageService.get("results");
  }

  static saveResult(examId, studentId, studentName, score, totalQuestions, answers) {
    const results = this.getAllResults();

    const id = Date.now().toString();
    const date = new Date().toLocaleString("he-IL");

    const result = new Result(
      id,
      examId,
      studentId,
      studentName,
      score,
      totalQuestions,
      answers,
      date
    );

    results.push(result);
    StorageService.set("results", results);

    return result;
  }

  static getResultsByStudent(studentId) {
    const results = this.getAllResults();
    return results.filter(result => result.studentId === studentId);
  }

  static getResultsByExam(examId) {
    const results = this.getAllResults();
    return results.filter(result => result.examId === examId);
  }
}