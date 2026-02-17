// ===============================
// COINS SYSTEM FOR CINEMAX LK
// ===============================
const COINS_KEY = "cinemax_coins";
const UNLOCKED_KEY = "cinemax_unlocked";

// Initialize coins
function initCoins() {
  let coins = parseInt(localStorage.getItem(COINS_KEY));
  if (isNaN(coins)) {
    localStorage.setItem(COINS_KEY, "0");
    coins = 0;
  }
  return coins;
}

// Get unlocked movies
function getUnlockedMovies() {
  let unlocked = localStorage.getItem(UNLOCKED_KEY);
  if (!unlocked) return {};
  try {
    return JSON.parse(unlocked);
  } catch {
    return {};
  }
}

// Save unlocked movie
function unlockMovie(title) {
  const unlocked = getUnlockedMovies();
  unlocked[title] = new Date().getTime(); // store timestamp
  localStorage.setItem(UNLOCKED_KEY, JSON.stringify(unlocked));
}

// Check if movie is unlocked
function isPremiumUnlocked(title) {
  const unlocked = getUnlockedMovies();
  return unlocked[title] !== undefined;
}

// Add coins (daily limit 5)
function claimDailyCoins() {
  const lastClaim = localStorage.getItem("lastClaimDate");
  const today = new Date().toDateString();

  if (lastClaim !== today) {
    let coins = initCoins();
    coins += 5; // give 5 coins per day
    localStorage.setItem(COINS_KEY, coins);
    localStorage.setItem("lastClaimDate", today);
    alert(`✅ You received 5 free coins! Current coins: ${coins}`);
  } else {
    alert("⚠️ You have already claimed today's free coins.");
  }
}

// Spend coin
function spendCoin() {
  let coins = initCoins();
  if (coins <= 0) {
    alert("❌ You don't have enough coins. Watch ads or claim daily coins!");
    return false;
  }
  coins -= 1;
  localStorage.setItem(COINS_KEY, coins);
  return true;
}

// Get current coins
function getCoins() {
  return initCoins();
}

// ===============================
// PREMIUM DOWNLOAD HANDLER
// ===============================
function handlePremiumDownload(movie, downloadLink) {
  if (!movie.premium) {
    window.open(downloadLink.replace("/preview", "/view"), "_blank");
    return;
  }

  if (isPremiumUnlocked(movie.title)) {
    window.open(downloadLink.replace("/preview", "/view"), "_blank");
    return;
  }

  // Movie is premium & not unlocked
  const coins = getCoins();
  const confirmUnlock = confirm(
    `🎬 This is a PREMIUM movie.\nYou need 1 coin to unlock.\nYour coins: ${coins}\nDo you want to unlock it?`
  );

  if (confirmUnlock) {
    if (spendCoin()) {
      unlockMovie(movie.title);
      alert(`✅ ${movie.title} unlocked! You can now download it.`);
      window.open(downloadLink.replace("/preview", "/view"), "_blank");
    }
  }
}
