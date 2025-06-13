import { CONTRACT_ADDRESS, CONTRACT_ABI } from "./contractABI.js";
import { config, monadTestnet } from "./wagmi-config.js";
import { connect, disconnect, getAccount, switchChain, writeContract, readContract } from '@wagmi/core';

async function submitScoreToBlockchain(score) {
  const account = getAccount(config);
  if (!account.isConnected) {
    console.warn("🦊 Wallet not connected");
    return;
  }

  try {
    console.log("📤 Submitting score to blockchain:", score);
    console.log("🔗 Contract address:", CONTRACT_ADDRESS);
    console.log("🌐 Current chain:", account.chainId);
    
    const hash = await writeContract(config, {
      address: CONTRACT_ADDRESS,
      abi: CONTRACT_ABI,
      functionName: 'submitScore',
      args: [score],
    });
    console.log("⏳ Transaction hash:", hash);
    console.log("✅ Score submitted successfully!");
  } catch (error) {
    console.error("❌ Error submitting score to blockchain:", error);
    console.error("Error details:", error.message);
  }
}

async function fetchLeaderboardFromBlockchain(ctx, score) {
  const account = getAccount(config);
  if (!account.isConnected) {
    console.warn("🦊 Wallet not connected for leaderboard");
    return;
  }

  try {
    console.log("📊 Fetching leaderboard from blockchain...");
    console.log("🔗 Contract address:", CONTRACT_ADDRESS);
    console.log("🌐 Current chain:", account.chainId);
    
    const userAddress = account.address.toLowerCase();
    const leaderboard = await readContract(config, {
      address: CONTRACT_ADDRESS,
      abi: CONTRACT_ABI,
      functionName: 'getTopPlayers',
    });
    
    console.log("📋 Leaderboard data:", leaderboard);

    // Формуємо масив з гравцями і оцінками
    const sorted = leaderboard
      .map(entry => ({
        player: entry.player.toLowerCase(),
        score: Number(entry.score)
      }))
      .sort((a, b) => b.score - a.score)
      .slice(0, 5); // Топ 5

    // Знаходимо записи користувача в повному лідерборді
    const player = leaderboard.find(e => e.player.toLowerCase() === userAddress);

let currentPlayer = player;

if (!currentPlayer) {
  currentPlayer = {
    player: userAddress,
    score: score
  };
  sorted.push(currentPlayer);
}


    // Малюємо фон лідерборду
    ctx.fillStyle = "rgba(255,255,255,0.9)";
    ctx.fillRect(200, 150, 400, 250);
    ctx.fillStyle = "purple";
    ctx.font = "20px Arial";
    ctx.fillText("🏆 Top 5 Leaderboard", 280, 180);

    // Малюємо топ 5
    sorted.forEach((entry, i) => {
      const isUser = entry.player === userAddress;
      const label = isUser ? "You" : `${entry.player.slice(0, 6)}...${entry.player.slice(-4)}`;
      ctx.fillStyle = isUser ? "green" : "black";
      ctx.fillText(`${i + 1}. ${label}: ${entry.score}`, 220, 210 + i * 30);
    });

    // Якщо користувач НЕ в топ 5, але є в лідерборді — виводимо окремо
const isUserInTop = sorted.some(e => e.player === userAddress);
if (!isUserInTop && currentPlayer) {
  ctx.fillStyle = "blue";
  const shortAddr = `${currentPlayer.player.slice(0, 6)}...${currentPlayer.player.slice(-4)}`;
  ctx.fillText(`You: ${shortAddr}: ${Number(currentPlayer.score)}`, 220, 210 + sorted.length * 30 + 20);
}



  } catch (error) {
    console.error("❌ Не вдалося отримати лідерборд з блокчейну:", error);
  }
}




