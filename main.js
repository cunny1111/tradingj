const { app, BrowserWindow } = require('electron');
const { spawn } = require('child_process');
const path = require('path');

let mainWindow;
let nextProcess;

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1280,
    height: 720,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
    },
  });

  // Xóa thanh menu
  mainWindow.setMenu(null);

  // Load URL của Next.js server
  mainWindow.loadURL('http://localhost:3000');

  mainWindow.on('closed', () => {
    mainWindow = null;
    // Tắt Next.js server khi cửa sổ Electron đóng
    if (nextProcess) {
      nextProcess.kill();
    }
  });
}

function startNextServer() {
  // Chạy lệnh "npm run start" để khởi động Next.js server production
  // Nếu đang trong môi trường phát triển, bạn có thể thay bằng "npm run dev"
  nextProcess = spawn('npm', ['run', 'start'], { shell: true });

  nextProcess.stdout.on('data', (data) => {
    console.log(`Next.js: ${data}`);
  });

  nextProcess.stderr.on('data', (data) => {
    console.error(`Next.js Error: ${data}`);
  });

  nextProcess.on('close', (code) => {
    console.log(`Next.js process exited with code ${code}`);
  });
}

app.on('ready', () => {
  startNextServer();
  // Đợi một vài giây để Next.js server khởi động, sau đó tạo cửa sổ Electron
  setTimeout(createWindow, 5000); // Thời gian chờ có thể điều chỉnh nếu cần
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit();
});

app.on('activate', () => {
  if (mainWindow === null) createWindow();
});
