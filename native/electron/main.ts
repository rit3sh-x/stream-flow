import { app, BrowserWindow, desktopCapturer, ipcMain } from 'electron';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

process.env.APP_ROOT = path.join(__dirname, '..');

export const VITE_DEV_SERVER_URL = process.env['VITE_DEV_SERVER_URL'];
export const MAIN_DIST = path.join(process.env.APP_ROOT, 'dist-electron');
export const RENDERER_DIST = path.join(process.env.APP_ROOT, 'dist');

process.env.VITE_PUBLIC = VITE_DEV_SERVER_URL
  ? path.join(process.env.APP_ROOT, 'public')
  : RENDERER_DIST;

let win: BrowserWindow | null;
let studio: BrowserWindow | null;
let floatingWebCam: BrowserWindow | null;

function createWindow() {
  const iconPath = path.join(process.env.VITE_PUBLIC, 'logo.png');
  
  win = new BrowserWindow({
    width: 600,
    height: 600,
    minHeight: 600,
    maxHeight: 600,
    minWidth: 600,
    maxWidth: 600,
    frame: false,
    hasShadow: false,
    transparent: true,
    alwaysOnTop: true,
    focusable: true,
    icon: iconPath,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      devTools: false,
      preload: path.join(__dirname, 'preload.mjs'),
    },
  });

  studio = new BrowserWindow({
    width: 400,
    height: 300,
    minHeight: 300,
    maxHeight: 300,
    minWidth: 400,
    maxWidth: 400,
    frame: false,
    transparent: true,
    alwaysOnTop: true,
    focusable: false,
    icon: iconPath,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      devTools: true,
      preload: path.join(__dirname, 'preload.mjs'),
    },
  });

  floatingWebCam = new BrowserWindow({
    width: 300,
    height: 300,
    minHeight: 100,
    maxHeight: 500,
    minWidth: 100,
    maxWidth: 500,
    resizable: true,
    frame: false,
    transparent: true,
    alwaysOnTop: true,
    roundedCorners: true,
    focusable: false,
    icon: iconPath,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      devTools: true,
      preload: path.join(__dirname, 'preload.mjs'),
    },
  });

  floatingWebCam.on('resize', () => {
    const bounds = floatingWebCam?.getBounds();
    if (bounds) {
      const size = Math.min(bounds.width, bounds.height);
      floatingWebCam?.setSize(size, size, false);
    }
  });

  floatingWebCam.on('will-resize', (_, newBounds) => {
    const size = Math.min(newBounds.width, newBounds.height);
    setTimeout(() => {
      floatingWebCam?.setBounds({
        x: newBounds.x,
        y: newBounds.y,
        width: size,
        height: size,
      });
    }, 0);
  });

  app.setAppUserModelId("com.stream.flow")

  win.setVisibleOnAllWorkspaces(true, { visibleOnFullScreen: true });
  win.setAlwaysOnTop(true, 'screen-saver', 1);
  studio.setVisibleOnAllWorkspaces(true, { visibleOnFullScreen: true });
  studio.setAlwaysOnTop(true, 'screen-saver', 1);
  floatingWebCam.setVisibleOnAllWorkspaces(true, { visibleOnFullScreen: true });
  floatingWebCam.setAlwaysOnTop(true, 'screen-saver', 1);

  win.webContents.on('did-fail-load', (_, errorCode, errorDescription, validatedURL) => {
    console.error('❌ Main window failed to load:', {
      errorCode,
      errorDescription,
      validatedURL
    });
  });

  studio.webContents.on('did-fail-load', (_, errorCode, errorDescription, validatedURL) => {
    console.error('❌ Studio window failed to load:', {
      errorCode,
      errorDescription,
      validatedURL
    });
  });

  floatingWebCam.webContents.on('did-fail-load', (_, errorCode, errorDescription, validatedURL) => {
    console.error('❌ Webcam window failed to load:', {
      errorCode,
      errorDescription,
      validatedURL
    });
  });

  win.webContents.on('did-finish-load', () => {
    win?.webContents.send('main-process-message', new Date().toLocaleString());
  });

  studio.webContents.on('did-finish-load', () => {
    studio?.webContents.send(
      'main-process-message',
      new Date().toLocaleString()
    );
  });

  floatingWebCam.webContents.on('did-finish-load', () => {
    floatingWebCam?.webContents.send(
      'main-process-message',
      new Date().toLocaleString()
    );
  });

  if (VITE_DEV_SERVER_URL) {
    const mainUrl = VITE_DEV_SERVER_URL;
    const studioUrl = `${VITE_DEV_SERVER_URL}studio.html`;
    const webcamUrl = `${VITE_DEV_SERVER_URL}webcam.html`;

    win.loadURL(mainUrl);
    studio.loadURL(studioUrl);
    floatingWebCam.loadURL(webcamUrl);
  } else {
    const mainPath = path.join(RENDERER_DIST, 'index.html');
    const studioPath = path.join(RENDERER_DIST, 'studio.html');
    const webcamPath = path.join(RENDERER_DIST, 'webcam.html');

    win.loadFile(mainPath);
    studio.loadFile(studioPath);
    floatingWebCam.loadFile(webcamPath);
  }
}

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
    win = null;
    studio = null;
    floatingWebCam = null;
  }
});

ipcMain.on('closeApp', () => {
  if (process.platform !== 'darwin') {
    app.quit();
    win = null;
    studio = null;
    floatingWebCam = null;
  }
});

ipcMain.handle('getSources', async () => {
  const data = await desktopCapturer.getSources({
    thumbnailSize: { height: 100, width: 150 },
    fetchWindowIcons: true,
    types: ['window', 'screen'],
  });
  return data;
});

ipcMain.on('media-sources', (_, payload) => {
  studio?.webContents.send('profile-received', payload);
});

ipcMain.on('hide-plugin', (_, payload) => {
  win?.webContents.send('hide-plugin', payload);
});

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});

app.whenReady().then(createWindow);