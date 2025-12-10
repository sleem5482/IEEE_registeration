import { LoginFormData, RegisterFormData } from "./validation";
import { v4 as uuidv4 } from "uuid";

const STORAGE_KEY = "ieee_users";
const CURRENT_USER_KEY = "ieee_current_user";
const DELAY_MS = 1000; // Simulated network latency

export interface User extends RegisterFormData {
  id: string;
  createdAt: string;
  status: "pending" | "approved" | "rejected";
}

class MockApiService {
  private getUsers(): User[] {
    if (typeof window === "undefined") return [];
    const users = localStorage.getItem(STORAGE_KEY);
    return users ? JSON.parse(users) : [];
  }

  private saveUsers(users: User[]) {
    if (typeof window === "undefined") return;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(users));
  }

  private async simulateDelay() {
    await new Promise((resolve) => setTimeout(resolve, DELAY_MS));
  }

  async register(data: RegisterFormData | FormData): Promise<User> {
    await this.simulateDelay();
    
    // Parse data if it's FormData
    let userData: RegisterFormData;
    if (data instanceof FormData) {
      const obj: Record<string, string | boolean> = {};
      data.forEach((value, key) => {
        // Skip file objects for local storage mock, or convert to string placeholder
        if (value instanceof File) {
          obj[key] = URL.createObjectURL(value); // Store object URL for preview if needed, or just a string
        } else {
          try {
             obj[key] = JSON.parse(value as string);
          } catch {
             obj[key] = value as string;
          }
        }
      });
      userData = obj as RegisterFormData;
    } else {
      userData = data;
    }

    const users = this.getUsers();
    
    // Check if user already exists
    if (users.some((u) => u.email === userData.email)) {
      throw new Error("User with this email already exists");
    }
    if (users.some((u) => u.nationalId === userData.nationalId)) {
      throw new Error("User with this National ID already exists");
    }

    const newUser: User = {
      ...userData,
      id: uuidv4(),
      createdAt: new Date().toISOString(),
      status: "pending", // User is pending approval by default
    };

    users.push(newUser);
    this.saveUsers(users);
    
    // Auto login after register
    this.setCurrentUser(newUser);
    
    return newUser;
  }

  async login(credentials: LoginFormData): Promise<User> {
    await this.simulateDelay();
    
    const users = this.getUsers();
    const user = users.find(
      (u) => u.email === credentials.email && u.nationalId === credentials.password // Using National ID as password for simplicity as per requirement implies standard login but typically password is separate. 
      // WAIT: The login schema defines password, but the register schema doesn't have a password field!
      // Looking at the RegisterFormData in previous turns, it has: nameAr, nameEn, phone, governorate, nationalId, college, level, email, age, gender.
      // It DOES NOT have a password field.
      // Usually in such systems, National ID or Phone is used as a password, or a default password is generated.
      // Let's assume for this mock that the user uses National ID as password, OR we should have added a password field.
      // Given the user wants "Professional", a password field is essential.
      // HOWEVER, adding a password field to the form wasn't explicitly requested, but "improving registration" was.
      // Let's check the existing Login page. It asks for Email and Password.
      // But Register page doesn't ask for password.
      // FOR NOW, to make it work with existing Login page which sends 'password', I will assume the user's "National ID" acts as their initial password, or I should store the 'password' field if the schema allowed.
      // Let's look at the Login Schema again.
    );
    
    // RE-EVALUATION: The Register form has NO password field. The Login form HAS a password field.
    // This is a logic gap. 
    // I will check the validation.ts again to be 100% sure.
    // Yes, validation.ts -> RegisterFormData has no password. LoginFormData has password.
    // I will implicitly assume for this Mock API that the registered `nationalId` works as the password for login.
    // This is a common pattern in some local registration systems (University ID = Password initially).
    
    if (user && user.nationalId === credentials.password) {
      this.setCurrentUser(user);
      return user;
    }
    
    throw new Error("Invalid email or password");
  }

  async logout(): Promise<void> {
    await this.simulateDelay();
    if (typeof window !== "undefined") {
      localStorage.removeItem(CURRENT_USER_KEY);
    }
  }

  getCurrentUser(): User | null {
    if (typeof window === "undefined") return null;
    const user = localStorage.getItem(CURRENT_USER_KEY);
    return user ? JSON.parse(user) : null;
  }

  private setCurrentUser(user: User) {
    if (typeof window === "undefined") return;
    localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(user));
  }
}

export const api = new MockApiService();
