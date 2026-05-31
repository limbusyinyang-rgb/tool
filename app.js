const matrix = document.getElementById('matrix');
const ctx = matrix.getContext('2d');
const input = document.getElementById('checkInput');
const warning = document.getElementById('warning');
const agree = document.getElementById('agree');
const startBtn = document.getElementById('startBtn');
const screen1 = document.getElementById('screen1');
const screen2 = document.getElementById('screen2');
const screen3 = document.getElementById('screen3');
const logBox = document.getElementById('logBox');
const percent = document.getElementById('percent');
const bar = document.getElementById('bar');
const timerText = document.getElementById('timer');
const closeBtn = document.getElementById('closeBtn');
const ipEl = document.getElementById('ip');
const deviceEl = document.getElementById('device');
const osEl = document.getElementById('os');
const browserEl = document.getElementById('browser');
const tabButtons = document.querySelectorAll('.tab-btn');

const letters = '01ABCDEFXYZ!@#$%^&*()[]{}<>/\\';
const fontSize = 16;
let columns = [];

function resizeMatrix() {
  matrix.width = window.innerWidth;
  matrix.height = window.innerHeight;
  columns = Array(Math.floor(matrix.width / fontSize)).fill(0).map(() => Math.random() * matrix.height);
}

function drawMatrix() {
  ctx.fillStyle = 'rgba(0, 0, 0, 0.08)';
  ctx.fillRect(0, 0, matrix.width, matrix.height);
  ctx.fillStyle = 'rgba(0, 255, 150, 0.9)';
  ctx.font = `${fontSize}px Consolas, monospace`;

  columns.forEach((y, index) => {
    const text = letters.charAt(Math.floor(Math.random() * letters.length));
    const x = index * fontSize;
    ctx.fillText(text, x, y);
    columns[index] = y > matrix.height && Math.random() > 0.975 ? 0 : y + fontSize;
  });

  requestAnimationFrame(drawMatrix);
}

function setSystemInfo() {
  const ip = '14.191.212.82';
  const ua = navigator.userAgent;
  ipEl.textContent = ip;
  deviceEl.textContent = /Mobile|Android|iPhone|iPad/.test(ua) ? '📱 Mobile' : '🖥 Desktop';
  osEl.textContent = /Windows/.test(ua) ? '🪟 Windows' : /Mac/.test(ua) ? '🍎 macOS' : /Linux/.test(ua) ? '🐧 Linux' : '🌐 System';
  browserEl.textContent = /Chrome/.test(ua) ? '🌐 Chrome' : /Firefox/.test(ua) ? '🌐 Firefox' : /Safari/.test(ua) ? '🌐 Safari' : '🌐 Browser';
}

function setActiveTab(tab) {
  tabButtons.forEach(button => {
    const isActive = button.dataset.tab === tab;
    button.classList.toggle('active', isActive);
    button.setAttribute('aria-selected', isActive ? 'true' : 'false');
  });
  if (tab === 'website') {
    input.placeholder = 'Nhập URL cần kiểm tra...';
    input.type = 'url';
  } else {
    input.placeholder = 'Nhập tài khoản cần kiểm tra...';
    input.type = 'text';
  }
}

function appendLog(message) {
  const line = document.createElement('div');
  line.textContent = `> ${message}`;
  logBox.appendChild(line);
  logBox.scrollTop = logBox.scrollHeight;
}

function startFlow() {
  warning.textContent = '';
  if (!agree.checked) {
    warning.textContent = '⚠ Vui lòng tích xác nhận trước khi tiếp tục';
    return;
  }

  screen1.classList.remove('show');
  screen2.classList.add('show');
  screen3.classList.remove('show');
  logBox.innerHTML = '';
  percent.textContent = '0%';
  bar.style.width = '0%';

  const steps = [
    'Đang quét hệ thống...',
    'Kiểm tra mã ẩn...',
    'Đang xóa dấu vết IP...',
    'Cập nhật trạng thái token...',
    'Hoàn tất thao tác xóa mã ẩn.'
  ];

  let progress = 0;
  const interval = setInterval(() => {
    progress += Math.floor(Math.random() * 10) + 5;
    if (progress >= 100) progress = 100;
    percent.textContent = `${progress}%`;
    bar.style.width = `${progress}%`;
    appendLog(steps[Math.min(Math.floor(progress / 20), steps.length - 1)]);

    if (progress === 100) {
      clearInterval(interval);
      setTimeout(() => {
        screen2.classList.remove('show');
        screen3.classList.add('show');
        startCountdown();
      }, 900);
    }
  }, 850);
}

function startCountdown() {
  let count = 3;
  timerText.textContent = count;
  const tick = setInterval(() => {
    count -= 1;
    timerText.textContent = count;
    if (count === 0) {
      clearInterval(tick);
      window.location.reload();
    }
  }, 1000);
}

window.addEventListener('resize', resizeMatrix);
window.addEventListener('DOMContentLoaded', () => {
  resizeMatrix();
  drawMatrix();
  setSystemInfo();
  setActiveTab('website');
});

tabButtons.forEach(button => {
  button.addEventListener('click', () => setActiveTab(button.dataset.tab));
});

startBtn.addEventListener('click', startFlow);
closeBtn.addEventListener('click', () => window.location.reload());
