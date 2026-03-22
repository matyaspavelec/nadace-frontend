const { app, BrowserWindow, shell } = require('electron');
const path = require('path');
const { spawn, execSync } = require('child_process');
const fs = require('fs');

let mainWindow;
let backendProcess;
let nextProcess;

const isDev = !app.isPackaged;

// Find node.exe - check common locations
function findNode() {
  const candidates = [
    'C:\\Program Files\\nodejs\\node.exe',
    'C:\\Program Files (x86)\\nodejs\\node.exe',
    path.join(process.env.APPDATA || '', '..', 'Local', 'Programs', 'nodejs', 'node.exe'),
  ];

  for (const p of candidates) {
    if (fs.existsSync(p)) return p;
  }

  // Try from PATH
  try {
    const result = execSync('where node', { encoding: 'utf8' }).trim().split('\n')[0];
    if (result && fs.existsSync(result.trim())) return result.trim();
  } catch {}

  return 'node'; // fallback
}

function getAppPath() {
  if (isDev) return path.join(__dirname, '..');
  return path.join(process.resourcesPath, 'app');
}

function getBackendPath() {
  if (isDev) return path.join(__dirname, '..', '..', 'nadace-backend');
  return path.join(process.resourcesPath, 'nadace-backend');
}

function startBackend(nodeExe) {
  const backendDir = getBackendPath();
  console.log('[electron] Backend dir:', backendDir);
  console.log('[electron] Node exe:', nodeExe);

  backendProcess = spawn(nodeExe, ['src/index.js'], {
    cwd: backendDir,
    env: { ...process.env, PORT: '3001' },
    stdio: 'pipe',
  });

  backendProcess.stdout.on('data', (d) => console.log('[backend]', d.toString().trim()));
  backendProcess.stderr.on('data', (d) => console.error('[backend]', d.toString().trim()));
  backendProcess.on('error', (e) => console.error('[backend] ERROR:', e.message));
}

function startNext(nodeExe) {
  const appDir = getAppPath();
  const nextBin = path.join(appDir, 'node_modules', 'next', 'dist', 'bin', 'next');
  console.log('[electron] App dir:', appDir);
  console.log('[electron] Next bin:', nextBin);

  nextProcess = spawn(nodeExe, [nextBin, 'start', '-p', '3000'], {
    cwd: appDir,
    env: { ...process.env },
    stdio: 'pipe',
  });

  nextProcess.stdout.on('data', (d) => console.log('[next]', d.toString().trim()));
  nextProcess.stderr.on('data', (d) => console.error('[next]', d.toString().trim()));
  nextProcess.on('error', (e) => console.error('[next] ERROR:', e.message));
}

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1280,
    height: 800,
    minWidth: 800,
    minHeight: 600,
    title: 'Nadace Inge a Milose Pavelcovych',
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
    },
  });

  let attempts = 0;
  const tryLoad = () => {
    attempts++;
    mainWindow.loadURL('http://localhost:3000').catch(() => {
      if (attempts < 30) {
        setTimeout(tryLoad, 1000);
      } else {
        mainWindow.loadURL(`data:text/html;charset=utf-8,<h2>Chyba: Server se nepodarilo spustit.</h2><p>Ujistete se, ze mate nainstalovany Node.js.</p>`);
      }
    });
  };

  setTimeout(tryLoad, 3000);

  mainWindow.webContents.setWindowOpenHandler(({ url }) => {
    shell.openExternal(url);
    return { action: 'deny' };
  });

  mainWindow.on('closed', () => { mainWindow = null; });
}

app.whenReady().then(() => {
  const nodeExe = findNode();
  console.log('[electron] Using node:', nodeExe);
  startBackend(nodeExe);
  startNext(nodeExe);
  createWindow();
});

app.on('window-all-closed', () => { cleanup(); app.quit(); });
app.on('before-quit', cleanup);

function cleanup() {
  if (backendProcess && !backendProcess.killed) { backendProcess.kill(); backendProcess = null; }
  if (nextProcess && !nextProcess.killed) { nextProcess.kill(); nextProcess = null; }
}
