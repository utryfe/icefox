const Window = require('window')
const window = new Window()

// SSR时，模拟浏览器环境
global.window = window
global.document = window.document
global.HTMLElement = window.HTMLElement
