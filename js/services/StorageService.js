// StorageService handles all localStorage operations.
// Data is saved as JSON strings and loaded back as JavaScript objects.

export class StorageService {
  static get(key) {
    const data = localStorage.getItem(key);

    if (!data) {
      return [];
    }

    return JSON.parse(data);
  }

  static set(key, value) {
    localStorage.setItem(key, JSON.stringify(value));
  }

  static getCurrentUser() {
    const user = localStorage.getItem("currentUser");

    if (!user) {
      return null;
    }

    return JSON.parse(user);
  }

  static setCurrentUser(user) {
    localStorage.setItem("currentUser", JSON.stringify(user));
  }

  static clearCurrentUser() {
    localStorage.removeItem("currentUser");
  }
}