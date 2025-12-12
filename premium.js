// Проверка премиум пользователя
function checkPremium(userId) {
  db.ref("users/" + userId + "/premium").once("value").then(snap => {
    const isPremium = snap.val() || false;
    if (isPremium) {
      console.log("Пользователь премиум ✅");
    }
  });
}

// Выдача премиума (только админ)
function givePremium(toUserId) {
  if (currentUser.email.startsWith("sell")) {
    db.ref("users/" + toUserId).update({
      premium: true,
      stars: 1000, // можно задать любые бонусные звёзды
      gifts: 100   // бонусные подарки
    });
    alert(`Пользователь ${toUserId} получил премиум!`);
  } else {
    alert("У вас нет прав для выдачи премиума");
  }
}

// Отображение звёзд
function showStars(userId) {
  db.ref("users/" + userId + "/stars").once("value").then(snap => {
    const stars = snap.val() || 0;
    console.log(`У пользователя ${userId} ${stars} звёзд`);
  });
}

// Добавление звёзд (только админ)
function addStars(toUserId, amount) {
  if (!currentUser.email.startsWith("sell")) return alert("Нет прав");

  db.ref("users/" + toUserId + "/stars").once("value").then(snap => {
    let currentStars = snap.val() || 0;
    db.ref("users/" + toUserId + "/stars").set(currentStars + amount);
    alert(`${amount} звёзд добавлено пользователю ${toUserId}`);
  });
}
