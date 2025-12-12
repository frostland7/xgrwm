// Получаем элементы
const loginScreen = document.getElementById("login-screen");
const chatScreen = document.getElementById("main");
const usernameDisplay = document.getElementById("usernameDisplay");
const adminBtn = document.getElementById("adminBtn");
const registerBtn = document.getElementById("registerBtn");
const loginBtn = document.getElementById("loginBtn");

let currentUser = null;

// -----------------------------
// РЕГИСТРАЦИЯ
// -----------------------------
registerBtn.addEventListener("click", () => {
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;

  if (!email || !password) return alert("Заполните поля!");

  auth.createUserWithEmailAndPassword(email, password)
    .then(cred => {
      const uid = cred.user.uid;

      db.ref("users/" + uid).set({
        email: email,
        role: "user",
        stars: 0,
        gifts: 0,
        premium: false,
        online: true
      });

      currentUser = { uid, email, role: "user" };
      usernameDisplay.textContent = email;

      loginScreen.style.display = "none";
      chatScreen.style.display = "flex";

      loadChats();
    })
    .catch(err => alert(err.message));
});

// -----------------------------
// ВХОД
// -----------------------------
loginBtn.addEventListener("click", () => {
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

      // Ставим онлайн
      db.ref("users/" + uid + "/online").set(true);

      // Админка только для аккаунта "sell"
      if (email.startsWith("sell")) {
        adminBtn.classList.add("visible");
        db.ref("users/" + uid).update({
          premium: true,
          stars: 100000000,
          gifts: 100000
        });
      }

      loadChats();
    })
    .catch(err => alert(err.message));
});

// -----------------------------
// ЗАГРУЗКА ЧАТОВ
// -----------------------------
const chatBox = document.getElementById("chat-box");
let currentChatId = "general"; // по умолчанию

function loadChats() {
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
  alert("Админ-панель: выдача премиум, подарков и звезд");
}

// -----------------------------
// ОТКЛЮЧЕНИЕ ONLINE
// -----------------------------
window.addEventListener("beforeunload", () => {
  if (currentUser) {
    db.ref("users/" + currentUser.uid + "/online").set(false);
  }
});
