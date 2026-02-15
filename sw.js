const auth = document.getElementById("auth");
const lobby = document.getElementById("lobby");
const coins = document.getElementById("coins");
const gems = document.getElementById("gems");

function guestLogin() {
  const guestData = {
    coins: 100,
    gems: 10
  };

  // ذخیره وضعیت مهمان
  localStorage.setItem("alcapone_guest", JSON.stringify(guestData));

  // رفتن به لابی
  auth.classList.add("hidden");
  lobby.classList.remove("hidden");

  coins.innerText = "🪙 " + guestData.coins;
  gems.innerText = "💎 " + guestData.gems;
}
