
import { app, BrowserWindow } from 'electron'
import path from 'path'
import { fileURLToPath } from 'url'
import { dirname } from 'path'
const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

function createWindow() {
    console.log('Creating window...')
    const mainWindow = new BrowserWindow({
        width: 950,
        height: 850,
        title: "Russia cubes",
        icon: '@/assets/logo.ico',
        autoHideMenuBar: true,
        webPreferences: {
            preload: path.join(__dirname, 'preload.js'),
            devTools: false,// 禁用开发者工具
            webSecurity: false
        },
        // 加载 index.html

    })
    // 加载开发服务器提供的 URL（如果使用）
    const devServerUrl = 'http://localhost:5173' // 根据你的开发服务器配置进行调整
    mainWindow
        // .loadURL(devServerUrl)//还没打包之前用url，打包之后用index
        .loadFile('./dist/index.html')
        .then(() => {
            console.log('Loaded URL:', devServerUrl)
        })
        .catch((err) => {
            console.error('Failed to load URL:', err)
        })

    // 删除或注释掉打开开发者工具的代码
    mainWindow.webContents.openDevTools();
}

app.whenReady().then(() => {
    console.log('App is ready')
    createWindow()

    app.on('activate', function () {
        if (BrowserWindow.getAllWindows().length === 0) createWindow()
    })
})

app.on('window-all-closed', function () {
    if (process.platform !== 'darwin') app.quit()
})