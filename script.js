const statusText = document.getElementById('statusText');
const usernameInput = document.getElementById('username');
const output = document.getElementById('output');
const decryptBtn = document.getElementById('decryptBtn');
const runToolBtn = document.getElementById('runToolBtn');
const clearBtn = document.getElementById('clearBtn');

const hiddenCodes = [
  'MÃ ẨN: 4A7F-1C9B-2D3E',
  'PACKET TRACE: 127.0.0.1 -> 192.168.0.75',
  'KEY: vx_12_7b#c0d',
  'PHÁ CODES: s3cure/*hack',
  'ACCESS TOKEN: 9f8e-7d6c-5b4a'
];

const toolActions = [
  'Tool giải mã đang chạy...',
  'Đang quét firewall...',
  'Xóa dấu vết trong log...',
  'Kết nối tới mainframe...',
  'Đã phát hiện mã độc, đang cách ly...'
];

function randomItem(array) {
  return array[Math.floor(Math.random() * array.length)];
}

function appendOutput(line) {
  const timestamp = new Date().toLocaleTimeString('vi-VN');
  output.textContent += `[${timestamp}] ${line}\n`;
  output.scrollTop = output.scrollHeight;
}

decryptBtn.addEventListener('click', () => {
  const username = usernameInput.value.trim() || 'unknown_user';
  const hidden = randomItem(hiddenCodes);
  appendOutput(`Người dùng: ${username}`);
  appendOutput(`Đã xóa mã ẩn: ${hidden}`);
  appendOutput('Trạng thái: Mã ẩn được giải mã thành công.');
  statusText.textContent = 'GIẢI MÃ';
});

runToolBtn.addEventListener('click', () => {
  const action = randomItem(toolActions);
  appendOutput(action);
  statusText.textContent = 'TOOL ĐANG CHẠY';
});

clearBtn.addEventListener('click', () => {
  output.textContent = '';
  statusText.textContent = 'KẾT NỐI';
});

const matrixCanvas = document.getElementById('matrixCanvas');
const matrixCtx = matrixCanvas.getContext('2d');

function resizeMatrix() {
  matrixCanvas.width = window.innerWidth;
  matrixCanvas.height = window.innerHeight;
}

window.addEventListener('resize', resizeMatrix);

const matrixColumns = [];
const matrixLetters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789@#$%^&*()';
const matrixFontSize = 16;
const matrixColor = 'rgba(0,255,146,0.9)';

function initMatrix() {
  resizeMatrix();
  const columns = Math.floor(matrixCanvas.width / matrixFontSize);
  matrixColumns.length = 0;
  for (let i = 0; i < columns; i += 1) {
    matrixColumns[i] = Math.random() * matrixCanvas.height;
  }
}

function drawMatrix() {
  matrixCtx.fillStyle = 'rgba(0, 0, 0, 0.08)';
  matrixCtx.fillRect(0, 0, matrixCanvas.width, matrixCanvas.height);
  matrixCtx.fillStyle = matrixColor;
  matrixCtx.font = `${matrixFontSize}px Consolas, monospace`;

  for (let i = 0; i < matrixColumns.length; i += 1) {
    const text = matrixLetters.charAt(Math.floor(Math.random() * matrixLetters.length));
    matrixCtx.fillText(text, i * matrixFontSize, matrixColumns[i]);

    if (matrixColumns[i] > matrixCanvas.height && Math.random() > 0.975) {
      matrixColumns[i] = 0;
    }

    matrixColumns[i] += matrixFontSize;
  }

  requestAnimationFrame(drawMatrix);
}

initMatrix();
requestAnimationFrame(drawMatrix);

function randomStartup() {
  const messages = [
    'Khởi động giao diện hacker...',
    'Đang nạp module bảo mật...',
    'Đã kết nối đến mạng tối...',
    'Tạo đường hầm ảo...',
    'Tải cấu hình giao diện...'
  ];
  appendOutput(randomItem(messages));
}

randomStartup();
