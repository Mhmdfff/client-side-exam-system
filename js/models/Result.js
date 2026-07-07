// Result class represents one exam result for a student.

export class Result {
  constructor(id, examId, studentId, studentName, score, totalQuestions, answers, date) {
    this.id = id;
    this.examId = examId;
    this.studentId = studentId;
    this.studentName = studentName;
    this.score = score;
    this.totalQuestions = totalQuestions;
    this.answers = answers;
    this.date = date;
  }
}