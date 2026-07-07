import { User } from "./User.js";

// Teacher class inherits from User.
export class Teacher extends User {
  constructor(id, name, email, password) {
    super(id, name, email, password, "teacher");
  }
}