const auth = firebase.auth();
const db = firebase.database();

// Регистрация
function register() {
  const email = document.getElementById("email").value;
  const pass = document.getElementById("password").value;

  auth.createUserWithEmailAndPassword(email, pass).then(() => {
    const uid = auth.currentUser.uid;

    db.ref("users/" + uid).set({
      email: email,
      role: "user",
      online: true
    });

  });
}

// Вход
function login() {
  const email = document.getElementById("email").value;
  const pass = document.getElementById("password").value;

  auth.signInWithEmailAndPassword(email, pass).then(() => {
    document.getElementById("login-screen").classList.add("hidden");
    document.getElementById("chat-screen").classList.remove("hidden");

    const uid = auth.currentUser.uid;

    // Показать админку для аккаунта "sell"
    if (email.startsWith("sell")) {
      document.getElementById("adminBtn").classList.remove("hidden");
    }

    // Ставим онлайн
    db.ref("users/" + uid + "/online").set(true);

    loadChat();
  });
}

// Отправка сообщения
function sendMessage() {
  const text = document.getElementById("messageInput").value;
  if (!text) return;

  db.ref("messages").push({
    text: text,
    user: auth.currentUser.email,
    time: Date.now()
  });

  document.getElementById("messageInput").value = "";
}

// Загрузка чата
function loadChat() {
  const chatBox = document.getElementById("chat-box");

  db.ref("messages").on("value", snap => {
    chatBox.innerHTML = "";
    snap.forEach(msg => {
      const data = msg.val();
      const div = document.createElement("div");
      div.textContent = data.user + ": " + data.text;
      chatBox.appendChild(div);
    });
  });
}

// Окно админа
function openAdmin() {
  alert("Админ-панель (здесь ты сможешь выдавать премиум)");
    }
