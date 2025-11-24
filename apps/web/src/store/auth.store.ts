import { create } from "zustand";
import client from "../api/client";

type User = { _id: string; email: string; name: string; role: "user" | "admin"; theme?: "light" | "dark" };
type State = { token: string | null; user: User | null; login: (email: string, password: string) => Promise<void>; signup: (name: string, email: string, password: string) => Promise<void>; logout: () => void; };

export const useAuthStore = create<State>((set) => ({
  token: localStorage.getItem("token"),
  user: null,
  async login(email, password) {
    const { data } = await client.post("/auth/login", { email, password });
    localStorage.setItem("token", data.token);
    set({ token: data.token, user: data.user });
  },
  async signup(name, email, password) {
    const { data } = await client.post("/auth/signup", { name, email, password });
    localStorage.setItem("token", data.token);
    set({ token: data.token, user: data.user });
  },
  logout() {
    localStorage.removeItem("token");
    set({ token: null, user: null });
  }
}));
