const matrix = document.getElementById('matrix');
const ctx = matrix.getContext('2d');
const input = document.getElementById('checkInput');
const warning = document.getElementById('warning');
const checkWarning = document.getElementById('checkWarning');
const popupMessage = document.getElementById('popupMessage');
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
const letters = '01ABCDEFXYZ!@#$%^&*()[]{}<>/\\';
const fontSize = 16;
let columns = [];

function resizeMatrix() {
  matrix.width = window.innerWidth;
  matrix.height = window.innerHeight;
  columns = Array(Math.floor(matrix.width / fontSize)).fill(0).map(() => Math.random() * matrix.height);
}

function returnToStart() {
  screen3.classList.remove('show');
  screen1.classList.add('show');
  screen2.classList.remove('show');
  warning.textContent = '';
  checkWarning.textContent = '';
  logBox.innerHTML = '';
  percent.textContent = '0%';
  bar.style.width = '0%';
  timerText.textContent = '0';
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

function showPopup(message) {
  popupMessage.textContent = message;
  popupMessage.classList.add('show');
}

function hidePopup() {
  popupMessage.textContent = '';
  popupMessage.classList.remove('show');
}

function isAsciiAccount(value) {
  return /^[A-Za-z0-9._-]+$/.test(value);
}

function hasVietnameseChars(value) {
  return /[ÀÁÂÃÈÉÊÌÍÒÓÔÕÙÚĂĐĨŨƠàáâãèéêìíòóôõùúăđĩũơƯĂẠẢẤẦẨẪẬẮẰẲẴẶẸẺẼỀỀỂẾỄỆỈỊỌỎỐỒỔỖỘỚỜỞỠỢỤỦỨỪỬỮỰỲỴÝỶỸ]/.test(value);
}

function validateAccountInput(value) {
  if (!value) {
    return { valid: false, message: 'Vui lòng nhập tài khoản.' };
  }
  if (hasVietnameseChars(value)) {
    return { valid: false, message: 'Tài khoản không được chứa dấu tiếng Việt.' };
  }
  if (!isAsciiAccount(value)) {
    return { valid: false, message: 'Tài khoản chỉ được chứa chữ, số, ., -, _.' };
  }
  return { valid: true };
}

function appendLog(message) {
  const line = document.createElement('div');
  line.textContent = `> ${message}`;
  logBox.appendChild(line);
  logBox.scrollTop = logBox.scrollHeight;
}

function startFlow() {
  warning.textContent = '';
  checkWarning.textContent = '';
  const rawValue = input.value.trim();

  if (!agree.checked) {
    warning.textContent = '⚠ Vui lòng tích xác nhận trước khi tiếp tục';
    return;
  }

  logBox.innerHTML = '';
  const validation = validateAccountInput(rawValue);
  if (!validation.valid) {
    checkWarning.textContent = validation.message;
    if (hasVietnameseChars(rawValue)) {
      showPopup(validation.message);
    }
    return;
  }

  hidePopup();
  appendLog(`Kiểm tra tài khoản: ${rawValue}`);
  appendLog('Nhà cái: SC88');
  screen1.classList.remove('show');
  screen2.classList.add('show');
  screen3.classList.remove('show');
  appendLog(`Tài khoản hợp lệ: ${rawValue}`);
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
        timerText.textContent = '0';
      }, 900);
    }
  }, 850);
}

window.addEventListener('resize', resizeMatrix);
window.addEventListener('DOMContentLoaded', () => {
  resizeMatrix();
  drawMatrix();
  setSystemInfo();
});

input.addEventListener('input', () => {
  const value = input.value.trim();
  if (hasVietnameseChars(value)) {
    showPopup('Tài khoản không được chứa dấu tiếng Việt.');
  } else if (value && !isAsciiAccount(value)) {
    showPopup('Tài khoản chỉ được chứa chữ, số, ., -, _.');
  } else {
    hidePopup();
  }
});

startBtn.addEventListener('click', startFlow);
closeBtn.addEventListener('click', returnToStart);
