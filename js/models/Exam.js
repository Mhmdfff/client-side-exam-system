// Exam class represents one exam created by a teacher.

export class Exam {
  constructor(id, teacherId, title, description, category, code, duration) {
    this.id = id;
    this.teacherId = teacherId;
    this.title = title;
    this.description = description;
    this.category = category;
    this.code = code;
    this.duration = duration;
    this.questions = [];
    this.createdAt = new Date().toISOString();
  }
}