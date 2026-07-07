import { User } from "./User.js";

// Student class inherits from User.
export class Student extends User {
  constructor(id, name, email, password) {
    super(id, name, email, password, "student");
  }
}