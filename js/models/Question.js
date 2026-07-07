// Question class represents one multiple choice question inside an exam.

export class Question {
  constructor(id, text, options, correctAnswerIndex) {
    this.id = id;
    this.text = text;
    this.options = options;
    this.correctAnswerIndex = correctAnswerIndex;
  }
}