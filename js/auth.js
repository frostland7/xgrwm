import { db } from "./firebase.js";
import { ref, set, get, child } from "https://www.gstatic.com/firebasejs/10.12.1/firebase-database.js";

export async function registerUser(login, pass) {
  await set(ref(db, "users/" + login), {
    login: login,
    password: pass,
    stars: 0,
    gifts: 0,
    premium: false
  });
}

export async function loginUser(login, pass) {
  const snapshot = await get(child(ref(db), "users/" + login));

  if (!snapshot.exists()) return false;
  const data = snapshot.val();
  if (data.password !== pass) return false;

  return data;
}
