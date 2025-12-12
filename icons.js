// Здесь хранятся все доступные подарки
const gifts = [
  { id: 1, name: "Полярка", icon: "❄️", price: 100 },
  { id: 2, name: "Сердце", icon: "❤️", price: 50 },
  { id: 3, name: "Звезда", icon: "⭐", price: 150 },
  { id: 4, name: "Подарок", icon: "🎁", price: 200 },
  { id: 5, name: "Трофей", icon: "🏆", price: 500 }
];

// Функция отображения подарков пользователя
function showUserGifts(userId) {
  db.ref("users/" + userId + "/gifts").once("value").then(snap => {
    const giftCount = snap.val() || 0;
    console.log(`У пользователя ${userId} подарков: ${giftCount}`);
  });
}

// Функция отправки подарка другому пользователю
function sendGift(toUserId, giftId) {
  const gift = gifts.find(g => g.id === giftId);
  if (!gift) return alert("Такого подарка нет");

  db.ref("users/" + currentUser.uid + "/gifts").once("value").then(snap => {
    let myGifts = snap.val() || 0;
    if (myGifts < gift.price) return alert("Недостаточно подарков/звёзд");

    // Снимаем стоимость с отправителя
    db.ref("users/" + currentUser.uid + "/gifts").set(myGifts - gift.price);

    // Добавляем подарок получателю
    db.ref("users/" + toUserId + "/gifts").once("value").then(s => {
      let receiverGifts = s.val() || 0;
      db.ref("users/" + toUserId + "/gifts").set(receiverGifts + gift.price);

      // Добавляем запись в чат (опционально)
      db.ref(`chats/${currentChatId}/messages`).push({
        sender: currentUser.email,
        text: `🎁 отправил ${gift.icon} ${gift.name} пользователю`,
        time: Date.now()
      });
    });
  });
}
