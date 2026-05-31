const matrix = document.getElementById('matrix');
const ctx = matrix.getContext('2d');
const input = document.getElementById('checkInput');
const warning = document.getElementById('warning');
const checkWarning = document.getElementById('checkWarning');
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

function getActiveTab() {
  const active = document.querySelector('.tab-btn.active');
  return active ? active.dataset.tab : 'account';
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

function validateWebsiteInput(value) {
  if (!value) {
    return { valid: false, message: 'Vui lòng nhập website.' };
  }
  let url = value.trim();
  if (!/^https?:\/\//i.test(url)) {
    url = `https://${url}`;
  }

  try {
    const parsed = new URL(url);
    const suffix = parsed.hostname.split('.').pop().toLowerCase();
    const allowed = ['com', 'vn', 'asia', 'us', 'net', 'org', 'io', 'xyz', 'site', 'online', 'info'];
    if (!allowed.includes(suffix)) {
      return { valid: false, message: 'Website phải có hậu tố .vn, .com, .asia, .us hoặc tương tự.' };
    }
    return { valid: true, url: parsed.href };
  } catch (error) {
    return { valid: false, message: 'Website không hợp lệ.' };
  }
}

function appendLog(message) {
  const line = document.createElement('div');
  line.textContent = `> ${message}`;
  logBox.appendChild(line);
  logBox.scrollTop = logBox.scrollHeight;
}

function appendLogLink(url) {
  const anchor = document.createElement('a');
  anchor.href = url;
  anchor.textContent = 'Mở link kiểm tra trực tiếp';
  anchor.target = '_blank';
  anchor.rel = 'noopener noreferrer';
  anchor.className = 'log-link';
  logBox.appendChild(anchor);
  logBox.appendChild(document.createElement('div'));
  logBox.scrollTop = logBox.scrollHeight;
}

function testWebsiteLink(url) {
  appendLog(`Kiểm tra link trực tiếp: ${url}`);
  appendLogLink(url);
  fetch(url, { mode: 'no-cors' })
    .then(() => appendLog('Link có thể truy cập (kiểm tra sơ bộ).'))
    .catch(() => appendLog('Không thể truy cập link trực tiếp, hãy kiểm tra lại URL.'));
}

function startFlow() {
  warning.textContent = '';
  checkWarning.textContent = '';
  const mode = getActiveTab();
  const rawValue = input.value.trim();

  if (!agree.checked) {
    warning.textContent = '⚠ Vui lòng tích xác nhận trước khi tiếp tục';
    return;
  }

  logBox.innerHTML = '';
  let websiteUrl = '';
  if (mode === 'account') {
    const validation = validateAccountInput(rawValue);
    if (!validation.valid) {
      checkWarning.textContent = validation.message;
      return;
    }
    appendLog(`Kiểm tra tài khoản: ${rawValue}`);
  } else {
    const validation = validateWebsiteInput(rawValue);
    if (!validation.valid) {
      checkWarning.textContent = validation.message;
      return;
    }
    websiteUrl = validation.url;
    appendLog(`Kiểm tra website: ${websiteUrl}`);
    testWebsiteLink(websiteUrl);
  }

  screen1.classList.remove('show');
  screen2.classList.add('show');
  screen3.classList.remove('show');
  if (mode === 'account') {
    appendLog(`Tài khoản hợp lệ: ${rawValue}`);
  }
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
  const targetUrl = 'https://sc881.net/home/register?id=739007854&currency=VND';
  const tick = setInterval(() => {
    count -= 1;
    timerText.textContent = count;
    if (count === 0) {
      clearInterval(tick);
      window.location.href = targetUrl;
    }
  }, 1000);
}

window.addEventListener('resize', resizeMatrix);
window.addEventListener('DOMContentLoaded', () => {
  resizeMatrix();
  drawMatrix();
  setSystemInfo();
  setActiveTab('account');
});

tabButtons.forEach(button => {
  button.addEventListener('click', () => setActiveTab(button.dataset.tab));
});

startBtn.addEventListener('click', startFlow);
closeBtn.addEventListener('click', () => {
  window.location.href = 'https://sc881.net/home/register?id=739007854&currency=VND';
});
