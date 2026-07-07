import { Teacher } from "../models/Teacher.js";
import { Student } from "../models/Student.js";
import { StorageService } from "./StorageService.js";

// AuthService handles register, login and logout.
export class AuthService {
  static register(name, email, password, role) {
    const users = StorageService.get("users");

    const existingUser = users.find(user => user.email === email);

    if (existingUser) {
      throw new Error("משתמש עם אימייל זה כבר קיים");
    }

    const id = Date.now().toString();

    let newUser;

    if (role === "teacher") {
      newUser = new Teacher(id, name, email, password);
    } else if (role === "student") {
      newUser = new Student(id, name, email, password);
    } else {
      throw new Error("סוג משתמש לא תקין");
    }

    users.push(newUser);
    StorageService.set("users", users);

    return newUser;
  }

  static login(email, password) {
    const users = StorageService.get("users");

    const user = users.find(
      user => user.email === email && user.password === password
    );

    if (!user) {
      throw new Error("אימייל או סיסמה לא נכונים");
    }

    StorageService.setCurrentUser(user);
    return user;
  }

  static logout() {
    StorageService.clearCurrentUser();
  }

  static getCurrentUser() {
    return StorageService.getCurrentUser();
  }
}