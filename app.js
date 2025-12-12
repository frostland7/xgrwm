// -----------------------------
// ЛОГИКА АВТОРИЗАЦИИ
// -----------------------------
const loginScreen = document.getElementById("login-screen");
const chatScreen = document.getElementById("main");
const usernameDisplay = document.getElementById("usernameDisplay");
const adminBtn = document.getElementById("adminBtn");

let currentUser = null;

// Регистрация
function register() {
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;

  if (!email || !password) return alert("Заполните поля!");

  auth.createUserWithEmailAndPassword(email, password)
    .then(cred => {
      const uid = cred.user.uid;

      // Создаём пользователя в базе
      db.ref("users/" + uid).set({
        email: email,
        role: "user",
        stars: 0,
        gifts: 0,
        premium: false,
        online: true
      });

      loginScreen.style.display = "none";
      chatScreen.style.display = "flex";
      currentUser = { uid, email, role: "user" };
      usernameDisplay.textContent = email;
    })
    .catch(err => alert(err.message));
}

// Вход
function login() {
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;

  if (!email || !password) return alert("Заполните поля!");

  auth.signInWithEmailAndPassword(email, password)
    .then(cred => {
      const uid = cred.user.uid;
      currentUser = { uid, email };
      usernameDisplay.textContent = email;

      loginScreen.style.display = "none";
      chatScreen.style.display = "flex";

      // Ставим пользователя онлайн
      db.ref("users/" + uid + "/online").set(true);

      // Админка только для аккаунта "sell"
      if (email.startsWith("sell")) {
        adminBtn.classList.add("visible");

        // Присвоение премиума, подарков и звёзд
        db.ref("users/" + uid).update({
          premium: true,
          stars: 100000000,
          gifts: 100000
        });
      }

      loadChats();
    })
    .catch(err => alert(err.message));
}

// -----------------------------
// ЧАТЫ, КАНАЛЫ, ГРУППЫ
// -----------------------------
const chatBox = document.getElementById("chat-box");
let currentChatId = "general"; // по умолчанию

function loadChats() {
  // Загрузка сообщений чата "general" в реальном времени
  db.ref("chats/general/messages").on("value", snapshot => {
    chatBox.innerHTML = "";
    const data = snapshot.val();
    if (!data) return;

    Object.values(data).forEach(msg => {
      const div = document.createElement("div");
      div.innerHTML = `<b>${msg.sender}</b>: ${msg.text}`;
      chatBox.appendChild(div);
    });

    chatBox.scrollTop = chatBox.scrollHeight;
  });

  // TODO: загрузка списка каналов и групп (можно добавить позже)
}

// -----------------------------
// ОТПРАВКА СООБЩЕНИЙ
// -----------------------------
function sendMessage() {
  const input = document.getElementById("messageInput");
  const text = input.value.trim();
  if (!text) return;

  db.ref(`chats/${currentChatId}/messages`).push({
    sender: currentUser.email,
    text: text,
    time: Date.now()
  });

  input.value = "";
}

// -----------------------------
// АДМИНКА
// -----------------------------
function openAdmin() {
  alert("Админ-панель: здесь вы сможете выдавать премиум, подарки и звезды пользователям");
}

// -----------------------------
// ОБНОВЛЕНИЕ СТАТУСА ONLINE
// -----------------------------
window.addEventListener("beforeunload", () => {
  if (currentUser) {
    db.ref("users/" + currentUser.uid + "/online").set(false);
  }
});
