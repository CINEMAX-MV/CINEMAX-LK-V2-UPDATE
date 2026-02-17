
// ===========================
// 🪙 DEFAULT COINS (FIRST TIME)
// ===========================
if(localStorage.getItem("coins") === null){
  localStorage.setItem("coins", 2);
}

// ===========================
// 🔐 BASIC ANTI CHEAT CHECK
// ===========================
function validateCoins(){
  let coins = parseInt(localStorage.getItem("coins"));
  if(isNaN(coins) || coins < 0 || coins > 999){
    localStorage.setItem("coins", 0);
  }
}
validateCoins();


// ===========================
// 🪙 GET COINS
// ===========================
function getCoins(){
  return parseInt(localStorage.getItem("coins")) || 0;
}


// ===========================
// 💾 SET COINS
// ===========================
function setCoins(value){
  localStorage.setItem("coins", value);
  updateCoinUI();
  coinAnimation();
}


// ===========================
// ➕ ADD COINS
// ===========================
function addCoins(amount){
  let coins = getCoins();
  coins += amount;
  setCoins(coins);
}


// ===========================
// ➖ USE COIN (Premium Unlock)
// ===========================
function useCoin(){

  let coins = getCoins();

  if(coins <= 0){
    alert("❌ Coins නැත! Coins earn කරන්න.");
    return false;
  }

  // Confirm popup
  if(!confirm("🪙 1 Coin භාවිතා කරලා Movie unlock කරන්නද?")){
    return false;
  }

  coins -= 1;
  setCoins(coins);
  return true;
}


// ===========================
// 🎁 DAILY AD REWARD
// ===========================
function watchAdReward(){

  let today = new Date().toDateString();
  let lastWatch = localStorage.getItem("lastAdWatch");

  if(lastWatch === today){
    alert("✅ අද coins already claim කරලා.");
    return;
  }

  // 👉 Open Ad Page
  window.open("adpage.html","_blank");

  addCoins(2);
  localStorage.setItem("lastAdWatch", today);

  alert("🎉 Coins 2ක් ලැබුණා!");
}


// ===========================
// ⭐ COIN ANIMATION
// ===========================
function coinAnimation(){

  let box = document.getElementById("coinBox");
  if(!box) return;

  box.style.transform = "scale(1.2)";
  setTimeout(()=>{
    box.style.transform = "scale(1)";
  },300);
}


// ===========================
// 🪙 UPDATE UI
// ===========================
function updateCoinUI(){

  let box = document.getElementById("coinBox");
  if(box){
    box.innerText = "🪙 Coins: " + getCoins();
  }

}


// ===========================
// 🔒 PREMIUM MOVIE CHECK
// ===========================
function checkPremium(isPremium){

  if(!isPremium) return true;

  return useCoin();
}


// ===========================
// 🏷 PREMIUM BADGE HTML
// ===========================
function getPremiumBadge(isPremium){

  if(!isPremium) return "";

  return `
  <span style="
    background:gold;
    color:black;
    padding:4px 8px;
    border-radius:8px;
    font-size:12px;
    margin-left:8px;
    font-weight:bold;
  ">
  ⭐ PREMIUM
  </span>
  `;
}


// ===========================
// 🔄 AUTO LOAD UI
// ===========================
document.addEventListener("DOMContentLoaded", updateCoinUI);
