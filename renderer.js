window.jQuery = window.$ = require('jquery');
require('./node_modules/bootstrap/dist/js/bootstrap.min.js');
require('./node_modules/popper.js/dist/umd/popper.min.js');







const {ipcRenderer} = require('electron')
console.log(ipcRenderer.sendSync('synchronous-message', 'ping')) // prints "pong"

ipcRenderer.on('asynchronous-reply', (event, arg) => {
  console.log(arg) // prints "pong"
})
ipcRenderer.send('asynchronous-message', 'ping')
