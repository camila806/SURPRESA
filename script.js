const canvas = document.getElementById("loveCanvas");
const ctx = canvas.getContext("2d");
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

const fontSize = 12;
const spacing = 3;
const text = "EU TE AMO";
const columns = Math.floor(canvas.width / (fontSize * spacing));
const drops = Array(columns).fill(1);

const reds = [
  "#ff4d6d", "#ff3366", "#e60039", "#cc0033",
  "#b2002b", "#ff1a3c", "#d1002f",
];

let mouseX = -1000;
let mouseY = -1000;

window.addEventListener("mousemove", e => {
  mouseX = e.clientX;
  mouseY = e.clientY;
});

function drawMatrix() {
  ctx.fillStyle = "rgba(0, 0, 0, 0.1)";
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  for (let i = 0; i < drops.length; i++) {
    ctx.fillStyle = reds[Math.floor(Math.random() * reds.length)];
    ctx.font = fontSize + "px Arial";

    let x = i * fontSize * spacing;
    let y = drops[i] * fontSize;

    let dist = Math.hypot(mouseX - x, mouseY - y);
    if (dist < 100) {
      x += (x - mouseX) / 5;
    }

    ctx.fillText(text, x, y);

    if (y > canvas.height || Math.random() > 0.975) {
      drops[i] = 0;
    }

    drops[i]++;
  }
}

let fireworks = [];

function createFirework(x, y) {
  const colors = ["#ff3366", "#ff6699", "#ffcccc", "#ff1a3c", "#ff4d6d"];
  for (let i = 0; i < 50; i++) {
    fireworks.push({
      x, y,
      radius: Math.random() * 2 + 1,
      color: colors[Math.floor(Math.random() * colors.length)],
      angle: Math.random() * 2 * Math.PI,
      speed: Math.random() * 5 + 2,
      alpha: 1
    });
  }
}

function drawFireworks() {
  for (let i = 0; i < fireworks.length; i++) {
    const f = fireworks[i];
    ctx.beginPath();
    ctx.arc(f.x, f.y, f.radius, 0, 2 * Math.PI);
    ctx.fillStyle = `rgba(${hexToRgb(f.color)},${f.alpha})`;
    ctx.fill();

    f.x += Math.cos(f.angle) * f.speed;
    f.y += Math.sin(f.angle) * f.speed;
    f.alpha -= 0.015;
  }

  fireworks = fireworks.filter(f => f.alpha > 0);
}

function hexToRgb(hex) {
  const bigint = parseInt(hex.slice(1), 16);
  const r = (bigint >> 16) & 255;
  const g = (bigint >> 8) & 255;
  const b = bigint & 255;
  return `${r},${g},${b}`;
}

function animate() {
  drawMatrix();
  drawFireworks();
}

setInterval(animate, 33);

const message = document.getElementById("valentinesMessage");

window.addEventListener("click", e => {
  if (e.shiftKey) {
    // SHIFT + clique esquerdo → mostra a mensagem
    message.style.display = "block";
    setTimeout(() => {
      message.style.display = "none";
    }, 4000);
  } else {
    // Clique comum → fogos
    createFirework(e.clientX, e.clientY);
  }
});

window.addEventListener("resize", () => {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
});