window.addEventListener("DOMContentLoaded", () => {
  const canvas = document.createElement("canvas");
  canvas.style.position = "absolute";
  canvas.style.top = 0;
  canvas.style.left = 0;
  document.body.appendChild(canvas);
  const ctx = canvas.getContext("2d");

  const connectWalletBtn = document.getElementById("connectWalletBtn");
  const startGameBtn = document.getElementById("startGameBtn");
  
  connectWalletBtn.addEventListener("click", async () => {
    try {
      console.log("🔌 Connecting wallet...");
      
      // Connect using wagmi
      const result = await connect(config, { 
        connector: config.connectors[0] // Use injected connector (MetaMask)
      });
      
      console.log("✅ Wallet connected:", result);
      console.log("🌐 Connected chain ID:", result.chainId);
      console.log("🎯 Target chain ID:", monadTestnet.id);
      
      // Switch to Monad network if needed
      if (result.chainId !== monadTestnet.id) {
        console.log("🔄 Switching to Monad Testnet...");
        try {
          await switchChain(config, { chainId: monadTestnet.id });
          console.log("✅ Switched to Monad Testnet");
        } catch (switchError) {
          console.log("⚠️ Network not found, adding Monad Testnet...");
          // Add Monad Testnet to MetaMask
          try {
                         await window.ethereum.request({
               method: 'wallet_addEthereumChain',
               params: [{
                 chainId: '0x279f', // 10143 in hex
                 chainName: 'Monad Testnet',
                 nativeCurrency: {
                   name: 'MON',
                   symbol: 'MON',
                   decimals: 18,
                 },
                 rpcUrls: ['https://testnet-rpc.monad.xyz'],
                 blockExplorerUrls: ['https://testnet.monadexplorer.com'],
               }],
             });
            console.log("✅ Monad Testnet added to MetaMask");
          } catch (addError) {
            console.error("❌ Failed to add Monad Testnet:", addError);
            throw addError;
          }
        }
      }
      
      const account = getAccount(config);
      if (account.address) {
        console.log("👛 Wallet address:", account.address);
        // Hide connect wallet button and show start game button
        connectWalletBtn.style.display = "none";
        startGameBtn.style.display = "block";
        startGameBtn.innerText = `🎮 Start Game`;
      }
    } catch (err) {
      console.error("❌ Wallet connection error:", err);
      console.error("Error details:", err.message);
      alert("Wallet connection failed. Please try again.");
    }
  });

  startGameBtn.addEventListener("click", () => {
    gameStarted = true;
    startGameBtn.style.display = "none";
    document.getElementById("gameLogo").style.display = "none";
    draw();
  });

  const GAME_WIDTH = 800;
  const GAME_HEIGHT = 600;

  function resizeCanvas() {
    const scale = Math.min(window.innerWidth / GAME_WIDTH, window.innerHeight / GAME_HEIGHT);
    canvas.width = GAME_WIDTH * scale;
    canvas.height = GAME_HEIGHT * scale;
    ctx.setTransform(scale, 0, 0, scale, 0, 0);
  }

  window.addEventListener("resize", resizeCanvas);
  resizeCanvas();

  const logo = new Image(); logo.src = "/assets/monad-logo.png";
  const gate = new Image(); gate.src = "/assets/gate.png";
  const background1 = new Image(); background1.src = "/assets/grass.png";
  const background2 = new Image(); background2.src = "/assets/background2.png";
  const background3 = new Image(); background3.src = "/assets/background3.png";

  const sheepImages = [
    { src: "/assets/sheep-small.png", type: "sheep-small" },
    { src: "/assets/sheep-big.png", type: "sheep-big" },
    { src: "/assets/horse.png", type: "horse" },
    { src: "/assets/chog.png", type: "bad" },
    { src: "/assets/molandak.png", type: "bad" },
    { src: "/assets/moyaki.png", type: "bad" }
  ];
  const goodTypes = ["sheep-small", "sheep-big", "horse"];

  const sounds = {
    correct: new Audio("/assets/correct.mp3"),
    wrong: new Audio("/assets/wrong.mp3"),
    click: new Audio("/assets/click.mp3"),
    levelup: new Audio("/assets/level-up.mp3"),
  };

  let score = 0, level = 1, lives = 3, horseCollected = 0;
  let sheepList = [], explosionEffects = [], goodExplosionEffects = [];
  let slowMotion = false, slowMotionTimeout;
  let gameStarted = false, paused = false;
  const gateY = GAME_HEIGHT - 150;
  let animationId;

  function updateLevel() {
    if (score >= 30) level = 3;
    else if (score >= 15) level = 2;
    else level = 1;
  }

  function getBackground() {
    if (level >= 3) return background3;
    if (level === 2) return background2;
    return background1;
  }

  function spawnSheep() {
    const imgData = sheepImages[Math.floor(Math.random() * sheepImages.length)];
    const img = new Image(); img.src = imgData.src;
    let baseSpeed = 2 + Math.random();
baseSpeed *= 1.2; // +20% базової швидкості
let levelBonus = 1 + (level - 1) * 0.2; // +20% за кожен новий рівень
let speed = baseSpeed * levelBonus;
    if (imgData.type === "sheep-big") speed = 1 + level * 0.5;
    if (slowMotion) speed *= 0.5;
    sheepList.push({ img, x: Math.random() * (GAME_WIDTH - 80), y: -80, speed, type: imgData.type });
  }

  setInterval(() => {
    if (gameStarted && lives > 0 && !paused) spawnSheep();
  }, Math.max(300, 2000 - level * 200));

  canvas.addEventListener("click", e => {
    if (!gameStarted || lives <= 0 || paused) return;
    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / GAME_WIDTH;
    const x = (e.clientX - rect.left) / scaleX;
    const y = (e.clientY - rect.top) / scaleX;
    let hit = false;
    sheepList.forEach((s, i) => {
      if (!hit && x >= s.x && x <= s.x + 80 && y >= s.y && y <= s.y + 80) {
        hit = true;
        processClick(s, i);
      }
    });
    if (!hit) sounds.click.play();
  });

  function processClick(s, idx) {
    if (goodTypes.includes(s.type)) {
      if (s.type === "horse") {
        score += 3; horseCollected++;
        if (horseCollected % 5 === 0) lives++;
      } else if (s.type === "sheep-small") score++;
      else if (s.type === "sheep-big") {
        score++;
        slowMotion = true;
        clearTimeout(slowMotionTimeout);
        slowMotionTimeout = setTimeout(() => slowMotion = false, 5000);
      }
      sounds.correct.play();
      if (score % 5 === 0) sounds.levelup.play();
      goodExplosionEffects.push({ x: s.x + 40, y: s.y + 40, radius: 10, alpha: 1, growthRate: 2 });
    } else {
      lives--;
      sounds.wrong.play();
      explosionEffects.push({ x: s.x + 40, y: s.y + 40, radius: 10, alpha: 1, growthRate: 2 });
    }
    sheepList.splice(idx, 1);
  }

  function drawEffects(arr, color) {
    for (let i = arr.length - 1; i >= 0; i--) {
      const ef = arr[i];
      ctx.beginPath();
      ctx.arc(ef.x, ef.y, ef.radius, 0, 2 * Math.PI);
      ctx.fillStyle = `rgba(${color},${ef.alpha})`;
      ctx.fill();
      ef.radius += ef.growthRate;
      ef.alpha -= 0.05;
      if (ef.alpha <= 0) arr.splice(i, 1);
    }
  }

  function draw() {
    if (!gameStarted || paused) return;

    updateLevel(); // 🆕 оновлення рівня перед фоном

    ctx.clearRect(0, 0, GAME_WIDTH, GAME_HEIGHT);
    ctx.drawImage(getBackground(), 0, 0, GAME_WIDTH, GAME_HEIGHT);
    ctx.drawImage(gate, GAME_WIDTH / 2 - 100, gateY, 200, 100);
    sheepList.forEach((s, i) => {
      s.y += s.speed;
      ctx.drawImage(s.img, s.x, s.y, 80, 80);
      if (s.y > gateY + 80) {
        if (goodTypes.includes(s.type)) {
          lives--; sounds.wrong.play();
        }
        sheepList.splice(i, 1);
      }
    });
    drawEffects(explosionEffects, "255,0,0");
    drawEffects(goodExplosionEffects, "0,255,0");
    ctx.fillStyle = "black"; ctx.font = "20px Arial";
    ctx.fillText(`Level: ${level}`, 100, 30);
    ctx.fillText(`Lives: ${lives}`, 100, 60);
    ctx.fillText(`Score: ${score}`, 100, 90);
    ctx.drawImage(logo, 10, 10, 60, 60);

    if (lives <= 0) {
      ctx.fillStyle = "red"; ctx.font = "40px Arial";
      ctx.fillText("GAME OVER", 250, 200);
      submitScoreToBlockchain(score);
      fetchLeaderboardFromBlockchain(ctx, score);
      document.getElementById("restartBtn").style.display = "block";
      cancelAnimationFrame(animationId);
      return;
    }

    animationId = requestAnimationFrame(draw);
  }

  const restartBtn = document.getElementById("restartBtn");

  restartBtn.addEventListener("click", () => {
    score = 0; level = 1; lives = 3; horseCollected = 0;
    sheepList = []; explosionEffects = []; goodExplosionEffects = [];
    paused = false;
    restartBtn.style.display = "none";
    gameStarted = true;
    draw();
  });

  const pauseBtn = document.createElement("button");
  pauseBtn.innerText = "⏸️ Pause";
  pauseBtn.style.cssText = "position:absolute; top:10px; right:10px; z-index:10;";
  document.body.appendChild(pauseBtn);
  pauseBtn.addEventListener("click", () => {
    paused = !paused;
    pauseBtn.innerText = paused ? "▶️ Resume" : "⏸️ Pause";
    if (!paused) draw();
  });
});


